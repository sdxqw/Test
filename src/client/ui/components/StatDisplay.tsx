import React, { useEffect, useMemo } from "@rbxts/react";
import { useScaler } from "@rbxts/ui-scaler";

import { useMotion } from "client/ui/hooks/useMotion";
import { springs } from "client/utils/springs";

interface StatDisplayProps {
	iconImage: string;
	value: number | string;
	amount?: number;
	scale: number;
}

export function StatDisplay({ iconImage, value, amount, scale }: StatDisplayProps) {
	const scaleApi = useScaler(new Vector2(1280, 720));
	const px = scaleApi.px;

	// Animation for PlusText
	const [animationScale, scaleApiMotion] = useMotion(1);

	useEffect(() => {
		if (amount !== undefined) {
			scaleApiMotion.set(1.5); // start bigger
			scaleApiMotion.spring(0.7, springs.responsive); // return to normal size
		}
	}, [amount]);

	const valueStr = tostring(value);

	const lastDigitX = useMemo(() => {
		const avgDigitWidth = px(30 * scale) * 0.8; // TextSize * scale * proportion of width
		const baseX = px(65 * scale);
		return baseX + avgDigitWidth * valueStr.size();
	}, [valueStr, px, scale]);

	return (
		<frame
			Size={new UDim2(0, px(200 * scale), 0, px(60 * scale))}
			Position={new UDim2(0, px(20 * scale), 1, -px(80 * scale))}
			BackgroundTransparency={1}
		>
			{/* Icon */}
			<frame
				Size={new UDim2(0, px(50 * scale), 0, px(50 * scale))}
				Position={new UDim2(0, px(5 * scale), 0.5, 0)}
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 200, 50)}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(0, px(8 * scale))} />
				<uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={px(4 * scale)} />
				<imagelabel
					Size={new UDim2(0.8, 0, 0.8, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Image={iconImage}
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
				/>
			</frame>

			{/* Value */}
			<textlabel
				Size={new UDim2(0, px(115 * scale), 0, px(40 * scale))}
				Position={new UDim2(0, px(65 * scale), 0.5, 0)}
				AnchorPoint={new Vector2(0, 0.5)}
				Text={valueStr}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				Font={Enum.Font.FredokaOne}
				TextSize={px(40 * scale)}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={px(3 * scale)} />
			</textlabel>

			{/* Plus text above last digit */}
			{amount !== undefined && (
				<textlabel
					Size={animationScale.map((s) => new UDim2(0, px(50 * scale) * s, 0, px(40 * scale) * s))}
					Position={animationScale.map(() => new UDim2(0, lastDigitX, 0, px(20 * scale)))}
					AnchorPoint={new Vector2(0.5, 1)}
					Text={`+${amount}`}
					TextColor3={Color3.fromRGB(255, 255, 0)}
					BackgroundTransparency={1}
					Font={Enum.Font.FredokaOne}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Right}
					TextStrokeTransparency={0}
					TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
					ZIndex={10}
				/>
			)}
		</frame>
	);
}
