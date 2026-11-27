import { familyVariants } from './caseFamilies';
export const curriculumMap: Record<string, {page:number; topic:string}> = {
  "trauma-01": {
    "page": 39,
    "topic": "Traumatologi 1"
  },
  "glucose-01": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "allergy-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "resp-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "cardiac-01": {
    "page": 34,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "infection-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "sepsis-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "dka-01": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "neuro-01": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "renal-01": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "pharm-01": {
    "page": 33,
    "topic": "Farmakologi 2"
  },
  "immune-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "resp-02": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "peds-01": {
    "page": 42,
    "topic": "Sundheds- og sygdomslære 4"
  },
  "obst-01": {
    "page": 42,
    "topic": "Sundheds- og sygdomslære 4"
  },
  "toxic-01": {
    "page": 37,
    "topic": "Farmakologi 3"
  },
  "cardiac-02": {
    "page": 34,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "hygiene-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "endo-02": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "trauma-02": {
    "page": 39,
    "topic": "Traumatologi 1"
  },
  "metabolic-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "abd-01": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "ortho-01": {
    "page": 31,
    "topic": "Sundheds- og sygdomslære 1"
  },
  "pacing-01": {
    "page": 34,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "syncope-01": {
    "page": 34,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "adrenal-01": {
    "page": 42,
    "topic": "Sundheds- og sygdomslære 4"
  },
  "tonsil-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "spine-01": {
    "page": 42,
    "topic": "Traumatologi 2"
  },
  "mening-01": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "aorta-01": {
    "page": 34,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "seizure-01": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "head-01": {
    "page": 42,
    "topic": "Traumatologi 2"
  },
  "arrest-01": {
    "page": 34,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "peds-02": {
    "page": 44,
    "topic": "Sundheds- og sygdomslære 5–6"
  },
  "hygiene-02": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "burn-01": {
    "page": 44,
    "topic": "Traumatologi 3"
  },
  "cold-01": {
    "page": 44,
    "topic": "Traumatologi 3"
  },
  "electric-01": {
    "page": 44,
    "topic": "Traumatologi 3"
  },
  "geriatric-01": {
    "page": 44,
    "topic": "Sundheds- og sygdomslære 5–6"
  },
  "psyche-01": {
    "page": 42,
    "topic": "Sundheds- og sygdomslære 4"
  },
  "birth-01": {
    "page": 42,
    "topic": "Sundheds- og sygdomslære 4"
  },
  "obst-02": {
    "page": 42,
    "topic": "Sundheds- og sygdomslære 4"
  },
  "renal-02": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "drug-02": {
    "page": 29,
    "topic": "Farmakologi 1"
  },
  "drug-03": {
    "page": 40,
    "topic": "Farmakologi 4"
  },
  "bariatric-01": {
    "page": 46,
    "topic": "Den bariatriske patient"
  },
  "comm-01": {
    "page": 30,
    "topic": "Kommunikation 1"
  }
};

for(const [id, variants] of Object.entries(familyVariants)){for(const v of variants)curriculumMap[`${id}-${v.level.toLowerCase()}`]={...curriculumMap[id]};}

import { ecgCases } from './ecgCases';
for(const c of ecgCases) curriculumMap[c.id]=c.id==='ekg-potassium-01'?{page:38,topic:'Sundheds- og sygdomslære 3'}:{page:34,topic:'Sundheds- og sygdomslære 2'};

import { scienceCurriculum } from './scienceCases';
Object.assign(curriculumMap,scienceCurriculum);
