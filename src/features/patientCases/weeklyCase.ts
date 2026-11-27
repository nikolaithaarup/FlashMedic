import { scienceCases } from './scienceCases';
import { ecgCases } from './ecgCases';
import { familyVariants } from './caseFamilies';
import type { PatientCase } from './caseEngine';
// Preview-only editorial rotation. Production should supply a reviewed, explicitly scheduled catalogue.
const originalSchedule = ['cardiac-01','sepsis-01','glucose-01','renal-01','resp-02','infection-01','allergy-01','dka-01','neuro-01','pharm-01','trauma-02','peds-01','endo-02','hygiene-01','cardiac-02','resp-01','immune-01','obst-01','toxic-01','trauma-01','metabolic-01','ortho-01','abd-01','pacing-01','arrest-01','syncope-01','adrenal-01','burn-01','tonsil-01','spine-01','birth-01','seizure-01','mening-01','drug-02','peds-02','aorta-01','comm-01','hygiene-02','head-01','cold-01','geriatric-01','electric-01','obst-02','psyche-01','renal-02','drug-03','bariatric-01'] as const;
export const weeklySchedule = [...originalSchedule,...Object.entries(familyVariants).flatMap(([id,variants])=>variants.map(v=>`${id}-${v.level.toLowerCase()}`)),...ecgCases.map(c=>c.id),...scienceCases.map(c=>c.id)];
const day = 86400000;
const anchor = Date.UTC(2026,10,23); // Monday, 23 November 2026
export function danishWeekStart(date: Date): number {
 const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Copenhagen',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date);
 const get = (key: string) => Number(parts.find(p=>p.type===key)?.value);
 const local = Date.UTC(get('year'),get('month')-1,get('day'));
 return local-((new Date(local).getUTCDay()+6)%7)*day;
}
export function featuredCase(cases: PatientCase[], date = new Date()): PatientCase|undefined {
 const offset = Math.floor((danishWeekStart(date)-anchor)/(7*day));
 if (offset<0) return undefined;
 const id = weeklySchedule[offset]; // never silently repeat after schedule ends
 return id ? cases.find(c=>c.id===id) : undefined;
}
