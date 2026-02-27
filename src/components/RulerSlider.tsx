import React, { memo, useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Text, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

interface RulerSliderProps {
  min: number;
  max: number;
  initialValue: number;
  step?: number;
  unit: string;
  onValueChange: (value: number) => void;
  title?: string;
  description?: string;
  isVertical?: boolean;
}

const MARKER_SPACING = 10;
const INDICATOR_WIDTH = 2;

export const RulerSlider = memo(
  ({
    min,
    max,
    initialValue,
    step = 1,
    unit,
    onValueChange,
    title,
    description,
    isVertical = false,
  }: RulerSliderProps) => {
    const [currentValue, setCurrentValue] = useState(initialValue);
    const [containerSize, setContainerSize] = useState(200);

    const range = max - min;
    const numMarkers = Math.floor(range / step);
    const scrollHalfSize = containerSize / 2;

    const initialOffset = Math.max(
      0,
      ((initialValue - min) / step) * MARKER_SPACING,
    );

    const lastValue = useSharedValue(initialValue);

    const handleScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        const offset = isVertical
          ? event.contentOffset.y
          : event.contentOffset.x;

        if (offset < -100 || offset > numMarkers * MARKER_SPACING + 100) return;

        const calculatedValue =
          Math.round(offset / MARKER_SPACING) * step + min;
        const boundedValue = Math.min(Math.max(calculatedValue, min), max);

        if (lastValue.value !== boundedValue) {
          lastValue.value = boundedValue;
          runOnJS(setCurrentValue)(boundedValue);
          if (onValueChange) {
            runOnJS(onValueChange)(boundedValue);
          }
        }
      },
    });

    const handleLayout = useCallback(
      (e: LayoutChangeEvent) => {
        setContainerSize(
          isVertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width,
        );
      },
      [isVertical],
    );

    const markers = useMemo(() => {
      return Array.from({ length: numMarkers + 1 }).map((_, i) => {
        const isMajor = i % 10 === 0;
        const isMedium = i % 5 === 0 && !isMajor;
        const value = min + i * step;

        return (
          <View
            key={i}
            style={[
              isVertical
                ? {
                    height: MARKER_SPACING,
                    flexDirection: "row",
                    alignItems: "center",
                  }
                : {
                    width: MARKER_SPACING,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 20,
                  },
              styles.markerContainer,
            ]}
          >
            {isVertical ? (
              <>
                <View
                  style={[
                    styles.markerHorizontal,
                    isMajor
                      ? styles.markerMajorHorizontal
                      : isMedium
                        ? styles.markerMediumHorizontal
                        : styles.markerMinorHorizontal,
                  ]}
                />
                {isMajor && (
                  <Text style={[styles.markerText, { left: 45, top: -10 }]}>
                    {value}
                  </Text>
                )}
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.marker,
                    isMajor
                      ? styles.markerMajor
                      : isMedium
                        ? styles.markerMedium
                        : styles.markerMinor,
                  ]}
                />
                {isMajor && <Text style={styles.markerText}>{value}</Text>}
              </>
            )}
          </View>
        );
      });
    }, [min, numMarkers, step, isVertical]);

    return (
      <View
        style={[
          styles.container,
          isVertical && { flex: 1, flexDirection: "row" },
        ]}
      >
        {!isVertical && (title || description) && (
          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
        )}

        {/* Value Display */}
        {!isVertical && (
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>
              {currentValue} <Text style={styles.unitText}>{unit}</Text>
            </Text>
          </View>
        )}

        <View
          style={[
            styles.rulerContainer,
            isVertical && { width: 100, height: "100%", flexDirection: "row" },
          ]}
          onLayout={handleLayout}
        >
          {/* Main Indicator Line */}
          <View
            style={[
              isVertical ? styles.indicatorVertical : styles.indicator,
              isVertical && { top: containerSize / 2 - INDICATOR_WIDTH / 2 },
            ]}
          />

          {/* Indicator Dot */}
          <View
            style={[
              isVertical ? styles.indicatorDotVertical : styles.indicatorDot,
              isVertical && { top: containerSize / 2 - 6 },
            ]}
          />

          <Animated.ScrollView
            horizontal={!isVertical}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            snapToInterval={MARKER_SPACING}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={
              isVertical
                ? { paddingVertical: scrollHalfSize }
                : { paddingHorizontal: scrollHalfSize }
            }
            contentOffset={
              isVertical
                ? { x: 0, y: initialOffset }
                : { x: initialOffset, y: 0 }
            }
          >
            {markers}
          </Animated.ScrollView>
        </View>
      </View>
    );
  },
);

RulerSlider.displayName = "RulerSlider";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: "#000",
    marginBottom: 8,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  valueContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  valueText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 48,
    color: "#000",
  },
  unitText: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: "#666",
  },
  rulerContainer: {
    height: 120,
    width: "100%",
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden",
  },
  // Horizontal Styles
  indicator: {
    position: "absolute",
    left: "50%",
    marginLeft: -INDICATOR_WIDTH / 2,
    bottom: 20,
    width: INDICATOR_WIDTH,
    height: 80,
    backgroundColor: "#3b82f6", // blue-500
    zIndex: 10,
  },
  indicatorDot: {
    position: "absolute",
    left: "50%",
    marginLeft: -6,
    bottom: 94,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3b82f6",
    zIndex: 10,
  },
  // Vertical Styles
  indicatorVertical: {
    position: "absolute",
    left: 0,
    height: INDICATOR_WIDTH,
    width: 80,
    backgroundColor: "#3b82f6", // blue-500
    zIndex: 10,
  },
  indicatorDotVertical: {
    position: "absolute",
    left: 74, // 80 - 6
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3b82f6",
    zIndex: 10,
  },
  markerContainer: {
    justifyContent: "flex-end",
  },
  marker: {
    width: 1,
    backgroundColor: "#ccc",
  },
  // Horizontal Markers
  markerMajor: { height: 48, width: 2, backgroundColor: "#999" },
  markerMedium: { height: 32 },
  markerMinor: { height: 24 },

  // Vertical Markers
  markerHorizontal: { height: 1, backgroundColor: "#ccc" },
  markerMajorHorizontal: { width: 48, height: 2, backgroundColor: "#999" },
  markerMediumHorizontal: { width: 32 },
  markerMinorHorizontal: { width: 24 },

  markerText: {
    position: "absolute",
    bottom: -4,
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#6b7280",
  },
});
