import { scienceMonthlyCase } from './scienceCases';
import type { PatientCase, Step } from './caseEngine';
const anchor=2026*12+10; // November 2026
export function monthEdition(date=new Date()):{key:string; offset:number}{
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Copenhagen',year:'numeric',month:'2-digit'}).formatToParts(date);
 const y=Number(parts.find(p=>p.type==='year')?.value),m=Number(parts.find(p=>p.type==='month')?.value);
 return {key:`${y}-${String(m).padStart(2,'0')}`,offset:Math.max(0,y*12+m-1-anchor)};
}
const fmt=(v:number)=>v.toLocaleString('da-DK',{maximumFractionDigits:2});
const map=(s:number,d:number)=>Math.round((s+2*d)/3);
// Explicitly authored sets, not unconstrained jitter. ECG images and all values
// derived from their recordings remain fixed. Presets repeat until more are added.
export const traumaPresets=[{hr:120,s:92,d:64,sv:35},{hr:130,s:84,d:58,sv:30},{hr:110,s:90,d:60,sv:40},{hr:124,s:88,d:56,sv:35}];
export const respPresets=[{rf:30,tv:350},{rf:32,tv:400},{rf:28,tv:450},{rf:36,tv:350}];
export const adrenalPresets=[{s:78,d:46,hr:118},{s:82,d:48,hr:122},{s:76,d:50,hr:114},{s:88,d:52,hr:120}];
export const afPresets=[{s:128,d:76,rf:20},{s:124,d:72,rf:22},{s:136,d:80,rf:19},{s:130,d:78,rf:21}];
function replaceOptions(step:Step, old:string, next:string):Step{
 if(step.kind==='choice'||step.kind==='multi'||step.kind==='order')return {...step,options:step.options.map(o=>({...o,text:o.text.replace(old,next)}))};return step;
}
export function monthlyCase(c:PatientCase,date=new Date()):PatientCase{
 const {key,offset}=monthEdition(date); const family=c.familyId??c.id;const n=offset%4;
 const science=scienceMonthlyCase(c,offset,key);if(science)return science;
 if(family==='trauma-01'){
  const {hr,s,d,sv}=traumaPresets[n];const co=hr*sv/1000;const bt=`${s}/${d}`;
  const steps=c.steps.map(step=>{
   if(step.id==='findings')return replaceOptions(replaceOptions(step,'92/64',bt),'120/min',`${hr}/min`);
   if(step.id==='co'&&step.kind==='number')return {...step,answer:co,update:`I en forenklet undervisningsmodel antager vi et slagvolumen på ${sv} ml og puls ${hr}/min.`,explanation:`${hr} × ${sv} / 1000 = ${fmt(co)} L/min. Slagvolumen er antaget, ikke målt.`};
   if(step.id==='map'&&step.kind==='scale')return {...step,answer:map(s,d),explanation:`(${s} + 2 × ${d})/3 ≈ ${map(s,d)} mmHg. MAP er et estimat.`};
   return step;
  });return {...c,edition:key,vitals:{...c.vitals,Puls:`${hr}/min`,BT:`${bt} mmHg`},steps};
 }
 if(family==='resp-01'){
  const {rf,tv}=respPresets[n];const mv=rf*tv/1000,av=(tv-150)*rf/1000;
  const steps=c.steps.map(step=>{
   if(step.id==='signs')return replaceOptions(step,'30/min',`${rf}/min`);
   if(step.id==='minute'&&step.kind==='number')return {...step,answer:mv,prompt:`Beregn minutventilationen ved RF ${rf}/min i L/min.`,update:`I en forenklet model antages tidalvolumen at være ${tv} ml.`,explanation:`${rf} × ${tv} / 1000 = ${fmt(mv)} L/min.`};
   if(step.id==='alveolar'&&step.kind==='scale')return {...step,step:.1,answer:av,explanation:`(${tv} − 150) × ${rf} / 1000 = ${fmt(av)} L/min. Modellen bruger antagede værdier.`};
   return step;
  });return {...c,edition:key,vitals:{...c.vitals,RF:`${rf}/min`},steps};
 }
 if(family==='adrenal-01'){
  const {s,d,hr}=adrenalPresets[n];const bt=`${s}/${d}`;
  const steps=c.steps.map(step=>{
   if(step.id==='pressure')return replaceOptions(replaceOptions(step,'78/46',bt),'118/min',`${hr}/min`);
   if(step.id==='q4'&&step.kind==='scale')return {...step,prompt:`Estimér MAP fra ${bt} mmHg (SBP + 2 × DBP)/3.`,answer:map(s,d),explanation:`(${s} + 2 × ${d})/3 ≈ ${map(s,d)} mmHg. MAP er et estimat.`};return step;
  });return {...c,edition:key,vitals:{...c.vitals,BT:`${bt} mmHg`,Puls:`${hr}/min`},steps};
 }
 if(family==='ekg-af'){
  const {s,d,rf}=afPresets[n];return {...c,edition:key,vitals:{...c.vitals,BT:`${s}/${d} mmHg`,RF:`${rf}/min`}};
 }
 return c;
}
