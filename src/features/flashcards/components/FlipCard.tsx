import React,{useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,Easing,Platform,StyleSheet,View} from 'react-native';
type Props={revealed:boolean;front:React.ReactNode;back:React.ReactNode};
// Rotate out to edge, swap face, then rotate back. One visible face at a time;
// the invisible face is never exposed to assistive technology.
export default function FlipCard({revealed,front,back}:Props){
 const angle=useRef(new Animated.Value(0)).current;
 const [face,setFace]=useState(revealed);
 const shown=useRef(revealed);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  let alive=true;
  const media=Platform.OS==='web'&&typeof window!=='undefined'&&typeof window.matchMedia==='function'?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  if(media){
   const update=()=>setReduced(media.matches);update();media.addEventListener?.('change',update);
   return()=>{media.removeEventListener?.('change',update);};
  }
  void AccessibilityInfo.isReduceMotionEnabled().then(v=>{if(alive)setReduced(v);}).catch(()=>{});
  const sub=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);
  return()=>{alive=false;sub.remove();};
 },[]);
 useEffect(()=>{
  let active=true;angle.stopAnimation();
  if(reduced||shown.current===revealed){shown.current=revealed;setFace(revealed);angle.setValue(0);return;}
  const native=Platform.OS!=='web';
  const out=Animated.timing(angle,{toValue:90,duration:135,easing:Easing.in(Easing.quad),useNativeDriver:native});
  out.start(({finished})=>{
   if(!active||!finished)return;
   shown.current=revealed;setFace(revealed);angle.setValue(-90);
   Animated.timing(angle,{toValue:0,duration:170,easing:Easing.out(Easing.cubic),useNativeDriver:native}).start();
  });
  return()=>{active=false;angle.stopAnimation();};
 },[revealed,reduced,angle]);
 return <View><Animated.View style={[styles.face,{transform:[{perspective:1000},{rotateY:angle.interpolate({inputRange:[-90,0,90],outputRange:['-90deg','0deg','90deg']})}]}]}>{face?back:front}</Animated.View></View>;
}
const styles=StyleSheet.create({face:{backfaceVisibility:'hidden'}});
