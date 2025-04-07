import { StyleSheet } from "react-native";

export const resultCardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2d3748",
  },
  resultDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e0e0e0",
  },
  headerRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    marginTop: 12,
    backgroundColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  dateEmojiContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 22,
    marginRight: 8,
  },
});
