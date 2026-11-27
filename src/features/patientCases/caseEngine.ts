export type Option = { id: string; text: string };
type Base = { id: string; prompt: string; update?: string; vitalsUpdate?: Record<string,string>; imageKey?: string; explanation: string };
export type Step = Base & (
  | { kind: 'choice'; options: Option[]; correct: string }
  | { kind: 'multi'; options: Option[]; correct: string[] }
  | { kind: 'number'; answer: number; tolerance: number; unit: string }
  | { kind: 'scale'; min: number; max: number; step: number; answer: number; tolerance: number; unit: string }
  | { kind: 'match'; left: Option[]; right: Option[]; correct: Record<string,string> }
  | { kind: 'order'; options: Option[]; correct: string[] }
);
export const levels = ['Elev','Behandler','Paramediciner'] as const;
export type Level = typeof levels[number];
export const subjects = ['Anatomi','Fysiologi','Patofysiologi','Sygdomslære','Mikrobiologi','Immunologi','Farmakologi','Endokrinologi','Medicinregning','Klinisk vurdering','Hygiejne','Kommunikation'] as const;
export type Subject = typeof subjects[number];
export type PatientCase = { id: string; familyId?: string; edition?: string; title: string; category: string; difficulty: Level; subjects: Subject[]; objectives: string[]; intro: string; vitals: Record<string,string>; steps: Step[]; takeaway: string; sources: {title:string; url:string}[]; status: 'draft' };
export type Answer = string | string[] | number | Record<string,string> | null;
export const parseNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(trimmed)) return null;
  const n = Number(trimmed.replace(',', '.')); return Number.isFinite(n) ? n : null;
};
export function ready(step: Step, answer: Answer): boolean {
  switch(step.kind) {
    case 'choice': return typeof answer === 'string' && step.options.some(o=>o.id===answer);
    case 'multi': return Array.isArray(answer) && answer.length>0 && new Set(answer).size===answer.length && answer.every(id=>step.options.some(o=>o.id===id));
    case 'order': return Array.isArray(answer) && answer.length===step.options.length && new Set(answer).size===answer.length && answer.every(id=>step.options.some(o=>o.id===id));
    case 'number': return typeof answer==='number' && Number.isFinite(answer);
    case 'scale': return typeof answer==='number' && Number.isFinite(answer) && answer>=step.min && answer<=step.max && Math.abs((answer-step.min)/step.step-Math.round((answer-step.min)/step.step))<1e-8;
    case 'match': return answer!==null && typeof answer==='object' && !Array.isArray(answer) && Object.keys(answer).length===step.left.length && step.left.every(l=>step.right.some(r=>r.id===answer[l.id])) && new Set(Object.values(answer)).size===step.left.length;
  }
}
export function grade(step: Step, answer: Answer): boolean {
  if (!ready(step,answer)) return false;
  switch(step.kind) {
    case 'choice': return answer===step.correct;
    case 'multi': return Array.isArray(answer) && answer.length===step.correct.length && step.correct.every(x=>answer.includes(x));
    case 'order': return Array.isArray(answer) && step.correct.every((x,i)=>x===answer[i]);
    case 'number': case 'scale': return typeof answer==='number' && Math.abs(answer-step.answer)<=step.tolerance+1e-9;
    case 'match': return Object.entries(step.correct).every(([k,v])=>(answer as Record<string,string>)[k]===v);
  }
}
export function correctText(step: Step): string {
  const label=(options: Option[],id:string)=>options.find(x=>x.id===id)?.text??id;
  switch(step.kind) {
    case 'choice': return label(step.options,step.correct);
    case 'multi': return step.correct.map(id=>label(step.options,id)).join(' · ');
    case 'order': return step.correct.map(id=>label(step.options,id)).join(' → ');
    case 'number': case 'scale': return `${step.answer.toLocaleString('da-DK')} ${step.unit}`;
    case 'match': return step.left.map(l=>`${l.text} → ${label(step.right,step.correct[l.id])}`).join('\n');
  }
}
export function pickCase(pool: PatientCase[], previous?:string, random=Math.random): PatientCase|undefined {
  const alternatives=pool.filter(c=>c.id!==previous); const eligible=alternatives.length?alternatives:pool;
  return eligible[Math.floor(random()*eligible.length)];
}

// Reassign a right-side item without permitting duplicate assignments.
export function assignPair(pairs:Record<string,string>, leftId:string, rightId:string):Record<string,string>{
 return {...Object.fromEntries(Object.entries(pairs).filter(([k,v])=>k!==leftId&&v!==rightId)),[leftId]:rightId};
}

// Apply only observations available at the current question, never future ones.
export function currentVitals(c:PatientCase,index:number):Record<string,string>{return Object.assign({},c.vitals,...c.steps.slice(0,index+1).map(step=>step.vitalsUpdate??{}));}
