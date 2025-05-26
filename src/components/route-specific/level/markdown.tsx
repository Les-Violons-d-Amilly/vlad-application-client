import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import MarkdownView from "react-native-markdown-display";

export default function Markdown(content: string) {
  return (
    <ScrollView>
      <MarkdownView>{content.trim()}</MarkdownView>
    </ScrollView>
  );
}
