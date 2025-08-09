import React, { useEffect, useState } from "@rbxts/react";
import { Events } from "client/network";
import { StatDisplay } from "client/ui/components/StatDisplay";
import { Layer } from "client/ui/components/Layer";
import { IS_PLUGIN } from "shared/constants";

import { QuickActions } from "../components/QuickActions";
import { useScaler } from "@rbxts/ui-scaler";

export function HUD() {
	const [energy, setEnergy] = useState(IS_PLUGIN ? 80 : 0);
	const [plusText, setPlusText] = useState<number | undefined>(IS_PLUGIN ? 5 : undefined);
	const scaleApi = useScaler(new Vector2(1920, 1080));
	const px = scaleApi.px;

	useEffect(() => {
		if (!IS_PLUGIN) {
			const connection = Events.updatePlayerStats.connect((playerStats) => {
				setEnergy((prevEnergy) => {
					const newEnergy = playerStats.energy;
					const increase = newEnergy - prevEnergy;
					if (increase > 0) {
						setPlusText(increase);
						Promise.delay(0.8).then(() => setPlusText(undefined));
					}
					return newEnergy;
				});
			});
			return () => connection.Disconnect();
		}
	}, []);

	return (
		<Layer displayOrder={1}>
			{/* Stats Display */}
			<frame
				key="StatsContainer"
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromOffset(px(20), px(20))}
				BackgroundTransparency={1}
			>
				<frame
					key="StatsInner"
					Size={UDim2.fromOffset(px(80), px(80))}
					Position={new UDim2(0, 0, 1, -px(120))}
					BackgroundTransparency={1}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, px(10))}
					/>
					<StatDisplay iconImage="rbxassetid://93821002131937" value={energy} amount={plusText} scale={0.6} />
					<StatDisplay iconImage="rbxassetid://93821002131937" value={energy} amount={plusText} scale={0.6} />
				</frame>
			</frame>
			{/* Quick Actions */}
			<QuickActions />
		</Layer>
	);
}
