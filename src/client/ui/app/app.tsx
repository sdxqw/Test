import React from "@rbxts/react";

import { GUIProvider, useGUI } from "../contexts/GUIProvider";
import { HUD } from "./hud";

function AppContent() {
	const { activeGUI } = useGUI();

	return (
		<>
			<HUD />
		</>
	);
}

export function App() {
	return (
		<GUIProvider>
			<AppContent />
		</GUIProvider>
	);
}
