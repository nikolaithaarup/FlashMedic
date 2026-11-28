import {
  DRUG_TOPICS,
  THEORY,
  WORKED_EXAMPLES,
  formatDrugAnswer,
  generateDrugCalcQuestion,
  isDrugAnswerCorrect,
} from "../src/features/drugCalc/drugCalcContent";

const topicIds = new Set(DRUG_TOPICS.map((topic) => topic.id));
if (topicIds.size !== DRUG_TOPICS.length) {
  throw new Error("Drug calculation topics contain duplicate IDs.");
}

for (const { id } of DRUG_TOPICS) {
  const theory = THEORY.find((section) => section.topic === id);
  if (!theory || !theory.title.trim() || theory.bullets.length === 0) {
    throw new Error(`Missing theory content for ${id}`);
  }

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const question = generateDrugCalcQuestion([id]);
    if (question.topic !== id) {
      throw new Error(`Requested ${id}, received ${question.topic}`);
    }
    if (!Number.isFinite(question.correctAnswer) || question.correctAnswer < 0) {
      throw new Error(`Invalid expected answer for ${id}`);
    }
    if (!question.unit.trim()) {
      throw new Error(`Missing answer unit for ${id}`);
    }
    if (
      !Number.isFinite(question.tolerance) ||
      question.tolerance <= 0 ||
      question.tolerance > 0.1
    ) {
      throw new Error(`Unsafe tolerance for ${id}: ${question.tolerance}`);
    }
    if (
      !question.formula.trim() ||
      !question.explanation.trim() ||
      !question.commonPitfall.trim() ||
      !question.plausibilityCheck.trim() ||
      !question.roundingNote.trim() ||
      question.calculationSteps.length === 0 ||
      question.calculationSteps.some((step) => !step.trim())
    ) {
      throw new Error(`Incomplete learning metadata for ${id}`);
    }
    if (
      !Number.isInteger(question.answerDecimals) ||
      question.answerDecimals < 0 ||
      question.answerDecimals > 3
    ) {
      throw new Error(`Invalid answer decimal policy for ${id}`);
    }
    if (
      !isDrugAnswerCorrect(
        question.correctAnswer,
        question.correctAnswer,
        question.tolerance,
      )
    ) {
      throw new Error(`Exact answer rejected for ${id}`);
    }

    const displayedAnswer = Number(formatDrugAnswer(question).replace(",", "."));
    if (
      !isDrugAnswerCorrect(
        displayedAnswer,
        question.correctAnswer,
        question.tolerance,
      )
    ) {
      throw new Error(`Displayed rounded answer rejected for ${id}`);
    }

    const clearlyWrongAnswer = question.correctAnswer + 1;
    if (
      isDrugAnswerCorrect(
        clearlyWrongAnswer,
        question.correctAnswer,
        question.tolerance,
      )
    ) {
      throw new Error(`Clearly wrong answer accepted for ${id}`);
    }
  }
}

for (let attempt = 0; attempt < 50; attempt += 1) {
  const mixedQuestion = generateDrugCalcQuestion([]);
  if (!topicIds.has(mixedQuestion.topic)) {
    throw new Error(`Mixed practice returned unknown topic ${mixedQuestion.topic}`);
  }
}

const toleranceCases = [
  { user: 1, correct: 1, tolerance: 0.02, expected: true },
  { user: 1.02, correct: 1, tolerance: 0.02, expected: true },
  { user: 1.021, correct: 1, tolerance: 0.02, expected: false },
  { user: -1, correct: 1, tolerance: 0.02, expected: false },
  { user: 1, correct: -1, tolerance: 0.02, expected: false },
  { user: Number.NaN, correct: 1, tolerance: 0.02, expected: false },
  { user: Number.POSITIVE_INFINITY, correct: 1, tolerance: 0.02, expected: false },
  { user: 1, correct: Number.NaN, tolerance: 0.02, expected: false },
  { user: 1, correct: Number.POSITIVE_INFINITY, tolerance: 0.02, expected: false },
  { user: 1, correct: 1, tolerance: Number.NaN, expected: false },
  { user: 1, correct: 1, tolerance: Number.POSITIVE_INFINITY, expected: false },
  { user: 1, correct: 1, tolerance: -0.01, expected: false },
] as const;

for (const testCase of toleranceCases) {
  const actual = isDrugAnswerCorrect(
    testCase.user,
    testCase.correct,
    testCase.tolerance,
  );
  if (actual !== testCase.expected) {
    throw new Error(
      `Tolerance case failed: ${JSON.stringify(testCase)} returned ${actual}`,
    );
  }
}

if (WORKED_EXAMPLES.length < 6) {
  throw new Error("Expected at least six worked drug calculation examples.");
}

for (const example of WORKED_EXAMPLES) {
  if (!topicIds.has(example.topic)) {
    throw new Error(`Worked example has unknown topic ${example.topic}`);
  }
  if (
    !example.title.trim() ||
    !example.problem.trim() ||
    !example.formula.trim() ||
    example.calculation.length === 0 ||
    example.calculation.some((step) => !step.trim()) ||
    !example.finalAnswer.trim() ||
    !example.commonPitfall.trim()
  ) {
    throw new Error(`Incomplete worked example: ${example.title || example.topic}`);
  }
}

console.log(
  `Validated ${DRUG_TOPICS.length} medication topics, ${WORKED_EXAMPLES.length} worked examples, ${toleranceCases.length} tolerance cases, mixed practice, rounding, and learning metadata.`,
);

import {evaluateDrugResponse,parseDrugNumber} from '../src/features/drugCalc/drugCalcVariants';
const formats=new Set<string>();let tested=0;
for(const topic of DRUG_TOPICS)for(let i=0;i<80;i++){
 const q=generateDrugCalcQuestion([topic.id],'varied');const ex=q.exercise;formats.add(ex?.kind??'number');
 const raw=ex?.kind==='fields'||ex?.kind==='audit'?JSON.stringify({values:ex.fields.map(f=>String(f.answer)),choice:ex.kind==='audit'?ex.correctIndex:null}):String(q.correctAnswer);
 if(evaluateDrugResponse(q,raw)!==true||evaluateDrugResponse(q,'')!==null)throw new Error('Varied response failed '+topic.id);
 if(ex?.kind==='fields'||ex?.kind==='audit'){
  const values=ex.fields.map(f=>String(f.answer));values[0]=String(ex.fields[0].answer+1);
  if(evaluateDrugResponse(q,JSON.stringify({values,choice:ex.kind==='audit'?ex.correctIndex:null}))!==false)throw new Error('Partial error accepted');
  if(ex.kind==='audit'&&evaluateDrugResponse(q,JSON.stringify({values:ex.fields.map(f=>String(f.answer)),choice:0}))!==false)throw new Error('Incorrect error line accepted');
 }else if(ex?.kind==='dial'){
  if(q.correctAnswer===ex.initial||evaluateDrugResponse(q,String(ex.initial))!==false||evaluateDrugResponse(q,String(ex.max+ex.increment))!==null)throw new Error('Invalid dial');
 }else if(evaluateDrugResponse(q,String(q.correctAnswer+1))!==false)throw new Error('Incorrect reverse answer accepted');
 tested++;
}
if(formats.size!==4)throw new Error('Missing exercise format');
for(const bad of ['0x10','1e2','-1','Infinity','1,2.3',' '])if(parseDrugNumber(bad)!==null)throw new Error('Invalid numeric input accepted');
if(parseDrugNumber('0,25')!==.25)throw new Error('Danish decimal rejected');
console.log(tested+' varied medication questions validated; '+[...formats].join(', '));

import {syringeSpec,syringeGeometry,syringeTicks} from '../src/features/drugCalc/syringeGeometry';
for(const capacity of [1,2,5,10] as const){const spec=syringeSpec(capacity);let last=-1;for(const tick of syringeTicks(spec)){const g=syringeGeometry(spec,tick.volume);if(g.piston<=last||Math.abs(g.fill-(g.piston-g.x0))>1e-8||g.rodEnd+3>320||g.rodEnd-3<g.x0+g.barrel+6)throw new Error('Syringe geometry reversed or clipped');last=g.piston;}if(syringeGeometry(spec,0).fill!==0||syringeGeometry(spec,capacity).fill!==130)throw new Error('Incorrect syringe endpoint');}
console.log('Syringe geometry: four capacities, ordered graduations and full plunger travel passed.');

import {drugTopicGroups,shortTopicNames} from '../src/features/drugCalc/drugCalcMenu';
import {numericFieldColors as fieldColors} from '../src/ui/primitives/numericFieldColors';
const menuIds=drugTopicGroups.flatMap(g=>g.topics);
if(menuIds.length!==DRUG_TOPICS.length||new Set(menuIds).size!==menuIds.length||DRUG_TOPICS.some(t=>!menuIds.includes(t.id)||!shortTopicNames[t.id]))throw new Error('Drug menu does not cover all topics exactly once');
const lum=(hex:string)=>{const rgb=hex.slice(1).match(/../g)!.map(x=>{const n=parseInt(x,16)/255;return n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
for(const bg of [fieldColors.background,fieldColors.focused,fieldColors.readOnly,fieldColors.disabled])for(const fg of [fieldColors.text,fieldColors.muted]){const a=lum(bg),b=lum(fg);if((Math.max(a,b)+.05)/(Math.min(a,b)+.05)<4.5)throw new Error('Numeric field contrast below 4.5:1');}
console.log('All 13 topics accessible; numeric input contrast validated.');

for(const topic of ['strength','percentage','drops','time','errorCheck'] as const){const forms=new Set<string>();for(let i=0;i<100;i++){const q=generateDrugCalcQuestion([topic],'varied');forms.add(q.formula);if(q.labelData&&(!q.labelData.title||!q.labelData.strength||!q.labelData.detail))throw new Error('Incomplete label');}if(forms.size<2)throw new Error('Missing alternative for '+topic);}
console.log('Five additional question families validated.');
