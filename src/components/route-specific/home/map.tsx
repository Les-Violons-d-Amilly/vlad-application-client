import Levels, {
  Category,
  Course,
  Level,
  LevelCategoryName,
  Step,
} from "@/src/constants/Levels";
import { darken, lighten } from "@/src/utils/colors";
import React, { useCallback, memo, useRef, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  Text,
  GestureResponderEvent,
} from "react-native";
import Svg, {
  Defs,
  G,
  Path,
  Pattern,
  Polygon,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import LevelModal from "./levelModal";
import { Note } from "./note";
import RipplePressable from "../../global/RipplePressable";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { PageProps } from "@/src/routes";

const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 120;
const CELL_SIZE = 75;

type LevelItemProps = Readonly<{
  index: number;
  color: string;
  current: Step;
  next: Step | null;
  selectLevel: (level: Step | null) => void;
}>;

type LevelCategoryButtonProps = Readonly<{
  category: Category;
  selected: boolean;
  onPress: () => void;
}>;

type LevelLinkProps = Readonly<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  done?: boolean;
  color: string;
}>;

type BackgroundProps = Readonly<{
  color: string;
}>;

function LevelLink(props: LevelLinkProps) {
  const radiusY = 20;
  const radiusX = props.x2 > props.x1 ? -radiusY : radiusY;

  return (
    <React.Fragment>
      <Path
        d={`M${props.x1},${props.y1} L${props.x2 + radiusX},${props.y1} Q${
          props.x2
        },${props.y1} ${props.x2},${props.y1 + radiusY} L${props.x2},${
          props.y2
        }`}
        fill="none"
        stroke="#202021"
        strokeWidth={16}
        strokeLinecap="round"
      />
      <Path
        d={`M${props.x1},${props.y1 - 2} L${props.x2 + radiusX},${
          props.y1 - 2
        } Q${props.x2},${props.y1 - 2} ${props.x2},${props.y1 - 2 + radiusY} L${
          props.x2
        },${props.y2 - 2}`}
        fill="none"
        stroke={props.done ? props.color : "#6e6e73"}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </React.Fragment>
  );
}

function LevelItem(props: LevelItemProps) {
  const innerColor =
    props.current instanceof Level && props.current.stars === 0
      ? "#6e6e73"
      : props.color;

  async function onPress(e: GestureResponderEvent) {
    if (
      e.nativeEvent.locationX < props.current.x - CELL_SIZE / 2 ||
      e.nativeEvent.locationX > props.current.x + CELL_SIZE / 2 ||
      e.nativeEvent.locationY < 0 ||
      e.nativeEvent.locationY > CELL_SIZE
    )
      return;

    props.selectLevel(props.current);
  }

  return (
    <Svg
      height={ITEM_HEIGHT}
      width={width}
      onPress={onPress}
      style={styles.item}
    >
      {!!props.next && (
        <LevelLink
          x1={props.current.x}
          y1={CELL_SIZE / 2}
          x2={props.next.x}
          y2={ITEM_HEIGHT}
          done={props.next instanceof Level && props.next.stars > 0}
          color={props.color}
        />
      )}
      <Rect
        x={props.current.x - CELL_SIZE / 2}
        y={0}
        width={CELL_SIZE}
        height={CELL_SIZE}
        rx={18}
        fill="#202021"
      />
      <Rect
        x={props.current.x + 7.5 - CELL_SIZE / 2}
        y={4}
        width={60}
        height={60}
        rx={8}
        fill={innerColor}
      />
      <SvgText
        x={props.current.x + 37.5 - CELL_SIZE / 2}
        y={props.current instanceof Level ? 30 : 37}
        fill={props.current instanceof Level ? "#ffffffdf" : "#ffffffee"}
        fontSize={props.current instanceof Level ? 28 : 24}
        fontWeight="bold"
        textAnchor="middle"
      >
        {props.current.number}
      </SvgText>
      {props.current instanceof Level &&
        Array.from({ length: 3 }, (_, i) => {
          return (
            <Note
              key={i}
              x={props.current.x - 23 + i * 17}
              y={38}
              size={4}
              color={
                i < (props.current as Level).stars
                  ? "#f5ce62"
                  : darken(innerColor, 15)
              }
            />
          );
        })}
      {props.current instanceof Course && (
        <G x={props.current.x - 24} y={10} scale={2}>
          <Path
            fill="#ffffff88"
            d="M 20.421875 8.433594 C 20.421875 3.636719 16.390625 -0.242188 11.542969 0.0117188 C 7.152344 0.265625 3.679688 3.890625 3.578125 8.28125 C 3.578125 10.476562 4.390625 12.515625 5.824219 14.101562 C 8.164062 16.605469 7.863281 19.511719 7.863281 19.511719 C 7.863281 20.070312 8.324219 20.53125 8.886719 20.53125 L 15.109375 20.53125 C 15.667969 20.53125 16.128906 20.070312 16.179688 19.511719 C 16.179688 19.511719 15.835938 16.679688 18.171875 14.15625 C 19.605469 12.621094 20.421875 10.578125 20.421875 8.433594 Z M 14.144531 18.539062 L 9.855469 18.539062 C 9.753906 16.445312 8.835938 14.40625 7.355469 12.824219 C 6.230469 11.597656 5.671875 10.019531 5.671875 8.386719 C 5.722656 5.015625 8.324219 2.261719 11.695312 2.058594 C 15.371094 1.851562 18.429688 4.8125 18.429688 8.433594 C 18.429688 10.019531 17.816406 11.597656 16.695312 12.769531 C 15.164062 14.40625 14.246094 16.445312 14.144531 18.539062 Z M 14.144531 18.539062"
          />
          <Path
            fill="#ffffff88"
            d="M 13.785156 21.960938 L 10.160156 21.960938 C 9.601562 21.960938 9.140625 22.421875 9.140625 22.980469 C 9.140625 23.539062 9.601562 24 10.160156 24 L 13.785156 24 C 14.34375 24 14.804688 23.539062 14.804688 22.980469 C 14.804688 22.421875 14.351562 21.960938 13.785156 21.960938 Z M 13.785156 21.960938"
          />
        </G>
      )}
    </Svg>
  );
}

function LevelCategoryButton(props: LevelCategoryButtonProps) {
  const ref = useRef<View>(null);
  const y = useSharedValue(8);

  const [buttonPosition, setButtonPosition] = useState({
    width: 0,
    height: 0,
  });

  const positionAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }],
    };
  });

  useEffect(() => {
    ref.current?.measure((_x, _y, width, height) => {
      setButtonPosition({ width, height });
    });
  }, []);

  useEffect(() => {
    y.value = withTiming(props.selected ? 4 : 12, { duration: 200 });
  }, [props.selected]);

  return (
    <RipplePressable
      style={[styles.categoryButton, positionAnimatedStyle]}
      rippleColor="#ffffff55"
      onPress={props.onPress}
    >
      <Svg
        width={buttonPosition.width}
        height={buttonPosition.height}
        viewBox={`0 0 ${buttonPosition.width} ${buttonPosition.height}`}
        style={styles.categoryButtonBackground}
      >
        <Defs>
          <Pattern
            id="pattern"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
          >
            <Rect
              fill={darken(props.category.color, 10)}
              width="20"
              height="20"
            />
            <Polygon
              fill={darken(props.category.color, 15)}
              points="20 10 10 0 0 0 20 20"
            />
            <Polygon
              fill={darken(props.category.color, 15)}
              points="0 10 0 20 10 20"
            />
          </Pattern>
        </Defs>
        <Rect
          width={buttonPosition.width}
          height={buttonPosition.height}
          fill="url(#pattern)"
        />
      </Svg>
      <View ref={ref} style={styles.categoryButtonWrapper}>
        <Text style={styles.categoryButtonText}>{props.category.name}</Text>
      </View>
    </RipplePressable>
  );
}

const Background = memo((props: BackgroundProps) => (
  <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <Defs>
      <Pattern
        id="pattern"
        patternUnits="userSpaceOnUse"
        width={120}
        height={120}
      >
        <Rect fill={lighten(props.color, 60)} width={120} height={120} />
        <Polygon
          fill={lighten(props.color, 70)}
          points="120 120 60 120 90 90 120 60 120 0 120 0 60 60 0 0 0 60 30 90 60 120 120 120"
        />
      </Pattern>
    </Defs>
    <Rect width={width} height={height} fill="url(#pattern)" />
  </Svg>
));

export default function Map(props: PageProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    LevelCategoryName.Listening
  );

  const category = Levels[selectedCategory];
  const [selectedLevel, setSelectedLevel] = useState<Step | null>(null);

  const flatListAnimatedRef = useAnimatedRef<FlatList>();

  const getItemLayout = useCallback(
    (_: ArrayLike<Step> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const onScrollToIndexFailed = useCallback((info: { index: number }) => {
    setTimeout(() => {
      flatListAnimatedRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    }, 100);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Step; index: number }) => (
      <LevelItem
        index={index}
        current={item}
        color={category.color}
        next={category.steps[index + 1] || null}
        selectLevel={setSelectedLevel}
        key={index.toString()}
      />
    ),
    [category]
  );

  return (
    <React.Fragment>
      <Background color={category.color} />
      {Levels.map(
        (category, index) =>
          index === selectedCategory && (
            <Animated.FlatList
              key={index}
              data={category.steps}
              keyExtractor={(item) => item.number.toString()}
              renderItem={renderItem}
              style={styles.mapContainer}
              contentContainerStyle={styles.itemContainer}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews
              showsVerticalScrollIndicator={false}
              bounces={false}
              bouncesZoom={false}
              ref={flatListAnimatedRef}
              initialScrollIndex={Math.max(category.currentLevel - 3, 0)}
              getItemLayout={getItemLayout}
              onScrollToIndexFailed={onScrollToIndexFailed}
            />
          )
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryButtonContainer}
        contentContainerStyle={styles.categoryButtonContainerWrapper}
      >
        {Levels.map((category, index) => (
          <LevelCategoryButton
            key={index}
            category={category}
            selected={index === selectedCategory}
            onPress={() => setSelectedCategory(index)}
          />
        ))}
      </ScrollView>
      <LevelModal
        level={selectedLevel as Level}
        closeModal={() => setSelectedLevel(null)}
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  itemContainer: {
    paddingVertical: 50,
  },
  mapContainer: {
    position: "absolute",
    inset: 0,
  },
  categoryButton: {
    position: "relative",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: "#202021",
    backgroundColor: "#202021",
    borderWidth: 4,
  },
  categoryButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  categoryButtonContainerWrapper: {
    gap: 10,
    paddingHorizontal: 10,
  },
  categoryButtonBackground: {
    position: "absolute",
    inset: 0,
  },
  categoryButtonText: {
    color: "#ffffff",
    fontFamily: "Archivo-Black",
  },
  categoryButtonWrapper: {
    flex: 1,
    padding: 10,
  },
});
