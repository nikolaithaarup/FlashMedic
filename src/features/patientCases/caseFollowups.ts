import type {PatientCase,Step} from './caseEngine';
// Two short, authored clinical follow-ups per encounter. Shared core concepts
// reinforce the same patient across levels; existing level-specific questions remain.
// Tuple: new observation (optional), question, correct answer, distractors, rationale.
type Followup=[string,string,string,string,string,string];
const bank:Record<string,Followup[]>={
'trauma-01':[
 ['Blødningen er nu standset.','Hvorfor kan patienten stadig være kredsløbspåvirket?','Det tidligere blodtab er ikke erstattet','Karret er stoppet med at bløde, så volumen er normalt','Hæmoglobinet stiger straks','Blødningskontrol standser yderligere tab, men genopretter ikke i sig selv det cirkulerende volumen.'],
 ['Patienten er fortsat bleg og klam.','Hvilken ændring ville understøtte bedret perifer perfusion?','Kortere kapillærrespons sammen med bedre klinisk tilstand','Faldende bevidsthedsniveau','Tiltagende kølige ekstremiteter','Hudperfusion og bevidsthed kan bidrage til vurdering af udviklingen, men skal ses sammen med øvrige fund.']],
'infection-01':[
 ['Rødmen breder sig, og patienten får kulderystelser.','Hvorfor er nye systemiske symptomer vigtige?','Infektionen kan være mere omfattende end den lokale hudreaktion','De beviser, at såret er sterilt','De viser, at immunforsvaret er ophørt','Systemiske symptomer kan ledsage en mere alvorlig infektion og kræver ny vurdering.'],
 ['','Hvorfor undersøges patientens bevidsthed og kredsløb igen?','For at opdage tegn på akut organpåvirkning','For at afgøre bakteriearten sikkert','For at erstatte anamnese og undersøgelse','Ved infektion kan ændret bevidsthed og kredsløbsfund være tegn på alvorlig systemisk sygdom.']],
'sepsis-01':[
 ['Patienten er fortsat konfus ved revurdering.','Hvorfor er ændring fra patientens normale bevidsthedsniveau vigtig?','Den kan vise ny organpåvirkning','Den viser sikkert hvilken bakterie der er årsagen','Den udelukker anden akut sygdom','Akut ændret mental status kan være et tegn på organdysfunktion; det er ikke specifikt for sepsis.'],
 ['','Hvad er vigtigst at videreformidle om kredsløbet?','Målingernes udvikling og klinisk perfusion','Kun den højeste temperatur','Kun én enkelt tidligere puls','Tendensen i vitale værdier og kliniske fund giver et bedre billede af forløbet end en isoleret måling.']],
'dka-01':[
 ['Patienten fortæller, at insulindoser er blevet sprunget over under sygdom.','Hvorfor kan sygdom øge risikoen for ketoacidose?','Stresshormoner kan øge insulinbehovet','Stresshormoner erstatter insulin','Infektion stopper leverens glukoseproduktion','Sygdom kan øge insulinbehovet, og utilstrækkelig insulinvirkning kan fremme ketondannelse.'],
 ['','Hvorfor er normalisering af blodsukker ikke alene bevis for ophørt ketoacidose?','Ketoner og acidose kan fortsat være til stede','Glukose og pH er altid identiske mål','Ketoner forsvinder før glukosen kan ændres','Blodglukose og syre-base-status beskriver forskellige dele af tilstanden.']],
'neuro-01':[
 ['Pårørende fortæller, at patienten talte normalt kort før symptomdebut.','Hvorfor er tidspunktet for sidst kendt normaltilstand vigtigt?','Det indgår i vurdering af mulige tidsafhængige behandlinger','Det afgør alene om årsagen er iskæmi eller blødning','Det erstatter en neurologisk undersøgelse','Tidsoplysninger er vigtige for videre diagnostik og behandlingsmuligheder.'],
 ['Under transporten bliver talen dårligere.','Hvordan bør ændringen dokumenteres?','Beskriv det nye fund og tidspunktet sammen med tidligere status','Registrér kun første undersøgelse','Notér kun patientens egen vurdering','Serielle neurologiske observationer gør ændringer tydelige ved overlevering.']],
'renal-01':[
 ['Patienten bliver svimmel ved oprejsning.','Hvad kan forklare dette ved væsketab?','Mindre venøst tilbageløb og forbigående fald i perfusion','Øget cirkulerende volumen','Øget slagvolumen uden kompensation','Ved væskemangel kan stående stilling reducere fyldning og blodtryk yderligere.'],
 ['','Hvorfor er medicinlisten relevant ved diarré og sparsom urin?','Nogle lægemidler kan påvirke nyrefunktion eller væskebalance','Alle lægemidler elimineres uændret i urinen','Medicinlisten kan fastslå præcis GFR','Medicin og væsketab kan sammen påvirke kredsløb, elektrolytter og nyrefunktion.']],
'pharm-01':[
 ['Holdet har givet smertestillende efter gældende instruks.','Hvorfor vurderes både smerte og sedation efter opioidbehandling?','Smertelindring og påvirkning af bevidsthed er forskellige effekter','God smertelindring udelukker respirationspåvirkning','Sedation er et præcist mål for analgesi','Opioider kan påvirke smerte, vågenhed og respiration forskelligt.'],
 ['Patienten bliver mere søvnig.','Hvilket fund er særlig relevant at undersøge nu?','Respirationsfrekvens og effektiv ventilation','Kun skadens lokalisation','Kun den oprindelige smerteintensitet','Tiltagende sedation kan ledsage respirationsdepression; ventilation og bevidsthed skal vurderes sammen.']],
'immune-01':[
 ['Patienten fortæller, at samme medicin tidligere er tålt.','Udelukker tidligere tolerance en allergisk reaktion nu?','Nej, sensibilisering kan være sket siden tidligere eksponering','Ja, allergi kræver altid første eksponering','Ja, hvis den aktuelle dosis er lille','Tidligere tolerance udelukker ikke efterfølgende allergisk sensibilisering.'],
 ['Patienten får nu hæshed og svimmelhed.','Hvorfor ændrer de nye fund den kliniske vurdering?','De kan pege på luftvejs- og kredsløbspåvirkning','De viser at reaktionen kun er lokal','De udelukker systemisk reaktion','Nye fund fra luftveje eller kredsløb ved mulig allergi kan være alvorlige.']],
'resp-02':[
 ['Patienten bliver sværere at vække.','Hvorfor er en tilsyneladende acceptabel SpO₂ ikke tilstrækkelig?','Den fortæller ikke direkte hvor godt CO₂ udskilles','Den måler altid arteriel pCO₂','Den udelukker svigtende ventilation','Oxygenation og ventilation er forskellige størrelser. Ændret bevidsthed kræver ny vurdering.'],
 ['','Hvad kan forklare stigende pCO₂ ved utilstrækkelig alveolær ventilation?','CO₂ fjernes langsommere end det produceres','Nyrerne stopper straks al CO₂-produktion','Hæmoglobin kan ikke længere binde oxygen','Når CO₂-eliminationen falder relativt til produktionen, kan arteriel pCO₂ stige.']],
'peds-01':[
 ['Forældrene fortæller, at barnet næsten ikke har drukket.','Hvorfor er væskeindtag og vandladning relevante?','De kan bidrage til vurdering af væskebalancen','De afgør sikkert om infektionen er viral','De erstatter vurdering af vejrtrækningen','Nedsat indtag og væsketab kan bidrage til dehydrering.'],
 ['Barnet virker nu mere stille.','Hvilken fortolkning er mest sikker?','Stilhed kan være udtrætning og kræver revurdering','Barnet er nødvendigvis raskere','En lavere lyd fra barnet beviser normal ventilation','Adfærd og kontakt er vigtige tegn hos børn, også når respirationsarbejdet ændrer sig.']],
'obst-01':[
 ['Symptomerne aftager i sideleje.','Hvordan kan ændring af stilling påvirke kredsløbet?','Mindsket kompression kan øge venøst tilbageløb','Uterus holder straks op med at modtage blod','Hjertefrekvensen bliver altid nul','Mindre kompression af store kar kan forbedre venøst tilbageløb og perfusion.'],
 ['','Hvorfor skal nye symptomer fortsat vurderes trods bedring i sideleje?','En anden samtidig årsag til svimmelhed kan foreligge','Bedring udelukker enhver blødning','Stillingsændring giver en sikker diagnose','Symptomrespons understøtter en hypotese, men er ikke i sig selv diagnostisk.']],
'toxic-01':[
 ['Begge patienter er kommet væk fra eksponeringen.','Hvorfor kan symptomer fortsætte efter frisk luft?','CO kan fortsat være bundet til hæmoglobin','CO binder kun når patienten er indendørs','Normal luft fjerner alt CO øjeblikkeligt','Carboxyhæmoglobin elimineres over tid, ikke øjeblikkeligt.'],
 ['','Hvilken prøve er bedst egnet til at måle carboxyhæmoglobin?','Blodprøve analyseret med co-oximetri','Almindelig perifer pulsoximetri','Blodsukkermåling','Co-oximetri kan skelne hæmoglobinfraktioner, som almindelig pulsoximetri ikke adskiller.']],
'cardiac-02':[
 ['Patienten bliver mere forpustet i rygleje.','Hvordan kan øget venøst tilbageløb påvirke et svigtende venstre hjerte?','Fyldningstrykket kan stige og øge lungestase','Lungekapillærtrykket falder altid','Venstre ventrikels kontraktilitet normaliseres straks','Ved venstresidigt hjertesvigt kan øget fyldning forværre lungestase.'],
 ['','Hvorfor følges blodtryk ved behandling der ændrer preload eller afterload?','For at opdage utilstrækkeligt perfusionstryk','Fordi blodtryk alene måler lungeødem','Fordi trykket skal falde uanset klinisk status','Hæmodynamisk behandling kan påvirke både hjertets belastning og organperfusion.']],
'hygiene-01':[
 ['Patienten har kastet op på et fælles kontaktområde.','Hvorfor skal overfladen håndteres som mulig smittekilde?','Forurenede overflader kan overføre smitstof via hænder','Virus kan kun spredes gennem blod','Tørre overflader er altid sterile','Indirekte kontakt kan føre smitstof videre til mund og andre personer.'],
 ['','Hvorfor er håndvask relevant efter kontakt med opkast og diarré?','Den fjerner mekanisk organisk materiale og mikroorganismer','Den erstatter altid alle værnemidler','Den gør efterfølgende rengøring overflødig','Håndhygiejne og rengøring suppleres med relevante værnemidler efter gældende retningslinjer.']],
'endo-02':[
 ['Patienten har ikke kunnet beholde sin vanlige medicin.','Hvorfor er dette relevant under akut sygdom?','Behovet for glukokortikoid kan stige samtidig med utilstrækkelig optagelse','Kortisolbehovet ophører ved infektion','Opkastning øger altid steroidoptagelsen','Akut sygdom kan øge behovet for kortisol, mens opkastning kan hindre indtag og optagelse.'],
 ['','Hvorfor måles blodsukker ved svaghed og påvirket bevidsthed?','Kortisolmangel kan bidrage til hypoglykæmi','Kortisolmangel giver altid højt blodsukker','Blodsukkeret bestemmer alene aldosteronmangel','Kortisol understøtter glukoseregulation under stress; lav glukose kan være en del af billedet.']],
'trauma-02':[
 ['Respirationsarbejdet stiger efter det ensidige thoraxtraume.','Hvorfor kan en kollaberet lunge påvirke oxygenationen?','Perfunderede områder kan være utilstrækkeligt ventilerede','Alveolerne producerer mere oxygen','Lungeblodflow ophører altid i begge lunger','Ventilation og perfusion kan blive dårligt matchet, hvilket kan forringe oxygenation.'],
 ['Patienten får faldende blodtryk.','Hvilken mekanisme kan forbinde thoraxtrykket med kredsløbet?','Højt intrathorakalt tryk kan hæmme venøst tilbageløb','Højt thoraxtryk øger altid preload','Trykændringer påvirker kun huden','Ved trykpneumothorax kan højt tryk hæmme fyldning af hjertet og medføre obstruktiv kredsløbspåvirkning.']],
'metabolic-01':[
 ['Patienten fortæller nu om brystsmerter.','Hvorfor bør den oprindelige forklaring revurderes?','Hyperventilation kan være sekundær til anden akut sygdom','Angst udelukker kardiopulmonal sygdom','Paræstesier beviser psykogen årsag','Hyperventilation er et fund, ikke i sig selv en sikker ætiologisk diagnose.'],
 ['','Hvad sker der typisk med pH, hvis pCO₂ vender mod udgangspunktet ved isoleret akut respiratorisk alkalose?','pH bevæger sig mod normalområdet','pH stiger nødvendigvis yderligere','pH er uafhængig af pCO₂','CO₂ indgår i bicarbonatbuffersystemet; ændret CO₂ kan ændre pH.']],
'abd-01':[
 ['Patienten fortæller, at bevægelse gør smerten værre.','Hvilken mekanisme kan forklare dette?','Bevægelse kan irritere et inflammeret peritoneum','Bevægelse øger altid galdeproduktionen','Bevægelse afbryder al visceral nerveledning','Peritoneal irritation kan give smerte ved bevægelse, hoste og tryk, uden at være en sikker diagnose.'],
 ['','Hvorfor er ændringer i puls og almen tilstand vigtige?','De kan pege på tiltagende systemisk påvirkning','De kan sikkert identificere appendix som årsag','De erstatter smerteanamnesen','Akutte mavesmerter kan ledsages af infektion, væsketab eller kredsløbspåvirkning.']],
'ortho-01':[
 ['Hævelsen tiltager under transporten.','Hvorfor undersøges følesans og bevægelse igen?','Hævelse eller skade kan påvirke nerver og væv','En varm fod udelukker enhver nerveskade','Hævelse forbedrer altid nerveledning','Gentagne distale neurovaskulære undersøgelser kan vise udvikling.'],
 ['','Hvad er en senes primære funktion omkring anklen?','Overføre kraft fra muskel til knogle','Forbinde to knogler direkte som et ligament','Producere ledvæske','Sener overfører muskelkraft til knogler; ligamenter stabiliserer led.']],
'pacing-01':[
 ['Monitoren viser pacingimpulser efterfulgt af QRS.','Hvorfor vurderes en palpabel puls samtidig?','Elektrisk capture er ikke altid mekanisk capture','QRS viser altid tilstrækkeligt slagvolumen','Palpabel puls afgør den elektriske ledningsvej','Effektiv mekanisk kontraktion kræver klinisk bekræftelse, ikke kun EKG.'],
 ['','Hvilken ændring understøtter forbedret kredsløb ved effektiv pacing?','Bedre bevidsthed og perfusion sammen med målbar cirkulation','Højere monitorfrekvens alene','Flere pacingimpulser uden puls','Mekanisk respons skal vurderes med kliniske fund og målinger.']],
'syncope-01':[
 ['En tilskuer fortæller, at patienten havde kvalme lige inden kollapset.','Hvorfor er vidnebeskrivelsen nyttig?','Den kan belyse prodromer, varighed og restitution','Den kan alene fastslå den præcise årsag','Den erstatter EKG og klinisk vurdering','Hændelsesforløbet kan støtte differentialdiagnostikken, men er ikke en sikker diagnose.'],
 ['','Hvad bør give anledning til at genoverveje en ukompliceret synkope?','Vedvarende konfusion eller nye fokale udfald','Hurtig fuld restitution alene','At patienten husker sin kvalme','Vedvarende neurologiske fund passer ikke typisk med simpel synkope og kræver videre vurdering.']],
'adrenal-01':[
 ['Patienten fortæller, at opkast har vanskeliggjort indtag af medicin.','Hvorfor er medicinhistorikken særlig relevant?','Tilstrækkelig hormonbehandling kan være vanskelig under sygdom','Opkast sikrer fuld optagelse','Stress reducerer altid kortisolbehovet','Ved binyrebarkinsufficiens kan akut sygdom og manglende optagelse af medicin bidrage til krise.'],
 ['','Hvorfor vurderes både kredsløb og glukose gentagne gange?','Hormonmangel kan påvirke begge dele','Glukosemåling erstatter blodtryksmåling','Kortisol regulerer kun kropstemperatur','Binyrebarkhormoner understøtter kredsløb og glukosebalance; udviklingen kræver samlet vurdering.']],
'tonsil-01':[
 ['Patienten synker fortsat hyppigt.','Hvorfor kan den synlige blødning undervurdere blodtabet?','En del af blodet kan være sunket','Blodet størkner altid før det synkes','Blødning fra tonsiller ses altid fuldt ud','Blod kan synkes og dermed være mindre synligt end det samlede tab.'],
 ['','Hvorfor vurderes luftvejen sammen med kredsløbet?','Blod kan true luftvejen samtidig med at blodtab påvirker perfusion','Blod i munden påvirker kun fordøjelsen','Normal puls udelukker luftvejstrussel','Blødning i svælget kan give både luftvejs- og kredsløbsproblemer.']],
'spine-01':[
 ['Patienten beskriver ændret følesans neden for skaden.','Hvad betyder et nyt neurologisk fund efter traume?','Det kan være tegn på påvirkning af rygmarv eller nerver','Det fastslår alene præcist skadeniveau','Det udelukker samtidig knogleskade','Neurologiske fund skal beskrives og følges; lokalisering kræver samlet vurdering.'],
 ['','Hvorfor må hypotension ikke automatisk tilskrives neurogent shock?','Samtidig blødning kan være til stede','Rygmarvsskade forhindrer blodtab','Varm hud er et sikkert bevis for normal volumen','Traumepatienter kan have flere samtidige shockmekanismer.']],
'mening-01':[
 ['Patienten bliver mere sløv.','Hvorfor skal bevidsthedsniveauet følges tæt?','Infektion kan påvirke CNS og systemisk perfusion','Det kan alene afgøre bakteriearten','Sløvhed udelukker sepsis','Neurologisk forværring kan være tegn på alvorlig infektion eller kredsløbspåvirkning.'],
 ['','Hvorfor er smitteoplysninger vigtige ved overlevering?','De hjælper modtageren med relevante forholdsregler','De erstatter klinisk overlevering','De beviser laboratoriediagnosen','Mistanke om smitsom sygdom kan kræve særlige forholdsregler efter lokale instrukser.']],
'aorta-01':[
 ['Patienten bliver mere bleg og utilpas.','Hvorfor kan en blødning være alvorlig uden synligt blod?','Blodet kan samles i et indre anatomisk rum','Blodtab kræver altid en synlig hudlæsion','Bleghed udelukker indre blødning','Indre blødning kan give stort volumentab uden ydre blødning.'],
 ['','Hvad er relevant at fremhæve i overleveringen?','Pludselig smerte, kendt aneurisme og udviklingen i perfusion','Kun det seneste smertetal','Kun den tidligere aneurismediagnose','Kombinationen af baggrund, symptomdebut og udvikling er klinisk vigtig.']],
'seizure-01':[
 ['Patienten er stadig søvnig efter anfaldet.','Hvorfor er en gentagen blodsukkermåling relevant?','Hypoglykæmi kan udløse kramper og påvirke bevidsthed','Et anfald udelukker hypoglykæmi','Blodsukker afgør sikkert anfaldstypen','Metaboliske årsager kan udløse kramper; glukose er en vigtig reversibel årsag at overveje.'],
 ['','Hvilken udvikling giver grund til at revurdere en forventet postiktal fase?','Tiltagende bevidsthedspåvirkning eller nye anfald','Gradvis tilbagevenden til vanlig kontakt','At patienten husker lidt af anfaldet','Manglende bedring eller ny forværring kræver ny vurdering.']],
'head-01':[
 ['Patienten reagerer nu langsommere end ved første kontakt.','Hvorfor er serielle neurologiske undersøgelser vigtige?','For at opdage forværring i cerebral funktion','For at afgøre blødningstype uden billeddiagnostik','For at erstatte respirationsvurdering','Ændringer i bevidsthed og neurologiske fund kan afspejle tiltagende intrakraniel påvirkning.'],
 ['','Hvorfor er hypotension særlig bekymrende ved mulig alvorlig hjerneskade?','Cerebralt perfusionstryk kan falde','ICP falder altid lige så meget som MAP','Cerebral perfusion er uafhængig af arterietryk','Ved givet ICP kan faldende MAP reducere CPP og bidrage til sekundær hjerneskade.']],
'arrest-01':[
 ['Genoplivning er i gang.','Hvorfor er pauser i brystkompressioner uønskede?','Blodgennemstrømningen til organer falder under pausen','Pauser øger altid koronarperfusionen','Kompressioner virker kun når EKG er normalt','Kompressioner bidrager til blodflow; unødige afbrydelser reducerer perfusion.'],
 ['','Hvad betyder defibrillering ved ventrikelflimren grundlæggende?','Elektrisk energi kan afbryde den kaotiske rytme','Den erstatter alle brystkompressioner','Den stimulerer altid hjertet til normal rytme med det samme','Defibrillering kan terminere VF, men effektiv cirkulation skal fortsat vurderes.']],
'peds-02':[
 ['Barnet har mindre tydelige indtrækninger, men er mere sløvt.','Hvorfor kan dette være en forværring?','Udtrætning kan reducere evnen til at arbejde for respirationen','Færre indtrækninger beviser normal ventilation','Bevidsthed har ingen relation til respirationssvigt','Faldende respirationsarbejde ved tiltagende sløvhed kan være tegn på udtrætning.'],
 ['','Hvorfor er forældrenes beskrivelse af barnets normale adfærd vigtig?','Den hjælper med at vurdere ændringer i kontakt og aktivitet','Den erstatter kliniske observationer','Den kan alene identificere mikroorganismen','Barnets vanlige funktion giver et sammenligningsgrundlag for den akutte vurdering.']],
'hygiene-02':[
 ['Patienten fortæller om flere syge i rejsegruppen.','Hvad bidrager oplysningen med?','Den kan pege på en fælles eksponering eller smittekæde','Den beviser en bestemt diagnose','Den udelukker andre smitteveje','Eksponeringshistorik understøtter risikovurdering, men er ikke i sig selv diagnostisk.'],
 ['','Hvorfor bør modtagende afdeling orienteres om smittemistanken?','For at kunne planlægge relevante forholdsregler','For at erstatte patientens vitale værdier','Fordi anmeldelse alene stopper smitte','Forhåndsinformation understøtter sikker modtagelse og relevante lokale procedurer.']],
'burn-01':[
 ['Patienten fortæller, at tøjet var gennemvædet af varm væske.','Hvorfor er kontakttiden med varmekilden relevant?','Længere varmeeksponering kan øge vævsskaden','Varme skader kun huden det første sekund','Våd beklædning beskytter altid huden','Skadens omfang afhænger blandt andet af temperatur og eksponeringstid.'],
 ['','Hvorfor vurderes håndens følesans og bevægelighed ved skade nær et led?','Hævelse og skade kan påvirke funktion og distal status','Hudrødme beviser normal nervefunktion','Bevægelighed afgør alene forbrændingsdybden','Vurdering af funktion og distal status bidrager til samlet skadesvurdering.']],
'cold-01':[
 ['Patienten har vådt tøj.','Hvorfor øges risikoen for varmetab?','Vand og fordampning kan øge varmetabet','Vådt tøj isolerer altid bedre','Vand stopper varmeledning','Fugt kan øge varmeledning og fordampning, især ved kulde og vind.'],
 ['','Hvorfor kan puls og respiration være langsomme ved alvorlig hypotermi?','Kroppens metaboliske og fysiologiske processer bremses','Alle organers iltbehov stiger ubegrænset','Kulde påvirker kun hudens kar','Faldende kernetemperatur kan dæmpe metabolisme og påvirke hjertets elektriske aktivitet.']],
'electric-01':[
 ['Patienten fortæller, at strømmen muligvis passerede mellem hænderne.','Hvorfor er strømvejen vigtig i anamnesen?','Den kan have betydning for hvilke organer strømmen har passeret','Den kan alene afgøre skadens sværhedsgrad','Strøm passerer aldrig gennem brystkassen','Strømvej, eksponeringstid og omstændigheder bidrager til risikovurdering.'],
 ['','Hvorfor er EKG relevant ved hjertebanken efter elektrisk påvirkning?','Elektrisk strøm kan udløse rytmeforstyrrelser','Hjertebanken beviser ventrikelflimren','EKG viser altid alle dybe vævsskader','EKG kan bidrage til vurdering af rytmeforstyrrelser, men erstatter ikke øvrig skadesvurdering.']],
'geriatric-01':[
 ['Pårørende fortæller, at patienten er markant anderledes end vanligt.','Hvorfor er oplysningen vigtig?','Den støtter mistanke om en akut ændring frem for kun kronisk sygdom','Den beviser at medicin er eneste årsag','Den udelukker infektion','Akut ændring fra habituelt niveau er vigtig ved mulig delirium eller anden akut sygdom.'],
 ['','Hvorfor er tidspunktet for medicinændringen relevant?','Det hjælper med at vurdere tidsmæssig sammenhæng med symptomer','Det fastslår automatisk kausalitet','Det er irrelevant ved nedsat nyrefunktion','Tidsmæssig sammenhæng kan støtte en mistanke, men andre årsager skal også overvejes.']],
'psyche-01':[
 ['Patienten virker mere rolig, når én person taler.','Hvorfor kan færre samtidige indtryk hjælpe?','De kan mindske belastning og gøre kommunikationen lettere','De beviser at somatisk sygdom er udelukket','De fjerner altid hallucinationer','Rolig, enkel kommunikation og færre indtryk kan understøtte kontakt og tryghed.'],
 ['','Hvorfor undersøges vitale værdier også ved en psykiatrisk præget præsentation?','Somatisk sygdom kan give eller forværre ændret adfærd','Psykiatriske symptomer udelukker somatisk sygdom','Vitale værdier fastslår en psykiatrisk diagnose','Metaboliske, infektiøse og andre somatiske årsager kan påvirke adfærd og bevidsthed.']],
'birth-01':[
 ['Veerne kommer tættere, og trykfornemmelsen tiltager.','Hvad kan dette pege på?','Fødslen kan være ved at skride frem','Placentas funktion er nødvendigvis ophørt','Veerne er sikkert afsluttet','Veernes udvikling og trykfornemmelse indgår i vurdering af fødslens progression.'],
 ['','Hvad sker der normalt med barnets lunger ved de første effektive vejrtrækninger?','Lungerne udvides og gasudveksling begynder','Placenta fortsætter som eneste iltkilde','Alveolerne lukkes permanent','Efter fødslen overtager lungerne gradvist gasudvekslingen fra placenta.']],
'obst-02':[
 ['Patienten beskriver tiltagende synsforstyrrelser.','Hvorfor er dette et vigtigt nyt fund?','Det kan afspejle neurologisk påvirkning ved svær hypertensiv graviditetssygdom','Det er altid en normal graviditetsændring','Det udelukker kramperisiko','Hovedpine og synsforstyrrelser kan være tegn på alvorlig organpåvirkning og skal vurderes.'],
 ['','Hvorfor er tidligere blodtryk og graviditetsforløb relevante?','De hjælper med at vurdere ændringen og klinisk kontekst','De fastslår alene diagnosen','De gør en ny måling overflødig','Udviklingen og graviditetens tidspunkt er vigtige sammen med aktuelle fund.']],
'renal-02':[
 ['Patienten fortæller om mindre urinproduktion.','Hvorfor kan nedsat udskillelse øge kalium?','Nyrerne bidrager væsentligt til kaliumelimination','Kalium udskilles normalt kun via lungerne','Lav diurese sænker altid plasma-kalium','Nedsat renal udskillelse kan bidrage til kaliumophobning.'],
 ['','Kan et tilsyneladende normalt EKG udelukke hyperkaliæmi?','Nej, EKG-forandringer kan være variable','Ja, hvis T-takkerne ser normale ud','Ja, hvis pulsen er regelmæssig','EKG kan vise påvirkning, men fravær af typiske tegn udelukker ikke forhøjet kalium.']],
'drug-02':[
 ['Instruktøren finder en tredje ampul med 3 mg/ml.','Hvor mange ml af den fiktive opløsning svarer til ordinationen på 6 mg?','2 ml','3 ml','18 ml','Volumen = dosis / koncentration = 6 mg / 3 mg/ml = 2 ml.'],
 ['','Hvorfor kontrolleres enhederne inden en udregning?','Enhedsforveksling kan medføre store dosisfejl','mg og ml er altid samme størrelse','Koncentration gør enheder overflødige','Masse, volumen og koncentration beskriver forskellige størrelser.']],
'drug-03':[
 ['Patienten fortæller, at svimmelheden begyndte efter opstart af endnu et præparat.','Hvorfor kan tidsforløbet være nyttigt?','Det understøtter vurdering af mulig bivirkning eller interaktion','Det beviser at medicin er eneste årsag','Det erstatter måling af blodtryk','Tidsforløb kan pege på en sammenhæng, men andre årsager skal vurderes.'],
 ['','Hvorfor er både stående og liggende symptomer relevante?','Stillingsafhængige symptomer kan pege på ændret kredsløbsregulation','Stående stilling øger altid cerebral perfusion','Symptomer er uafhængige af blodtryk','Ved stillingsændring skal kredsløbet tilpasse sig ændret venøst tilbageløb.']],
'bariatric-01':[
 ['Patienten fortæller, at åndenøden letter i mere oprejst stilling.','Hvilken mekanisme kan bidrage til dette?','Diafragma kan have bedre plads til bevægelse','Alveolerne ophører med gasudveksling','Thoraxvolumen falder altid i oprejst stilling','Stilling kan påvirke respirationsmekanik og lungevolumener.'],
 ['','Hvorfor aftales en transportstilling med patienten?','Komfort, respiration og praktisk sikkerhed kan vurderes sammen','Kropsvægt afgør alene den korrekte stilling','Patientens erfaring er uden betydning','Individuel vurdering og respektfuld kommunikation understøtter sikker transport.']],
'comm-01':[
 ['Modtageren hørte ikke oplysningen om ændret bevidsthed.','Hvordan sikres det bedst, at den vigtige oplysning er modtaget?','Gentag den tydeligt og bed om bekræftelse','Tal hurtigere sammen med de andre','Antag at den er hørt','Closed-loop kommunikation reducerer risikoen for at vigtige oplysninger overses.'],
 ['','Hvorfor er tidspunktet for en ændring en vigtig del af overleveringen?','Det gør udviklingen og hastigheden af ændringen tydelig','Det gør de øvrige observationer overflødige','Det fastslår alene årsagen','Tidsangivelser hjælper modtageren med at forstå forløbet.']],
'ekg-af':[
 ['Patienten fortæller om tidligere episoder med hjertebanken.','Hvorfor er symptomernes varighed og debut relevante?','De kan påvirke videre vurdering og valg af rytmebehandling','De fastslår alene tromberisikoen','De er uden betydning når rytmen er uregelmæssig','Varighed og øvrige risikofaktorer indgår i videre behandling, herunder vurdering af antikoagulation.'],
 ['','Hvorfor er blodtrykket relevant sammen med EKG-rytmen?','Rytmens kliniske betydning afhænger også af hæmodynamik','EKG viser altid det effektive blodtryk','Regelmæssig perfusion er garanteret ved atrieflimren','Elektriske fund skal fortolkes sammen med symptomer og mekanisk cirkulation.']],
'ekg-flutter':[
 ['Patienten fortæller om tiltagende træthed ved aktivitet.','Hvorfor kan høj ventrikelfrekvens påvirke hjertets fyldning?','Diastolen kan blive kortere','Systolen ophører ved høj frekvens','Fyldningstiden bliver altid længere','Kortere diastole kan begrænse fyldning, afhængigt af hjertets funktion.'],
 ['','Hvad er vigtigt at vurdere ud over rytmen ved ny svimmelhed?','Blodtryk, bevidsthed og øvrige tegn på perfusion','Kun atriefrekvensen','Kun EKG-papirets hastighed','Den kliniske påvirkning afgør betydningen af rytmeforstyrrelsen.']],
'ekg-block':[
 ['Patienten bliver svimmel ved forsøg på at rejse sig.','Hvorfor kan langsom ventrikelfrekvens give symptomer?','Minutvolumen kan være utilstrækkeligt trods kompensation','Slagvolumen stiger altid nok til fuld kompensation','Frekvensen påvirker ikke minutvolumen','Minutvolumen er produktet af frekvens og slagvolumen; kompensation kan være utilstrækkelig.'],
 ['','Hvad bør vurderes ved gentagen observation af monitorrytmen?','Samtidig puls og klinisk perfusion','Kun antallet af P-takker','Kun om kurven er regelmæssig','Elektrisk aktivitet skal sammenholdes med mekanisk cirkulation og patientens tilstand.']],
'ekg-stemi-01':[
 ['Brystsmerterne fortsætter under revurdering.','Hvorfor kan et nyt EKG være relevant ved ændrede symptomer?','Iskæmiske EKG-forandringer kan udvikle sig over tid','Det første EKG afspejler alle fremtidige ændringer','Et nyt EKG erstatter alle vitale værdier','Serielle EKG-optagelser kan bidrage til vurdering af dynamiske ændringer.'],
 ['','Hvorfor kan kvalme og koldsved ledsage akut koronar iskæmi?','Autonome reaktioner kan ledsage smerte og kredsløbspåvirkning','De beviser altid isoleret mavesygdom','De viser at koronarkredsløbet er normalt','Autonome symptomer kan optræde ved akut koronar sygdom, men er ikke specifikke.']],
'ekg-vt-01':[
 ['Patienten bliver mere svimmel.','Hvilken fysiologisk mekanisme kan bidrage ved hurtig ventrikulær rytme?','Kortere fyldningstid og ineffektiv kontraktion kan sænke minutvolumen','Høj frekvens sikrer altid højere minutvolumen','Ventriklerne fyldes kun i systolen','En meget hurtig rytme kan kompromittere fyldning og effektiv pumpefunktion.'],
 ['','Hvad skal afgøres ved pludseligt tab af bevidsthed?','Om patienten har effektiv cirkulation og normal respiration','Kun om QRS fortsat er bredt','Kun om patienten har tidligere infarkt','Ved kollaps er den kliniske vurdering af cirkulation og respiration central.']],
'ekg-potassium-01':[
 ['Patienten fortæller om længere interval siden sidste dialyse.','Hvorfor er dialysehistorikken vigtig?','Den kan pege på risiko for ophobning af kalium og væske','Dialyse påvirker kun hæmoglobin','Misset dialyse udelukker elektrolytforstyrrelse','Dialyse kan fjerne kalium og væske; manglende behandling kan øge risiko for ophobning.'],
 ['','Hvorfor er løbende monitorering relevant ved betydelig kaliumforstyrrelse?','Ledningsforstyrrelser og arytmier kan udvikle sig','Normalt første EKG udelukker senere arytmi','Kalium påvirker kun skeletmuskler','Kalium påvirker cellers elektriske funktion, herunder hjertets ledning og rytme.']],
'science-pe':[
 ['Patienten fortæller, at benet har været ømt efter lang tids stillesidden.','Hvordan kan venøs stase øge tromboserisikoen?','Langsom blodstrøm kan fremme koagulation lokalt','Langsom blodstrøm opløser altid tromber','Venøs stase stopper blodets koagulation','Venøs stase er én af faktorerne i Virchows triade.'],
 ['Patienten bliver mere svimmel.','Hvorfor er kredsløbet vigtigt ved mistanke om større lungeemboli?','Obstruktion kan belaste højre hjerte og reducere venstre fyldning','Lungeemboli påvirker kun alveolerne','Obstruktion øger altid venstre ventrikels fyldning','Øget modstand i lungekredsløbet kan kompromittere højre ventrikels funktion og minutvolumen.']],
'science-resistance':[
 ['Patienten har stadig symptomer trods antibiotika.','Kan manglende bedring alene bevise resistens?','Nej, flere forklaringer er mulige','Ja, alle vedvarende symptomer skyldes resistens','Ja, hvis patienten har feber','Resistens, forkert behandlingsmål og andre forhold kan bidrage; mikrobiologiske svar kan hjælpe.'],
 ['','Hvorfor er det relevant at oplyse hvilket antibiotikum patienten har fået?','Det hjælper med at vurdere forløbet og mulig behandlingseffekt','Det fastslår bakteriearten','Det gør prøvesvar overflødige','Præparat, tidspunkt og respons er nyttige oplysninger i videre vurdering.']],
'science-immune':[
 ['Patienten fortæller, at kemoterapi var for en uge siden.','Hvorfor er tidspunktet for kemoterapi vigtigt?','Det kan hjælpe med vurdering af risiko for immunsuppression','Det beviser at feberen skyldes kemoterapi alene','Det udelukker bakteriel infektion','Kemoterapi kan påvirke knoglemarvens produktion af leukocytter, og forløbet varierer.'],
 ['','Hvorfor kan fravær af tydelige lokale infektionstegn være misvisende?','Et svækket immunrespons kan give færre lokale inflammationstegn','Et svækket immunforsvar forhindrer infektion','Feber kræver altid et synligt sår','Immunsupprimerede kan have alvorlig infektion uden udtalte lokale fund.']],
'science-thyroid':[
 ['Patienten fortæller om vægttab trods bevaret appetit.','Hvilken fysiologisk ændring kan forklare dette?','Forhøjet thyreoideahormon kan øge energiomsætningen','Stofskiftet falder altid ved thyreotoksikose','Appetit er et direkte mål for TSH','Thyreoideahormoner påvirker blandt andet basal energiomsætning og varmeproduktion.'],
 ['Patienten bliver mere urolig.','Hvorfor vurderes temperatur, rytme og bevidsthed sammen?','De kan vise systemisk påvirkning ved alvorlig thyreotoksikose','De fastslår alene hormonniveauerne','Normal blodtryk udelukker systemisk påvirkning','Alvorlig hormonel påvirkning kan involvere flere organsystemer; laboratorieprøver og klinik er nødvendige.']],
'science-calcium':[
 ['Spasmerne tiltager.','Hvorfor kan lavt ioniseret calcium påvirke muskler og nerver?','Det kan øge neuromuskulær excitabilitet','Det afbryder altid al muskelkontraktion','Det påvirker kun knoglerne','Ioniseret calcium er vigtigt for elektrisk funktion; lavt niveau kan øge excitabiliteten.'],
 ['','Hvorfor er EKG relevant ved betydelig calciumforstyrrelse?','Calcium kan påvirke hjertets elektriske funktion og QT-interval','EKG måler ioniseret calcium direkte','Calcium påvirker aldrig hjertet','Elektrolytforstyrrelser kan påvirke repolarisation og rytme, men EKG erstatter ikke blodprøver.']],
'science-renal':[
 ['Patienten fortæller om mørk og sparsom urin.','Hvad kan dette afspejle ved væskemangel?','Øget vandretention og mindre urinproduktion','Nyren udskiller altid mere vand ved væskemangel','ADH ophører altid ved lavt volumen','Kroppen kan øge vandretention gennem blandt andet ADH ved væskemangel.'],
 ['','Hvorfor er vanddrivende medicin relevant i denne situation?','Det kan bidrage til væske- og elektrolyttab','Det sikrer altid tilstrækkeligt cirkulerende volumen','Det har aldrig betydning ved varme','Diuretika påvirker udskillelse af salt og vand; deres betydning afhænger af præparat og klinik.']],
'science-svt':[
 ['Patienten oplever tiltagende svimmelhed.','Hvordan kan en hurtig rytme påvirke hjertets fyldning?','Den kan forkorte den diastoliske fyldningstid','Den forlænger altid diastolen','Den ændrer kun atriernes størrelse','Hurtig rytme kan reducere fyldning og effektivt slagvolumen.'],
 ['','Hvorfor er det vigtigt at registrere rytme og symptomer før og efter eventuel behandling?','For at vurdere både elektrisk og klinisk respons','Fordi symptomlindring alene identificerer rytmens mekanisme','Fordi behandlingsrespons altid beviser AVNRT','Rytme og symptomer kan udvikle sig forskelligt; dokumentation understøtter videre vurdering.']],
'science-tdp':[
 ['Patienten fortæller om gentagne korte episoder med bevidsthedstab.','Hvorfor kan en kortvarig arytmi give synkope?','Minutvolumen og cerebral perfusion kan falde forbigående','Hjernen er uafhængig af blodflow','Alle korte arytmier øger cerebral perfusion','Ventrikulære arytmier kan forbigående kompromittere effektiv cirkulation.'],
 ['','Hvorfor er tidligere EKG og medicinliste relevante ved mistanke om forlænget QT?','De kan bidrage til at identificere ændringer og udløsende faktorer','De udelukker behov for elektrolytvurdering','De fastslår altid en medfødt årsag','QT-forlængelse kan være erhvervet eller medfødt; medicin, elektrolytter og tidligere EKG kan hjælpe.']]
};
function makeStep(c:PatientCase,row:Followup,index:number):Step {
 const [update,prompt,right,a,b,explanation]=row;
 const values=[right,a,b];
 const offset=Array.from(c.id+prompt).reduce((h,ch)=>((h*31+ch.charCodeAt(0))>>>0),0)%3;
 const options=values.map((text,i)=>({id:String(i),text}));
 return {id:'followup-'+(index+1),kind:'choice',prompt,update:update||undefined,options:[...options.slice(offset),...options.slice(0,offset)],correct:'0',explanation};
}
export function extendToSix(c:PatientCase):PatientCase{
 if(c.steps.length>=6)return c;
 const additions=bank[c.familyId??c.id];
 const needed=6-c.steps.length;
 if(!additions||additions.length<needed)throw new Error('Missing authored follow-ups for '+c.id);
 return {...c,steps:[...c.steps,...additions.slice(0,needed).map((row,i)=>makeStep(c,row,i))]};
}
