import { useEventListener } from "@rbxts/pretty-react-hooks";
import { createMotion, Motion, MotionGoal } from "@rbxts/ripple";
import { Binding, useBinding, useMemo } from "@rbxts/react";
import { RunService } from "@rbxts/services";

export function useMotion(initialValue: number): LuaTuple<[Binding<number>, Motion]>;

export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]>;

export function useMotion<T extends MotionGoal>(initialValue: T) {
	const motion = useMemo(() => {
		return createMotion(initialValue);
	}, []);

	const [binding, setValue] = useBinding(initialValue);

	// eslint-disable-next-line roblox-ts/no-any
	useEventListener(RunService.Heartbeat, (delta: number) => {
		const value = motion.step(delta);

		if (value !== binding.getValue()) {
			setValue(value);
		}
	});

	return $tuple(binding, motion);
}
