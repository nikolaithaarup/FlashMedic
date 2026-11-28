import type {DrugCalcTopic} from './drugCalcContent';
export const drugTopicGroups:{id:string;title:string;description:string;topics:DrugCalcTopic[]}[]=[
 {id:'basic',title:'Grundregning',description:'Enheder · styrke · procent',topics:['conversion','strength','percentage']},
 {id:'dose',title:'Dosis og klargøring',description:'Dosis · sprøjter · tabletter · fortynding',topics:['dose','volume','tablets','dilution']},
 {id:'fluid',title:'Infusion og ilt',description:'Hastighed · dråber · tid · iltbeholdning',topics:['infusion','drops','time','oxygen']},
 {id:'complex',title:'Flere trin og regnefejl',description:'Kombinerede beregninger · kontrol',topics:['multiStep','errorCheck']},
];
export const shortTopicNames:Record<DrugCalcTopic,string>={strength:'Styrke',dose:'Vægtbaseret dosis',volume:'Sprøjter og volumen',percentage:'Procent',conversion:'Enheder',tablets:'Tabletter',dilution:'Fortynding',drops:'Dråber',infusion:'Infusion',oxygen:'Iltbeholdning',time:'Tid og hastighed',multiStep:'Flere trin',errorCheck:'Find regnefejlen'};
