# FlashMedic flashcard review summary

Dato: 2026-07-13

## Samlet resultat

- Oprindeligt: 1.722 kanoniske kort
- Endeligt: 1.970 kanoniske kort
- Spørgsmål eller svar omskrevet: 812 eksisterende kort
- Fjernet eller sammenlagt: 6 kort
- Nye kort: 254
- Internt `reviewed`: 1.451
- Fortsat `draft`: 519
- Med forklaring eller rationale: 1.970
- Med mindst én reference: 1.948
- V2-kort med gyldigt læringsmål: 1.970

`reviewed` betyder kun, at repositoryets interne redaktionelle workflow er gennemført. Det indebærer ikke menneskelig klinisk verifikation, medicinsk godkendelse, guideline-endorsement eller formel kvalitetscertificering.

## Resultat pr. fag

| Fag | Før | Efter | Tekst revideret | Fjernet | Nye | Draft |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Akutte tilstande | 320 | 352 | 127 | 0 | 32 | 124 |
| Anatomi og fysiologi | 175 | 202 | 48 | 0 | 27 | 0 |
| EKG | 107 | 125 | 92 | 2 | 20 | 67 |
| Farmakologi | 100 | 125 | 98 | 2 | 27 | 23 |
| Kliniske parametre | 140 | 161 | 63 | 0 | 21 | 24 |
| Kørekort | 180 | 204 | 40 | 0 | 24 | 140 |
| Mikrobiologi | 100 | 125 | 48 | 0 | 25 | 13 |
| Psykologi | 120 | 144 | 45 | 0 | 24 | 0 |
| Sygdomslære | 340 | 364 | 151 | 2 | 26 | 51 |
| Traumatologi og ITLS | 140 | 168 | 100 | 0 | 28 | 77 |

Tekst revideret tæller eksisterende kort, hvor spørgsmål eller svar er ændret mod Git-baseline. Alle bevarede kort er desuden metadataopgraderet til V2.

## Emneresuméer

- Akutte tilstande: Fjernede genererede `:contentReference`-rester, rettede diagnostiske absolutter og udvidede hvert klinisk område med præhospital ræsonnering. Doser, graviditet, genoplivning, isolation og lokal visitation er afgrænset til manual review.
- Anatomi og fysiologi: Rettede lærebogsforenklinger om partialtryk, hormonregulation, nyrefysiologi, graviditet og muskelfysiologi. Nye kort forbinder mekanismer med kliniske fund.
- EKG: Fjernede to konceptdubletter, rettede STEMI/NSTEMI-, Brugada-, lungeemboli-, QT- og bredkomplekstakykardiudsagn og tilføjede systematisk tolkningsmetode. Billedfacit kræver visuel kliniker- og licenskontrol.
- Farmakologi: Pilotens mekanisme-, administrations-, bivirknings-, kinetik- og regnekort er bevaret. Doser, lokale lægemiddelvalg og tærskler står som draft.
- Kliniske parametre: Rettede overfortolkning af laktat, blodgas, CRP, qSOFA, NEWS2 og enkeltstående perfusionsfund. Nye kort træner trends, blandede syre-base-forstyrrelser og diagnostisk time-out.
- Kørekort: Rettede fejlhenvisninger og modsigelser og koblede materialet til kategori C-planen gældende fra 1. juli 2026. Eksakte lov-, prøve- og udrykningskursusregler kræver kørelærer-/instruktørkontrol.
- Mikrobiologi: Skelnede agens, kolonisation, infektion, sepsis og smittevej og opdaterede sproget til SSI's risikobaserede infektionshygiejne. Lokale værnemiddel- og rengøringsprocedurer står som draft.
- Psykologi: Markerede Freud, MacLean, Cullberg m.fl. som teorimodeller, fjernede stigmatiserende og deterministisk sprog og korrigerede obligatorisk debriefing. Nye kort dækker psykologisk førstehjælp, bias og teamlæring.
- Sygdomslære: Fjernede to dubletter og rettede blandt andet TIA, AMI/STEMI, MONA, sepsis, GCS/koma, nyresvigt og pædiatriske absolutter. Nye kort styrker differentialdiagnostik og mekanismeforståelse.
- Traumatologi og ITLS: Rettede TCA/HOTT, airway-prioritet, triader, golden-hour, MOI-tærskler, permissiv hypotension og thoraxdefinitioner. ITLS-version, invasive procedurer og regional triage kræver instruktørreview.

## Tværgående kvalitetsfund

- Hyppige sprogproblemer: direkte engelske oversættelser, engelske facitlabels, unaturlige substantivkæder, upræcise forkortelser og gentagne spørgsmålsskabeloner.
- Hyppige faktarisici: enkeltfund fremstillet som diagnostiske, faste tærskler uden kontekst, demografiske stereotyper, historiske huskeregler og absolutte ord som `altid`, `aldrig` og `skal`.
- Dubletmønstre: identiske definitioner både inden for et fag og på tværs af anatomi, sygdomslære, mikrobiologi og traume. Seks genuine dubletkort er fjernet; de sidste identiske spørgsmål er differentieret efter læringsmål.
- Svageste oprindelige områder: genoplivning og lokale behandlingsalgoritmer, EKG-billedfacit, udrykningskørsel, mekanismebaseret traumetriage, sepsis/blodgas og forældede teorimodeller i psykologi.
- Fortsat human review: doser og lægemiddelvalg, pædiatri og graviditet, hjertestop/TCA, lokale behandlings- og visitationsinstrukser, SSI-procedurer, 2026-kørekortregler samt EKG-billedernes facit og licens.

## Validering

Alle følgende kommandoer passerede 2026-07-13:

- `npm.cmd run validate:flashcards`
- `npm.cmd run validate:firestore-migration`
- `npm.cmd run validate:learning`
- `npm.cmd run validate:content-quality`
- `npm.cmd run test:content-quality`
- `npx.cmd tsc --noEmit`
- `npx.cmd tsc -p Backend\tsconfig.json --noEmit`
- `npm.cmd run lint`
- `git diff --check`

Slutstatus for indholdsvalidatoren: 1.970 kort, 0 fejl og 411 ikke-blokerende reviewadvarsler (`clinical.absolute` 235, `clinical.dose-threshold` 72, `clinical.protocol` 104). Ingen dublet-, placeholder-, sprogboilerplate- eller metadatafejl er tilbage.

Ingen Firestore-write/import/migration, legacy-synkronisering, UI-ændring eller runtimeændring er udført.
