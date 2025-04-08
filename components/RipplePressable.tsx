import React, { useCallback } from "react";
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  Vibration,
  ViewStyle,
} from "react-native";
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type RipplePressableProps = PressableProps & {
  rippleDuration?: number;
  rippleColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

// Component constants
const DEFAULT_DURATION = 500;
const DEFAULT_RIPPLE_COLOR = "#00000011";

export default function RipplePressable(props: RipplePressableProps) {
  const containerRef = useAnimatedRef<Animated.View>();

  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const tapGesture = Gesture.Tap()
    .onBegin((e) => {
      const layout = measure(containerRef);
      if (!layout) return;

      width.value = layout.width;
      height.value = layout.height;

      centerX.value = e.x;
      centerY.value = e.y;

      rippleOpacity.value = 1;
      rippleScale.value = 0;
      rippleScale.value = withTiming(1, {
        duration: props.rippleDuration ?? DEFAULT_DURATION,
      });
    })
    .onEnd(() => {
      if (props.onPress) {
        console.log("Tap detected");
        runOnJS(props.onPress)();
      }

      rippleOpacity.value = withTiming(0);
    })
    .onFinalize(() => {
      rippleOpacity.value = withTiming(0);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart((e) => {
      const layout = measure(containerRef);
      if (!layout) return;

      width.value = layout.width;
      height.value = layout.height;

      centerX.value = e.x;
      centerY.value = e.y;

      rippleOpacity.value = 1;
      rippleScale.value = 0;
      rippleScale.value = withTiming(1, {
        duration: props.rippleDuration ?? DEFAULT_DURATION,
      });

      runOnJS(Vibration.vibrate)(50, true);
    })
    .onEnd((_e, success) => {
      if (success && props.onLongPress) {
        console.log("Long press detected");
        runOnJS(props.onLongPress)();
      }

      rippleOpacity.value = withTiming(0);
    })
    .onFinalize(() => {
      rippleOpacity.value = withTiming(0);
    });

  const gesture = useCallback(() => {
    if (props.onLongPress) {
      return Gesture.Exclusive(tapGesture, longPressGesture);
    }

    return tapGesture;
  }, [props.onLongPress]);

  const rippleAnimatedStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);

    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: rippleOpacity.value,
      backgroundColor: props.rippleColor ?? DEFAULT_RIPPLE_COLOR,
      transform: [{ translateX }, { translateY }, { scale: rippleScale.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture()}>
      <Animated.View
        ref={containerRef}
        style={[props.style as StyleProp<ViewStyle>, styles.pressableStyle]}
      >
        {props.children as React.ReactElement}
        <Animated.View style={[rippleAnimatedStyle, styles.rippleStyle]} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  pressableStyle: {
    overflow: "hidden",
  },
  rippleStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "box-none",
  },
});
