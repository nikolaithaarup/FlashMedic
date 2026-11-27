import type { Step } from './caseEngine';
import type { RhythmId } from '../ekgTraining/game/rhythmModel';

// Opt-in by clinical encounter and question, never infer a rhythm from free text.
// Preserve the original image for native fallback and other contexts.
const live:Record<string,RhythmId>={
 'ekg-af-elev/rhythm':'af',
 'ekg-af-behandler/mechanism':'af',
 'ekg-af-paramediciner/rhythm-differential':'af',
 'ekg-flutter-elev/rhythm':'flutter_2_1',
 'ekg-block-elev/rhythm':'av_complete',
 'ekg-block-behandler/dissociation':'av_complete',
 'ekg-block-paramediciner/width':'av_complete',
 'ekg-vt-01/rhythm':'vt',
 'science-svt-elev/rhythm':'svt',
 'science-svt-paramediciner/diff':'svt',
 'arrest-01/q2':'vf',
 'pacing-01/q3':'paced_ventricular'
};
export const liveRhythmKeys=Object.keys(live);
export function liveRhythmForStep(caseId:string,step:Step):RhythmId|undefined{
 // Never replace a 12-lead interpretation, visual reference or numeric calculation.
 if(step.kind==='hotspot'||step.kind==='model'||step.kind==='number'||step.kind==='scale')return undefined;
 return live[caseId+'/'+step.id];
}
export function caseRhythmSeed(caseId:string,stepId:string,edition?:string):number{
 let hash=2166136261;for(const ch of caseId+'/'+stepId+'/'+(edition??'base'))hash=Math.imul(hash^ch.charCodeAt(0),16777619);
 return hash>>>0||1;
}
