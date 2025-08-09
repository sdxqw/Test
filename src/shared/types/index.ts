/**
 * Shared type definitions used across the application
 */

/**
 * Player statistics interface
 */
export interface PlayerStats {
	/** Current energy amount */
	energy: number;

	/** Current multiplier value */
	multiplier: number;

	/** Energy gained per second */
	energyPerSecond: number;
}

/**
 * Floating label data interface
 */
export interface FloatingLabelData {
	/** Unique identifier */
	id: string;

	/** X position on screen */
	x: number;

	/** Y position on screen */
	y: number;

	/** Amount to display */
	amount: number;

	/** Creation timestamp */
	timestamp: number;
}

/**
 * Upgrade types available in the game
 */
export enum UpgradeType {
	Multiplier = "multiplier",
	AutoClick = "autoClick",
	OfflineBonus = "offlineBonus",
}

/**
 * Upgrade cost calculation parameters
 */
export interface UpgradeCostParams {
	/** Base cost of the upgrade */
	baseCost: number;

	/** Current level of the upgrade */
	currentLevel: number;

	/** Cost scaling factor */
	scalingFactor: number;
}
