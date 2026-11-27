import type {PatientCase,Step} from './caseEngine';
const options=(items:string[])=>items.map((text,i)=>({id:String(i),text}));
const choice=(id:string,prompt:string,items:string[],correct:number,explanation:string,update?:string,imageKey?:string):Step=>({id,kind:'choice',prompt,options:options(items),correct:String(correct),explanation,update,imageKey});
const clues=(id:string,prompt:string,items:string[],correct:number[],explanation:string,update?:string,imageKey?:string):Step=>({id,kind:'clues',prompt,options:options(items),correct:correct.map(String),explanation,update,imageKey});
const sort=(id:string,prompt:string,categories:string[],items:[string,number][],explanation:string,update?:string):Step=>({id,kind:'classify',prompt,categories:options(categories),items:options(items.map(x=>x[0])),correct:Object.fromEntries(items.map((x,i)=>[String(i),String(x[1])])),explanation,update});
type Addition={after?:string;step:Step};
const extras:Record<string,Addition[]>={
 'ekg-flutter-behandler':[{step:choice('flutter-variable','Hvilket fund taler mest for atrieflagren med variabel overledning frem for atrieflimren?',['Regelmæssig atrieaktivitet trods skiftende RR-afstand','Manglende organiseret atrieaktivitet','Fast PR foran hvert QRS'],0,'Regelmæssige flagrebølger kan fortsætte, selv om AV-overledningen varierer. Uregelmæssige RR-intervaller alene skelner ikke sikkert mellem de to rytmer.','Ved en senere optagelse varierer ventrikelfrekvensen.','ekg_img_aflutter_variable')}],
 'ekg-block-behandler':[{step:choice('mobitz-reference','Hvilken ledningsforstyrrelse viser denne separate referencekurve?',['Komplet AV-blok','2. grads AV-blok, Mobitz I','1. grads AV-blok'],1,'Ved Mobitz I forlænges PR gradvist før en P-tak uden efterfølgende QRS. Her er der stadig overledte slag.','Sammenlign patientens komplette blok med en anden rytmesimulation.','ekg_img_mobitz1_1')}],
 'ekg-block-paramediciner':[{step:choice('mobitz-reference','Hvilken forskel fra Mobitz I ses på denne separate referencekurve?',['PR bliver gradvist længere inden hvert udfald','Atrier og ventrikler er altid fuldstændigt dissocierede','PR er konstant i overledte slag, men enkelte P-takker overledes ikke'],2,'Det er det klassiske Mobitz II-mønster. Et kort 2:1-mønster alene kan ikke sikkert klassificeres som Mobitz I eller II.','Sammenlign med en anden ledningsforstyrrelse.','ekg_img_mobitz2')}],
 'arrest-01':[{after:'q2',step:choice('organized-after-vf','Hvilken tilstand beskriver kombinationen af den organiserede rytme og manglende effektiv cirkulation?',['ROSC','Pulsløs elektrisk aktivitet (PEA)','Asystoli'],1,'Organiseret elektrisk aktivitet uden effektiv cirkulation er PEA. EKG alene bekræfter ikke ROSC.','Ved næste rytme- og kredsløbsvurdering efter defibrillering ses organiseret elektrisk aktivitet, men der er fortsat ingen påviselig effektiv cirkulation.','ekg_img_sinus_tachy_1')}],
 'ekg-vt-01':[{step:clues('post-conversion','Markér fundene som fortsat er nødvendige for at vurdere klinisk bedring.',['Nyt blodtryk','Bevidsthed og symptomer','QRS er nu smalt som eneste mål','Palpabel puls og øvrig perfusion'],[0,1,3],'En ændret rytme kan forbedre kredsløbet, men en organiseret smalkomplekset rytme er ikke i sig selv bevis på tilstrækkelig perfusion.','Efter akut rytmebehandling ved relevant kompetence ses en ny rytme. Patienten er stadig svimmel.','ekg_img_sinus_tachy_1')}],
 'trauma-01':[{step:sort('compensation-strip','Hvilke ændringer kan forventes ved kompensation for blodtab?', ['Stiger','Falder'],[['Sympatisk aktivitet',0],['Venøst tilbageløb ved blodtab',1],['Hjertefrekvens',0]],'Ved blodtab kan barorefleksen øge sympatisk aktivitet og puls. Takykardi er et kompensationsfund, ikke en sikker måling af perfusion.','Monitoren viser sinustakykardi. Rytmesimulationen illustrerer mønsteret, ikke den præcise målefrekvens.')}],
 'science-resistance-elev':[{step:sort('microbe-compare','Sortér eksempler efter mikroorganismetype.',['Bakterie','Virus','Svamp'],[['E. coli',0],['Influenza',1],['Candida',2]],'E. coli er en bakterie, influenza skyldes virus, og Candida er en gærsvamp. Deres biologi og behandlingsmuligheder er forskellige.')}],
 'science-calcium-behandler':[{step:clues('calcium-clues','Markér oplysninger der gør ændret calciumregulering relevant i denne case.',['Nylig thyroideakirurgi','Prikken omkring munden','Spasmer i hænderne','Tidligere ukompliceret forkølelse'],[0,1,2],'Kirurgi nær biskjoldbruskkirtlerne og neuromuskulære symptomer kan gøre hypokalcæmi relevant. Blodprøver og øvrige fund er nødvendige.')}]
};
export const rhythmFollowupKeys=Object.entries(extras).flatMap(([id,rows])=>rows.map(row=>id+'/'+row.step.id));
export function addRhythmFollowups(c:PatientCase):PatientCase{
 const rows=extras[c.id];if(!rows)return c;
 const steps=[...c.steps];for(const row of rows){
  const at=row.after?steps.findIndex(step=>step.id===row.after):-1;
  if(row.after&&at<0)throw new Error('Missing follow-up anchor '+c.id+'/'+row.after);
  steps.splice(at<0?steps.length:at+1,0,row.step);
 }
 return {...c,steps};
}
