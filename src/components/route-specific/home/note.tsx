import React from "react";
import Svg, { Circle, Line, Path } from "react-native-svg";

type NoteProps = Readonly<
  {
    color: string;
    size: number;
  } & ({} | { x: number; y: number })
>;

export function Note(props: NoteProps) {
  const x = "x" in props ? props.x : 0;
  const y = "y" in props ? props.y : 0;
  const stemX = x + props.size * 2 - props.size / 4;
  const stemY1 = y + props.size * 4;
  const stemY2 = y + props.size;

  const bezier = `
    M${stemX},${stemY2}
    C${stemX + props.size},${stemY2 + props.size * 1.5},
      ${stemX + props.size},${stemY2 + props.size * 1.75},
      ${stemX + props.size},${stemY2 + props.size * 2}
  `;

  return (
    <Svg width={props.size * 3} height={props.size * 5} x={x} y={y}>
      <Circle
        cx={x + props.size}
        cy={y + props.size * 4}
        r={props.size}
        fill={props.color}
      />
      <Line
        x1={stemX}
        y1={stemY1}
        x2={stemX}
        y2={stemY2}
        stroke={props.color}
        strokeWidth={props.size / 2}
        strokeLinecap="round"
      />
      <Path
        d={bezier}
        stroke={props.color}
        strokeWidth={props.size / 2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
