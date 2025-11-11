import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@/src/domain/session/Session";
import { BlockListItem } from "./BlockListItem";
import { TestStyles } from "@/constants/TestStyles";
import { COLORS } from "@/constants/Styles";

interface SessionOverviewProps {
  session: Session;
  currentBlockIndex: number;
  onBack: () => void;
  onBegin: () => void;
}

export function SessionOverview({
  session,
  currentBlockIndex,
  onBack,
  onBegin,
}: SessionOverviewProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
      </TouchableOpacity>

      <Text style={TestStyles.header}>{session.name}</Text>
      <Text style={TestStyles.instructions}>Session Overview</Text>

      <View style={styles.blockList}>
        {session.blocks.map((block, index) => (
          <BlockListItem
            key={block.id}
            block={block}
            index={index}
            isActive={currentBlockIndex === index}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.beginButton} onPress={onBegin}>
        <View style={styles.beginButtonContent}>
          <Ionicons
            name="play"
            size={20}
            color="#fff"
            style={styles.playIcon}
          />
          <Text style={TestStyles.resetButtonText}>Begin Session</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 30,
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  blockList: {
    marginVertical: 20,
  },
  beginButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  beginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    marginRight: 8,
  },
});
