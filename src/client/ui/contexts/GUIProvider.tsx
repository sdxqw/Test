import React, { createContext, useContext, useState } from "@rbxts/react";

export type GUIType = "shop" | "inventory" | "settings" | "crafting" | "quests";

interface GUIContextType {
	activeGUI: GUIType | undefined;
	openGUI: (guiName: GUIType) => void;
	closeGUI: () => void;
	toggleGUI: (guiName: GUIType) => void;
	isGUIOpen: (guiName: GUIType) => boolean;
}

const GUIContext = createContext<GUIContextType | undefined>(undefined);

export function GUIProvider({ children }: { children: React.ReactNode }) {
	const [activeGUI, setActiveGUI] = useState<GUIType | undefined>(undefined);

	const openGUI = (guiName: GUIType) => {
		setActiveGUI(guiName);
	};

	const closeGUI = () => {
		setActiveGUI(undefined);
	};

	const toggleGUI = (guiName: GUIType) => {
		setActiveGUI((prev) => (prev === guiName ? undefined : guiName));
	};

	const isGUIOpen = (guiName: GUIType) => {
		return activeGUI === guiName;
	};

	return (
		<GUIContext.Provider
			value={{
				activeGUI,
				openGUI,
				closeGUI,
				toggleGUI,
				isGUIOpen,
			}}
		>
			{children}
		</GUIContext.Provider>
	);
}

export function useGUI() {
	const context = useContext(GUIContext);
	if (!context) {
		throw "useGUI must be used within a GUIProvider";
	}
	return context;
}
