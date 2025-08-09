import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Collection, createCollection, Document } from "@rbxts/lapis";
import { PlayerStats } from "shared/types";
import { DATA, ENERGY } from "shared/constants";

/**
 * Interface representing player data stored in the database
 * Extends PlayerStats with additional fields for persistence
 */
interface PlayerData extends PlayerStats {
	lastSaveTime: number;
}

/**
 * Service responsible for managing player data persistence
 * Handles loading, saving, and updating player data
 */
@Service({})
export class PlayerDataService implements OnStart {
	private playerCollection!: Collection<PlayerData>;
	private playerDocuments = new Map<Player, Document<PlayerData>>();
	private autoSaveInterval = DATA.AUTO_SAVE_INTERVAL;

	onStart() {
		this.playerCollection = createCollection<PlayerData>("PlayerData", {
			defaultData: {
				energy: 0,
				multiplier: 1,
				energyPerSecond: ENERGY.BASE_ENERGY_PER_SECOND,
				lastSaveTime: tick(),
			},
		});

		Players.PlayerAdded.Connect((player) => {
			this.loadPlayerData(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.savePlayerData(player);
		});

		// Auto-save every 30 seconds
		task.spawn(() => {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(this.autoSaveInterval);
				this.autoSaveAll();
			}
		});
	}

	private async loadPlayerData(player: Player): Promise<void> {
		try {
			const document = await this.playerCollection.load(`Player_${player.UserId}`);
			this.playerDocuments.set(player, document);

			// Calculate offline earnings
			const data = document.read();
			const now = tick();
			const timeDiff = now - data.lastSaveTime;
			const offlineHours = math.min(timeDiff / 3600, DATA.MAX_OFFLINE_HOURS);
			const offlineEnergy = math.floor(offlineHours * data.multiplier * DATA.OFFLINE_ENERGY_PER_HOUR);

			// Update energyPerSecond based on current multiplier
			const energyPerSecond = ENERGY.BASE_ENERGY_PER_SECOND * data.multiplier;

			if (offlineEnergy > 0) {
				document.write({
					...data,
					energy: data.energy + offlineEnergy,
					energyPerSecond: energyPerSecond,
					lastSaveTime: now,
				});
				print(`Player ${player.Name} earned ${offlineEnergy} offline energy`);
			} else {
				// Ensure energyPerSecond is always up to date
				if (data.energyPerSecond !== energyPerSecond) {
					document.write({
						...data,
						energyPerSecond: energyPerSecond,
					});
				}
			}
		} catch (err) {
			warn(`Failed to load data for ${player.Name}: ${err}`);
		}
	}

	private async savePlayerData(player: Player): Promise<void> {
		const document = this.playerDocuments.get(player);
		if (!document) return;

		try {
			const data = document.read();
			document.write({
				...data,
				lastSaveTime: tick(),
			});
			await document.save();
			document.close();
			this.playerDocuments.delete(player);
		} catch (err) {
			warn(`Failed to save data for ${player.Name}: ${err}`);
		}
	}

	private async autoSaveAll(): Promise<void> {
		for (const [player, document] of this.playerDocuments) {
			try {
				const data = document.read();
				document.write({
					...data,
					lastSaveTime: tick(),
				});
				await document.save();
			} catch (err) {
				warn(`Failed to auto-save data for ${player.Name}: ${err}`);
			}
		}
	}

	/**
	 * Gets the player's data
	 */
	public getPlayerData(player: Player): PlayerData | undefined {
		const document = this.playerDocuments.get(player);
		return document?.read();
	}

	/**
	 * Adds energy to the player's account
	 * @param player The player to add energy to
	 * @param amount The amount of energy to add
	 */
	public addEnergy(player: Player, amount: number): void {
		const document = this.playerDocuments.get(player);
		if (!document) return;

		const data = document.read();
		document.write({
			...data,
			energy: data.energy + amount,
			// Preserve the existing energyPerSecond value
			energyPerSecond: data.energyPerSecond,
		});
	}

	/**
	 * Spends energy from the player's account
	 * @param player The player to spend energy from
	 * @param amount The amount of energy to spend
	 * @returns true if successful, false if not enough energy
	 */
	public spendEnergy(player: Player, amount: number): boolean {
		const document = this.playerDocuments.get(player);
		if (!document) return false;

		const data = document.read();
		if (data.energy < amount) return false;

		document.write({
			...data,
			energy: data.energy - amount,
			// Preserve the existing energyPerSecond value
			energyPerSecond: data.energyPerSecond,
		});
		return true;
	}

	/**
	 * Increases the player's multiplier and updates energy per second
	 */
	public upgradeMultiplier(player: Player, increase: number): void {
		const document = this.playerDocuments.get(player);
		if (!document) return;

		const data = document.read();
		const newMultiplier = data.multiplier + increase;
		document.write({
			...data,
			multiplier: newMultiplier,
			energyPerSecond: ENERGY.BASE_ENERGY_PER_SECOND * newMultiplier,
		});
	}

	/**
	 * Gets the player's current energy
	 */
	public getPlayerEnergy(player: Player): number | undefined {
		return this.getPlayerData(player)?.energy;
	}

	/**
	 * Gets all player data entries
	 * @returns Array of player and their data pairs
	 */
	public getAllPlayerDataEntries(): Array<[Player, PlayerData]> {
		const entries: Array<[Player, PlayerData]> = [];
		for (const [player, document] of this.playerDocuments) {
			const data = document.read();
			if (data) {
				entries.push([player, data]);
			}
		}
		return entries;
	}
}
