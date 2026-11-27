import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { ColorTokens as C } from '../../../constants/theme';
export type ScaleProps = {min:number;max:number;step:number;value:number|null;onChange:(v:number)=>void;disabled:boolean;unit:string};
export default function CaseScale({min,max,step,value,onChange,disabled,unit}:ScaleProps){
 const current=value??min;
 return <View style={s.row}><Pressable accessibilityRole="button" accessibilityLabel="Sænk værdi" disabled={disabled} onPress={()=>onChange(Math.max(min,Math.round((current-step)*1000)/1000))} style={s.button}><Text style={s.text}>−</Text></Pressable><Text style={s.text}>{value===null?'Vælg værdi':`${value.toLocaleString('da-DK')} ${unit}`}</Text><Pressable accessibilityRole="button" accessibilityLabel="Øg værdi" disabled={disabled} onPress={()=>onChange(Math.min(max,Math.round((current+step)*1000)/1000))} style={s.button}><Text style={s.text}>+</Text></Pressable></View>;
}
const s=StyleSheet.create({row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},button:{minHeight:48,minWidth:48,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.border.default,borderRadius:10},text:{color:C.text.primary,fontSize:18}});
