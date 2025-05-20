import Levels, {
  Category,
  Level,
  LevelCategoryName,
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
  current: Level;
  next: Level | null;
  selectLevel: (level: Level | null) => void;
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
  const innerColor = props.current.stars === 0 ? "#6e6e73" : props.color;

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
          done={props.next.stars > 0}
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
        y={30}
        fill="#ffffffdf"
        fontSize={28}
        fontWeight="bold"
        textAnchor="middle"
      >
        {props.current.number}
      </SvgText>
      {Array.from({ length: 3 }, (_, i) => {
        return (
          <Note
            key={i}
            x={props.current.x - 23 + i * 17}
            y={38}
            size={4}
            color={i < props.current.stars ? "#f5ce62" : darken(innerColor, 15)}
          />
        );
      })}
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
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const flatListAnimatedRef = useAnimatedRef<FlatList>();

  const getItemLayout = useCallback(
    (_: ArrayLike<Level> | null | undefined, index: number) => ({
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
    ({ item, index }: { item: Level; index: number }) => (
      <LevelItem
        index={index}
        current={item}
        color={category.color}
        next={category.levels[index + 1] || null}
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
              data={category.levels}
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
        level={selectedLevel}
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
