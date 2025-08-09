import { RunService } from "@rbxts/services";
/**
 * Game constants used across the application
 */

/**
 * Energy-related constants
 */
export const ENERGY = {
	/** Base energy gained per second */
	BASE_ENERGY_PER_SECOND: 1,

	/** How often energy is added (in seconds) */
	ENERGY_TICK_RATE: 1,

	/** Cooldown between clicks (in seconds) */
	CLICK_COOLDOWN_TIME: 0.5,
};

/**
 * UI-related constants
 */
export const UI = {
	/** How long floating labels stay visible (in seconds) */
	FLOATING_LABEL_DURATION: 2.5,

	/** Base resolution for UI scaling */
	BASE_RESOLUTION: new Vector2(1280, 832),

	/** Minimum UI scale factor */
	MIN_SCALE: 0.75,

	/** Dominant axis weight for UI scaling */
	DOMINANT_AXIS: 0.5,
};

/**
 * Upgrade-related constants
 */
export const UPGRADES = {
	/** Base cost for multiplier upgrade */
	MULTIPLIER_BASE_COST: 10,

	/** Cost scaling factor for multiplier upgrade */
	MULTIPLIER_COST_SCALING: 1.5,

	/** Amount multiplier increases per upgrade */
	MULTIPLIER_INCREASE_AMOUNT: 0.5,
};

/**
 * Data persistence constants
 */
export const DATA = {
	/** How often player data is auto-saved (in seconds) */
	AUTO_SAVE_INTERVAL: 30,

	/** Maximum offline time that earns rewards (in hours) */
	MAX_OFFLINE_HOURS: 24,

	/** Offline energy gain per hour per multiplier */
	OFFLINE_ENERGY_PER_HOUR: 10,
};

export const IS_PLUGIN = RunService.IsStudio() && !RunService.IsRunning();
