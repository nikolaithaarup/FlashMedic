import type {PatientCase,Step} from './caseEngine';

type Short=[prompt:string,correct:string,aliases:string[]];
type Sort=[prompt:string,categories:string[],items:[string,number][],explanation:string];
type Order=[prompt:string,items:string[],explanation:string];
// Replace selected recognition questions with cueless recall. Accept only
// explicitly authored equivalent terms, never guess at a free-form explanation.
const short:Record<string,Short>={
 'cardiac-01/vessel':['Hvad hedder de kar, der forsyner selve hjertemusklen?','Koronararterier',['koronararterierne','kranspulsårer','kranspulsårerne','kransarterier','kransarterierne','koronarkar','koronarkarrene']],
 'trauma-01/recognition':['Hvilken shocktype passer bedst til det akutte blodtab?','Hypovolæmisk shock',['hypovolæmi','hypovolæmisk chok','hæmoragisk shock','hæmorrhagisk shock','blødningsshock','blødningschok']],
 'glucose-01/test':['Hvilken måling kan undersøge en vigtig reversibel årsag til patientens konfusion?','Blodsukker',['blodsukkermåling','blodglukose','blodglucose','glukose','glucose','b-glukose','bs']],
 'allergy-01/recognition':['Hvad kaldes den alvorlige systemiske allergiske reaktion, som fundene tyder på?','Anafylaksi',['anafylaktisk reaktion','anafylaktisk shock','anafylaktisk chok']],
 'allergy-01-elev/histamine':['Hvad hedder signalstoffet fra mastceller, som blandt andet kan give kløe og karudvidelse?','Histamin',[]],
 'abd-01/q1':['Hvad hedder det lille vedhæng til caecum?','Appendix vermiformis',['appendix','blindtarmens vedhæng','blindtarmens ormeformede vedhæng','appendiks']],
 'tonsil-01/q2':['Hvilken vævstype dominerer tonsillerne? Svar med vævstypen.','Lymfoidt væv',['lymfevæv','lymfatisk væv','lymfoid væv']],
 'spine-01/q1':['Hvad hedder kanalen i rygsøjlen, hvor rygmarven ligger?','Spinalkanalen',['spinalkanal','rygmarvskanalen','rygmarvskanal','vertebralkanalen','canalis vertebralis']],
 'birth-01/q4':['Hvilket hormon stimulerer kontraktioner i uterus?','Oxytocin',['oxitocin']],
 'hygiene-02/q2':['Hvad kaldes tiden fra smitte til symptomdebut?','Inkubationstid',['inkubationstiden','inkubationsperiode','inkubationsperioden']],
 'seizure-01/q3':['Hvad kaldes fasen efter et epileptisk anfald, hvor patienten kan være konfus og træt?','Postiktal fase',['postiktal','postiktale fase','postiktal periode','postiktale periode','postiktalt']],
 'electric-01/q1':['Hvad kaldes den elektriske vævsegenskab, der modvirker strøm gennem kroppen?','Elektrisk modstand',['modstand','resistans','elektrisk resistans']],
 'neuro-01/side':['Hvilken hjernehalvdel er typisk påvirket ved højresidig central kraftnedsættelse?','Venstre',['venstre hemisfære','venstre hjernehalvdel','venstre side','venstre cerebral hemisfære']],
 'glucose-01-behandler/glycogen':['Hvad hedder nedbrydningen af glykogen til frigivelse af glukose?','Glykogenolyse',['glycogenolyse','glykogenolysen']],
 'endo-02/drug':['Hvilken lægemiddelklasse tilhører hydrocortison?','Glukokortikoid',['glukokortikoider','glucocorticoid','glucocorticoider','kortikosteroid','kortikosteroider']],
 'resp-01-elev/pulseox':['Hvad kaldes hæmoglobinets arterielle iltmætning, som estimeres med pulsoximetri?','SpO₂',['spo2','saturation','iltmætning','oxygenmætning','arteriel iltmætning','hæmoglobinets iltmætning']],
 'metabolic-01/ph':['Hvilken primær syre-base-forstyrrelse kan følge af akut hyperventilation?','Respiratorisk alkalose',['respiratorisk alkalæmi']],
 'toxic-01/followup-2':['Hvilken analyse kan skelne carboxyhæmoglobin fra andre hæmoglobinfraktioner i en blodprøve?','Co-oximetri',['co oximetri','cooximetri','co-oximetry','cooximetry','co-oksimetri']],
 'infection-01/cells':['Hvilken granulocyt er ofte blandt de første ved akut bakteriel inflammation?','Neutrofil granulocyt',['neutrofile granulocytter','neutrofil','neutrofile','neutrofilocyt','neutrophil']],
 'immune-01/ige':['Hvilken immunglobulinklasse er klassisk forbundet med straksallergi?','IgE',['immunglobulin e','immunoglobulin e']],
 'renal-02/followup-1':['Hvilket organ er centralt for udskillelsen af kalium fra blodet?','Nyrerne',['nyre','nyren','nyrer']],
 'arrest-01/followup-2':['Hvad hedder den elektriske behandling, der kan afbryde ventrikelflimren?','Defibrillering',['defibrillation','defibrilere','defibrillere','defibrillationsterapi']],
 'burn-01/followup-1':['Hvad kaldes den tid, hvor vævet er udsat for varmekilden?','Eksponeringstid',['eksponeringstiden','kontakttid','kontakttiden','påvirkningstid']],
 'science-resistance/followup-2':['Hvad hedder egenskaben, hvor en bakterie ikke længere er følsom over for et bestemt antibiotikum?','Resistens',['antibiotikaresistens','antibiotika resistens','antimikrobiel resistens']],
 'science-renal/followup-1':['Hvilket hormon øger vandreabsorptionen i nyrernes samlerør ved væskemangel?','ADH',['vasopressin','antidiuretisk hormon','arginin vasopressin']],
 'science-calcium/followup-2':['Hvilket EKG-interval kan blive forlænget ved hypokalcæmi?','QT-intervallet',['qt','qt interval','qt-interval','qtc','qtc intervallet','qt tid','qtc tid']],
 'science-tdp/followup-2':['Hvilket EKG-interval er særligt relevant ved risiko for torsades de pointes?','QT-intervallet',['qt','qt interval','qt-interval','qtc','qtc intervallet','qt tid','qtc tid']]
};
const sort:Record<string,Sort>={
 'cardiac-01-behandler/flow-mechanism':['Hvordan ændres følgende typisk ved venedilatation efter nitroglycerin?',['↑ Stiger','↓ Falder'],[['Venernes kapacitet',0],['Venøst tilbageløb',1],['Preload',1]],'Venedilatation øger venekapaciteten og kan reducere venøst tilbageløb og fyldning. Det kan også sænke blodtrykket.'],
 'cardiac-01-paramediciner/flow-balance':['Hvilke ændringer kan følge af nitratets venedilatation?',['↑ Stiger','↓ Falder'],[['Ventriklens fyldning',1],['Vægspænding',1],['Venekapacitet',0]],'Nitrat kan reducere fyldning og vægspænding, hvilket kan mindske iltbehovet. Respons afhænger af patientens hæmodynamik.'],
 'trauma-01/followup-2':['Hvilken retning kan følgende fund pege i ved revurdering?',['Bedre perfusion','Dårligere perfusion'],[['Kortere kapillærrespons og varmere hud',0],['Tiltagende konfusion',1],['Køligere ekstremiteter og tiltagende bleghed',1]],'Perifere tegn og mental status kan understøtte vurdering af perfusion, men skal tolkes sammen med øvrige fund.'],
 'allergy-01/flow-action':['Placér adrenalins typiske receptorvirkninger i den rigtige kategori.',['↑ Stiger','↓ Falder'],[['Perifer karmodstand via α₁',0],['Kontraktilitet via β₁',0],['Bronkial modstand via β₂',1]],'α₁ bidrager til vasokonstriktion, β₁ til hjertestimulation og β₂ til bronkodilatation. Den samlede respons varierer.'],
 'glucose-01/flow-monitor':['Hvilke fund passer bedst med bedring eller fortsat påvirkning efter behandling?',['Bedring','Fortsat påvirkning'],[['Blodglukose normaliseres og kontakt bedres',0],['Ny konfusion og faldende glukose',1],['Vedvarende fokalt neurologisk udfald',1]],'Bedring kræver samlet vurdering af glukose og neurologisk status; vedvarende fokale udfald kan skyldes anden sygdom.'],
 'resp-01/flow-beta':['Hvordan påvirkes følgende typisk ved effektiv bronkodilatation?',['↑ Stiger','↓ Falder'],[['Bronkiernes diameter',0],['Luftvejsmodstand',1],['Arbejdet mod obstruktionen',1]],'Afslapning af bronkiernes glatte muskulatur kan øge diameteren og reducere modstand og respirationsarbejde.'],
 'resp-01-paramediciner/flow-fatigue':['Sortér fundene efter deres betydning hos en patient med svær astma.',['Tegn på bedring','Bekymrende'],[['Mindre pibelyd og tiltagende sløvhed',1],['Mere sammenhængende tale og mindre respirationsarbejde',0],['Tiltagende udtrætning og stigende pCO₂',1]],'Mindre pibelyd er ikke nødvendigvis bedring ved faldende luftstrøm. Kontakt, ventilation og respirationsarbejde skal ses sammen.'],
 'sepsis-01/followup-1':['Sortér de kliniske observationer.',['Mulig akut organpåvirkning','Lokalt infektionstegn'],[['Ny konfusion',0],['Dysuri',1],['Ny sparsom diurese',0]],'Ændret bevidsthed og diurese kan afspejle organdysfunktion, mens dysuri kan pege på et lokalt urinvejsproblem.'],
 'dka-01/followup-1':['Hvordan påvirkes følgende typisk ved udtalt insulinmangel?',['↑ Stiger','↓ Falder'],[['Ketondannelse',0],['Insulinstimuleret glukoseoptag i muskler',1],['Glukose i blodet',0]],'Insulinmangel kan reducere glukoseoptag og fremme hyperglykæmi og ketogenese.'],
 'renal-01/followup-1':['Hvilke ændringer kan ses ved akut væskemangel og kroppens kompensation?',['↑ Stiger','↓ Falder'],[['Venøst tilbageløb',1],['Slagvolumen',1],['Sympatisk kompensationsaktivitet',0]],'Væsketab kan reducere fyldning og slagvolumen og udløse sympatisk kompensation.'],
 'pharm-01/followup-1':['Sortér observationerne efter hvad de især bruges til at vurdere efter opioidbehandling.',['Analgesi','Respiration/vågenhed'],[['Patientens smertescore',0],['Respirationsfrekvens',1],['Sedationsniveau',1]],'Analgesi og bivirkninger skal vurderes særskilt.'],
 'resp-02/followup-1':['Sortér målingerne efter hvilken funktion de primært belyser.',['Oxygenation','Ventilation'],[['SpO₂',0],['Arteriel pCO₂',1],['Respirationsfrekvens og tidalvolumen',1]],'SpO₂ estimerer oxygenation. CO₂ og respiratoriske observationer bidrager til ventilationsvurderingen.'],
 'hygiene-01/followup-1':['Sortér tiltagene i forhold til risikoen for indirekte kontaktsmitte.',['Reducerer risiko','Øger risiko'],[['Relevant rengøring af kontaktflader',0],['Berøring af rent udstyr med forurenede handsker',1],['Håndhygiejne efter kontakt',0]],'Håndhygiejne og rengøring reducerer overførsel via hænder og forurenede flader.'],
 'cold-01/followup-1':['Sortér de fysiske forhold.',['Øget varmetab','Mindsket varmetab'],[['Vådt tøj og vind',0],['Tør isolerende beklædning',1],['Kontakt med koldt underlag',0]],'Fugt, vind og kontakt med koldt underlag kan øge varmetab. Isolering kan mindske det.'],
 'renal-02/followup-2':['Sortér observationerne efter om de kan understøtte mistanke om hyperkaliæmi.',['Understøtter mistanken','Ingen typiske EKG-tegn'],[['Spidse T-takker',0],['Nedsat nyrefunktion og muskelsvaghed',0],['Normalt udseende EKG',1]],'Hyperkaliæmi kan give EKG-forandringer, men fravær af typiske tegn udelukker den ikke.'],
 'science-pe/followup-2':['Sortér mulige følger af en større lungeemboli.',['↑ Stiger','↓ Falder'],[['Modstand i lungekredsløbet',0],['Belastning af højre ventrikel',0],['Fyldning af venstre ventrikel',1]],'Obstruktion kan øge pulmonal modstand og højre ventrikels belastning og mindske fyldningen af venstre hjerte.'],
 'science-immune/followup-2':['Placér de immunologiske funktioner.',['Medfødt forsvar','Adaptivt forsvar'],[['Neutrofil fagocytose',0],['Antistoffer fra plasmaceller',1],['Komplementsystemets tidlige aktivering',0]],'Medfødt forsvar reagerer hurtigt, mens det adaptive forsvar blandt andet omfatter specifikke antistoffer. Systemerne arbejder sammen.'],
 'science-thyroid/followup-1':['Hvad kan forhøjet thyreoideahormon typisk medføre?',['↑ Stiger','↓ Falder'],[['Energiomsætning',0],['Varmeproduktion',0],['Kropsvægt trods bevaret appetit',1]],'Forhøjet thyreoideahormon kan øge energiomsætning og varmeproduktion og bidrage til vægttab.'],
 'science-calcium/followup-1':['Sortér fundene ved lavt ioniseret calcium.',['Foreneligt','Ikke typisk'],[['Prikken omkring munden',0],['Muskelspasmer',0],['Nedsat neuromuskulær excitabilitet som forklaring på spasmerne',1]],'Lavt ioniseret calcium kan øge neuromuskulær excitabilitet og give paræstesier og spasmer.'],
 'science-renal/followup-2':['Hvordan kan kroppen reagere ved væskemangel?',['↑ Stiger','↓ Falder'],[['ADH-virkning',0],['Vandreabsorption',0],['Urinproduktion',1]],'ADH fremmer vandreabsorption og kan mindske urinproduktionen. Diuretika og nyresygdom kan påvirke responsen.'],
 'science-svt/followup-1':['Placér følgerne af en markant øget hjertefrekvens.',['↑ Stiger','↓ Falder'],[['Antal hjerteslag pr. minut',0],['Diastolisk fyldningstid pr. slag',1],['Tid til koronarperfusion pr. slag ved venstre ventrikel',1]],'Ved høj frekvens forkortes diastolen, hvilket kan begrænse fyldning og koronarperfusion.'],
 'science-tdp/followup-1':['Sortér faktorerne efter deres betydning for erhvervet forlænget QT.',['Kan øge risiko','Ikke i sig selv en risikofaktor'],[['Hypokaliæmi',0],['QT-forlængende medicin',0],['Normalt kalium uden øvrige fund',1]],'Lavt kalium og visse lægemidler kan øge risikoen for QT-forlængelse og torsades.'],
 'ekg-af/followup-2':['Sortér fundene fra vurderingen af hjertebanken.',['Elektrisk aktivitet','Mekanisk/klinisk cirkulation'],[['QRS-komplekser',0],['Palpabel puls',1],['Blodtryk',1]],'Monitorrytmen viser elektrisk aktivitet. Puls og blodtryk hjælper med at vurdere mekanisk cirkulation.'],
 'ekg-block/followup-2':['Sortér fundene efter hvad de viser.',['Elektrisk aktivitet','Klinisk perfusion'],[['P-takker på EKG',0],['Patientens bevidsthed',1],['Palpabel perifer puls',1]],'EKG-fund skal ses sammen med kliniske tegn på cirkulation.'],
 'ekg-vt-01/followup-1':['Hvad kan typisk ske ved meget hurtig ventrikulær rytme?',['↑ Stiger','↓ Falder'],[['Ventrikelfrekvens',0],['Diastolisk fyldningstid',1],['Effektivt slagvolumen ved kompromitteret fyldning',1]],'Hurtig ventrikulær rytme kan reducere fyldning og effektiv pumpefunktion.'],
 'drug-02/q1':['Sortér enhederne efter hvilken størrelse de beskriver.',['Masse','Volumen','Koncentration'],[['mg',0],['ml',1],['mg/ml',2]],'Masse, volumen og koncentration er forskellige størrelser. Enhederne skal passe sammen ved medicinregning.'],
 'geriatric-01/q1':['Hvad kan ske ved lavere renal clearance, hvis dosering og øvrige forhold er uændrede?',['↑ Stiger','↓ Falder'],[['Elimination pr. tidsenhed ved givet plasmaniveau',1],['Eksponering',0],['Risiko for akkumulering',0]],'Lavere clearance kan øge eksponeringen og risikoen for akkumulering ved uændret dosering.'],
 'comm-01/followup-1':['Sortér kommunikationen ved en vigtig overlevering.',['Understøtter closed-loop','Modarbejder closed-loop'],[['Gentag den vigtige oplysning tydeligt',0],['Bed om bekræftelse',0],['Antag at alle har hørt beskeden',1]],'Tydelig besked og bekræftelse reducerer risikoen for misforståelser.']
};
const order:Record<string,Order>={
 'ortho-01/followup-2':['Sæt kraftens vej ved en muskelkontraktion i rækkefølge.',['Muskel kontraherer','Senen overfører kraft','Knogle bevæges omkring leddet'],'Sener overfører muskelkraft til knogler, så kontraktion kan skabe bevægelse.'],
 'aorta-01/followup-1':['Sæt en mulig kredsløbsmekanisme ved indre blødning i rækkefølge.',['Blod forlader karbanen','Venøst tilbageløb reduceres','Slagvolumen falder','Organperfusion kan falde'],'Blodtab kan reducere preload og slagvolumen og føre til utilstrækkelig perfusion.'],
 'head-01/followup-2':['Sæt en mulig mekanisme ved hypotension og uændret ICP i rækkefølge.',['MAP falder','CPP falder','Cerebral perfusion kan kompromitteres'],'CPP estimeres som MAP minus ICP. Et fald i MAP kan derfor reducere perfusionstrykket.'],
 'peds-02/followup-1':['Sæt et muligt respiratorisk forværringsforløb i rækkefølge.',['Øget luftvejsmodstand','Øget respirationsarbejde','Udtrætning','Effektiv ventilation kan svigte'],'Ved stigende respirationsarbejde kan et barn blive udtrættet. Færre indtrækninger er ikke altid bedring.'],
 'obst-01/followup-1':['Sæt en mulig virkning af ændret lejring i rækkefølge.',['Mindre kompression af vena cava','Øget venøst tilbageløb','Bedre ventrikelfyldning','Bedre perfusion kan følge'],'Mindsket aortokaval kompression kan understøtte venøst tilbageløb og kredsløb.'],
 'trauma-02/followup-2':['Sæt den mulige mekanisme ved trykpneumothorax i rækkefølge.',['Tiltagende intrathorakalt tryk','Reduceret venøst tilbageløb','Reduceret fyldning af hjertet','Faldende minutvolumen'],'Højt intrathorakalt tryk kan kompromittere hjertets fyldning og give obstruktiv kredsløbspåvirkning.'],
 'science-resistance/followup-1':['Sæt en mulig selektionsmekanisme ved antibiotikaeksponering i rækkefølge.',['Bakterier med forskellig følsomhed','Antibiotika påvirker følsomme bakterier','Mindre følsomme bakterier kan overleve','De overlevende kan formere sig'],'Antibiotika kan selektere for resistente bakterier. Vedvarende symptomer alene beviser ikke resistens.'],
 'science-pe/followup-1':['Sæt en mulig udvikling af lungeemboli i rækkefølge.',['Trombe dannes i en dyb vene','En del af tromben løsriver sig','Embolus føres gennem højre hjerte','En lungearterie obstrueres'],'En venøs trombe kan embolisere via højre hjerte til lungekredsløbet.']
};
function shuffle<T>(items:T[],seed:string):T[]{
 const a=[...items];let h=2166136261;for(const ch of seed)h=Math.imul(h^ch.charCodeAt(0),16777619);
 for(let i=a.length-1;i>0;i--){h=Math.imul(h^(h>>>16),2246822519);const j=(h>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]];}
 return a;
}
export function diversifyQuestions(c:PatientCase):PatientCase{
 return {...c,steps:c.steps.map(step=>{
  // Keep monthly numeric/image-dependent originals and their IDs intact.
  if(step.kind!=='choice'&&step.kind!=='multi')return step;
  const key=c.id+'/'+step.id,familyKey=(c.familyId??c.id)+'/'+step.id;
  const keyFor=<T,>(map:Record<string,T>)=>map[key]??(step.id.startsWith('followup-')?map[familyKey]:undefined);
  const s=keyFor(short),k=keyFor(sort),o=keyFor(order);
  const base={id:step.id,update:step.update,vitalsUpdate:step.vitalsUpdate,imageKey:step.imageKey};
  if(s)return {...base,kind:'short',prompt:s[0],correct:s[1],accepted:s[2],explanation:step.explanation} as Step;
  if(k){const [prompt,categories,rows,explanation]=k;return {...base,kind:'classify',prompt,categories:categories.map((text,i)=>({id:String(i),text})),items:shuffle(rows.map(([text],i)=>({id:String(i),text})),c.id+step.id),correct:Object.fromEntries(rows.map(([,cat],i)=>[String(i),String(cat)])),explanation} as Step;}
  if(o){const [prompt,rows,explanation]=o;return {...base,kind:'order',prompt,options:shuffle(rows.map((text,i)=>({id:String(i),text})),c.id+step.id),correct:rows.map((_,i)=>String(i)),explanation} as Step;}
  return step;
 })};
}
