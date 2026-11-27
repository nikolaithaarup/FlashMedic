import type {PatientCase,Step} from './caseEngine';
const ch=(id:string,prompt:string,options:string[],correct:number,explanation:string,update?:string,vitalsUpdate?:Record<string,string>):Step=>({id,kind:'choice',prompt,options:options.map((text,i)=>({id:String(i),text})),correct:String(correct),explanation,update,vitalsUpdate});
const nitrate={title:'Nitroglycerin – produktinformation (DailyMed)',url:'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=f9b52553-5a26-d374-e053-6294a90a40c7'};
const afterNitro={BT:'122/74 mmHg',Puls:'90/min'};
const lowNitro={BT:'94/58 mmHg',Puls:'104/min'};
const hypo={Glukose:'2,4 mmol/L'};
const recovered={Glukose:'5,8 mmol/L'};
const allergyAfter={BT:'104/68 mmHg',Puls:'112/min',RF:'24/min'};
const asthmaAfter={RF:'24/min',Puls:'122/min','SpO₂':'96 %'};
// Predetermined educational events, not treatment recommendations or a simulator of
// the consequences of a learner's answer. Clinical actions are described as case facts.
const extras:Record<string,Step[]>={
 'cardiac-01':[
 ch('flow-check','Hvad er vigtigt at måle inden eventuel nitroglycerin?',['Blodtryk','Højde','Temperatur alene'],0,'Nitroglycerin kan sænke blodtrykket. Vurder også symptomer, medicin og kontraindikationer efter gældende instruks.','Holdet overvejer nitroglycerin efter vurdering og medicingennemgang.'),
 ch('flow-effect','Hvad forventer du typisk kan ske med blodtrykket efter nitroglycerin?',['Det kan falde','Det stiger altid','Det kan aldrig ændre sig'],0,'Karudvidelse kan reducere blodtrykket. Effekten varierer.','Efter relevant vurdering har holdet givet nitroglycerin.'),
 ch('flow-why','Hvorfor kan nitroglycerin lindre iskæmiske brystsmerter?',['Hjertets arbejdsbelastning og iltbehov kan falde','Det opløser altid en blodprop','Det øger altid pulsen'],0,'Især venedilatation reducerer fyldning og vægspænding, hvilket kan reducere iltbehovet.','Smerterne er aftaget, og nye værdier måles.',afterNitro),
 ch('flow-repeat','Patienten bliver nu svimmel. Hvilken vurdering er mest relevant?',['Gentag blodtryk og vurder kredsløb','Antag at smertelindring betyder at alt er normalt','Se bort fra svimmelheden'],0,'Ny svimmelhed efter nitrat kan skyldes hypotension. Revurder patienten og følg gældende instruks.','Patienten bliver bleg og svimmel.',lowNitro)],
 'cardiac-01-behandler':[
 ch('flow-check','Hvilken oplysning i medicinanamnesen kan være afgørende inden nitratbehandling?',['Nylig brug af sildenafil eller tadalafil','Daglig vitamin D','Tidligere brug af øjendråber alene'],0,'PDE-5-hæmmere kan forstærke nitraters blodtrykssænkende virkning alvorligt. Vurder altid øvrige kontraindikationer og lokal instruks.','Holdet gennemgår medicin og kontraindikationer.'),
 ch('flow-mechanism','Hvordan påvirker nitroglycerin primært venøst tilbageløb?',['Venekapaciteten øges og preload kan falde','Venekapaciteten falder og preload stiger altid','Venerne påvirkes ikke'],0,'Venedilatation øger kapaciteten og kan reducere venøst tilbageløb og ventrikelfyldning.','Holdet har givet nitroglycerin efter relevant vurdering.'),
 ch('flow-reassess','Hvorfor måles blodtrykket igen, selv om brystsmerterne aftager?',['Nitrat kan sænke trykket og påvirke perfusion','Smertelindring betyder at blodtrykket altid er normalt','Blodtrykket har ingen betydning ved iskæmi'],0,'Symptomlindring og kredsløbsstabilitet er forskellige forhold.','Smerten aftager fra NRS 7 til 3.',afterNitro),
 ch('flow-hypotension','Hvad kan forklare patientens svimmelhed og faldende blodtryk?',['Reduceret fyldning og slagvolumen efter vasodilatation','Øget blodvolumen efter nitrat','Nitrat har altid øget kontraktiliteten'],0,'Vasodilatation kan reducere preload og tryk; ved ny hypotension er revurdering afgørende.','Ved næste måling er patienten svimmel.',lowNitro)],
 'cardiac-01-paramediciner':[
 ch('flow-risk','Hvilken kombination kan give udtalt hypotension ved nitroglycerin?',['Samtidig virkning af en PDE-5-hæmmer','Normal natriumkoncentration','Tidligere ukompliceret influenza'],0,'PDE-5-hæmning forstærker cGMP-medieret vasodilatation. Kontrollér medicinanamnese og kontraindikationer.','Holdet vurderer egnethed til nitrat.'),
 ch('flow-balance','Hvordan kan nitrat forbedre myokardiets iltbalance?',['Mindre fyldning og vægspænding kan reducere iltbehovet','Det øger altid hjertefrekvensen og iltbehovet','Det fjerner enhver koronar trombe'],0,'Nitrat reducerer især preload og dermed ofte vægspænding; for stort trykfald kan dog kompromittere perfusion.','Nitroglycerin er givet efter relevant vurdering.'),
 ch('flow-perfusion','Hvad bør få dig til at genoverveje den videre behandling?',['Ny hypotension med svimmelhed','Smertelindring alene beviser stabil perfusion','Normal temperatur alene'],0,'Faldende tryk og nye symptomer kan være tegn på utilstrækkelig perfusion, uanset smertens intensitet.','Smerterne er aftaget.',afterNitro),
 ch('flow-handover','Hvad er vigtigt at fremhæve ved overlevering?',['Symptomer, EKG, medicin, tidsforløb og blodtryk før/efter','Kun det seneste smertetal','Kun patientens alder'],0,'Udviklingen over tid og behandlingsrespons hjælper modtageren med at vurdere både iskæmi og kredsløbspåvirkning.','Patienten er igen svimmel; trykket er faldet.',lowNitro)],
 'glucose-01':[
 ch('flow-conscious','Hvad er særligt vigtigt at vurdere, før noget gives gennem munden?',['Bevidsthed og evne til at synke sikkert','Højden','Om patienten har sko på'],0,'Ved påvirket bevidsthed kan synkefunktionen være usikker, og der er aspirationsrisiko.','Målingen bekræfter lavt blodsukker.',hypo),
 ch('flow-monitor','Hvad bør kontrolleres igen efter behandling af lavt blodsukker?',['Blodsukker og bevidsthed','Kun hudfarven','Kun temperaturen'],0,'Gentagne målinger og klinisk vurdering viser responsen og eventuelle vedvarende fund.','Holdet har behandlet hypoglykæmien efter gældende instruks.',recovered)],
 'glucose-01-behandler':[
 ch('flow-history','Hvilken oplysning hjælper med at forklare det lave blodsukker?',['Insulintidspunkt, dosis og måltider','Patientens skostørrelse','Kun tidspunktet for sidste tandlægebesøg'],0,'Forholdet mellem insulin, fødeindtag og aktivitet kan forklare hypoglykæmi.','Blodsukkeret måles.',hypo),
 ch('flow-aspiration','Hvorfor er bevidsthedsniveau relevant for valg af behandlingsvej?',['Nedsat synkefunktion kan øge aspirationsrisiko','Bevidsthed ændrer altid insulin til glukagon','Det er uden betydning'],0,'Patientens evne til sikkert at synke er vigtig ved valg af behandlingsvej. Følg lokale instrukser.','Patienten er fortsat konfus.')],
 'glucose-01-paramediciner':[
 ch('flow-measure','Hvorfor er en ny blodsukkermåling vigtig trods mindre svedtendens?',['Autonome symptomer afspejler ikke sikkert den aktuelle glukose','Svedtendens er en præcis glukosemåling','Glukose kan ikke falde igen'],0,'Klinisk bedring erstatter ikke gentagne målinger og neurologisk vurdering.','Blodsukker 2,4 mmol/L bekræftes, og holdet behandler efter instruks.',hypo),
 ch('flow-follow','Hvilken information har særlig betydning for risikoen for recidiv?',['Insulintype, tidspunkt, indtag og målingernes udvikling','Kun den første puls','Kun patientens alder'],0,'Virkningsvarighed og fødeindtag kan påvirke, hvor længe risikoen for hypoglykæmi varer.','Blodsukkeret er midlertidigt normaliseret.',recovered)],
 'allergy-01-elev':[
 ch('flow-urgent','Hvilken observation er særlig vigtig at følge ved tiltagende hævelse?',['Luftvejen og stemmen','Kun udslættets størrelse','Kun patientens højde'],0,'Hævelse og stemmeændring kan pege på påvirkede øvre luftveje.','Patienten fortæller, at stemmen har ændret sig.'),
 ch('flow-response','Hvad viser de nye værdier bedst?',['Kredsløb og respiration er bedret, men skal stadig følges','Anafylaksi er endeligt udelukket','Der er ikke behov for ny vurdering'],0,'Bedring udelukker ikke senere forværring. Luftveje, respiration og kredsløb skal fortsat vurderes.','Holdet har behandlet anafylaksien efter gældende instruks.',allergyAfter)],
 'allergy-01':[
 ch('flow-action','Hvorfor er adrenalin centralt ved denne kombination af hypotension og bronkokonstriktion?',['Det kan påvirke både kar, hjerte og bronkier','Det virker kun på kløe','Det virker kun som smertestillende'],0,'Adrenalin kan øge karmodstand og hjerteaktivitet og afslappe bronkial muskulatur.','Luftvejssymptomerne og hypotensionen fortsætter.'),
 ch('flow-response','Hvad er vigtigt at vurdere ved den nye måling?',['Både luftveje, respirationsarbejde og perfusion','Kun den forbedrede blodtryksværdi','Kun hudens udslæt'],0,'Respons kan være forskellig mellem organsystemerne; en enkelt måling er ikke tilstrækkelig.','Efter behandling efter gældende instruks er patienten mindre svimmel.',allergyAfter)],
 'allergy-01-paramediciner':[
 ch('flow-volume','Hvorfor kan væskemangel i karbanen stadig være relevant efter vasokonstriktion?',['Kapillærlækage kan fortsat reducere cirkulerende volumen','Vasokonstriktion gendanner altid tabt væske','Hæmoglobin er altid fordoblet'],0,'Karrespons og intravaskulært volumen er forskellige størrelser.'),
 ch('flow-persist','Hvad betyder bedre blodtryk, hvis der fortsat er hæshed?',['Risiko for luftvejspåvirkning er ikke væk','Bedre tryk udelukker øvre luftvejsobstruktion','Hæshed er et sikkert tegn på normal luftvej'],0,'Bedring i kredsløbet kan forekomme uden fuld bedring af luftvejene.','Efter behandling er kredsløbet bedret, men stemmen er fortsat hæs.',allergyAfter)],
 'resp-01-elev':[
 ch('flow-med','Hvilken del af luftvejene forsøger bronkodilaterende medicin at påvirke?',['Glat muskulatur i bronkierne','Hjertets klapper','Erytrocytterne'],0,'Bronkodilatatorer kan afslappe glat muskulatur og mindske luftvejsmodstanden.','Holdet giver inhalationsbehandling efter gældende instruks.'),
 ch('flow-recheck','Hvilket tegn understøtter klinisk bedring efter behandling?',['Patienten kan tale længere og arbejder mindre for at trække vejret','En højere puls alene','En uændret bevidsthed alene'],0,'Taleevne, respirationsarbejde og gentagne observationer er vigtige sammen med SpO₂.','Patienten kan nu tale i hele sætninger.',asthmaAfter)],
 'resp-01':[
 ch('flow-beta','Hvordan kan en β₂-agonist reducere modstanden i luftvejene?',['Afslapning af bronkiernes glatte muskulatur','Kontraktion af bronkiernes glatte muskulatur','Blokade af alveolernes gasudveksling'],0,'β₂-stimulation kan give bronkodilatation og lettere luftpassage.','Efter vurdering gives inhalationsbehandling efter gældende instruks.'),
 ch('flow-side','Hvilken bivirkning kan bidrage til den ændrede puls efter β₂-agonist?',['Takykardi','Obligatorisk komplet AV-blok','Permanent asystoli'],0,'β₂-agonister kan give hjertebanken og takykardi. Vurder medicinrespons og patientens øvrige fund.','Respirationsarbejdet er mindre, men pulsen er steget.',asthmaAfter)],
 'resp-01-paramediciner':[
 ch('flow-fatigue','Hvorfor er mindre pibelyd ikke nødvendigvis bedring hos en udtrættet patient?',['Meget lav luftstrøm kan give mindre hørbar pibelyd','Pibelyd forsvinder kun ved normal ventilation','SpO₂ viser altid pCO₂'],0,'Ved kritisk luftvejsobstruktion kan luftstrømmen være så lille, at respirationslyde aftager.','Trods behandling er patienten mere udtrættet.'),
 ch('flow-priority','Hvad er vigtigt at overlevere, når ventilationen forværres trods behandling?',['Udvikling i bevidsthed, respirationsarbejde, gasudveksling og respons','Kun den oprindelige astmadiagnose','Kun den seneste puls'],0,'Tidsforløb og svigtende respons hjælper med at identificere behov for eskalation.','Patienten svarer langsommere og har mindre kraftfuld respiration.',{RF:'18/min','SpO₂':'90 %'})]
};
export function evolveCase(c:PatientCase):PatientCase{
 const additions=extras[c.id];if(!additions)return c;
 // Preserve existing questions, but reveal early events before the existing follow-up.
 let steps=[...c.steps,...additions];
 if(c.id==='glucose-01'||c.id==='glucose-01-behandler'||c.id==='glucose-01-paramediciner'){steps=[...c.steps.slice(0,-1),...additions,c.steps[c.steps.length-1]];}
 // Vary correct-option position deterministically; identifiers and keys remain stable.
 steps=steps.map(step=>step.id.startsWith('flow-')&&step.kind==='choice'?{...step,options:[...step.options.slice(1+((step.id.length+c.id.length)%2)),...step.options.slice(0,1+((step.id.length+c.id.length)%2))]}:step);
 return {...c,steps,sources:c.id.startsWith('cardiac-01')?[...c.sources,nitrate]:c.sources};
}
