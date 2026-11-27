import {useCaseProgress} from './useCaseProgress';
import {filterProgress,progressFilters,summarizeProgress,progressForMonth,type ProgressFilter} from './caseProgress';
import { curriculumMap } from './curriculumMap';
import React, { useState } from 'react';
import { Image, Keyboard, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ColorTokens as C, Spacing, Radii } from '../../../constants/theme';
import { Screen, ToolPageHeader } from '../../ui/primitives';
import { patientCases } from './cases';
import { type Answer, type PatientCase, type Step, correctText, grade, parseNumber, pickCase, ready, levels, subjects, assignPair, currentVitals, type Level } from './caseEngine';
import CaseScale from './CaseScale';
import {VisualExercise,ChainExercise} from './VisualExercise';
import { danishWeekStart, weeklySchedule } from './weeklyCase';
import { monthlyCase, monthEdition } from './monthlyCase';
import { ekgImageLookup } from '../../data/ekg/imageLookup';
import FullscreenEkgImageModal from '../flashcards/components/FullscreenEkgImageModal';

function Button({label,onPress,selected=false,disabled=false,primary=false}:{label:string;onPress:()=>void;selected?:boolean;disabled?:boolean;primary?:boolean}){
 return <Pressable accessibilityRole="button" accessibilityState={{selected,disabled}} onPress={onPress} disabled={disabled} style={({pressed})=>[s.button,selected&&s.selected,primary&&s.primary,disabled&&s.disabled,pressed&&s.pressed]}><Text style={[s.body,primary&&s.primaryText]}>{label}</Text></Pressable>;
}
function Question({step,onNext,last}:{step:Step;onNext:(correct:boolean)=>void;last:boolean}){
 const [answer,setAnswer]=useState<Answer>(null);const [raw,setRaw]=useState('');const [submitted,setSubmitted]=useState(false);const [active,setActive]=useState<string|null>(null);const [rightActive,setRightActive]=useState<string|null>(null);
 const [zoom,setZoom]=useState(false);const [imageFailed,setImageFailed]=useState(false);const image=step.imageKey?ekgImageLookup[step.imageKey]:undefined;
 const list=Array.isArray(answer)?answer:[];const pairs=answer!==null&&typeof answer==='object'&&!Array.isArray(answer)?answer:{};
 const correct=grade(step,answer);
 const toggle=(id:string)=>setAnswer(list.includes(id)?list.filter(v=>v!==id):[...list,id]);
 const pair=(leftId:string,rightId:string)=>{setAnswer(assignPair(pairs,leftId,rightId));setActive(null);setRightActive(null);};
 const unpair=(leftId:string)=>{setAnswer(Object.fromEntries(Object.entries(pairs).filter(([key])=>key!==leftId)));setActive(null);setRightActive(null);};
 const tapLeft=(id:string)=>{if(submitted)return;if(rightActive!==null){pair(id,rightActive);return;}if(pairs[id]){unpair(id);return;}setActive(active===id?null:id);};
 const tapRight=(id:string)=>{if(submitted)return;if(active!==null){pair(active,id);return;}const owner=Object.keys(pairs).find(key=>pairs[key]===id);if(owner){unpair(owner);return;}setRightActive(rightActive===id?null:id);};
 const pairColors=['#5EEAD4','#F2CE78','#A9B9FF','#F3A9C7','#A9DA87','#D4B5FF'];
 const renderTile=(item:{id:string;text:string},side:'left'|'right')=>{
  if(step.kind!=='match')return null;
  const owner=side==='left'?item.id:Object.keys(pairs).find(k=>pairs[k]===item.id);
  const paired=owner!==undefined&&!!pairs[owner];const i=step.left.findIndex(l=>l.id===owner);
  const picked=side==='left'?active===item.id:rightActive===item.id;
  const color=paired?(submitted?(pairs[owner!]===step.correct[owner!]?C.semantic.success:C.semantic.warning):pairColors[Math.max(0,i)%pairColors.length]):picked?C.accent.focus:C.border.default;
  const partner=paired?(side==='left'?step.right.find(r=>r.id===pairs[owner!])?.text:step.left.find(l=>l.id===owner)?.text):undefined;
  return <Pressable key={item.id} accessibilityRole="button" accessibilityState={{selected:picked,disabled:submitted}} accessibilityLabel={item.text+(partner?', parret med '+partner:'')} accessibilityHint={paired?'Tryk for at fjerne parret':'Tryk for at vælge'} disabled={submitted} onPress={()=>side==='left'?tapLeft(item.id):tapRight(item.id)} style={({pressed})=>[s.matchTile,{borderColor:color},picked&&s.selected,paired&&{backgroundColor:color+'18'},pressed&&s.pressed]}>
   <Text style={s.matchText}>{item.text}</Text>{paired&&<View style={s.pairMarker}><Feather name={submitted?(pairs[owner!]===step.correct[owner!]?'check':'x'):'link'} size={13} color={color}/><Text style={[s.pairLabel,{color}]}>{i+1}</Text></View>}
  </Pressable>;
 };
 return <View style={s.stack}>
  {step.imageKey&&(image&&!imageFailed?<><Pressable accessibilityRole="button" accessibilityLabel="Åbn EKG i fuld skærm" onPress={()=>setZoom(true)} style={s.ecgFrame}><Image source={image} resizeMode="contain" style={s.ecgImage} accessibilityLabel="EKG til fortolkning" onError={()=>setImageFailed(true)}/><Text style={s.ecgHint}>Forstør EKG ↗</Text></Pressable>{zoom&&<FullscreenEkgImageModal visible imageSource={image} rotate={false} onClose={()=>setZoom(false)}/>}</>:<View style={s.update}><Text style={s.body}>EKG kunne ikke indlæses. Gå tilbage og prøv igen.</Text></View>)}
  <Text style={s.question}>{step.prompt}</Text>
  {(step.kind==='choice'||step.kind==='multi')&&step.options.map(o=><Button key={o.id} label={`${step.kind==='multi'?(list.includes(o.id)?'☑  ':'☐  '):''}${o.text}`} selected={step.kind==='choice'?answer===o.id:list.includes(o.id)} disabled={submitted} onPress={()=>step.kind==='choice'?setAnswer(o.id):toggle(o.id)}/>)}
  {step.kind==='number'&&<View style={s.numberRow}><TextInput accessibilityLabel={`Svar i ${step.unit}`} style={s.input} keyboardType="decimal-pad" inputMode="decimal" autoCorrect={false} autoCapitalize="none" selectTextOnFocus={false} value={raw} placeholder="Indtast svar" placeholderTextColor={C.text.muted} editable={!submitted} onChangeText={v=>{setRaw(v);setAnswer(parseNumber(v));}}/><Text style={s.body}>{step.unit}</Text></View>}
  {step.kind==='scale'&&<CaseScale min={step.min} max={step.max} step={step.step} unit={step.unit} value={typeof answer==='number'?answer:null} disabled={submitted} onChange={setAnswer}/>}
  {step.kind==='match'&&<View style={s.stack}>
   <View style={s.summaryRow}><Text style={s.meta}>Forbind felterne.</Text><Text style={s.accent}>{Object.keys(pairs).length}/{step.left.length}</Text></View>
   <View style={s.matchGrid}><View style={s.matchColumn}>{step.left.map(item=>renderTile(item,'left'))}</View><View style={s.matchColumn}>{step.right.map(item=>renderTile(item,'right'))}</View></View>
   {!submitted&&Object.keys(pairs).length>0&&<View style={s.summaryRow}><Text style={s.caption}>Tryk på et par for at ophæve.</Text><Pressable accessibilityRole="button" onPress={()=>{setAnswer(null);setActive(null);setRightActive(null);}} style={s.smallAction}><Text style={s.link}>Nulstil</Text></Pressable></View>}
  </View>}
  {step.kind==='short'&&<TextInput accessibilityLabel="Skriv kort fagligt svar" style={s.input} value={raw} placeholder="Skriv svaret" placeholderTextColor={C.text.muted} editable={!submitted} autoCorrect={false} autoCapitalize="none" returnKeyType="done" onChangeText={v=>{setRaw(v);setAnswer(v);}}/>}
  {step.kind==='classify'&&<View style={s.stack}>
   <Text style={s.meta}>{Object.keys(pairs).length}/{step.items.length} placeret</Text>
   {step.items.map(item=><View key={item.id} style={s.classifyRow}><Text style={s.rowTitle}>{item.text}</Text><View style={s.classifyChoices}>{step.categories.map(cat=>{const chosen=pairs[item.id]===cat.id;const good=submitted&&chosen&&step.correct[item.id]===cat.id;const bad=submitted&&chosen&&!good;return <Pressable key={cat.id} accessibilityRole="button" accessibilityState={{selected:chosen,disabled:submitted}} accessibilityLabel={item.text+': '+cat.text} disabled={submitted} onPress={()=>setAnswer({...pairs,[item.id]:cat.id})} style={({pressed})=>[s.classifyChoice,chosen&&s.selected,good&&{borderColor:C.semantic.success},bad&&{borderColor:C.semantic.warning},pressed&&s.pressed]}><Text style={[s.chipText,chosen&&s.activeText]}>{cat.text}</Text>{good&&<Feather name="check" size={14} color={C.semantic.success}/>}</Pressable>;})}</View></View>)}
  </View>}
  {step.kind==='order'&&<ChainExercise step={step} selected={list} disabled={submitted} onChange={setAnswer}/>}
  {(step.kind==='hotspot'||step.kind==='model'||step.kind==='clues')&&<VisualExercise step={step} answer={answer} submitted={submitted} onChange={setAnswer}/>}
  {submitted?<><View accessibilityLiveRegion="polite" style={[s.feedback,{borderColor:correct?C.semantic.success:C.semantic.warning}]}><Text style={[s.question,{color:correct?C.semantic.success:C.semantic.warning}]}>{correct?'Korrekt!':'Ikke helt'}</Text>{!correct&&<Text style={s.body}>Rigtigt svar: {correctText(step)}</Text>}<Text style={s.body}>{step.explanation}</Text></View><Button primary label={last?'Se resultat':'Næste spørgsmål'} onPress={()=>onNext(correct)}/></>:<Button primary label="Bekræft svar" disabled={!ready(step,answer)||Boolean(step.imageKey&&(!image||imageFailed))} onPress={()=>{Keyboard.dismiss();setSubmitted(true);}}/>}
 </View>;
}
function Chip({label,onPress,selected=false,disabled=false,done=false}:{label:string;onPress:()=>void;selected?:boolean;disabled?:boolean;done?:boolean}){
 return <Pressable accessibilityRole="button" accessibilityState={{selected,disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[s.chip,selected&&s.selected,disabled&&s.disabled,pressed&&s.pressed]}><Text style={[s.chipText,selected&&s.activeText]}>{label}</Text>{done&&<Feather name="check" color={C.semantic.success} size={14}/>}</Pressable>;
}
export default function PatientCasesScreen({onBack,userId=null}:{onBack:()=>void;userId?:string|null}){
 const {progress,status,saveError,complete}=useCaseProgress(userId);
 const [progressFilter,setProgressFilter]=useState<ProgressFilter>("Alle");
 const completionGuard=React.useRef(false);
 const [month,setMonth]=useState(()=>monthEdition().key);
 React.useEffect(()=>{const timer=setInterval(()=>setMonth(monthEdition().key),30000);return()=>clearInterval(timer);},[]);
 const monthlyProgress=progressForMonth(progress,month);
 const [selected,setSelected]=useState<PatientCase|null>(null);const [category,setCategory]=useState('Alle');const [difficulty,setDifficulty]=useState<Level|null>(null);const [index,setIndex]=useState(0);const [results,setResults]=useState<boolean[]>([]);const [previous,setPrevious]=useState<string>();const [attempt,setAttempt]=useState(0);
 const [showContext,setShowContext]=useState(false);const [showReview,setShowReview]=useState(false);const [visibleCount,setVisibleCount]=useState(12);
 const [subject,setSubject]=useState('Alle');const [query,setQuery]=useState('');const [showFilters,setShowFilters]=useState(false);
 const levelPool=patientCases.filter(c=>c.difficulty===difficulty);
 const summary=summarizeProgress(levelPool,monthlyProgress);
 const weekIndex=Math.floor((danishWeekStart(new Date())-Date.UTC(2026,10,23))/604800000);
 const levelSchedule=weeklySchedule.filter(id=>levelPool.some(c=>c.id===id));
 const featured=weekIndex>=0&&levelSchedule.length?levelPool.find(c=>c.id===levelSchedule[weekIndex%levelSchedule.length]):undefined;
 const resetFilters=()=>{setSubject('Alle');setCategory('Alle');setQuery('');setProgressFilter('Alle');};
 const extraCount=Number(subject!=='Alle')+Number(category!=='Alle')+Number(progressFilter!=='Alle');
 const hasFilters=extraCount>0||!!query.trim();
 const filteredPool=levelPool.filter(c=>(category==='Alle'||c.category===category)&&(subject==='Alle'||c.subjects.some(t=>t===subject))&&(!query.trim()||`${c.title} ${c.category} ${c.subjects.join(' ')}`.toLocaleLowerCase('da-DK').includes(query.trim().toLocaleLowerCase('da-DK'))));
 const pool=filterProgress(filteredPool,monthlyProgress,progressFilter);

 const start=(c:PatientCase,keepEdition=false)=>{if(status==='loading')return;completionGuard.current=false;const now=new Date();const edition=monthEdition(now).key;setMonth(edition);setSelected(keepEdition?c:{...monthlyCase(c,now),edition});setShowContext(false);setShowReview(false);setPrevious(c.id);setIndex(0);setResults([]);setAttempt(a=>a+1);};
 const back=()=>{if(selected){setSelected(null);setIndex(0);setResults([]);}else if(difficulty){setDifficulty(null);resetFilters();setShowFilters(false);}else onBack();};
 React.useEffect(()=>{setVisibleCount(12);},[category,difficulty,subject,query,progressFilter]);
 const done=!!selected&&index>=selected.steps.length;
 const revealed=selected?.steps.slice(0,index+1).filter(step=>step.update)??[];
 const vitals=selected?currentVitals(selected,index):{};
 return <Screen key={selected?`${attempt}:${index}`:"library"} testID="patient-cases-screen" keyboardAware contentContainerStyle={s.container}><StatusBar style="light"/><ToolPageHeader title={difficulty??"Patientcases"} backLabel={selected?'Cases':difficulty?'Niveau':'Forside'} onBack={back}/>
 {!difficulty?<View style={s.library}>
  <Text style={s.accent}>VÆLG NIVEAU</Text>
  {levels.map(level=>{const cases=patientCases.filter(c=>c.difficulty===level);const count=cases.filter(c=>monthlyProgress[c.id]).length;return <Pressable key={level} accessibilityRole="button" onPress={()=>{resetFilters();setDifficulty(level);}} style={({pressed})=>[s.levelChoice,pressed&&s.pressed]}><View style={s.grow}><Text style={s.question}>{level}</Text><Text style={s.caption}>{count}/{cases.length} gennemført</Text></View><Feather name="chevron-right" size={20} color={C.accent.focus}/></Pressable>;})}
  <Text style={s.educationNote}>Fiktive undervisningscases. Ikke fagligt godkendte kliniske instrukser.</Text>
 </View>:!selected?<View style={s.library}>
  <View style={s.summaryRow}>
   <Text style={s.meta}>{status==='loading'?'Henter fremgang…':status==='unavailable'?'Fremgang utilgængelig':`${summary.completed}/${summary.total} gennemført`}</Text>
   <Text style={s.meta}>{new Date(month+"-15T12:00:00Z").toLocaleDateString("da-DK",{month:"long",year:"numeric"})}</Text>
  </View>
  <View style={s.track}><View style={[s.fill,{width:`${summary.total?summary.completed/summary.total*100:0}%`}]}/></View>
  {saveError&&<Text style={s.meta}>Fremgang kunne ikke gemmes.</Text>}
  <View style={s.quickRow}>
   <Pressable accessibilityRole="button" disabled={status==='loading'||!pool.length} onPress={()=>{const c=pickCase(pool,previous);if(c)start(c);}} style={({pressed})=>[s.quick,s.quickPrimary,(status==='loading'||!pool.length)&&s.disabled,pressed&&s.pressed]}><Feather name="shuffle" size={18} color={C.background.base}/><Text style={s.quickPrimaryText}>Tilfældig case</Text></Pressable>
   {featured&&<Pressable accessibilityRole="button" accessibilityLabel={`Ugens case: ${featured.title}, ${featured.difficulty}`} disabled={status==='loading'} onPress={()=>start(featured)} style={({pressed})=>[s.quick,status==='loading'&&s.disabled,pressed&&s.pressed]}><Feather name="calendar" size={18} color={C.accent.focus}/><View style={s.grow}><Text style={s.rowTitle}>Ugens case</Text><Text style={s.caption} numberOfLines={1}>{featured.title}</Text></View><Feather name="chevron-right" size={16} color={C.text.secondary}/></Pressable>}
  </View>
  <View style={s.searchRow}>
   <View style={s.searchField}><Feather name="search" size={18} color={C.text.secondary}/><TextInput accessibilityLabel="Søg i patientcases" value={query} onChangeText={setQuery} autoCorrect={false} autoCapitalize="none" returnKeyType="search" placeholder="Søg cases" placeholderTextColor={C.text.secondary} style={s.searchInput}/>{!!query&&<Pressable accessibilityRole="button" accessibilityLabel="Ryd søgning" onPress={()=>setQuery('')} style={s.iconAction}><Feather name="x" size={18} color={C.text.secondary}/></Pressable>}</View>
   <Pressable accessibilityRole="button" accessibilityLabel="Filtre" accessibilityState={{expanded:showFilters}} onPress={()=>setShowFilters(v=>!v)} style={[s.filterAction,(showFilters||extraCount>0)&&s.selected]}><Feather name="sliders" size={17} color={C.accent.focus}/><Text style={s.chipText}>Filtre{extraCount>0?` (${extraCount})`:''}</Text></Pressable>
  </View>
  {showFilters&&<View style={s.filterPanel}>
   <Text style={s.accent}>STATUS</Text><View style={s.filters}>{progressFilters.map(f=><Chip key={f} label={f} selected={progressFilter===f} onPress={()=>setProgressFilter(f)}/>)}</View>
   <Text style={s.accent}>FAG</Text><View style={s.filters}>{['Alle',...subjects].map(t=><Chip key={t} label={t} selected={subject===t} onPress={()=>setSubject(t)}/>)}</View>
   <Text style={s.accent}>EMNE</Text><View style={s.filters}>{['Alle',...new Set(patientCases.map(c=>c.category))].map(c=><Chip key={c} label={c} selected={category===c} onPress={()=>setCategory(c)}/>)}</View>
   <View style={s.summaryRow}><Chip label="Nulstil" onPress={resetFilters}/><Chip label="Vis cases" selected onPress={()=>setShowFilters(false)}/></View>
  </View>}
  <View style={s.summaryRow}><Text style={s.accent}>CASES · {pool.length}</Text>{hasFilters&&<Pressable accessibilityRole="button" onPress={resetFilters} style={s.smallReset}><Text style={s.caption}>Nulstil filtre</Text></Pressable>}</View>
  <View style={s.caseGrid}>{pool.slice(0,visibleCount).map(c=>{const completed=!!monthlyProgress[c.id];return <Pressable key={c.id} accessibilityRole="button" accessibilityLabel={`${c.title}${completed?', gennemført denne måned':''}`} disabled={status==='loading'} onPress={()=>start(c)} style={({pressed})=>[s.caseRow,s.singleCase,completed&&s.completedCase,status==='loading'&&s.disabled,pressed&&s.pressed]}><View style={s.grow}><Text style={s.rowTitle}>{c.title}</Text><Text style={s.caption}>{c.category} · {c.steps.length} spørgsmål</Text></View><Feather name={completed?"check-circle":"chevron-right"} size={19} color={completed?C.semantic.success:C.text.secondary}/></Pressable>;})}</View>
  {pool.length>visibleCount&&<Button label={`Vis flere (${pool.length-visibleCount})`} onPress={()=>setVisibleCount(v=>v+12)}/>}
  {!pool.length&&<Text style={s.meta}>Ingen cases matcher filtrene.</Text>}
  <Text style={s.educationNote}>Fiktive undervisningscases. Ikke fagligt godkendte kliniske instrukser.</Text>
 </View>:done?<View style={s.stack}>
  <Text style={s.accent}>CASE AFSLUTTET</Text><Text style={s.title}>{selected.title}</Text><Text style={s.score}>{results.filter(Boolean).length} / {selected.steps.length}</Text><Text style={s.meta}>Korrekte svar</Text>{(saveError||status==='unavailable')&&<Text style={s.meta}>Fremgang kunne ikke gemmes på enheden.</Text>}<Text style={s.question}>Husk</Text><Text style={s.body}>{selected.takeaway}</Text>
  <Button label={showReview?"Skjul gennemgang":"Gennemgang"} onPress={()=>setShowReview(v=>!v)}/>{showReview&&<><Text style={s.accent}>LÆRINGSMÅL</Text>{selected.objectives.map(objective=><Text key={objective} style={s.body}>• {objective}</Text>)}<Text style={s.accent}>GENNEMGANG</Text>{selected.steps.map((step,i)=><View key={step.id} style={s.review}><Text style={{color:results[i]?C.semantic.success:C.semantic.warning,fontWeight:'700'}}>{results[i]?'✓ Korrekt':'✕ Forkert'}</Text><Text style={s.question}>{step.prompt}</Text><Text style={s.body}>{correctText(step)}</Text><Text style={s.meta}>{step.explanation}</Text></View>)}
  {curriculumMap[selected.id]&&<><Text style={s.accent}>LUP · EMNETILKNYTNING</Text><Text style={s.meta}>U/NORD, august 2024 · {curriculumMap[selected.id].topic}, s. {curriculumMap[selected.id].page}. </Text></>}<Text style={s.accent}>KILDER OG LÆSEFORSLAG</Text>{selected.sources.map(source=><Pressable key={source.url} accessibilityRole="link" onPress={()=>{void Linking.openURL(source.url).catch(()=>{});}}><Text style={s.link}>{source.title} ↗</Text></Pressable>)}
  </>}<Button primary label="Næste tilfældige case" onPress={()=>{const c=pickCase(pool,selected.id);if(c)start(c);}} disabled={!pool.length}/><Button label="Prøv igen" onPress={()=>start(selected,true)}/><Button label="Alle cases" onPress={back}/>
 </View>:<View style={s.stack}>
  <View style={s.progressLabel}><Text style={s.accent}>{selected.category.toUpperCase()}</Text><Text style={s.meta}>{index+1} / {selected.steps.length}</Text></View><View accessibilityRole="progressbar" accessibilityValue={{min:0,max:selected.steps.length,now:index+1}} style={s.track}><View style={[s.fill,{width:`${(index+1)/selected.steps.length*100}%`}]}/></View>
  <Text style={s.title}>{selected.title}</Text>
  <View style={s.caseLayout}><View style={s.contextPanel}>
  {(index===0||showContext)&&<Text style={s.body}>{selected.intro}</Text>}
  <View style={s.vitals}>{Object.entries(vitals).map(([k,v])=><View key={k} style={s.vital}><Text style={s.meta}>{k}</Text><Text style={s.vitalValue}>{v}</Text></View>)}</View>
  {index>0&&<Pressable accessibilityRole="button" accessibilityState={{expanded:showContext}} onPress={()=>setShowContext(v=>!v)} style={s.smallAction}><Text style={s.link}>{showContext?'Skjul patienthistorik':'Vis patienthistorik'}</Text></Pressable>}
  {(showContext?revealed:revealed.slice(-1)).map(step=><View key={step.id} style={s.update}><Text style={s.accent}>{step.vitalsUpdate?"REVURDERING":"NY OPLYSNING"}</Text><Text style={s.body}>{step.update}</Text></View>)}
  </View><View style={s.questionPanel}><Question key={`${selected.id}:${attempt}:${index}`} step={selected.steps[index]} last={index===selected.steps.length-1} onNext={correct=>{if(results.length!==index)return;const next=[...results,correct];if(index===selected.steps.length-1){if(completionGuard.current)return;completionGuard.current=true;complete(selected,next);}setResults(next);setIndex(index+1);setShowContext(false);}}/></View></View>
 </View>}
 </Screen>;
}
const s=StyleSheet.create({library:{gap:8},summaryRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'},grow:{flex:1,minWidth:0},quickRow:{flexDirection:'row',flexWrap:'wrap',gap:6},quick:{flexBasis:145,flexGrow:1,flexShrink:1,minHeight:52,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:10,paddingVertical:7,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.tool},quickPrimary:{backgroundColor:C.accent.focus,borderColor:C.accent.focus,justifyContent:'center'},quickPrimaryText:{color:C.background.base,fontSize:14,fontWeight:'700',flexShrink:1},rowTitle:{color:C.text.primary,fontSize:14,fontWeight:'700',lineHeight:19},caption:{color:C.text.secondary,fontSize:12,lineHeight:16},searchRow:{flexDirection:'row',gap:6,alignItems:'stretch'},searchField:{flex:1,minWidth:0,minHeight:44,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:9,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.inverse},searchInput:{flex:1,minWidth:0,minHeight:44,color:C.text.primary,fontSize:16,paddingVertical:6},iconAction:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center'},filterAction:{minHeight:44,flexDirection:'row',gap:6,alignItems:'center',justifyContent:'center',paddingHorizontal:10,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm},chip:{flexDirection:'row',alignItems:'center',justifyContent:'center',flexGrow:1,minHeight:44,paddingHorizontal:7,paddingVertical:5,gap:3,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.tool},chipText:{color:C.text.primary,fontSize:12,fontWeight:'600',flexShrink:1,textAlign:'center'},activeText:{color:C.accent.focus},levelRow:{flexDirection:'row',flexWrap:'wrap',gap:4},variantRow:{flexDirection:'row',flexWrap:'wrap',gap:4,marginTop:4},filterPanel:{gap:6,paddingVertical:8,borderTopWidth:1,borderBottomWidth:1,borderColor:C.border.divider},smallReset:{minHeight:44,justifyContent:'center'},caseGrid:{flexDirection:'row',flexWrap:'wrap',gap:6},caseRow:{flexBasis:325,flexGrow:1,flexShrink:1,minWidth:0,gap:8,paddingVertical:7,paddingHorizontal:10,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.tool},completedCase:{borderColor:C.semantic.success,backgroundColor:C.surface.success},levelChoice:{flexDirection:'row',alignItems:'center',gap:10,minHeight:64,padding:12,borderRadius:Radii.sm,borderWidth:1,borderColor:C.border.default,backgroundColor:C.surface.tool},singleCase:{flexDirection:'row',alignItems:'center',minHeight:54},educationNote:{color:C.text.secondary,fontSize:11,lineHeight:15,marginTop:4},matchGrid:{flexDirection:'row',gap:8,alignItems:'flex-start'},matchColumn:{flex:1,minWidth:0,gap:6},matchTile:{minHeight:54,padding:8,gap:3,borderWidth:1,borderRadius:Radii.sm,backgroundColor:C.surface.tool,justifyContent:'center'},matchText:{fontSize:13,lineHeight:18,color:C.text.primary,flexShrink:1},pairMarker:{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',gap:3},pairLabel:{fontSize:11,fontWeight:'700'},classifyRow:{paddingVertical:7,gap:5,borderBottomWidth:1,borderBottomColor:C.border.divider},classifyChoices:{flexDirection:'row',flexWrap:'wrap',gap:4},classifyChoice:{flex:1,minWidth:70,minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3,paddingHorizontal:6,paddingVertical:5,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.sm,backgroundColor:C.surface.tool},family:{padding:12,gap:6,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.md,backgroundColor:C.surface.tool},container:{maxWidth:900,paddingBottom:Spacing.lg},stack:{gap:7},caseLayout:{flexDirection:"row",flexWrap:"wrap",gap:12,alignItems:"flex-start"},contextPanel:{flexGrow:1,flexShrink:1,flexBasis:250,maxWidth:"100%",minWidth:0,gap:7},questionPanel:{flexGrow:2,flexShrink:1,flexBasis:400,maxWidth:"100%",minWidth:0},smallAction:{minHeight:44,justifyContent:"center"},ecgFrame:{backgroundColor:"#fff",borderRadius:8,overflow:"hidden"},ecgImage:{width:"100%",height:156},ecgHint:{color:"#163d45",textAlign:"right",fontWeight:"600",fontSize:12,padding:8},filters:{flexDirection:'row',flexWrap:'wrap',gap:6},body:{flexShrink:1,color:C.text.primary,fontSize:15,lineHeight:21},meta:{color:C.text.secondary,fontSize:13,lineHeight:19},accent:{color:C.accent.focus,fontSize:12,fontWeight:'700',letterSpacing:.5},title:{color:C.text.primary,fontSize:20,fontWeight:'700',lineHeight:26},question:{color:C.text.primary,fontSize:16,fontWeight:'700',lineHeight:24},button:{minHeight:48,borderWidth:1,borderColor:C.border.default,borderRadius:Radii.md,paddingHorizontal:10,paddingVertical:7,justifyContent:'center',backgroundColor:C.surface.tool},selected:{borderColor:C.accent.focus,backgroundColor:C.accent.selected},primary:{backgroundColor:C.accent.focus,borderColor:C.accent.focus,alignItems:'center'},primaryText:{color:C.background.base,fontWeight:'700'},disabled:{opacity:.55},pressed:{opacity:.8},feedback:{borderLeftWidth:3,padding:12,gap:6,backgroundColor:C.surface.inverse,borderRadius:8},numberRow:{flexDirection:'row',alignItems:'center',gap:12},input:{minHeight:48,flex:1,borderRadius:10,borderWidth:1,borderColor:C.border.default,paddingHorizontal:12,color:C.text.primary,fontSize:18,backgroundColor:C.surface.inverse},vitals:{flexDirection:'row',flexWrap:'wrap',gap:8,backgroundColor:C.surface.inverse,borderRadius:10,padding:10},vital:{flexGrow:1,minWidth:78,gap:1},vitalValue:{fontSize:17,color:C.accent.focus,fontWeight:'700'},progressLabel:{flexDirection:'row',justifyContent:'space-between'},track:{height:5,backgroundColor:C.border.default,borderRadius:5,overflow:'hidden'},fill:{height:5,backgroundColor:C.accent.focus},update:{paddingLeft:12,borderLeftWidth:2,borderLeftColor:C.accent.focus,gap:3},score:{color:C.accent.focus,fontSize:42,fontWeight:'800'},review:{borderBottomWidth:1,borderBottomColor:C.border.divider,paddingVertical:10,gap:4},link:{color:C.accent.focus,textDecorationLine:'underline',paddingVertical:8}});
