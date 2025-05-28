import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import MarkdownView from "react-native-markdown-display";

type MarkdownProps = Readonly<{
  children?: string;
}>;

export default function Markdown(props: MarkdownProps) {
  return (
    <ScrollView>
      <MarkdownView>{props.children?.trim()}</MarkdownView>
    </ScrollView>
  );
}
