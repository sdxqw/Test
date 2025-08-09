import React, { useState } from "@rbxts/react";
import { usePx } from "client/ui/hooks/usePx";
import { useGUI } from "../contexts/GUIProvider";
import { UserInputService } from "@rbxts/services";
import { useMotion } from "client/ui/hooks/useMotion";
import { springs } from "client/utils/springs";

interface ActionButtonProps {
	icon: string;
	text: string;
	onClick: () => void;
	tooltip?: string;
	scale?: number;
	Position?: UDim2;
	AnchorPoint?: Vector2;
}

function ActionButton({
	icon,
	text,
	onClick,
	tooltip,
	Position,
	AnchorPoint = new Vector2(0.5, 0.5),
}: ActionButtonProps) {
	const px = usePx();
	const [isHovered, setIsHovered] = useState(false);
	const [mousePosition, setMousePosition] = useState(new Vector2(0, 0));

	// Animation for scale on hover
	const [scaleValue, scaleApi] = useMotion(1);
	// Animation for position bounce
	const [positionOffset, positionApi] = useMotion(0);

	const handleMouseEnter = () => {
		setIsHovered(true);
		updateMousePosition();
		// Start hover animations
		scaleApi.spring(1.2, springs.responsive);
		positionApi.spring(-px(15), springs.responsive);
	};

	const handleMouseMove = () => {
		if (isHovered) {
			updateMousePosition();
		}
	};

	const updateMousePosition = () => {
		const mouse = UserInputService.GetMouseLocation();
		setMousePosition(new Vector2(mouse.X, mouse.Y));
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		// Return to normal state
		scaleApi.spring(1, springs.responsive);
		positionApi.spring(0, springs.responsive);
	};

	return (
		<>
			<frame
				key={`${text}Button`}
				Size={UDim2.fromOffset(px(70), px(70))}
				Position={Position}
				AnchorPoint={AnchorPoint}
				BackgroundTransparency={1}
				Event={{
					MouseEnter: handleMouseEnter,
					MouseMoved: handleMouseMove,
					MouseLeave: handleMouseLeave,
				}}
			>
				<imagebutton
					key="ButtonIcon"
					Size={scaleValue.map((s) => UDim2.fromScale(0.9 * s, 0.9 * s))}
					Position={positionOffset.map((offset) =>
						UDim2.fromScale(0.5, 0.5).add(UDim2.fromOffset(0, offset)),
					)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Image={icon}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						MouseButton1Click: onClick,
					}}
				/>
			</frame>

			{isHovered && tooltip && (
				<frame
					key={`${text}Tooltip`}
					Size={UDim2.fromOffset(px(180), px(45))}
					Position={UDim2.fromOffset(mousePosition.X - px(10), mousePosition.Y - px(160))}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={0}
					ZIndex={100}
				>
					<uicorner CornerRadius={new UDim(0, px(3))} />
					<uistroke Color={Color3.fromRGB(38, 38, 38)} Thickness={px(3)} Transparency={0} ZIndex={101} />
					<textlabel
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						Text={tooltip}
						TextColor3={Color3.fromRGB(38, 38, 38)}
						TextScaled={true}
						Font={Enum.Font.Gotham}
						TextXAlignment={Enum.TextXAlignment.Center}
						TextYAlignment={Enum.TextYAlignment.Center}
					>
						<uipadding
							PaddingLeft={new UDim(0, px(8))}
							PaddingRight={new UDim(0, px(8))}
							PaddingTop={new UDim(0, px(4))}
							PaddingBottom={new UDim(0, px(4))}
						/>
						<uistroke Color={Color3.fromRGB(38, 38, 38)} Thickness={px(1)} Transparency={0} ZIndex={102} />
					</textlabel>
				</frame>
			)}
		</>
	);
}

export function QuickActions() {
	const { openGUI } = useGUI();
	const px = usePx();

	return (
		<frame
			key="QuickActionContainer"
			Size={UDim2.fromScale(0.15, 0.2)}
			Position={new UDim2(0, 0, 0.5, -px(50))}
			BackgroundTransparency={1}
		>
			<ActionButton
				icon="rbxassetid://110622529191445"
				text="Shop"
				onClick={() => openGUI("shop")}
				tooltip="Exclusive Shop"
				Position={UDim2.fromScale(0.3, 0.5)} // Vertically centered
				AnchorPoint={new Vector2(0.5, 0.5)}
			/>
			<ActionButton
				icon="rbxassetid://110622529191445"
				text="Button2"
				onClick={() => print("Button 2 clicked")}
				tooltip="Second Button"
				Position={UDim2.fromScale(0.7, 0.5)} // Vertically centered
				AnchorPoint={new Vector2(0.5, 0.5)}
			/>
		</frame>
	);
}
