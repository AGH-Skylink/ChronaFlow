import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getSessionById } from "@/utils/sessionUtils";
import { Session, SessionBlock } from "@/types/session";
import { Ionicons } from "@expo/vector-icons";
import ActiveTest from "./active-test";
import PassiveTest from "./passive-test";
import RegularityTest from "./regularity-test";
import { TestStyles } from "@/constants/TestStyles";
import { COLORS, typography, layout, buttons } from "@/constants/Styles";

export default function SessionPlayer() {
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId.toString());
    }
  }, [sessionId]);

  const loadSession = async (id: string) => {
    const loadedSession = await getSessionById(id);
    setSession(loadedSession);
  };

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (!session) return;

    if (currentBlockIndex < session.blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    } else {
      // Session completed
      setCompleted(true);
    }
  };

  const handleExit = () => {
    router.back();
  };

  const renderTestComponent = (block: SessionBlock) => {
    switch (block.type) {
      case "active":
        return (
          <ActiveTest
            onComplete={handleNext}
            sessionId={sessionId?.toString()}
          />
        );
      case "passive":
        return (
          <PassiveTest
            onComplete={handleNext}
            sessionId={sessionId?.toString()}
          />
        );
      case "regularity":
        return (
          <RegularityTest
            onComplete={handleNext}
            sessionId={sessionId?.toString()}
          />
        );
      default:
        return null;
    }
  };

  const renderBlockInfo = (block: SessionBlock, index: number) => {
    const getTestTypeName = (type: string) => {
      switch (type) {
        case "active":
          return "Active Test";
        case "passive":
          return "Passive Test";
        case "regularity":
          return "Regularity Test";
        default:
          return "Unknown Test";
      }
    };

    return (
      <View
        key={block.id}
        style={[
          styles.blockItem,
          currentBlockIndex === index && styles.currentBlockItem,
        ]}
      >
        <Text style={styles.blockNumber}>{index + 1}</Text>
        <Text style={styles.blockName}>{getTestTypeName(block.type)}</Text>
      </View>
    );
  };

  if (!session) {
    return (
      <View style={TestStyles.container}>
        <Text style={typography.subtitle}>Loading session...</Text>
      </View>
    );
  }

  if (completed) {
    return (
      <View
        style={
          (TestStyles.container,
          { padding: 30, paddingTop: 50, height: "100%", paddingBottom: 0 })
        }
      >
        <View style={TestStyles.resultsContainer}>
          <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
          <Text style={TestStyles.title}>Session Completed!</Text>
          <Text style={typography.subtitle}>
            You've completed all the tests in this session.
          </Text>

          <TouchableOpacity
            style={TestStyles.primaryButton}
            onPress={handleExit}
          >
            <Text style={TestStyles.primaryButtonText}>Return to Sessions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!isPlaying) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background.primary }}
        contentContainerStyle={{
          flexGrow: 1, // ensures content grows and is scrollable
          padding: 30,
          paddingTop: 50,
          paddingBottom: 30, // extra bottom padding for visibility
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleExit}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>

        <Text style={TestStyles.header}>{session.name}</Text>
        <Text style={TestStyles.instructions}>Session Overview</Text>

        <View style={{ marginVertical: 20 }}>
          {session.blocks.map((block, index) => renderBlockInfo(block, index))}
        </View>

        <TouchableOpacity
          style={[styles.beginSessionButton]}
          onPress={handleStart}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="play"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={TestStyles.resetButtonText}>Begin Session</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const currentBlock = session.blocks[currentBlockIndex];

  return renderTestComponent(currentBlock);
}

// Add the onComplete and sessionId props to the component types
declare module "./active-test" {
  interface Props {
    onComplete?: () => void;
    sessionId?: string | null;
  }
}

declare module "./passive-test" {
  interface Props {
    onComplete?: () => void;
    sessionId?: string | null;
  }
}

declare module "./regularity-test" {
  interface Props {
    onComplete?: () => void;
    sessionId?: string | null;
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 20,
  },
  blockList: {
    marginVertical: 20,
    flex: 1,
  },
  blockItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.background.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  currentBlockItem: {
    backgroundColor: COLORS.background.tertiary,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  blockNumber: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    textAlign: "center",
    lineHeight: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginRight: 12,
  },
  blockName: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  beginSessionButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
});
