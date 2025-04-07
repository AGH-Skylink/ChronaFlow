import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useColorScheme } from "./useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  exportActiveResults,
  clearActiveResults,
} from "@/app/pages/active-results";
import {
  exportRegularityResults,
  clearRegularityResults,
} from "@/app/pages/regularity-results";
import {
  exportPassiveResults,
  clearPassiveResults,
} from "@/app/pages/passive-results";
import { usePathname } from "expo-router";

function getExportFunction(pathname: string | undefined) {
  if (pathname?.includes("active-results")) {
    return exportActiveResults;
  }
  if (pathname?.includes("passive-results")) {
    return exportPassiveResults;
  }
  if (pathname?.includes("regularity-results")) {
    return exportRegularityResults;
  }
  return null;
}

function getClearFunction(pathname: string | undefined) {
  if (pathname?.includes("active-results")) {
    return clearActiveResults;
  }
  if (pathname?.includes("passive-results")) {
    return clearPassiveResults;
  }
  if (pathname?.includes("regularity-results")) {
    return clearRegularityResults;
  }
  return null;
}

export function ExtraOptionsMenu() {
  const colorScheme = useColorScheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pathname = usePathname();

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

  const handleExportPress = () => {
    const exportFunction = getExportFunction(pathname);
    if (exportFunction) {
      exportFunction();
    }
  };

  const handleClearPress = () => {
    toggleMenu();
    const clearFunction = getClearFunction(pathname);
    if (clearFunction) {
      clearFunction();
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
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim,
                  top: buttonLayout.y + buttonLayout.height + 5,
                  right: 20, // Adjust based on your layout
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
        </TouchableWithoutFeedback>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
