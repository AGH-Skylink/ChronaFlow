import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  View as RNView,
  BackHandler,
  Modal,
  Animated,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { Session, SessionBlock, TestType } from "@/types/session";
import { saveSession, getSessions, deleteSession } from "@/utils/sessionUtils";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { TestStyles } from "@/constants/TestStyles";
import { COLORS, typography, layout, buttons } from "@/constants/Styles";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SessionCreator() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessionName, setSessionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    if (
      isCreating &&
      (sessionName.trim() !== "" ||
        (currentSession && currentSession.blocks.length > 0))
    ) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [sessionName, currentSession?.blocks, isCreating]);

  const loadSessions = async () => {
    const loadedSessions = await getSessions();
    setSessions(loadedSessions);
  };

  const createNewSession = () => {
    setIsCreating(true);
    setSessionName("");
    setCurrentSession({
      id: Date.now().toString(),
      name: "",
      createdAt: Date.now(),
      blocks: [],
    });
    setHasUnsavedChanges(false);
  };

  const addBlock = (type: TestType) => {
    if (!currentSession) return;

    const newBlock: SessionBlock = {
      id: Date.now().toString(),
      type,
      order: currentSession.blocks.length,
    };

    setCurrentSession({
      ...currentSession,
      blocks: [...currentSession.blocks, newBlock],
    });
  };

  const removeBlock = (blockId: string) => {
    if (!currentSession) return;

    const updatedBlocks = currentSession.blocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }));

    setCurrentSession({
      ...currentSession,
      blocks: updatedBlocks,
    });
  };

  const moveBlockUp = (index: number) => {
    if (!currentSession || index <= 0) return;

    const updatedBlocks = [...currentSession.blocks];
    const temp = updatedBlocks[index];
    updatedBlocks[index] = updatedBlocks[index - 1];
    updatedBlocks[index - 1] = temp;

    // Update order values
    updatedBlocks.forEach((block, i) => {
      block.order = i;
    });

    setCurrentSession({
      ...currentSession,
      blocks: updatedBlocks,
    });
  };

  const moveBlockDown = (index: number) => {
    if (!currentSession || index >= currentSession.blocks.length - 1) return;

    const updatedBlocks = [...currentSession.blocks];
    const temp = updatedBlocks[index];
    updatedBlocks[index] = updatedBlocks[index + 1];
    updatedBlocks[index + 1] = temp;

    // Update order values
    updatedBlocks.forEach((block, i) => {
      block.order = i;
    });

    setCurrentSession({
      ...currentSession,
      blocks: updatedBlocks,
    });
  };

  const handleSaveSession = async () => {
    if (!currentSession || !sessionName.trim()) {
      Alert.alert("Error", "Please enter a session name");
      return;
    }

    if (currentSession.blocks.length === 0) {
      Alert.alert("Error", "Please add at least one test block");
      return;
    }

    const sessionToSave = {
      ...currentSession,
      name: sessionName.trim(),
    };

    await saveSession(sessionToSave);
    setIsCreating(false);
    setCurrentSession(null);
    setSessionName("");
    setHasUnsavedChanges(false);
    loadSessions();
  };

  const handleDeleteSession = async (
    sessionId: string,
    deleteResults: boolean = false
  ) => {
    Alert.alert(
      "Delete Session",
      deleteResults
        ? "Are you sure you want to delete this session AND all associated test results? This action cannot be undone."
        : "Are you sure you want to delete this session? The test results will be kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSession(sessionId);

            if (deleteResults) {
              await deleteSessionResults(sessionId);
            } else {
              await nullifySessionResults(sessionId);
            }

            loadSessions();
          },
        },
      ]
    );
  };

  const deleteSessionResults = async (sessionId: string) => {
    try {
      await deleteTestResultsForSession("activeTestResults", sessionId);
      await deleteTestResultsForSession("passiveTestResults", sessionId);
      await deleteTestResultsForSession("regularityTestResults", sessionId);
    } catch (error) {
      console.error("Error deleting session results:", error);
      Alert.alert("Error", "Failed to delete all test results");
    }
  };

  const deleteTestResultsForSession = async (
    storageKey: string,
    sessionId: string
  ) => {
    const resultsJson = await AsyncStorage.getItem(storageKey);
    if (resultsJson) {
      const results = JSON.parse(resultsJson);
      const filteredResults = results.filter(
        (result: any) => result.sessionId !== sessionId
      );
      await AsyncStorage.setItem(storageKey, JSON.stringify(filteredResults));
    }
  };

  const nullifySessionResults = async (sessionId: string) => {
    try {
      const resultsJson = await AsyncStorage.getItem("activeTestResults");
      if (resultsJson) {
        const results = JSON.parse(resultsJson);
        const updatedResults = results.map((result: any) =>
          result.sessionId === sessionId
            ? { ...result, sessionId: null }
            : result
        );
        await AsyncStorage.setItem(
          "activeTestResults",
          JSON.stringify(updatedResults)
        );
      }
    } catch (error) {
      console.error("Error nullifying session results:", error);
    }
  };

  const showSessionMenu = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMenuVisible(true);
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideSessionMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      setActiveSessionId(null);
    });
  };

  const handlePlaySession = (session: Session) => {
    if (session.blocks.length === 0) {
      Alert.alert("Error", "This session has no tests");
      return;
    }

    router.push({
      pathname: "/pages/session-player",
      params: { sessionId: session.id },
    });
  };

  const getBlockIcon = (type: TestType) => {
    switch (type) {
      case "active":
        return "eye";
      case "passive":
        return "play-circle";
      case "regularity":
        return "hand-o-up";
    }
  };

  const getBlockName = (type: TestType) => {
    switch (type) {
      case "active":
        return "Active Test";
      case "passive":
        return "Passive Test";
      case "regularity":
        return "Regularity Test";
    }
  };

  const SessionListHeader = () => (
    <View style={styles.header}>
      <Text style={typography.header}>Sessions</Text>
    </View>
  );

  const EmptySessionList = () => (
    <View style={styles.emptyState}>
      <Text style={[typography.title, { textAlign: "center" }]}>
        No sessions created yet
      </Text>
      <TouchableOpacity
        style={TestStyles.primaryButton}
        onPress={createNewSession}
      >
        <Text style={TestStyles.primaryButtonText}>Create Session</Text>
      </TouchableOpacity>
    </View>
  );
  const SessionListFooter = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={[TestStyles.primaryButton, { marginVertical: 20 }]}
        onPress={createNewSession}
      >
        <Text style={TestStyles.primaryButtonText}>Create New Session</Text>
      </TouchableOpacity>
    </View>
  );
  const handleBackPress = useCallback(() => {
    if (hasUnsavedChanges) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setIsCreating(false);
              setCurrentSession(null);
              setSessionName("");
              setHasUnsavedChanges(false);
            },
          },
        ]
      );
      return true;
    } else {
      setIsCreating(false);
      setCurrentSession(null);
      setSessionName("");
      return true;
    }
  }, [hasUnsavedChanges]);

  useFocusEffect(
    useCallback(() => {
      if (isCreating) {
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          handleBackPress
        );
        return () => backHandler.remove();
      }
      return () => {};
    }, [isCreating, handleBackPress])
  );

  // Session Menu component
  const SessionMenu = () => (
    <Modal
      visible={menuVisible}
      transparent={true}
      animationType="none"
      onRequestClose={hideSessionMenu}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={hideSessionMenu}
      >
        <Animated.View
          style={[
            styles.menuContainer,
            {
              opacity: menuAnim,
              transform: [{ scale: menuAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              hideSessionMenu();
              if (activeSessionId) handleDeleteSession(activeSessionId, false);
            }}
          >
            <FontAwesome
              name="trash"
              size={16}
              color="#f87171"
              style={styles.menuIcon}
            />
            <Text style={styles.menuItemText}>Delete Session Only</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              hideSessionMenu();
              if (activeSessionId) handleDeleteSession(activeSessionId, true);
            }}
          >
            <FontAwesome
              name="trash"
              size={16}
              color="#f87171"
              style={styles.menuIcon}
            />
            <Text style={styles.menuItemText}>Delete Session and Results</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  if (isCreating) {
    return (
      <View
        style={[
          layout.container,
          { backgroundColor: COLORS.background.primary, margin: 16 },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainer, { paddingTop: 50 }]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={
              (styles.header,
              {
                flexDirection: "row",
                alignItems: "center",
              })
            }
          >
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.text.primary}
                style={
                  (styles.headerButton,
                  {
                    marginRight: 16,
                    marginBottom: 4,
                  })
                }
              />
            </TouchableOpacity>
            <Text style={typography.header}>Create New Session</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={typography.label}>Session Name</Text>
            <TextInput
              style={styles.input}
              value={sessionName}
              onChangeText={setSessionName}
              placeholder="Enter session name"
              placeholderTextColor={COLORS.text.muted}
            />
          </View>

          <View style={styles.blockSection}>
            <Text style={typography.title}>Test Blocks</Text>

            <View style={styles.blockActions}>
              <TouchableOpacity
                style={[styles.blockTypeButton]}
                onPress={() => addBlock("passive")}
              >
                <FontAwesome
                  name="play-circle"
                  size={18}
                  color={COLORS.text.primary}
                />
                <Text style={styles.blockTypeText}>Passive Test</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.blockTypeButton]}
                onPress={() => addBlock("active")}
              >
                <FontAwesome name="eye" size={18} color={COLORS.text.primary} />
                <Text style={styles.blockTypeText}>Active Test</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.blockTypeButton]}
                onPress={() => addBlock("regularity")}
              >
                <FontAwesome
                  name="hand-o-up"
                  size={18}
                  color={COLORS.text.primary}
                />
                <Text style={styles.blockTypeText}>Regularity Test</Text>
              </TouchableOpacity>
            </View>

            {currentSession && currentSession.blocks.length > 0 ? (
              <View style={layout.card}>
                <Text style={[typography.subtitle, { textAlign: "left" }]}>
                  Test Sequence:
                </Text>
                {currentSession.blocks.map((block, index) => (
                  <View key={block.id} style={styles.blockItem}>
                    <View style={styles.blockInfo}>
                      <Text style={styles.blockOrder}>{index + 1}</Text>
                      <FontAwesome
                        name={getBlockIcon(block.type)}
                        size={18}
                        color="#a0aec0"
                      />
                      <Text style={styles.blockName}>
                        {getBlockName(block.type)}
                      </Text>
                    </View>

                    <View style={styles.blockControls}>
                      <TouchableOpacity
                        style={[
                          styles.blockControl,
                          index === 0 && styles.blockControlDisabled,
                        ]}
                        onPress={() => moveBlockUp(index)}
                        disabled={index === 0}
                      >
                        <Ionicons
                          name="chevron-up"
                          size={20}
                          color={index === 0 ? "#6b7280" : "#e0e0e0"}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.blockControl,
                          index === currentSession.blocks.length - 1 &&
                            styles.blockControlDisabled,
                        ]}
                        onPress={() => moveBlockDown(index)}
                        disabled={index === currentSession.blocks.length - 1}
                      >
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={
                            index === currentSession.blocks.length - 1
                              ? "#6b7280"
                              : "#e0e0e0"
                          }
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.blockControlRemove}
                        onPress={() => removeBlock(block.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#ff6b6b"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={[layout.card, { alignItems: "center" }]}>
                <Text style={typography.subtitle}>
                  No test blocks added yet
                </Text>
                <Text
                  style={[
                    typography.paragraph,
                    { textAlign: "center", marginTop: 8 },
                  ]}
                >
                  Tap the buttons above to add test blocks to your session
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                TestStyles.primaryButton,
                (!sessionName.trim() || currentSession?.blocks.length === 0) &&
                  TestStyles.disabledButton,
              ]}
              onPress={handleSaveSession}
              disabled={
                !sessionName.trim() || currentSession?.blocks.length === 0
              }
            >
              <Text style={TestStyles.primaryButtonText}>Save Session</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[layout.container, { backgroundColor: COLORS.background.primary }]}
    >
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={SessionListHeader}
        ListEmptyComponent={EmptySessionList}
        ListFooterComponent={sessions.length > 0 ? SessionListFooter : null}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: 50 },
          sessions.length === 0 && { flex: 1 },
        ]}
        renderItem={({ item }) => (
          <View style={layout.card}>
            <View style={styles.sessionHeader}>
              <Text style={typography.title}>{item.name}</Text>
              <Text style={typography.subtitle}>
                {item.blocks.length} tests •{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.blockPreview}>
              {item.blocks.slice(0, 3).map((block, index) => (
                <View key={block.id} style={styles.blockPreviewItem}>
                  <FontAwesome
                    name={getBlockIcon(block.type)}
                    size={16}
                    color={COLORS.text.secondary}
                  />
                  <Text style={styles.blockPreviewText}>
                    {getBlockName(block.type)}
                  </Text>
                </View>
              ))}
              {item.blocks.length > 3 && (
                <Text style={styles.blockPreviewMore}>
                  +{item.blocks.length - 3} more
                </Text>
              )}
            </View>

            <View style={styles.sessionActions}>
              <TouchableOpacity
                style={buttons.primary}
                onPress={() => handlePlaySession(item)}
              >
                <RNView style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="play" size={16} color="#fff" />
                  <Text style={buttons.buttonText}>Play Session</Text>
                </RNView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => showSessionMenu(item.id)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#a0aec0" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <SessionMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    minHeight: "100%",
    backgroundColor: "#000",
    margin: 0,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: COLORS.border,
    backgroundColor: "transparent",
    paddingBottom: 16,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    flex: 1,
  },
  sessionHeader: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  blockPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  blockPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  blockPreviewText: {
    color: COLORS.text.primary,
    fontSize: 14,
    marginLeft: 6,
  },
  blockPreviewMore: {
    color: COLORS.text.secondary,
    fontSize: 14,
    alignSelf: "center",
    marginLeft: 6,
  },
  sessionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  formGroup: {
    marginVertical: 24,
  },
  input: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  blockSection: {
    marginBottom: 24,
  },
  blockActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  blockTypeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  blockTypeText: {
    color: COLORS.text.primary,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
  blockItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    width: "100%", // Ensure full width
  },
  blockInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Align to left
    flex: 1, // Take up available space
  },
  blockOrder: {
    backgroundColor: COLORS.background.tertiary,
    color: COLORS.text.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
  },
  blockName: {
    color: COLORS.text.primary,
    fontSize: 16,
    marginLeft: 8,
    textAlign: "left", // Ensure text is left-aligned
  },
  blockControls: {
    flexDirection: "row",
    justifyContent: "flex-end", // Push controls to the right
  },
  blockControl: {
    padding: 6,
  },
  blockControlDisabled: {
    opacity: 0.5,
  },
  blockControlRemove: {
    padding: 6,
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginVertical: 16,
  },
  headerButton: {
    width: "auto", // Override the default width from TestStyles
    paddingHorizontal: 10,
    margin: 0,
    marginLeft: "auto", // Push button to the right
  },
  footerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 20,
  },
  menuButton: {
    padding: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    width: 250,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#374151",
    position: "absolute",
    top: "40%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: "#f87171",
    fontSize: 16,
    marginLeft: 10,
  },
  menuIcon: {
    marginRight: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#374151",
  },
});
