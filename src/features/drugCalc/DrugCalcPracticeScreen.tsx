import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import CaseScale from '../patientCases/CaseScale';
import SyringeExercise from './SyringeExercise';
import {evaluateDrugResponse,readDrugResponse,parseDrugNumber} from './drugCalcVariants';

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Accordion,
  Chip,
  NumberInput,
  PrimaryButton,
  ResultRow,
  ResultSummary,
  Screen,
  SecondaryButton,
  SelectableChoice,
  Surface,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  formatDrugAnswer,
  type DrugCalcQuestion,
  type DrugCalcTopic,
} from "./drugCalcContent";

type TopicMeta = { id: DrugCalcTopic; title: string; desc: string };

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  currentDrugQuestion: DrugCalcQuestion | null;
  drugAnswer: string;
  setDrugAnswer: (value: string) => void;
  drugAnswerStatus: "neutral" | "correct" | "incorrect";
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onBack: () => void;
  availableTopics: TopicMeta[];
  selectedTopics: DrugCalcTopic[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<DrugCalcTopic[]>>;
  onStartWithTopics: (topics: DrugCalcTopic[]) => void;
};

function DetailBlock({ label, children }: { label: string; children: string }) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
}

export function DrugCalcPracticeScreen({
  currentDrugQuestion,
  drugAnswer,
  setDrugAnswer,
  drugAnswerStatus,
  onCheckAnswer,
  onNextQuestion,
  onBack,
  availableTopics,
  selectedTopics,
  setSelectedTopics,
  onStartWithTopics,
}: Props) {
  const hasStarted = currentDrugQuestion !== null;
  const feedbackVisible = drugAnswerStatus !== "neutral" && currentDrugQuestion;
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);
  const [hintVisible,setHintVisible]=useState(false);
  const exercise=currentDrugQuestion?.exercise;
  const fields=exercise?.kind==='fields'||exercise?.kind==='audit'?exercise.fields:null;
  const response=readDrugResponse(drugAnswer,fields?.length??0);
  const changeField=(i:number,value:string)=>setDrugAnswer(JSON.stringify({...response,values:response.values.map((v,j)=>i===j?value:v)}));
  const canSubmit=currentDrugQuestion!==null&&evaluateDrugResponse(currentDrugQuestion,drugAnswer)!==null;
  const selectionSummary = useMemo(() => {
    if (selectedTopics.length === 0) return "Alle emner";
    if (selectedTopics.length === 1) {
      return (
        availableTopics.find((topic) => topic.id === selectedTopics[0])?.title ??
        "1 emne valgt"
      );
    }
    return `${selectedTopics.length} emner valgt`;
  }, [availableTopics, selectedTopics]);

  const toggleTopic = (id: DrugCalcTopic) => {
    setSelectedTopics((current) =>
      current.includes(id)
        ? current.filter((topic) => topic !== id)
        : [...current, id],
    );
  };

  return (
    <Screen
      contentContainerStyle={styles.content}
      keyboardAware
      scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}
      testID="drug-calc-practice-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til Lægemiddelregning"
        onBack={onBack}
          title="Træn beregninger"
      />

      <Accordion
        expanded={topicsExpanded}
        onToggle={() => setTopicsExpanded((current) => !current)}
        style={styles.section}
        subtitle={selectionSummary}
        title="Du træner"
      >
          <>
            <View style={styles.topicGrid}>
              {availableTopics.map((topic) => (
                <Chip
                  key={topic.id}
                  label={topic.title}
                  onPress={() => toggleTopic(topic.id)}
                  selected={selectedTopics.includes(topic.id)}
                />
              ))}
            </View>
            {hasStarted ? (
              <Text style={styles.changeHint}>Ændringer gælder næste opgave.</Text>
            ) : (
              <SecondaryButton
                label={selectedTopics.length === 0 ? "Start blandet træning" : "Træn valgte emner"}
                onPress={() => onStartWithTopics(selectedTopics)}
              />
            )}
          </>
      </Accordion>

      {currentDrugQuestion ? (
        <>
          <Surface elevated tone="elevated" style={styles.section}>
            <Text style={styles.eyebrow}>OPGAVE</Text>
            <Text style={styles.questionText}>{currentDrugQuestion.text}</Text>

            {currentDrugQuestion.syringe&&<SyringeExercise spec={currentDrugQuestion.syringe} value={currentDrugQuestion.syringe.volume} disabled readOnly/>}
            {exercise?.kind==='audit'&&<View style={styles.compactStack}>{exercise.options.map((option,i)=><SelectableChoice key={i} label={option} state={feedbackVisible?(i===exercise.correctIndex?'correct':response.choice===i?'incorrect':'default'):response.choice===i?'selected':'default'} disabled={!!feedbackVisible} dimWhenDisabled={false} onPress={()=>setDrugAnswer(JSON.stringify({...response,choice:i}))}/>)}</View>}
            {fields?fields.map((f,i)=><NumberInput key={i} label={f.label} unit={f.unit} value={response.values[i]} onChangeText={v=>changeField(i,v)} readOnly={!!feedbackVisible} inputProps={{placeholder:'Indtast tal',inputMode:'decimal'}} helperText={f.decimals===0?'Helt tal':undefined}/>):exercise?.kind==='dial'&&exercise.device==='syringe'?<SyringeExercise spec={{capacity:exercise.max,increment:exercise.increment}} value={parseDrugNumber(drugAnswer)??exercise.initial} onChange={v=>setDrugAnswer(String(v))} disabled={!!feedbackVisible}/>:exercise?.kind==='dial'?<View style={styles.compactStack}>
              <Text style={styles.detailLabel}>{exercise.label}</Text>

              <CaseScale min={exercise.min} max={exercise.max} step={exercise.increment} value={parseDrugNumber(drugAnswer)??exercise.initial} onChange={v=>setDrugAnswer(String(v))} unit={currentDrugQuestion.unit} disabled={!!feedbackVisible}/>
            </View>:<NumberInput clearable readOnly={!!feedbackVisible} helperText={currentDrugQuestion.roundingNote} inputProps={{placeholder:'Indtast tal',inputMode:'decimal'}} label="Dit svar" unit={currentDrugQuestion.unit} onChangeText={setDrugAnswer} value={drugAnswer}/>}
            {!feedbackVisible&&currentDrugQuestion.hint&&<><SecondaryButton label={hintVisible?'Skjul hjælp':'Vis hjælp'} onPress={()=>setHintVisible(v=>!v)}/>{hintVisible&&<Text style={styles.bodyText}>{currentDrugQuestion.hint}</Text>}</>}
            {!feedbackVisible&&<PrimaryButton disabled={!canSubmit} label="Tjek svar" onPress={()=>{Keyboard.dismiss();onCheckAnswer();}}/>}
          </Surface>
          {feedbackVisible ? (
            <ResultSummary
              style={styles.section}
              title={
                drugAnswerStatus === "correct"
                  ? "Korrekt beregnet"
                  : "Gennemgå beregningen"
              }
              tone={drugAnswerStatus === "correct" ? "success" : "danger"}
              value={`${formatDrugAnswer(currentDrugQuestion)} ${currentDrugQuestion.unit}`}
            >
              {fields?.map((f,i)=><ResultRow key={i} label={f.label} value={f.answer.toLocaleString('da-DK',{maximumFractionDigits:f.decimals})+' '+f.unit}/>)}
              {exercise?.kind==='audit'&&<ResultRow label="Første fejl" value={exercise.options[exercise.correctIndex]}/>}
              <ResultRow label="Formel" value={currentDrugQuestion.formula} />
              <Accordion
                expanded={feedbackExpanded}
                onToggle={() => setFeedbackExpanded((current) => !current)}
                style={styles.feedbackDetails}
                subtitle="Mellemregning, forklaring og kontrol"
                title="Se hele gennemgangen"
              >
                <View style={styles.feedbackContent}>
                  <View style={styles.detailBlock}>
                    <Text style={styles.detailLabel}>Beregning trin for trin</Text>
                    {currentDrugQuestion.calculationSteps.map((step, index) => (
                      <Text key={`${step}-${index}`} style={styles.bodyText}>
                        {index + 1}. {step}
                      </Text>
                    ))}
                  </View>
                  <DetailBlock label="Forklaring">
                    {currentDrugQuestion.explanation}
                  </DetailBlock>
                  <DetailBlock label="Typisk faldgrube">
                    {currentDrugQuestion.commonPitfall}
                  </DetailBlock>
                  <DetailBlock label="Plausibilitetskontrol">
                    {currentDrugQuestion.plausibilityCheck}
                  </DetailBlock>
                </View>
              </Accordion>
            </ResultSummary>
          ) : null}


          {feedbackVisible ? (
            <View style={styles.buttonStack}>
              <PrimaryButton
                label="Næste opgave"
                onPress={() => {
                  setFeedbackExpanded(false);
                  setHintVisible(false);
                  onNextQuestion();
                }}
              />
              <SecondaryButton label="Tilbage til Lægemiddelregning" onPress={onBack} />
            </View>
          ) : null}
        </>
      ) : (
        <Surface style={styles.section}>
          <Text style={styles.bodyText}>Vælg emner, og start træningen.</Text>
        </Surface>
      )}
    </Screen>
  );
}

export default DrugCalcPracticeScreen;

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxl },
  section: { gap: Spacing.sm, marginBottom: Spacing.sm },
  compactStack:{gap:Spacing.sm},dialValue:{fontSize:Typography.sizes.sectionTitle,color:ColorTokens.accent.primary,fontWeight:'700',textAlign:'center'},dialTrack:{height:12,borderRadius:6,backgroundColor:ColorTokens.surface.default,overflow:'hidden'},dialFill:{height:'100%',backgroundColor:ColorTokens.accent.primary},
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  questionText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.semibold,
  },
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  topicGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  changeHint: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  unitCallout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.accent.border,
    backgroundColor: ColorTokens.accent.surface,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  unitLabel: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  unitValue: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  detailBlock: { gap: Spacing.xs },
  detailLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  feedbackContent: { gap: Spacing.md },
  feedbackDetails: { marginTop: Spacing.md },
  buttonStack: { gap: Spacing.sm },
});
