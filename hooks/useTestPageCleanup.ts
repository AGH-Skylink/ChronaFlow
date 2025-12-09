import { useCallback } from "react";
import { Keyboard } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export function useTestPageCleanup(onCleanup: () => void) {
  useFocusEffect(
    useCallback(() => {
      return () => {
        onCleanup();
      };
    }, [onCleanup])
  );

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return { dismissKeyboard };
}
