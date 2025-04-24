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
import { ScrollView } from "react-native-gesture-handler";

type Item = {
  label: string;
  value: string;
  icon?: React.ReactElement;
};

type SelectorProps = Readonly<{
  items: Item[];
  onSelect?: (item: Item) => void;
  selected?: Item;
  animationDuration?: number;
}>;

type SelectorItemProps = Readonly<{
  item: Item;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

const DEFAULT_DURATION = 150;

function SelectorItem(props: SelectorItemProps) {
  return (
    <RipplePressable style={styles.selectionItem} onPress={props.onPress}>
      <View style={styles.iconContainer}>
        {props.item.icon &&
          React.cloneElement(props.item.icon, {
            color: "#666666",
            size: 18,
          })}
      </View>
      <Text style={styles.itemText}>{props.item.label}</Text>
    </RipplePressable>
  );
}

export default function Selector(props: SelectorProps) {
  const [selected, setSelected] = useState<Item>(
    props.selected ?? props.items[0]
  );

  const deployed = useSharedValue(false);
  const animationValue = useSharedValue(0);

  if (!selected) return null;

  const toggleItems = () => {
    deployed.value = !deployed.value;

    animationValue.value = withTiming(deployed.value ? 0 : 1, {
      duration: props.animationDuration ?? DEFAULT_DURATION,
    });
  };

  const closeItems = () => {
    if (!deployed.value) return;
    toggleItems();
  };

  const select = (index: number) => {
    const item = props.items[index];
    setSelected(item);
    closeItems();
    if (props.onSelect) props.onSelect(item);
  };

  const itemsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: 55 + (animationValue.value * 50 - 50) }],
      opacity: animationValue.value,
      pointerEvents: deployed.value ? "auto" : "none",
    };
  });

  const caretAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${animationValue.value * 180}deg` }],
    };
  });

  return (
    <OutsidePressHandler onOutsidePress={closeItems}>
      <View style={styles.selector}>
        <RipplePressable style={styles.selectedItem} onPress={toggleItems}>
          <View style={styles.iconContainer}>
            {selected.icon &&
              React.cloneElement(selected.icon, {
                color: "#666666",
                size: 18,
              })}
          </View>
          <Text style={styles.itemText}>{selected.label}</Text>
          <Animated.View style={[styles.caretContainer, caretAnimatedStyle]}>
            <FontAwesome name="caret-down" size={14} color="#666666" />
          </Animated.View>
        </RipplePressable>
        <Animated.View style={[itemsAnimatedStyle, styles.itemsContainer]}>
          <ScrollView>
            {props.items.map((item, index) => (
              <SelectorItem
                key={index}
                item={item}
                style={styles.selectionItem}
                onPress={() => select(index)}
              />
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </OutsidePressHandler>
  );
}

const styles = StyleSheet.create({
  selector: {
    position: "relative",
  },
  selectedItem: {
    paddingBlock: 12,
    paddingInline: 14,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
    gap: 8,
  },
  caretContainer: {
    marginLeft: "auto",
  },
  itemsContainer: {
    position: "absolute",
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    maxHeight: 250,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
  },
  selectionItem: {
    paddingBlock: 12,
    paddingInline: 14,
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
