import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useColorScheme } from "./useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface ExtraOptionsMenuProps {
  onExport: () => Promise<void>;
  onClearAll: () => Promise<void>;
}

export function ExtraOptionsMenu({
  onExport,
  onClearAll,
}: ExtraOptionsMenuProps) {
  const colorScheme = useColorScheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    } else {
      setIsMenuVisible(true);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleExportPress = async () => {
    toggleMenu();
    try {
      await onExport();
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Failed to export results. Please try again.");
      } else {
        Alert.alert(
          "Export Failed",
          "Unable to export results. Please try again."
        );
      }
    }
  };

  const handleClearPress = () => {
    toggleMenu();

    const clearAction = async () => {
      try {
        await onClearAll();
      } catch (error) {
        console.error("Error clearing results:", error);
      }
    };

    // Show confirmation dialog
    if (Platform.OS === "web") {
      if (confirm("Are you sure you want to clear all results?")) {
        clearAction();
      }
    } else {
      Alert.alert(
        "Clear All Results",
        "Are you sure you want to clear all results? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear", style: "destructive", onPress: clearAction },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPressOut={toggleMenu}
        activeOpacity={0.6}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setButtonLayout({ x, y, width, height });
        }}
      >
        <FontAwesome
          name="ellipsis-v"
          size={22}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim,
                  top: buttonLayout.y + buttonLayout.height + 5,
                  right: 20,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleExportPress}
              >
                <FontAwesome
                  name="file"
                  size={16}
                  color="#60a5fa"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Export Results</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleClearPress}
              >
                <FontAwesome
                  name="trash"
                  size={16}
                  color="#f87171"
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuText, styles.destructiveText]}>
                  Clear All Results
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "#1f2937",
    borderRadius: 8,
    width: 200,
    boxShadow: "#000",
    elevation: 5,
    borderWidth: 1,
    borderColor: "#374151",
    overflow: "hidden",
    transformOrigin: "top right",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    color: "#e0e0e0",
    fontSize: 16,
  },
  destructiveText: {
    color: "#f87171",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#374151",
    width: "100%",
  },
});
