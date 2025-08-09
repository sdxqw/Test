import { Service, OnStart, Dependency, OnTick } from "@flamework/core";
import { PlayerDataService } from "./PlayerDataService";
import { Players } from "@rbxts/services";
import { PlayerStats, UpgradeType } from "shared/types";
import { ENERGY, UPGRADES } from "shared/constants";
import { Events, Functions } from "server/network";

/**
 * Service responsible for managing player energy
 * Handles energy generation, upgrades, and stat updates
 */
@Service({})
export class EnergyService implements OnStart, OnTick {
	private dataService = Dependency<PlayerDataService>();
	private playerCooldowns = new Map<Player, boolean>();
	private energyAccumulator = 0;

	onStart() {
		// Handle player clicks to generate energy
		Events.playerClickEnergy.connect((player: Player) => {
			if (this.playerCooldowns.get(player)) {
				// Player is still on cooldown, ignore click
				return;
			}

			const playerData = this.dataService.getPlayerData(player);
			if (!playerData) return;

			// Set player cooldown to true
			this.playerCooldowns.set(player, true);

			// Calculate energy gain based on multiplier
			const energyGain = math.max(1, math.floor(playerData.multiplier));
			this.dataService.addEnergy(player, energyGain);

			// Update player stats
			this.sendPlayerStats(player);
			print(`EnergyService: Player ${player.Name} gained ${energyGain} energy`);

			// Reset cooldown after delay
			task.wait(ENERGY.CLICK_COOLDOWN_TIME);
			this.playerCooldowns.set(player, false);
		});

		// Handle requests for player stats
		Events.requestPlayerStats.connect((player: Player) => {
			this.sendPlayerStats(player);
		});

		// Handle multiplier upgrade requests
		Events.upgradeMultiplier.connect((player: Player) => {
			const cost = this.calculateUpgradeCost(player, UpgradeType.Multiplier);
			const success = this.upgradeMultiplier(player, cost);

			// Notify client of the result
			const newCost = success ? this.calculateUpgradeCost(player, UpgradeType.Multiplier) : undefined;
			Events.upgradeResult.fire(player, success, newCost);
		});

		// Register function to get upgrade cost
		Functions.getUpgradeCost.setCallback((player: Player, upgradeType: UpgradeType) => {
			return this.calculateUpgradeCost(player, upgradeType || UpgradeType.Multiplier);
		});

		// Send initial stats to new players
		Players.PlayerAdded.Connect((player) => {
			task.wait(1); // Wait for data to load
			this.sendPlayerStats(player);
		});
	}

	/**
	 * Called every frame to handle passive energy generation
	 */
	onTick(dt: number) {
		// Accumulate time until we reach the tick rate
		this.energyAccumulator += dt;

		if (this.energyAccumulator >= ENERGY.ENERGY_TICK_RATE) {
			this.energyAccumulator -= ENERGY.ENERGY_TICK_RATE;

			// Process passive energy generation for all players
			for (const player of Players.GetPlayers()) {
				const playerData = this.dataService.getPlayerData(player);
				if (!playerData) continue;

				// Calculate passive energy based on multiplier
				const passiveEnergy = ENERGY.BASE_ENERGY_PER_SECOND * playerData.multiplier;
				this.dataService.addEnergy(player, passiveEnergy);
				this.sendPlayerStats(player);
			}
		}
	}

	/**
	 * Sends updated player stats to the client
	 */
	private sendPlayerStats(player: Player): void {
		const playerData = this.dataService.getPlayerData(player);
		if (!playerData) return;

		const stats: PlayerStats = {
			energy: playerData.energy,
			multiplier: playerData.multiplier,
			energyPerSecond: ENERGY.BASE_ENERGY_PER_SECOND * playerData.multiplier,
		};

		Events.updatePlayerStats.fire(player, stats);
	}

	/**
	 * Upgrades the player's multiplier if they have enough energy
	 */
	public upgradeMultiplier(player: Player, cost: number): boolean {
		const playerData = this.dataService.getPlayerData(player);
		if (!playerData || playerData.energy < cost) return false;

		this.dataService.spendEnergy(player, cost);
		this.dataService.upgradeMultiplier(player, UPGRADES.MULTIPLIER_INCREASE_AMOUNT);
		this.sendPlayerStats(player);
		return true;
	}

	/**
	 * Calculates the cost of the next upgrade
	 */
	private calculateUpgradeCost(player: Player, upgradeType: UpgradeType): number {
		const playerData = this.dataService.getPlayerData(player);
		if (!playerData) return 0;

		switch (upgradeType) {
			case UpgradeType.Multiplier:
				// Calculate cost based on current multiplier level
				// eslint-disable-next-line no-case-declarations
				const level = math.floor((playerData.multiplier - 1) / UPGRADES.MULTIPLIER_INCREASE_AMOUNT) + 1;
				return math.floor(
					UPGRADES.MULTIPLIER_BASE_COST * math.pow(UPGRADES.MULTIPLIER_COST_SCALING, level - 1),
				);
			default:
				return 0;
		}
	}
}
