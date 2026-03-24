// src/ui/flashmedicStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ------------------ STYLES --------------------

  homeBackground: {
    flex: 1,
  },

  homeContainer: {
    flexGrow: 1,
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },

  safeTopContainer: {
    paddingTop: 88,
  },

  homeTopRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: 16,
    marginBottom: 8,
  },

  appLogo: {
    width: 100,
    height: 100,
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
    width: "100%",
  },

  appTitle: {
    fontWeight: "800",
    marginBottom: 12,
    fontFamily: "System",
    letterSpacing: 0.5,
    textAlign: "center",
    flexShrink: 1,
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
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  homeNavButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f8f9fa",
    textAlign: "center",
    flexShrink: 1,
  },

  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    width: "100%",
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
    width: "100%",
  },

  questionText: {
    fontWeight: "800",
    textAlign: "center",
    fontFamily: "System",
    flexShrink: 1,
  },

  answerText: {
    textAlign: "center",
    fontFamily: "serif",
    flexShrink: 1,
  },

  placeholderText: {
    fontSize: 15,
    color: "#dee2e6",
    textAlign: "center",
  },

  bigButton: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  primaryButton: {
    backgroundColor: "#1c7ed6",
  },

  secondaryButton: {
    backgroundColor: "#495057",
  },

  bigButtonText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    flexShrink: 1,
  },

  smallButton: {
    borderWidth: 1.5,
    borderColor: "#ffffffcc",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginLeft: 8,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  smallButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: "#f1f3f5",
    backgroundColor: "transparent",
    marginTop: 8,
  },

  outlineButtonText: {
    color: "#f1f3f5",
    fontWeight: "600",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 20,
    gap: 12,
  },

  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },

  subjectLabel: {
    fontWeight: "700",
  },

  topicLabel: {
    marginTop: 2,
  },

  metaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
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
    alignItems: "stretch",
    gap: 12,
    marginVertical: 10,
    width: "100%",
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 12,
    marginBottom: 10,
    marginTop: 4,
    width: "100%",
  },

  ratingButton: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
    flexShrink: 1,
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
    gap: 8,
  },

  topicTitle: {
    fontWeight: "600",
    color: "#f8f9fa",
    flexShrink: 1,
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
    width: "100%",
  },

  topicChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
    maxWidth: "100%",
  },

  topicChipSelected: {
    backgroundColor: "#4c6ef5",
    borderColor: "#364fc7",
  },

  topicChipText: {
    fontSize: 14,
    color: "#343a40",
    flexShrink: 1,
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
    backgroundColor: "#000",
  },

  modalSafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    pointerEvents: "box-none",
  },

  modalContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  modalImageFrame: {
    justifyContent: "center",
    alignItems: "center",
  },

  zoomImage: {
    width: "100%",
    height: "100%",
  },

  zoomImageRotated: {
    transform: [{ rotate: "90deg" }],
  },

  modalCloseButton: {
    position: "absolute",
    top: 8,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },

  modalCloseText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 24,
    textAlign: "center",
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
    maxWidth: 900,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },

  statsLabel: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 2,
    flexShrink: 1,
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
    flexShrink: 1,
  },

  statsRankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
    width: "100%",
  },

  statsRankPosition: {
    width: 24,
    fontWeight: "700",
    color: "#212529",
  },

  statsRankName: {
    flex: 1,
    color: "#343a40",
    flexShrink: 1,
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
    gap: 12,
  },

  subjectStatsTitle: {
    fontWeight: "600",
    color: "#212529",
  },

  subjectStatsSub: {
    fontSize: 13,
    color: "#495057",
    flexShrink: 1,
  },
  gameHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    paddingTop: 8,
  },

  gameCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: "#ffffffcc",
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  gameCloseButtonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
  },

  textInput: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
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
    width: "100%",
  },

  classChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
    maxWidth: "100%",
  },

  classChipSelected: {
    backgroundColor: "#4c6ef5",
    borderColor: "#364fc7",
  },

  classChipText: {
    fontSize: 13,
    color: "#343a40",
    flexShrink: 1,
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
    lineHeight: 24,
  },

  drugHintText: {
    fontSize: 13,
    color: "#868e96",
    marginBottom: 12,
    lineHeight: 20,
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
    width: "100%",
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
    flexShrink: 0,
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
    flexShrink: 1,
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
    textAlign: "center",
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
    flexShrink: 1,
  },

  weeklyStartButton: {
    paddingHorizontal: 24,
  },

  weeklyStartButtonText: {
    fontSize: 22,
    textAlign: "center",
  },

  weeklyPlaceholderText: {
    marginTop: 16,
    fontSize: 14,
    color: "#e9ecef",
    textAlign: "center",
    flexShrink: 1,
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

export default styles;
