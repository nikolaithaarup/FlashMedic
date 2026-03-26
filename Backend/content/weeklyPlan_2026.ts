// seed/weeklyPlan_2026.ts
// Single source of truth for weekly content (2026 weeks 6–52)
// You edit THIS file; the seed script publishes Firestore packs.

export type WeekKey = `2026-W${string}`;

export type WeeklyPlan = Record<
  WeekKey,
  {
    title: string; // e.g. "Brystsmerter"
    mcq: {
      timeLimitSec?: number; // default 30
      rounds: [string, string, string]; // 3 topic bullets
      questions?: unknown[]; // optional, you can add later
    };
    match: {
      rounds: string[]; // usually 2 topics
      pairsByRound?: Record<number, { left: string; right: string }[]>; // optional later
    };
    word: {
      topicTitle: string;
      easy: string[];
      medium: string[];
      hard: string[];
    };
  }
>;

export const weeklyPlan2026: WeeklyPlan = {
  "2026-W13": {
    title: "Brystsmerter",
    mcq: {
      rounds: [
        "Hjertets iltforsyning (koronararterier)",
        "Iskæmi vs infarkt – hvad sker i vævet",
        "Præhospital håndtering af STEMI-mistanke",
      ],
      questions: [
        {
          id: "w13_q1",
          category: "Hjertets iltforsyning (koronararterier)",
          text: "Hvilken arterie forsyner primært venstre ventrikels forvæg?",
          explanation:
            "LAD (Left Anterior Descending) forsyner den forreste del af venstre ventrikel.",
          options: [
            { id: "a", text: "RCA" },
            { id: "b", text: "LCX" },
            { id: "c", text: "LAD", isCorrect: true },
            { id: "d", text: "Pulmonalarterien" },
          ],
        },
        {
          id: "w13_q2",
          category: "Hjertets iltforsyning (koronararterier)",
          text: "Koronararterierne fyldes primært under:",
          explanation:
            "Under diastolen er aortatrykket højt og ventriklen afslappet.",
          options: [
            { id: "a", text: "Systole" },
            { id: "b", text: "Diastole", isCorrect: true },
            { id: "c", text: "QRS-kompleks" },
            { id: "d", text: "P-tak" },
          ],
        },
        {
          id: "w13_q3",
          category: "Hjertets iltforsyning (koronararterier)",
          text: "Hvad reducerer mest koronar perfusion?",
          explanation:
            "Hypotension reducerer perfusionstrykket i koronararterierne.",
          options: [
            { id: "a", text: "Hypertension" },
            { id: "b", text: "Hypotension", isCorrect: true },
            { id: "c", text: "Takykardi" },
            { id: "d", text: "Feber" },
          ],
        },

        {
          id: "w13_q4",
          category: "Iskæmi vs infarkt – hvad sker i vævet",
          text: "Hvad kendetegner myokardieiskæmi?",
          explanation: "Iltmangel uden permanent celledød.",
          options: [
            { id: "a", text: "Irreversibel nekrose" },
            { id: "b", text: "Reversibel iltmangel", isCorrect: true },
            { id: "c", text: "Arvævsdannelse" },
            { id: "d", text: "Inflammatorisk infektion" },
          ],
        },
        {
          id: "w13_q5",
          category: "Iskæmi vs infarkt – hvad sker i vævet",
          text: "Infarkt betyder:",
          explanation: "Permanent celledød pga. iltmangel.",
          options: [
            { id: "a", text: "Reversibel skade" },
            { id: "b", text: "Midlertidig iltmangel" },
            { id: "c", text: "Permanent nekrose", isCorrect: true },
            { id: "d", text: "Spasme i arterie" },
          ],
        },
        {
          id: "w13_q6",
          category: "Iskæmi vs infarkt – hvad sker i vævet",
          text: "Troponin stiger fordi:",
          explanation: "Troponin frigives ved myokardiecelle-nekrose.",
          options: [
            { id: "a", text: "Inflammation" },
            { id: "b", text: "Muskelnekrose", isCorrect: true },
            { id: "c", text: "Hypoglykæmi" },
            { id: "d", text: "Stressrespons" },
          ],
        },

        {
          id: "w13_q7",
          category: "Præhospital håndtering af STEMI-mistanke",
          text: "Hvad er første prioritet ved mistanke om STEMI?",
          explanation: "Tidlig EKG-diagnostik.",
          options: [
            { id: "a", text: "Smertestillende" },
            { id: "b", text: "EKG 12-afledning", isCorrect: true },
            { id: "c", text: "IV væske" },
            { id: "d", text: "Ilt uanset saturation" },
          ],
        },
        {
          id: "w13_q8",
          category: "Præhospital håndtering af STEMI-mistanke",
          text: "ASA gives primært for at:",
          explanation: "Hæmme trombocytaggregation.",
          options: [
            { id: "a", text: "Lindre smerte" },
            { id: "b", text: "Fortynde blod", isCorrect: true },
            { id: "c", text: "Sænke BT" },
            { id: "d", text: "Øge puls" },
          ],
        },
        {
          id: "w13_q9",
          category: "Præhospital håndtering af STEMI-mistanke",
          text: "Transportmål ved STEMI bør være:",
          explanation: "PCI-center for hurtig revaskularisering.",
          options: [
            { id: "a", text: "Nærmeste skadestue" },
            { id: "b", text: "PCI-center", isCorrect: true },
            { id: "c", text: "Praktiserende læge" },
            { id: "d", text: "Neurologisk afdeling" },
          ],
        },

        {
          id: "w13_q10",
          category: "Præhospital håndtering af STEMI-mistanke",
          text: "Typisk brystsmerte ved STEMI beskrives som:",
          explanation: "Trykkende, pressende smerte.",
          options: [
            { id: "a", text: "Stikkende" },
            { id: "b", text: "Trykkende", isCorrect: true },
            { id: "c", text: "Krampeagtig" },
            { id: "d", text: "Overfladisk" },
          ],
        },
        {
          id: "w13_q11",
          category: "Iskæmi vs infarkt – hvad sker i vævet",
          text: "Hvad sker først ved iskæmi?",
          explanation: "ATP-produktion falder.",
          options: [
            { id: "a", text: "ATP-fald", isCorrect: true },
            { id: "b", text: "Arvæv" },
            { id: "c", text: "Infektion" },
            { id: "d", text: "Fibrose" },
          ],
        },
        {
          id: "w13_q12",
          category: "Hjertets iltforsyning (koronararterier)",
          text: "RCA forsyner typisk:",
          explanation: "Inferiore del af hjertet.",
          options: [
            { id: "a", text: "Forvæg" },
            { id: "b", text: "Inferiorvæg", isCorrect: true },
            { id: "c", text: "Septum" },
            { id: "d", text: "Atrier" },
          ],
        },
        {
          id: "w13_q13",
          category: "Præhospital håndtering af STEMI-mistanke",
          text: "Nitroglycerin virker ved:",
          explanation: "Vasodilatation og preload-reduktion.",
          options: [
            { id: "a", text: "Vasokonstriktion" },
            { id: "b", text: "Vasodilatation", isCorrect: true },
            { id: "c", text: "Inotropi" },
            { id: "d", text: "Antikoagulation" },
          ],
        },
        {
          id: "w13_q14",
          category: "Iskæmi vs infarkt – hvad sker i vævet",
          text: "Hvor længe kan myokardiet tåle total iskæmi før nekrose?",
          explanation: "Ca. 20–30 min.",
          options: [
            { id: "a", text: "5 min" },
            { id: "b", text: "20-30 min", isCorrect: true },
            { id: "c", text: "2 timer" },
            { id: "d", text: "6 timer" },
          ],
        },
        {
          id: "w13_q15",
          category: "Hjertets iltforsyning (koronararterier)",
          text: "Takykardi forværrer iskæmi fordi:",
          explanation: "Kortere diastole = mindre koronar fyldning.",
          options: [
            { id: "a", text: "Øger preload" },
            { id: "b", text: "Forkorter diastole", isCorrect: true },
            { id: "c", text: "Øger slagvolumen" },
            { id: "d", text: "Øger afterload" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Symptom ↔ mulig årsag", "EKG/fund ↔ betydning"],
      pairsByRound: {
        1: [
          { left: "Trykkende smerte", right: "Koronar iskæmi" },
          { left: "Stikkende smerte", right: "Pleuritisk årsag" },
          { left: "Udstråling til venstre arm", right: "Hjerteiskæmi" },
          { left: "Smerte ved respiration", right: "Lungelidelse" },
          { left: "Brændende smerte", right: "Refluks" },
          { left: "Smerte ved bevægelse", right: "Muskuloskeletal årsag" },
        ],
        2: [
          { left: "ST-elevation", right: "Akut transmural iskæmi" },
          { left: "ST-depression", right: "Myokardieiskæmi" },
          { left: "T-tak inversion", right: "Repolarisationsforstyrrelse" },
          { left: "Q-tak", right: "Tidligere infarkt" },
          { left: "Høj troponin", right: "Myokardieskade" },
          { left: "Lavt blodtryk", right: "Nedsat cardiac output" },
        ],
      },
    },
    word: {
      topicTitle: "Iskæmisk hjertesygdom",
      easy: ["Puls"],
      medium: ["Iskæmi"],
      hard: ["Myokardienekrose"],
    },
  },

  "2026-W14": {
    title: "Bevidsthedspåvirket patient",
    mcq: {
      rounds: [
        "GCS-opbygning",
        "Årsager til nedsat bevidsthed (MIDASHE)",
        "ABCDE ved ukendt bevidsthedstab",
      ],
      questions: [
        // --- Round 1: GCS-opbygning (5) ---
        {
          id: "w14_q1",
          category: "GCS-opbygning",
          text: "Hvilke tre komponenter indgår i GCS?",
          explanation: "GCS består af Eye (E), Verbal (V) og Motor (M).",
          options: [
            { id: "a", text: "Puls, BT, RF" },
            { id: "b", text: "E, V, M", isCorrect: true },
            { id: "c", text: "Pupil, smerte, reflekser" },
            { id: "d", text: "EKG, SpO2, temperatur" },
          ],
        },
        {
          id: "w14_q2",
          category: "GCS-opbygning",
          text: "Hvad er maksimal GCS-score?",
          explanation: "Max = 15 (E4 + V5 + M6).",
          options: [
            { id: "a", text: "12" },
            { id: "b", text: "15", isCorrect: true },
            { id: "c", text: "18" },
            { id: "d", text: "20" },
          ],
        },
        {
          id: "w14_q3",
          category: "GCS-opbygning",
          text: "Hvad er den højeste motoriske respons i GCS?",
          explanation: "Motor 6 = adlyder kommandoer.",
          options: [
            { id: "a", text: "Abnorm ekstension" },
            { id: "b", text: "Lokaliserer smerte" },
            { id: "c", text: "Adlyder kommandoer", isCorrect: true },
            { id: "d", text: "Ingen respons" },
          ],
        },
        {
          id: "w14_q4",
          category: "GCS-opbygning",
          text: "Hvad betyder V1 i GCS?",
          explanation: "V1 = ingen verbal respons.",
          options: [
            { id: "a", text: "Forvirret tale" },
            { id: "b", text: "Uforståelige lyde" },
            { id: "c", text: "Ingen verbal respons", isCorrect: true },
            { id: "d", text: "Orienteret" },
          ],
        },
        {
          id: "w14_q5",
          category: "GCS-opbygning",
          text: "Hvornår bruges smerte-stimulus typisk i GCS-vurdering?",
          explanation:
            "Når patienten ikke reagerer på tiltale, vurderes respons på smerte.",
          options: [
            { id: "a", text: "Altid før tiltale" },
            { id: "b", text: "Kun ved GCS 15" },
            {
              id: "c",
              text: "Når patienten ikke reagerer på tiltale",
              isCorrect: true,
            },
            { id: "d", text: "Kun ved børn" },
          ],
        },

        // --- Round 2: MIDASHE (5) ---
        {
          id: "w14_q6",
          category: "Årsager til nedsat bevidsthed (MIDASHE)",
          text: "Hvad står 'H' typisk for i MIDASHE?",
          explanation:
            "H = Hypoglykæmi er en hyppig og reversibel årsag til nedsat bevidsthed.",
          options: [
            { id: "a", text: "Hypertermi" },
            { id: "b", text: "Hypoglykæmi", isCorrect: true },
            { id: "c", text: "Hypotension" },
            { id: "d", text: "Hypoksi" },
          ],
        },
        {
          id: "w14_q7",
          category: "Årsager til nedsat bevidsthed (MIDASHE)",
          text: "Hvilken MIDASHE-årsag er hurtigst at udelukke præhospitalt?",
          explanation:
            "Hypoglykæmi kan måles hurtigt med blodsukker og behandles straks.",
          options: [
            { id: "a", text: "Apopleksi" },
            { id: "b", text: "Hypoglykæmi", isCorrect: true },
            { id: "c", text: "Infektion" },
            { id: "d", text: "Epilepsi" },
          ],
        },
        {
          id: "w14_q8",
          category: "Årsager til nedsat bevidsthed (MIDASHE)",
          text: "Hvilket fund passer bedst med 'D' i MIDASHE?",
          explanation:
            "D = Drugs. Opioidpåvirkning giver klassisk miose og respirationsdepression.",
          options: [
            { id: "a", text: "Store pupiller og hyperventilation" },
            { id: "b", text: "Miose og lav RF", isCorrect: true },
            { id: "c", text: "Høj feber og nakkestivhed" },
            { id: "d", text: "Pludselig hemiparese" },
          ],
        },
        {
          id: "w14_q9",
          category: "Årsager til nedsat bevidsthed (MIDASHE)",
          text: "Hvilket af følgende hører under 'A' i MIDASHE?",
          explanation:
            "A = Alkohol/Acidose. Intoksikation med alkohol er en hyppig årsag.",
          options: [
            { id: "a", text: "Alkoholpåvirkning", isCorrect: true },
            { id: "b", text: "Anæmi" },
            { id: "c", text: "Artritis" },
            { id: "d", text: "Aterosklerose" },
          ],
        },
        {
          id: "w14_q10",
          category: "Årsager til nedsat bevidsthed (MIDASHE)",
          text: "Hvilket scenario peger mest på 'S' i MIDASHE?",
          explanation:
            "S = Stroke. Fokale neurologiske udfald er klassisk for apopleksi.",
          options: [
            { id: "a", text: "Symmetrisk sløvhed efter alkohol" },
            {
              id: "b",
              text: "Pludselig facialisparese og armsvækkelse",
              isCorrect: true,
            },
            { id: "c", text: "Sved og rysten med lavt blodsukker" },
            { id: "d", text: "Miose og lav RF" },
          ],
        },

        // --- Round 3: ABCDE ved ukendt bevidsthedstab (5) ---
        {
          id: "w14_q11",
          category: "ABCDE ved ukendt bevidsthedstab",
          text: "Hvad er første handling i A (Airway) hos bevidsthedspåvirket patient?",
          explanation:
            "Sikr fri luftvej: simple manøvrer, sug, OPA/NPA efter behov.",
          options: [
            { id: "a", text: "Måle temperatur" },
            { id: "b", text: "Sikre fri luftvej", isCorrect: true },
            { id: "c", text: "Give glukose uden måling" },
            { id: "d", text: "12-aflednings EKG" },
          ],
        },
        {
          id: "w14_q12",
          category: "ABCDE ved ukendt bevidsthedstab",
          text: "Hvilket fund i B (Breathing) kræver akut handling?",
          explanation: "Respirationsdepression/hypoksi skal behandles hurtigt.",
          options: [
            { id: "a", text: "SpO2 98% på luft" },
            { id: "b", text: "Lav RF og SpO2 85%", isCorrect: true },
            { id: "c", text: "Let takypnø ved angst" },
            { id: "d", text: "Normale lungelyde" },
          ],
        },
        {
          id: "w14_q13",
          category: "ABCDE ved ukendt bevidsthedstab",
          text: "Hvad er mest relevant i C (Circulation) ved ukendt bevidsthedstab?",
          explanation:
            "BT, puls, hud, kapillærrespons og tegn på shock/arytmi.",
          options: [
            { id: "a", text: "Kun pupiller" },
            { id: "b", text: "BT og puls", isCorrect: true },
            { id: "c", text: "Kun smertevurdering" },
            { id: "d", text: "Kun temperatur" },
          ],
        },
        {
          id: "w14_q14",
          category: "ABCDE ved ukendt bevidsthedstab",
          text: "Hvilken hurtig test er central i D (Disability) præhospitalt?",
          explanation:
            "Glukosemåling + neurologisk vurdering (GCS/FAST) er centrale.",
          options: [
            { id: "a", text: "Kreatinin" },
            { id: "b", text: "Blodsukker", isCorrect: true },
            { id: "c", text: "Troponin" },
            { id: "d", text: "CRP" },
          ],
        },
        {
          id: "w14_q15",
          category: "ABCDE ved ukendt bevidsthedstab",
          text: "Hvad betyder E (Exposure) i ABCDE i denne kontekst?",
          explanation:
            "Se efter traumer, udslæt, stikmærker, febertegn og omgivelser.",
          options: [
            { id: "a", text: "Kun at give ilt" },
            {
              id: "b",
              text: "Fuld gennemgang for skjulte årsager",
              isCorrect: true,
            },
            { id: "c", text: "Kun at give væske" },
            { id: "d", text: "Kun at transportere hurtigt" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Pupiller/fund ↔ mulig årsag", "Bevidsthedsniveau ↔ betydning"],
      pairsByRound: {
        1: [
          { left: "Små pupiller (miose)", right: "Opioidpåvirkning" },
          {
            left: "Store pupiller + agitation",
            right: "Stimulantia/intoksikation",
          },
          { left: "Uens pupiller", right: "Intrakraniel patologi" },
          { left: "Nystagmus", right: "Alkohol/stoffer" },
          { left: "Miose + lav RF", right: "Respirationsdepression" },
          {
            left: "Pupiller reagerer ikke på lys",
            right: "Svær CNS-påvirkning",
          },
        ],
        2: [
          { left: "Vågen og orienteret", right: "Normal cerebral funktion" },
          { left: "Reagerer på tiltale", right: "Let bevidsthedspåvirkning" },
          { left: "Reagerer på smerte", right: "Svær påvirkning" },
          { left: "Ingen respons", right: "Dybt coma" },
          { left: "Postiktal konfusion", right: "Efter krampeanfald" },
          { left: "Pludselig fokalt udfald", right: "Mistanke apopleksi" },
        ],
      },
    },
    word: {
      topicTitle: "Cerebral funktion",
      easy: ["Hjerne"],
      medium: ["Bevidsthed"],
      hard: ["Intrakranielt"],
    },
  },

  "2026-W15": {
    title: "Dyspnø",
    mcq: {
      rounds: [
        "Normal respiration",
        "V/Q mismatch",
        "Præhospital O2 og ventilation",
      ],
      questions: [
        // --- Round 1: Normal respiration (5) ---
        {
          id: "w15_q1",
          category: "Normal respiration",
          text: "Hvad er primærfunktionen af alveolerne?",
          explanation:
            "Alveoler er stedet for gasudveksling mellem luft og blod.",
          options: [
            { id: "a", text: "Pumpe blod rundt" },
            { id: "b", text: "Gasudveksling", isCorrect: true },
            { id: "c", text: "Filtrere affaldsstoffer" },
            { id: "d", text: "Producere surfaktant i bronkierne" },
          ],
        },
        {
          id: "w15_q2",
          category: "Normal respiration",
          text: "Hvilken muskel er vigtigst for normal inspiration i hvile?",
          explanation:
            "Diafragma står for størstedelen af inspirationsarbejdet i hvile.",
          options: [
            { id: "a", text: "Trapezius" },
            { id: "b", text: "Diafragma", isCorrect: true },
            { id: "c", text: "Rectus abdominis" },
            { id: "d", text: "Biceps" },
          ],
        },
        {
          id: "w15_q3",
          category: "Normal respiration",
          text: "Hvad driver CO2-udskillelse fra blod til alveoler?",
          explanation: "Diffusion ned ad en partialtryksgradient.",
          options: [
            { id: "a", text: "Aktiv transport" },
            { id: "b", text: "Diffusion via partialtryk", isCorrect: true },
            { id: "c", text: "Osmose" },
            { id: "d", text: "Tryk fra venstre ventrikel" },
          ],
        },
        {
          id: "w15_q4",
          category: "Normal respiration",
          text: "Hvad er tidalvolumen (VT) typisk hos en voksen i hvile?",
          explanation: "Ca. 500 mL (omtrent 6–8 mL/kg).",
          options: [
            { id: "a", text: "50 mL" },
            { id: "b", text: "500 mL", isCorrect: true },
            { id: "c", text: "2 liter" },
            { id: "d", text: "5 liter" },
          ],
        },
        {
          id: "w15_q5",
          category: "Normal respiration",
          text: "Hvilket udsagn om SpO2 er mest korrekt?",
          explanation:
            "SpO2 afspejler hæmoglobinmætning, ikke direkte ventilation.",
          options: [
            { id: "a", text: "SpO2 måler CO2 direkte" },
            { id: "b", text: "SpO2 måler hæmoglobinmætning", isCorrect: true },
            { id: "c", text: "SpO2 er uafhængig af iltning" },
            { id: "d", text: "SpO2 er det samme som PaO2" },
          ],
        },

        // --- Round 2: V/Q mismatch (5) ---
        {
          id: "w15_q6",
          category: "V/Q mismatch",
          text: "Hvad betyder V/Q mismatch?",
          explanation:
            "Ubalance mellem ventilation (V) og perfusion (Q) i lungerne.",
          options: [
            { id: "a", text: "Ubalance mellem puls og BT" },
            {
              id: "b",
              text: "Ubalance mellem ventilation og perfusion",
              isCorrect: true,
            },
            { id: "c", text: "Ubalance mellem Na og K" },
            { id: "d", text: "Ubalance mellem inspiration og eksspiration" },
          ],
        },
        {
          id: "w15_q7",
          category: "V/Q mismatch",
          text: "Lungeemboli giver typisk hvilket V/Q-mønster?",
          explanation: "Perfusion falder → høj V/Q (dead space).",
          options: [
            { id: "a", text: "Lav V/Q (shunt)" },
            { id: "b", text: "Høj V/Q (dead space)", isCorrect: true },
            { id: "c", text: "Normal V/Q" },
            { id: "d", text: "Ingen påvirkning" },
          ],
        },
        {
          id: "w15_q8",
          category: "V/Q mismatch",
          text: "Pneumoni giver oftest:",
          explanation:
            "Ventilation falder i afficerede områder → lav V/Q (shunt-lignende).",
          options: [
            { id: "a", text: "Høj V/Q" },
            { id: "b", text: "Lav V/Q", isCorrect: true },
            { id: "c", text: "Kun hyperventilation" },
            { id: "d", text: "Kun hypotension" },
          ],
        },
        {
          id: "w15_q9",
          category: "V/Q mismatch",
          text: "Hvad er en shunt i respirationsfysiologi?",
          explanation:
            "Blod passerer lunger uden at blive iltet (Q uden effektiv V).",
          options: [
            { id: "a", text: "Ventilation uden perfusion" },
            { id: "b", text: "Perfusion uden ventilation", isCorrect: true },
            { id: "c", text: "Øget tidalvolumen" },
            { id: "d", text: "Øget CO2-udskillelse" },
          ],
        },
        {
          id: "w15_q10",
          category: "V/Q mismatch",
          text: "Hvilket fund passer bedst med V/Q mismatch?",
          explanation:
            "Hypoksi er typisk, og kan kræve ilt/ventilation afhængigt af årsag.",
          options: [
            { id: "a", text: "Kun hypertermi" },
            { id: "b", text: "Hypoksi", isCorrect: true },
            { id: "c", text: "Kun bradykardi" },
            { id: "d", text: "Kun hyperglykæmi" },
          ],
        },

        // --- Round 3: Præhospital O2 og ventilation (5) ---
        {
          id: "w15_q11",
          category: "Præhospital O2 og ventilation",
          text: "Hvad er den største risiko ved at give høj-flow O2 ukritisk til KOL-patient?",
          explanation:
            "Kan forværre hyperkapni hos nogle patienter (V/Q + hypoksisk drive).",
          options: [
            { id: "a", text: "Hypoglykæmi" },
            { id: "b", text: "Hyperkapni/CO2-retention", isCorrect: true },
            { id: "c", text: "Hyponatriæmi" },
            { id: "d", text: "Nyresvigt" },
          ],
        },
        {
          id: "w15_q12",
          category: "Præhospital O2 og ventilation",
          text: "Hvornår er BVM-ventilation mest indiceret?",
          explanation:
            "Ved utilstrækkelig ventilation (lav RF, dårlig tidalvolumen, apnø).",
          options: [
            { id: "a", text: "SpO2 98% og normal RF" },
            {
              id: "b",
              text: "Apnø eller utilstrækkelig ventilation",
              isCorrect: true,
            },
            { id: "c", text: "Feber uden dyspnø" },
            { id: "d", text: "Hovedpine" },
          ],
        },
        {
          id: "w15_q13",
          category: "Præhospital O2 og ventilation",
          text: "EtCO2 er især nyttigt præhospitalt fordi det:",
          explanation:
            "Giver realtime information om ventilation og kan indikere hypoventilation/hyperventilation.",
          options: [
            { id: "a", text: "Måler PaO2 direkte" },
            { id: "b", text: "Afslører ventilationsstatus", isCorrect: true },
            { id: "c", text: "Er bedre end EKG til STEMI" },
            { id: "d", text: "Er uafhængig af perfusion" },
          ],
        },
        {
          id: "w15_q14",
          category: "Præhospital O2 og ventilation",
          text: "Hvilket tegn peger mest på respirationssvigt fremfor ren angst?",
          explanation:
            "Cyanose/udtalt hypoksi, udtrætning, faldende bevidsthed.",
          options: [
            { id: "a", text: "Prikken i fingre med normal SpO2" },
            {
              id: "b",
              text: "Faldende bevidsthed og lav SpO2",
              isCorrect: true,
            },
            { id: "c", text: "Tør mund" },
            { id: "d", text: "Let svimmelhed" },
          ],
        },
        {
          id: "w15_q15",
          category: "Præhospital O2 og ventilation",
          text: "Hvad er et primært mål med iltbehandling præhospitalt?",
          explanation: "Behandle hypoksi og støtte iltlevering til væv.",
          options: [
            { id: "a", text: "Sænke puls" },
            { id: "b", text: "Korrigere hypoksi", isCorrect: true },
            { id: "c", text: "Fjerne smerte" },
            { id: "d", text: "Sænke temperatur" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Lungelyd ↔ patologi", "Respirationsfund ↔ betydning"],
      pairsByRound: {
        1: [
          { left: "Pibende eksspiration", right: "Bronkospasme" },
          { left: "Krepitationer", right: "Væske i lunger/alveoler" },
          {
            left: "Nedsatte respirationslyde",
            right: "Pneumothorax/obstruktion",
          },
          { left: "Grove ronchi", right: "Sekret i luftveje" },
          { left: "Stridor", right: "Øvre luftvejsobstruktion" },
          { left: "Forlænget eksspiration", right: "Obstruktiv lungesygdom" },
        ],
        2: [
          { left: "Høj RF", right: "Respiratorisk kompensation" },
          { left: "Lav RF", right: "Respirationsdepression" },
          { left: "Stigende EtCO2", right: "Hypoventilation" },
          { left: "Faldende EtCO2", right: "Hyperventilation/lav perfusion" },
          {
            left: "Brug af accessoriske muskler",
            right: "Øget respirationsarbejde",
          },
          { left: "Cyanose", right: "Alvorlig hypoksi" },
        ],
      },
    },
    word: {
      topicTitle: "Respiration",
      easy: ["Ilt"],
      medium: ["Dyspnø"],
      hard: ["Ventilation"],
    },
  },

  "2026-W16": {
    title: "Shock",
    mcq: {
      rounds: [
        "Definition på shock",
        "Kompensationsmekanismer",
        "Forskelle på shocktyper",
      ],
      questions: [
        // --- Round 1: Definition på shock (5) ---
        {
          id: "w16_q1",
          category: "Definition på shock",
          text: "Hvad er den bedste overordnede definition på shock?",
          explanation:
            "Shock er utilstrækkelig vævsperfusion/iltlevering i forhold til behov, som kan føre til organsvigt.",
          options: [
            { id: "a", text: "Forhøjet blodtryk med hovedpine" },
            {
              id: "b",
              text: "Utilstrækkelig vævsperfusion/iltlevering",
              isCorrect: true,
            },
            { id: "c", text: "Lav temperatur og kulderystelser" },
            { id: "d", text: "Kun lav puls" },
          ],
        },
        {
          id: "w16_q2",
          category: "Definition på shock",
          text: "Hvad er den mest direkte fysiologiske konsekvens af shock på celleniveau?",
          explanation:
            "Mindre iltlevering → mindre aerob ATP → anaerob metabolisme og laktatstigning.",
          options: [
            { id: "a", text: "Øget aerob ATP-produktion" },
            {
              id: "b",
              text: "Nedsat aerob ATP og øget anaerob metabolisme",
              isCorrect: true,
            },
            { id: "c", text: "Øget insulinsekretion" },
            { id: "d", text: "Øget hæmoglobinproduktion" },
          ],
        },
        {
          id: "w16_q3",
          category: "Definition på shock",
          text: "Hvorfor kan en patient være i shock med normalt blodtryk tidligt i forløbet?",
          explanation:
            "Kompensation (sympatikus/vasokonstriktion) kan opretholde BT trods dårlig perfusion.",
          options: [
            { id: "a", text: "Fordi shock altid giver hypertension" },
            {
              id: "b",
              text: "Kompensation kan skjule hypotension",
              isCorrect: true,
            },
            { id: "c", text: "Fordi pulsen falder tidligt" },
            { id: "d", text: "Fordi laktat altid er normalt" },
          ],
        },
        {
          id: "w16_q4",
          category: "Definition på shock",
          text: "Hvilket tegn er ofte et tidligt klinisk tegn på shock?",
          explanation:
            "Takykardi er en tidlig kompensationsmekanisme for at opretholde cardiac output.",
          options: [
            { id: "a", text: "Takykardi", isCorrect: true },
            { id: "b", text: "Bradykardi" },
            { id: "c", text: "Blå mærker" },
            { id: "d", text: "Høj feber" },
          ],
        },
        {
          id: "w16_q5",
          category: "Definition på shock",
          text: "Hvad er relationen mellem cardiac output (CO), perfusion og shock?",
          explanation:
            "Lav CO og/eller lav SVR kan give utilstrækkelig perfusion → shock.",
          options: [
            { id: "a", text: "CO er altid irrelevant for shock" },
            {
              id: "b",
              text: "Shock kan skyldes lav CO og/eller lav SVR",
              isCorrect: true,
            },
            { id: "c", text: "Shock kræver altid lav puls" },
            { id: "d", text: "Shock kræver altid høj SVR" },
          ],
        },

        // --- Round 2: Kompensationsmekanismer (5) ---
        {
          id: "w16_q6",
          category: "Kompensationsmekanismer",
          text: "Hvilket hormon-system aktiveres for at øge væskeretention ved shock?",
          explanation:
            "RAAS (renin-angiotensin-aldosteron) øger Na+/vand-retention og vasokonstriktion.",
          options: [
            { id: "a", text: "Insulin" },
            { id: "b", text: "RAAS", isCorrect: true },
            { id: "c", text: "Melatonin" },
            { id: "d", text: "TSH" },
          ],
        },
        {
          id: "w16_q7",
          category: "Kompensationsmekanismer",
          text: "Sympatikus-aktivering i shock medfører typisk:",
          explanation:
            "Takykardi, øget kontraktilitet og perifer vasokonstriktion (kold/klam hud).",
          options: [
            { id: "a", text: "Bradykardi og vasodilatation" },
            { id: "b", text: "Takykardi og vasokonstriktion", isCorrect: true },
            { id: "c", text: "Kun feber" },
            { id: "d", text: "Kun øget diurese" },
          ],
        },
        {
          id: "w16_q8",
          category: "Kompensationsmekanismer",
          text: "Hvorfor bliver huden ofte kold og klam ved hypovolæmisk shock?",
          explanation:
            "Perifer vasokonstriktion prioriterer blod til vitale organer + sved (sympatikus).",
          options: [
            { id: "a", text: "På grund af høj parasympatikus" },
            {
              id: "b",
              text: "Perifer vasokonstriktion + sympatikus",
              isCorrect: true,
            },
            { id: "c", text: "På grund af leverpåvirkning" },
            { id: "d", text: "På grund af lavt blodsukker" },
          ],
        },
        {
          id: "w16_q9",
          category: "Kompensationsmekanismer",
          text: "Hvad sker der typisk med kapillærrespons ved shock?",
          explanation:
            "Perifer vasokonstriktion gør kapillærrespons forlænget.",
          options: [
            { id: "a", text: "Den bliver hurtigere" },
            { id: "b", text: "Den bliver forlænget", isCorrect: true },
            { id: "c", text: "Den forsvinder altid helt" },
            { id: "d", text: "Den er uændret" },
          ],
        },
        {
          id: "w16_q10",
          category: "Kompensationsmekanismer",
          text: "Hvad er en vigtig metabolisk markør for vævshypoperfusion?",
          explanation:
            "Laktat stiger ved anaerob metabolisme sekundært til hypoperfusion.",
          options: [
            { id: "a", text: "Laktat", isCorrect: true },
            { id: "b", text: "Kalium" },
            { id: "c", text: "Bilirubin" },
            { id: "d", text: "Kolesterol" },
          ],
        },

        // --- Round 3: Forskelle på shocktyper (5) ---
        {
          id: "w16_q11",
          category: "Forskelle på shocktyper",
          text: "Hypovolæmisk shock skyldes primært:",
          explanation:
            "Tab af intravaskulær volumen (blødning/væsketab) → lav preload → lav CO.",
          options: [
            { id: "a", text: "Pumpesvigt" },
            { id: "b", text: "Tab af volumen", isCorrect: true },
            { id: "c", text: "Vasodilatation pga. infektion" },
            { id: "d", text: "Allergisk histaminfrigivelse" },
          ],
        },
        {
          id: "w16_q12",
          category: "Forskelle på shocktyper",
          text: "Kardiogent shock skyldes primært:",
          explanation:
            "Nedsat pumpefunktion (AMI, svær arytmi) → lav CO trods normal/høj volumen.",
          options: [
            { id: "a", text: "Tab af volumen" },
            { id: "b", text: "Nedsat pumpefunktion", isCorrect: true },
            { id: "c", text: "Perifer vasodilatation" },
            { id: "d", text: "Hyperventilation" },
          ],
        },
        {
          id: "w16_q13",
          category: "Forskelle på shocktyper",
          text: "Distributivt shock (fx sepsis) er typisk kendetegnet ved:",
          explanation:
            "Perifer vasodilatation og maldistribution → lav SVR; hud kan være varm tidligt.",
          options: [
            { id: "a", text: "Høj SVR og kold hud tidligt" },
            {
              id: "b",
              text: "Lav SVR og ofte varm hud tidligt",
              isCorrect: true,
            },
            { id: "c", text: "Altid massiv blødning" },
            { id: "d", text: "Altid bradykardi" },
          ],
        },
        {
          id: "w16_q14",
          category: "Forskelle på shocktyper",
          text: "Obstruktivt shock kan skyldes:",
          explanation:
            "Mekanisk hæmning af fyldning/flow (tension pneumothorax, tamponade, massiv PE).",
          options: [
            { id: "a", text: "Dehydrering" },
            { id: "b", text: "Tension pneumothorax", isCorrect: true },
            { id: "c", text: "Mild angst" },
            { id: "d", text: "Hypoglykæmi" },
          ],
        },
        {
          id: "w16_q15",
          category: "Forskelle på shocktyper",
          text: "Hvilket klinisk fund passer bedst med anafylaktisk shock?",
          explanation:
            "Vasodilatation + øget kapillærlækage + evt. bronkospasme og urticaria.",
          options: [
            { id: "a", text: "Kold, klam hud uden udslæt" },
            {
              id: "b",
              text: "Urticaria og luftvejsproblemer",
              isCorrect: true,
            },
            { id: "c", text: "Bradykardi og hypertension" },
            { id: "d", text: "Isoleret hovedpine" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Shocktype ↔ hovedårsag", "Fund ↔ fysiologi"],
      pairsByRound: {
        1: [
          { left: "Hypovolæmisk shock", right: "Blødning/væsketab" },
          { left: "Kardiogent shock", right: "Pumpesvigt" },
          { left: "Distributivt shock", right: "Vasodilatation" },
          {
            left: "Obstruktivt shock",
            right: "Mekanisk hindring for blodflow",
          },
          { left: "Anafylaksi", right: "Histaminfrigivelse" },
          { left: "Sepsis", right: "Inflammation med lav SVR" },
        ],
        2: [
          { left: "Takykardi", right: "Kompensation for lav perfusion" },
          {
            left: "Forlænget kapillærrespons",
            right: "Perifer vasokonstriktion",
          },
          { left: "Kold og klam hud", right: "Sympatikusaktivering" },
          { left: "Varm hud tidligt", right: "Distributivt shock" },
          { left: "Stigende laktat", right: "Anaerob metabolisme" },
          { left: "Lav urinproduktion", right: "Nedsat nyreperfusion" },
        ],
      },
    },
    word: {
      topicTitle: "Perfusion",
      easy: ["BT"],
      medium: ["Perfusion"],
      hard: ["Vasokonstriktion"],
    },
  },

  "2026-W17": {
    title: "EKG Rytmer",
    mcq: {
      rounds: ["Sinusrytme", "Takykardi vs bradykardi", "Hvilke rytmer stødes"],
      questions: [
        // --- Round 1: Sinusrytme (5) ---
        {
          id: "w17_q1",
          category: "Sinusrytme",
          text: "Hvad karakteriserer en normal sinusrytme?",
          explanation:
            "P-tak før hvert QRS, regelmæssig rytme og frekvens 60–100/min.",
          options: [
            { id: "a", text: "Uregelmæssig rytme uden P-takker" },
            {
              id: "b",
              text: "P-tak før hvert QRS og regelmæssig rytme",
              isCorrect: true,
            },
            { id: "c", text: "Kun brede QRS-komplekser" },
            { id: "d", text: "Ingen elektrisk aktivitet" },
          ],
        },
        {
          id: "w17_q2",
          category: "Sinusrytme",
          text: "Hvor opstår sinusrytmen?",
          explanation: "Sinusknuden (SA node) er hjertets primære pacemaker.",
          options: [
            { id: "a", text: "AV-knuden" },
            { id: "b", text: "Purkinje-fibre" },
            { id: "c", text: "Sinusknuden", isCorrect: true },
            { id: "d", text: "His’ bundt" },
          ],
        },
        {
          id: "w17_q3",
          category: "Sinusrytme",
          text: "Hvad er normal hvilepuls hos voksne?",
          explanation: "Typisk 60–100 slag/min.",
          options: [
            { id: "a", text: "30–50/min" },
            { id: "b", text: "60–100/min", isCorrect: true },
            { id: "c", text: "100–140/min" },
            { id: "d", text: ">150/min" },
          ],
        },
        {
          id: "w17_q4",
          category: "Sinusrytme",
          text: "Hvad kaldes en langsom sinusrytme?",
          explanation: "Sinusbradykardi = <60/min.",
          options: [
            { id: "a", text: "Sinustakykardi" },
            { id: "b", text: "Sinusbradykardi", isCorrect: true },
            { id: "c", text: "VF" },
            { id: "d", text: "VT" },
          ],
        },
        {
          id: "w17_q5",
          category: "Sinusrytme",
          text: "Hvad kaldes en hurtig sinusrytme?",
          explanation: "Sinustakykardi = >100/min.",
          options: [
            { id: "a", text: "Sinusbradykardi" },
            { id: "b", text: "Sinustakykardi", isCorrect: true },
            { id: "c", text: "Asystoli" },
            { id: "d", text: "AV-blok" },
          ],
        },

        // --- Round 2: Takykardi vs bradykardi (5) ---
        {
          id: "w17_q6",
          category: "Takykardi vs bradykardi",
          text: "Hvad er den primære fysiologiske konsekvens af takykardi?",
          explanation:
            "Kortere diastole → dårligere fyldning → kan nedsætte CO.",
          options: [
            { id: "a", text: "Øget fyldningstid" },
            {
              id: "b",
              text: "Nedsat fyldningstid",
              isCorrect: true,
            },
            { id: "c", text: "Øget blodtryk altid" },
            { id: "d", text: "Øget iltning" },
          ],
        },
        {
          id: "w17_q7",
          category: "Takykardi vs bradykardi",
          text: "Hvad er risikoen ved udtalt bradykardi?",
          explanation:
            "Lav puls → lav cardiac output → utilstrækkelig perfusion.",
          options: [
            { id: "a", text: "Hypertension" },
            {
              id: "b",
              text: "Lav cardiac output",
              isCorrect: true,
            },
            { id: "c", text: "Hyperglykæmi" },
            { id: "d", text: "Feber" },
          ],
        },
        {
          id: "w17_q8",
          category: "Takykardi vs bradykardi",
          text: "Hvilket symptom ses ofte ved ustabil takykardi?",
          explanation: "Hypoperfusion → svimmelhed, hypotension.",
          options: [
            { id: "a", text: "Øget appetit" },
            {
              id: "b",
              text: "Svimmelhed og hypotension",
              isCorrect: true,
            },
            { id: "c", text: "Kløe" },
            { id: "d", text: "Feber" },
          ],
        },
        {
          id: "w17_q9",
          category: "Takykardi vs bradykardi",
          text: "Hvad afgør primært om en rytme er behandlingskrævende?",
          explanation:
            "Patientens kliniske tilstand (stabil vs ustabil) er afgørende.",
          options: [
            { id: "a", text: "Kun EKG-udseende" },
            {
              id: "b",
              text: "Patientens kliniske tilstand",
              isCorrect: true,
            },
            { id: "c", text: "Alder" },
            { id: "d", text: "Køn" },
          ],
        },
        {
          id: "w17_q10",
          category: "Takykardi vs bradykardi",
          text: "Hvad er en klassisk behandling ved symptomatisk bradykardi?",
          explanation: "Atropin øger puls via parasympatikus-hæmning.",
          options: [
            { id: "a", text: "Adrenalin bolus" },
            { id: "b", text: "Atropin", isCorrect: true },
            { id: "c", text: "Insulin" },
            { id: "d", text: "Naloxon" },
          ],
        },

        // --- Round 3: Hvilke rytmer stødes (5) ---
        {
          id: "w17_q11",
          category: "Hvilke rytmer stødes",
          text: "Hvilken rytme er stødbar?",
          explanation: "VF er en klassisk stødbar rytme.",
          options: [
            { id: "a", text: "Asystoli" },
            { id: "b", text: "VF", isCorrect: true },
            { id: "c", text: "PEA" },
            { id: "d", text: "Sinusrytme" },
          ],
        },
        {
          id: "w17_q12",
          category: "Hvilke rytmer stødes",
          text: "Pulsløs VT behandles med:",
          explanation: "Pulsløs VT er stødbar → defibrillering.",
          options: [
            { id: "a", text: "Ilt" },
            { id: "b", text: "Defibrillering", isCorrect: true },
            { id: "c", text: "Væske" },
            { id: "d", text: "Glukose" },
          ],
        },
        {
          id: "w17_q13",
          category: "Hvilke rytmer stødes",
          text: "Hvilken rytme er IKKE stødbar?",
          explanation: "Asystoli og PEA er ikke-stødbar.",
          options: [
            { id: "a", text: "VF" },
            { id: "b", text: "VT" },
            { id: "c", text: "Asystoli", isCorrect: true },
            { id: "d", text: "SVT" },
          ],
        },
        {
          id: "w17_q14",
          category: "Hvilke rytmer stødes",
          text: "Hvad er første behandling ved VF?",
          explanation: "Tidlig defibrillering er afgørende.",
          options: [
            { id: "a", text: "Adrenalin først" },
            { id: "b", text: "Defibrillering", isCorrect: true },
            { id: "c", text: "Væske" },
            { id: "d", text: "Naloxon" },
          ],
        },
        {
          id: "w17_q15",
          category: "Hvilke rytmer stødes",
          text: "PEA betyder:",
          explanation:
            "Elektrisk aktivitet uden effektiv mekanisk pumpefunktion.",
          options: [
            { id: "a", text: "Normal puls" },
            {
              id: "b",
              text: "Elektrisk aktivitet uden puls",
              isCorrect: true,
            },
            { id: "c", text: "Hurtig puls" },
            { id: "d", text: "Langsom puls" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Rytme ↔ kendetegn", "Rytme ↔ behandling"],
      pairsByRound: {
        1: [
          { left: "Sinusrytme", right: "P-tak før hvert QRS" },
          { left: "Sinusbradykardi", right: "Frekvens under 60/min" },
          { left: "Sinustakykardi", right: "Frekvens over 100/min" },
          { left: "VF", right: "Kaotisk uorganiseret rytme" },
          { left: "PEA", right: "Elektrisk aktivitet uden puls" },
          { left: "Asystoli", right: "Flad linje uden aktivitet" },
        ],
        2: [
          { left: "VF", right: "Usynkroniseret defibrillering" },
          { left: "Pulsløs VT", right: "Stødbar bredkompleks takykardi" },
          { left: "Asystoli", right: "Adrenalin og HLR" },
          {
            left: "PEA",
            right: "Behandling af reversible årsager (H'er og T'er)",
          },
          { left: "Symptomatisk bradykardi", right: "Atropin som førstevalg" },
          { left: "Ustabil takykardi", right: "Synkroniseret DC-konvertering" },
        ],
      },
    },
    word: {
      topicTitle: "Hjerterytme",
      easy: ["Puls"],
      medium: ["Arytmi"],
      hard: ["Fibrillation"],
    },
  },

  "2026-W18": {
    title: "Diabetes",
    mcq: {
      rounds: ["Insulins funktion", "Hypo vs hyperglykæmi", "DKA vs HHS"],
      questions: [
        // --- Round 1: Insulins funktion (5) ---
        {
          id: "w18_q1",
          category: "Insulins funktion",
          text: "Hvad er insulinets primære funktion?",
          explanation:
            "Insulin sænker blodsukker ved at øge glukoseoptag i celler.",
          options: [
            { id: "a", text: "Øger blodsukker" },
            { id: "b", text: "Sænker blodsukker", isCorrect: true },
            { id: "c", text: "Øger blodtryk" },
            { id: "d", text: "Øger puls" },
          ],
        },
        {
          id: "w18_q2",
          category: "Insulins funktion",
          text: "Hvor produceres insulin?",
          explanation: "Produceres i pancreas (beta-celler).",
          options: [
            { id: "a", text: "Lever" },
            { id: "b", text: "Pancreas", isCorrect: true },
            { id: "c", text: "Nyre" },
            { id: "d", text: "Hjerte" },
          ],
        },
        {
          id: "w18_q3",
          category: "Insulins funktion",
          text: "Hvad sker der med blodsukkeret uden insulin?",
          explanation: "Glukose kan ikke optages i celler → hyperglykæmi.",
          options: [
            { id: "a", text: "Det falder" },
            { id: "b", text: "Det stiger", isCorrect: true },
            { id: "c", text: "Det er uændret" },
            { id: "d", text: "Det bliver nul" },
          ],
        },
        {
          id: "w18_q4",
          category: "Insulins funktion",
          text: "Hvilken celletype producerer insulin?",
          explanation: "Beta-celler i pancreas.",
          options: [
            { id: "a", text: "Alfa-celler" },
            { id: "b", text: "Beta-celler", isCorrect: true },
            { id: "c", text: "T-celler" },
            { id: "d", text: "Erytrocytter" },
          ],
        },
        {
          id: "w18_q5",
          category: "Insulins funktion",
          text: "Hvad gør insulin i muskler?",
          explanation: "Øger glukoseoptag og lagring som glykogen.",
          options: [
            { id: "a", text: "Nedbryder glukose" },
            {
              id: "b",
              text: "Øger glukoseoptag",
              isCorrect: true,
            },
            { id: "c", text: "Øger fedtforbrænding akut" },
            { id: "d", text: "Stopper blodflow" },
          ],
        },

        // --- Round 2: Hypo vs hyperglykæmi (5) ---
        {
          id: "w18_q6",
          category: "Hypo vs hyperglykæmi",
          text: "Hvad er et klassisk symptom på hypoglykæmi?",
          explanation: "Sympatikus → sved, rysten.",
          options: [
            { id: "a", text: "Tør hud" },
            { id: "b", text: "Sved og rysten", isCorrect: true },
            { id: "c", text: "Polyuri" },
            { id: "d", text: "Tørst" },
          ],
        },
        {
          id: "w18_q7",
          category: "Hypo vs hyperglykæmi",
          text: "Hvad skyldes symptomer ved hypoglykæmi primært?",
          explanation: "Lav glukose til hjernen → neuroglykopeni.",
          options: [
            { id: "a", text: "For meget insulin" },
            {
              id: "b",
              text: "For lidt glukose til hjernen",
              isCorrect: true,
            },
            { id: "c", text: "Højt blodtryk" },
            { id: "d", text: "Feber" },
          ],
        },
        {
          id: "w18_q8",
          category: "Hypo vs hyperglykæmi",
          text: "Hvad er typisk for hyperglykæmi?",
          explanation: "Polyuri, polydipsi og tør hud.",
          options: [
            { id: "a", text: "Sved og rysten" },
            {
              id: "b",
              text: "Tørst og hyppig vandladning",
              isCorrect: true,
            },
            { id: "c", text: "Lav puls" },
            { id: "d", text: "Miose" },
          ],
        },
        {
          id: "w18_q9",
          category: "Hypo vs hyperglykæmi",
          text: "Hvad er første behandling ved svær hypoglykæmi?",
          explanation: "Glukose (PO/IV) eller glucagon.",
          options: [
            { id: "a", text: "Insulin" },
            { id: "b", text: "Glukose", isCorrect: true },
            { id: "c", text: "Adrenalin" },
            { id: "d", text: "Ilt" },
          ],
        },
        {
          id: "w18_q10",
          category: "Hypo vs hyperglykæmi",
          text: "Hvordan er huden typisk ved hypoglykæmi?",
          explanation: "Sympatikus → kold og klam.",
          options: [
            { id: "a", text: "Varm og tør" },
            {
              id: "b",
              text: "Kold og klam",
              isCorrect: true,
            },
            { id: "c", text: "Blå" },
            { id: "d", text: "Rød og varm" },
          ],
        },

        // --- Round 3: DKA vs HHS (5) ---
        {
          id: "w18_q11",
          category: "DKA vs HHS",
          text: "Hvad kendetegner DKA?",
          explanation: "Ketoner + metabolisk acidose.",
          options: [
            { id: "a", text: "Kun højt blodsukker" },
            {
              id: "b",
              text: "Ketoner og acidose",
              isCorrect: true,
            },
            { id: "c", text: "Lav puls" },
            { id: "d", text: "Normal pH" },
          ],
        },
        {
          id: "w18_q12",
          category: "DKA vs HHS",
          text: "Hvad er typisk respirationsmønster ved DKA?",
          explanation: "Kussmaul respiration (dyb og hurtig).",
          options: [
            { id: "a", text: "Langsom vejrtrækning" },
            {
              id: "b",
              text: "Dyb og hurtig respiration",
              isCorrect: true,
            },
            { id: "c", text: "Apnø" },
            { id: "d", text: "Normal RF" },
          ],
        },
        {
          id: "w18_q13",
          category: "DKA vs HHS",
          text: "Hvad er mest typisk for HHS?",
          explanation: "Meget højt blodsukker uden betydelig ketose.",
          options: [
            { id: "a", text: "Lavt blodsukker" },
            {
              id: "b",
              text: "Ekstrem hyperglykæmi uden ketoner",
              isCorrect: true,
            },
            { id: "c", text: "Acidose" },
            { id: "d", text: "Hypotermi" },
          ],
        },
        {
          id: "w18_q14",
          category: "DKA vs HHS",
          text: "Hvilken tilstand ses oftest hos type 1 diabetikere?",
          explanation: "DKA er klassisk ved type 1.",
          options: [
            { id: "a", text: "HHS" },
            { id: "b", text: "DKA", isCorrect: true },
            { id: "c", text: "Hypertension" },
            { id: "d", text: "Astma" },
          ],
        },
        {
          id: "w18_q15",
          category: "DKA vs HHS",
          text: "Hvad er en alvorlig komplikation ved ubehandlet DKA?",
          explanation: "Acidose → cirkulatorisk kollaps.",
          options: [
            { id: "a", text: "Forstoppelse" },
            {
              id: "b",
              text: "Shock",
              isCorrect: true,
            },
            { id: "c", text: "Hududslæt" },
            { id: "d", text: "Hårtab" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Symptom ↔ tilstand", "Hormon/tilstand ↔ effekt"],
      pairsByRound: {
        1: [
          {
            left: "Sved og rysten",
            right: "Hypoglykæmi med sympatikusaktivering",
          },
          {
            left: "Tørst og polyuri",
            right: "Hyperglykæmi med osmotisk diurese",
          },
          {
            left: "Kold og klam hud",
            right: "Adrenerg respons ved lavt blodsukker",
          },
          { left: "Kussmaul respiration", right: "Metabolisk acidose ved DKA" },
          { left: "Ekstrem dehydrering", right: "Hyperosmolær tilstand (HHS)" },
          {
            left: "Bevidsthedspåvirkning",
            right: "Cerebral påvirkning ved dysglykæmi",
          },
        ],
        2: [
          { left: "Insulin", right: "Øger glukoseoptag i celler" },
          {
            left: "Glucagon",
            right: "Stimulerer glukosefrigivelse fra leveren",
          },
          { left: "DKA", right: "Ketondannelse og lav pH" },
          { left: "HHS", right: "Svær hyperglykæmi uden ketoacidose" },
          { left: "Hypoglykæmi", right: "Kræver hurtig tilførsel af sukker" },
          {
            left: "Pancreas beta-celler",
            right: "Producerer insulin hormonelt",
          },
        ],
      },
    },
    word: {
      topicTitle: "Glukose",
      easy: ["Sukker"],
      medium: ["Insulin"],
      hard: ["Ketoacidose"],
    },
  },

  "2026-W19": {
    title: "Traume: Blødning",
    mcq: {
      rounds: [
        "Arterie vs vene",
        "Kroppens blødningsrespons",
        "Tourniquet/præhospital kontrol",
      ],
      questions: [
        // --- Round 1 ---
        {
          id: "w19_q1",
          category: "Arterie vs vene",
          text: "Hvordan ser arteriel blødning typisk ud?",
          explanation: "Pulserende og lyst rødt.",
          options: [
            { id: "a", text: "Mørk og sivende" },
            {
              id: "b",
              text: "Pulserende og lyst rødt",
              isCorrect: true,
            },
            { id: "c", text: "Ingen blødning" },
            { id: "d", text: "Koaguleret" },
          ],
        },
        {
          id: "w19_q2",
          category: "Arterie vs vene",
          text: "Venøs blødning er typisk:",
          explanation: "Mørk og sivende.",
          options: [
            { id: "a", text: "Pulserende" },
            { id: "b", text: "Mørk og sivende", isCorrect: true },
            { id: "c", text: "Skummende" },
            { id: "d", text: "Tør" },
          ],
        },
        {
          id: "w19_q3",
          category: "Arterie vs vene",
          text: "Hvorfor er arteriel blødning farligere?",
          explanation: "Højere tryk → hurtigere blodtab.",
          options: [
            { id: "a", text: "Lavt tryk" },
            {
              id: "b",
              text: "Højt tryk og hurtigt blodtab",
              isCorrect: true,
            },
            { id: "c", text: "Langsomt flow" },
            { id: "d", text: "Lav puls" },
          ],
        },
        {
          id: "w19_q4",
          category: "Arterie vs vene",
          text: "Hvad er første tiltag ved synlig blødning?",
          explanation: "Direkte tryk.",
          options: [
            { id: "a", text: "Ilt" },
            { id: "b", text: "Direkte tryk", isCorrect: true },
            { id: "c", text: "Glukose" },
            { id: "d", text: "Ventilation" },
          ],
        },
        {
          id: "w19_q5",
          category: "Arterie vs vene",
          text: "Hvad er kapillær blødning?",
          explanation: "Overfladisk sivende blødning.",
          options: [
            { id: "a", text: "Pulserende" },
            {
              id: "b",
              text: "Overfladisk sivende",
              isCorrect: true,
            },
            { id: "c", text: "Sprøjtende" },
            { id: "d", text: "Ingen blødning" },
          ],
        },

        // --- Round 2 ---
        {
          id: "w19_q6",
          category: "Blødningsrespons",
          text: "Hvad er første kompensationsrespons?",
          explanation: "Takykardi.",
          options: [
            { id: "a", text: "Bradykardi" },
            { id: "b", text: "Takykardi", isCorrect: true },
            { id: "c", text: "Hypotermi" },
            { id: "d", text: "Hyperglykæmi" },
          ],
        },
        {
          id: "w19_q7",
          category: "Blødningsrespons",
          text: "Hvad sker der med huden ved shock?",
          explanation: "Kold og klam pga sympatikus.",
          options: [
            { id: "a", text: "Varm og tør" },
            { id: "b", text: "Kold og klam", isCorrect: true },
            { id: "c", text: "Blå" },
            { id: "d", text: "Rød" },
          ],
        },
        {
          id: "w19_q8",
          category: "Blødningsrespons",
          text: "Hvad sker der med blodtrykket senere i shock?",
          explanation: "Falder når kompensation svigter.",
          options: [
            { id: "a", text: "Stiger" },
            { id: "b", text: "Falder", isCorrect: true },
            { id: "c", text: "Uændret" },
            { id: "d", text: "Svinger" },
          ],
        },
        {
          id: "w19_q9",
          category: "Blødningsrespons",
          text: "Hvad er en vigtig metabolisk konsekvens?",
          explanation: "Laktatstigning.",
          options: [
            { id: "a", text: "Laktat", isCorrect: true },
            { id: "b", text: "Kolesterol" },
            { id: "c", text: "Bilirubin" },
            { id: "d", text: "Insulin" },
          ],
        },
        {
          id: "w19_q10",
          category: "Blødningsrespons",
          text: "Hvad sker der med urinproduktion?",
          explanation: "Falder pga nedsat perfusion.",
          options: [
            { id: "a", text: "Stiger" },
            { id: "b", text: "Falder", isCorrect: true },
            { id: "c", text: "Uændret" },
            { id: "d", text: "Stopper altid" },
          ],
        },

        // --- Round 3 ---
        {
          id: "w19_q11",
          category: "Tourniquet",
          text: "Hvornår anvendes tourniquet?",
          explanation: "Ved massiv ekstremitetsblødning.",
          options: [
            { id: "a", text: "Små sår" },
            {
              id: "b",
              text: "Massiv blødning",
              isCorrect: true,
            },
            { id: "c", text: "Hovedpine" },
            { id: "d", text: "Infektion" },
          ],
        },
        {
          id: "w19_q12",
          category: "Tourniquet",
          text: "Hvor placeres tourniquet?",
          explanation: "Proksimalt for blødningen.",
          options: [
            { id: "a", text: "Distalt" },
            { id: "b", text: "Proksimalt", isCorrect: true },
            { id: "c", text: "Over hjertet" },
            { id: "d", text: "På brystet" },
          ],
        },
        {
          id: "w19_q13",
          category: "Tourniquet",
          text: "Hvad er tegn på effektiv tourniquet?",
          explanation: "Blødning stopper.",
          options: [
            { id: "a", text: "Øget blødning" },
            { id: "b", text: "Blødning stopper", isCorrect: true },
            { id: "c", text: "Mere smerte" },
            { id: "d", text: "Ingen effekt" },
          ],
        },
        {
          id: "w19_q14",
          category: "Tourniquet",
          text: "Hvad er en risiko ved ubehandlet blødning?",
          explanation: "Shock og død.",
          options: [
            { id: "a", text: "Feber" },
            { id: "b", text: "Shock", isCorrect: true },
            { id: "c", text: "Hududslæt" },
            { id: "d", text: "Hårtab" },
          ],
        },
        {
          id: "w19_q15",
          category: "Tourniquet",
          text: "Hvad er vigtigste mål præhospitalt?",
          explanation: "Stop blødning hurtigt.",
          options: [
            { id: "a", text: "Måle BT" },
            {
              id: "b",
              text: "Stoppe blødning",
              isCorrect: true,
            },
            { id: "c", text: "Give antibiotika" },
            { id: "d", text: "Give insulin" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Blødningstype ↔ kendetegn", "Fund/tiltag ↔ betydning"],
      pairsByRound: {
        1: [
          {
            left: "Arteriel blødning",
            right: "Pulserende blødning under højt tryk",
          },
          { left: "Venøs blødning", right: "Kontinuerlig mørk blodstrøm" },
          {
            left: "Kapillær blødning",
            right: "Overfladisk sivning fra små kar",
          },
          {
            left: "Massiv blødning",
            right: "Hurtigt tab af cirkulerende volumen",
          },
          {
            left: "Indre blødning",
            right: "Blodtab uden synlig ekstern kilde",
          },
          {
            left: "Direkte tryk",
            right: "Mekanisk kompression af blødningssted",
          },
        ],
        2: [
          {
            left: "Takykardi",
            right: "Øget puls som kompensation for hypovolæmi",
          },
          {
            left: "Kold og klam hud",
            right: "Perifer vasokonstriktion via sympatikus",
          },
          {
            left: "Forlænget kapillærrespons",
            right: "Nedsat mikrocirkulation perifert",
          },
          {
            left: "Faldende blodtryk",
            right: "Dekompensation ved vedvarende blodtab",
          },
          {
            left: "Tourniquet",
            right: "Proksimal afklemning af arterielt flow",
          },
          {
            left: "Stigende laktat",
            right: "Anaerob metabolisme pga hypoperfusion",
          },
        ],
      },
    },
    word: {
      topicTitle: "Hæmodynamik",
      easy: ["Blod"],
      medium: ["Blødning"],
      hard: ["Hypovolæmi"],
    },
  },

  "2026-W20": {
    title: "Astma/KOL",
    mcq: {
      rounds: ["Bronkiernes anatomi", "Bronkospasme", "Inhalationsbehandling"],
    },
    match: { rounds: ["Medicin ↔ receptor", "Symptom ↔ mekanisme"] },
    word: {
      topicTitle: "Obstruktion",
      easy: ["Hoste"],
      medium: ["Bronkospasme"],
      hard: ["Hyperinflation"],
    },
  },
  "2026-W21": {
    title: "Hjerneskade",
    mcq: {
      rounds: ["Intrakranielt tryk", "Monroe-Kellie", "Tegn på ICP-stigning"],
    },
    match: { rounds: ["Pupiller ↔ hjernetryk", "Skadetype ↔ CT-fund"] },
    word: {
      topicTitle: "Intrakranielt tryk",
      easy: ["Hoved"],
      medium: ["Ødem"],
      hard: ["Herniering"],
    },
  },

  "2026-W22": {
    title: "Sepsis",
    mcq: { rounds: ["Infektion vs sepsis", "SIRS", "Præhospital håndtering"] },
    match: { rounds: ["Parameter ↔ sepsisrespons", "Organ ↔ svigt"] },
    word: {
      topicTitle: "Systemisk infektion",
      easy: ["Feber"],
      medium: ["Sepsis"],
      hard: ["Vasodilatation"],
    },
  },

  // --- Faster structured weeks (17–52) ---
  "2026-W23": {
    title: "Anafylaksi",
    mcq: { rounds: ["Allergisk reaktion", "Histamin", "Adrenalin"] },
    match: { rounds: ["Receptor ↔ effekt", "Symptom ↔ mekanisme"] },
    word: {
      topicTitle: "Allergi",
      easy: ["Kløe"],
      medium: ["Histamin"],
      hard: ["Bronkokonstriktion"],
    },
  },

  "2026-W24": {
    title: "Hjerteanatomi",
    mcq: { rounds: ["Kamre", "Klapper", "Pumpefunktion"] },
    match: { rounds: ["Struktur ↔ funktion", "Klap ↔ flowretning"] },
    word: {
      topicTitle: "Hjerte",
      easy: ["Atrium"],
      medium: ["Ventrikel"],
      hard: ["Myokardium"],
    },
  },

  "2026-W25": {
    title: "Respirationssvigt",
    mcq: { rounds: ["Hypoksi", "Hyperkapni", "NIV"] },
    match: { rounds: ["Gasværdi ↔ problem", "Årsag ↔ type svigt"] },
    word: {
      topicTitle: "Gasudveksling",
      easy: ["CO2"],
      medium: ["Hypoksi"],
      hard: ["Hyperkapni"],
    },
  },

  "2026-W26": {
    title: "Elektrolytter",
    mcq: { rounds: ["Na/K funktion", "Hyperkaliæmi", "EKG-effekter"] },
    match: { rounds: ["Elektrolyt ↔ symptom", "Ændring ↔ EKG"] },
    word: {
      topicTitle: "Elektrolytbalance",
      easy: ["Salt"],
      medium: ["Kalium"],
      hard: ["Membranpotentiale"],
    },
  },

  "2026-W27": {
    title: "Smertefysiologi",
    mcq: { rounds: ["Nociceptorer", "Ledningsbaner", "Smertetyper"] },
    match: { rounds: ["Smertetype ↔ årsag", "Fiber ↔ funktion"] },
    word: {
      topicTitle: "Smerte",
      easy: ["Ondt"],
      medium: ["Nociceptor"],
      hard: ["Transmission"],
    },
  },

  "2026-W28": {
    title: "Hjertestop",
    mcq: { rounds: ["HLR-fysiologi", "Stødbar rytme", "ROSC"] },
    match: { rounds: ["Rytme ↔ behandling", "Handling ↔ effekt"] },
    word: {
      topicTitle: "Genoplivning",
      easy: ["HLR"],
      medium: ["ROSC"],
      hard: ["Defibrillation"],
    },
  },

  "2026-W29": {
    title: "Apopleksi",
    mcq: { rounds: ["Iskæmisk vs hæmoragisk", "FAST", "Trombe"] },
    match: { rounds: ["Symptom ↔ lokalisation", "Type ↔ årsag"] },
    word: {
      topicTitle: "Stroke",
      easy: ["Talebesvær"],
      medium: ["Parese"],
      hard: ["Iskæmi"],
    },
  },

  "2026-W30": {
    title: "Lungeemboli",
    mcq: { rounds: ["Trombedannelse", "V/Q mismatch", "Præhospital mistanke"] },
    match: { rounds: ["Symptom ↔ mekanisme", "Risikofaktor ↔ sygdom"] },
    word: {
      topicTitle: "Emboli",
      easy: ["Åndenød"],
      medium: ["Trombe"],
      hard: ["Perfusionsdefekt"],
    },
  },

  "2026-W31": {
    title: "Nyresvigt",
    mcq: { rounds: ["Filtration", "Kreatinin", "Elektrolytforstyrrelser"] },
    match: { rounds: ["Nyrefunktion ↔ stof", "Problem ↔ symptom"] },
    word: {
      topicTitle: "Nyrer",
      easy: ["Urin"],
      medium: ["Filtration"],
      hard: ["Retention"],
    },
  },

  "2026-W32": {
    title: "Meningitis",
    mcq: { rounds: ["Infektion i CNS", "Symptomer", "Præhospital vurdering"] },
    match: { rounds: ["Tegn ↔ meningitis", "Patogen ↔ type"] },
    word: {
      topicTitle: "Hjernehinder",
      easy: ["Nakke"],
      medium: ["Feber"],
      hard: ["Meningeal"],
    },
  },

  "2026-W33": {
    title: "Blodgasser",
    mcq: { rounds: ["pH", "CO2", "HCO3"] },
    match: { rounds: ["Værdi ↔ lidelse", "Kompensation ↔ type"] },
    word: {
      topicTitle: "Syre-base",
      easy: ["pH"],
      medium: ["Bikarbonat"],
      hard: ["Acidose"],
    },
  },

  "2026-W34": {
    title: "Psykiatri akut",
    mcq: { rounds: ["Angst vs psykose", "Fight-flight", "Deeskalering"] },
    match: { rounds: ["Symptom ↔ tilstand", "Respons ↔ strategi"] },
    word: {
      topicTitle: "Psykisk tilstand",
      easy: ["Angst"],
      medium: ["Psykose"],
      hard: ["Paranoia"],
    },
  },

  "2026-W35": {
    title: "GI-blødning",
    mcq: { rounds: ["Øvre vs nedre", "Tegn", "Shock-risiko"] },
    match: { rounds: ["Farve ↔ kilde", "Symptom ↔ årsag"] },
    word: {
      topicTitle: "GI-blødning",
      easy: ["Sort afføring"],
      medium: ["Hæmatemese"],
      hard: ["Hypovolæmi"],
    },
  },

  "2026-W36": {
    title: "Kramper",
    mcq: { rounds: ["Epilepsi", "Hypoksi", "Postiktal fase"] },
    match: { rounds: ["Fase ↔ kendetegn", "Årsag ↔ type"] },
    word: {
      topicTitle: "Kramper",
      easy: ["Ryk"],
      medium: ["Tonisk"],
      hard: ["Postiktal"],
    },
  },

  "2026-W37": {
    title: "Forbrændinger",
    mcq: { rounds: ["Hudlag", "Væsketab", "ABCDE"] },
    match: { rounds: ["Grad ↔ dybde", "Symptom ↔ skade"] },
    word: {
      topicTitle: "Forbrænding",
      easy: ["Hud"],
      medium: ["Blære"],
      hard: ["Nekrose"],
    },
  },

  "2026-W38": {
    title: "Temperaturforstyrrelser",
    mcq: { rounds: ["Hypotermi", "Hypertermi", "Metabolisme"] },
    match: { rounds: ["Temp ↔ effekt", "Tilstand ↔ mekanisme"] },
    word: {
      topicTitle: "Temperatur",
      easy: ["Kulde"],
      medium: ["Feber"],
      hard: ["Hypertermi"],
    },
  },

  "2026-W39": {
    title: "Luftvej",
    mcq: { rounds: ["Øvre vs nedre luftvej", "Obstruktion", "Sug"] },
    match: { rounds: ["Lyd ↔ problem", "Struktur ↔ funktion"] },
    word: {
      topicTitle: "Luftvej",
      easy: ["Hals"],
      medium: ["Larynx"],
      hard: ["Epiglottis"],
    },
  },

  "2026-W40": {
    title: "Celleanatomi",
    mcq: { rounds: ["Organeller", "ATP-produktion", "Membrantransport"] },
    match: { rounds: ["Struktur ↔ funktion", "Transporttype ↔ mekanisme"] },
    word: {
      topicTitle: "Celle",
      easy: ["Kerne"],
      medium: ["Ribosom"],
      hard: ["Mitokondrie"],
    },
  },

  "2026-W41": {
    title: "Koagulation",
    mcq: { rounds: ["Koagulationskaskade", "Trombe", "Antikoagulantia"] },
    match: { rounds: ["Faktor ↔ funktion", "Medicin ↔ effekt"] },
    word: {
      topicTitle: "Koagulation",
      easy: ["Prop"],
      medium: ["Fibrin"],
      hard: ["Koagulationsfaktor"],
    },
  },

  "2026-W42": {
    title: "Forgiftninger",
    mcq: { rounds: ["Toxidromer", "CO-forgiftning", "Naloxon"] },
    match: { rounds: ["Gift ↔ symptom", "Antidot ↔ stof"] },
    word: {
      topicTitle: "Toksikologi",
      easy: ["Gift"],
      medium: ["Overdosis"],
      hard: ["Antidot"],
    },
  },

  "2026-W43": {
    title: "Obstetrik",
    mcq: { rounds: ["Fødselsfaser", "Blødning", "Præhospital fødsel"] },
    match: { rounds: ["Tegn ↔ fase", "Komplikation ↔ risiko"] },
    word: {
      topicTitle: "Fødsel",
      easy: ["Veer"],
      medium: ["Placenta"],
      hard: ["Postpartum"],
    },
  },

  "2026-W44": {
    title: "Pædiatri luftvej",
    mcq: { rounds: ["Børns anatomi", "Croup", "Epiglottitis"] },
    match: { rounds: ["Symptom ↔ diagnose", "Alder ↔ risiko"] },
    word: {
      topicTitle: "Børneluftvej",
      easy: ["Stridor"],
      medium: ["Ødem"],
      hard: ["Obstruktion"],
    },
  },

  "2026-W45": {
    title: "Geriatri",
    mcq: { rounds: ["Aldersændringer", "Polyfarmaci", "Atypiske symptomer"] },
    match: { rounds: ["Alder ↔ fysiologi", "Problem ↔ konsekvens"] },
    word: {
      topicTitle: "Aldring",
      easy: ["Skrøbelig"],
      medium: ["Kognitiv"],
      hard: ["Multisygdom"],
    },
  },

  "2026-W46": {
    title: "Hjertesvigt",
    mcq: { rounds: ["Pumpefunktion", "Lungeødem", "Kompensation"] },
    match: { rounds: ["Symptom ↔ mekanisme", "Fund ↔ svigt"] },
    word: {
      topicTitle: "Hjertesvigt",
      easy: ["Ødem"],
      medium: ["Dyspnø"],
      hard: ["Afterload"],
    },
  },

  "2026-W47": {
    title: "Metabolisme",
    mcq: { rounds: ["Aerob vs anaerob", "Laktat", "ATP"] },
    match: { rounds: ["Proces ↔ iltbehov", "Tilstand ↔ metabolisme"] },
    word: {
      topicTitle: "Energi",
      easy: ["Ilt"],
      medium: ["Laktat"],
      hard: ["Metabolisk"],
    },
  },

  "2026-W48": {
    title: "Blodets bestanddele",
    mcq: { rounds: ["Erytrocytter", "Leukocytter", "Trombocytter"] },
    match: { rounds: ["Celle ↔ funktion", "Mangel ↔ symptom"] },
    word: {
      topicTitle: "Blod",
      easy: ["Røde blodlegemer"],
      medium: ["Hæmoglobin"],
      hard: ["Hæmatologi"],
    },
  },

  "2026-W49": {
    title: "Neurologisk undersøgelse",
    mcq: { rounds: ["Pupiller", "Kraft", "Sensibilitet"] },
    match: { rounds: ["Fund ↔ læsion", "Test ↔ funktion"] },
    word: {
      topicTitle: "Neurologi",
      easy: ["Følesans"],
      medium: ["Motorik"],
      hard: ["Refleks"],
    },
  },

  "2026-W50": {
    title: "Endokrine akutte",
    mcq: { rounds: ["Binyrer", "Thyroidea", "Krise-tilstande"] },
    match: { rounds: ["Hormon ↔ funktion", "Sygdom ↔ effekt"] },
    word: {
      topicTitle: "Hormoner",
      easy: ["Stress"],
      medium: ["Kortisol"],
      hard: ["Endokrin"],
    },
  },

  "2026-W51": {
    title: "Abdominal smerte",
    mcq: { rounds: ["Organplacering", "Peritonitis", "Akut abdomen"] },
    match: { rounds: ["Lokation ↔ organ", "Tegn ↔ årsag"] },
    word: {
      topicTitle: "Abdomen",
      easy: ["Mave"],
      medium: ["Peritoneum"],
      hard: ["Appendiks"],
    },
  },

  "2026-W52": {
    title: "Luftvejsmedicin",
    mcq: { rounds: ["Beta2-agonister", "Steroider", "Ipratropium"] },
    match: { rounds: ["Medicin ↔ receptor", "Effekt ↔ symptom"] },
    word: {
      topicTitle: "Bronkodilatation",
      easy: ["Spray"],
      medium: ["Beta2"],
      hard: ["Inhalation"],
    },
  },
};
