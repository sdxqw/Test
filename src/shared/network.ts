import { Networking } from "@flamework/networking";
import { PlayerStats, UpgradeType } from "./types";

interface ClientToServerEvents {
	playerClickEnergy: () => void;
	requestPlayerStats: () => void;
	upgradeMultiplier: () => void;
}

interface ServerToClientEvents {
	updatePlayerStats: (stats: PlayerStats) => void;
	upgradeResult: (success: boolean, newCost?: number) => void;
}

interface ClientToServerFunctions {
	getUpgradeCost: (upgradeType: UpgradeType) => number;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
