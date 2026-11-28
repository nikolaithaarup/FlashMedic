import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState, useEffect } from "react";
import {shortTopicNames} from "./drugCalcMenu";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
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
  useEffect(()=>{setHintVisible(false);setFeedbackExpanded(false);},[currentDrugQuestion?.id]);
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
                  label={shortTopicNames[topic.id]}
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
            <Text style={styles.eyebrow}>{shortTopicNames[currentDrugQuestion.topic]} · {currentDrugQuestion.syringe?"Aflæs sprøjten":exercise?.kind==='fields'?"Flere trin":exercise?.kind==='audit'?"Find fejlen":exercise?.kind==='dial'?exercise.device==='syringe'?"Indstil sprøjten":exercise.device==='tablets'?"Vælg tabletter":exercise.device==='bags'?"Vælg poser":exercise.device==='wheel'?"Indstil drejehjulet":"Indstil hastighed":"Beregn"}</Text>
            <Text style={styles.questionText}>{currentDrugQuestion.text}</Text>
            {currentDrugQuestion.labelData&&<View style={styles.vialLabel}><Text style={styles.vialName}>{currentDrugQuestion.labelData.title}</Text><Text style={styles.vialStrength}>{currentDrugQuestion.labelData.strength}</Text><Text style={styles.vialDetail}>{currentDrugQuestion.labelData.detail}</Text></View>}

            {currentDrugQuestion.syringe&&<SyringeExercise spec={currentDrugQuestion.syringe} value={currentDrugQuestion.syringe.volume} disabled readOnly/>}
            {exercise?.kind==='audit'&&<View style={styles.compactStack}>{exercise.options.map((option,i)=><SelectableChoice key={i} label={option} state={feedbackVisible?(i===exercise.correctIndex?'correct':response.choice===i?'incorrect':'default'):response.choice===i?'selected':'default'} disabled={!!feedbackVisible} dimWhenDisabled={false} onPress={()=>setDrugAnswer(JSON.stringify({...response,choice:i}))}/>)}</View>}
            {fields?fields.map((f,i)=><NumberInput key={i} label={f.label} unit={f.unit} value={response.values[i]} onChangeText={v=>changeField(i,v)} readOnly={!!feedbackVisible} inputProps={{placeholder:'Indtast tal',inputMode:'decimal'}} helperText={f.decimals===0?undefined:'Højst '+f.decimals+' decimal'+(f.decimals===1?'':'er')}/>):exercise?.kind==='dial'&&exercise.device==='syringe'?<SyringeExercise spec={{capacity:exercise.max,increment:exercise.increment}} value={parseDrugNumber(drugAnswer)??exercise.initial} onChange={v=>setDrugAnswer(String(v))} disabled={!!feedbackVisible}/>:exercise?.kind==='dial'?<View style={styles.compactStack}>
              <Text style={styles.detailLabel}>{exercise.label}</Text>
              {(exercise.device==='tablets'||exercise.device==='bags'||exercise.device==='wheel')&&<VisualDial exercise={exercise} value={parseDrugNumber(drugAnswer)??exercise.initial} unit={currentDrugQuestion.unit} disabled={!!feedbackVisible} onChange={v=>setDrugAnswer(String(v))}/>}
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
              <View style={styles.worked}>{currentDrugQuestion.calculationSteps.map((step,i)=><Text key={i} style={styles.bodyText}>{step}</Text>)}</View>
              {exercise?.kind==='audit'&&<ResultRow label="Første fejl" value={exercise.options[exercise.correctIndex]}/>}
              <ResultRow label="Formel" value={currentDrugQuestion.formula} />
              <Accordion
                expanded={feedbackExpanded}
                onToggle={() => setFeedbackExpanded((current) => !current)}
                style={styles.feedbackDetails}
                subtitle="Typiske fejl og kontrol"
                title="Mere om beregningen"
              >
                <View style={styles.feedbackContent}>
                  <DetailBlock label="Typisk faldgrube">
                    {currentDrugQuestion.commonPitfall}
                  </DetailBlock>
                  <DetailBlock label="Kontrol af svaret">
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

type VisualDialSpec = Extract<NonNullable<DrugCalcQuestion['exercise']>, {kind:'dial'}>;
function VisualDial({exercise,value,unit,disabled,onChange}:{exercise:VisualDialSpec;value:number;unit:string;disabled:boolean;onChange:(n:number)=>void}){
 const change=(delta:number)=>onChange(Math.round(Math.max(exercise.min,Math.min(exercise.max,value+delta))*1000)/1000);
 const isTablets=exercise.device==='tablets';
 const angle=-135+(value-exercise.min)/(exercise.max-exercise.min)*270;
 return <View style={visual.wrap}>
 {exercise.caption&&<Text style={visual.caption}>{exercise.caption}</Text>}
 {exercise.device==='wheel'?<View style={visual.wheel}>
   <View style={visual.rim}/>{Array.from({length:19},(_,i)=><View key={i} style={[visual.spoke,{transform:[{rotate:(-135+i*15)+'deg'}]}]}><View style={[visual.tick,i%3===0&&visual.majorTick]}/></View>)}
   <View style={[visual.pointerArm,{transform:[{rotate:angle+'deg'}]}]}><View style={visual.pointer}/></View>
   <View style={visual.hub}><Text style={visual.value}>{value.toLocaleString('da-DK')}</Text><Text style={visual.caption}>{unit}</Text></View>
 </View>:<View style={visual.objects}>
 {Array.from({length:Math.ceil(exercise.max)},(_,i)=>{const fill=Math.max(0,Math.min(1,value-i));return <Pressable key={i} disabled={disabled} accessibilityRole="button" accessibilityLabel={isTablets?'Tablet '+(i+1):'Pose '+(i+1)} accessibilityState={{selected:fill>0,disabled}} onPress={()=>onChange(isTablets?(fill===0?i+.5:fill===.5?i+1:i):fill>0?i:i+1)} style={visual.objectButton}>
 {isTablets?<View style={visual.pill}><View style={[visual.pillHalf,fill>=.5&&visual.pillOn]}/><View style={[visual.pillHalf,fill===1&&visual.pillOn]}/></View>:<View style={visual.bagWrap}><View style={[visual.bag,fill>0&&visual.bagOn]}><Text style={[visual.bagText,fill>0&&visual.bagTextOn]}>500</Text><Text style={[visual.bagText,fill>0&&visual.bagTextOn]}>mL</Text></View><View style={visual.bagStem}/></View>}
 </Pressable>;})}
 </View>}
 <View style={visual.controls}><Pressable accessibilityRole="button" accessibilityLabel="Mindsk" disabled={disabled||value<=exercise.min} onPress={()=>change(-exercise.increment)} style={[visual.adjust, (disabled||value<=exercise.min)&&visual.disabled]}><Text style={visual.adjustText}>−</Text></Pressable><Text style={visual.value}>{value.toLocaleString('da-DK')} {unit}</Text><Pressable accessibilityRole="button" accessibilityLabel="Øg" disabled={disabled||value>=exercise.max} onPress={()=>change(exercise.increment)} style={[visual.adjust,(disabled||value>=exercise.max)&&visual.disabled]}><Text style={visual.adjustText}>+</Text></Pressable></View>
 </View>;
}
const visual=StyleSheet.create({
 wrap:{gap:10,alignItems:'center',paddingVertical:8},caption:{color:ColorTokens.text.secondary,fontSize:13,textAlign:'center'},objects:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:8},objectButton:{minWidth:44,minHeight:48,alignItems:'center',justifyContent:'center'},pill:{width:44,height:30,borderRadius:15,borderWidth:1,borderColor:'#819b9c',overflow:'hidden',flexDirection:'row',backgroundColor:'#23363c'},pillHalf:{flex:1,borderRightWidth:1,borderRightColor:'#819b9c'},pillOn:{backgroundColor:'#d9ece9'},bagWrap:{alignItems:'center',padding:2},bag:{width:46,height:64,borderRadius:8,borderWidth:1,borderColor:'#78999e',backgroundColor:'#21363d',justifyContent:'center',alignItems:'center'},bagOn:{backgroundColor:'#bce9e5',borderColor:'#5bd0c5'},bagStem:{width:8,height:7,backgroundColor:'#78999e',borderBottomLeftRadius:2,borderBottomRightRadius:2},bagText:{color:'#b4c7cc',fontSize:10,fontWeight:'700'},bagTextOn:{color:'#14353b'},controls:{flexDirection:'row',alignItems:'center',gap:16,justifyContent:'center'},adjust:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'#5dbbb4',alignItems:'center',justifyContent:'center'},adjustText:{fontSize:26,color:ColorTokens.text.primary},disabled:{opacity:.35},value:{color:ColorTokens.text.primary,fontSize:22,fontWeight:'700',textAlign:'center'},wheel:{width:176,height:176,alignItems:'center',justifyContent:'center'},rim:{position:'absolute',width:162,height:162,borderRadius:81,borderWidth:2,borderColor:'#52757b',backgroundColor:'#14282f'},spoke:{position:'absolute',width:12,height:150,alignItems:'center'},tick:{width:2,height:7,backgroundColor:'#819b9c'},majorTick:{height:12,backgroundColor:'#d9ece9'},pointerArm:{position:'absolute',height:152,width:12,alignItems:'center'},pointer:{width:5,height:25,borderRadius:3,backgroundColor:'#50d1c4'},hub:{width:90,height:90,borderRadius:45,backgroundColor:'#21363d',alignItems:'center',justifyContent:'center'}
});
export default DrugCalcPracticeScreen;

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxl },
  worked:{gap:4,paddingVertical:6},
  vialLabel:{alignSelf:"stretch",padding:12,borderRadius:8,backgroundColor:"#f8f9fa",borderLeftWidth:6,borderLeftColor:"#169b96",gap:3},vialName:{color:"#344851",fontSize:12,fontWeight:"700"},vialStrength:{color:"#172b33",fontSize:22,fontWeight:"700"},vialDetail:{color:"#344851",fontSize:14},
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
