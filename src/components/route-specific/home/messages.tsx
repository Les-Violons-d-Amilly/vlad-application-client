import useTheme from "@/src/hooks/useTheme";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import RipplePressable from "../../global/RipplePressable";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import moment, { Moment } from "moment";
import "moment/locale/fr";
import type { PageProps } from "@/src/routes";

moment.locale("fr");

enum Role {
  Me = "Moi",
  Bot = "Robot",
  Teacher = "Professeur",
}

type Message = {
  id: string;
  role: Role;
  content: string;
  timestamp: Moment;
};

const messages: Message[] = [
  {
    id: "1",
    role: Role.Bot,
    content: "Hello!",
    timestamp: moment("2025-05-08T09:00:00Z"),
  },
  {
    id: "2",
    role: Role.Bot,
    content: "How are y'all ?",
    timestamp: moment("2025-05-08T09:00:00Z"),
  },
  {
    id: "3",
    role: Role.Me,
    content: "Hi there!",
    timestamp: moment("2025-05-08T09:01:00Z"),
  },
  {
    id: "4",
    role: Role.Teacher,
    content: "How are you?",
    timestamp: moment("2025-05-08T09:02:00Z"),
  },
  {
    id: "5",
    role: Role.Bot,
    content: "I'm good, thanks!",
    timestamp: moment("2025-05-08T09:03:00Z"),
  },
  {
    id: "6",
    role: Role.Me,
    content: "What about you?",
    timestamp: moment("2025-05-08T09:04:00Z"),
  },
  {
    id: "7",
    role: Role.Teacher,
    content: "Doing well, thanks for asking!",
    timestamp: moment("2025-05-08T09:05:00Z"),
  },
  {
    id: "8",
    role: Role.Bot,
    content: "What are you all working on today?",
    timestamp: moment("2025-05-08T09:06:00Z"),
  },
  {
    id: "9",
    role: Role.Me,
    content: "I'm fixing a bug in the payment module.",
    timestamp: moment("2025-05-08T09:07:00Z"),
  },
  {
    id: "10",
    role: Role.Teacher,
    content: "Nice! I'm writing some unit tests.",
    timestamp: moment("2025-05-08T09:08:00Z"),
  },
  {
    id: "11",
    role: Role.Bot,
    content: "Great, I'm reviewing the new UI designs.",
    timestamp: moment("2025-05-08T09:09:00Z"),
  },
  {
    id: "12",
    role: Role.Me,
    content: "Are they final versions?",
    timestamp: moment("2025-05-08T09:10:00Z"),
  },
  {
    id: "13",
    role: Role.Bot,
    content: "Not yet, still iterating based on feedback.",
    timestamp: moment("2025-05-08T09:11:00Z"),
  },
  {
    id: "14",
    role: Role.Teacher,
    content: "Let me know if you want a second opinion!",
    timestamp: moment("2025-05-08T09:12:00Z"),
  },
  {
    id: "15",
    role: Role.Bot,
    content: "Will do, thanks!",
    timestamp: moment("2025-05-08T09:13:00Z"),
  },
  {
    id: "16",
    role: Role.Me,
    content: "Anyone up for a quick sync meeting?",
    timestamp: moment("2025-05-08T09:14:00Z"),
  },
  {
    id: "17",
    role: Role.Teacher,
    content: "Sure, I'm available now.",
    timestamp: moment("2025-06-08T09:15:00Z"),
  },
  {
    id: "18",
    role: Role.Bot,
    content: "Same here, let's do it.",
    timestamp: moment("2025-06-08T09:16:00Z"),
  },
  {
    id: "19",
    role: Role.Me,
    content: "Cool, starting the call.",
    timestamp: moment("2025-06-08T09:17:00Z"),
  },
  {
    id: "20",
    role: Role.Teacher,
    content: "Joined!",
    timestamp: moment("2025-06-08T09:18:00Z"),
  },
  {
    id: "21",
    role: Role.Bot,
    content: "Here too, let's begin.",
    timestamp: moment("2025-06-08T09:19:00Z"),
  },
].toReversed();

export default function Messages(props: PageProps) {
  const { parseColor } = useTheme();

  return (
    <React.Fragment>
      <View
        style={[
          styles.header,
          { backgroundColor: parseColor("backgroundSecondary") },
        ]}
      >
        <Text
          style={[styles.headerTitle, { color: parseColor("textPrimary") }]}
        >
          Assistance
        </Text>
      </View>
      <View style={styles.messagingContainer}>
        <FlatList
          contentContainerStyle={styles.messagesContainer}
          data={messages}
          inverted
          renderItem={({ item, index }) => {
            const previous = messages[index + 1];
            const isConnectedUser = item.role === Role.Me;
            const samerole = previous?.role === item.role;
            const sameDate =
              previous?.timestamp.isSame(item.timestamp, "day") &&
              previous?.timestamp.isSame(item.timestamp, "month") &&
              previous?.timestamp.isSame(item.timestamp, "year");

            return (
              <React.Fragment>
                <View
                  style={[
                    styles.message,
                    {
                      backgroundColor: isConnectedUser
                        ? parseColor("primary")
                        : parseColor("backgroundTertiary"),
                      alignSelf: isConnectedUser ? "flex-end" : "flex-start",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isConnectedUser
                        ? "#fff"
                        : parseColor("textPrimary"),
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
                {!samerole && (
                  <Text
                    style={[
                      styles.role,
                      {
                        color: parseColor("textSecondary"),
                        textAlign: isConnectedUser ? "right" : "left",
                        marginTop: samerole ? 0 : 15,
                      },
                    ]}
                  >
                    {item.role}
                  </Text>
                )}
                {!sameDate && (
                  <Text
                    style={[
                      styles.date,
                      { color: parseColor("textSecondary") },
                    ]}
                  >
                    {item.timestamp.format("dddd DD MMMM YYYY")}
                  </Text>
                )}
              </React.Fragment>
            );
          }}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.sendMessageContainer}>
          <TextInput
            placeholder="Envoyer un message"
            placeholderTextColor={parseColor("textSecondary")}
            style={[
              styles.sendMessageInput,
              {
                backgroundColor: parseColor("backgroundTertiary"),
                color: parseColor("textPrimary"),
              },
            ]}
          />
          <RipplePressable
            style={[
              styles.sendMessageButton,
              { backgroundColor: parseColor("primary") },
            ]}
            rippleColor="#ffffff22"
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </RipplePressable>
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: StatusBar.currentHeight! + 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  messagingContainer: {
    flex: 1,
    position: "relative",
  },
  sendMessageContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  sendMessageInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  sendMessageButton: {
    height: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  messagesContainer: {
    padding: 20,
    paddingTop: 70,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  role: {
    fontSize: 12,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  date: { fontSize: 12, textAlign: "center", marginBottom: 10, marginTop: 50 },
});
