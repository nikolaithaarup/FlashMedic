import React,{useState} from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {ColorTokens as C,Radii} from '../../../constants/theme';
import type {Step,Answer} from './caseEngine';
import {diagrams,modelInfo,modelOutput} from './visualModels';
import CaseScale from './CaseScale';

type VisualStep=Extract<Step,{kind:'hotspot'|'model'|'clues'}>;
export function VisualExercise({step,answer,submitted,onChange}:{step:VisualStep;answer:Answer;submitted:boolean;onChange:(a:Answer)=>void}){
 const [width,setWidth]=useState(0);
 if(step.kind==='hotspot'){
  const diagram=diagrams[step.diagram],scale=width/320;
  return <View style={s.stack}>
   <View onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={s.canvas}>
    {width>0&&<>
     {diagram.grid&&Array.from({length:33},(_,i)=><View key={'v'+i} pointerEvents="none" style={{position:'absolute',left:i*10*scale,top:0,bottom:0,width:1,backgroundColor:i%5===0?'#42505B':'#25333D'}}/>)}
     {diagram.grid&&Array.from({length:19},(_,i)=><View key={'h'+i} pointerEvents="none" style={{position:'absolute',top:i*10*scale,left:0,right:0,height:1,backgroundColor:i%5===0?'#42505B':'#25333D'}}/>)}
     {diagram.strokes.flatMap((stroke,j)=>stroke.points.slice(1).map((p,i)=>{
      const a=stroke.points[i],dx=(p[0]-a[0])*scale,dy=(p[1]-a[1])*scale,len=Math.hypot(dx,dy),h=Math.max(1,stroke.width*scale);
      return <View key={j+'-'+i} pointerEvents="none" style={{position:'absolute',width:len+1,height:h,left:(p[0]+a[0])*scale/2-len/2,top:(p[1]+a[1])*scale/2-h/2,backgroundColor:stroke.color,borderRadius:h/2,transform:[{rotate:Math.atan2(dy,dx)+'rad'}]}}/>;
     }))}
     {diagram.regions.map((region,i)=>{const selected=answer===region.id;const color=submitted?(region.id===step.correct?C.semantic.success:selected?C.semantic.warning:C.border.default):selected?C.accent.focus:'#B7C8D3';return <Pressable key={region.id} accessibilityRole="button" accessibilityLabel={'Område '+String.fromCharCode(65+i)+(submitted?': '+region.label:'')} accessibilityState={{selected,disabled:submitted}} disabled={submitted} onPress={()=>onChange(region.id)} style={[s.marker,{left:Math.max(0,Math.min(width-44,region.x*scale-22)),top:Math.max(0,Math.min(180*scale-44,region.y*scale-22)),borderColor:color,backgroundColor:selected?'#16474B':'#102530'}]}><Text style={[s.markerText,{color}]}>{String.fromCharCode(65+i)}</Text>{submitted&&region.id===step.correct&&<Feather name="check" size={12} color={color}/>}</Pressable>;})}
    </>}
   </View>
   <Text style={s.caption}>{diagram.caption}</Text>
   <View style={s.inline}>{diagram.regions.map((r,i)=><Pressable key={r.id} accessibilityRole="button" accessibilityState={{selected:answer===r.id,disabled:submitted}} disabled={submitted} onPress={()=>onChange(r.id)} style={[s.tile,s.area,answer===r.id&&s.selected,submitted&&r.id===step.correct&&{borderColor:C.semantic.success}]}><Text style={s.text}>{String.fromCharCode(65+i)}{submitted?' · '+r.label:''}</Text></Pressable>)}</View>
  </View>;
 }
 if(step.kind==='model'){
  const info=modelInfo[step.model],value=typeof answer==='number'?answer:step.initial,out=modelOutput(step.model,value,step.fixed);
  const maxOut=modelOutput(step.model,step.max,step.fixed);
  return <View style={s.stack}>
   <Text style={s.caption}>Undervisningsmodel · antagne værdier, ikke behandlingsmål</Text>
   <View style={s.inline}><View style={s.metric}><Text style={s.caption}>{info.fixedLabel}</Text><Text style={s.value}>{step.fixed}{info.fixedUnit}</Text></View><View style={s.metric}><Text style={s.caption}>{info.output}</Text><Text style={s.value}>{out.toLocaleString('da-DK',{maximumFractionDigits:2})} L/min</Text></View></View>
   <View style={s.track}><View style={[s.bar,{width:`${Math.min(100,out/maxOut*100)}%`}]}/><View style={[s.target,{left:`${Math.min(99,step.target/maxOut*100)}%`}]}/></View>
   <Text style={s.caption}>Mål i modellen: {step.target.toLocaleString('da-DK')} L/min</Text>
   <Text style={s.text}>{info.label}</Text>
   <CaseScale min={step.min} max={step.max} step={step.increment} value={value} unit={info.unit} disabled={submitted} onChange={onChange}/>
   <View style={s.inline}>{[-1,1].map(direction=><Pressable key={direction} accessibilityRole="button" accessibilityLabel={direction<0?'Sænk '+info.label:'Øg '+info.label} disabled={submitted} onPress={()=>onChange(Math.max(step.min,Math.min(step.max,Math.round((value+direction*step.increment)*100)/100)))} style={[s.tile,s.area]}><Text style={s.text}>{direction<0?'−':'+'} {step.increment} {info.unit}</Text></Pressable>)}</View>
   <Text style={s.caption}>{info.formula}</Text>
  </View>;
 }
 const selected=Array.isArray(answer)?answer:[];
 return <View style={s.stack}><Text style={s.caption}>Markér relevante oplysninger · {selected.length} valgt</Text><View style={s.clueCard}>
 {step.options.map(item=>{const chosen=selected.includes(item.id),good=submitted&&step.correct.includes(item.id),bad=submitted&&chosen&&!good;return <Pressable key={item.id} accessibilityRole="checkbox" accessibilityState={{checked:chosen,disabled:submitted}} disabled={submitted} onPress={()=>onChange(chosen?selected.filter(id=>id!==item.id):[...selected,item.id])} style={[s.clue,chosen&&s.selected,good&&{borderColor:C.semantic.success},bad&&{borderColor:C.semantic.warning}]}><Text style={s.text}>{item.text}</Text>{(chosen||good)&&<Feather name={bad?'x':'check'} size={15} color={bad?C.semantic.warning:good?C.semantic.success:C.accent.focus}/>}</Pressable>;})}
 </View></View>;
}
export function ChainExercise({step,selected,disabled,onChange}:{step:Extract<Step,{kind:'order'}>;selected:string[];disabled:boolean;onChange:(a:string[])=>void}){
 return <View style={s.stack}>
  <Text style={s.caption}>Byg rækkefølgen · {selected.length}/{step.options.length}</Text>
  {Array.from({length:step.options.length},(_,i)=>{const id=selected[i],item=step.options.find(o=>o.id===id);return <React.Fragment key={i}>{i>0&&<View style={s.arrow}><Feather name="arrow-down" size={15} color={C.text.muted}/></View>}<Pressable accessibilityRole="button" accessibilityLabel={item?'Fjern '+item.text:'Led '+(i+1)+' er tomt'} disabled={disabled||!item} onPress={()=>onChange(selected.filter(x=>x!==id))} style={[s.slot,item?s.selected:s.empty,disabled&&item&&{borderColor:step.correct[i]===id?C.semantic.success:C.semantic.warning}]}><Text style={s.index}>{i+1}</Text><Text style={[s.text,{flex:1},!item&&{color:C.text.muted}]}>{item?.text??'Vælg et led'}</Text>{item&&!disabled&&<Feather name="x" size={16} color={C.text.secondary}/>}</Pressable></React.Fragment>;})}
  {!disabled&&selected.length<step.options.length&&<View style={s.stack}>{step.options.filter(o=>!selected.includes(o.id)).map(o=><Pressable key={o.id} accessibilityRole="button" onPress={()=>onChange([...selected,o.id])} style={s.tile}><Text style={s.text}>{o.text}</Text></Pressable>)}</View>}
  {!disabled&&selected.length>0&&<Pressable accessibilityRole="button" onPress={()=>onChange([])} style={s.reset}><Text style={s.index}>Nulstil</Text></Pressable>}
 </View>;
}
const s=StyleSheet.create({stack:{gap:7},canvas:{width:'100%',aspectRatio:320/180,minHeight:0,position:'relative',overflow:'hidden',backgroundColor:'#101F29',borderRadius:Radii.md,borderWidth:1,borderColor:C.border.default},marker:{position:'absolute',width:44,height:44,borderWidth:2,borderRadius:22,alignItems:'center',justifyContent:'center'},markerText:{fontSize:16,fontWeight:'800'},caption:{fontSize:12,lineHeight:17,color:C.text.secondary},text:{fontSize:14,lineHeight:19,color:C.text.primary,flexShrink:1},inline:{flexDirection:'row',flexWrap:'wrap',gap:6},tile:{minHeight:44,borderWidth:1,borderColor:C.border.default,backgroundColor:C.surface.tool,borderRadius:Radii.sm,padding:8,justifyContent:'center'},area:{flexGrow:1,alignItems:'center'},selected:{borderColor:C.accent.focus,backgroundColor:C.accent.selected},metric:{flex:1,minWidth:110,padding:9,borderRadius:Radii.sm,backgroundColor:C.surface.inverse,gap:4},value:{fontSize:20,fontWeight:'700',color:C.accent.focus},track:{height:12,position:'relative',backgroundColor:C.border.default,borderRadius:6,overflow:'hidden'},bar:{height:12,backgroundColor:C.accent.focus,borderRadius:6},target:{position:'absolute',top:0,bottom:0,width:3,backgroundColor:'#F2CE78'},clueCard:{gap:5,padding:7,borderRadius:Radii.md,backgroundColor:C.surface.inverse},clue:{minHeight:44,padding:8,borderRadius:Radii.sm,borderWidth:1,borderColor:'transparent',flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6},slot:{minHeight:44,padding:8,borderWidth:1,borderRadius:Radii.sm,borderColor:C.border.default,flexDirection:'row',alignItems:'center',gap:8},empty:{borderStyle:'dashed'},index:{fontSize:13,fontWeight:'700',color:C.accent.focus},arrow:{alignItems:'center',height:16},reset:{minHeight:44,justifyContent:'center',alignSelf:'flex-end'}});
