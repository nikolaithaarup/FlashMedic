import {useCaseProgress} from './useCaseProgress';
import {filterProgress,progressFilters,summarizeProgress,type ProgressFilter} from './caseProgress';
import { curriculumMap } from './curriculumMap';
import React, { useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ColorTokens as C, Spacing, Radii } from '../../../constants/theme';
import { Screen, ToolPageHeader } from '../../ui/primitives';
import { patientCases } from './cases';
import { type Answer, type PatientCase, type Step, correctText, grade, parseNumber, pickCase, ready, levels, subjects, assignPair } from './caseEngine';
import CaseScale from './CaseScale';
import { featuredCase } from './weeklyCase';
import { monthlyCase } from './monthlyCase';
import { ekgImageLookup } from '../../data/ekg/imageLookup';
import FullscreenEkgImageModal from '../flashcards/components/FullscreenEkgImageModal';

function Button({label,onPress,selected=false,disabled=false,primary=false}:{label:string;onPress:()=>void;selected?:boolean;disabled?:boolean;primary?:boolean}){
 return <Pressable accessibilityRole="button" accessibilityState={{selected,disabled}} onPress={onPress} disabled={disabled} style={({pressed})=>[s.button,selected&&s.selected,primary&&s.primary,disabled&&s.disabled,pressed&&s.pressed]}><Text style={[s.body,primary&&s.primaryText]}>{label}</Text></Pressable>;
}
function Question({step,onNext,last}:{step:Step;onNext:(correct:boolean)=>void;last:boolean}){
 const [answer,setAnswer]=useState<Answer>(null);const [raw,setRaw]=useState('');const [submitted,setSubmitted]=useState(false);const [active,setActive]=useState<string|null>(step.kind==='match'?step.left[0]?.id??null:null);
 const [zoom,setZoom]=useState(false);const [imageFailed,setImageFailed]=useState(false);const image=step.imageKey?ekgImageLookup[step.imageKey]:undefined;
 const list=Array.isArray(answer)?answer:[];const pairs=answer!==null&&typeof answer==='object'&&!Array.isArray(answer)?answer:{};
 const correct=grade(step,answer);
 const toggle=(id:string)=>setAnswer(list.includes(id)?list.filter(v=>v!==id):[...list,id]);
 const pair=(rightId:string)=>{if(active===null||step.kind!=='match'||submitted)return;const next=assignPair(pairs,active,rightId);setAnswer(next);setActive(step.left.find(l=>!next[l.id])?.id??null);};
 return <View style={s.stack}>
  {step.imageKey&&(image&&!imageFailed?<><Pressable accessibilityRole="button" accessibilityLabel="Åbn EKG i fuld skærm" onPress={()=>setZoom(true)} style={s.ecgFrame}><Image source={image} resizeMode="contain" style={s.ecgImage} accessibilityLabel="EKG til fortolkning" onError={()=>setImageFailed(true)}/><Text style={s.ecgHint}>Forstør EKG ↗</Text></Pressable>{zoom&&<FullscreenEkgImageModal visible imageSource={image} rotate={false} onClose={()=>setZoom(false)}/>}</>:<View style={s.update}><Text style={s.body}>EKG kunne ikke indlæses. Gå tilbage og prøv igen.</Text></View>)}
  <Text style={s.question}>{step.prompt}</Text>
  {(step.kind==='choice'||step.kind==='multi')&&step.options.map(o=><Button key={o.id} label={`${step.kind==='multi'?(list.includes(o.id)?'☑  ':'☐  '):''}${o.text}`} selected={step.kind==='choice'?answer===o.id:list.includes(o.id)} disabled={submitted} onPress={()=>step.kind==='choice'?setAnswer(o.id):toggle(o.id)}/>)}
  {step.kind==='number'&&<View style={s.numberRow}><TextInput accessibilityLabel={`Svar i ${step.unit}`} style={s.input} keyboardType="decimal-pad" value={raw} placeholder="Indtast svar" placeholderTextColor={C.text.muted} editable={!submitted} onChangeText={v=>{setRaw(v);setAnswer(parseNumber(v));}}/><Text style={s.body}>{step.unit}</Text></View>}
  {step.kind==='scale'&&<CaseScale min={step.min} max={step.max} step={step.step} unit={step.unit} value={typeof answer==='number'?answer:null} disabled={submitted} onChange={setAnswer}/>}
  {step.kind==='match'&&<View style={s.stack}>
   <Text style={s.meta}>{Object.keys(pairs).length}/{step.left.length} par · Vælg et begreb, derefter dets match.</Text>
   <View style={s.filters}>{step.left.map((l,i)=><Button key={l.id} label={`${i+1}. ${l.text}${pairs[l.id]?' ✓':''}`} selected={active===l.id} disabled={submitted} onPress={()=>setActive(l.id)}/>)}</View>
   {!submitted&&active!==null&&<Text style={s.accent}>MATCH: {step.left.find(l=>l.id===active)?.text}</Text>}
   {step.right.map(r=>{const owner=step.left.findIndex(l=>pairs[l.id]===r.id);return <Button key={r.id} label={`${owner<0?'–':owner+1}. ${r.text}`} selected={owner>=0} disabled={submitted||active===null} onPress={()=>pair(r.id)}/>;})}
   {!submitted&&<Pressable accessibilityRole="button" style={s.smallAction} onPress={()=>{setAnswer(null);setActive(step.left[0]?.id??null);}}><Text style={s.link}>Nulstil par</Text></Pressable>}
  </View>}
  {step.kind==='order'&&<View style={s.stack}><Text style={s.meta}>Tryk i den rigtige rækkefølge. Tryk igen for at fjerne.</Text>{list.map((id,i)=><Button key={id} label={`${i+1}. ${step.options.find(o=>o.id===id)?.text}`} selected disabled={submitted} onPress={()=>toggle(id)}/>)}{step.options.filter(o=>!list.includes(o.id)).map(o=><Button key={o.id} label={o.text} disabled={submitted} onPress={()=>toggle(o.id)}/>)}</View>}
  {submitted?<><View accessibilityLiveRegion="polite" style={[s.feedback,{borderColor:correct?C.semantic.success:C.semantic.warning}]}><Text style={[s.question,{color:correct?C.semantic.success:C.semantic.warning}]}>{correct?'Korrekt!':'Ikke helt'}</Text>{!correct&&<Text style={s.body}>Rigtigt svar: {correctText(step)}</Text>}<Text style={s.body}>{step.explanation}</Text></View><Button primary label={last?'Se resultat':'Næste spørgsmål'} onPress={()=>onNext(correct)}/></>:<Button primary label="Bekræft svar" disabled={!ready(step,answer)||Boolean(step.imageKey&&(!image||imageFailed))} onPress={()=>setSubmitted(true)}/>}
 </View>;
}
function Chip({label,onPress,selected=false,disabled=false,done=false}:{label:string;onPress:()=>void;selected?:boolean;disabled?:boolean;done?:boolean}){
 return <Pressable accessibilityRole="button" accessibilityState={{selected,disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[s.chip,selected&&s.selected,disabled&&s.disabled,pressed&&s.pressed]}><Text style={[s.chipText,selected&&s.activeText]}>{label}</Text>{done&&<Feather name="check" color={C.semantic.success} size={14}/>}</Pressable>;
}
export default function PatientCasesScreen({onBack,userId=null}:{onBack:()=>void;userId?:string|null}){
 const {progress,status,saveError,complete}=useCaseProgress(userId);
 const [progressFilter,setProgressFilter]=useState<ProgressFilter>("Alle");
 const completionGuard=React.useRef(false);
 const summary=summarizeProgress(patientCases,progress);
 const [selected,setSelected]=useState<PatientCase|null>(null);const [category,setCategory]=useState('Alle');const [difficulty,setDifficulty]=useState('Alle');const [index,setIndex]=useState(0);const [results,setResults]=useState<boolean[]>([]);const [previous,setPrevious]=useState<string>();const [attempt,setAttempt]=useState(0);
 const [showContext,setShowContext]=useState(false);const [showReview,setShowReview]=useState(false);const [visibleCount,setVisibleCount]=useState(12);
 const [subject,setSubject]=useState('Alle');const [query,setQuery]=useState('');const [showFilters,setShowFilters]=useState(false);
 const featured=featuredCase(patientCases);
 const resetFilters=()=>{setSubject('Alle');setCategory('Alle');setDifficulty('Alle');setQuery('');setProgressFilter('Alle');};
 const extraCount=Number(subject!=='Alle')+Number(category!=='Alle')+Number(progressFilter!=='Alle');
 const hasFilters=extraCount>0||difficulty!=='Alle'||!!query.trim();
 const filteredPool=patientCases.filter(c=>(category==='Alle'||c.category===category)&&(difficulty==='Alle'||c.difficulty===difficulty)&&(subject==='Alle'||c.subjects.some(t=>t===subject))&&(!query.trim()||`${c.title} ${c.category} ${c.subjects.join(' ')}`.toLocaleLowerCase('da-DK').includes(query.trim().toLocaleLowerCase('da-DK'))));
 const pool=filterProgress(filteredPool,progress,progressFilter);
 const groups=Array.from(new Set(pool.map(c=>c.familyId??c.id))).map(id=>pool.filter(c=>(c.familyId??c.id)===id));
 const start=(c:PatientCase,keepEdition=false)=>{if(status==='loading')return;completionGuard.current=false;setSelected(keepEdition?c:monthlyCase(c));setShowContext(false);setShowReview(false);setPrevious(c.id);setIndex(0);setResults([]);setAttempt(a=>a+1);};
 const back=()=>{if(selected){setSelected(null);setIndex(0);setResults([]);}else onBack();};
 React.useEffect(()=>{setVisibleCount(12);},[category,difficulty,subject,query,progressFilter]);
 const done=!!selected&&index>=selected.steps.length;
 const revealed=selected?.steps.slice(0,index+1).filter(step=>step.update)??[];
 return <Screen key={selected?`${attempt}:${index}`:"library"} testID="patient-cases-screen" contentContainerStyle={s.container}><StatusBar style="light"/><ToolPageHeader title="Patientcases" backLabel={selected?'Cases':'Forside'} onBack={back}/>
 {!selected?<View style={s.library}>
  <View style={s.summaryRow}>
   <Text style={s.meta}>{status==='loading'?'Henter fremgang…':status==='unavailable'?'Fremgang utilgængelig':`${summary.completed}/${summary.total} gennemført`}</Text>
   {summary.firstAccuracy!==null&&<Text style={s.meta}>{summary.firstAccuracy}% ved første forsøg</Text>}
  </View>
  <View style={s.track}><View style={[s.fill,{width:`${summary.total?summary.completed/summary.total*100:0}%`}]}/></View>
  {saveError&&<Text style={s.meta}>Fremgang kunne ikke gemmes.</Text>}
  <View style={s.quickRow}>
   <Pressable accessibilityRole="button" disabled={status==='loading'||!pool.length} onPress={()=>{const c=pickCase(pool,previous);if(c)start(c);}} style={({pressed})=>[s.quick,s.quickPrimary,(status==='loading'||!pool.length)&&s.disabled,pressed&&s.pressed]}><Feather name="shuffle" size={18} color={C.background.base}/><Text style={s.quickPrimaryText}>Tilfældig case</Text></Pressable>
   {featured&&<Pressable accessibilityRole="button" accessibilityLabel={`Ugens case: ${featured.title}, ${featured.difficulty}`} disabled={status==='loading'} onPress={()=>start(featured)} style={({pressed})=>[s.quick,status==='loading'&&s.disabled,pressed&&s.pressed]}><Feather name="calendar" size={18} color={C.accent.focus}/><View style={s.grow}><Text style={s.rowTitle}>Ugens case</Text><Text style={s.caption} numberOfLines={1}>{featured.title}</Text></View><Feather name="chevron-right" size={16} color={C.text.secondary}/></Pressable>}
  </View>
  <View style={s.searchRow}>
   <View style={s.searchField}><Feather name="search" size={18} color={C.text.secondary}/><TextInput accessibilityLabel="Søg i patientcases" value={query} onChangeText={setQuery} placeholder="Søg cases" placeholderTextColor={C.text.secondary} style={s.searchInput}/>{!!query&&<Pressable accessibilityRole="button" accessibilityLabel="Ryd søgning" onPress={()=>setQuery('')} style={s.iconAction}><Feather name="x" size={18} color={C.text.secondary}/></Pressable>}</View>
   <Pressable accessibilityRole="button" accessibilityLabel="Filtre" accessibilityState={{expanded:showFilters}} onPress={()=>setShowFilters(v=>!v)} style={[s.filterAction,(showFilters||extraCount>0)&&s.selected]}><Feather name="sliders" size={17} color={C.accent.focus}/><Text style={s.chipText}>Filtre{extraCount>0?` (${extraCount})`:''}</Text></Pressable>
  </View>
  <View style={s.levelRow}>{['Alle',...levels].map(d=><Chip key={d} label={d} selected={difficulty===d} onPress={()=>setDifficulty(d)}/>)}</View>
  {showFilters&&<View style={s.filterPanel}>
   <Text style={s.accent}>STATUS</Text><View style={s.filters}>{progressFilters.map(f=><Chip key={f} label={f} selected={progressFilter===f} onPress={()=>setProgressFilter(f)}/>)}</View>
   <Text style={s.accent}>FAG</Text><View style={s.filters}>{['Alle',...subjects].map(t=><Chip key={t} label={t} selected={subject===t} onPress={()=>setSubject(t)}/>)}</View>
   <Text style={s.accent}>EMNE</Text><View style={s.filters}>{['Alle',...new Set(patientCases.map(c=>c.category))].map(c=><Chip key={c} label={c} selected={category===c} onPress={()=>setCategory(c)}/>)}</View>
   <View style={s.summaryRow}><Chip label="Nulstil" onPress={resetFilters}/><Chip label="Vis cases" selected onPress={()=>setShowFilters(false)}/></View>
  </View>}
  <View style={s.summaryRow}><Text style={s.accent}>CASES · {groups.length}</Text>{hasFilters&&<Pressable accessibilityRole="button" onPress={resetFilters} style={s.smallReset}><Text style={s.caption}>Nulstil filtre</Text></Pressable>}</View>
  <View style={s.caseGrid}>{groups.slice(0,visibleCount).map(group=>{const c=group[0];const disabled=status==='loading';return group.length===1?
   <Pressable key={c.id} accessibilityRole="button" accessibilityLabel={`${c.title}, ${c.difficulty}`} disabled={disabled} onPress={()=>start(c)} style={({pressed})=>[s.caseRow,s.singleCase,disabled&&s.disabled,pressed&&s.pressed]}>
    <View style={s.grow}><Text style={s.rowTitle}>{c.title}</Text><Text style={s.caption}>{c.category} · {c.difficulty}{progress[c.id]?` · ✓ ${progress[c.id].latest.correct}/${progress[c.id].latest.total}`:''}</Text></View><Feather name="chevron-right" size={17} color={C.text.secondary}/>
   </Pressable>:
   <View key={c.familyId??c.id} style={s.caseRow}><Text style={s.rowTitle}>{c.title}</Text><Text style={s.caption}>{c.category}</Text><View style={s.variantRow}>{levels.map(level=>{const variant=group.find(item=>item.difficulty===level);return variant?<Chip key={level} label={level} done={!!progress[variant.id]} disabled={disabled} onPress={()=>start(variant)}/>:null;})}</View></View>;
  })}</View>
  {groups.length>visibleCount&&<Button label={`Vis flere (${groups.length-visibleCount})`} onPress={()=>setVisibleCount(v=>v+12)}/>}
  {!pool.length&&<Text style={s.meta}>Ingen cases matcher filtrene.</Text>}
  <Text style={s.educationNote}>Fiktive undervisningscases. Ikke fagligt godkendte kliniske instrukser.</Text>
 </View>:done?<View style={s.stack}>
  <Text style={s.accent}>CASE AFSLUTTET</Text><Text style={s.title}>{selected.title}</Text><Text style={s.score}>{results.filter(Boolean).length} / {selected.steps.length}</Text><Text style={s.meta}>Korrekte svar</Text>{(saveError||status==='unavailable')&&<Text style={s.meta}>Fremgang kunne ikke gemmes på enheden.</Text>}<Text style={s.question}>Husk</Text><Text style={s.body}>{selected.takeaway}</Text>
  <Button label={showReview?"Skjul gennemgang":"Gennemgang"} onPress={()=>setShowReview(v=>!v)}/>{showReview&&<><Text style={s.accent}>LÆRINGSMÅL</Text>{selected.objectives.map(objective=><Text key={objective} style={s.body}>• {objective}</Text>)}<Text style={s.accent}>GENNEMGANG</Text>{selected.steps.map((step,i)=><View key={step.id} style={s.review}><Text style={{color:results[i]?C.semantic.success:C.semantic.warning,fontWeight:'700'}}>{results[i]?'✓ Korrekt':'✕ Forkert'}</Text><Text style={s.question}>{step.prompt}</Text><Text style={s.body}>{correctText(step)}</Text><Text style={s.meta}>{step.explanation}</Text></View>)}
  {curriculumMap[selected.id]&&<><Text style={s.accent}>LUP · EMNETILKNYTNING</Text><Text style={s.meta}>U/NORD, august 2024 · {curriculumMap[selected.id].topic}, s. {curriculumMap[selected.id].page}. </Text></>}<Text style={s.accent}>KILDER OG LÆSEFORSLAG</Text>{selected.sources.map(source=><Pressable key={source.url} accessibilityRole="link" onPress={()=>{void Linking.openURL(source.url).catch(()=>{});}}><Text style={s.link}>{source.title} ↗</Text></Pressable>)}
  </>}<Button primary label="Næste tilfældige case" onPress={()=>{const c=pickCase(pool,selected.id);if(c)start(c);}} disabled={!pool.length}/><Button label="Prøv igen" onPress={()=>start(selected,true)}/>{selected.familyId&&<><Text style={s.accent}>ANDRE NIVEAUER</Text><View style={s.filters}>{levels.map(level=>{const variant=patientCases.find(c=>c.familyId===selected.familyId&&c.difficulty===level&&c.id!==selected.id);return variant?<Button key={level} label={level} onPress={()=>start(selected.edition?monthlyCase(variant,new Date(`${selected.edition}-15T12:00:00Z`)):variant,true)}/>:null;})}</View></>}<Button label="Alle cases" onPress={back}/>
 </View>:<View style={s.stack}>
  <View style={s.progressLabel}><Text style={s.accent}>{selected.category.toUpperCase()} · {selected.difficulty}</Text><Text style={s.meta}>{index+1} / {selected.steps.length}</Text></View><View accessibilityRole="progressbar" accessibilityValue={{min:0,max:selected.steps.length,now:index+1}} style={s.track}><View style={[s.fill,{width:`${(index+1)/selected.steps.length*100}%`}]}/></View>
  <Text style={s.title}>{selected.title}</Text>{selected.edition&&<Text style={s.meta}>Månedsvariant · {selected.edition}</Text>}
  <View style={s.caseLayout}><View style={s.contextPanel}>
  {(index===0||showContext)&&<Text style={s.body}>{selected.intro}</Text>}
  <View style={s.vitals}>{Object.entries(selected.vitals).map(([k,v])=><View key={k} style={s.vital}><Text style={s.meta}>{k}</Text><Text style={s.vitalValue}>{v}</Text></View>)}</View>
  {index>0&&<Pressable accessibilityRole="button" accessibilityState={{expanded:showContext}} onPress={()=>setShowContext(v=>!v)} style={s.smallAction}><Text style={s.link}>{showContext?'Skjul patienthistorik':'Vis patienthistorik'}</Text></Pressable>}
  {(showContext?revealed:revealed.slice(-1)).map(step=><View key={step.id} style={s.update}><Text style={s.accent}>NY OPLYSNING</Text><Text style={s.body}>{step.update}</Text></View>)}
  </View><View style={s.questionPanel}><Question key={`${selected.id}:${attempt}:${index}`} step={selected.steps[index]} last={index===selected.steps.length-1} onNext={correct=>{if(results.length!==index)return;const next=[...results,correct];if(index===selected.steps.length-1){if(completionGuard.current)return;completionGuard.current=true;complete(selected,next);}setResults(next);setIndex(index+1);setShowContext(false);}}/></View></View>
 </View>}
 </Screen>;
}
const s=StyleSheet.create({library:{gap:8},summaryRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'},grow:{flex:1,minWidth:0},quickRow:{flexDirection:'row',flexWrap:'wrap',gap:6},quick:{flexBasis:145,flexGrow:1,flexShrink:1,minHeight:52,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:10,paddingVertical:7,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.tool},quickPrimary:{backgroundColor:C.accent.focus,borderColor:C.accent.focus,justifyContent:'center'},quickPrimaryText:{color:C.background.base,fontSize:14,fontWeight:'700',flexShrink:1},rowTitle:{color:C.text.primary,fontSize:14,fontWeight:'700',lineHeight:19},caption:{color:C.text.secondary,fontSize:12,lineHeight:16},searchRow:{flexDirection:'row',gap:6,alignItems:'stretch'},searchField:{flex:1,minWidth:0,minHeight:44,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:9,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.inverse},searchInput:{flex:1,minWidth:0,minHeight:44,color:C.text.primary,fontSize:16,paddingVertical:6},iconAction:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center'},filterAction:{minHeight:44,flexDirection:'row',gap:6,alignItems:'center',justifyContent:'center',paddingHorizontal:10,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm},chip:{flexDirection:'row',alignItems:'center',justifyContent:'center',flexGrow:1,minHeight:44,paddingHorizontal:7,paddingVertical:5,gap:3,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.tool},chipText:{color:C.text.primary,fontSize:12,fontWeight:'600',flexShrink:1,textAlign:'center'},activeText:{color:C.accent.focus},levelRow:{flexDirection:'row',flexWrap:'wrap',gap:4},variantRow:{flexDirection:'row',flexWrap:'wrap',gap:4,marginTop:4},filterPanel:{gap:6,paddingVertical:8,borderTopWidth:1,borderBottomWidth:1,borderColor:C.border.divider},smallReset:{minHeight:44,justifyContent:'center'},caseGrid:{flexDirection:'row',flexWrap:'wrap',columnGap:12,rowGap:0},caseRow:{flexBasis:325,flexGrow:1,flexShrink:1,minWidth:0,gap:2,paddingVertical:8,borderBottomWidth:1,borderColor:C.border.divider},singleCase:{flexDirection:'row',alignItems:'center',minHeight:64},educationNote:{color:C.text.secondary,fontSize:11,lineHeight:15,marginTop:4},matchGrid:{flexDirection:'row',gap:8,alignItems:'flex-start'},matchColumn:{flex:1,minWidth:0,gap:8},family:{padding:12,gap:6,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.md,backgroundColor:C.surface.tool},container:{maxWidth:900,paddingBottom:Spacing.lg},stack:{gap:7},caseLayout:{flexDirection:"row",flexWrap:"wrap",gap:12,alignItems:"flex-start"},contextPanel:{flexGrow:1,flexShrink:1,flexBasis:250,maxWidth:"100%",minWidth:0,gap:7},questionPanel:{flexGrow:2,flexShrink:1,flexBasis:400,maxWidth:"100%",minWidth:0},smallAction:{minHeight:44,justifyContent:"center"},ecgFrame:{backgroundColor:"#fff",borderRadius:8,overflow:"hidden"},ecgImage:{width:"100%",height:156},ecgHint:{color:"#163d45",textAlign:"right",fontWeight:"600",fontSize:12,padding:8},filters:{flexDirection:'row',flexWrap:'wrap',gap:6},body:{flexShrink:1,color:C.text.primary,fontSize:15,lineHeight:21},meta:{color:C.text.secondary,fontSize:13,lineHeight:19},accent:{color:C.accent.focus,fontSize:12,fontWeight:'700',letterSpacing:.5},title:{color:C.text.primary,fontSize:20,fontWeight:'700',lineHeight:26},question:{color:C.text.primary,fontSize:16,fontWeight:'700',lineHeight:24},button:{minHeight:48,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.md,paddingHorizontal:10,paddingVertical:7,justifyContent:'center',backgroundColor:C.surface.tool},selected:{borderColor:C.accent.focus,backgroundColor:C.accent.selected},primary:{backgroundColor:C.accent.focus,borderColor:C.accent.focus,alignItems:'center'},primaryText:{color:C.background.base,fontWeight:'700'},disabled:{opacity:.55},pressed:{opacity:.8},feedback:{borderLeftWidth:3,padding:12,gap:6,backgroundColor:C.surface.inverse,borderRadius:8},numberRow:{flexDirection:'row',alignItems:'center',gap:12},input:{minHeight:48,flex:1,borderRadius:10,borderWidth:1,borderColor:C.border.default,paddingHorizontal:12,color:C.text.primary,fontSize:18,backgroundColor:C.surface.inverse},vitals:{flexDirection:'row',flexWrap:'wrap',gap:8,backgroundColor:C.surface.inverse,borderRadius:10,padding:10},vital:{flexGrow:1,minWidth:78,gap:1},vitalValue:{fontSize:17,color:C.accent.focus,fontWeight:'700'},progressLabel:{flexDirection:'row',justifyContent:'space-between'},track:{height:5,backgroundColor:C.border.default,borderRadius:5,overflow:'hidden'},fill:{height:5,backgroundColor:C.accent.focus},update:{paddingLeft:12,borderLeftWidth:2,borderLeftColor:C.accent.focus,gap:3},score:{color:C.accent.focus,fontSize:42,fontWeight:'800'},review:{borderBottomWidth:1,borderBottomColor:C.border.divider,paddingVertical:10,gap:4},link:{color:C.accent.focus,textDecorationLine:'underline',paddingVertical:8}});
