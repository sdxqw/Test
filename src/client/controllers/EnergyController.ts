import { Controller, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { Events } from "client/network";

/**
 * Controller responsible for handling energy-related interactions
 * Manages player clicks and communicates with the server
 */
@Controller({})
export class EnergyController implements OnStart {
	constructor() {}

	private clickCooldown = false;
	private readonly CLICK_COOLDOWN_TIME = 0.05; // 50ms cooldown

	onStart() {
		print("EnergyController started");

		// Handle mouse clicks to generate energy
		UserInputService.InputBegan.Connect((input, gameProcessedEvent) => {
			// Only process clicks that aren't handled by the game and when not on cooldown
			if (!gameProcessedEvent && input.UserInputType === Enum.UserInputType.MouseButton1 && !this.clickCooldown) {
				// Set cooldown to prevent click spamming
				this.clickCooldown = true;

				// Fire event to server to process the click
				Events.playerClickEnergy.fire();

				// Reset cooldown after delay
				task.wait(this.CLICK_COOLDOWN_TIME);
				this.clickCooldown = false;
			}
		});

		// Request initial stats when controller starts
		Events.requestPlayerStats.fire();
	}

	/**
	 * Requests an upgrade to the player's multiplier
	 */
	public requestUpgradeMultiplier(): void {
		Events.upgradeMultiplier.fire();
	}
}
