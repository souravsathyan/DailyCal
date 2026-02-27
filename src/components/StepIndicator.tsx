import React, { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useUniwind } from "uniwind";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const Dot = memo(({ isActive }: { isActive: boolean }) => {
  const { theme } = useUniwind();

  // You might want to pull exact colors from the theme if desired,
  // but for interpolation, explicit hex/rgba strings are safest in Reanimated.
  const activeColor = "#3b82f6"; // Using blue-500 fallback instead of green
  const inactiveColor = "#d1d5db"; // gray-300

  const widthProgress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    widthProgress.value = withSpring(isActive ? 1 : 0, {
      damping: 15,
      stiffness: 120,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: 8 + widthProgress.value * 24, // 8px default, expands to 32px
      backgroundColor: interpolateColor(
        widthProgress.value,
        [0, 1],
        [inactiveColor, activeColor],
      ),
      opacity: 0.5 + widthProgress.value * 0.5,
    };
  });

  return (
    <Animated.View style={[{ height: 8, borderRadius: 9999 }, animatedStyle]} />
  );
});

export const StepIndicator = memo(
  ({ totalSteps, currentStep }: StepIndicatorProps) => {
    return (
      <View className="flex-row items-center justify-center gap-2 my-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <Dot key={index} isActive={index === currentStep} />
        ))}
      </View>
    );
  },
);

StepIndicator.displayName = "StepIndicator";
