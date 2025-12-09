import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ------------------ STYLES --------------------

  homeBackground: {
    flex: 1,
  },
  homeContainer: {
    flexGrow: 1,
    paddingTop: 56,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  safeTopContainer: {
    paddingTop: 80,
  },
  homeTopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: 16,
    marginBottom: 8,
  },
  appLogo: {
    width: 100, // << change icon size here
    height: 100, // << and here
    marginBottom: 12,
  },
  quizBackground: {
    flex: 1,
  },
  quizContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    alignItems: "center",
  },
  appTitle: {
    fontWeight: "800",
    marginBottom: 12,
    fontFamily: "sans-serif",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitle: {
    color: "#495057",
    marginBottom: 24,
    fontFamily: "System",
    textAlign: "center",
  },
  homeButtonsContainer: {
    width: "100%",
    marginTop: 8,
    marginBottom: 24,
  },
  homeNavButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  homeNavButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f8f9fa",
    textAlign: "center",
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  cardContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
  },
  cardBox: {
    minHeight: 120,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 0,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  questionText: {
    fontWeight: "800",
    textAlign: "center",
    fontFamily: "System",
  },
  answerText: {
    textAlign: "center",
    fontFamily: "serif",
  },
  placeholderText: {
    fontSize: 15,
    color: "#dee2e6",
    textAlign: "center",
  },
  bigButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 150,
    alignItems: "center",
    marginVertical: 10,
  },
  primaryButton: { backgroundColor: "#1c7ed6" },
  secondaryButton: { backgroundColor: "#495057" },
  bigButtonText: { color: "#fff", fontWeight: "800" },
  smallButton: {
    borderWidth: 1,
    borderColor: "#343a40",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginLeft: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  smallButtonText: { color: "#343a40", fontWeight: "500" },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#f1f3f5",
    backgroundColor: "transparent",
    marginTop: 8,
  },
  outlineButtonText: { color: "#f1f3f5", fontWeight: "600" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    alignItems: "flex-end",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  subjectLabel: { fontWeight: "700" },
  topicLabel: {
    marginTop: 2,
  },
  metaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  difficultyPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  difficultyText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 10,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
    marginTop: 4,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  knownButton: {
    backgroundColor: "#e6fcf5",
    borderWidth: 1,
    borderColor: "#12b886",
  },
  unknownButton: {
    backgroundColor: "#fff4e6",
    borderWidth: 1,
    borderColor: "#f08c00",
  },
  ratingButtonText: {
    fontWeight: "600",
    color: "#212529",
  },
  topicSection: {
    marginTop: 24,
    width: "100%",
  },
  topicHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  topicTitle: {
    fontWeight: "600",
    color: "#f8f9fa",
  },
  topicLink: {
    fontSize: 14,
    color: "#e9ecef",
    fontWeight: "500",
  },
  topicEmptyText: {
    fontSize: 14,
    color: "#dee2e6",
    marginTop: 4,
  },
  topicGroupList: {
    marginTop: 4,
    width: "100%",
  },
  topicGroup: {
    marginBottom: 10,
  },
  topicGroupTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f8f9fa",
  },
  topicGroupTitleSelected: {
    color: "#4dabf7",
  },
  subtopicRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginLeft: 12,
  },
  topicChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
  },
  topicChipSelected: {
    backgroundColor: "#4c6ef5",
    borderColor: "#364fc7",
  },
  topicChipText: {
    fontSize: 14,
    color: "#343a40",
  },
  topicChipTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  progressText: {
    marginTop: 4,
    fontWeight: "500",
  },
  questionImage: {
    width: 260,
    height: 160,
    marginBottom: 8,
  },
  tapToZoomText: {
    fontSize: 12,
    color: "#868e96",
    textAlign: "center",
    marginBottom: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomImage: {
    transform: [{ rotate: "90deg" }],
  },
  modalCloseButton: {
    position: "absolute",
    top: 48,
    right: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#ff4d4d",
    backgroundColor: "transparent",
  },
  modalCloseText: {
    color: "#ff4d4d",
    fontWeight: "600",
    fontSize: 20,
    fontWeight: "bold",
  },
  statsCard: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statsLabel: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#212529",
  },
  statsGood: {
    fontSize: 20,
    fontWeight: "700",
    color: "#12b886",
  },
  statsBad: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fa5252",
  },
  statsAccuracy: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1c7ed6",
  },
  statsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 8,
  },
  statsRankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statsRankPosition: {
    width: 24,
    fontWeight: "700",
    color: "#212529",
  },
  statsRankName: {
    flex: 1,
    color: "#343a40",
  },
  statsRankClass: {
    color: "#868e96",
    fontSize: 12,
  },
  statsRankScore: {
    fontWeight: "700",
    color: "#1c7ed6",
  },
  subjectStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  subjectStatsTitle: {
    fontWeight: "600",
    color: "#212529",
  },
  subjectStatsSub: {
    fontSize: 13,
    color: "#495057",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#212529",
    backgroundColor: "#ffffff",
    marginTop: 4,
  },
  classList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  classChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
  },
  classChipSelected: {
    backgroundColor: "#4c6ef5",
    borderColor: "#364fc7",
  },
  classChipText: {
    fontSize: 13,
    color: "#343a40",
  },
  classChipTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  profileBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  profileBadgeAnon: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  profileBadgeText: {
    color: "#f8f9fa",
    fontWeight: "700",
    fontSize: 13,
  },
  profileBadgeSub: {
    color: "#e9ecef",
    fontSize: 11,
  },
  madeByText: {
    marginTop: 16,
    fontSize: 10,
    color: "#212529",
    opacity: 0.7,
    textAlign: "center",
  },
  drugQuestionText: {
    fontSize: 16,
    color: "#212529",
    marginBottom: 8,
  },
  drugHintText: {
    fontSize: 13,
    color: "#868e96",
    marginBottom: 12,
  },
  drugAnswerBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  drugAnswerBoxCorrect: {
    borderColor: "#12b886",
    backgroundColor: "#e6fcf5",
  },
  drugAnswerBoxIncorrect: {
    borderColor: "#fa5252",
    backgroundColor: "#ffe3e3",
  },
  drugUnitText: {
    fontSize: 16,
    color: "#495057",
  },
  drugTheoryText: {
    fontSize: 15,
    color: "#212529",
    lineHeight: 22,
  },
  subHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
  },
  subHeaderText: {
    color: "#e9ecef",
    fontWeight: "500",
  },
  weeklyTimerBar: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  weeklyTimerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8f9fa",
  },
  weeklyGameCenter: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
  weeklyGameTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f8f9fa",
    marginBottom: 24,
    textAlign: "center",
  },
  weeklyStartButton: {
    paddingHorizontal: 40,
  },
  weeklyStartButtonText: {
    fontSize: 22,
  },
  weeklyPlaceholderText: {
    marginTop: 16,
    fontSize: 14,
    color: "#e9ecef",
    textAlign: "center",
  },
  weeklyWordScrambled: {
    fontSize: 26,
    letterSpacing: 2,
    fontWeight: "800",
    color: "#212529",
    marginBottom: 8,
    textAlign: "center",
  },
  weeklyWordFeedbackCorrect: {
    marginTop: 12,
    fontSize: 14,
    color: "#12b886",
    textAlign: "center",
    fontWeight: "700",
  },
  weeklyWordFeedbackWrong: {
    marginTop: 12,
    fontSize: 14,
    color: "#fa5252",
    textAlign: "center",
    fontWeight: "700",
  },
});
// Dummy default export so Expo Router stops treating this as a broken route
export default function FlashmedicStylesRoute() {
  return null;
}
