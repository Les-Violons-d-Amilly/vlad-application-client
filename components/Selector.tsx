import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import RipplePressable from "./RipplePressable";
import React, { useCallback, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import OutsidePressHandler from "react-native-outside-press";

type Item = {
  label: string;
  value: string;
  icon?: React.ReactElement;
};

type SelectorProps = {
  items: Item[];
  onSelect?: (item: Item) => void;
  selected?: Item;
  animationDuration?: number;
};

type SelectorItemProps = {
  item: Item;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_DURATION = 150;

function SelectorItem(props: SelectorItemProps) {
  const icon = useCallback(() => {
    if (!props.item.icon) return null;

    return React.cloneElement(props.item.icon, {
      color: "#666666",
      size: 18,
    });
  }, [props.item.icon]);

  return (
    <RipplePressable style={styles.selectionItem} onPress={props.onPress}>
      <View style={styles.iconContainer}>{icon()}</View>
      <Text style={styles.itemText}>{props.item.label}</Text>
    </RipplePressable>
  );
}

export default function Selector(props: SelectorProps) {
  const [selected, setSelected] = useState<Item>(props.items[0]);

  const deployed = useSharedValue(false);
  const itemsY = useSharedValue(-20);
  const itemsOpacity = useSharedValue(0);
  const itemPointerEvents = useSharedValue<"none" | "auto">("none");
  const caretRotation = useSharedValue(0);

  if (!selected) return null;

  const selectedIcon = useCallback(() => {
    if (!selected.icon) return null;

    return React.cloneElement(selected.icon, {
      color: "#666666",
      size: 18,
    });
  }, [selected.icon]);

  const toggleItems = () => {
    deployed.value = !deployed.value;

    itemsY.value = withTiming(deployed.value ? -20 : 0, {
      duration: props.animationDuration ?? DEFAULT_DURATION,
    });

    itemsOpacity.value = withTiming(deployed.value ? 0 : 1, {
      duration: props.animationDuration ?? DEFAULT_DURATION,
    });

    caretRotation.value = withTiming(deployed.value ? 0 : 180, {
      duration: props.animationDuration ?? DEFAULT_DURATION,
    });

    itemPointerEvents.value = deployed.value ? "none" : "auto";
  };

  const closeItems = () => {
    if (!deployed.value) return;
    toggleItems();
  };

  const select = (index: number) => {
    console.log("Selected item:", index);
    const item = props.items[index];
    setSelected(item);
    closeItems();
  };

  const itemsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: 50 + itemsY.value }],
      opacity: itemsOpacity.value,
      pointerEvents: itemPointerEvents.value,
    };
  });

  const caretAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${caretRotation.value}deg` }],
    };
  });

  return (
    <OutsidePressHandler onOutsidePress={closeItems}>
      <View style={styles.selector}>
        <RipplePressable style={styles.selectedItem} onPress={toggleItems}>
          <View style={styles.iconContainer}>{selectedIcon()}</View>
          <Text style={styles.itemText}>{selected.label}</Text>
          <Animated.View style={[styles.caretContainer, caretAnimatedStyle]}>
            <FontAwesome name="caret-down" size={14} color="#666666" />
          </Animated.View>
        </RipplePressable>
        <Animated.ScrollView
          style={[styles.itemsContainer, itemsAnimatedStyle]}
        >
          {props.items.map((item, index) => (
            <SelectorItem
              key={index}
              item={item}
              style={styles.selectionItem}
              onPress={() => select(index)}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </OutsidePressHandler>
  );
}

const styles = StyleSheet.create({
  selector: {
    position: "relative",
  },
  selectedItem: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  caretContainer: {
    marginLeft: "auto",
  },
  itemsContainer: {
    position: "absolute",
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  selectionItem: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemText: {
    fontSize: 15,
    color: "#333333",
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
