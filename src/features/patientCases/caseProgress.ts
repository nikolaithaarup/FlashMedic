import type { PatientCase } from './caseEngine';
export type Score = {correct:number; total:number};
export type CaseRecord = {attempts:number; first:Score; latest:Score; best:Score; edition?:string; completedAt:string};
export type Progress = Record<string,CaseRecord>;
export type ProgressFilter = 'Alle'|'Ikke gennemført'|'Gentag fejl';
export const progressFilters:ProgressFilter[]=['Alle','Ikke gennemført','Gentag fejl'];
export function progressKey(uid:string){return `flashmedic:patientcases:v1:${encodeURIComponent(uid)}`;}
function validScore(x:unknown):x is Score {if(!x||typeof x!=='object')return false;const s=x as Score;return Number.isInteger(s.total)&&s.total>0&&Number.isInteger(s.correct)&&s.correct>=0&&s.correct<=s.total;}
export function decodeProgress(raw:string|null):Progress{
 if(!raw)return {};const data:unknown=JSON.parse(raw);if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid progress data');
 const result:Progress={};for(const [id,value] of Object.entries(data)){const r=value as CaseRecord;if(!r||!Number.isInteger(r.attempts)||r.attempts<1||!validScore(r.first)||!validScore(r.latest)||!validScore(r.best)||typeof r.completedAt!=='string'||!Number.isFinite(Date.parse(r.completedAt)))throw new Error('Invalid case record');if(!/^[a-z0-9-]+$/.test(id))throw new Error('Invalid case ID');result[id]=r;}return result;
}
export function recordCompletion(progress:Progress,c:PatientCase,answers:boolean[],now=new Date()):Progress{
 if(answers.length!==c.steps.length||answers.some(a=>typeof a!=='boolean'))throw new Error('Incomplete case');
 const score={correct:answers.filter(Boolean).length,total:answers.length};const previous=progress[c.id];
 const best=previous&&previous.best.correct/previous.best.total>=score.correct/score.total?previous.best:score;
 return {...progress,[c.id]:{attempts:(previous?.attempts??0)+1,first:previous?.first??score,latest:score,best,edition:c.edition,completedAt:now.toISOString()}};
}
export function filterProgress(pool:PatientCase[],progress:Progress,filter:ProgressFilter){return pool.filter(c=>filter==='Alle'||(filter==='Ikke gennemført'?!progress[c.id]:!!progress[c.id]&&progress[c.id].latest.correct<progress[c.id].latest.total));}
export function summarizeProgress(pool:PatientCase[],progress:Progress){const records=pool.flatMap(c=>progress[c.id]?[progress[c.id]]:[]);const total=records.reduce((s,r)=>s+r.first.total,0);return {completed:records.length,total:pool.length,firstAccuracy:total?Math.round(records.reduce((s,r)=>s+r.first.correct,0)/total*100):null};}

// Retain lifetime records but display only the current monthly edition as completed.
export function progressForMonth(progress:Progress,month:string):Progress{
 return Object.fromEntries(Object.entries(progress).filter(([,r])=>{const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Copenhagen',year:'numeric',month:'2-digit'}).formatToParts(new Date(r.completedAt));const key=`${parts.find(p=>p.type==='year')?.value}-${parts.find(p=>p.type==='month')?.value}`;return (r.edition??key)===month;}));
}
