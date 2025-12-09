import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  View as RNView,
  BackHandler,
  Modal,
  Animated,
  type ViewStyle,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { Session, SessionBlock, TestType } from "@/types/session";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { TestStyles } from "@/constants/TestStyles";
import {
  COLORS,
  typography,
  layout,
  buttons,
  SPACING,
  RADIUS,
} from "@/constants/Styles";
import { useFocusEffect } from "@react-navigation/native";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { useSessionBlockManagement } from "@/hooks/useSessionBlockManagement";
import { ResponsiveScaffold } from "@/components/layout/ResponsiveScaffold";
import { useResponsive } from "@/hooks/useResponsive";

export default function SessionCreator() {
  const [isCreating, setIsCreating] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { isTablet, isDesktop, maxContentWidth } = useResponsive();
  const centeredContentStyle: ViewStyle | undefined =
    isTablet || isDesktop
      ? { width: "100%", maxWidth: maxContentWidth, alignSelf: "center" }
      : undefined;

  const {
    sessions,
    loading,
    loadSessions,
    createNewSession,
    saveSession,
    deleteSession,
  } = useSessionManagement();

  const {
    currentSession,
    sessionName,
    hasUnsavedChanges,
    initializeSession,
    addBlock,
    removeBlock,
    moveBlockUp,
    moveBlockDown,
    updateSessionName,
    reset,
  } = useSessionBlockManagement();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleCreateNewSession = () => {
    setIsCreating(true);
    const newSession = createNewSession();
    initializeSession(newSession);
  };

  const handleSaveSession = async () => {
    if (!currentSession) {
      Alert.alert("Error", "No session to save");
      return;
    }

    try {
      await saveSession(currentSession, sessionName);
      setIsCreating(false);
      reset();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save session"
      );
    }
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
            try {
              await deleteSession(sessionId, deleteResults);
            } catch (error) {
              Alert.alert("Error", "Failed to delete session");
            }
          },
        },
      ]
    );
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
    <View
      style={[
        styles.listHeader,
        (isTablet || isDesktop) && styles.listHeaderWide,
        !(isTablet || isDesktop) && styles.listHeaderCompact,
      ]}
    >
      <View style={styles.headerCopy}>
        <Text style={styles.eyebrow}>Session Builder</Text>
        <Text style={styles.headerTitle}>Sessions</Text>
      </View>
      <TouchableOpacity
        style={styles.headerAction}
        onPress={handleCreateNewSession}
        accessibilityRole="button"
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.headerActionText}>New</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptySessionList = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No sessions yet</Text>
      <Text style={styles.emptySubtitle}>
        Build a session to run a series of tests.
      </Text>
      <TouchableOpacity
        style={styles.primaryCta}
        onPress={handleCreateNewSession}
      >
        <Text style={styles.primaryCtaText}>Create Session</Text>
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
              reset();
            },
          },
        ]
      );
      return true;
    } else {
      setIsCreating(false);
      reset();
      return true;
    }
  }, [hasUnsavedChanges, reset]);

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
              color={COLORS.error}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, styles.destructiveText]}>
              Delete Session Only
            </Text>
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
              color={COLORS.error}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, styles.destructiveText]}>
              Delete Session and Results
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  if (isCreating) {
    return (
      <ResponsiveScaffold
        scrollable
        contentStyle={[
          styles.pageContent,
          styles.createContent,
          (isTablet || isDesktop) && styles.pageContentWide,
          !(isTablet || isDesktop) && styles.pageContentCompact,
          centeredContentStyle,
        ]}
      >
        <View style={styles.createHero}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text.primary} />
          </TouchableOpacity>
          <View style={styles.createHeroCopy}>
            <Text style={styles.eyebrow}>Session Builder</Text>
            <Text style={styles.createTitle}>Create a new session</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={typography.label}>Session Name</Text>
          <TextInput
            style={styles.input}
            value={sessionName}
            onChangeText={updateSessionName}
            placeholder="Enter session name"
            placeholderTextColor={COLORS.text.secondary}
          />
        </View>

        <View style={styles.blockSection}>
          <Text style={typography.title}>Test Blocks</Text>

          <View
            style={[
              styles.blockActions,
              (isTablet || isDesktop) && styles.blockActionsWide,
            ]}
          >
            <TouchableOpacity
              style={styles.blockTypeButton}
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
              style={styles.blockTypeButton}
              onPress={() => addBlock("active")}
            >
              <FontAwesome name="eye" size={18} color={COLORS.text.primary} />
              <Text style={styles.blockTypeText}>Active Test</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.blockTypeButton}
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
            <RNView style={styles.sequenceCard}>
              <RNView style={styles.sequenceHeader}>
                <Text style={styles.sequenceTitle}>Test Sequence</Text>
                <Text style={styles.sequenceCount}>
                  {currentSession.blocks.length} tests
                </Text>
              </RNView>
              <RNView style={styles.sequenceList}>
                {currentSession.blocks.map((block, index) => (
                  <RNView key={block.id} style={styles.blockItem}>
                    <RNView style={styles.blockInfo}>
                      <Text style={styles.blockOrder}>{index + 1}</Text>
                      <FontAwesome
                        name={getBlockIcon(block.type)}
                        size={18}
                        color={COLORS.text.secondary}
                      />
                      <Text style={styles.blockName}>
                        {getBlockName(block.type)}
                      </Text>
                    </RNView>

                    <RNView style={styles.blockControls}>
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
                          color={index === 0 ? COLORS.text.tertiary : "#e0e0e0"}
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
                              ? COLORS.text.tertiary
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
                          color={COLORS.error}
                        />
                      </TouchableOpacity>
                    </RNView>
                  </RNView>
                ))}
              </RNView>
            </RNView>
          ) : (
            <View style={[layout.card, { alignItems: "center" }]}>
              <Text style={typography.subtitle}>No test blocks added yet</Text>
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
      </ResponsiveScaffold>
    );
  }

  return (
    <ResponsiveScaffold
      contentStyle={[
        styles.pageContent,
        styles.listWrapper,
        (isTablet || isDesktop) && styles.pageContentWide,
        !(isTablet || isDesktop) && styles.pageContentCompact,
        centeredContentStyle,
      ]}
    >
      <View style={[styles.listContainer, centeredContentStyle]}>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={SessionListHeader}
          ListEmptyComponent={EmptySessionList}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            sessions.length === 0 && styles.emptyListContent,
          ]}
          renderItem={({ item }) => (
            <View style={[layout.card, styles.sessionCard]}>
              <View style={styles.sessionHeader}>
                <Text style={typography.title}>{item.name}</Text>
                <Text style={typography.subtitle}>
                  {item.blocks.length} tests •{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.blockPreview}>
                {item.blocks.slice(0, 3).map((block) => (
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
                  style={[buttons.primary, styles.playButton]}
                  onPress={() => handlePlaySession(item)}
                >
                  <RNView style={styles.playButtonContent}>
                    <Ionicons name="play" size={16} color="#fff" />
                    <Text style={[buttons.buttonText, styles.playButtonText]}>
                      Play Session
                    </Text>
                  </RNView>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => showSessionMenu(item.id)}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#a0aec0"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <SessionMenu />
    </ResponsiveScaffold>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    width: "100%",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    gap: SPACING.xl,
  },
  pageContentWide: {
    paddingHorizontal: 0,
    paddingVertical: SPACING.xxxl,
  },
  pageContentCompact: {
    paddingHorizontal: SPACING.xs,
  },
  createContent: {
    gap: SPACING.xl,
  },
  listWrapper: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    width: "100%",
    alignSelf: "stretch",
  },
  list: {
    flex: 1,
    alignSelf: "stretch",
  },
  listContent: {
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  listHeader: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listHeaderWide: {
    paddingHorizontal: 0,
  },
  listHeaderCompact: {
    paddingHorizontal: SPACING.xs,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    ...typography.overline,
    textAlign: "left",
    color: COLORS.text.tertiary,
    backgroundColor: "transparent",
  },
  headerTitle: {
    ...typography.h2,
    marginTop: SPACING.xs,
  },
  headerSubtitle: {
    ...typography.body,
    marginTop: SPACING.xs,
    color: COLORS.text.secondary,
    textAlign: "left",
  },
  headerAction: {
    ...buttons.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginLeft: SPACING.md,
  },
  headerActionText: {
    ...buttons.buttonText,
    marginLeft: SPACING.xs,
  },
  emptyState: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    flex: 1,
  },
  emptyTitle: {
    ...typography.h3,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  primaryCta: {
    ...buttons.primary,
    width: "80%",
  },
  primaryCtaText: {
    ...buttons.buttonText,
    fontWeight: "700",
    backgroundColor: "transparent",
  },
  sessionHeader: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  sessionCard: {
    marginBottom: SPACING.lg,
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
    backgroundColor: "transparent",
  },
  blockPreviewMore: {
    color: COLORS.text.secondary,
    fontSize: 14,
    alignSelf: "center",
    marginLeft: 6,
    backgroundColor: "transparent",
  },
  sessionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  playButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  playButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonText: {
    marginLeft: SPACING.xs,
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  blockActionsWide: {
    justifyContent: "flex-start",
  },
  blockTypeButton: {
    flexGrow: 1,
    minWidth: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.xs,
  },
  blockTypeText: {
    color: COLORS.text.primary,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
  sequenceCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  sequenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  sequenceTitle: {
    ...typography.subtitle,
    marginBottom: 0,
    backgroundColor: "transparent",
  },
  sequenceCount: {
    ...typography.caption,
    color: COLORS.text.secondary,
    backgroundColor: "transparent",
  },
  sequenceList: {
    marginTop: SPACING.sm,
  },
  blockItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    width: "100%",
  },
  blockInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
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
    textAlign: "left",
    backgroundColor: "transparent",
  },
  blockControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
  createHero: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  createHeroCopy: {
    flex: 1,
    backgroundColor: "transparent",
  },
  createTitle: {
    ...typography.h2,
    marginTop: SPACING.xs,
    backgroundColor: "transparent",
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
    backgroundColor: COLORS.background.secondary,
    borderRadius: 8,
    width: 250,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.text.primary,
    fontSize: 16,
    marginLeft: 10,
  },
  destructiveText: {
    color: COLORS.error,
  },
  menuIcon: {
    marginRight: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
  },
});
