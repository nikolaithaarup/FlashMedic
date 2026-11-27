import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import CaseScale from '../patientCases/CaseScale';
import {syringeGeometry,syringeTicks,type SyringeSpec} from './syringeGeometry';
type Props={spec:SyringeSpec;value:number;onChange?:(v:number)=>void;disabled?:boolean;readOnly?:boolean};
export default function SyringeExercise({spec,value,onChange,disabled=false,readOnly=false}:Props){
 const g=syringeGeometry(spec,value),pct=(x:number)=>(x/320*100)+'%' as `${number}%`;
 return <View style={s.wrap}><View style={{height:90,position:'relative'}}>
 <View style={[s.part,{left:pct(3),width:pct(29),top:49,height:8,backgroundColor:'#a7b5be'}]}/>
 <View style={[s.part,{left:pct(g.x0),width:pct(g.barrel+6),top:32,height:40,borderWidth:1,borderColor:'#9bb5c2',backgroundColor:'#142d37'}]}/>
 <View style={[s.part,{left:pct(g.x0),width:pct(g.fill),top:34,height:36,backgroundColor:'#28b8ac'}]}/>
 <View style={[s.part,{left:pct(g.piston),width:pct(6),top:35,height:34,backgroundColor:'#dce6eb'}]}/>
 <View style={[s.part,{left:pct(g.piston+6),width:pct(136),top:48,height:8,backgroundColor:'#8b9ca7'}]}/>
 <View style={[s.part,{left:pct(g.rodEnd-3),width:pct(6),top:36,height:32,backgroundColor:'#cfdae0'}]}/>
 {syringeTicks(spec).map(t=><View key={t.volume} style={[s.part,{left:pct(g.x0+g.barrel*t.volume/spec.capacity),top:32,width:1,height:t.major?12:6,backgroundColor:'#dce6eb'}]}>{t.major&&<Text style={s.tick}>{t.volume.toLocaleString('da-DK')}</Text>}</View>)}
 </View>{!readOnly&&<CaseScale min={0} max={spec.capacity} step={spec.increment} value={value} unit="mL" onChange={v=>onChange?.(v)} disabled={disabled}/>}</View>;
}
const s=StyleSheet.create({wrap:{width:'100%',maxWidth:480,alignSelf:'center'},part:{position:'absolute'},tick:{position:'absolute',top:-20,left:-12,width:24,textAlign:'center',fontSize:10,color:'#e5e7eb'}});
