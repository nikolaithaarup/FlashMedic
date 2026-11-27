import type { DrugCalcQuestion, DrugCalcTopic } from './drugCalcContent';
export type DrugField={label:string;unit:string;answer:number;decimals:number;tolerance:number};
export type DrugExercise=
 | {kind:'fields';fields:DrugField[]}
 | {kind:'audit';options:string[];correctIndex:number;fields:DrugField[]}
 | {kind:'dial';label:string;min:number;max:number;increment:number;initial:number};
const pick=<T,>(v:T[]):T=>v[Math.floor(Math.random()*v.length)];
const fmt=(n:number,d=3)=>n.toLocaleString('da-DK',{maximumFractionDigits:d,useGrouping:false});
const field=(label:string,unit:string,answer:number,decimals=2):DrugField=>({label,unit,answer,decimals,tolerance:decimals===0?.001:Math.min(.005,Math.pow(10,-decimals)/2)});
type Spec={text:string;fields:DrugField[];formula:string;steps:string[];pitfall:string;check:string;exercise?:DrugExercise;hint?:string};
const make=(id:number,topic:DrugCalcTopic,s:Spec):DrugCalcQuestion=>{
 const last=s.fields[s.fields.length-1];
 return {id,topic,text:s.text,correctAnswer:last.answer,unit:last.unit,answerDecimals:last.decimals,tolerance:last.tolerance,formula:s.formula,hint:s.hint??s.formula,explanation:s.steps.join(' → '),calculationSteps:s.steps,commonPitfall:s.pitfall,plausibilityCheck:s.check,roundingNote:last.decimals===0?'Angiv helt tal.':'Afrund først til sidst.',exercise:s.exercise??(s.fields.length>1?{kind:'fields',fields:s.fields}:undefined)};
};
export function generateDrugVariant(topic:DrugCalcTopic,id:number):DrugCalcQuestion{
 const w=pick([50,60,70,80,90]);const strength=pick([2,4,5,10]);const ml=pick([2,3,4,5]);const mass=strength*ml;
 const s=(v:Spec)=>make(id,topic,v);
 switch(topic){
 case 'strength':return s({text:'Et øvelseshætteglas indeholder '+mass+' mg i '+ml+' mL. Beregn styrken i begge enheder.',fields:[field('Styrke','mg/mL',strength),field('Samme styrke','µg/mL',strength*1000,0)],formula:'Styrke = stofmængde / volumen',steps:[mass+' / '+ml+' = '+strength+' mg/mL',strength+' × 1000 = '+strength*1000+' µg/mL'],pitfall:'Omregn stofmængden, ikke volumen.',check:'De to styrker beskriver samme opløsning.'});
 case 'dose':{const per=pick([.1,.2,.5]);const dose=per*w;return s({text:'En fiktiv ordination giver i alt '+fmt(dose)+' mg til en person på '+w+' kg. Hvor stor er dosis pr. kg?',fields:[field('Dosis pr. kg','mg/kg',per)],formula:'Dosis pr. kg = total dosis / vægt',steps:[fmt(dose)+' / '+w+' = '+fmt(per)+' mg/kg'],pitfall:'Divider med vægten ved omvendt beregning.',check:'Gang tilbage med vægten.'});}
 case 'volume':{const v=pick([.5,1,1.5,2,2.5,3.5,4]);const c=pick([2,4,10]);return s({text:'Øvelsessprøjte: '+c+' mg/mL. Indstil volumen til en beregnet mængde på '+fmt(c*v)+' mg.',fields:[field('Volumen','mL',v,1)],exercise:{kind:'dial',label:'Sprøjtevolumen',min:0,max:5,increment:.5,initial:0},formula:'V = D / S',steps:[fmt(c*v)+' / '+c+' = '+fmt(v)+' mL'],pitfall:'Forveksl ikke mg og mL.',check:'Volumen × styrke skal give den ønskede mængde.'});}
 case 'percentage':{const p=pick([5,10,20]);const v=pick([50,100,150,200]);const g=p*v/100;return s({text:'En øvelsesopløsning er '+p+'% (masse/volumen). Hvor stort volumen indeholder '+fmt(g)+' g?',fields:[field('Volumen','mL',v,0)],formula:'V = g × 100 / procent',steps:[fmt(g)+' × 100 / '+p+' = '+v+' mL'],pitfall:'Procenten er gram pr. 100 mL, ikke pr. mL.',check:'Indsæt volumen i den oprindelige formel.'});}
 case 'conversion':{const g=pick([.125,.25,.5,1.5]);return s({text:'Omregn '+fmt(g)+' g til begge enheder.',fields:[field('Masse','mg',g*1000,0),field('Masse','µg',g*1000000,0)],formula:'1 g = 1000 mg = 1.000.000 µg',steps:[fmt(g)+' × 1000 = '+fmt(g*1000)+' mg',fmt(g*1000)+' × 1000 = '+fmt(g*1000000)+' µg'],pitfall:'Der er to faktorer 1000 fra g til µg.',check:'Mængden er uændret.'});}
 case 'tablets':{const count=pick([1,1.5,2,2.5,3]);const mg=pick([250,500]);return s({text:'I en regneøvelse må tabletten deles i halve, og hver tablet indeholder '+mg+' mg. Hvad er den samlede mængde i '+fmt(count)+' tabletter?',fields:[field('Mængde','mg',count*mg,0)],formula:'Mængde = antal × tabletstyrke',steps:[fmt(count)+' × '+mg+' = '+fmt(count*mg)+' mg'],pitfall:'Del kun virkelige tabletter hvis præparatet tillader det.',check:'Gang antal tabletter med styrke.'});}
 case 'dilution':{const stock=pick([10,20]);const original=pick([2,4,5]);const final=original*pick([2,5]);const amount=stock*original;return s({text:'Øvelsesopløsning: '+original+' mL à '+stock+' mg/mL. Den bringes til '+final+' mL samlet volumen. Beregn tilsat væske og slutstyrke.',fields:[field('Tilsat væske','mL',final-original,0),field('Slutstyrke','mg/mL',amount/final)],formula:'Tilsat = slutvolumen − startvolumen; styrke = mængde / slutvolumen',steps:[final+' − '+original+' = '+(final-original)+' mL',stock+' × '+original+' = '+amount+' mg',amount+' / '+final+' = '+fmt(amount/final)+' mg/mL'],pitfall:'Skeln tilsat væske fra samlet volumen.',check:'Stofmængden er den samme før og efter.'});}
 case 'drops':{const factor=pick([15,20,60]);const rate=pick([60,120,180]);return s({text:'Dråbesættet er mærket '+factor+' dr/mL. Beregnet væskehastighed er '+rate+' mL/time. Find dråber pr. minut.',fields:[field('Dråbehastighed','dr/min',rate*factor/60,0)],formula:'dr/min = mL/time × dr/mL / 60',steps:[rate+' × '+factor+' / 60 = '+rate*factor/60+' dr/min'],pitfall:'Antag ikke at alle dråbesæt har faktor 20.',check:'Brug den angivne dråbefaktor.'});}
 case 'infusion':{const concentration=pick([2,4,5]);const rate=pick([5,10,15,20]);const target=concentration*rate;return s({text:'En fiktiv øvelsesblanding har '+concentration+' mg/mL. Den beregnede mængde pr. time er '+target+' mg/time. Indstil den teoretiske pumpehastighed.',fields:[field('Pumpehastighed','mL/time',rate,0)],exercise:{kind:'dial',label:'Pumpehastighed',min:0,max:30,increment:1,initial:0},formula:'mL/time = mg/time / mg/mL',steps:[target+' / '+concentration+' = '+rate+' mL/time'],pitfall:'Mængde pr. time er ikke det samme som volumen pr. time.',check:'Hastighed × koncentration = stofmængde pr. time.'});}
 case 'oxygen':{const size=pick([2,5,10]);const pressure=pick([100,150,200]);const reserve=50;const flow=pick([5,10]);return s({text:'En '+size+' L flaske viser '+pressure+' bar. I øvelsen skal '+reserve+' bar forblive som reserve. Flow '+flow+' L/min. Beregn brugbar ilt og teoretisk varighed.',fields:[field('Brugbar mængde','L',size*(pressure-reserve),0),field('Teoretisk varighed','min',size*(pressure-reserve)/flow,0)],formula:'Brugbar mængde ≈ størrelse × (tryk − reserve); tid = liter / flow',steps:[size+' × ('+pressure+' − '+reserve+') = '+size*(pressure-reserve)+' L',size*(pressure-reserve)+' / '+flow+' = '+size*(pressure-reserve)/flow+' min'],pitfall:'Glem ikke den angivne reserve.',check:'Dette er et teoretisk estimat; følg lokale procedurer i praksis.'});}
 case 'time':{const rate=pick([60,120,180,240]);const minutes=pick([15,30,45,90]);return s({text:'Øvelsesinfusionen har '+rate*minutes/60+' mL tilbage ved '+rate+' mL/time. Hvor mange minutter rækker den?',fields:[field('Tid','min',minutes,0)],formula:'min = volumen / hastighed × 60',steps:[rate*minutes/60+' / '+rate+' × 60 = '+minutes+' min'],pitfall:'Svaret skal være i minutter, ikke timer.',check:'Minutter / 60 × hastighed giver volumen.'});}
 case 'multiStep':{const per=pick([2,4,5]);const total=per*w;const c=pick([50,100]);return s({text:'Fiktiv ordination: '+per+' µg/kg til '+w+' kg. Øvelsesopløsningen har '+c+' µg/mL. Beregn mængden i µg og mg samt volumen.',fields:[field('Total mængde','µg',total,0),field('Total mængde','mg',total/1000,3),field('Volumen','mL',total/c,2)],formula:'D = dosis/kg × kg; V = D / S',steps:[per+' × '+w+' = '+total+' µg',total+' / 1000 = '+fmt(total/1000)+' mg',total+' / '+c+' = '+fmt(total/c)+' mL'],pitfall:'Brug samme stofenhed i dosis og koncentration.',check:'Gang volumen tilbage med styrken.'});}
 case 'errorCheck':{const d=pick([.2,.4,.5,.8]);const ug=d*1000;const wrong=d*100;const options=['1 mg = 1000 µg',fmt(d)+' × 100 = '+fmt(wrong)+' µg',fmt(wrong)+' µg er skrevet som resultat'];const f=field('Korrekt omregning','µg',ug,0);return s({text:'En kollega har lavet en omregning fra '+fmt(d)+' mg til µg. Find det første forkerte regnetrin og ret resultatet.',fields:[f],exercise:{kind:'audit',options,correctIndex:1,fields:[f]},formula:'mg × 1000 = µg',steps:['Omregningsfaktoren er 1000.',fmt(d)+' × 1000 = '+ug+' µg'],pitfall:'Faktor 100 i stedet for 1000 giver et 10 gange for lavt resultat.',check:'Divider µg-resultatet med 1000 for at få mg.'});}
 }
}
export function parseDrugNumber(raw:string):number|null{
 const v=raw.trim();if(!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(v))return null;
 const n=Number(v.replace(',','.'));return Number.isFinite(n)&&n>=0?n:null;
}
export type DrugResponse={values:string[];choice:number|null};
export function readDrugResponse(raw:string,count:number):DrugResponse{
 const empty={values:Array.from({length:count},()=>''),choice:null};
 if(!raw)return empty;
 try{const r=JSON.parse(raw);if(!r||!Array.isArray(r.values)||r.values.length!==count||r.values.some((v:unknown)=>typeof v!=='string'))return empty;
 return {values:r.values,choice:Number.isInteger(r.choice)?r.choice:null};}catch{return empty;}
}
const close=(a:number,b:number,t:number)=>Math.abs(a-b)<=t+Number.EPSILON*Math.max(1,a,b)*4;
export function evaluateDrugResponse(q:DrugCalcQuestion,raw:string):boolean|null{
 const ex=q.exercise;if(ex?.kind==='fields'||ex?.kind==='audit'){
  const r=readDrugResponse(raw,ex.fields.length);const nums=r.values.map(parseDrugNumber);
  if(nums.some(n=>n===null)||(ex.kind==='audit'&&(r.choice===null||r.choice<0||r.choice>=ex.options.length)))return null;
  return (ex.kind!=='audit'||r.choice===ex.correctIndex)&&ex.fields.every((f,i)=>close(nums[i]!,f.answer,f.tolerance));
 }
 const n=parseDrugNumber(raw);if(n===null)return null;
 if(ex?.kind==='dial'&&(n<ex.min||n>ex.max||Math.abs((n-ex.min)/ex.increment-Math.round((n-ex.min)/ex.increment))>1e-8))return null;
 return close(n,q.correctAnswer,q.tolerance);
}
