import { patientCases } from '../src/features/patientCases/cases';
import { type Answer, grade, ready, parseNumber, pickCase, correctText } from '../src/features/patientCases/caseEngine';
function check(condition: unknown, message: string){ if(!condition)throw new Error(message); }
const ids=new Set<string>();const kinds=new Set<string>();let n=0;
for(const c of patientCases){check(!ids.has(c.id),`Duplicate case ${c.id}`);ids.add(c.id);check(c.sources.length>0&&c.steps.length>0,'Missing sources or steps');const stepIds=new Set<string>();for(const step of c.steps){n++;check(!stepIds.has(step.id),'Duplicate step ID');stepIds.add(step.id);kinds.add(step.kind);const answer:Answer=step.kind==='number'||step.kind==='scale'?step.answer:step.correct;check(ready(step,answer),`Invalid key ${c.id}/${step.id}`);check(grade(step,answer),`Wrong grade ${c.id}/${step.id}`);check(!grade(step,null),'Empty answer accepted');check(correctText(step).length>0&&step.explanation.length>0,'Missing feedback');if(step.kind==='choice')check(!grade(step,step.options.find(o=>o.id!==step.correct)!.id),'Wrong choice accepted');if(step.kind==='multi'||step.kind==='order')check(!grade(step,step.correct.slice(0,-1)),'Incomplete list accepted');if(step.kind==='order')check(!grade(step,[...step.correct].reverse()),'Wrong order accepted');if(step.kind==='number'||step.kind==='scale')check(!grade(step,step.answer+step.tolerance+1),'Wrong number accepted');if(step.kind==='match'){const wrong={...step.correct};const keys=Object.keys(wrong);[wrong[keys[0]],wrong[keys[1]]]=[wrong[keys[1]],wrong[keys[0]]];check(!grade(step,wrong),'Wrong pairs accepted');}}}
check(kinds.size===8,'Missing question type');check(parseNumber('4,2')===4.2&&parseNumber(' 4.2 ')===4.2,'Decimal parsing');check(parseNumber('')===null&&parseNumber('4,2x')===null&&parseNumber('Infinity')===null,'Invalid numeric input');check(pickCase([],undefined,()=>0)===undefined,'Empty random pool');check(pickCase(patientCases,patientCases[0].id,()=>0)?.id!==patientCases[0].id,'Repeated random case');check(pickCase([patientCases[0]],patientCases[0].id,()=>0)?.id===patientCases[0].id,'One-case pool');console.log(`${patientCases.length} cases, ${n} steps, ${kinds.size} question types: validation passed.`);
import { levels, subjects } from '../src/features/patientCases/caseEngine';
import { danishWeekStart, featuredCase, weeklySchedule } from '../src/features/patientCases/weeklyCase';
for(const c of patientCases){check(levels.includes(c.difficulty),'Invalid difficulty');check(c.subjects.length>0&&c.subjects.every(s=>subjects.includes(s)),'Missing subject');check(c.objectives.length>=2,'Missing objectives');check(c.status==='draft','Unreviewed publication');}
for(const level of levels)check(patientCases.some(c=>c.difficulty===level),`No ${level} cases`);
for(const subject of subjects)check(patientCases.some(c=>c.subjects.includes(subject)),`No ${subject} cases`);
check(new Set(weeklySchedule).size===weeklySchedule.length,'Duplicate weekly case');
for(const id of weeklySchedule)check(patientCases.some(c=>c.id===id),`Unknown weekly case ${id}`);
check(featuredCase(patientCases,new Date('2026-11-29T22:59:59Z'))?.id==='cardiac-01','Sunday before Copenhagen rollover');
check(featuredCase(patientCases,new Date('2026-11-29T23:00:00Z'))?.id==='sepsis-01','Monday Copenhagen rollover');
check(danishWeekStart(new Date('2027-03-28T21:59:59Z'))!==danishWeekStart(new Date('2027-03-28T22:00:00Z')),'DST rollover');
check(featuredCase(patientCases,new Date('2029-01-01T00:00:00Z'))===undefined,'Expired schedule must not repeat');
console.log('Curriculum tags, all levels, schedule and Copenhagen week boundaries passed.');
for(const level of levels)console.log(`${level}: ${patientCases.filter(c=>c.difficulty===level).length}`);

import { curriculumMap } from "../src/features/patientCases/curriculumMap";
for(const c of patientCases)check(Boolean(curriculumMap[c.id]),`Missing LUP mapping ${c.id}`);
check(Object.keys(curriculumMap).length===patientCases.length,"Extra LUP map entries");
check(weeklySchedule.length===patientCases.length,"Incomplete weekly schedule");
console.log("All cases mapped to a curriculum topic and scheduled once.");
import { assignPair } from '../src/features/patientCases/caseEngine';
import { familyVariants } from '../src/features/patientCases/caseFamilies';
for(const id of Object.keys(familyVariants)){
 const family=patientCases.filter(c=>c.familyId===id);
 check(family.length===3&&new Set(family.map(c=>c.difficulty)).size===3,`Incomplete family ${id}`);
 check(new Set(family.map(c=>c.intro)).size===1&&new Set(family.map(c=>c.title)).size===1,`Inconsistent family ${id}`);
 const prompts=family.flatMap(c=>c.steps.filter(s=>!s.id.startsWith('followup-')).map(s=>s.prompt));check(new Set(prompts).size===prompts.length,`Repeated prompt ${id}`);
}
const p1=assignPair({},'0','1');const p2=assignPair(p1,'2','1');check(p2['0']===undefined&&p2['2']==='1','Matching failed to move pair');
const p3=assignPair(p2,'2','0');check(p3['2']==='0'&&Object.keys(p3).length===1,'Matching failed to replace pair');
console.log(`${Object.keys(familyVariants).length} complete three-level families; matching reassignment passed.`);
import { ecgCases, ecgKeys } from '../src/features/patientCases/ecgCases';
import { monthlyCase, monthEdition, traumaPresets, respPresets, adrenalPresets, afPresets } from '../src/features/patientCases/monthlyCase';
check(monthEdition(new Date('2026-11-30T22:59:59Z')).key==='2026-11','Before month rollover');
check(monthEdition(new Date('2026-11-30T23:00:00Z')).key==='2026-12','After month rollover');
check(monthEdition(new Date('2027-03-31T22:00:00Z')).key==='2027-04','DST month rollover');
const original=JSON.stringify(patientCases);let monthly=0;
for(let i=0;i<24;i++){
 const date=new Date(Date.UTC(2026,10+i,15,12));const n=i%4;
 for(const c of patientCases){const current=monthlyCase(c,date);if(current.edition)monthly++;
  check(current.id===c.id&&current.steps.length===c.steps.length,'Changed case identity');
  for(const step of current.steps){const answer:Answer=step.kind==='number'||step.kind==='scale'?step.answer:step.correct;check(grade(step,answer),`Monthly invalid ${current.id}/${step.id}`);check(step.imageKey===c.steps.find(s=>s.id===step.id)?.imageKey,'ECG image drift');}
  if(c.id==='trauma-01'){const p=traumaPresets[n];const co=current.steps.find(s=>s.id==='co');const map=current.steps.find(s=>s.id==='map');check(co?.kind==='number'&&co.answer===p.hr*p.sv/1000,'CO mismatch');check(map?.kind==='scale'&&map.answer===Math.round((p.s+2*p.d)/3),'MAP mismatch');check(current.vitals.BT===`${p.s}/${p.d} mmHg`,'Trauma BP mismatch');}
  if(c.id==='resp-01'){const p=respPresets[n];const mv=current.steps.find(s=>s.id==='minute');const av=current.steps.find(s=>s.id==='alveolar');check(mv?.kind==='number'&&mv.answer===p.rf*p.tv/1000,'MV mismatch');check(av?.kind==='scale'&&av.answer===(p.tv-150)*p.rf/1000,'AV mismatch');}
  if(c.id==='adrenal-01'){const p=adrenalPresets[n];const q=current.steps.find(s=>s.id==='q4');check(q?.kind==='scale'&&q.answer===Math.round((p.s+2*p.d)/3),'Adrenal MAP mismatch');}
  if(c.familyId==='ekg-af'){const p=afPresets[n];check(current.vitals.BT===`${p.s}/${p.d} mmHg`,'AF BP mismatch');}
 }
 for(const id of ['trauma-01','resp-01','adrenal-01','ekg-af']){const family=patientCases.filter(c=>c.familyId===id).map(c=>monthlyCase(c,date));check(family.length===3&&new Set(family.map(c=>JSON.stringify(c.vitals))).size===1,'Monthly family inconsistency');}
}
check(JSON.stringify(patientCases)===original,'Base catalogue mutated');
for(const c of ecgCases)check(c.steps.some(s=>s.imageKey&&ecgKeys.some(key=>key===s.imageKey)),`Missing ECG ${c.id}`);
for(const key of ecgKeys)check(ecgCases.some(c=>c.steps.some(s=>s.imageKey===key)),`Unused ECG key ${key}`);
console.log(`${ecgCases.length} ECG cases; ${monthly} monthly case instantiations checked across 24 months; Copenhagen boundaries, calculations and fixed image keys passed.`);
for(const id of ['ekg-af','ekg-flutter','ekg-block']){
 const family=ecgCases.filter(c=>c.familyId===id);check(family.length===3&&new Set(family.map(c=>c.difficulty)).size===3,`Incomplete ECG family ${id}`);
 check(new Set(family.map(c=>c.intro)).size===1&&new Set(family.map(c=>JSON.stringify(c.vitals))).size===1,`Inconsistent ECG family ${id}`);
 const prompts=family.flatMap(c=>c.steps.filter(s=>!s.id.startsWith('followup-')).map(s=>s.prompt));check(new Set(prompts).size===prompts.length,`Repeated ECG family prompt ${id}`);
}
console.log('All 12 three-level families validated (9 previous + 3 ECG).');

import { scienceCases, scienceFamilyIds, scienceMonthlyIds, sciencePresets } from '../src/features/patientCases/scienceCases';
check(scienceCases.length===24&&scienceFamilyIds.length===8,'Unexpected science catalogue count');
for(const id of scienceFamilyIds){
 const family=scienceCases.filter(c=>c.familyId===id);check(family.length===3&&new Set(family.map(c=>c.difficulty)).size===3,'Missing science level');
 check(new Set(family.map(c=>c.intro)).size===1&&new Set(family.map(c=>JSON.stringify(c.vitals))).size===1,'Science family context mismatch');
 const prompts=family.flatMap(c=>c.steps.filter(s=>!s.id.startsWith('followup-')).map(s=>s.prompt));check(new Set(prompts).size===prompts.length,'Repeated science prompt');
}
const newEcgKeys=['ekg_img_svt_avnrt_1','ekg_img_tdp_hypokalaemia'];
const newEcg=scienceCases.filter(c=>c.steps.some(s=>s.imageKey));
check(newEcg.length===6,'Unexpected new ECG case count');for(const c of newEcg)check(c.steps.filter(s=>s.imageKey).every(s=>newEcgKeys.includes(s.imageKey!)),'Unapproved new ECG image key');
let scienceMonthly=0;
for(let i=0;i<24;i++){
 const date=new Date(Date.UTC(2026,10+i,15,12));const n=i%6;
 for(const id of scienceMonthlyIds){
  const family=scienceCases.filter(c=>c.familyId===id).map(c=>monthlyCase(c,date));scienceMonthly+=family.length;
  check(family.length===3&&new Set(family.map(c=>JSON.stringify(c.vitals))).size===1&&family.every(c=>c.edition===monthEdition(date).key),'New monthly family mismatch');
  const steps=family.flatMap(c=>c.steps);
  if(id==='science-pe'){const p=sciencePresets.pe[n],q=steps.find(s=>s.id==='index');check(q?.kind==='number'&&q.answer===Math.round(p.hr/p.s*100)/100&&q.prompt.includes(String(p.hr))&&q.prompt.includes(String(p.s)), 'Shock index mismatch');check(family[0].vitals.BT===`${p.s}/${p.d} mmHg`,'PE BP mismatch');}
  if(id==='science-renal'){const p=sciencePresets.renal[n],q=steps.find(s=>s.id==='balance'),m=steps.find(s=>s.id==='map');check(q?.kind==='number'&&q.answer===p.water-p.urine&&q.prompt.includes(String(p.water))&&q.prompt.includes(String(p.urine)),'Fluid balance mismatch');check(m?.kind==='scale'&&m.answer===Math.round((p.s+2*p.d)/3),'Renal MAP mismatch');}
  if(id==='science-calcium'){const p=sciencePresets.calcium[n],q=steps.find(s=>s.id==='calcium');check(q?.kind==='scale'&&q.answer===Math.round((1.15-p.ca)*100)/100,'Calcium difference mismatch');}
 }
}
check(scienceMonthly===216,'Science monthly count mismatch');
console.log(`${scienceFamilyIds.length} new complete families; ${newEcg.length} additional ECG cases; ${scienceMonthly} new monthly case instantiations verified.`);
console.log(`Total: ${patientCases.length} cases, ${patientCases.reduce((sum,c)=>sum+c.steps.length,0)} exercises, ${new Set(patientCases.map(c=>c.familyId??c.id)).size} patient encounters, ${patientCases.filter(c=>c.steps.some(s=>s.imageKey)).length} ECG cases, ${patientCases.filter(c=>monthlyCase(c).edition).length} monthly variants.`);

import { recordCompletion, decodeProgress, progressKey, filterProgress, summarizeProgress } from '../src/features/patientCases/caseProgress';
const sample=patientCases[0];const misses=sample.steps.map((_,i)=>i===0);const perfect=sample.steps.map(()=>true);
const first=recordCompletion({},sample,misses,new Date('2026-11-27T10:00:00Z'));
const second=recordCompletion(first,sample,perfect,new Date('2026-11-27T10:05:00Z'));
check(second[sample.id].attempts===2&&second[sample.id].first.correct===1&&second[sample.id].best.correct===sample.steps.length,'Progress first attempt overwritten');
check(JSON.stringify(decodeProgress(JSON.stringify(second)))===JSON.stringify(second),'Progress roundtrip');
check(filterProgress(patientCases,first,'Gentag fejl').length===1&&filterProgress(patientCases,second,'Gentag fejl').length===0,'Missed filter');
check(filterProgress(patientCases,second,'Ikke gennemført').length===patientCases.length-1,'Unfinished filter');
check(summarizeProgress(patientCases,second).firstAccuracy===Math.round(100/sample.steps.length),'First attempt accuracy');
check(progressKey('one')!==progressKey('two'),'Account separation');
let rejected=false;try{recordCompletion({},sample,[]);}catch{rejected=true;}check(rejected,'Incomplete case saved');
rejected=false;try{decodeProgress('{"bad":{}}');}catch{rejected=true;}check(rejected,'Corrupt progress accepted');
console.log('Progress: first/latest/best scores, repeat and unfinished filters, account keys and corrupt storage tests passed.');

import {progressForMonth} from '../src/features/patientCases/caseProgress';
import {currentVitals} from '../src/features/patientCases/caseEngine';
check(Object.keys(progressForMonth(second,'2026-11')).length===1,'Current month completion missing');
check(Object.keys(progressForMonth(second,'2026-12')).length===0,'Old month completion not reset');
const crossMonth=recordCompletion({}, {...sample,edition:'2026-11'}, perfect,new Date('2026-12-01T00:01:00Z'));
check(Object.keys(progressForMonth(crossMonth,'2026-12')).length===0,'Previous edition counted in new month');
const cardiacFlow=patientCases.find(c=>c.id==='cardiac-01')!;
check(cardiacFlow.steps.length===8,'Cardiac flow missing');
check(currentVitals(cardiacFlow,0).BT==='148/86 mmHg','Future vital leaked');
check(currentVitals(cardiacFlow,6).BT==='122/74 mmHg'&&currentVitals(cardiacFlow,7).BT==='94/58 mmHg','Reassessment vital failed');
console.log('Level library monthly completion and progressive vital updates validated.');

for(const c of patientCases){check(c.steps.length>=6,`Case too short: ${c.id}`);check(new Set(c.steps.map(s=>s.prompt)).size===c.steps.length,`Repeated question in case ${c.id}`);}
console.log('All cases have at least six distinct questions; monthly variants retain extended questions.');

import {normalizeShortAnswer} from '../src/features/patientCases/caseEngine';
check(normalizeShortAnswer('  BETA-2. ')===normalizeShortAnswer('beta 2'),'Short answer normalization');
const kindCounts:Record<string,number>={};for(const c of patientCases)for(const step of c.steps){kindCounts[step.kind]=(kindCounts[step.kind]??0)+1;if(step.kind==='short'){for(const a of step.accepted)check(grade(step,a),'Rejected spelling alias');check(!grade(step,'__wrong__'),'Incorrect written answer accepted');}if(step.kind==='classify'){const first=step.items[0].id;const wrong={...step.correct,[first]:step.categories.find(cat=>cat.id!==step.correct[first])!.id};check(!grade(step,wrong),'Wrong category accepted');const partial={...step.correct};delete partial[first];check(!ready(step,partial),'Incomplete classification accepted');}}
console.log('Question distribution: '+JSON.stringify(kindCounts));
