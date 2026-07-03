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
    mcq: {
      rounds: ["Nociceptorer", "Ledningsbaner", "Smertetyper"],
      questions: [
        // --- Round 1: Nociceptorer (5) ---
        {
          id: "w27_q1",
          category: "Nociceptorer",
          text: "Hvad registrerer nociceptorer primært?",
          explanation:
            "Nociceptorer registrerer potentielt vævsskadende stimuli som mekanisk, termisk eller kemisk påvirkning.",
          options: [
            { id: "a", text: "Lys og farver" },
            {
              id: "b",
              text: "Potentielt vævsskadende stimuli",
              isCorrect: true,
            },
            { id: "c", text: "Blodets iltmætning direkte" },
            { id: "d", text: "Hormonkoncentrationer i plasma" },
          ],
        },
        {
          id: "w27_q2",
          category: "Nociceptorer",
          text: "Hvor findes nociceptorer typisk?",
          explanation:
            "Nociceptorer findes blandt andet i hud, muskler, led, knogler, kar og visse organer.",
          options: [
            { id: "a", text: "Kun i hjernen" },
            { id: "b", text: "Kun i blodet" },
            {
              id: "c",
              text: "I mange væv, fx hud, muskler, led og organer",
              isCorrect: true,
            },
            { id: "d", text: "Kun i lungerne" },
          ],
        },
        {
          id: "w27_q3",
          category: "Nociceptorer",
          text: "Hvilken type stimulus kan aktivere nociceptorer?",
          explanation:
            "Nociceptorer kan aktiveres af mekanisk skade, ekstrem varme/kulde og kemiske stoffer fra inflammation.",
          options: [
            {
              id: "a",
              text: "Mekanisk, termisk eller kemisk påvirkning",
              isCorrect: true,
            },
            { id: "b", text: "Kun lyd" },
            { id: "c", text: "Kun synsindtryk" },
            { id: "d", text: "Kun lavt blodsukker" },
          ],
        },
        {
          id: "w27_q4",
          category: "Nociceptorer",
          text: "Hvorfor kan inflammation give øget smertefølsomhed?",
          explanation:
            "Inflammatoriske mediatorer kan sensibilisere nociceptorer, så de reagerer kraftigere eller ved lavere stimulus.",
          options: [
            { id: "a", text: "Fordi nerverne slukkes helt" },
            {
              id: "b",
              text: "Fordi nociceptorer kan blive sensibiliserede",
              isCorrect: true,
            },
            { id: "c", text: "Fordi blodtrykket altid stiger" },
            { id: "d", text: "Fordi iltmætningen altid falder" },
          ],
        },
        {
          id: "w27_q5",
          category: "Nociceptorer",
          text: "Hvad betyder sensibilisering af nociceptorer?",
          explanation:
            "Sensibilisering betyder, at smertereceptorer bliver lettere at aktivere og kan give stærkere smerterespons.",
          options: [
            { id: "a", text: "At smertebanerne permanent forsvinder" },
            { id: "b", text: "At receptorerne bliver mindre følsomme" },
            {
              id: "c",
              text: "At receptorerne bliver lettere at aktivere",
              isCorrect: true,
            },
            { id: "d", text: "At patienten ikke kan mærke smerte" },
          ],
        },

        // --- Round 2: Ledningsbaner (5) ---
        {
          id: "w27_q6",
          category: "Ledningsbaner",
          text: "Hvilke nervefibre leder typisk hurtig, skarp smerte?",
          explanation:
            "A-delta-fibre er myeliniserede og leder hurtigere end C-fibre, hvilket giver en mere skarp og velafgrænset smerte.",
          options: [
            { id: "a", text: "A-delta-fibre", isCorrect: true },
            { id: "b", text: "C-fibre" },
            { id: "c", text: "Motoriske endeplader" },
            { id: "d", text: "Alveoler" },
          ],
        },
        {
          id: "w27_q7",
          category: "Ledningsbaner",
          text: "Hvilke nervefibre leder typisk langsom, diffus og murrende smerte?",
          explanation:
            "C-fibre er umyeliniserede og leder langsommere. De er ofte forbundet med diffus, brændende eller murrende smerte.",
          options: [
            { id: "a", text: "A-delta-fibre" },
            { id: "b", text: "C-fibre", isCorrect: true },
            { id: "c", text: "Purkinjefibre" },
            { id: "d", text: "Sympatiske ganglier alene" },
          ],
        },
        {
          id: "w27_q8",
          category: "Ledningsbaner",
          text: "Hvor kobler mange smerteimpulser først om i centralnervesystemet?",
          explanation:
            "Mange nociceptive signaler kobler om i rygmarvens baghorn, før de sendes videre mod hjernen.",
          options: [
            { id: "a", text: "I venstre atrium" },
            { id: "b", text: "I rygmarvens baghorn", isCorrect: true },
            { id: "c", text: "I alveolerne" },
            { id: "d", text: "I leverens galdegange" },
          ],
        },
        {
          id: "w27_q9",
          category: "Ledningsbaner",
          text: "Hvad er thalamus’ rolle i smerteoplevelsen?",
          explanation:
            "Thalamus fungerer som en vigtig relæstation, hvor sensoriske signaler bearbejdes og sendes videre til relevante hjerneområder.",
          options: [
            { id: "a", text: "Producerer insulin" },
            {
              id: "b",
              text: "Fungerer som relæstation for sensoriske signaler",
              isCorrect: true,
            },
            { id: "c", text: "Pumper blod til lungerne" },
            { id: "d", text: "Nedbryder røde blodlegemer" },
          ],
        },
        {
          id: "w27_q10",
          category: "Ledningsbaner",
          text: "Hvorfor er smerte ikke kun et lokalt vævsfænomen?",
          explanation:
            "Smerte formes både af nociceptive signaler og hjernens fortolkning, herunder tidligere erfaringer, frygt, kontekst og opmærksomhed.",
          options: [
            { id: "a", text: "Fordi smerte altid skyldes infektion" },
            { id: "b", text: "Fordi smerte altid kan måles direkte i blodet" },
            {
              id: "c",
              text: "Fordi hjernen fortolker og modulerer smertesignaler",
              isCorrect: true,
            },
            { id: "d", text: "Fordi smerte kun findes i muskler" },
          ],
        },

        // --- Round 3: Smertetyper (5) ---
        {
          id: "w27_q11",
          category: "Smertetyper",
          text: "Hvad er nociceptiv smerte?",
          explanation:
            "Nociceptiv smerte skyldes aktivering af smertereceptorer ved vævsskade eller potentiel vævsskade.",
          options: [
            {
              id: "a",
              text: "Smerte fra skade eller irritation af smertereceptorer",
              isCorrect: true,
            },
            { id: "b", text: "Smerte uden nervesystemets involvering" },
            { id: "c", text: "Smerte kun fra psykisk sygdom" },
            { id: "d", text: "Smerte kun ved lavt blodtryk" },
          ],
        },
        {
          id: "w27_q12",
          category: "Smertetyper",
          text: "Hvad er neuropatisk smerte?",
          explanation:
            "Neuropatisk smerte skyldes skade eller sygdom i nervesystemet og beskrives ofte som brændende, stikkende eller elektrisk.",
          options: [
            { id: "a", text: "Smerte fra knoglebrud alene" },
            {
              id: "b",
              text: "Smerte fra skade eller sygdom i nervesystemet",
              isCorrect: true,
            },
            { id: "c", text: "Smerte fra normal muskeltræthed" },
            { id: "d", text: "Smerte fra lav feber" },
          ],
        },
        {
          id: "w27_q13",
          category: "Smertetyper",
          text: "Hvad er visceral smerte?",
          explanation:
            "Visceral smerte kommer fra indre organer og kan være diffus, dyb og svær at lokalisere præcist.",
          options: [
            { id: "a", text: "Smerte fra huden" },
            { id: "b", text: "Smerte fra indre organer", isCorrect: true },
            { id: "c", text: "Smerte fra hår og negle" },
            { id: "d", text: "Smerte fra synsnerven alene" },
          ],
        },
        {
          id: "w27_q14",
          category: "Smertetyper",
          text: "Hvad betyder refereret smerte?",
          explanation:
            "Refereret smerte opleves et andet sted end problemets egentlige oprindelse, fordi signaler fra forskellige væv kan dele nervebaner.",
          options: [
            { id: "a", text: "At patienten opfinder smerten" },
            {
              id: "b",
              text: "At smerte opleves et andet sted end årsagen",
              isCorrect: true,
            },
            { id: "c", text: "At smerte altid skyldes muskler" },
            { id: "d", text: "At smerte ikke skal vurderes" },
          ],
        },
        {
          id: "w27_q15",
          category: "Smertetyper",
          text: "Hvorfor er smertevurdering vigtig præhospitalt?",
          explanation:
            "Smerte kan give vigtige ledetråde om sygdom, skade, alvorlighed og udvikling. Ændringer i smerte skal vurderes sammen med ABCDE og vitale værdier.",
          options: [
            { id: "a", text: "Fordi smerte alene altid giver diagnosen" },
            { id: "b", text: "Fordi smerte aldrig har klinisk betydning" },
            {
              id: "c",
              text: "Fordi smerte kan være en vigtig del af samlet vurdering og udvikling",
              isCorrect: true,
            },
            { id: "d", text: "Fordi alle smerter behandles ens" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Smertetype ↔ årsag", "Fiber ↔ funktion"],
      pairsByRound: {
        1: [
          {
            left: "Nociceptiv smerte",
            right: "Aktivering af smertereceptorer ved vævsskade",
          },
          {
            left: "Neuropatisk smerte",
            right: "Skade eller sygdom i nervesystemet",
          },
          {
            left: "Visceral smerte",
            right: "Smerte fra indre organer",
          },
          {
            left: "Refereret smerte",
            right: "Opleves et andet sted end årsagen",
          },
          {
            left: "Inflammatorisk smerte",
            right: "Mediatorer sensibiliserer nociceptorer",
          },
          {
            left: "Akut smerte",
            right: "Nyopstået smerte ofte knyttet til skade eller sygdom",
          },
        ],
        2: [
          {
            left: "A-delta-fibre",
            right: "Hurtig, skarp og mere velafgrænset smerte",
          },
          {
            left: "C-fibre",
            right: "Langsom, diffus, brændende eller murrende smerte",
          },
          {
            left: "Myelin",
            right: "Øger ledningshastigheden i nervefibre",
          },
          {
            left: "Rygmarvens baghorn",
            right: "Tidligt omkoblingssted for mange smertesignaler",
          },
          {
            left: "Thalamus",
            right: "Relæstation for sensoriske signaler mod cortex",
          },
          {
            left: "Descenderende modulation",
            right: "Hjernen kan dæmpe eller forstærke smerteoplevelsen",
          },
        ],
      },
    },
    word: {
      topicTitle: "Smerte",
      easy: ["Ondt"],
      medium: ["Nociceptor"],
      hard: ["Transmission"],
    },
  },

  "2026-W28": {
    title: "Hjertestop",
    mcq: {
      rounds: ["HLR-fysiologi", "Stødbar rytme", "ROSC"],
      questions: [
        // --- Round 1: HLR-fysiologi (5) ---
        {
          id: "w28_q1",
          category: "HLR-fysiologi",
          text: "Hvad er hovedformålet med brystkompressioner under HLR?",
          explanation:
            "Brystkompressioner skaber et kunstigt blodflow, så hjernen og hjertet får en minimal, men vigtig perfusion.",
          options: [
            { id: "a", text: "At sænke kropstemperaturen" },
            {
              id: "b",
              text: "At skabe kunstigt blodflow til vitale organer",
              isCorrect: true,
            },
            { id: "c", text: "At fjerne CO2 fuldstændigt" },
            { id: "d", text: "At stoppe al elektrisk aktivitet i hjertet" },
          ],
        },
        {
          id: "w28_q2",
          category: "HLR-fysiologi",
          text: "Hvorfor er pauser i brystkompressioner uønskede?",
          explanation:
            "Når kompressioner stoppes, falder perfusionstrykket hurtigt. Det tager tid at genopbygge flow, når kompressionerne startes igen.",
          options: [
            { id: "a", text: "Fordi patienten ellers vågner for hurtigt" },
            {
              id: "b",
              text: "Fordi perfusionstrykket falder hurtigt",
              isCorrect: true,
            },
            { id: "c", text: "Fordi iltmætningen altid bliver for høj" },
            { id: "d", text: "Fordi defibrillatoren slukker" },
          ],
        },
        {
          id: "w28_q3",
          category: "HLR-fysiologi",
          text: "Hvilket organ er særligt følsomt for manglende blodflow ved hjertestop?",
          explanation:
            "Hjernen er meget følsom for iskæmi, og neurologisk skade kan udvikle sig hurtigt ved manglende cirkulation.",
          options: [
            { id: "a", text: "Hjernen", isCorrect: true },
            { id: "b", text: "Håret" },
            { id: "c", text: "Neglene" },
            { id: "d", text: "Milten alene" },
          ],
        },
        {
          id: "w28_q4",
          category: "HLR-fysiologi",
          text: "Hvad kan utilstrækkelig kompressionsdybde medføre?",
          explanation:
            "For overfladiske kompressioner giver dårligere blodflow og dermed mindre perfusion af hjerne og hjerte.",
          options: [
            { id: "a", text: "Bedre koronar perfusion" },
            { id: "b", text: "Dårligere kunstigt blodflow", isCorrect: true },
            { id: "c", text: "Sikker ROSC" },
            { id: "d", text: "Mindre behov for vurdering" },
          ],
        },
        {
          id: "w28_q5",
          category: "HLR-fysiologi",
          text: "Hvorfor er ventilation relevant under længerevarende hjertestop?",
          explanation:
            "Ventilation bidrager til ilttilførsel og CO2-fjernelse, men skal balanceres så kompressioner ikke afbrydes unødigt.",
          options: [
            { id: "a", text: "Fordi ventilation erstatter kompressioner" },
            {
              id: "b",
              text: "Fordi ventilation bidrager til gasudveksling",
              isCorrect: true,
            },
            { id: "c", text: "Fordi ventilation stopper ventrikelflimmer" },
            { id: "d", text: "Fordi CO2 ikke har betydning" },
          ],
        },

        // --- Round 2: Stødbar rytme (5) ---
        {
          id: "w28_q6",
          category: "Stødbar rytme",
          text: "Hvilken rytme regnes klassisk som stødbar ved hjertestop?",
          explanation:
            "Ventrikelflimmer er en kaotisk elektrisk aktivitet i ventriklerne og behandles med defibrillering.",
          options: [
            { id: "a", text: "Asystoli" },
            { id: "b", text: "Ventrikelflimmer", isCorrect: true },
            { id: "c", text: "Normal sinusrytme" },
            { id: "d", text: "Sinusbradykardi med puls" },
          ],
        },
        {
          id: "w28_q7",
          category: "Stødbar rytme",
          text: "Hvilken rytme er også stødbar, hvis patienten er pulsløs?",
          explanation:
            "Pulsløs ventrikeltakykardi er en stødbar hjertestoprytme, fordi hurtig ventrikulær aktivitet kan forhindre effektivt kredsløb.",
          options: [
            { id: "a", text: "Pulsløs ventrikeltakykardi", isCorrect: true },
            { id: "b", text: "Sinusrytme med normal puls" },
            { id: "c", text: "Asystoli" },
            { id: "d", text: "Respiratorisk sinusarytmi" },
          ],
        },
        {
          id: "w28_q8",
          category: "Stødbar rytme",
          text: "Hvad er formålet med defibrillering ved VF/pulsløs VT?",
          explanation:
            "Defibrillering forsøger at afbryde kaotisk eller uhensigtsmæssig elektrisk aktivitet, så hjertets normale pacemakersystem kan genetablere rytme.",
          options: [
            { id: "a", text: "At starte inflammation" },
            {
              id: "b",
              text: "At afbryde kaotisk elektrisk aktivitet",
              isCorrect: true,
            },
            { id: "c", text: "At måle blodsukker" },
            { id: "d", text: "At øge blodvolumen" },
          ],
        },
        {
          id: "w28_q9",
          category: "Stødbar rytme",
          text: "Hvorfor skal rytmeanalyse og stød afgives med korte pauser i HLR?",
          explanation:
            "Korte pauser begrænser tiden uden kunstigt blodflow og hjælper med at bevare perfusionstrykket.",
          options: [
            {
              id: "a",
              text: "For at undgå unødige kompressionspauser",
              isCorrect: true,
            },
            { id: "b", text: "For at gøre patienten mere vågen" },
            { id: "c", text: "For at undgå at elektroderne virker" },
            { id: "d", text: "For at sænke iltbehovet til nul" },
          ],
        },
        {
          id: "w28_q10",
          category: "Stødbar rytme",
          text: "Hvilken rytme regnes typisk ikke som stødbar?",
          explanation:
            "Asystoli behandles ikke med defibrillering, fordi der ikke er en organiseret eller kaotisk elektrisk aktivitet, som stødet kan nulstille.",
          options: [
            { id: "a", text: "Ventrikelflimmer" },
            { id: "b", text: "Pulsløs ventrikeltakykardi" },
            { id: "c", text: "Asystoli", isCorrect: true },
            { id: "d", text: "Grov VF" },
          ],
        },

        // --- Round 3: ROSC (5) ---
        {
          id: "w28_q11",
          category: "ROSC",
          text: "Hvad betyder ROSC?",
          explanation:
            "ROSC står for return of spontaneous circulation, altså tilbagevenden af spontan cirkulation.",
          options: [
            {
              id: "a",
              text: "Return of spontaneous circulation",
              isCorrect: true,
            },
            { id: "b", text: "Rapid oxygen saturation collapse" },
            { id: "c", text: "Respiratory obstruction shock condition" },
            { id: "d", text: "Reactive organ support cycle" },
          ],
        },
        {
          id: "w28_q12",
          category: "ROSC",
          text: "Hvad kan være tegn på ROSC under genoplivning?",
          explanation:
            "Tegn kan være palpabel puls, stigende EtCO2, egenrespiration, bevægelse eller målbar blodtryk/cirkulation.",
          options: [
            { id: "a", text: "Sikker asystoli" },
            {
              id: "b",
              text: "Palpabel puls eller tydelige cirkulationstegn",
              isCorrect: true,
            },
            { id: "c", text: "Lavere EtCO2 alene" },
            { id: "d", text: "At defibrillatoren er tændt" },
          ],
        },
        {
          id: "w28_q13",
          category: "ROSC",
          text: "Hvorfor skal patienten fortsat overvåges tæt efter ROSC?",
          explanation:
            "Efter ROSC er patienten ofte ustabil og kan få nyt hjertestop, respirationssvigt, hypotension eller neurologiske komplikationer.",
          options: [
            {
              id: "a",
              text: "Fordi risikoen for fornyet forværring er betydelig",
              isCorrect: true,
            },
            { id: "b", text: "Fordi patienten altid er helt stabil" },
            { id: "c", text: "Fordi ABCDE ikke længere er relevant" },
            { id: "d", text: "Fordi vitale værdier ikke skal måles" },
          ],
        },
        {
          id: "w28_q14",
          category: "ROSC",
          text: "Hvad bør vurderes systematisk efter ROSC?",
          explanation:
            "Efter ROSC bør patienten vurderes systematisk med fokus på luftvej, respiration, cirkulation, neurologi og årsag til hjertestoppet.",
          options: [
            { id: "a", text: "Kun smerte i højre fod" },
            {
              id: "b",
              text: "ABCDE og mulig årsag til hjertestop",
              isCorrect: true,
            },
            { id: "c", text: "Kun hudfarve" },
            { id: "d", text: "Kun patientens alder" },
          ],
        },
        {
          id: "w28_q15",
          category: "ROSC",
          text: "Hvorfor er årsagssøgning vigtig efter ROSC?",
          explanation:
            "Hvis den udløsende årsag ikke identificeres, kan patienten hurtigt forværres igen. Tænk fx hypoksi, iskæmi, elektrolytforstyrrelser eller blødning.",
          options: [
            { id: "a", text: "Fordi årsagen aldrig har betydning" },
            {
              id: "b",
              text: "Fordi årsagen kan kræve videre målrettet behandling",
              isCorrect: true,
            },
            { id: "c", text: "Fordi ROSC altid skyldes dehydrering" },
            { id: "d", text: "Fordi defibrillering altid fjerner årsagen" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Rytme ↔ behandling", "Handling ↔ effekt"],
      pairsByRound: {
        1: [
          { left: "Ventrikelflimmer", right: "Stødbar rytme" },
          {
            left: "Pulsløs ventrikeltakykardi",
            right: "Stødbar rytme ved hjertestop",
          },
          { left: "Asystoli", right: "Ikke-stødbar rytme" },
          { left: "PEA", right: "Elektrisk aktivitet uden effektiv puls" },
          { left: "ROSC", right: "Spontan cirkulation er vendt tilbage" },
          {
            left: "Sinusrytme med puls",
            right: "Ikke hjertestoprytme i sig selv",
          },
        ],
        2: [
          { left: "Brystkompressioner", right: "Skaber kunstigt blodflow" },
          {
            left: "Defibrillering",
            right: "Afbryder kaotisk elektrisk aktivitet",
          },
          { left: "Minimale pauser", right: "Bevarer perfusionstrykket bedre" },
          {
            left: "Ventilation",
            right: "Bidrager til iltning og CO2-fjernelse",
          },
          { left: "Rytmeanalyse", right: "Afgør om rytmen er stødbar" },
          {
            left: "Post-ROSC overvågning",
            right: "Opdager ny instabilitet tidligt",
          },
        ],
      },
    },
    word: {
      topicTitle: "Genoplivning",
      easy: ["HLR"],
      medium: ["ROSC"],
      hard: ["Defibrillation"],
    },
  },

  "2026-W29": {
    title: "Apopleksi",
    mcq: {
      rounds: ["Iskæmisk vs hæmoragisk", "FAST", "Trombe"],
      questions: [
        // --- Round 1: Iskæmisk vs hæmoragisk (5) ---
        {
          id: "w29_q1",
          category: "Iskæmisk vs hæmoragisk",
          text: "Hvad er iskæmisk apopleksi?",
          explanation:
            "Iskæmisk apopleksi skyldes nedsat eller ophørt blodforsyning til et område i hjernen, typisk på grund af en trombe eller emboli.",
          options: [
            { id: "a", text: "Blødning i hjernen" },
            {
              id: "b",
              text: "Nedsat blodforsyning til hjernevæv",
              isCorrect: true,
            },
            { id: "c", text: "Infektion i lungerne" },
            { id: "d", text: "Lavt blodsukker alene" },
          ],
        },
        {
          id: "w29_q2",
          category: "Iskæmisk vs hæmoragisk",
          text: "Hvad er hæmoragisk apopleksi?",
          explanation:
            "Hæmoragisk apopleksi skyldes blødning i eller omkring hjernen, som kan skade væv og øge trykket intrakranielt.",
          options: [
            {
              id: "a",
              text: "Blødning i eller omkring hjernen",
              isCorrect: true,
            },
            { id: "b", text: "Blodprop i benet" },
            { id: "c", text: "Astmaanfald" },
            { id: "d", text: "Dehydrering uden neurologiske udfald" },
          ],
        },
        {
          id: "w29_q3",
          category: "Iskæmisk vs hæmoragisk",
          text: "Kan man sikkert skelne iskæmisk og hæmoragisk apopleksi præhospitalt?",
          explanation:
            "Præhospitalt kan man mistænke apopleksi, men sikker skelnen mellem iskæmi og blødning kræver billeddiagnostik.",
          options: [
            { id: "a", text: "Ja, altid ud fra blodtryk alene" },
            { id: "b", text: "Ja, altid ud fra pupilstørrelse alene" },
            {
              id: "c",
              text: "Nej, sikker skelnen kræver billeddiagnostik",
              isCorrect: true,
            },
            { id: "d", text: "Ja, hvis patienten har hovedpine" },
          ],
        },
        {
          id: "w29_q4",
          category: "Iskæmisk vs hæmoragisk",
          text: "Hvorfor er debut-tidspunkt vigtigt ved mistanke om apopleksi?",
          explanation:
            "Debut- eller sidst-set-rask-tidspunkt har betydning for visitation og mulige akutte behandlingsmuligheder.",
          options: [
            { id: "a", text: "Fordi symptomer altid forsvinder efter én time" },
            {
              id: "b",
              text: "Fordi det påvirker akut visitation og behandlingsmuligheder",
              isCorrect: true,
            },
            { id: "c", text: "Fordi det afgør patientens blodtype" },
            { id: "d", text: "Fordi det erstatter ABCDE" },
          ],
        },
        {
          id: "w29_q5",
          category: "Iskæmisk vs hæmoragisk",
          text: "Hvilken tilstand kan ligne apopleksi og bør kontrolleres tidligt?",
          explanation:
            "Hypoglykæmi kan give fokale eller generelle neurologiske symptomer og bør tænkes som en vigtig apopleksi-mimic.",
          options: [
            { id: "a", text: "Hypoglykæmi", isCorrect: true },
            { id: "b", text: "Nældefeber" },
            { id: "c", text: "Neglesvamp" },
            { id: "d", text: "Let muskelømhed" },
          ],
        },

        // --- Round 2: FAST (5) ---
        {
          id: "w29_q6",
          category: "FAST",
          text: "Hvad står F for i FAST?",
          explanation:
            "F står for Face/ansigt og bruges til at vurdere facialisparese eller skævhed i ansigtet.",
          options: [
            { id: "a", text: "Fever" },
            { id: "b", text: "Face/ansigt", isCorrect: true },
            { id: "c", text: "Femur" },
            { id: "d", text: "Flow" },
          ],
        },
        {
          id: "w29_q7",
          category: "FAST",
          text: "Hvad vurderer A i FAST?",
          explanation:
            "A står for Arm og handler om kraftnedsættelse eller drift i en arm.",
          options: [
            { id: "a", text: "Armkraft eller armdrift", isCorrect: true },
            { id: "b", text: "Auskultation af lunger" },
            { id: "c", text: "Ankelødem" },
            { id: "d", text: "Alkoholpromille" },
          ],
        },
        {
          id: "w29_q8",
          category: "FAST",
          text: "Hvad vurderer S i FAST?",
          explanation:
            "S står for Speech/tale og handler om talebesvær, afasi eller utydelig tale.",
          options: [
            { id: "a", text: "Saturation alene" },
            { id: "b", text: "Tale/sprog", isCorrect: true },
            { id: "c", text: "Synkope alene" },
            { id: "d", text: "Svedtendens" },
          ],
        },
        {
          id: "w29_q9",
          category: "FAST",
          text: "Hvad minder T i FAST om?",
          explanation:
            "T står for Time og minder om, at tid er afgørende: debut eller sidst-set-rask skal afklares hurtigt.",
          options: [
            { id: "a", text: "At tid/debut skal afklares", isCorrect: true },
            { id: "b", text: "At temperatur er eneste vigtige parameter" },
            { id: "c", text: "At transport aldrig haster" },
            { id: "d", text: "At tale ikke er relevant" },
          ],
        },
        {
          id: "w29_q10",
          category: "FAST",
          text: "Hvad er en begrænsning ved FAST?",
          explanation:
            "FAST fanger ikke alle stroke-typer, fx kan posterior apopleksi give svimmelhed, ataksi, synsforstyrrelser eller kvalme uden klassisk FAST-positivitet.",
          options: [
            { id: "a", text: "FAST finder altid alle apopleksier" },
            {
              id: "b",
              text: "FAST kan overse nogle neurologiske præsentationer",
              isCorrect: true,
            },
            { id: "c", text: "FAST kan kun bruges ved hjertestop" },
            { id: "d", text: "FAST kræver blodprøve før brug" },
          ],
        },

        // --- Round 3: Trombe (5) ---
        {
          id: "w29_q11",
          category: "Trombe",
          text: "Hvad er en trombe?",
          explanation:
            "En trombe er en blodprop dannet i et kar. Hvis den okkluderer et cerebralt kar, kan den give iskæmisk apopleksi.",
          options: [
            { id: "a", text: "En blodprop dannet i et kar", isCorrect: true },
            { id: "b", text: "En type hvide blodlegemer" },
            { id: "c", text: "En nerveimpuls" },
            { id: "d", text: "En respirationslyd" },
          ],
        },
        {
          id: "w29_q12",
          category: "Trombe",
          text: "Hvad er en emboli?",
          explanation:
            "En emboli er materiale, ofte en blodprop, som transporteres med blodet og sætter sig fast et andet sted.",
          options: [
            {
              id: "a",
              text: "Blodprop/materiale der vandrer og sætter sig fast",
              isCorrect: true,
            },
            { id: "b", text: "En knoglefraktur" },
            { id: "c", text: "En måling af blodsukker" },
            { id: "d", text: "Et tegn på astma" },
          ],
        },
        {
          id: "w29_q13",
          category: "Trombe",
          text: "Hvorfor kan atrieflimren øge risikoen for embolisk apopleksi?",
          explanation:
            "Ved atrieflimren kan blod stå mere stille i atrierne, hvilket kan fremme trombedannelse og embolisering.",
          options: [
            {
              id: "a",
              text: "Fordi blod kan stå mere stille og danne tromber",
              isCorrect: true,
            },
            { id: "b", text: "Fordi atrieflimren altid giver lavt blodsukker" },
            { id: "c", text: "Fordi lungerne stopper med at fungere" },
            { id: "d", text: "Fordi alle patienter får feber" },
          ],
        },
        {
          id: "w29_q14",
          category: "Trombe",
          text: "Hvad sker der med hjernevæv ved længerevarende iskæmi?",
          explanation:
            "Ved utilstrækkelig blodforsyning mangler vævet ilt og energi, hvilket kan føre til irreversibel celledød.",
          options: [
            { id: "a", text: "Vævet får mere energi" },
            {
              id: "b",
              text: "Der kan opstå irreversibel celledød",
              isCorrect: true,
            },
            { id: "c", text: "Alle symptomer bliver altid psykogene" },
            { id: "d", text: "Blodtrykket bliver altid normalt" },
          ],
        },
        {
          id: "w29_q15",
          category: "Trombe",
          text: "Hvorfor er en kort præhospital neurologisk reassessment vigtig?",
          explanation:
            "Neurologiske udfald kan udvikle sig hurtigt. Reassessment hjælper med at opdage forværring, bedring eller nye symptomer.",
          options: [
            { id: "a", text: "Fordi symptomer aldrig ændrer sig" },
            {
              id: "b",
              text: "Fordi ændringer kan påvirke vurdering og visitation",
              isCorrect: true,
            },
            { id: "c", text: "Fordi ABCDE ikke er relevant" },
            { id: "d", text: "Fordi kun én måling er nødvendig" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Symptom ↔ lokalisation", "Type ↔ årsag"],
      pairsByRound: {
        1: [
          {
            left: "Facialisparese",
            right: "Kan tyde på cerebral påvirkning af ansigtsmotorik",
          },
          {
            left: "Armdrift",
            right: "Kan tyde på unilateral kraftnedsættelse",
          },
          { left: "Afasi", right: "Kan tyde på påvirkning af sprogfunktion" },
          {
            left: "Synsfeltsudfald",
            right: "Kan tyde på påvirkning af synsbaner/cortex",
          },
          {
            left: "Ataksi",
            right: "Kan ses ved cerebellar/posterior påvirkning",
          },
          {
            left: "Pludselig svimmelhed med neurologiske fund",
            right: "Kan være posterior apopleksi",
          },
        ],
        2: [
          {
            left: "Iskæmisk apopleksi",
            right: "Nedsat blodforsyning til hjernevæv",
          },
          {
            left: "Hæmoragisk apopleksi",
            right: "Blødning i eller omkring hjernen",
          },
          { left: "Trombe", right: "Blodprop dannet i et kar" },
          { left: "Emboli", right: "Materiale der vandrer og sætter sig fast" },
          {
            left: "TIA",
            right: "Forbigående neurologiske symptomer uden varigt infarkt",
          },
          { left: "Hypoglykæmi", right: "Vigtig stroke-mimic" },
        ],
      },
    },
    word: {
      topicTitle: "Stroke",
      easy: ["Talebesvær"],
      medium: ["Parese"],
      hard: ["Iskæmi"],
    },
  },

  "2026-W30": {
    title: "Lungeemboli",
    mcq: {
      rounds: ["Trombedannelse", "V/Q mismatch", "Præhospital mistanke"],
      questions: [
        // --- Round 1: Trombedannelse (5) ---
        {
          id: "w30_q1",
          category: "Trombedannelse",
          text: "Hvad er en typisk oprindelse for en lungeemboli?",
          explanation:
            "Mange lungeembolier stammer fra dybe venetromboser i ben eller bækken, som løsriver sig og føres til lungekredsløbet.",
          options: [
            { id: "a", text: "Dybe vener i ben eller bækken", isCorrect: true },
            { id: "b", text: "Alveolerne alene" },
            { id: "c", text: "Hudens kapillærer alene" },
            { id: "d", text: "Mavesækken" },
          ],
        },
        {
          id: "w30_q2",
          category: "Trombedannelse",
          text: "Hvad betyder emboli?",
          explanation:
            "En emboli er materiale, ofte en blodprop, der transporteres med blodet og sætter sig fast et andet sted.",
          options: [
            {
              id: "a",
              text: "Et vandrende materiale der sætter sig fast i et kar",
              isCorrect: true,
            },
            { id: "b", text: "En bronkie med slim" },
            { id: "c", text: "En type iltbehandling" },
            { id: "d", text: "En normal hjertelyd" },
          ],
        },
        {
          id: "w30_q3",
          category: "Trombedannelse",
          text: "Hvilken faktor øger risikoen for venøs trombose?",
          explanation:
            "Immobilisering kan give venøs stase, som øger risikoen for trombedannelse.",
          options: [
            { id: "a", text: "Langvarig immobilisering", isCorrect: true },
            { id: "b", text: "Kortvarig hvile i 2 minutter" },
            { id: "c", text: "Normal gangfunktion alene" },
            { id: "d", text: "Lavt hårtab" },
          ],
        },
        {
          id: "w30_q4",
          category: "Trombedannelse",
          text: "Hvorfor kan nylig kirurgi øge risikoen for tromboemboli?",
          explanation:
            "Kirurgi kan øge koagulationsaktivitet, give karpåvirkning og medføre immobilisering.",
          options: [
            {
              id: "a",
              text: "Pga. øget koagulation, karpåvirkning og immobilisering",
              isCorrect: true,
            },
            { id: "b", text: "Fordi alle operationer giver astma" },
            { id: "c", text: "Fordi blodet ikke kan koagulere bagefter" },
            { id: "d", text: "Fordi lungerne altid kollapser" },
          ],
        },
        {
          id: "w30_q5",
          category: "Trombedannelse",
          text: "Hvad er DVT?",
          explanation:
            "DVT står for dyb venetrombose og kan være kilde til embolier, der føres til lungerne.",
          options: [
            { id: "a", text: "Dyb venetrombose", isCorrect: true },
            { id: "b", text: "Diffus ventilationssvigtstest" },
            { id: "c", text: "Direkte venøs temperatur" },
            { id: "d", text: "Dorsal vital transport" },
          ],
        },

        // --- Round 2: V/Q mismatch (5) ---
        {
          id: "w30_q6",
          category: "V/Q mismatch",
          text: "Hvad sker der typisk med perfusionen bag en lungeemboli?",
          explanation:
            "Blodflowet til et område af lungen reduceres eller ophører, mens ventilationen kan være bevaret.",
          options: [
            {
              id: "a",
              text: "Perfusionen reduceres eller ophører",
              isCorrect: true,
            },
            { id: "b", text: "Perfusionen fordobles altid" },
            { id: "c", text: "Alveolerne fyldes altid med pus" },
            { id: "d", text: "Ventilation og perfusion bliver altid perfekte" },
          ],
        },
        {
          id: "w30_q7",
          category: "V/Q mismatch",
          text: "Hvordan kan lungeemboli give hypoksi?",
          explanation:
            "V/Q mismatch betyder, at ventilation og perfusion ikke passer sammen, så gasudvekslingen bliver ineffektiv.",
          options: [
            {
              id: "a",
              text: "Ved V/Q mismatch og ineffektiv gasudveksling",
              isCorrect: true,
            },
            { id: "b", text: "Ved øget hårvækst" },
            { id: "c", text: "Ved at øge insulinproduktion" },
            { id: "d", text: "Ved at fjerne alle røde blodlegemer" },
          ],
        },
        {
          id: "w30_q8",
          category: "V/Q mismatch",
          text: "Hvorfor kan respirationsfrekvensen stige ved lungeemboli?",
          explanation:
            "Hypoksi, smerte, angst og øget respiratorisk drive kan give tachypnø.",
          options: [
            {
              id: "a",
              text: "Pga. hypoksi, smerte og øget respiratorisk drive",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Fordi CO2 altid bliver ekstremt høj præhospitalt",
            },
            { id: "c", text: "Fordi alle patienter mister bevidstheden" },
            { id: "d", text: "Fordi lungeemboli kun påvirker huden" },
          ],
        },
        {
          id: "w30_q9",
          category: "V/Q mismatch",
          text: "Hvorfor kan EtCO2 være lav ved større lungeemboli?",
          explanation:
            "Nedsat perfusion til ventilerede alveoler og hyperventilation kan reducere udåndet CO2.",
          options: [
            {
              id: "a",
              text: "Pga. reduceret pulmonal perfusion og hyperventilation",
              isCorrect: true,
            },
            { id: "b", text: "Fordi CO2 kun dannes i lungerne" },
            { id: "c", text: "Fordi patienten altid holder vejret" },
            { id: "d", text: "Fordi hjernen stopper al metabolisme" },
          ],
        },
        {
          id: "w30_q10",
          category: "V/Q mismatch",
          text: "Hvad kan massiv lungeemboli medføre kredsløbsmæssigt?",
          explanation:
            "En stor emboli kan øge modstanden i lungekredsløbet, belaste højre ventrikel og føre til shock.",
          options: [
            {
              id: "a",
              text: "Højre ventrikelbelastning og shock",
              isCorrect: true,
            },
            { id: "b", text: "Permanent perfekt blodtryk" },
            { id: "c", text: "Altid bradykardi uden andre fund" },
            { id: "d", text: "Kun lokal hudrødme" },
          ],
        },

        // --- Round 3: Præhospital mistanke (5) ---
        {
          id: "w30_q11",
          category: "Præhospital mistanke",
          text: "Hvilket symptom er typisk ved lungeemboli?",
          explanation:
            "Pludselig åndenød er et klassisk symptom, men præsentationen kan variere meget.",
          options: [
            { id: "a", text: "Pludselig åndenød", isCorrect: true },
            { id: "b", text: "Isoleret ørepine" },
            { id: "c", text: "Langsomt voksende negle" },
            { id: "d", text: "Kun kløe i huden" },
          ],
        },
        {
          id: "w30_q12",
          category: "Præhospital mistanke",
          text: "Hvilken kombination kan styrke mistanken om lungeemboli?",
          explanation:
            "Dyspnø, pleuritisk brystsmerte, tachykardi, hypoksi og risikofaktorer som immobilisering eller DVT kan pege mod lungeemboli.",
          options: [
            {
              id: "a",
              text: "Dyspnø, brystsmerte, tachykardi og tromboserisiko",
              isCorrect: true,
            },
            { id: "b", text: "Kun let hovedpine efter søvn" },
            { id: "c", text: "Kun mavesmerter efter mad" },
            { id: "d", text: "Kun tør hud uden symptomer" },
          ],
        },
        {
          id: "w30_q13",
          category: "Præhospital mistanke",
          text: "Hvorfor kan lungeemboli være svær at erkende præhospitalt?",
          explanation:
            "Symptomerne kan ligne andre tilstande som ACS, pneumoni, pneumothorax, angst eller KOL-forværring.",
          options: [
            {
              id: "a",
              text: "Fordi symptomer kan ligne mange andre akutte tilstande",
              isCorrect: true,
            },
            { id: "b", text: "Fordi den altid er symptomfri" },
            { id: "c", text: "Fordi SpO2 altid er normal" },
            { id: "d", text: "Fordi EKG altid viser diagnosen sikkert" },
          ],
        },
        {
          id: "w30_q14",
          category: "Præhospital mistanke",
          text: "Hvilket fund kan ses ved DVT som mulig kilde til lungeemboli?",
          explanation:
            "Ensidig hævelse, smerte eller ømhed i benet kan passe med dyb venetrombose, men fundet er ikke altid til stede.",
          options: [
            {
              id: "a",
              text: "Ensidig hævelse eller smerte i benet",
              isCorrect: true,
            },
            { id: "b", text: "Symmetrisk hårvækst" },
            { id: "c", text: "Isoleret synstab uden andre fund" },
            { id: "d", text: "Højresidig ørepine" },
          ],
        },
        {
          id: "w30_q15",
          category: "Præhospital mistanke",
          text: "Hvad er vigtigt i den præhospitale vurdering ved mistanke om lungeemboli?",
          explanation:
            "Vurder ABCDE, vitale værdier, debut, risikofaktorer, differentialdiagnoser og tegn på kredsløbspåvirkning.",
          options: [
            {
              id: "a",
              text: "ABCDE, vitale værdier, risikofaktorer og differentialdiagnoser",
              isCorrect: true,
            },
            { id: "b", text: "Kun patientens højde" },
            { id: "c", text: "Kun hudfarve" },
            { id: "d", text: "Kun om patienten hoster" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Symptom ↔ mekanisme", "Risikofaktor ↔ sygdom"],
      pairsByRound: {
        1: [
          { left: "Pludselig dyspnø", right: "Akut V/Q mismatch" },
          { left: "Pleuritisk brystsmerte", right: "Irritation nær pleura" },
          {
            left: "Tachykardi",
            right: "Kompensation ved hypoksi eller kredsløbsstress",
          },
          { left: "Hypoksi", right: "Ineffektiv gasudveksling" },
          {
            left: "Lav EtCO2",
            right: "Reduceret perfusion og hyperventilation",
          },
          {
            left: "Synkope/shock",
            right: "Mulig massiv emboli med højre hjertebelastning",
          },
        ],
        2: [
          {
            left: "Immobilisering",
            right: "Øger risiko for venøs stase og DVT",
          },
          {
            left: "Nylig kirurgi",
            right: "Øger koagulationsrisiko og immobilisering",
          },
          {
            left: "Tidligere DVT/LE",
            right: "Øger mistanke ved nye symptomer",
          },
          { left: "Cancer", right: "Kan give øget trombosetendens" },
          { left: "Graviditet/postpartum", right: "Hyperkoagulabel tilstand" },
          { left: "Ensidig bensmerte/hævelse", right: "Kan pege mod DVT" },
        ],
      },
    },
    word: {
      topicTitle: "Emboli",
      easy: ["Åndenød"],
      medium: ["Trombe"],
      hard: ["Perfusionsdefekt"],
    },
  },

  "2026-W31": {
    title: "Nyresvigt",
    mcq: {
      rounds: ["Filtration", "Kreatinin", "Elektrolytforstyrrelser"],
      questions: [
        // --- Round 1: Filtration (5) ---
        {
          id: "w31_q1",
          category: "Filtration",
          text: "Hvad er nyrernes overordnede funktion?",
          explanation:
            "Nyrerne regulerer væske, elektrolytter, syre-base-balance og udskiller affaldsstoffer via urinen.",
          options: [
            { id: "a", text: "At producere galde" },
            {
              id: "b",
              text: "At regulere væske, elektrolytter og udskille affaldsstoffer",
              isCorrect: true,
            },
            { id: "c", text: "At ventilere alveolerne" },
            { id: "d", text: "At producere insulin alene" },
          ],
        },
        {
          id: "w31_q2",
          category: "Filtration",
          text: "Hvor foregår den primære filtrering i nyren?",
          explanation:
            "Filtrationen starter i glomerulus, hvor plasma filtreres fra blodet ind i nefronet.",
          options: [
            { id: "a", text: "Glomerulus", isCorrect: true },
            { id: "b", text: "Alveolen" },
            { id: "c", text: "Ventriklen" },
            { id: "d", text: "Pancreasgangen" },
          ],
        },
        {
          id: "w31_q3",
          category: "Filtration",
          text: "Hvad kan nedsat nyreperfusion medføre?",
          explanation:
            "Lav perfusion til nyrerne kan reducere filtrationen og bidrage til akut nyrepåvirkning.",
          options: [
            { id: "a", text: "Øget eller normal filtration i alle tilfælde" },
            {
              id: "b",
              text: "Nedsat filtration og akut nyrepåvirkning",
              isCorrect: true,
            },
            { id: "c", text: "Direkte forbedret gasudveksling" },
            { id: "d", text: "Øget synsskarphed" },
          ],
        },
        {
          id: "w31_q4",
          category: "Filtration",
          text: "Hvad kan faldende urinproduktion være tegn på?",
          explanation:
            "Faldende urinproduktion kan være tegn på nedsat nyrefunktion eller utilstrækkelig perfusion, men skal vurderes i sammenhæng.",
          options: [
            {
              id: "a",
              text: "Mulig nedsat nyrefunktion eller perfusion",
              isCorrect: true,
            },
            { id: "b", text: "Sikker normal nyrefunktion" },
            { id: "c", text: "Altid psykogen årsag" },
            { id: "d", text: "Kun hudsygdom" },
          ],
        },
        {
          id: "w31_q5",
          category: "Filtration",
          text: "Hvad er et nefron?",
          explanation:
            "Nefronet er nyrens funktionelle enhed, hvor filtrering, reabsorption og sekretion foregår.",
          options: [
            { id: "a", text: "Nyrens funktionelle enhed", isCorrect: true },
            { id: "b", text: "En del af luftrøret" },
            { id: "c", text: "En hjertemuskelcelle" },
            { id: "d", text: "En type trombocyt" },
          ],
        },

        // --- Round 2: Kreatinin (5) ---
        {
          id: "w31_q6",
          category: "Kreatinin",
          text: "Hvad bruges kreatinin ofte som markør for?",
          explanation:
            "Kreatinin bruges som indirekte markør for nyrefunktion, fordi det udskilles via nyrerne.",
          options: [
            { id: "a", text: "Nyrefunktion", isCorrect: true },
            { id: "b", text: "Lungevolumen" },
            { id: "c", text: "Synsstyrke" },
            { id: "d", text: "Hudtemperatur alene" },
          ],
        },
        {
          id: "w31_q7",
          category: "Kreatinin",
          text: "Hvad kan stigende kreatinin tyde på?",
          explanation:
            "Stigende kreatinin kan tyde på nedsat renal udskillelse og forværret nyrefunktion.",
          options: [
            { id: "a", text: "Forværret nyrefunktion", isCorrect: true },
            { id: "b", text: "Sikker forbedret nyrefunktion" },
            { id: "c", text: "Altid astma" },
            { id: "d", text: "Normal temperaturregulation" },
          ],
        },
        {
          id: "w31_q8",
          category: "Kreatinin",
          text: "Hvorfor kan kreatinin være påvirket af muskelmasse?",
          explanation:
            "Kreatinin dannes fra muskelmetabolisme, så muskelmasse kan påvirke baseline-niveauet.",
          options: [
            {
              id: "a",
              text: "Fordi kreatinin dannes fra muskelmetabolisme",
              isCorrect: true,
            },
            { id: "b", text: "Fordi kreatinin dannes i alveolerne" },
            { id: "c", text: "Fordi kreatinin kun findes i knogler" },
            {
              id: "d",
              text: "Fordi kreatinin er et hormon fra skjoldbruskkirtlen",
            },
          ],
        },
        {
          id: "w31_q9",
          category: "Kreatinin",
          text: "Hvorfor er én kreatininværdi ikke altid nok til at vurdere udviklingen?",
          explanation:
            "Trend, tidligere værdier, klinik og patientens baseline er vigtige for at vurdere akut forværring.",
          options: [
            {
              id: "a",
              text: "Fordi trend og baseline har betydning",
              isCorrect: true,
            },
            { id: "b", text: "Fordi kreatinin aldrig kan måles" },
            { id: "c", text: "Fordi nyrefunktion kun vurderes med EKG" },
            { id: "d", text: "Fordi kreatinin altid er nul" },
          ],
        },
        {
          id: "w31_q10",
          category: "Kreatinin",
          text: "Hvilken præhospital oplysning kan være relevant ved mulig nyrepåvirkning?",
          explanation:
            "Oplysninger om kendt nyresygdom, dialyse, væskeindtag, urinproduktion, medicin og nylig sygdom kan være vigtige.",
          options: [
            {
              id: "a",
              text: "Kendt nyresygdom, dialyse, medicin og urinproduktion",
              isCorrect: true,
            },
            { id: "b", text: "Kun patientens skostørrelse" },
            { id: "c", text: "Kun hårfarve" },
            { id: "d", text: "Kun om patienten kan fløjte" },
          ],
        },

        // --- Round 3: Elektrolytforstyrrelser (5) ---
        {
          id: "w31_q11",
          category: "Elektrolytforstyrrelser",
          text: "Hvilken elektrolytforstyrrelse er særligt vigtig ved nyresvigt?",
          explanation:
            "Hyperkaliæmi er vigtig, fordi nyrerne normalt udskiller kalium, og højt kalium kan påvirke hjertets elektriske aktivitet.",
          options: [
            { id: "a", text: "Hyperkaliæmi", isCorrect: true },
            { id: "b", text: "Lav hårfarve" },
            { id: "c", text: "Øget ilt i atmosfæren" },
            { id: "d", text: "Lav hudpigmentering" },
          ],
        },
        {
          id: "w31_q12",
          category: "Elektrolytforstyrrelser",
          text: "Hvorfor kan hyperkaliæmi være farlig?",
          explanation:
            "Forhøjet kalium kan forstyrre hjertets ledningssystem og medføre alvorlige arytmier.",
          options: [
            {
              id: "a",
              text: "Det kan give alvorlige arytmier",
              isCorrect: true,
            },
            { id: "b", text: "Det forbedrer altid hjerterytmen" },
            { id: "c", text: "Det giver altid bedre nyrefunktion" },
            { id: "d", text: "Det påvirker kun hårvækst" },
          ],
        },
        {
          id: "w31_q13",
          category: "Elektrolytforstyrrelser",
          text: "Hvilket EKG-fund kan være foreneligt med hyperkaliæmi?",
          explanation:
            "Spidse T-takker kan ses ved hyperkaliæmi, men EKG kan variere og skal vurderes sammen med klinik og prøver.",
          options: [
            { id: "a", text: "Spidse T-takker", isCorrect: true },
            { id: "b", text: "Altid helt normalt EKG uden undtagelse" },
            { id: "c", text: "Kun ST-elevation i alle afledninger" },
            { id: "d", text: "Kun manglende P-takker ved alle tilfælde" },
          ],
        },
        {
          id: "w31_q14",
          category: "Elektrolytforstyrrelser",
          text: "Hvad kan ophobning af affaldsstoffer ved nyresvigt bidrage til?",
          explanation:
            "Uremi kan give almen påvirkning, kvalme, træthed, konfusion og andre systemiske symptomer.",
          options: [
            {
              id: "a",
              text: "Almen påvirkning og neurologiske symptomer",
              isCorrect: true,
            },
            { id: "b", text: "Sikker forbedret bevidsthed" },
            { id: "c", text: "Kun øget hårvækst" },
            { id: "d", text: "Altid lav puls uden andre fund" },
          ],
        },
        {
          id: "w31_q15",
          category: "Elektrolytforstyrrelser",
          text: "Hvorfor er medicinanamnese relevant ved nyresvigt?",
          explanation:
            "Nedsat nyrefunktion kan påvirke udskillelsen af visse lægemidler, og nogle præparater kan forværre nyrepåvirkning eller elektrolytforstyrrelser.",
          options: [
            {
              id: "a",
              text: "Fordi nyrefunktion kan påvirke medicinudskillelse",
              isCorrect: true,
            },
            { id: "b", text: "Fordi medicin aldrig har betydning" },
            { id: "c", text: "Fordi alle lægemidler udskilles via lungerne" },
            { id: "d", text: "Fordi nyresvigt altid skyldes antibiotika" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Nyrefunktion ↔ stof", "Problem ↔ symptom"],
      pairsByRound: {
        1: [
          { left: "Glomerulus", right: "Primært filtrationssted i nefronet" },
          { left: "Kreatinin", right: "Indirekte markør for nyrefunktion" },
          { left: "Kalium", right: "Udskilles normalt delvist via nyrerne" },
          { left: "Urea/affaldsstoffer", right: "Kan ophobes ved nyresvigt" },
          { left: "Nefron", right: "Nyrens funktionelle enhed" },
          {
            left: "Urinproduktion",
            right: "Kan falde ved nedsat nyrefunktion eller perfusion",
          },
        ],
        2: [
          { left: "Hyperkaliæmi", right: "Risiko for alvorlige arytmier" },
          {
            left: "Væskeretention",
            right: "Ødemer og mulig respiratorisk belastning",
          },
          { left: "Uremi", right: "Kvalme, træthed og konfusion" },
          { left: "Nedsat filtration", right: "Ophobning af affaldsstoffer" },
          { left: "Hypoperfusion", right: "Kan give akut nyrepåvirkning" },
          {
            left: "Dialysepatient",
            right: "Kan have særlig risiko ved elektrolytforstyrrelser",
          },
        ],
      },
    },
    word: {
      topicTitle: "Nyrer",
      easy: ["Urin"],
      medium: ["Filtration"],
      hard: ["Retention"],
    },
  },

  "2026-W32": {
    title: "Meningitis",
    mcq: {
      rounds: ["Infektion i CNS", "Symptomer", "Præhospital vurdering"],
      questions: [
        {
          id: "w32_q1",
          category: "Infektion i CNS",
          text: "Hvad betyder meningitis?",
          explanation:
            "Meningitis er inflammation i meninges, altså hinderne omkring hjerne og rygmarv.",
          options: [
            { id: "a", text: "Betændelse i hjernehinderne", isCorrect: true },
            { id: "b", text: "Blødning i hjernestammen" },
            { id: "c", text: "Blodprop i hjernen" },
            { id: "d", text: "Infektion i rygmarvens knogler" },
          ],
        },
        {
          id: "w32_q2",
          category: "Infektion i CNS",
          text: "Hvorfor er bakteriel meningitis en alvorlig tilstand?",
          explanation:
            "Bakteriel meningitis kan udvikle sig hurtigt og være forbundet med sepsis, shock og neurologisk påvirkning.",
          options: [
            {
              id: "a",
              text: "Den kan progrediere hurtigt og give sepsis",
              isCorrect: true,
            },
            { id: "b", text: "Den giver typisk kun lokale hudsymptomer" },
            { id: "c", text: "Den kræver sjældent akut vurdering" },
            { id: "d", text: "Den påvirker kun perifere nerver" },
          ],
        },
        {
          id: "w32_q3",
          category: "Infektion i CNS",
          text: "Hvad kan inflammation i CNS medføre?",
          explanation:
            "Inflammation kan give hævelse, ændret cerebral perfusion og tegn på øget intrakranielt tryk.",
          options: [
            { id: "a", text: "Øget intrakranielt tryk", isCorrect: true },
            { id: "b", text: "Isoleret ankelsmerte" },
            { id: "c", text: "Kun nedsat appetit uden risiko" },
            { id: "d", text: "Forbedret cerebral perfusion" },
          ],
        },
        {
          id: "w32_q4",
          category: "Infektion i CNS",
          text: "Hvad er encefalitis?",
          explanation:
            "Encefalitis er inflammation i selve hjernevævet og kan give bevidsthedspåvirkning, kramper og neurologiske udfald.",
          options: [
            { id: "a", text: "Inflammation i hjernevævet", isCorrect: true },
            { id: "b", text: "Inflammation i hjertemusklen" },
            { id: "c", text: "Infektion i lungehinden" },
            { id: "d", text: "Betændelse i knoglemarven alene" },
          ],
        },
        {
          id: "w32_q5",
          category: "Infektion i CNS",
          text: "Hvilken smittevej ses ofte ved meningokokker?",
          explanation:
            "Meningokokker kan spredes via dråber fra øvre luftveje, men kun få smittede udvikler invasiv sygdom.",
          options: [
            { id: "a", text: "Dråbesmitte fra luftveje", isCorrect: true },
            { id: "b", text: "Smitte gennem intakt hud" },
            { id: "c", text: "Kun fødevarebåren smitte" },
            { id: "d", text: "Direkte smitte via knoglevæv" },
          ],
        },
        {
          id: "w32_q6",
          category: "Symptomer",
          text: "Hvilken kombination kan give mistanke om meningitis?",
          explanation:
            "Feber, hovedpine og nakkestivhed er klassiske tegn, men fravær af ét tegn udelukker ikke tilstanden.",
          options: [
            {
              id: "a",
              text: "Feber, hovedpine og nakkestivhed",
              isCorrect: true,
            },
            { id: "b", text: "Hoste, hæshed og brystsmerter" },
            { id: "c", text: "Knæsmerter, hævelse og haltende gang" },
            { id: "d", text: "Kløe, tåreflåd og nysetrang" },
          ],
        },
        {
          id: "w32_q7",
          category: "Symptomer",
          text: "Hvad kan petekkier ved feber give mistanke om?",
          explanation:
            "Petekkier eller purpura sammen med feber kan ses ved meningokoksygdom og alvorlig sepsis.",
          options: [
            { id: "a", text: "Mulig meningokoksepsis", isCorrect: true },
            { id: "b", text: "Sikker allergisk reaktion" },
            { id: "c", text: "Ukompliceret dehydrering" },
            { id: "d", text: "Normal reaktion ved feber" },
          ],
        },
        {
          id: "w32_q8",
          category: "Symptomer",
          text: "Hvilket fund er et alvorligt tegn ved feber?",
          explanation:
            "Påvirket bevidsthed kan pege på CNS-påvirkning, sepsis eller anden kritisk sygdom og bør tages alvorligt.",
          options: [
            { id: "a", text: "Påvirket bevidsthedsniveau", isCorrect: true },
            { id: "b", text: "Let tørst uden andre symptomer" },
            { id: "c", text: "Normal hudfarve og kontakt" },
            { id: "d", text: "Kortvarig hikke" },
          ],
        },
        {
          id: "w32_q9",
          category: "Symptomer",
          text: "Hvordan kan meningitis vise sig hos små børn?",
          explanation:
            "Børn kan have uspecifikke symptomer som sløvhed, irritabilitet, dårlig kontakt eller spisevægring.",
          options: [
            { id: "a", text: "Sløvhed eller irritabilitet", isCorrect: true },
            { id: "b", text: "Kun øget appetit" },
            { id: "c", text: "Smertefri hævelse i anklen" },
            { id: "d", text: "Forbigående hårtab" },
          ],
        },
        {
          id: "w32_q10",
          category: "Symptomer",
          text: "Hvad betyder fotofobi?",
          explanation:
            "Fotofobi betyder lysfølsomhed og kan ses ved meningeal irritation, men er ikke specifikt alene.",
          options: [
            { id: "a", text: "Lysfølsomhed", isCorrect: true },
            { id: "b", text: "Nedsat hørelse" },
            { id: "c", text: "Smerte ved vandladning" },
            { id: "d", text: "Manglende lugtesans" },
          ],
        },
        {
          id: "w32_q11",
          category: "Præhospital vurdering",
          text: "Hvad er centralt i den første vurdering?",
          explanation:
            "ABCDE, vitalparametre og bevidsthedsniveau hjælper med at identificere kritisk sygdom og forværring.",
          options: [
            { id: "a", text: "ABCDE og vitalparametre", isCorrect: true },
            { id: "b", text: "Kun temperaturmåling" },
            { id: "c", text: "Kun palpation af nakken" },
            { id: "d", text: "At afvente sikre hudtegn" },
          ],
        },
        {
          id: "w32_q12",
          category: "Præhospital vurdering",
          text: "Hvad bør vurderes ved mistanke om meningitis?",
          explanation:
            "Bevidsthed, hud, temperatur og kredsløb kan give vigtige tegn på CNS-påvirkning og sepsis.",
          options: [
            {
              id: "a",
              text: "Bevidsthed, hud, temperatur og kredsløb",
              isCorrect: true,
            },
            { id: "b", text: "Kun blodtryk i stående stilling" },
            { id: "c", text: "Kun smerter i ekstremiteter" },
            { id: "d", text: "Kun højde og vægt" },
          ],
        },
        {
          id: "w32_q13",
          category: "Præhospital vurdering",
          text: "Hvorfor er gentagen observation vigtig?",
          explanation:
            "Patienter med alvorlig infektion kan forværres hurtigt, så udvikling i bevidsthed og vitalparametre er vigtig.",
          options: [
            {
              id: "a",
              text: "Tilstanden kan ændre sig hurtigt",
              isCorrect: true,
            },
            { id: "b", text: "Det erstatter transport og vurdering" },
            { id: "c", text: "Det bekræfter diagnosen alene" },
            { id: "d", text: "Det fjerner behovet for ABCDE" },
          ],
        },
        {
          id: "w32_q14",
          category: "Præhospital vurdering",
          text: "Hvad er relevant ved vurdering af petekkier?",
          explanation:
            "Et ikke-afblegende udslæt kan være et alvorligt tegn, især sammen med feber og påvirket almentilstand.",
          options: [
            { id: "a", text: "Om udslættet blegner ved tryk", isCorrect: true },
            { id: "b", text: "Om udslættet følger hårgrænsen" },
            { id: "c", text: "Om udslættet kun sidder på negle" },
            { id: "d", text: "Om udslættet forsvinder i kulde" },
          ],
        },
        {
          id: "w32_q15",
          category: "Præhospital vurdering",
          text: "Hvilken anamnese er relevant ved mistanke?",
          explanation:
            "Debut, symptomer, eksposition og risikofaktorer kan støtte vurderingen af alvorlighed og differentialdiagnoser.",
          options: [
            {
              id: "a",
              text: "Debut, feber, udslæt og kontakt til syge",
              isCorrect: true,
            },
            { id: "b", text: "Favoritmad og fritidsinteresser" },
            { id: "c", text: "Kun tidligere knoglebrud" },
            { id: "d", text: "Kun sidste tandlægebesøg" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Tegn ↔ meningitis", "Patogen ↔ type"],
      pairsByRound: {
        1: [
          {
            left: "Feber og nakkestivhed",
            right: "Kan give mistanke om meningitis",
          },
          { left: "Petekkier", right: "Kan pege mod meningokoksygdom" },
          { left: "Fotofobi", right: "Lysfølsomhed ved meningeal irritation" },
          { left: "Konfusion", right: "Tegn på CNS-påvirkning" },
          { left: "Kramper", right: "Neurologisk alarmtegn" },
          { left: "Hovedpine", right: "Hyppigt symptom ved meningitis" },
        ],
        2: [
          { left: "Meningokokker", right: "Bakteriel årsag" },
          { left: "Pneumokokker", right: "Bakteriel årsag" },
          { left: "Enterovirus", right: "Viral meningitis" },
          { left: "Herpesvirus", right: "Viral CNS-infektion" },
          { left: "Listeria", right: "Bakteriel årsag hos risikogrupper" },
          { left: "Tuberkulose", right: "Kan give subakut meningitis" },
        ],
      },
    },
    word: {
      topicTitle: "Hjernehinder",
      easy: ["Nakke"],
      medium: ["Feber"],
      hard: ["Meningeal"],
    },
  },

  "2026-W33": {
    title: "Blodgasser",
    mcq: {
      rounds: ["pH", "CO2", "HCO3"],
      questions: [
        {
          id: "w33_q1",
          category: "pH",
          text: "Hvad beskriver pH i en blodgas?",
          explanation:
            "pH beskriver blodets surhedsgrad og bruges til at vurdere, om patienten har acidæmi, alkalæmi eller normal pH.",
          options: [
            { id: "a", text: "Blodets surhedsgrad", isCorrect: true },
            { id: "b", text: "Mængden af hæmoglobin" },
            { id: "c", text: "Blodets iltindhold alene" },
            { id: "d", text: "Nyrefunktionen direkte" },
          ],
        },
        {
          id: "w33_q2",
          category: "pH",
          text: "Hvad tyder en lav pH typisk på?",
          explanation:
            "Lav pH tyder på acidæmi. Årsagen kan være respiratorisk, metabolisk eller en blanding, og skal tolkes sammen med CO2 og HCO3.",
          options: [
            { id: "a", text: "Acidæmi", isCorrect: true },
            { id: "b", text: "Alkalæmi" },
            { id: "c", text: "Normal syre-base-status" },
            { id: "d", text: "Ren hypoksi" },
          ],
        },
        {
          id: "w33_q3",
          category: "pH",
          text: "Hvorfor bør pH ikke tolkes alene?",
          explanation:
            "pH viser retningen, men CO2 og HCO3 hjælper med at vurdere, om problemet primært er respiratorisk eller metabolisk.",
          options: [
            {
              id: "a",
              text: "Fordi årsagen kræver vurdering af CO2 og HCO3",
              isCorrect: true,
            },
            { id: "b", text: "Fordi pH kun bruges ved traumer" },
            { id: "c", text: "Fordi pH ikke ændrer sig ved sygdom" },
            { id: "d", text: "Fordi pH kun siger noget om puls" },
          ],
        },
        {
          id: "w33_q4",
          category: "pH",
          text: "Hvad kan en næsten normal pH ved påvirket patient betyde?",
          explanation:
            "En næsten normal pH kan ses ved kompensation eller blandede syre-base-forstyrrelser og udelukker ikke alvorlig sygdom.",
          options: [
            {
              id: "a",
              text: "Der kan være kompensation eller blandet forstyrrelse",
              isCorrect: true,
            },
            { id: "b", text: "Patienten er sikkert stabil" },
            { id: "c", text: "CO2 og HCO3 er uden betydning" },
            { id: "d", text: "Blodgassen er altid fejlmålt" },
          ],
        },
        {
          id: "w33_q5",
          category: "pH",
          text: "Hvilket udsagn om pH er mest korrekt?",
          explanation:
            "pH er et øjebliksbillede og skal sammenholdes med klinik, respiration, kredsløb og andre blodgasværdier.",
          options: [
            {
              id: "a",
              text: "pH skal tolkes sammen med klinik og øvrige værdier",
              isCorrect: true,
            },
            { id: "b", text: "Normal pH udelukker shock" },
            { id: "c", text: "Lav pH skyldes altid lungeproblem" },
            { id: "d", text: "Høj pH skyldes altid nyresvigt" },
          ],
        },
        {
          id: "w33_q6",
          category: "CO2",
          text: "Hvad afspejler CO2 i en blodgas primært?",
          explanation:
            "CO2 afspejler især ventilationen. Hypoventilation kan give CO2-retention, mens hyperventilation kan sænke CO2.",
          options: [
            { id: "a", text: "Ventilation", isCorrect: true },
            { id: "b", text: "Blodprocent" },
            { id: "c", text: "Koagulationsevne" },
            { id: "d", text: "Blodsukker" },
          ],
        },
        {
          id: "w33_q7",
          category: "CO2",
          text: "Hvad kan forhøjet CO2 tyde på?",
          explanation:
            "Forhøjet CO2 kan tyde på hypoventilation, eksempelvis ved udtrætning, respirationsdepression eller svær obstruktiv lungesygdom.",
          options: [
            { id: "a", text: "Hypoventilation", isCorrect: true },
            { id: "b", text: "Hyperventilation" },
            { id: "c", text: "Primær metabolisk alkalose" },
            { id: "d", text: "Normal ventilation med sikkerhed" },
          ],
        },
        {
          id: "w33_q8",
          category: "CO2",
          text: "Hvad kan lav CO2 ses ved?",
          explanation:
            "Lav CO2 ses ofte ved hyperventilation, men årsagen kan være smerte, angst, hypoksi, sepsis eller metabolisk acidose.",
          options: [
            { id: "a", text: "Hyperventilation", isCorrect: true },
            { id: "b", text: "Respirationsstop" },
            { id: "c", text: "Ren hypoventilation" },
            { id: "d", text: "Manglende gasudveksling uden ventilation" },
          ],
        },
        {
          id: "w33_q9",
          category: "CO2",
          text: "Hvordan påvirker stigende CO2 typisk pH?",
          explanation:
            "CO2 virker som en syrekomponent i syre-base-systemet. Stigende CO2 vil typisk trække pH nedad.",
          options: [
            { id: "a", text: "pH falder typisk", isCorrect: true },
            { id: "b", text: "pH stiger altid kraftigt" },
            { id: "c", text: "pH påvirkes aldrig" },
            { id: "d", text: "pH bliver altid normal" },
          ],
        },
        {
          id: "w33_q10",
          category: "CO2",
          text: "Hvad kan lav pH og høj CO2 samlet pege på?",
          explanation:
            "Lav pH sammen med høj CO2 passer med respiratorisk acidose, men den kliniske sammenhæng er vigtig.",
          options: [
            { id: "a", text: "Respiratorisk acidose", isCorrect: true },
            { id: "b", text: "Respiratorisk alkalose" },
            { id: "c", text: "Ren metabolisk alkalose" },
            { id: "d", text: "Normal syre-base-status" },
          ],
        },
        {
          id: "w33_q11",
          category: "HCO3",
          text: "Hvad repræsenterer HCO3 i en blodgas?",
          explanation:
            "HCO3, bikarbonat, er den metaboliske basekomponent og påvirkes især af metaboliske forhold og nyrernes regulering.",
          options: [
            { id: "a", text: "Den metaboliske basekomponent", isCorrect: true },
            { id: "b", text: "Kun iltmætningen" },
            { id: "c", text: "Kun respirationsfrekvensen" },
            { id: "d", text: "Antallet af trombocytter" },
          ],
        },
        {
          id: "w33_q12",
          category: "HCO3",
          text: "Hvad kan lav HCO3 sammen med lav pH tyde på?",
          explanation:
            "Lav HCO3 og lav pH passer med metabolisk acidose, som kan ses ved fx laktatophobning, ketoacidose eller nyrepåvirkning.",
          options: [
            { id: "a", text: "Metabolisk acidose", isCorrect: true },
            { id: "b", text: "Respiratorisk alkalose" },
            { id: "c", text: "Ren respiratorisk acidose" },
            { id: "d", text: "Normal bufferkapacitet" },
          ],
        },
        {
          id: "w33_q13",
          category: "HCO3",
          text: "Hvad kan forhøjet HCO3 være tegn på?",
          explanation:
            "Forhøjet HCO3 kan ses ved metabolisk alkalose eller som kompensation ved længerevarende respiratorisk acidose.",
          options: [
            {
              id: "a",
              text: "Metabolisk alkalose eller kompensation",
              isCorrect: true,
            },
            { id: "b", text: "Akut hypoksi alene" },
            { id: "c", text: "Manglende nyrefunktion med sikkerhed" },
            { id: "d", text: "Udelukkende hyperventilation" },
          ],
        },
        {
          id: "w33_q14",
          category: "HCO3",
          text: "Hvorfor kan HCO3 være vigtigt ved shockmistanke?",
          explanation:
            "Ved shock kan vævshypoperfusion give laktatophobning og metabolisk acidose, som ofte afspejles i lavere HCO3.",
          options: [
            {
              id: "a",
              text: "Det kan støtte mistanke om metabolisk acidose",
              isCorrect: true,
            },
            { id: "b", text: "Det viser blodtrykket direkte" },
            { id: "c", text: "Det erstatter klinisk vurdering" },
            { id: "d", text: "Det viser bevidsthedsniveauet direkte" },
          ],
        },
        {
          id: "w33_q15",
          category: "HCO3",
          text: "Hvad passer bedst med metabolisk kompensation ved respiratorisk acidose?",
          explanation:
            "Ved længerevarende CO2-retention kan kroppen kompensere metabolisk ved at øge HCO3, særligt via nyrerne.",
          options: [
            { id: "a", text: "HCO3 stiger over tid", isCorrect: true },
            { id: "b", text: "HCO3 falder altid straks" },
            { id: "c", text: "pH bliver altid høj" },
            { id: "d", text: "CO2 mister betydning" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Værdi ↔ lidelse", "Kompensation ↔ type"],
      pairsByRound: {
        1: [
          { left: "Lav pH", right: "Acidæmi" },
          { left: "Høj pH", right: "Alkalæmi" },
          { left: "Høj CO2", right: "Respiratorisk acidose" },
          { left: "Lav CO2", right: "Respiratorisk alkalose" },
          { left: "Lav HCO3", right: "Metabolisk acidose" },
          { left: "Høj HCO3", right: "Metabolisk alkalose" },
        ],
        2: [
          { left: "Metabolisk acidose", right: "Respiratorisk kompensation" },
          { left: "Respiratorisk acidose", right: "Metabolisk kompensation" },
          {
            left: "Lav CO2 ved acidose",
            right: "Hyperventilation som respons",
          },
          { left: "Høj HCO3 ved høj CO2", right: "Nyrekompensation over tid" },
          { left: "Normal pH med afvigelser", right: "Mulig kompensation" },
          {
            left: "Blandet forstyrrelse",
            right: "Værdier passer dårligt sammen",
          },
        ],
      },
    },
    word: {
      topicTitle: "Syre-base",
      easy: ["pH"],
      medium: ["Bikarbonat"],
      hard: ["Acidose"],
    },
  },

  "2026-W34": {
    title: "Psykiatri akut",
    mcq: {
      rounds: ["Angst vs psykose", "Fight-flight", "Deeskalering"],
      questions: [
        {
          id: "w34_q1",
          category: "Angst vs psykose",
          text: "Hvad kendetegner typisk et panikanfald?",
          explanation:
            "Panikanfald kan give intens frygt, hjertebanken, åndenød og svimmelhed, men realitetssansen er ofte bevaret.",
          options: [
            {
              id: "a",
              text: "Intens frygt med ofte bevaret realitetssans",
              isCorrect: true,
            },
            { id: "b", text: "Vedvarende hallucinationer uden angst" },
            { id: "c", text: "Sikker tegn på lavt blodsukker" },
            { id: "d", text: "Altid tegn på akut psykose" },
          ],
        },
        {
          id: "w34_q2",
          category: "Angst vs psykose",
          text: "Hvad kan pege mere mod psykose end angst?",
          explanation:
            "Hallucinationer, vrangforestillinger og tydeligt forstyrret realitetstestning kan pege mod psykose, men vurderes i sammenhæng.",
          options: [
            {
              id: "a",
              text: "Vrangforestillinger og forstyrret realitetstestning",
              isCorrect: true,
            },
            { id: "b", text: "Hurtig vejrtrækning efter forskrækkelse" },
            { id: "c", text: "Kortvarig hjertebanken ved stress" },
            { id: "d", text: "Svedtendens ved nervøsitet" },
          ],
        },
        {
          id: "w34_q3",
          category: "Angst vs psykose",
          text: "Hvorfor bør somatiske årsager overvejes ved akut psykisk påvirkning?",
          explanation:
            "Hypoksi, hypoglykæmi, intoxikation, infektion og neurologisk sygdom kan ligne eller forværre psykiske symptomer.",
          options: [
            {
              id: "a",
              text: "Fordi somatisk sygdom kan ligne psykisk påvirkning",
              isCorrect: true,
            },
            { id: "b", text: "Fordi psykiske symptomer aldrig er akutte" },
            { id: "c", text: "Fordi puls og saturation altid er normale" },
            { id: "d", text: "Fordi blodtryk alene stiller diagnosen" },
          ],
        },
        {
          id: "w34_q4",
          category: "Angst vs psykose",
          text: "Hvilket fund bør give særlig opmærksomhed hos en patient med uro?",
          explanation:
            "Påvirket bevidsthed, hypoksi, feber eller tegn på intoxikation kan være red flags og bør vurderes systematisk.",
          options: [
            { id: "a", text: "Påvirket bevidsthedsniveau", isCorrect: true },
            { id: "b", text: "Patienten taler hurtigt" },
            { id: "c", text: "Patienten virker bekymret" },
            { id: "d", text: "Patienten ønsker afstand" },
          ],
        },
        {
          id: "w34_q5",
          category: "Angst vs psykose",
          text: "Hvad er en hensigtsmæssig præhospital tilgang ved akut psykisk påvirkning?",
          explanation:
            "En rolig tilgang med ABCDE, sikkerhedsvurdering og respektfuld kommunikation hjælper med både somatisk og psykisk vurdering.",
          options: [
            {
              id: "a",
              text: "Rolig kontakt, ABCDE og sikkerhedsvurdering",
              isCorrect: true,
            },
            { id: "b", text: "Undgå vitalparametre for ikke at stresse" },
            { id: "c", text: "Konfronter vrangforestillinger hårdt" },
            { id: "d", text: "Antag at symptomerne kun er psykiske" },
          ],
        },
        {
          id: "w34_q6",
          category: "Fight-flight",
          text: "Hvad aktiveres især ved fight-flight-respons?",
          explanation:
            "Fight-flight-responsen er især sympatikusaktivering med adrenalin/noradrenalin, der øger kroppens alarmberedskab.",
          options: [
            { id: "a", text: "Det sympatiske nervesystem", isCorrect: true },
            { id: "b", text: "Det parasympatiske nervesystem alene" },
            { id: "c", text: "Fordøjelsessystemet som hovedrespons" },
            { id: "d", text: "Koagulationssystemet alene" },
          ],
        },
        {
          id: "w34_q7",
          category: "Fight-flight",
          text: "Hvilket symptom passer med sympatikusaktivering?",
          explanation:
            "Sympatikus kan give takykardi, svedtendens, tremor, hurtig vejrtrækning og øget muskelspænding.",
          options: [
            { id: "a", text: "Takykardi og svedtendens", isCorrect: true },
            { id: "b", text: "Langsom puls og dyb søvn" },
            { id: "c", text: "Stabil bradykardi som hovedtegn" },
            { id: "d", text: "Manglende respirationsrespons" },
          ],
        },
        {
          id: "w34_q8",
          category: "Fight-flight",
          text: "Hvorfor kan hyperventilation give prikken omkring mund og fingre?",
          explanation:
            "Hyperventilation kan sænke CO2 og påvirke calciumbinding, hvilket kan give paræstesier og svimmelhed.",
          options: [
            {
              id: "a",
              text: "Lavere CO2 kan give paræstesier",
              isCorrect: true,
            },
            { id: "b", text: "Højere CO2 giver altid følelsesløshed" },
            { id: "c", text: "Det skyldes altid stroke" },
            { id: "d", text: "Det skyldes kun lavt blodtryk" },
          ],
        },
        {
          id: "w34_q9",
          category: "Fight-flight",
          text: "Hvad kan være en vigtig differentialdiagnose ved angstlignende symptomer?",
          explanation:
            "Akut koronart syndrom, lungeemboli, hypoglykæmi, astma og intoxikation kan give symptomer, der ligner angst.",
          options: [
            { id: "a", text: "Akut koronart syndrom", isCorrect: true },
            { id: "b", text: "Ukompliceret neglesvamp" },
            { id: "c", text: "Stabil nærsynethed" },
            { id: "d", text: "Kronisk høretab alene" },
          ],
        },
        {
          id: "w34_q10",
          category: "Fight-flight",
          text: "Hvad kan hjælpe med at dæmpe fight-flight-responsen præhospitalt?",
          explanation:
            "Tryghed, rolig stemme, enkel information og mulighed for kontrol kan reducere oplevet trussel og stressrespons.",
          options: [
            {
              id: "a",
              text: "Rolig stemme og tydelig information",
              isCorrect: true,
            },
            { id: "b", text: "Hurtige bevægelser tæt på patienten" },
            { id: "c", text: "At flere taler samtidigt" },
            { id: "d", text: "At ignorere patientens bekymring" },
          ],
        },
        {
          id: "w34_q11",
          category: "Deeskalering",
          text: "Hvad er et centralt princip i verbal deeskalering?",
          explanation:
            "At tale roligt, lytte aktivt og give patienten plads kan mindske oplevelsen af trussel og øge samarbejdet.",
          options: [
            { id: "a", text: "Rolig tale og aktiv lytning", isCorrect: true },
            { id: "b", text: "Høj stemme for at overtage styringen" },
            { id: "c", text: "Ironi for at lette stemningen" },
            { id: "d", text: "At afbryde gentagne gange" },
          ],
        },
        {
          id: "w34_q12",
          category: "Deeskalering",
          text: "Hvorfor er afstand og placering vigtige ved urolig patient?",
          explanation:
            "Passende afstand og fri flugtvej kan øge sikkerheden for både patient og personale uden at virke konfronterende.",
          options: [
            {
              id: "a",
              text: "Det øger sikkerhed og mindsker trusselsfølelse",
              isCorrect: true,
            },
            { id: "b", text: "Det gør vurdering af respiration unødvendig" },
            { id: "c", text: "Det forhindrer altid vold" },
            { id: "d", text: "Det erstatter kommunikation" },
          ],
        },
        {
          id: "w34_q13",
          category: "Deeskalering",
          text: "Hvilken formulering er mest deeskalerende?",
          explanation:
            "Valgmuligheder og respektfuld tone kan give patienten oplevelse af kontrol og mindske modstand.",
          options: [
            {
              id: "a",
              text: "Vil du helst sidde her eller der, mens vi taler?",
              isCorrect: true,
            },
            { id: "b", text: "Du skal gøre præcis, som jeg siger" },
            { id: "c", text: "Stop med at være besværlig" },
            { id: "d", text: "Hvis du ikke svarer, bliver det værre" },
          ],
        },
        {
          id: "w34_q14",
          category: "Deeskalering",
          text: "Hvad bør man undgå ved paranoid eller psykotisk patient?",
          explanation:
            "Hård konfrontation af vrangforestillinger kan øge konflikt. Det er ofte bedre at anerkende oplevelsen uden at bekræfte indholdet.",
          options: [
            {
              id: "a",
              text: "At konfrontere vrangforestillinger aggressivt",
              isCorrect: true,
            },
            { id: "b", text: "At tale roligt" },
            { id: "c", text: "At forklare næste skridt" },
            { id: "d", text: "At holde passende afstand" },
          ],
        },
        {
          id: "w34_q15",
          category: "Deeskalering",
          text: "Hvad er vigtigt, hvis situationen virker truende?",
          explanation:
            "Personalets sikkerhed er central. Tilbagetrækning, overblik, hjælp og klare roller kan være nødvendigt ved risiko.",
          options: [
            {
              id: "a",
              text: "Prioritere sikkerhed og tilkalde relevant hjælp",
              isCorrect: true,
            },
            { id: "b", text: "Gå tættere på for at vise autoritet" },
            { id: "c", text: "Lukke alle udgange" },
            { id: "d", text: "Fortsætte alene uanset risiko" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Symptom ↔ tilstand", "Respons ↔ strategi"],
      pairsByRound: {
        1: [
          { left: "Hjertebanken", right: "Kan ses ved angst" },
          { left: "Hallucinationer", right: "Kan pege mod psykose" },
          {
            left: "Vrangforestillinger",
            right: "Forstyrret realitetstestning",
          },
          { left: "Hyperventilation", right: "Kan give svimmelhed" },
          { left: "Påvirket bevidsthed", right: "Somatisk red flag" },
          { left: "Paranoia", right: "Mistillid eller forfølgelsesidéer" },
        ],
        2: [
          { left: "Rolig stemme", right: "Sænker trusselsniveau" },
          { left: "Aktiv lytning", right: "Skaber kontakt" },
          { left: "Valgmuligheder", right: "Giver kontrol" },
          { left: "Passende afstand", right: "Øger sikkerhed" },
          { left: "En taler ad gangen", right: "Mindre overstimulation" },
          {
            left: "Forklar næste skridt",
            right: "Gør situationen forudsigelig",
          },
        ],
      },
    },
    word: {
      topicTitle: "Psykisk tilstand",
      easy: ["Angst"],
      medium: ["Psykose"],
      hard: ["Paranoia"],
    },
  },

  "2026-W35": {
    title: "GI-blødning",
    mcq: {
      rounds: ["Øvre vs nedre", "Tegn", "Shock-risiko"],
      questions: [
        {
          id: "w35_q1",
          category: "Øvre vs nedre",
          text: "Hvad forstås typisk ved øvre GI-blødning?",
          explanation:
            "Øvre GI-blødning kommer typisk fra spiserør, mavesæk eller duodenum og kan vise sig med hæmatemese eller melæna.",
          options: [
            {
              id: "a",
              text: "Blødning fra spiserør, mavesæk eller duodenum",
              isCorrect: true,
            },
            { id: "b", text: "Blødning fra huden omkring endetarmen alene" },
            { id: "c", text: "Blødning fra urinvejene" },
            { id: "d", text: "Blødning fra lungerne" },
          ],
        },
        {
          id: "w35_q2",
          category: "Øvre vs nedre",
          text: "Hvad kan melæna tyde på?",
          explanation:
            "Melæna er sort, tjæret afføring og kan tyde på fordøjet blod, ofte fra øvre GI-kanal, men klinikken skal vurderes samlet.",
          options: [
            { id: "a", text: "Fordøjet blod i afføringen", isCorrect: true },
            { id: "b", text: "Frisk arteriel blødning fra næsen" },
            { id: "c", text: "Blod i urinen" },
            { id: "d", text: "Normal afføring efter faste" },
          ],
        },
        {
          id: "w35_q3",
          category: "Øvre vs nedre",
          text: "Hvad kan frisk rødt blod per rectum ofte pege mod?",
          explanation:
            "Frisk rødt blod per rectum kan pege mod nedre GI-kilde, men massiv øvre blødning kan også i nogle tilfælde give frisk blod.",
          options: [
            { id: "a", text: "Nedre GI-blødning", isCorrect: true },
            { id: "b", text: "Ren respiratorisk lidelse" },
            { id: "c", text: "Sikker urinvejsinfektion" },
            { id: "d", text: "Normal fordøjelse" },
          ],
        },
        {
          id: "w35_q4",
          category: "Øvre vs nedre",
          text: "Hvad betyder hæmatemese?",
          explanation:
            "Hæmatemese betyder opkastning af blod og kan ses ved blødning fra øvre GI-kanal.",
          options: [
            { id: "a", text: "Blodigt opkast", isCorrect: true },
            { id: "b", text: "Blodig urin" },
            { id: "c", text: "Sortfarvet hud" },
            { id: "d", text: "Hoste med slim" },
          ],
        },
        {
          id: "w35_q5",
          category: "Øvre vs nedre",
          text: "Hvorfor er det vigtigt at skelne mellem hæmoptyse og hæmatemese?",
          explanation:
            "Hæmoptyse kommer fra luftveje, mens hæmatemese kommer fra GI-kanalen. De kan ligne hinanden, men peger mod forskellige årsager.",
          options: [
            {
              id: "a",
              text: "De peger mod forskellige anatomiske kilder",
              isCorrect: true,
            },
            { id: "b", text: "De behandles altid ens" },
            { id: "c", text: "Hæmoptyse er altid ufarligt" },
            { id: "d", text: "Hæmatemese kommer altid fra lungerne" },
          ],
        },
        {
          id: "w35_q6",
          category: "Tegn",
          text: "Hvilket fund kan være tegn på betydende blodtab?",
          explanation:
            "Bleg, kold og klam hud kan være tegn på sympatikusaktivering ved kredsløbspåvirkning, men skal vurderes med øvrige fund.",
          options: [
            { id: "a", text: "Bleg, kold og klam hud", isCorrect: true },
            { id: "b", text: "Normal hudfarve alene" },
            { id: "c", text: "Let tør hoste" },
            { id: "d", text: "Isoleret ørekløe" },
          ],
        },
        {
          id: "w35_q7",
          category: "Tegn",
          text: "Hvilket vitalparameterfund kan være tidligt tegn på kompensation ved blødning?",
          explanation:
            "Takykardi kan være et tidligt kompensatorisk tegn ved blodtab, før blodtrykket nødvendigvis falder.",
          options: [
            { id: "a", text: "Takykardi", isCorrect: true },
            { id: "b", text: "Bradykardi hos alle patienter" },
            { id: "c", text: "Meget lav respirationsfrekvens som eneste tegn" },
            { id: "d", text: "Normal temperatur som bevis" },
          ],
        },
        {
          id: "w35_q8",
          category: "Tegn",
          text: "Hvad kan kaffegrumslignende opkast tyde på?",
          explanation:
            "Kaffegrumslignende opkast kan tyde på blod, der har været påvirket af mavesyre, ofte ved øvre GI-blødning.",
          options: [
            { id: "a", text: "Blod påvirket af mavesyre", isCorrect: true },
            { id: "b", text: "Udelukkende galde" },
            { id: "c", text: "Frisk blod fra urinvejene" },
            { id: "d", text: "Normal fordøjelseslyd" },
          ],
        },
        {
          id: "w35_q9",
          category: "Tegn",
          text: "Hvilket symptom kan ses ved kredsløbspåvirkning fra GI-blødning?",
          explanation:
            "Svimmelhed, synkope eller nær-synkope kan ses ved nedsat cerebral perfusion ved betydende blodtab.",
          options: [
            { id: "a", text: "Svimmelhed eller synkope", isCorrect: true },
            { id: "b", text: "Forbedret kondition" },
            { id: "c", text: "Isoleret tandpine" },
            { id: "d", text: "Øget hårvækst" },
          ],
        },
        {
          id: "w35_q10",
          category: "Tegn",
          text: "Hvilken oplysning er særlig relevant ved mistanke om GI-blødning?",
          explanation:
            "Antikoagulerende medicin kan øge blødningsrisiko og er vigtig information ved vurdering og overlevering.",
          options: [
            {
              id: "a",
              text: "Brug af blodfortyndende medicin",
              isCorrect: true,
            },
            { id: "b", text: "Foretrukken kaffetype" },
            { id: "c", text: "Skostørrelse" },
            { id: "d", text: "Tidligere øjenfarve" },
          ],
        },
        {
          id: "w35_q11",
          category: "Shock-risiko",
          text: "Hvorfor kan blodtrykket være normalt tidligt ved blødning?",
          explanation:
            "Kroppen kan kompensere med øget puls og vasokonstriktion, så blodtrykket først falder senere ved betydende blodtab.",
          options: [
            {
              id: "a",
              text: "Kompensation kan bevare blodtrykket i starten",
              isCorrect: true,
            },
            { id: "b", text: "Blodtryk påvirkes aldrig af blødning" },
            { id: "c", text: "Blødning giver altid hypertension" },
            { id: "d", text: "Normal BT udelukker alvorlig blødning" },
          ],
        },
        {
          id: "w35_q12",
          category: "Shock-risiko",
          text: "Hvilket samlet billede øger bekymring for hypovolæmisk shock?",
          explanation:
            "Takykardi, hypotension, koldsved, påvirket bevidsthed og svimmelhed kan samlet pege mod alvorlig kredsløbspåvirkning.",
          options: [
            {
              id: "a",
              text: "Takykardi, hypotension og koldsved",
              isCorrect: true,
            },
            { id: "b", text: "Normal puls og god almentilstand alene" },
            { id: "c", text: "Let sult uden andre symptomer" },
            { id: "d", text: "Isoleret hudkløe" },
          ],
        },
        {
          id: "w35_q13",
          category: "Shock-risiko",
          text: "Hvorfor er mental påvirkning relevant ved GI-blødning?",
          explanation:
            "Uro, konfusion eller sløvhed kan være tegn på nedsat perfusion eller anden alvorlig påvirkning og bør tages alvorligt.",
          options: [
            {
              id: "a",
              text: "Det kan tyde på nedsat perfusion",
              isCorrect: true,
            },
            { id: "b", text: "Det udelukker kredsløbspåvirkning" },
            { id: "c", text: "Det skyldes altid primær psykiatri" },
            { id: "d", text: "Det har ingen klinisk betydning" },
          ],
        },
        {
          id: "w35_q14",
          category: "Shock-risiko",
          text: "Hvilken patientgruppe kan have øget risiko ved GI-blødning?",
          explanation:
            "Ældre, multisyge og patienter på antikoagulation kan have større risiko for alvorligt forløb eller atypisk præsentation.",
          options: [
            {
              id: "a",
              text: "Ældre eller patienter på antikoagulation",
              isCorrect: true,
            },
            { id: "b", text: "Kun unge raske uden medicin" },
            { id: "c", text: "Kun patienter med hoste" },
            { id: "d", text: "Kun patienter uden tidligere sygdom" },
          ],
        },
        {
          id: "w35_q15",
          category: "Shock-risiko",
          text: "Hvad er vigtigt i præhospital vurdering af GI-blødning?",
          explanation:
            "Systematisk ABCDE, vitalparametre, blødningshistorik, medicin og udvikling over tid er centrale elementer i vurderingen.",
          options: [
            {
              id: "a",
              text: "ABCDE, vitalparametre og blødningshistorik",
              isCorrect: true,
            },
            { id: "b", text: "Kun afføringens farve" },
            { id: "c", text: "Kun patientens alder" },
            { id: "d", text: "Kun ét blodtryk uden gentagelse" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Farve ↔ kilde", "Symptom ↔ årsag"],
      pairsByRound: {
        1: [
          { left: "Sort tjæret afføring", right: "Mulig øvre GI-blødning" },
          { left: "Frisk rødt blod", right: "Ofte nedre kilde" },
          { left: "Kaffegrums-opkast", right: "Blod påvirket af mavesyre" },
          { left: "Blodigt opkast", right: "Hæmatemese" },
          { left: "Mørkerødt blod", right: "Kan være større blødning" },
          { left: "Bleg hud", right: "Mulig kredsløbspåvirkning" },
        ],
        2: [
          { left: "Svimmelhed", right: "Nedsat perfusion" },
          { left: "Takykardi", right: "Kompensation ved blodtab" },
          { left: "Koldsved", right: "Sympatikusrespons" },
          { left: "Hypotension", right: "Mulig dekompensation" },
          { left: "Konfusion", right: "Mulig cerebral hypoperfusion" },
          { left: "Antikoagulation", right: "Øget blødningsrisiko" },
        ],
      },
    },
    word: {
      topicTitle: "GI-blødning",
      easy: ["Sort afføring"],
      medium: ["Hæmatemese"],
      hard: ["Hypovolæmi"],
    },
  },

  "2026-W36": {
    title: "Kramper",
    mcq: {
      rounds: ["Epilepsi", "Hypoksi", "Postiktal fase"],
      questions: [
        {
          id: "w36_q1",
          category: "Epilepsi",
          text: "Hvad er et epileptisk anfald?",
          explanation:
            "Et epileptisk anfald skyldes abnorm elektrisk aktivitet i hjernen og kan give motoriske, sensoriske eller bevidsthedsmæssige symptomer.",
          options: [
            {
              id: "a",
              text: "Abnorm elektrisk aktivitet i hjernen",
              isCorrect: true,
            },
            { id: "b", text: "Kun muskelømhed efter sport" },
            { id: "c", text: "Altid en psykisk reaktion" },
            { id: "d", text: "Kun lavt blodtryk" },
          ],
        },
        {
          id: "w36_q2",
          category: "Epilepsi",
          text: "Hvad betyder tonisk-klonisk anfald?",
          explanation:
            "Tonisk fase indebærer stivhed, mens klonisk fase indebærer rytmiske ryk. Bevidstheden er ofte påvirket.",
          options: [
            {
              id: "a",
              text: "Stivhed efterfulgt af rytmiske ryk",
              isCorrect: true,
            },
            { id: "b", text: "Kun kortvarig svimmelhed uden ryk" },
            { id: "c", text: "Kun smerter i brystet" },
            { id: "d", text: "Normal søvnfase" },
          ],
        },
        {
          id: "w36_q3",
          category: "Epilepsi",
          text: "Hvilken oplysning er særlig relevant ved kendt epilepsi?",
          explanation:
            "Kendt anfaldsmønster, medicin, efterlevelse, anfaldsvarighed og udløsende faktorer er relevante i vurdering og overlevering.",
          options: [
            {
              id: "a",
              text: "Vanligt anfaldsmønster og medicin",
              isCorrect: true,
            },
            { id: "b", text: "Patientens yndlingsmad" },
            { id: "c", text: "Skostørrelse" },
            { id: "d", text: "Sidste tandlægebesøg alene" },
          ],
        },
        {
          id: "w36_q4",
          category: "Epilepsi",
          text: "Hvad er status epilepticus en betegnelse for?",
          explanation:
            "Status epilepticus bruges om langvarige eller gentagne anfald uden tilstrækkelig restitution og er en alvorlig tilstand.",
          options: [
            {
              id: "a",
              text: "Langvarige eller gentagne anfald uden restitution",
              isCorrect: true,
            },
            { id: "b", text: "Et enkelt nys" },
            { id: "c", text: "Normal søvn efter træning" },
            { id: "d", text: "Kortvarig hikke" },
          ],
        },
        {
          id: "w36_q5",
          category: "Epilepsi",
          text: "Hvad er vigtigt at observere under et krampeanfald?",
          explanation:
            "Varighed, type af bevægelser, bevidsthed, cyanose, traumer og udvikling efter anfaldet er vigtige observationer.",
          options: [
            {
              id: "a",
              text: "Varighed, bevægelser og bevidsthed",
              isCorrect: true,
            },
            { id: "b", text: "Kun patientens hårfarve" },
            { id: "c", text: "Kun rummets temperatur" },
            { id: "d", text: "Kun om pårørende er rolige" },
          ],
        },
        {
          id: "w36_q6",
          category: "Hypoksi",
          text: "Hvordan kan hypoksi relatere sig til kramper?",
          explanation:
            "Lav ilttilførsel til hjernen kan udløse kramper eller krampe-lignende bevægelser, især ved alvorlig påvirkning.",
          options: [
            { id: "a", text: "Hypoksi kan udløse kramper", isCorrect: true },
            { id: "b", text: "Hypoksi beskytter altid mod kramper" },
            { id: "c", text: "Hypoksi påvirker kun huden" },
            { id: "d", text: "Hypoksi giver kun feber" },
          ],
        },
        {
          id: "w36_q7",
          category: "Hypoksi",
          text: "Hvilket fund kan pege mod hypoksi hos en krampepatient?",
          explanation:
            "Cyanose, lav saturation, respirationsbesvær eller manglende frie luftveje kan pege mod hypoksi.",
          options: [
            { id: "a", text: "Cyanose og lav saturation", isCorrect: true },
            { id: "b", text: "Normal vejrtrækning med sikkerhed" },
            { id: "c", text: "Isoleret kløe" },
            { id: "d", text: "Forbedret tale under anfald" },
          ],
        },
        {
          id: "w36_q8",
          category: "Hypoksi",
          text: "Hvorfor er luftvej og respiration centrale ved kramper?",
          explanation:
            "Under og efter anfald kan luftvejen være truet af sekret, opkast, tungefald eller nedsat respirationsdrive.",
          options: [
            {
              id: "a",
              text: "Luftvej og respiration kan være kompromitteret",
              isCorrect: true,
            },
            { id: "b", text: "Respiration er irrelevant ved kramper" },
            { id: "c", text: "Anfald forbedrer altid ventilation" },
            { id: "d", text: "Saturation er altid normal" },
          ],
        },
        {
          id: "w36_q9",
          category: "Hypoksi",
          text: "Hvilken anden akut årsag bør overvejes ved kramper?",
          explanation:
            "Hypoglykæmi er en vigtig reversibel årsag til kramper og bevidsthedspåvirkning og bør indgå i vurderingen.",
          options: [
            { id: "a", text: "Hypoglykæmi", isCorrect: true },
            { id: "b", text: "Stabil nærsynethed" },
            { id: "c", text: "Tør hud uden andre symptomer" },
            { id: "d", text: "Gammel tandfyldning" },
          ],
        },
        {
          id: "w36_q10",
          category: "Hypoksi",
          text: "Hvad kan krampe-lignende bevægelser ved hjertestop betyde?",
          explanation:
            "Kortvarige krampe-lignende bevægelser kan ses ved cerebral hypoksi tidligt i hjertestop og bør ikke forsinke vurdering af livstegn.",
          options: [
            {
              id: "a",
              text: "Cerebral hypoksi kan give krampe-lignende bevægelser",
              isCorrect: true,
            },
            { id: "b", text: "Det udelukker hjertestop" },
            { id: "c", text: "Det betyder altid kendt epilepsi" },
            { id: "d", text: "Det viser normal cirkulation" },
          ],
        },
        {
          id: "w36_q11",
          category: "Postiktal fase",
          text: "Hvad betyder postiktal fase?",
          explanation:
            "Postiktal fase er perioden efter et anfald, hvor patienten kan være konfus, træt, desorienteret eller have hovedpine.",
          options: [
            { id: "a", text: "Perioden efter et anfald", isCorrect: true },
            { id: "b", text: "Fasen før enhver infektion" },
            { id: "c", text: "Normal vågenhed under anfald" },
            { id: "d", text: "Kun en type hjertestop" },
          ],
        },
        {
          id: "w36_q12",
          category: "Postiktal fase",
          text: "Hvilket symptom er almindeligt postiktalt?",
          explanation:
            "Træthed og konfusion er almindelige efter generaliserede anfald, men varighed og udvikling bør observeres.",
          options: [
            { id: "a", text: "Træthed og konfusion", isCorrect: true },
            { id: "b", text: "Øjeblikkelig fuld orientering hos alle" },
            { id: "c", text: "Forbedret hukommelse" },
            { id: "d", text: "Altid feber" },
          ],
        },
        {
          id: "w36_q13",
          category: "Postiktal fase",
          text: "Hvorfor er gentagen vurdering vigtig efter kramper?",
          explanation:
            "Bevidsthed, respiration og neurologiske fund kan ændre sig, og manglende bedring kan pege mod anden eller alvorlig årsag.",
          options: [
            {
              id: "a",
              text: "Tilstanden kan ændre sig efter anfaldet",
              isCorrect: true,
            },
            { id: "b", text: "Første indtryk er altid nok" },
            { id: "c", text: "Vitalparametre er uden betydning" },
            { id: "d", text: "Postiktal fase udelukker hypoksi" },
          ],
        },
        {
          id: "w36_q14",
          category: "Postiktal fase",
          text: "Hvilket fund efter anfald bør give ekstra opmærksomhed?",
          explanation:
            "Vedvarende fokale neurologiske udfald, svær hovedpine, traume, feber eller manglende opvågning kan være red flags.",
          options: [
            {
              id: "a",
              text: "Vedvarende fokalt neurologisk udfald",
              isCorrect: true,
            },
            { id: "b", text: "Kortvarig træthed alene" },
            { id: "c", text: "At patienten husker lidt uklart" },
            { id: "d", text: "At patienten ønsker ro" },
          ],
        },
        {
          id: "w36_q15",
          category: "Postiktal fase",
          text: "Hvad er relevant at spørge vidner om efter et krampeanfald?",
          explanation:
            "Vidner kan beskrive start, varighed, bevægelser, cyanose, traume og restitution, som patienten ofte ikke selv husker.",
          options: [
            {
              id: "a",
              text: "Start, varighed, bevægelser og restitution",
              isCorrect: true,
            },
            { id: "b", text: "Patientens yndlingsfilm" },
            { id: "c", text: "Farven på ambulancen" },
            { id: "d", text: "Om vejret var godt" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Fase ↔ kendetegn", "Årsag ↔ type"],
      pairsByRound: {
        1: [
          { left: "Tonisk fase", right: "Stivhed" },
          { left: "Klonisk fase", right: "Rytmiske ryk" },
          { left: "Iktal fase", right: "Selve anfaldet" },
          { left: "Postiktal fase", right: "Træthed og konfusion" },
          { left: "Aura", right: "Muligt forvarsel" },
          { left: "Restitution", right: "Gradvis bedring" },
        ],
        2: [
          { left: "Epilepsi", right: "Neurologisk anfaldstendens" },
          { left: "Hypoksi", right: "Lav ilttilførsel til hjernen" },
          { left: "Hypoglykæmi", right: "Metabolisk årsag" },
          { left: "Feber hos barn", right: "Feberkrampe-mistanke" },
          { left: "Intoxikation", right: "Toksisk årsag" },
          { left: "Hovedtraume", right: "Strukturel årsag" },
        ],
      },
    },
    word: {
      topicTitle: "Kramper",
      easy: ["Ryk"],
      medium: ["Tonisk"],
      hard: ["Postiktal"],
    },
  },
  "2026-W37": {
    title: "Forbrændinger",
    mcq: {
      rounds: ["Hudlag", "Væsketab", "ABCDE"],
      questions: [
        {
          id: "w37_q1",
          category: "Hudlag",
          text: "Hvilket hudlag ligger yderst?",
          explanation:
            "Epidermis er hudens yderste lag og fungerer som barriere mod blandt andet væsketab, mikroorganismer og mekanisk påvirkning.",
          options: [
            { id: "a", text: "Epidermis", isCorrect: true },
            { id: "b", text: "Dermis" },
            { id: "c", text: "Subcutis" },
            { id: "d", text: "Fascie" },
          ],
        },
        {
          id: "w37_q2",
          category: "Hudlag",
          text: "Hvilket hudlag indeholder blandt andet blodkar, nerver og svedkirtler?",
          explanation:
            "Dermis indeholder kar, nerver, hårfollikler og kirtler. Skader her kan give smerte, blærer og påvirket temperaturregulering.",
          options: [
            { id: "a", text: "Epidermis" },
            { id: "b", text: "Dermis", isCorrect: true },
            { id: "c", text: "Hornlaget alene" },
            { id: "d", text: "Knoglehinden" },
          ],
        },
        {
          id: "w37_q3",
          category: "Hudlag",
          text: "Hvad tyder blæredannelse typisk på ved en forbrænding?",
          explanation:
            "Blærer ses ofte ved delhudsskader, hvor epidermis og dele af dermis er påvirket. Dybden kan dog ikke vurderes sikkert ud fra blærer alene.",
          options: [
            { id: "a", text: "At huden med sikkerhed er uskadet" },
            { id: "b", text: "En delhudsskade", isCorrect: true },
            { id: "c", text: "Isoleret knogleskade" },
            { id: "d", text: "Primært en neurologisk skade" },
          ],
        },
        {
          id: "w37_q4",
          category: "Hudlag",
          text: "Hvilket fund kan pege mod en dyb forbrænding?",
          explanation:
            "Voksagtig, læderagtig eller sort hud med nedsat smerte kan pege mod dyb skade, fordi nerveender kan være ødelagt.",
          options: [
            { id: "a", text: "Kun let rødme efter sol" },
            {
              id: "b",
              text: "Læderagtig hud med nedsat følesans",
              isCorrect: true,
            },
            { id: "c", text: "Normal hudtemperatur og ingen smerter" },
            { id: "d", text: "Kortvarig kløe uden hudforandring" },
          ],
        },
        {
          id: "w37_q5",
          category: "Hudlag",
          text: "Hvorfor kan dybe forbrændinger gøre mindre ondt end overfladiske?",
          explanation:
            "Ved dybe forbrændinger kan sensoriske nerveender være beskadigede, så smerteoplevelsen kan være mindre trods alvorlig vævsskade.",
          options: [
            { id: "a", text: "Fordi skaden altid er ufarlig" },
            {
              id: "b",
              text: "Fordi nerveender kan være ødelagt",
              isCorrect: true,
            },
            { id: "c", text: "Fordi blodtrykket altid stiger" },
            { id: "d", text: "Fordi huden producerer mere ilt" },
          ],
        },
        {
          id: "w37_q6",
          category: "Væsketab",
          text: "Hvorfor kan større forbrændinger give betydeligt væsketab?",
          explanation:
            "Forbrændinger kan øge kapillærpermeabiliteten og ødelægge hudbarrieren, så væske forskydes ud i væv og fordamper fra såroverfladen.",
          options: [
            { id: "a", text: "Fordi huden bliver mere tæt" },
            {
              id: "b",
              text: "Fordi kapillærer bliver mere permeable",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Fordi nyrerne stopper al urinproduktion med det samme",
            },
            { id: "d", text: "Fordi lungerne optager mindre kvælstof" },
          ],
        },
        {
          id: "w37_q7",
          category: "Væsketab",
          text: "Hvilket kredsløbsproblem kan udvikles ved omfattende forbrændinger?",
          explanation:
            "Større væsketab og væskeforskydning kan reducere cirkulerende volumen og bidrage til hypovolæmisk shock.",
          options: [
            { id: "a", text: "Hypovolæmisk shock", isCorrect: true },
            { id: "b", text: "Isoleret hypertension uden risiko" },
            { id: "c", text: "Kun langsom puls" },
            { id: "d", text: "Akut hypercalcæmi som hovedproblem" },
          ],
        },
        {
          id: "w37_q8",
          category: "Væsketab",
          text: "Hvilket tegn kan være foreneligt med begyndende kredsløbspåvirkning efter forbrænding?",
          explanation:
            "Takykardi, bleghed, kølig hud og påvirket bevidsthed kan være tegn på kredsløbspåvirkning, men skal vurderes i samlet klinisk kontekst.",
          options: [
            { id: "a", text: "Stabil puls og normal kapillærrespons" },
            { id: "b", text: "Takykardi og bleg, kølig hud", isCorrect: true },
            { id: "c", text: "Kun lokal rødme på én finger" },
            { id: "d", text: "Normal mental status udelukker væsketab" },
          ],
        },
        {
          id: "w37_q9",
          category: "Væsketab",
          text: "Hvorfor er forbrændingens udbredelse vigtig i vurderingen?",
          explanation:
            "Udbredelsen påvirker risikoen for væsketab, hypotermi og systemisk belastning. Den bruges som del af den samlede vurdering.",
          options: [
            { id: "a", text: "Den afgør alene patientens prognose" },
            {
              id: "b",
              text: "Den påvirker risikoen for systemisk væsketab",
              isCorrect: true,
            },
            { id: "c", text: "Den er kun relevant ved elektriske skader" },
            { id: "d", text: "Den erstatter ABCDE-vurdering" },
          ],
        },
        {
          id: "w37_q10",
          category: "Væsketab",
          text: "Hvilken patientgruppe kan være særligt sårbar ved forbrændinger?",
          explanation:
            "Børn og ældre kan have mindre fysiologisk reserve og anderledes forhold mellem kropsoverflade og volumen, hvilket kan øge risikoen ved væsketab og temperaturpåvirkning.",
          options: [
            { id: "a", text: "Kun raske unge voksne" },
            { id: "b", text: "Børn og ældre", isCorrect: true },
            { id: "c", text: "Kun patienter uden smerter" },
            { id: "d", text: "Kun patienter med briller" },
          ],
        },
        {
          id: "w37_q11",
          category: "ABCDE",
          text: "Hvad bør give mistanke om inhalationsskade hos en forbrændingspatient?",
          explanation:
            "Sod omkring mund/næse, hæshed, hoste, stridor eller forbrænding i lukket rum kan give mistanke om inhalationsskade og kræver opmærksom luftvejsvurdering.",
          options: [
            { id: "a", text: "Sod omkring mund og hæshed", isCorrect: true },
            { id: "b", text: "Isoleret rødme på underarmen" },
            { id: "c", text: "Kløe på ryggen uden eksponering" },
            { id: "d", text: "Normal tale udelukker alle luftvejsproblemer" },
          ],
        },
        {
          id: "w37_q12",
          category: "ABCDE",
          text: "Hvilken del af ABCDE handler primært om frie luftveje?",
          explanation:
            "A står for airway og handler om at vurdere, om luftvejen er fri, truet eller kompromitteret.",
          options: [
            { id: "a", text: "A", isCorrect: true },
            { id: "b", text: "B" },
            { id: "c", text: "C" },
            { id: "d", text: "E" },
          ],
        },
        {
          id: "w37_q13",
          category: "ABCDE",
          text: "Hvorfor er hypotermi relevant ved forbrændinger?",
          explanation:
            "Skadet hud mister varme lettere, og afkøling samt eksponering kan øge risikoen for hypotermi, især ved større forbrændinger.",
          options: [
            { id: "a", text: "Forbrændinger gør altid patienten febril" },
            { id: "b", text: "Skadet hud kan øge varmetab", isCorrect: true },
            { id: "c", text: "Hypotermi kan ikke opstå ved brandskader" },
            { id: "d", text: "Kun elektriske skader påvirker temperatur" },
          ],
        },
        {
          id: "w37_q14",
          category: "ABCDE",
          text: "Hvilket fokus hører især til C i ABCDE ved større forbrænding?",
          explanation:
            "C omfatter kredsløbsvurdering med puls, hud, kapillærrespons, blodtryk og tegn på shock eller blødning.",
          options: [
            { id: "a", text: "Synsskarphed" },
            { id: "b", text: "Kredsløb og tegn på shock", isCorrect: true },
            { id: "c", text: "Hudfarve som eneste parameter" },
            { id: "d", text: "Kun temperaturmåling" },
          ],
        },
        {
          id: "w37_q15",
          category: "ABCDE",
          text: "Hvorfor er E vigtigt ved forbrændingspatienten?",
          explanation:
            "E handler om eksponering og omgivelser. Man skal kunne vurdere skadernes udbredelse, men samtidig begrænse varmetab og bevare værdighed.",
          options: [
            {
              id: "a",
              text: "For at vurdere udbredelse og forebygge varmetab",
              isCorrect: true,
            },
            { id: "b", text: "For at undgå at se huden" },
            { id: "c", text: "For at springe A til D over" },
            { id: "d", text: "For at diagnosticere skadedybde sikkert alene" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Grad ↔ dybde", "Symptom ↔ skade"],
      pairsByRound: {
        1: [
          { left: "1. grad", right: "Overfladisk epidermisskade" },
          { left: "2. grad", right: "Delhudsskade med blærer" },
          { left: "3. grad", right: "Fuldhudsskade" },
          { left: "Rød og smertefuld hud", right: "Typisk overfladisk skade" },
          { left: "Læderagtig hud", right: "Kan pege mod dyb skade" },
          { left: "Nedsat følesans", right: "Kan skyldes nerveskade" },
        ],
        2: [
          { left: "Hæshed", right: "Mulig inhalationsskade" },
          { left: "Sod i ansigtet", right: "Røg- eller varmeeksponering" },
          { left: "Takykardi", right: "Kan ses ved smerte eller shock" },
          { left: "Blærer", right: "Tegn på delhudsskade" },
          { left: "Bleg og kølig hud", right: "Mulig kredsløbspåvirkning" },
          { left: "Lav bevidsthed", right: "Rødt flag i ABCDE" },
        ],
      },
    },
    word: {
      topicTitle: "Forbrænding",
      easy: ["Hud"],
      medium: ["Blære"],
      hard: ["Nekrose"],
    },
  },

  "2026-W38": {
    title: "Temperaturforstyrrelser",
    mcq: {
      rounds: ["Hypotermi", "Hypertermi", "Metabolisme"],
      questions: [
        {
          id: "w38_q1",
          category: "Hypotermi",
          text: "Hvad betyder hypotermi?",
          explanation:
            "Hypotermi betyder lav kernetemperatur. Tilstanden kan påvirke bevidsthed, respiration, kredsløb og koagulation.",
          options: [
            { id: "a", text: "For lav kernetemperatur", isCorrect: true },
            { id: "b", text: "For høj puls alene" },
            { id: "c", text: "For højt blodsukker" },
            { id: "d", text: "For lav iltmætning uanset årsag" },
          ],
        },
        {
          id: "w38_q2",
          category: "Hypotermi",
          text: "Hvilket tidligt tegn kan ses ved mild hypotermi?",
          explanation:
            "Kulderystelser er kroppens forsøg på at producere varme gennem muskelaktivitet og ses typisk tidligt i forløbet.",
          options: [
            { id: "a", text: "Kulderystelser", isCorrect: true },
            { id: "b", text: "Total muskelparalyse" },
            { id: "c", text: "Kraftig sved uden kuldeeksponering" },
            { id: "d", text: "Smertefri sort hud" },
          ],
        },
        {
          id: "w38_q3",
          category: "Hypotermi",
          text: "Hvorfor er bevidsthedsniveau vigtigt ved mistænkt hypotermi?",
          explanation:
            "Faldende kernetemperatur kan påvirke hjernen og give konfusion, sløvhed eller bevidsthedspåvirkning. Det bør vurderes sammen med ABCDE.",
          options: [
            {
              id: "a",
              text: "Fordi konfusion kan være et alvorligt tegn",
              isCorrect: true,
            },
            { id: "b", text: "Fordi normal bevidsthed udelukker hypotermi" },
            { id: "c", text: "Fordi hypotermi kun påvirker huden" },
            { id: "d", text: "Fordi temperatur ikke kan påvirke hjernen" },
          ],
        },
        {
          id: "w38_q4",
          category: "Hypotermi",
          text: "Hvilken kredsløbspåvirkning kan ses ved svær hypotermi?",
          explanation:
            "Svær hypotermi kan give langsom puls, rytmeforstyrrelser og nedsat kredsløbsfunktion. Patienten skal håndteres skånsomt i træningskontekst.",
          options: [
            {
              id: "a",
              text: "Rytmeforstyrrelser og langsom puls",
              isCorrect: true,
            },
            { id: "b", text: "Altid svært forhøjet blodtryk" },
            { id: "c", text: "Kun hurtig vejrtrækning" },
            { id: "d", text: "Ingen påvirkning af hjertet" },
          ],
        },
        {
          id: "w38_q5",
          category: "Hypotermi",
          text: "Hvilken faktor kan øge risikoen for hypotermi præhospitalt?",
          explanation:
            "Våd hud, vind, immobilitet, alkoholpåvirkning og traume kan øge varmetab eller nedsætte kroppens kompensation.",
          options: [
            { id: "a", text: "Våd hud og vindeksponering", isCorrect: true },
            { id: "b", text: "Tørt tøj i varmt rum" },
            { id: "c", text: "Let motion i normal temperatur" },
            { id: "d", text: "Kortvarig hvile under tæppe" },
          ],
        },
        {
          id: "w38_q6",
          category: "Hypertermi",
          text: "Hvad betyder hypertermi?",
          explanation:
            "Hypertermi betyder forhøjet kropstemperatur på grund af utilstrækkelig varmeafgivelse eller øget varmebelastning, ikke nødvendigvis infektion.",
          options: [
            { id: "a", text: "Forhøjet kropstemperatur", isCorrect: true },
            { id: "b", text: "For lav kernetemperatur" },
            { id: "c", text: "Lavt blodsukker" },
            { id: "d", text: "Isoleret lav respirationsfrekvens" },
          ],
        },
        {
          id: "w38_q7",
          category: "Hypertermi",
          text: "Hvad adskiller hypertermi fra feber?",
          explanation:
            "Feber skyldes typisk ændret temperatur-setpoint ved inflammation, mens hypertermi skyldes varmebelastning eller svigtende varmeafgivelse.",
          options: [
            {
              id: "a",
              text: "Hypertermi skyldes typisk varmebelastning eller nedsat varmeafgivelse",
              isCorrect: true,
            },
            { id: "b", text: "Hypertermi er altid infektion" },
            { id: "c", text: "Feber og hypertermi er altid præcis det samme" },
            { id: "d", text: "Feber giver aldrig påvirket almentilstand" },
          ],
        },
        {
          id: "w38_q8",
          category: "Hypertermi",
          text: "Hvilket fund kan være bekymrende ved varmepåvirkning?",
          explanation:
            "Påvirket bevidsthed ved høj temperatur kan være et alvorligt tegn og bør vurderes systematisk sammen med ABCDE.",
          options: [
            { id: "a", text: "Påvirket bevidsthed", isCorrect: true },
            { id: "b", text: "Kortvarig tørst alene" },
            { id: "c", text: "Normal hudfarve alene" },
            { id: "d", text: "Sved udelukker alvorlig tilstand" },
          ],
        },
        {
          id: "w38_q9",
          category: "Hypertermi",
          text: "Hvorfor kan fysisk arbejde i varme omgivelser give temperaturproblemer?",
          explanation:
            "Muskelarbejde producerer varme, og varme omgivelser kan hæmme varmeafgivelse. Risikoen øges ved dehydrering og høj luftfugtighed.",
          options: [
            {
              id: "a",
              text: "Fordi muskelarbejde øger varmeproduktionen",
              isCorrect: true,
            },
            { id: "b", text: "Fordi muskler ikke bruger energi" },
            { id: "c", text: "Fordi sved altid afkøler fuldt effektivt" },
            { id: "d", text: "Fordi varmetab gennem huden stopper permanent" },
          ],
        },
        {
          id: "w38_q10",
          category: "Hypertermi",
          text: "Hvilken observation er relevant ved mistanke om alvorlig varmepåvirkning?",
          explanation:
            "Respiration, kredsløb, temperatur, hud, bevidsthed og eksponering bør vurderes samlet. Enkeltfund kan være usikre alene.",
          options: [
            {
              id: "a",
              text: "Bevidsthed, kredsløb og eksponering",
              isCorrect: true,
            },
            { id: "b", text: "Kun øjenfarve" },
            { id: "c", text: "Kun om patienten sveder" },
            { id: "d", text: "Kun patientens højde" },
          ],
        },
        {
          id: "w38_q11",
          category: "Metabolisme",
          text: "Hvad sker der typisk med enzymaktivitet ved ekstreme temperaturer?",
          explanation:
            "Kroppens enzymer fungerer bedst inden for et snævert temperaturinterval. Ekstreme temperaturer kan forstyrre cellulær funktion.",
          options: [
            { id: "a", text: "Den kan forstyrres", isCorrect: true },
            { id: "b", text: "Den bliver altid perfekt" },
            { id: "c", text: "Den er uafhængig af temperatur" },
            { id: "d", text: "Den stopper kun i knoglevæv" },
          ],
        },
        {
          id: "w38_q12",
          category: "Metabolisme",
          text: "Hvorfor kan kulderystelser øge iltforbruget?",
          explanation:
            "Kulderystelser er muskelaktivitet. Muskelarbejde kræver ATP og øger derfor både energiforbrug og iltbehov.",
          options: [
            {
              id: "a",
              text: "Fordi muskler arbejder og bruger ATP",
              isCorrect: true,
            },
            { id: "b", text: "Fordi leveren holder op med at virke" },
            { id: "c", text: "Fordi ilt ikke bruges ved muskelarbejde" },
            { id: "d", text: "Fordi lungerne producerer glukose" },
          ],
        },
        {
          id: "w38_q13",
          category: "Metabolisme",
          text: "Hvilken mekanisme hjælper kroppen med at afgive varme?",
          explanation:
            "Vasodilatation i huden øger blodgennemstrømningen tæt på overfladen og kan hjælpe kroppen med at afgive varme.",
          options: [
            { id: "a", text: "Vasodilatation i huden", isCorrect: true },
            { id: "b", text: "Total lukning af hudens blodkar" },
            { id: "c", text: "Nedsat svedproduktion ved varme" },
            { id: "d", text: "Ingen ændring i kredsløbet" },
          ],
        },
        {
          id: "w38_q14",
          category: "Metabolisme",
          text: "Hvilken mekanisme hjælper kroppen med at bevare varme?",
          explanation:
            "Vasokonstriktion i huden mindsker blodgennemstrømningen ved overfladen og kan reducere varmetab.",
          options: [
            { id: "a", text: "Vasokonstriktion i huden", isCorrect: true },
            { id: "b", text: "Øget svedproduktion i kulde" },
            { id: "c", text: "Mere varmeafgivelse gennem vådt tøj" },
            { id: "d", text: "Øget fordampning fra huden" },
          ],
        },
        {
          id: "w38_q15",
          category: "Metabolisme",
          text: "Hvorfor kan temperaturforstyrrelser påvirke respirationen?",
          explanation:
            "Ændret metabolisme, acidose, stressrespons eller CNS-påvirkning kan ændre respirationsmønsteret ved både kulde- og varmebelastning.",
          options: [
            {
              id: "a",
              text: "Fordi metabolisme og CNS kan påvirkes",
              isCorrect: true,
            },
            { id: "b", text: "Fordi respiration kun styres af hudtemperatur" },
            { id: "c", text: "Fordi lungerne ikke reagerer på stress" },
            { id: "d", text: "Fordi temperatur aldrig påvirker vejrtrækning" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Temp ↔ effekt", "Tilstand ↔ mekanisme"],
      pairsByRound: {
        1: [
          { left: "Lav kernetemperatur", right: "Kan give konfusion" },
          { left: "Svær kulde", right: "Kan give arytmier" },
          { left: "Høj temperatur", right: "Øger metabolisk belastning" },
          { left: "Varm hud", right: "Kan ses ved varmeafgivelse" },
          { left: "Kulderystelser", right: "Øger varmeproduktion" },
          { left: "Ekstrem temperatur", right: "Kan forstyrre enzymer" },
        ],
        2: [
          { left: "Hypotermi", right: "Varmetab overstiger produktion" },
          { left: "Hypertermi", right: "Varmeafgivelse er utilstrækkelig" },
          { left: "Feber", right: "Ændret temperatur-setpoint" },
          { left: "Dehydrering", right: "Kan hæmme svedrespons" },
          { left: "Vasokonstriktion", right: "Reducerer varmetab" },
          { left: "Vasodilatation", right: "Øger varmeafgivelse" },
        ],
      },
    },
    word: {
      topicTitle: "Temperatur",
      easy: ["Kulde"],
      medium: ["Feber"],
      hard: ["Hypertermi"],
    },
  },

  "2026-W39": {
    title: "Luftvej",
    mcq: {
      rounds: ["Øvre vs nedre luftvej", "Obstruktion", "Sug"],
      questions: [
        {
          id: "w39_q1",
          category: "Øvre vs nedre luftvej",
          text: "Hvilken struktur hører til de øvre luftveje?",
          explanation:
            "De øvre luftveje omfatter blandt andet næse, mund, svælg og larynxområdet. De leder luft videre mod trachea.",
          options: [
            { id: "a", text: "Svælg", isCorrect: true },
            { id: "b", text: "Alveoler" },
            { id: "c", text: "Bronkioler" },
            { id: "d", text: "Pleura" },
          ],
        },
        {
          id: "w39_q2",
          category: "Øvre vs nedre luftvej",
          text: "Hvilken struktur hører til de nedre luftveje?",
          explanation:
            "Trachea, bronkier, bronkioler og alveoler regnes typisk til de nedre luftveje, hvor luft transporteres og gasudveksling foregår.",
          options: [
            { id: "a", text: "Bronkier", isCorrect: true },
            { id: "b", text: "Mundhule" },
            { id: "c", text: "Næsehule" },
            { id: "d", text: "Tunge" },
          ],
        },
        {
          id: "w39_q3",
          category: "Øvre vs nedre luftvej",
          text: "Hvad er epiglottis’ funktion?",
          explanation:
            "Epiglottis hjælper med at lede føde væk fra luftvejen under synkning og beskytter dermed indgangen til larynx.",
          options: [
            {
              id: "a",
              text: "At beskytte luftvejen under synkning",
              isCorrect: true,
            },
            { id: "b", text: "At producere surfaktant" },
            { id: "c", text: "At ilte blodet direkte" },
            { id: "d", text: "At pumpe blod til lungerne" },
          ],
        },
        {
          id: "w39_q4",
          category: "Øvre vs nedre luftvej",
          text: "Hvor foregår den primære gasudveksling?",
          explanation:
            "Gasudveksling mellem luft og blod foregår primært i alveolerne, hvor ilt optages og kuldioxid afgives.",
          options: [
            { id: "a", text: "Alveolerne", isCorrect: true },
            { id: "b", text: "Tungen" },
            { id: "c", text: "Epiglottis" },
            { id: "d", text: "Næseborene" },
          ],
        },
        {
          id: "w39_q5",
          category: "Øvre vs nedre luftvej",
          text: "Hvorfor kan nedsat bevidsthed true den øvre luftvej?",
          explanation:
            "Ved nedsat bevidsthed kan muskeltonus falde, og tungen eller sekret kan kompromittere luftvejen.",
          options: [
            {
              id: "a",
              text: "Fordi tungen og sekret kan kompromittere luftvejen",
              isCorrect: true,
            },
            { id: "b", text: "Fordi alveolerne forsvinder" },
            { id: "c", text: "Fordi ribbenene låser sig fast" },
            { id: "d", text: "Fordi lungerne holder op med at have blodkar" },
          ],
        },
        {
          id: "w39_q6",
          category: "Obstruktion",
          text: "Hvilken lyd forbindes ofte med øvre luftvejsobstruktion?",
          explanation:
            "Stridor er en høj, ofte inspiratorisk lyd, der kan pege på obstruktion i de øvre luftveje. Det skal vurderes akut i kontekst.",
          options: [
            { id: "a", text: "Stridor", isCorrect: true },
            { id: "b", text: "Krepitation ved anklen" },
            { id: "c", text: "Normal vesikulær respiration" },
            { id: "d", text: "Tarmlyde" },
          ],
        },
        {
          id: "w39_q7",
          category: "Obstruktion",
          text: "Hvad kan snorkende respirationslyde hos en bevidsthedspåvirket patient tyde på?",
          explanation:
            "Snorkende lyde kan skyldes delvis øvre luftvejsobstruktion, ofte fra bløddelsrelaksation eller tungens position.",
          options: [
            {
              id: "a",
              text: "Delvis øvre luftvejsobstruktion",
              isCorrect: true,
            },
            { id: "b", text: "Sikker normal luftvej" },
            { id: "c", text: "Isoleret lavt blodsukker som eneste forklaring" },
            { id: "d", text: "At gasudvekslingen altid er normal" },
          ],
        },
        {
          id: "w39_q8",
          category: "Obstruktion",
          text: "Hvilket fund er et rødt flag ved luftvejsvurdering?",
          explanation:
            "Manglende evne til at tale, cyanose, udtalt brug af accessoriske muskler eller faldende bevidsthed kan pege på alvorlig respiratorisk eller luftvejsmæssig påvirkning.",
          options: [
            {
              id: "a",
              text: "Manglende evne til at tale normalt",
              isCorrect: true,
            },
            { id: "b", text: "Let hoste med normal tale" },
            { id: "c", text: "Normal hudfarve og rolig respiration" },
            { id: "d", text: "Stabilt bevidsthedsniveau alene" },
          ],
        },
        {
          id: "w39_q9",
          category: "Obstruktion",
          text: "Hvad er en mulig årsag til akut luftvejsobstruktion?",
          explanation:
            "Fremmedlegeme, hævelse, blod, sekret, opkast eller traume kan kompromittere luftvejen. Årsagen vurderes ud fra situation og fund.",
          options: [
            { id: "a", text: "Fremmedlegeme i luftvejen", isCorrect: true },
            { id: "b", text: "Normal synkning" },
            { id: "c", text: "Normal næsepassage" },
            { id: "d", text: "God hostekraft uden symptomer" },
          ],
        },
        {
          id: "w39_q10",
          category: "Obstruktion",
          text: "Hvorfor er hostekraft relevant ved mistanke om obstruktion?",
          explanation:
            "Effektiv hoste kan indikere, at der fortsat er luftpassage. Svag eller manglende hoste kan være mere bekymrende.",
          options: [
            {
              id: "a",
              text: "Den siger noget om luftpassage og evne til at rense luftvejen",
              isCorrect: true,
            },
            { id: "b", text: "Den beviser altid fri luftvej" },
            { id: "c", text: "Den er kun relevant ved feber" },
            { id: "d", text: "Den erstatter vurdering af respiration" },
          ],
        },
        {
          id: "w39_q11",
          category: "Sug",
          text: "Hvad er formålet med sug i luftvejen?",
          explanation:
            "Sug kan bruges til at fjerne sekret, blod eller opkast fra mund og svælg, så luftvejen bedre kan vurderes og holdes fri.",
          options: [
            {
              id: "a",
              text: "At fjerne sekret, blod eller opkast",
              isCorrect: true,
            },
            { id: "b", text: "At give ilt direkte til alveolerne" },
            { id: "c", text: "At måle blodtryk" },
            { id: "d", text: "At stoppe al hoste permanent" },
          ],
        },
        {
          id: "w39_q12",
          category: "Sug",
          text: "Hvorfor bør sug bruges målrettet og med observation?",
          explanation:
            "Sug kan irritere slimhinder, påvirke iltning og stimulere reflekser. Derfor vurderes behov, effekt og patientrespons løbende.",
          options: [
            {
              id: "a",
              text: "Fordi det kan påvirke patienten og skal vurderes løbende",
              isCorrect: true,
            },
            { id: "b", text: "Fordi det altid er uden fysiologisk effekt" },
            { id: "c", text: "Fordi det kun bruges til hudsår" },
            { id: "d", text: "Fordi det erstatter ABCDE" },
          ],
        },
        {
          id: "w39_q13",
          category: "Sug",
          text: "Hvilket materiale kan især gøre sug relevant ved en bevidsthedspåvirket patient?",
          explanation:
            "Opkast i mund og svælg kan kompromittere luftvejen og øge risikoen for aspiration, særligt ved nedsat bevidsthed.",
          options: [
            { id: "a", text: "Opkast i svælget", isCorrect: true },
            { id: "b", text: "Tør hud på hånden" },
            { id: "c", text: "Normal spytmængde uden symptomer" },
            { id: "d", text: "Let hovedpine alene" },
          ],
        },
        {
          id: "w39_q14",
          category: "Sug",
          text: "Hvad bør man især vurdere efter fjernelse af sekret fra luftvejen?",
          explanation:
            "Efter intervention bør man revurdere luftvej, respirationsarbejde, respirationslyde, saturation og patientens samlede tilstand.",
          options: [
            {
              id: "a",
              text: "Om luftvej og respiration er forbedret",
              isCorrect: true,
            },
            { id: "b", text: "Kun patientens skostørrelse" },
            { id: "c", text: "Om hudtemperaturen alene er ændret" },
            { id: "d", text: "Om patienten har lyst til kaffe" },
          ],
        },
        {
          id: "w39_q15",
          category: "Sug",
          text: "Hvilken placering er mest relevant for sug ved sekret i mundhulen?",
          explanation:
            "Ved synligt sekret i mundhulen rettes indsatsen mod mund og svælg. Man vurderer hele tiden effekt og patientens respons.",
          options: [
            { id: "a", text: "Mund og svælg", isCorrect: true },
            { id: "b", text: "Mavesækken som standard" },
            { id: "c", text: "Ydre øregang" },
            { id: "d", text: "Under huden" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Lyd ↔ problem", "Struktur ↔ funktion"],
      pairsByRound: {
        1: [
          { left: "Stridor", right: "Mulig øvre obstruktion" },
          { left: "Snorken", right: "Tunge/bløddele kan obstruere" },
          { left: "Gurglende lyd", right: "Sekret eller væske" },
          { left: "Wheezing", right: "Nedre luftvejsforsnævring" },
          { left: "Ingen luftlyd", right: "Alvorligt fund" },
          { left: "Hoste", right: "Forsøg på at rense luftvej" },
        ],
        2: [
          { left: "Tunge", right: "Kan obstruere ved slaphed" },
          { left: "Epiglottis", right: "Beskytter under synkning" },
          { left: "Larynx", right: "Indgang til nedre luftvej" },
          { left: "Trachea", right: "Leder luft til bronkier" },
          { left: "Bronkier", right: "Fordeler luft i lungerne" },
          { left: "Alveoler", right: "Gasudveksling" },
        ],
      },
    },
    word: {
      topicTitle: "Luftvej",
      easy: ["Hals"],
      medium: ["Larynx"],
      hard: ["Epiglottis"],
    },
  },

  "2026-W40": {
    title: "Celleanatomi",
    mcq: {
      rounds: ["Organeller", "ATP-produktion", "Membrantransport"],
      questions: [
        {
          id: "w40_q1",
          category: "Organeller",
          text: "Hvilken organel indeholder cellens DNA hos menneskeceller?",
          explanation:
            "Cellekernen indeholder størstedelen af cellens DNA og styrer mange processer gennem genekspression.",
          options: [
            { id: "a", text: "Cellekernen", isCorrect: true },
            { id: "b", text: "Ribosomet" },
            { id: "c", text: "Cellemembranen" },
            { id: "d", text: "Lysosomet" },
          ],
        },
        {
          id: "w40_q2",
          category: "Organeller",
          text: "Hvad er ribosomernes hovedfunktion?",
          explanation:
            "Ribosomer danner proteiner ud fra genetisk information. Proteiner er nødvendige for struktur, signalering, enzymer og transport.",
          options: [
            { id: "a", text: "Proteinsyntese", isCorrect: true },
            { id: "b", text: "Lagring af calcium i knogler" },
            { id: "c", text: "Nedbrydning af røde blodlegemer i blodbanen" },
            { id: "d", text: "Pumpning af blod" },
          ],
        },
        {
          id: "w40_q3",
          category: "Organeller",
          text: "Hvilken organel forbindes især med cellens energiproduktion?",
          explanation:
            "Mitokondrier producerer størstedelen af cellens ATP ved aerob metabolisme, når ilt og substrater er tilgængelige.",
          options: [
            { id: "a", text: "Mitokondriet", isCorrect: true },
            { id: "b", text: "Golgiapparatet" },
            { id: "c", text: "Cellekernen" },
            { id: "d", text: "Cilier" },
          ],
        },
        {
          id: "w40_q4",
          category: "Organeller",
          text: "Hvad er en vigtig funktion for lysosomer?",
          explanation:
            "Lysosomer indeholder enzymer, der kan nedbryde affaldsstoffer, beskadigede komponenter og optaget materiale.",
          options: [
            {
              id: "a",
              text: "Nedbrydning af cellulært materiale",
              isCorrect: true,
            },
            { id: "b", text: "Primær gasudveksling" },
            { id: "c", text: "Dannelse af nerveimpulser i hjertet alene" },
            { id: "d", text: "Produktion af urin" },
          ],
        },
        {
          id: "w40_q5",
          category: "Organeller",
          text: "Hvad er cellemembranens vigtigste rolle?",
          explanation:
            "Cellemembranen afgrænser cellen og regulerer transport af stoffer ind og ud via blandt andet kanaler, transportører og pumper.",
          options: [
            {
              id: "a",
              text: "At afgrænse cellen og regulere transport",
              isCorrect: true,
            },
            { id: "b", text: "At være cellens knogle" },
            { id: "c", text: "At danne blodtryk alene" },
            { id: "d", text: "At nedbryde alle proteiner i blodet" },
          ],
        },
        {
          id: "w40_q6",
          category: "ATP-produktion",
          text: "Hvad står ATP for?",
          explanation:
            "ATP står for adenosintrifosfat og fungerer som en vigtig energibærer i cellens processer.",
          options: [
            { id: "a", text: "Adenosintrifosfat", isCorrect: true },
            { id: "b", text: "Akut temperaturprotein" },
            { id: "c", text: "Alveolær trykperfusion" },
            { id: "d", text: "Aktivt trombocytplasma" },
          ],
        },
        {
          id: "w40_q7",
          category: "ATP-produktion",
          text: "Hvor produceres størstedelen af ATP ved aerob metabolisme?",
          explanation:
            "Ved aerob metabolisme produceres størstedelen af ATP i mitokondrierne gennem citronsyrecyklus og elektrontransportkæden.",
          options: [
            { id: "a", text: "I mitokondrierne", isCorrect: true },
            { id: "b", text: "I cellemembranens yderside" },
            { id: "c", text: "I blodplasmaet" },
            { id: "d", text: "I knoglemarvens fedtceller alene" },
          ],
        },
        {
          id: "w40_q8",
          category: "ATP-produktion",
          text: "Hvilket stof er nødvendigt for effektiv aerob ATP-produktion?",
          explanation:
            "Ilt fungerer som sidste elektronacceptor i elektrontransportkæden. Manglende ilt kan derfor begrænse aerob ATP-produktion.",
          options: [
            { id: "a", text: "Ilt", isCorrect: true },
            { id: "b", text: "Kvælstof som energikilde" },
            { id: "c", text: "Melanin" },
            { id: "d", text: "Urin" },
          ],
        },
        {
          id: "w40_q9",
          category: "ATP-produktion",
          text: "Hvad kan celler i højere grad danne ved utilstrækkelig ilttilførsel?",
          explanation:
            "Ved utilstrækkelig ilt kan celler øge anaerob metabolisme, hvilket kan føre til øget laktatproduktion.",
          options: [
            { id: "a", text: "Laktat", isCorrect: true },
            { id: "b", text: "Surfactant i alle celler" },
            { id: "c", text: "Hæmoglobin i hudceller" },
            { id: "d", text: "Galde i neuroner" },
          ],
        },
        {
          id: "w40_q10",
          category: "ATP-produktion",
          text: "Hvorfor er ATP vigtigt for ionpumper?",
          explanation:
            "Mange ionpumper kræver energi fra ATP for at flytte ioner mod deres koncentrationsgradient og opretholde cellefunktion.",
          options: [
            {
              id: "a",
              text: "ATP leverer energi til aktiv transport",
              isCorrect: true,
            },
            { id: "b", text: "ATP blokerer alle membranproteiner" },
            { id: "c", text: "ATP gør cellemembranen permanent åben" },
            { id: "d", text: "ATP bruges kun i knoglevæv" },
          ],
        },
        {
          id: "w40_q11",
          category: "Membrantransport",
          text: "Hvad kendetegner passiv transport?",
          explanation:
            "Passiv transport sker med koncentrationsgradienten og kræver ikke direkte ATP-forbrug, for eksempel simpel diffusion.",
          options: [
            {
              id: "a",
              text: "Transport med gradienten uden direkte ATP-forbrug",
              isCorrect: true,
            },
            { id: "b", text: "Transport mod gradienten med ATP" },
            { id: "c", text: "Kun transport af DNA ud af kernen" },
            { id: "d", text: "Kun transport i døde celler" },
          ],
        },
        {
          id: "w40_q12",
          category: "Membrantransport",
          text: "Hvad kendetegner aktiv transport?",
          explanation:
            "Aktiv transport flytter stoffer mod deres gradient og kræver energi, ofte direkte eller indirekte fra ATP.",
          options: [
            {
              id: "a",
              text: "Transport mod gradienten med energiforbrug",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Transport uden membranproteiner i alle tilfælde",
            },
            { id: "c", text: "Kun tilfældig bevægelse af vand" },
            { id: "d", text: "Transport der kun foregår i lungerne" },
          ],
        },
        {
          id: "w40_q13",
          category: "Membrantransport",
          text: "Hvad er osmose?",
          explanation:
            "Osmose er vandets bevægelse over en semipermeabel membran, typisk mod området med højere koncentration af opløste stoffer.",
          options: [
            {
              id: "a",
              text: "Vandtransport over en semipermeabel membran",
              isCorrect: true,
            },
            { id: "b", text: "Proteinsyntese i ribosomer" },
            { id: "c", text: "Nedbrydning i lysosomer" },
            { id: "d", text: "Elektrisk aktivitet i hjertet alene" },
          ],
        },
        {
          id: "w40_q14",
          category: "Membrantransport",
          text: "Hvilken struktur kan hjælpe ioner gennem cellemembranen?",
          explanation:
            "Ionkanaler tillader selektiv passage af bestemte ioner gennem membranen og er vigtige for blandt andet nerve- og muskelfunktion.",
          options: [
            { id: "a", text: "Ionkanaler", isCorrect: true },
            { id: "b", text: "Ribben" },
            { id: "c", text: "Alveoler" },
            { id: "d", text: "Trombocytter" },
          ],
        },
        {
          id: "w40_q15",
          category: "Membrantransport",
          text: "Hvorfor er natrium-kalium-pumpen vigtig?",
          explanation:
            "Natrium-kalium-pumpen bruger ATP til at opretholde iongradienter, som er vigtige for cellevolumen og elektrisk excitabilitet.",
          options: [
            {
              id: "a",
              text: "Den opretholder vigtige iongradienter",
              isCorrect: true,
            },
            { id: "b", text: "Den producerer ilt i lungerne" },
            { id: "c", text: "Den nedbryder alle bakterier i blodet" },
            { id: "d", text: "Den laver blærer i huden" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Struktur ↔ funktion", "Transporttype ↔ mekanisme"],
      pairsByRound: {
        1: [
          { left: "Cellekerne", right: "Indeholder DNA" },
          { left: "Mitokondrie", right: "Producerer ATP" },
          { left: "Ribosom", right: "Danner proteiner" },
          { left: "Lysosom", right: "Nedbryder materiale" },
          { left: "Cellemembran", right: "Regulerer transport" },
          { left: "Golgiapparat", right: "Modificerer og sorterer proteiner" },
        ],
        2: [
          { left: "Diffusion", right: "Med koncentrationsgradient" },
          { left: "Osmose", right: "Vand over membran" },
          { left: "Aktiv transport", right: "Kræver energi" },
          { left: "Ionkanal", right: "Selektiv passage" },
          { left: "Natrium-kalium-pumpe", right: "Bruger ATP" },
          { left: "Faciliteret diffusion", right: "Via transportprotein" },
        ],
      },
    },
    word: {
      topicTitle: "Celle",
      easy: ["Kerne"],
      medium: ["Ribosom"],
      hard: ["Mitokondrie"],
    },
  },
  "2026-W41": {
    title: "Koagulation",
    mcq: {
      rounds: ["Koagulationskaskade", "Trombe", "Antikoagulantia"],
      questions: [
        {
          id: "w41_q1",
          category: "Koagulationskaskade",
          text: "Hvad er koagulationskaskadens overordnede formål?",
          explanation:
            "Koagulationskaskaden bidrager til at danne fibrin, som stabiliserer blodproppen og hjælper med at standse blødning.",
          options: [
            { id: "a", text: "At opløse alle blodpropper hurtigt" },
            {
              id: "b",
              text: "At danne fibrin og stabilisere hæmostasen",
              isCorrect: true,
            },
            { id: "c", text: "At sænke blodtrykket ved blødning" },
            { id: "d", text: "At transportere ilt til vævet" },
          ],
        },
        {
          id: "w41_q2",
          category: "Koagulationskaskade",
          text: "Hvilket protein danner det stabile netværk i en færdig koagel?",
          explanation:
            "Fibrin danner et netværk, som stabiliserer trombocytproppen og gør koaglet mere modstandsdygtigt.",
          options: [
            { id: "a", text: "Albumin" },
            { id: "b", text: "Hæmoglobin" },
            { id: "c", text: "Fibrin", isCorrect: true },
            { id: "d", text: "Myoglobin" },
          ],
        },
        {
          id: "w41_q3",
          category: "Koagulationskaskade",
          text: "Hvilken rolle har trombin i koagulationen?",
          explanation:
            "Trombin omdanner fibrinogen til fibrin og er derfor centralt i dannelsen af et stabilt koagel.",
          options: [
            {
              id: "a",
              text: "Det omdanner fibrinogen til fibrin",
              isCorrect: true,
            },
            { id: "b", text: "Det nedbryder røde blodlegemer" },
            {
              id: "c",
              text: "Det transporterer koagulationsfaktorer i plasma",
            },
            { id: "d", text: "Det hæmmer trombocytaktivering direkte" },
          ],
        },
        {
          id: "w41_q4",
          category: "Koagulationskaskade",
          text: "Hvorfor kan leversygdom give øget blødningstendens?",
          explanation:
            "Mange koagulationsfaktorer dannes i leveren, og nedsat leverfunktion kan derfor påvirke koagulationsevnen.",
          options: [
            {
              id: "a",
              text: "Fordi leveren producerer mange koagulationsfaktorer",
              isCorrect: true,
            },
            { id: "b", text: "Fordi leveren lagrer alt fibrin i blodet" },
            { id: "c", text: "Fordi leveren styrer lungeventilationen" },
            { id: "d", text: "Fordi leveren nedbryder alle trombocytter" },
          ],
        },
        {
          id: "w41_q5",
          category: "Koagulationskaskade",
          text: "Hvad beskriver hæmostase bedst?",
          explanation:
            "Hæmostase er kroppens samlede proces for at begrænse blødning, blandt andet via karreaktion, trombocytter og koagulation.",
          options: [
            { id: "a", text: "Kroppens regulering af blodsukker" },
            {
              id: "b",
              text: "Kroppens proces for at standse blødning",
              isCorrect: true,
            },
            { id: "c", text: "Nyrernes udskillelse af væske" },
            { id: "d", text: "Lungernes optagelse af ilt" },
          ],
        },
        {
          id: "w41_q6",
          category: "Trombe",
          text: "Hvad er en trombe?",
          explanation:
            "En trombe er en blodprop dannet inde i et blodkar eller i hjertet, hvor den kan hæmme blodgennemstrømningen.",
          options: [
            { id: "a", text: "En infektion i blodbanen" },
            {
              id: "b",
              text: "En blodprop dannet i et kar eller hjertet",
              isCorrect: true,
            },
            { id: "c", text: "En luftansamling i pleurahulen" },
            { id: "d", text: "En udposning på en vene" },
          ],
        },
        {
          id: "w41_q7",
          category: "Trombe",
          text: "Hvilket fund kan give mistanke om dyb venetrombose i benet?",
          explanation:
            "Ensidig hævelse, smerte og varme i benet kan give mistanke om DVT, men fundene er ikke diagnostiske alene.",
          options: [
            {
              id: "a",
              text: "Ensidig hævelse og smerte i benet",
              isCorrect: true,
            },
            { id: "b", text: "Kløe på begge underarme" },
            { id: "c", text: "Kortvarig hikke efter måltid" },
            { id: "d", text: "Symmetrisk muskelømhed efter træning" },
          ],
        },
        {
          id: "w41_q8",
          category: "Trombe",
          text: "Hvorfor er en løsrevet venøs trombe klinisk vigtig?",
          explanation:
            "En venøs trombe kan embolisere til lungekredsløbet og give lungeemboli, som kan påvirke respiration og kredsløb.",
          options: [
            { id: "a", text: "Den kan blive til lungeemboli", isCorrect: true },
            { id: "b", text: "Den omdannes altid til arterielt blod" },
            { id: "c", text: "Den giver kun lokal hudrødme" },
            { id: "d", text: "Den stopper altid i leverens galdeveje" },
          ],
        },
        {
          id: "w41_q9",
          category: "Trombe",
          text: "Hvilken patienthistorik øger mistanken om tromboembolisk sygdom?",
          explanation:
            "Immobilisering kan øge risikoen for venøs trombedannelse, især sammen med andre risikofaktorer.",
          options: [
            { id: "a", text: "Langvarig immobilisering", isCorrect: true },
            { id: "b", text: "Kortvarig hoste uden feber" },
            { id: "c", text: "Indtag af et almindeligt måltid" },
            { id: "d", text: "Tidligere forstuvet finger" },
          ],
        },
        {
          id: "w41_q10",
          category: "Trombe",
          text: "Hvad betyder emboli?",
          explanation:
            "Emboli beskriver materiale, ofte en trombe, der transporteres med blodet og sætter sig fast et andet sted.",
          options: [
            { id: "a", text: "En lokal hudinfektion" },
            { id: "b", text: "En blødning fra slimhinder" },
            {
              id: "c",
              text: "Materiale der føres med blodet og sætter sig fast",
              isCorrect: true,
            },
            { id: "d", text: "En normal udvidelse af blodkar" },
          ],
        },
        {
          id: "w41_q11",
          category: "Antikoagulantia",
          text: "Hvad er hovedformålet med antikoagulantia?",
          explanation:
            "Antikoagulantia hæmmer dele af koagulationssystemet og bruges til at reducere risikoen for trombedannelse eller trombevækst.",
          options: [
            { id: "a", text: "At øge dannelsen af fibrin" },
            {
              id: "b",
              text: "At hæmme koagulation og trombedannelse",
              isCorrect: true,
            },
            { id: "c", text: "At øge blodets iltindhold" },
            { id: "d", text: "At stimulere knoglemarven akut" },
          ],
        },
        {
          id: "w41_q12",
          category: "Antikoagulantia",
          text: "Hvad er en vigtig præhospital oplysning hos en patient i blodfortyndende behandling?",
          explanation:
            "Oplysning om antikoagulantia er vigtig ved traume, fald, neurologiske symptomer og blødning, da blødningsrisikoen kan være øget.",
          options: [
            {
              id: "a",
              text: "Om patienten tager antikoagulantia",
              isCorrect: true,
            },
            { id: "b", text: "Om patienten foretrækker varm drikke" },
            { id: "c", text: "Om patienten har skiftet telefon" },
            { id: "d", text: "Om patienten har spist morgenmad" },
          ],
        },
        {
          id: "w41_q13",
          category: "Antikoagulantia",
          text: "Hvilket udsagn om warfarin er mest korrekt?",
          explanation:
            "Warfarin påvirker vitamin K-afhængige koagulationsfaktorer og kan monitoreres med INR.",
          options: [
            {
              id: "a",
              text: "Warfarin påvirker vitamin K-afhængige faktorer",
              isCorrect: true,
            },
            { id: "b", text: "Warfarin virker som inhalationsmedicin" },
            { id: "c", text: "Warfarin øger trombocytternes iltbinding" },
            { id: "d", text: "Warfarin bruges til at behandle hypoglykæmi" },
          ],
        },
        {
          id: "w41_q14",
          category: "Antikoagulantia",
          text: "Hvorfor er faldtraume hos en ældre patient på antikoagulantia særligt relevant?",
          explanation:
            "Antikoagulantia kan øge risikoen for alvorlig blødning, også hvor ydre tegn kan være sparsomme, eksempelvis ved hovedtraume.",
          options: [
            {
              id: "a",
              text: "Fordi blødningsrisikoen kan være øget",
              isCorrect: true,
            },
            { id: "b", text: "Fordi alle fald skyldes blodpropper" },
            { id: "c", text: "Fordi antikoagulantia fjerner smerterespons" },
            { id: "d", text: "Fordi huden ikke kan få blå mærker" },
          ],
        },
        {
          id: "w41_q15",
          category: "Antikoagulantia",
          text: "Hvad er en mulig konsekvens af antikoagulantia ved aktiv blødning?",
          explanation:
            "Antikoagulantia kan gøre blødning vanskeligere at kontrollere og bør indgå i den kliniske vurdering og overlevering.",
          options: [
            {
              id: "a",
              text: "Blødningen kan være sværere at kontrollere",
              isCorrect: true,
            },
            { id: "b", text: "Blødningen stopper altid spontant" },
            { id: "c", text: "Patienten får automatisk feber" },
            { id: "d", text: "Koagulationen bliver hurtigere end normalt" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Faktor ↔ funktion", "Medicin ↔ effekt"],
      pairsByRound: {
        1: [
          { left: "Trombin", right: "Danner fibrin fra fibrinogen" },
          { left: "Fibrin", right: "Stabiliserer koaglet" },
          { left: "Trombocytter", right: "Starter primær hæmostase" },
          { left: "Vitamin K", right: "Vigtig for flere faktorer" },
          { left: "Lever", right: "Producerer koagulationsfaktorer" },
          { left: "Endotel", right: "Påvirker kar og koagulation" },
        ],
        2: [
          { left: "Warfarin", right: "Hæmmer vitamin K-effekt" },
          { left: "Heparin", right: "Hæmmer koagulationsaktivitet" },
          { left: "DOAK", right: "Hæmmer udvalgte faktorer" },
          { left: "ASA", right: "Hæmmer trombocytfunktion" },
          { left: "Antikoagulantia", right: "Øger blødningsrisiko" },
          { left: "Trombolyse", right: "Kan opløse trombe" },
        ],
      },
    },
    word: {
      topicTitle: "Koagulation",
      easy: ["Prop"],
      medium: ["Fibrin"],
      hard: ["Koagulationsfaktor"],
    },
  },

  "2026-W42": {
    title: "Forgiftninger",
    mcq: {
      rounds: ["Toxidromer", "CO-forgiftning", "Naloxon"],
      questions: [
        {
          id: "w42_q1",
          category: "Toxidromer",
          text: "Hvad er et toxidrom?",
          explanation:
            "Et toxidrom er et mønster af symptomer og fund, som kan pege mod en bestemt type forgiftning, men ikke alene beviser årsagen.",
          options: [
            {
              id: "a",
              text: "Et symptommønster ved forgiftning",
              isCorrect: true,
            },
            { id: "b", text: "En blodprøve for infektion" },
            { id: "c", text: "En type knoglebrud" },
            { id: "d", text: "En normal reaktion på motion" },
          ],
        },
        {
          id: "w42_q2",
          category: "Toxidromer",
          text: "Hvilket fund passer bedst med et opioidt toxidrom?",
          explanation:
            "Opioidpåvirkning kan give bevidsthedspåvirkning, respirationsdepression og små pupiller, men samlet vurdering er nødvendig.",
          options: [
            {
              id: "a",
              text: "Respirationsdepression og små pupiller",
              isCorrect: true,
            },
            { id: "b", text: "Høj feber og nakkestivhed" },
            { id: "c", text: "Ensiding lammelse og afasi" },
            { id: "d", text: "Kraftig diurese og tør hoste" },
          ],
        },
        {
          id: "w42_q3",
          category: "Toxidromer",
          text: "Hvilket fund kan ses ved sympatomimetisk påvirkning?",
          explanation:
            "Sympatomimetiske stoffer kan give takykardi, agitation, hypertension, svedtendens og dilaterede pupiller.",
          options: [
            { id: "a", text: "Takykardi, uro og svedtendens", isCorrect: true },
            { id: "b", text: "Bradykardi og tør hud som eneste fund" },
            { id: "c", text: "Normal respiration ved dyb bevidstløshed" },
            { id: "d", text: "Isoleret smerte i anklen" },
          ],
        },
        {
          id: "w42_q4",
          category: "Toxidromer",
          text: "Hvorfor er omgivelserne vigtige ved mistanke om forgiftning?",
          explanation:
            "Tom emballage, medicin, kemikalier og flere påvirkede personer kan give vigtige spor og hjælpe med risikovurdering.",
          options: [
            {
              id: "a",
              text: "De kan give spor om eksponering",
              isCorrect: true,
            },
            { id: "b", text: "De erstatter patientundersøgelsen" },
            { id: "c", text: "De viser altid præcis dosis" },
            { id: "d", text: "De udelukker behov for ABCDE" },
          ],
        },
        {
          id: "w42_q5",
          category: "Toxidromer",
          text: "Hvad bør vurderes tidligt hos en forgiftet patient med nedsat bevidsthed?",
          explanation:
            "Luftvej, respiration og kredsløb er centrale i den tidlige vurdering, da forgiftning kan give hurtigt svigt i vitale funktioner.",
          options: [
            {
              id: "a",
              text: "Luftvej, respiration og kredsløb",
              isCorrect: true,
            },
            { id: "b", text: "Hårfarve og skostørrelse" },
            { id: "c", text: "Kun patientens temperatur" },
            { id: "d", text: "Kun om patienten har kvalme" },
          ],
        },
        {
          id: "w42_q6",
          category: "CO-forgiftning",
          text: "Hvorfor er kulilte farlig?",
          explanation:
            "Kulilte binder stærkt til hæmoglobin og kan reducere blodets evne til at transportere ilt til vævene.",
          options: [
            {
              id: "a",
              text: "Den binder til hæmoglobin og hæmmer ilttransport",
              isCorrect: true,
            },
            { id: "b", text: "Den øger blodets iltindhold markant" },
            { id: "c", text: "Den virker kun lokalt i huden" },
            { id: "d", text: "Den nedbryder knogler akut" },
          ],
        },
        {
          id: "w42_q7",
          category: "CO-forgiftning",
          text: "Hvilket scenarie bør give mistanke om CO-forgiftning?",
          explanation:
            "Flere personer med hovedpine, kvalme eller påvirket bevidsthed i samme lukkede miljø kan pege mod kulilteeksponering.",
          options: [
            {
              id: "a",
              text: "Flere syge i samme lukkede rum",
              isCorrect: true,
            },
            { id: "b", text: "Én person med vrikket ankel udendørs" },
            { id: "c", text: "Kløe efter myggestik" },
            { id: "d", text: "Smerter efter kendt slag mod finger" },
          ],
        },
        {
          id: "w42_q8",
          category: "CO-forgiftning",
          text: "Hvorfor kan pulsoximetri være misvisende ved CO-forgiftning?",
          explanation:
            "Almindelig pulsoximetri kan ikke sikkert skelne oxyhæmoglobin fra carboxyhæmoglobin og kan derfor vise falsk betryggende værdier.",
          options: [
            {
              id: "a",
              text: "Den kan vise falsk høj saturation",
              isCorrect: true,
            },
            { id: "b", text: "Den måler kun blodsukker" },
            { id: "c", text: "Den virker kun ved feber" },
            { id: "d", text: "Den viser altid præcis CO-værdi" },
          ],
        },
        {
          id: "w42_q9",
          category: "CO-forgiftning",
          text: "Hvilke symptomer kan ses tidligt ved CO-forgiftning?",
          explanation:
            "Hovedpine, svimmelhed, kvalme og træthed kan være tidlige og uspecifikke tegn på kulilteforgiftning.",
          options: [
            {
              id: "a",
              text: "Hovedpine, svimmelhed og kvalme",
              isCorrect: true,
            },
            { id: "b", text: "Isoleret udslæt på albuen" },
            { id: "c", text: "Kun ensidig hævelse af fod" },
            { id: "d", text: "Pludselig tandløshed" },
          ],
        },
        {
          id: "w42_q10",
          category: "CO-forgiftning",
          text: "Hvad er en vigtig sikkerhedstanke ved mistanke om CO i et hjem?",
          explanation:
            "Kulilte kan også påvirke reddere. Egensikkerhed og vurdering af miljøet er derfor vigtig før og under patientkontakt.",
          options: [
            {
              id: "a",
              text: "Egensikkerhed og risiko for flere eksponerede",
              isCorrect: true,
            },
            { id: "b", text: "At CO altid kan lugtes tydeligt" },
            { id: "c", text: "At kun børn kan blive påvirket" },
            { id: "d", text: "At åbne vinduer altid løser situationen alene" },
          ],
        },
        {
          id: "w42_q11",
          category: "Naloxon",
          text: "Hvad er naloxon primært en antidot mod?",
          explanation:
            "Naloxon er en opioidantagonist og kan modvirke opioidrelateret respirationsdepression.",
          options: [
            { id: "a", text: "Opioider", isCorrect: true },
            { id: "b", text: "Kulilte" },
            { id: "c", text: "Paracetamol" },
            { id: "d", text: "Jernmangel" },
          ],
        },
        {
          id: "w42_q12",
          category: "Naloxon",
          text: "Hvilket klinisk problem er vigtigst at erkende ved opioidforgiftning?",
          explanation:
            "Respirationsdepression er central ved opioidforgiftning og kan medføre hypoksi, hvis ventilationen er utilstrækkelig.",
          options: [
            { id: "a", text: "Respirationsdepression", isCorrect: true },
            { id: "b", text: "Forstuvet håndled" },
            { id: "c", text: "Isoleret tør hud" },
            { id: "d", text: "Kortvarig næseblod" },
          ],
        },
        {
          id: "w42_q13",
          category: "Naloxon",
          text: "Hvorfor skal patienten fortsat observeres efter effekt af naloxon?",
          explanation:
            "Naloxons virkningsvarighed kan være kortere end opioidets, så symptomer kan komme igen efter initial bedring.",
          options: [
            {
              id: "a",
              text: "Opioidpåvirkning kan vende tilbage",
              isCorrect: true,
            },
            { id: "b", text: "Naloxon giver altid varig helbredelse" },
            { id: "c", text: "Naloxon udelukker andre årsager" },
            { id: "d", text: "Patienten bliver altid symptomfri i flere døgn" },
          ],
        },
        {
          id: "w42_q14",
          category: "Naloxon",
          text: "Hvad kan en hurtig opvågning efter naloxon medføre?",
          explanation:
            "Naloxon kan udløse abstinenssymptomer hos opioidafhængige, og patienten kan vågne urolig eller utilpas.",
          options: [
            { id: "a", text: "Abstinenssymptomer og uro", isCorrect: true },
            { id: "b", text: "Akut knoglebrud" },
            { id: "c", text: "Permanent bedøvelse" },
            { id: "d", text: "Sikker udelukkelse af blandingsforgiftning" },
          ],
        },
        {
          id: "w42_q15",
          category: "Naloxon",
          text: "Hvilken vurdering er stadig nødvendig, selv om naloxon overvejes?",
          explanation:
            "ABCDE-vurdering og støtte til ventilation er fortsat centralt, fordi antidot ikke erstatter behandling af vitale problemer.",
          options: [
            {
              id: "a",
              text: "ABCDE og respirationsvurdering",
              isCorrect: true,
            },
            { id: "b", text: "Kun pupilstørrelse" },
            { id: "c", text: "Kun patientens vægt" },
            { id: "d", text: "Kun tidligere alkoholforbrug" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Gift ↔ symptom", "Antidot ↔ stof"],
      pairsByRound: {
        1: [
          { left: "Opioid", right: "Langsom respiration" },
          { left: "Kulilte", right: "Hovedpine og kvalme" },
          { left: "Sympatomimetika", right: "Takykardi og uro" },
          { left: "Alkohol", right: "Sløret tale og ataksi" },
          { left: "Antikolinergika", right: "Tør hud og store pupiller" },
          { left: "Sedativa", right: "Nedsat bevidsthed" },
        ],
        2: [
          { left: "Naloxon", right: "Opioider" },
          { left: "Hydroxocobalamin", right: "Cyanid" },
          { left: "N-acetylcystein", right: "Paracetamol" },
          { left: "Atropin", right: "Organofosfat" },
          { left: "Flumazenil", right: "Benzodiazepiner" },
          { left: "Ilt", right: "Kulilteeksponering" },
        ],
      },
    },
    word: {
      topicTitle: "Toksikologi",
      easy: ["Gift"],
      medium: ["Overdosis"],
      hard: ["Antidot"],
    },
  },

  "2026-W43": {
    title: "Obstetrik",
    mcq: {
      rounds: ["Fødselsfaser", "Blødning", "Præhospital fødsel"],
      questions: [
        {
          id: "w43_q1",
          category: "Fødselsfaser",
          text: "Hvad kendetegner udvidelsesfasen ved fødsel?",
          explanation:
            "Udvidelsesfasen er perioden, hvor cervix gradvist afkortes og åbner sig frem mod fuld dilatation.",
          options: [
            { id: "a", text: "Cervix åbner sig gradvist", isCorrect: true },
            { id: "b", text: "Placenta fødes som første struktur" },
            { id: "c", text: "Barnet er altid født" },
            { id: "d", text: "Veerne ophører permanent" },
          ],
        },
        {
          id: "w43_q2",
          category: "Fødselsfaser",
          text: "Hvad kendetegner pressefasen?",
          explanation:
            "Pressefasen er fasen fra fuld åbning til barnet fødes, hvor veer og pressetrang hjælper barnet ned gennem fødselskanalen.",
          options: [
            {
              id: "a",
              text: "Barnet fødes gennem fødselskanalen",
              isCorrect: true,
            },
            { id: "b", text: "Moderkagen løsner sig før barnet" },
            { id: "c", text: "Cervix er helt lukket" },
            { id: "d", text: "Fostervandet dannes først her" },
          ],
        },
        {
          id: "w43_q3",
          category: "Fødselsfaser",
          text: "Hvad er efterbyrdsfasen?",
          explanation:
            "Efterbyrdsfasen er perioden efter barnets fødsel, hvor placenta og hinder fødes.",
          options: [
            { id: "a", text: "Fasen hvor placenta fødes", isCorrect: true },
            { id: "b", text: "Fasen før veerne begynder" },
            { id: "c", text: "Fasen hvor cervix lukker før fødsel" },
            { id: "d", text: "Fasen hvor graviditeten konstateres" },
          ],
        },
        {
          id: "w43_q4",
          category: "Fødselsfaser",
          text: "Hvilket tegn kan tyde på, at fødslen er nært forestående?",
          explanation:
            "Synligt hoved i vulva under veer kan tyde på nært forestående fødsel og kræver rolig forberedelse og vurdering.",
          options: [
            { id: "a", text: "Synligt hoved under ve", isCorrect: true },
            { id: "b", text: "Let kvalme i første trimester" },
            { id: "c", text: "Normal puls hos mor" },
            { id: "d", text: "Træthed efter lang transport" },
          ],
        },
        {
          id: "w43_q5",
          category: "Fødselsfaser",
          text: "Hvorfor er veernes hyppighed relevant præhospitalt?",
          explanation:
            "Hyppige og kraftige veer kan give indtryk af progression og hjælpe med at vurdere, om fødslen kan være nært forestående.",
          options: [
            {
              id: "a",
              text: "Det kan sige noget om progression",
              isCorrect: true,
            },
            { id: "b", text: "Det beviser barnets vægt" },
            { id: "c", text: "Det udelukker komplikationer" },
            { id: "d", text: "Det erstatter vurdering af mor" },
          ],
        },
        {
          id: "w43_q6",
          category: "Blødning",
          text: "Hvorfor er kraftig vaginal blødning i graviditet alvorligt?",
          explanation:
            "Kraftig blødning kan true både mor og barn og kan skyldes flere alvorlige tilstande, som kræver hurtig vurdering.",
          options: [
            { id: "a", text: "Det kan true mor og barn", isCorrect: true },
            { id: "b", text: "Det er altid helt normalt" },
            { id: "c", text: "Det skyldes kun urinvejsinfektion" },
            { id: "d", text: "Det viser altid at fødslen er afsluttet" },
          ],
        },
        {
          id: "w43_q7",
          category: "Blødning",
          text: "Hvad betyder postpartum blødning?",
          explanation:
            "Postpartum blødning er blødning efter fødslen og kan blive alvorlig, især hvis blødningen er kraftig eller vedvarende.",
          options: [
            { id: "a", text: "Blødning efter fødslen", isCorrect: true },
            { id: "b", text: "Blødning før graviditet" },
            { id: "c", text: "Blødning fra navlesnoren alene" },
            { id: "d", text: "Normal menstruation under fødsel" },
          ],
        },
        {
          id: "w43_q8",
          category: "Blødning",
          text: "Hvilket fund kan være tegn på kredsløbspåvirkning ved obstetrisk blødning?",
          explanation:
            "Takykardi, bleghed, koldsved, svimmelhed og faldende bevidsthedsniveau kan pege mod påvirket kredsløb.",
          options: [
            {
              id: "a",
              text: "Takykardi, bleghed og koldsved",
              isCorrect: true,
            },
            { id: "b", text: "Isoleret kløe i håndfladen" },
            { id: "c", text: "Stabil almen tilstand uden symptomer" },
            { id: "d", text: "Let ømhed efter træning" },
          ],
        },
        {
          id: "w43_q9",
          category: "Blødning",
          text: "Hvorfor kan blodtab i graviditet være svært at vurdere visuelt?",
          explanation:
            "Synligt blod kan undervurdere det reelle blodtab, og gravide kan kompensere kredsløbsmæssigt i en periode.",
          options: [
            {
              id: "a",
              text: "Synligt blodtab kan undervurdere omfanget",
              isCorrect: true,
            },
            { id: "b", text: "Blodtab kan altid måles præcist på gulvet" },
            { id: "c", text: "Gravide mister ikke blod ved blødning" },
            { id: "d", text: "Blodtab påvirker kun temperaturen" },
          ],
        },
        {
          id: "w43_q10",
          category: "Blødning",
          text: "Hvad kan smerter og blødning sent i graviditeten give mistanke om?",
          explanation:
            "Smerter og blødning sent i graviditeten kan blandt andet give mistanke om placentakomplikation og bør vurderes som potentielt alvorligt.",
          options: [
            { id: "a", text: "Mulig placentakomplikation", isCorrect: true },
            { id: "b", text: "Sikkert ukompliceret forløb" },
            { id: "c", text: "Altid fødsel af placenta først" },
            { id: "d", text: "Kun muskelømhed" },
          ],
        },
        {
          id: "w43_q11",
          category: "Præhospital fødsel",
          text: "Hvad er en vigtig præhospital prioritet ved fødsel?",
          explanation:
            "Rolig støtte, vurdering af mor og barn samt forberedelse på progression er centralt ved præhospital fødsel.",
          options: [
            {
              id: "a",
              text: "Rolig støtte og vurdering af mor og barn",
              isCorrect: true,
            },
            { id: "b", text: "At trække barnet hurtigt ud" },
            { id: "c", text: "At ignorere mors vitale værdier" },
            { id: "d", text: "At afvente uden observation" },
          ],
        },
        {
          id: "w43_q12",
          category: "Præhospital fødsel",
          text: "Hvad er vigtigt umiddelbart efter barnet er født?",
          explanation:
            "Barnet vurderes blandt andet for respiration, tonus og farve, og varmetab forebygges tidligt.",
          options: [
            {
              id: "a",
              text: "Vurdere respiration og forebygge varmetab",
              isCorrect: true,
            },
            { id: "b", text: "Afkøle barnet for at stimulere gråd" },
            { id: "c", text: "Adskille mor og barn rutinemæssigt" },
            { id: "d", text: "Undgå observation af barnet" },
          ],
        },
        {
          id: "w43_q13",
          category: "Præhospital fødsel",
          text: "Hvorfor bør nyfødte holdes varme?",
          explanation:
            "Nyfødte taber hurtigt varme, og hypotermi kan forværre respiration, kredsløb og metabolisk stress.",
          options: [
            { id: "a", text: "De taber hurtigt varme", isCorrect: true },
            { id: "b", text: "De har for høj muskelmasse" },
            { id: "c", text: "Kulde øger altid iltmætningen" },
            { id: "d", text: "Varme gør observation unødvendig" },
          ],
        },
        {
          id: "w43_q14",
          category: "Præhospital fødsel",
          text: "Hvad er et vigtigt tegn på, at den nyfødte har behov for tæt vurdering?",
          explanation:
            "Manglende eller utilstrækkelig respiration efter fødslen kræver hurtig vurdering og relevant støtte efter uddannelsesniveau og retningslinjer.",
          options: [
            { id: "a", text: "Utilstrækkelig respiration", isCorrect: true },
            { id: "b", text: "Gråd og god tonus" },
            { id: "c", text: "Lyserød hud og normal aktivitet" },
            { id: "d", text: "God kontakt med mor" },
          ],
        },
        {
          id: "w43_q15",
          category: "Præhospital fødsel",
          text: "Hvilken information er relevant at overlevere efter præhospital fødsel?",
          explanation:
            "Tidspunkt for fødsel, barnets tilstand, mors tilstand, blødning og eventuelle komplikationer er vigtige i overleveringen.",
          options: [
            {
              id: "a",
              text: "Fødselstidspunkt, tilstande og blødning",
              isCorrect: true,
            },
            { id: "b", text: "Kun adressen på fødestedet" },
            { id: "c", text: "Kun barnets hårfarve" },
            { id: "d", text: "Kun om der var mange tilskuere" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Tegn ↔ fase", "Komplikation ↔ risiko"],
      pairsByRound: {
        1: [
          { left: "Regelmæssige veer", right: "Kan tyde på aktiv fødsel" },
          { left: "Cervix åbner sig", right: "Udvidelsesfase" },
          { left: "Pressetrang", right: "Pressefase" },
          { left: "Barnet født", right: "Overgang til nyfødtvurdering" },
          { left: "Placenta fødes", right: "Efterbyrdsfase" },
          { left: "Synligt hoved", right: "Fødsel kan være nær" },
        ],
        2: [
          { left: "Kraftig blødning", right: "Risiko for shock" },
          { left: "Navlesnorsfremfald", right: "Risiko for hypoksi" },
          { left: "Skulderdystoci", right: "Forsinket forløsning" },
          { left: "Præeklampsi", right: "Risiko for kramper" },
          { left: "Placentaløsning", right: "Smerter og blødning" },
          { left: "Hypotermi hos nyfødt", right: "Øget metabolisk stress" },
        ],
      },
    },
    word: {
      topicTitle: "Fødsel",
      easy: ["Veer"],
      medium: ["Placenta"],
      hard: ["Postpartum"],
    },
  },

  "2026-W44": {
    title: "Pædiatri luftvej",
    mcq: {
      rounds: ["Børns anatomi", "Croup", "Epiglottitis"],
      questions: [
        {
          id: "w44_q1",
          category: "Børns anatomi",
          text: "Hvorfor kan luftvejsobstruktion udvikle sig hurtigt hos små børn?",
          explanation:
            "Små børn har snævrere luftveje, og selv beskedent ødem kan give relativt stor modstand mod luftflow.",
          options: [
            {
              id: "a",
              text: "Deres luftveje er relativt snævre",
              isCorrect: true,
            },
            { id: "b", text: "Deres lunger er fyldt med væske normalt" },
            { id: "c", text: "De har ingen hosterefleks" },
            { id: "d", text: "Deres ribben kan ikke bevæge sig" },
          ],
        },
        {
          id: "w44_q2",
          category: "Børns anatomi",
          text: "Hvilken anatomisk forskel er relevant ved børns luftvej?",
          explanation:
            "Børn har relativt stor tunge og mindre luftvejsdiameter, hvilket kan gøre luftvejen mere sårbar ved sygdom eller bevidsthedspåvirkning.",
          options: [
            {
              id: "a",
              text: "Relativt stor tunge og snævrere luftvej",
              isCorrect: true,
            },
            { id: "b", text: "Større luftrør end voksne" },
            { id: "c", text: "Ingen slimhinder i svælget" },
            { id: "d", text: "Stivere brystkasse end voksne" },
          ],
        },
        {
          id: "w44_q3",
          category: "Børns anatomi",
          text: "Hvorfor er respirationsarbejde vigtigt at observere hos børn?",
          explanation:
            "Indtrækninger, næsefløjsspil og udtrætning kan være tegn på øget respirationsarbejde og mulig forværring.",
          options: [
            {
              id: "a",
              text: "Det kan vise øget belastning og udtrætning",
              isCorrect: true,
            },
            { id: "b", text: "Det viser barnets præcise diagnose" },
            { id: "c", text: "Det erstatter saturation og klinik" },
            { id: "d", text: "Det er kun relevant hos voksne" },
          ],
        },
        {
          id: "w44_q4",
          category: "Børns anatomi",
          text: "Hvad kan indtrækninger hos et barn tyde på?",
          explanation:
            "Indtrækninger kan tyde på øget respirationsarbejde, men årsagen skal vurderes ud fra hele billedet.",
          options: [
            { id: "a", text: "Øget respirationsarbejde", isCorrect: true },
            { id: "b", text: "Normal søvn uden betydning" },
            { id: "c", text: "Isoleret knæsmerte" },
            { id: "d", text: "Sikkert lavt blodsukker" },
          ],
        },
        {
          id: "w44_q5",
          category: "Børns anatomi",
          text: "Hvorfor kan børn forværres hurtigt ved respiratorisk sygdom?",
          explanation:
            "Børn har begrænsede respiratoriske reserver og kan blive udtrættede, især ved øget respirationsarbejde over tid.",
          options: [
            {
              id: "a",
              text: "De kan have begrænsede respiratoriske reserver",
              isCorrect: true,
            },
            { id: "b", text: "De har højere iltreserve end voksne" },
            { id: "c", text: "De får ikke hypoksi" },
            { id: "d", text: "De kan ikke udvikle ødem" },
          ],
        },
        {
          id: "w44_q6",
          category: "Croup",
          text: "Hvilket symptom passer typisk med croup?",
          explanation:
            "Croup giver ofte gøende hoste, hæshed og inspiratorisk stridor, typisk på baggrund af viral øvre luftvejsinfektion.",
          options: [
            {
              id: "a",
              text: "Gøende hoste og inspiratorisk stridor",
              isCorrect: true,
            },
            { id: "b", text: "Pludselig smerte i læggen" },
            { id: "c", text: "Blodig urin uden hoste" },
            { id: "d", text: "Ensiding ansigtslammelse" },
          ],
        },
        {
          id: "w44_q7",
          category: "Croup",
          text: "Hvad er stridor?",
          explanation:
            "Stridor er en højfrekvent respirationslyd, ofte inspiratorisk, som kan tyde på obstruktion i øvre luftvej.",
          options: [
            {
              id: "a",
              text: "Højfrekvent lyd fra øvre luftvej",
              isCorrect: true,
            },
            { id: "b", text: "En lav mavesmerte" },
            { id: "c", text: "En type hududslæt" },
            { id: "d", text: "Normal hjertelyd" },
          ],
        },
        {
          id: "w44_q8",
          category: "Croup",
          text: "Hvilket fund kan tyde på mere alvorlig croup?",
          explanation:
            "Stridor i hvile, udtalte indtrækninger, påvirket almentilstand eller udtrætning kan tyde på mere alvorlig øvre luftvejsobstruktion.",
          options: [
            {
              id: "a",
              text: "Stridor i hvile og indtrækninger",
              isCorrect: true,
            },
            { id: "b", text: "Kun let hoste ved grin" },
            { id: "c", text: "Normal leg uden respirationsbesvær" },
            { id: "d", text: "Isoleret øm tå" },
          ],
        },
        {
          id: "w44_q9",
          category: "Croup",
          text: "Hvad er en almindelig udløsende årsag til croup?",
          explanation:
            "Croup skyldes ofte viral inflammation i de øvre luftveje, særligt omkring larynx og subglottisk område.",
          options: [
            { id: "a", text: "Viral øvre luftvejsinfektion", isCorrect: true },
            { id: "b", text: "Akut blodprop i benet" },
            { id: "c", text: "Lavt væskeindtag alene" },
            { id: "d", text: "Knoglebrud i underarmen" },
          ],
        },
        {
          id: "w44_q10",
          category: "Croup",
          text: "Hvorfor bør et barn med øvre luftvejsbesvær håndteres roligt?",
          explanation:
            "Gråd og stress kan øge respirationsarbejdet og forværre symptomer ved øvre luftvejsobstruktion.",
          options: [
            {
              id: "a",
              text: "Stress kan forværre respirationsarbejde",
              isCorrect: true,
            },
            { id: "b", text: "Barnet kan ikke mærke åndenød" },
            { id: "c", text: "Rolig håndtering fjerner alle symptomer" },
            { id: "d", text: "Det gør observation unødvendig" },
          ],
        },
        {
          id: "w44_q11",
          category: "Epiglottitis",
          text: "Hvorfor er epiglottitis en alvorlig tilstand?",
          explanation:
            "Epiglottitis kan give hurtigt udviklende hævelse omkring strubelåget og risiko for kritisk luftvejsobstruktion.",
          options: [
            {
              id: "a",
              text: "Den kan give kritisk luftvejsobstruktion",
              isCorrect: true,
            },
            { id: "b", text: "Den påvirker kun tænderne" },
            { id: "c", text: "Den giver altid mild hoste alene" },
            { id: "d", text: "Den opstår kun hos voksne" },
          ],
        },
        {
          id: "w44_q12",
          category: "Epiglottitis",
          text: "Hvilket klinisk billede kan give mistanke om epiglottitis?",
          explanation:
            "Høj feber, savlen, synkebesvær, påvirket almentilstand og tripod-position kan give mistanke, men diagnosen kræver lægelig vurdering.",
          options: [
            { id: "a", text: "Feber, savlen og synkebesvær", isCorrect: true },
            { id: "b", text: "Let forkølelse og normal leg" },
            { id: "c", text: "Isoleret hudafskrabning" },
            { id: "d", text: "Smerter efter vrid i ankel" },
          ],
        },
        {
          id: "w44_q13",
          category: "Epiglottitis",
          text: "Hvorfor bør unødig undersøgelse i munden undgås ved mistanke om epiglottitis?",
          explanation:
            "Manipulation kan øge stress og potentielt forværre luftvejssituationen hos et barn med truet øvre luftvej.",
          options: [
            {
              id: "a",
              text: "Det kan forværre luftvejssituationen",
              isCorrect: true,
            },
            { id: "b", text: "Det giver altid lavt blodsukker" },
            { id: "c", text: "Det ændrer blodtypen" },
            { id: "d", text: "Det er kun relevant ved brud" },
          ],
        },
        {
          id: "w44_q14",
          category: "Epiglottitis",
          text: "Hvilket symptom passer bedre med epiglottitis end klassisk croup?",
          explanation:
            "Savlen og udtalt synkebesvær er mere bekymrende for epiglottitis end typisk viral croup.",
          options: [
            { id: "a", text: "Savlen og udtalt synkebesvær", isCorrect: true },
            { id: "b", text: "Gøende hoste uden alment påvirket barn" },
            { id: "c", text: "Kortvarig hikke" },
            { id: "d", text: "Kløe i øret" },
          ],
        },
        {
          id: "w44_q15",
          category: "Epiglottitis",
          text: "Hvad er en vigtig præhospital vurdering ved mistanke om epiglottitis?",
          explanation:
            "Luftvej, respirationsarbejde, bevidsthed og almentilstand vurderes tæt, da forværring kan ske hurtigt.",
          options: [
            {
              id: "a",
              text: "Luftvej, respirationsarbejde og almentilstand",
              isCorrect: true,
            },
            { id: "b", text: "Kun om barnet har spist slik" },
            { id: "c", text: "Kun hudtemperatur på fødderne" },
            { id: "d", text: "Kun om der er udslæt" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Symptom ↔ diagnose", "Alder ↔ risiko"],
      pairsByRound: {
        1: [
          { left: "Gøende hoste", right: "Taler for croup" },
          { left: "Stridor i hvile", right: "Alvorlig øvre obstruktion" },
          { left: "Savlen", right: "Bekymring for epiglottitis" },
          { left: "Tripod-position", right: "Kan ses ved truet luftvej" },
          { left: "Indtrækninger", right: "Øget respirationsarbejde" },
          { left: "Hæshed", right: "Kan ses ved croup" },
        ],
        2: [
          { left: "Spædbarn", right: "Små respiratoriske reserver" },
          { left: "Tumling", right: "Croup er hyppigere" },
          { left: "Små børn", right: "Snævre luftveje" },
          { left: "Skolebarn", right: "Kan beskrive symptomer bedre" },
          { left: "Uvaccineret barn", right: "Øget epiglottitis-bekymring" },
          { left: "Træt barn", right: "Risiko for udtrætning" },
        ],
      },
    },
    word: {
      topicTitle: "Børneluftvej",
      easy: ["Stridor"],
      medium: ["Ødem"],
      hard: ["Obstruktion"],
    },
  },

  "2026-W45": {
    title: "Geriatri",
    mcq: {
      rounds: ["Aldersændringer", "Polyfarmaci", "Atypiske symptomer"],
      questions: [
        {
          id: "w45_q1",
          category: "Aldersændringer",
          text: "Hvad sker der ofte med kroppens fysiologiske reserve ved aldring?",
          explanation:
            "Fysiologisk reserve falder ofte med alderen, så sygdom, traume eller dehydrering kan give hurtigere funktionstab.",
          options: [
            { id: "a", text: "Den bliver ofte mindre", isCorrect: true },
            { id: "b", text: "Den fordobles hos alle" },
            { id: "c", text: "Den påvirker kun hårvækst" },
            { id: "d", text: "Den gør sygdom umulig at opdage" },
          ],
        },
        {
          id: "w45_q2",
          category: "Aldersændringer",
          text: "Hvorfor kan dehydrering være særlig problematisk hos ældre?",
          explanation:
            "Ældre kan have nedsat tørstfornemmelse, ændret nyrefunktion og mindre reserve, hvilket kan øge risikoen for svimmelhed og konfusion.",
          options: [
            {
              id: "a",
              text: "Mindre reserve kan øge påvirkning",
              isCorrect: true,
            },
            { id: "b", text: "Ældre kan ikke miste væske" },
            { id: "c", text: "Dehydrering giver kun hudkløe" },
            { id: "d", text: "Det forbedrer nyrefunktionen" },
          ],
        },
        {
          id: "w45_q3",
          category: "Aldersændringer",
          text: "Hvilken ændring kan påvirke lægemidlers virkning hos ældre?",
          explanation:
            "Ændret nyre- og leverfunktion samt ændret kropssammensætning kan påvirke omsætning og effekt af medicin.",
          options: [
            { id: "a", text: "Ændret nyre- og leverfunktion", isCorrect: true },
            { id: "b", text: "Mere ensartet medicinrespons hos alle" },
            { id: "c", text: "Manglende behov for medicingennemgang" },
            { id: "d", text: "Øget evne til at udskille alle stoffer" },
          ],
        },
        {
          id: "w45_q4",
          category: "Aldersændringer",
          text: "Hvorfor er fald hos ældre en vigtig præhospital problemstilling?",
          explanation:
            "Fald kan skyldes akut sygdom, medicin, infektion eller kredsløbspåvirkning og kan give alvorlige skader selv ved lavenergi.",
          options: [
            {
              id: "a",
              text: "Fald kan skyldes sygdom og give alvorlig skade",
              isCorrect: true,
            },
            { id: "b", text: "Fald er aldrig relateret til akut sygdom" },
            { id: "c", text: "Fald giver kun kosmetiske skader" },
            { id: "d", text: "Fald udelukker infektion" },
          ],
        },
        {
          id: "w45_q5",
          category: "Aldersændringer",
          text: "Hvad beskriver skrøbelighed bedst i geriatrisk vurdering?",
          explanation:
            "Skrøbelighed beskriver nedsat modstandskraft mod belastninger og øget risiko for funktionstab ved sygdom.",
          options: [
            {
              id: "a",
              text: "Nedsat modstandskraft mod belastning",
              isCorrect: true,
            },
            { id: "b", text: "Kun høj alder i sig selv" },
            { id: "c", text: "En diagnose der kun ses hos børn" },
            { id: "d", text: "Normal kondition hos eliteudøvere" },
          ],
        },
        {
          id: "w45_q6",
          category: "Polyfarmaci",
          text: "Hvad betyder polyfarmaci?",
          explanation:
            "Polyfarmaci betyder brug af flere lægemidler samtidigt og kan øge risikoen for interaktioner og bivirkninger.",
          options: [
            {
              id: "a",
              text: "Brug af flere lægemidler samtidigt",
              isCorrect: true,
            },
            { id: "b", text: "Manglende adgang til medicin" },
            { id: "c", text: "En allergi mod plaster" },
            { id: "d", text: "Behandling med ilt alene" },
          ],
        },
        {
          id: "w45_q7",
          category: "Polyfarmaci",
          text: "Hvorfor er medicinlisten vigtig ved vurdering af en ældre patient?",
          explanation:
            "Medicin kan bidrage til symptomer som fald, konfusion, hypotension, blødning eller hypoglykæmi og er vigtig i overlevering.",
          options: [
            {
              id: "a",
              text: "Medicin kan forklare eller forværre symptomer",
              isCorrect: true,
            },
            { id: "b", text: "Den er kun relevant ved børn" },
            { id: "c", text: "Den viser altid præcis diagnose" },
            { id: "d", text: "Den erstatter vitalparametre" },
          ],
        },
        {
          id: "w45_q8",
          category: "Polyfarmaci",
          text: "Hvilken medicintype kan øge bekymring ved fald og hovedtraume?",
          explanation:
            "Antikoagulantia og trombocythæmmere kan øge risikoen for blødning, også hvor ydre tegn kan være begrænsede.",
          options: [
            { id: "a", text: "Blodfortyndende medicin", isCorrect: true },
            { id: "b", text: "Øjendråber uden systemisk effekt" },
            { id: "c", text: "Fugtighedscreme" },
            { id: "d", text: "Næsespray med saltvand" },
          ],
        },
        {
          id: "w45_q9",
          category: "Polyfarmaci",
          text: "Hvilket symptom kan skyldes medicinbivirkning hos ældre?",
          explanation:
            "Svimmelhed, faldtendens, konfusion og hypotension kan blandt andet være relateret til medicin eller interaktioner.",
          options: [
            { id: "a", text: "Svimmelhed og faldtendens", isCorrect: true },
            { id: "b", text: "Kun hårtab efter klipning" },
            { id: "c", text: "Altid høj feber" },
            { id: "d", text: "Isoleret fingerneglvækst" },
          ],
        },
        {
          id: "w45_q10",
          category: "Polyfarmaci",
          text: "Hvad er en relevant præhospital handling ved uklar medicinstatus?",
          explanation:
            "Medbringelse eller registrering af medicinliste, dosispakket medicin eller præparater kan hjælpe videre vurdering og behandling.",
          options: [
            {
              id: "a",
              text: "Sikre medicinoplysninger til overlevering",
              isCorrect: true,
            },
            { id: "b", text: "Kassere al medicin uden dokumentation" },
            { id: "c", text: "Gætte præparater ud fra farve" },
            { id: "d", text: "Ignorere medicin ved alle ældre" },
          ],
        },
        {
          id: "w45_q11",
          category: "Atypiske symptomer",
          text: "Hvordan kan infektion præsentere sig atypisk hos ældre?",
          explanation:
            "Ældre kan have infektion med konfusion, fald eller nedsat funktion, selv om feber og klassiske symptomer er sparsomme.",
          options: [
            {
              id: "a",
              text: "Konfusion eller fald uden tydelig feber",
              isCorrect: true,
            },
            { id: "b", text: "Altid høj feber og klassiske symptomer" },
            { id: "c", text: "Kun udslæt mellem tæerne" },
            { id: "d", text: "Infektion giver aldrig påvirket bevidsthed" },
          ],
        },
        {
          id: "w45_q12",
          category: "Atypiske symptomer",
          text: "Hvorfor er nyopstået konfusion hos en ældre patient vigtigt?",
          explanation:
            "Ny konfusion kan være tegn på akut sygdom, infektion, medicinpåvirkning, hypoksi, metabolisk problem eller neurologisk tilstand.",
          options: [
            {
              id: "a",
              text: "Det kan være tegn på akut sygdom",
              isCorrect: true,
            },
            { id: "b", text: "Det er altid normal aldring" },
            { id: "c", text: "Det udelukker infektion" },
            { id: "d", text: "Det kræver ingen vurdering" },
          ],
        },
        {
          id: "w45_q13",
          category: "Atypiske symptomer",
          text: "Hvordan kan akut koronart syndrom præsentere sig hos ældre?",
          explanation:
            "Ældre kan have mindre typiske brystsmerter og i stedet præsentere dyspnø, utilpashed, kvalme, svaghed eller konfusion.",
          options: [
            {
              id: "a",
              text: "Dyspnø, utilpashed eller svaghed",
              isCorrect: true,
            },
            { id: "b", text: "Altid klassiske trykkende brystsmerter" },
            { id: "c", text: "Kun smerter i storetåen" },
            { id: "d", text: "Kun hudkløe efter bad" },
          ],
        },
        {
          id: "w45_q14",
          category: "Atypiske symptomer",
          text: "Hvorfor er funktionsfald relevant hos ældre patienter?",
          explanation:
            "Pludseligt funktionsfald kan være et tidligt tegn på akut sygdom, også når symptomerne er uklare.",
          options: [
            {
              id: "a",
              text: "Det kan være tegn på akut sygdom",
              isCorrect: true,
            },
            { id: "b", text: "Det er kun et socialt problem" },
            { id: "c", text: "Det udelukker kredsløbspåvirkning" },
            { id: "d", text: "Det skyldes altid alder alene" },
          ],
        },
        {
          id: "w45_q15",
          category: "Atypiske symptomer",
          text: "Hvad er vigtigt ved vurdering af smerter hos ældre?",
          explanation:
            "Ældre kan underrapportere smerter eller have atypiske symptomer, så observation, anamnese og vitalparametre bør sammenholdes.",
          options: [
            {
              id: "a",
              text: "Smerter kan være atypiske eller underrapporterede",
              isCorrect: true,
            },
            { id: "b", text: "Ældre kan ikke føle smerte" },
            { id: "c", text: "Smerte udelukker alvorlig sygdom" },
            { id: "d", text: "Kun smerteintensitet afgør alvorlighed" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Alder ↔ fysiologi", "Problem ↔ konsekvens"],
      pairsByRound: {
        1: [
          { left: "Nedsat nyrefunktion", right: "Ændret medicinudskillelse" },
          { left: "Mindre tørstfornemmelse", right: "Risiko for dehydrering" },
          { left: "Nedsat reserve", right: "Hurtigere funktionstab" },
          { left: "Skrøbelighed", right: "Sårbar ved akut sygdom" },
          { left: "Nedsat muskelmasse", right: "Øget faldrisiko" },
          { left: "Ændret termoregulation", right: "Atypisk infektionstegn" },
        ],
        2: [
          { left: "Polyfarmaci", right: "Interaktioner og bivirkninger" },
          { left: "Fald", right: "Fraktur eller hovedtraume" },
          { left: "Konfusion", right: "Kan dække over infektion" },
          { left: "Blodfortyndende medicin", right: "Øget blødningsrisiko" },
          { left: "Dehydrering", right: "Svimmelhed og nyrepåvirkning" },
          { left: "Funktionsfald", right: "Muligt akut sygdomstegn" },
        ],
      },
    },
    word: {
      topicTitle: "Aldring",
      easy: ["Skrøbelig"],
      medium: ["Kognitiv"],
      hard: ["Multisygdom"],
    },
  },
  "2026-W46": {
    title: "Hjertesvigt",
    mcq: {
      rounds: ["Pumpefunktion", "Lungeødem", "Kompensation"],
      questions: [
        {
          id: "w46_q1",
          category: "Pumpefunktion",
          text: "Hvad beskriver hjertesvigt bedst?",
          explanation:
            "Hjertesvigt betyder, at hjertet ikke kan pumpe tilstrækkeligt blod til kroppens behov uden forhøjet fyldningstryk.",
          options: [
            {
              id: "a",
              text: "Nedsat evne til at pumpe blod effektivt",
              isCorrect: true,
            },
            { id: "b", text: "For hurtig produktion af røde blodlegemer" },
            { id: "c", text: "Infektion i hjertets ledningssystem" },
            { id: "d", text: "Blodprop i en perifer vene" },
          ],
        },
        {
          id: "w46_q2",
          category: "Pumpefunktion",
          text: "Hvad betyder nedsat slagvolumen?",
          explanation:
            "Slagvolumen er den mængde blod, hjertet pumper ud pr. slag. Ved hjertesvigt kan slagvolumen være reduceret.",
          options: [
            {
              id: "a",
              text: "Mindre blod pumpes ud pr. hjerteslag",
              isCorrect: true,
            },
            { id: "b", text: "Hjertet slår kun i diastolen" },
            { id: "c", text: "Blodtrykket er altid normalt" },
            { id: "d", text: "Lungerne optager mere ilt end normalt" },
          ],
        },
        {
          id: "w46_q3",
          category: "Pumpefunktion",
          text: "Hvad kan øget preload betyde for et svækket hjerte?",
          explanation:
            "Preload er fyldningen før kontraktion. Et svækket hjerte kan have svært ved at håndtere øget fyldning.",
          options: [
            { id: "a", text: "Øget belastning af ventriklen", isCorrect: true },
            { id: "b", text: "Mindre venøst tilbageløb" },
            { id: "c", text: "Ophævet behov for ilt" },
            { id: "d", text: "Sikker normalisering af puls" },
          ],
        },
        {
          id: "w46_q4",
          category: "Pumpefunktion",
          text: "Hvad beskriver afterload?",
          explanation:
            "Afterload er den modstand, hjertet skal pumpe imod. Højt afterload kan gøre pumpearbejdet sværere.",
          options: [
            {
              id: "a",
              text: "Modstanden hjertet pumper imod",
              isCorrect: true,
            },
            { id: "b", text: "Blodets iltindhold i kapillærer" },
            { id: "c", text: "Mængden af lymfe i vævet" },
            { id: "d", text: "Tiden mellem to vejrtrækninger" },
          ],
        },
        {
          id: "w46_q5",
          category: "Pumpefunktion",
          text: "Hvorfor kan hjertesvigt give træthed og nedsat præstation?",
          explanation:
            "Reduceret minutvolumen kan give nedsat perfusion af muskler og organer, hvilket kan opleves som træthed.",
          options: [
            {
              id: "a",
              text: "Kroppens væv får mindre effektiv perfusion",
              isCorrect: true,
            },
            { id: "b", text: "Blodet bliver sterilt" },
            { id: "c", text: "Lungerne stopper med at danne surfaktant" },
            { id: "d", text: "Nyrefunktionen øges kraftigt" },
          ],
        },
        {
          id: "w46_q6",
          category: "Lungeødem",
          text: "Hvad er en central mekanisme bag kardiogent lungeødem?",
          explanation:
            "Ved venstresidigt hjertesvigt kan trykket stige bagud i lungekredsløbet, så væske trænger ud i lungevævet.",
          options: [
            {
              id: "a",
              text: "Forhøjet tryk i lungekredsløbet",
              isCorrect: true,
            },
            { id: "b", text: "For lav produktion af galde" },
            { id: "c", text: "Øget knogletæthed i thorax" },
            { id: "d", text: "Blokering af colon" },
          ],
        },
        {
          id: "w46_q7",
          category: "Lungeødem",
          text: "Hvilket symptom passer typisk med væske i lungerne?",
          explanation:
            "Dyspnø er et hyppigt symptom ved lungeødem, fordi gasudvekslingen bliver dårligere.",
          options: [
            { id: "a", text: "Tiltagende åndenød", isCorrect: true },
            { id: "b", text: "Isoleret øresmerte" },
            { id: "c", text: "Kløe mellem tæerne" },
            { id: "d", text: "Lokal albuesmerte" },
          ],
        },
        {
          id: "w46_q8",
          category: "Lungeødem",
          text: "Hvad kan krepitationer ved lungestetoskopi være udtryk for?",
          explanation:
            "Fine krepitationer kan ses ved væske i alveoler eller interstitium, men fundet skal vurderes sammen med hele patientbilledet.",
          options: [
            {
              id: "a",
              text: "Væskeprægede forandringer i lungerne",
              isCorrect: true,
            },
            { id: "b", text: "Sikker pneumothorax" },
            { id: "c", text: "Normal luftvej hos alle patienter" },
            { id: "d", text: "Blødning i mavesækken" },
          ],
        },
        {
          id: "w46_q9",
          category: "Lungeødem",
          text: "Hvorfor kan patienten med lungeødem ofte foretrække at sidde op?",
          explanation:
            "Oprejst stilling kan mindske venøst tilbageløb og lette vejrtrækningen, selvom effekten varierer.",
          options: [
            { id: "a", text: "Det kan lette vejrtrækningen", isCorrect: true },
            { id: "b", text: "Det fjerner årsagen permanent" },
            { id: "c", text: "Det sænker altid pulsen til normal" },
            { id: "d", text: "Det lukker alveolerne helt" },
          ],
        },
        {
          id: "w46_q10",
          category: "Lungeødem",
          text: "Hvad kan skummende ekspektorat ved svær dyspnø give mistanke om?",
          explanation:
            "Skummende opspyt kan ses ved lungeødem, men er ikke alene diagnostisk og skal tolkes i kontekst.",
          options: [
            { id: "a", text: "Muligt lungeødem", isCorrect: true },
            { id: "b", text: "Isoleret dehydrering" },
            { id: "c", text: "Blindtarmsbetændelse" },
            { id: "d", text: "Akut nyresten uden påvirkning" },
          ],
        },
        {
          id: "w46_q11",
          category: "Kompensation",
          text: "Hvorfor kan pulsen stige ved akut hjertesvigt?",
          explanation:
            "Sympatikus kan øge pulsen for at forsøge at opretholde minutvolumen, når slagvolumen falder.",
          options: [
            {
              id: "a",
              text: "For at kompensere for lavere slagvolumen",
              isCorrect: true,
            },
            { id: "b", text: "Fordi blodet ikke længere indeholder plasma" },
            { id: "c", text: "Fordi nyrerne stopper al hormonproduktion" },
            { id: "d", text: "For at sænke kroppens iltbehov" },
          ],
        },
        {
          id: "w46_q12",
          category: "Kompensation",
          text: "Hvilken kompensationsmekanisme kan give væskeretention ved hjertesvigt?",
          explanation:
            "RAAS-aktivering kan øge salt- og væskeretention, hvilket kan forværre ødemtendens.",
          options: [
            { id: "a", text: "Aktivering af RAAS", isCorrect: true },
            { id: "b", text: "Nedsat ADH ved alle patienter" },
            { id: "c", text: "Ophævet nyregennemblødning uden effekt" },
            { id: "d", text: "Direkte nedbrydning af hæmoglobin" },
          ],
        },
        {
          id: "w46_q13",
          category: "Kompensation",
          text: "Hvad kan perifere ødemer ved hjertesvigt afspejle?",
          explanation:
            "Perifere ødemer kan skyldes venøs stase og væskeretention, især ved højresidigt eller globalt svigt.",
          options: [
            { id: "a", text: "Væskeretention og venøs stase", isCorrect: true },
            { id: "b", text: "Øget iltoptag i hudceller" },
            { id: "c", text: "Sikker allergisk reaktion" },
            { id: "d", text: "Lavt tryk i alle vener" },
          ],
        },
        {
          id: "w46_q14",
          category: "Kompensation",
          text: "Hvorfor er hud, bevidsthed og diurese relevante ved kredsløbsvurdering?",
          explanation:
            "Disse fund kan give indirekte information om perfusion, men skal vurderes sammen med vitale værdier og klinik.",
          options: [
            {
              id: "a",
              text: "De kan afspejle organperfusion",
              isCorrect: true,
            },
            { id: "b", text: "De bekræfter altid hjertestop" },
            { id: "c", text: "De måler direkte koronarkar" },
            { id: "d", text: "De erstatter al anden vurdering" },
          ],
        },
        {
          id: "w46_q15",
          category: "Kompensation",
          text: "Hvad kan langvarig kompensation ved hjertesvigt medføre?",
          explanation:
            "Kompensationsmekanismer kan kortvarigt støtte kredsløbet, men kan over tid øge belastningen på hjertet.",
          options: [
            {
              id: "a",
              text: "Øget belastning og symptomforværring",
              isCorrect: true,
            },
            { id: "b", text: "Permanent helbredelse af hjertemusklen" },
            { id: "c", text: "Ophør af behov for ilttransport" },
            { id: "d", text: "Sikker lavere vægt uden væsketab" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Symptom ↔ mekanisme", "Fund ↔ svigt"],
      pairsByRound: {
        1: [
          { left: "Dyspnø", right: "Nedsat gasudveksling" },
          { left: "Ortopnø", right: "Øget venøst tilbageløb liggende" },
          { left: "Træthed", right: "Lavere minutvolumen" },
          { left: "Ankelødem", right: "Væskeretention" },
          { left: "Hoste", right: "Stase i lungekredsløb" },
          { left: "Svimmelhed", right: "Mulig lav cerebral perfusion" },
        ],
        2: [
          { left: "Krepitationer", right: "Taler for lungepåvirkning" },
          { left: "Halsvenestase", right: "Kan pege mod højresidigt svigt" },
          { left: "Blege ekstremiteter", right: "Kan afspejle lav perfusion" },
          { left: "Takykardi", right: "Sympatisk kompensation" },
          { left: "Lav saturation", right: "Mulig respiratorisk påvirkning" },
          { left: "Perifere ødemer", right: "Kan ses ved venøs stase" },
        ],
      },
    },
    word: {
      topicTitle: "Hjertesvigt",
      easy: ["Ødem"],
      medium: ["Dyspnø"],
      hard: ["Afterload"],
    },
  },

  "2026-W47": {
    title: "Metabolisme",
    mcq: {
      rounds: ["Aerob vs anaerob", "Laktat", "ATP"],
      questions: [
        {
          id: "w47_q1",
          category: "Aerob vs anaerob",
          text: "Hvad kendetegner aerob metabolisme?",
          explanation:
            "Aerob metabolisme bruger ilt i mitokondrierne og giver effektiv ATP-produktion fra næringsstoffer.",
          options: [
            {
              id: "a",
              text: "Den kræver ilt og giver relativt meget ATP",
              isCorrect: true,
            },
            { id: "b", text: "Den foregår kun uden glukose" },
            { id: "c", text: "Den danner ingen energi" },
            { id: "d", text: "Den sker kun i røde blodlegemer" },
          ],
        },
        {
          id: "w47_q2",
          category: "Aerob vs anaerob",
          text: "Hvornår øges anaerob metabolisme typisk?",
          explanation:
            "Anaerob metabolisme øges, når vævets iltforsyning ikke dækker energibehovet, fx ved hypoperfusion.",
          options: [
            {
              id: "a",
              text: "Når ilttilbuddet er utilstrækkeligt",
              isCorrect: true,
            },
            { id: "b", text: "Når alle celler får overskud af ilt" },
            { id: "c", text: "Når hjertet pumper mere end normalt" },
            { id: "d", text: "Når laktat fjernes øjeblikkeligt" },
          ],
        },
        {
          id: "w47_q3",
          category: "Aerob vs anaerob",
          text: "Hvilken proces giver mest ATP pr. glukosemolekyle?",
          explanation:
            "Aerob forbrænding giver markant mere ATP end anaerob glykolyse, fordi mitokondrierne udnytter energien bedre.",
          options: [
            { id: "a", text: "Aerob metabolisme", isCorrect: true },
            { id: "b", text: "Anaerob glykolyse" },
            { id: "c", text: "Passiv diffusion" },
            { id: "d", text: "Osmose over cellemembranen" },
          ],
        },
        {
          id: "w47_q4",
          category: "Aerob vs anaerob",
          text: "Hvorfor er perfusion vigtig for aerob metabolisme?",
          explanation:
            "Perfusion bringer ilt og substrater til vævet og fjerner affaldsstoffer, hvilket understøtter aerob energiomsætning.",
          options: [
            {
              id: "a",
              text: "Den leverer ilt og næring til celler",
              isCorrect: true,
            },
            { id: "b", text: "Den fjerner alt behov for ATP" },
            { id: "c", text: "Den stopper mitokondrierne" },
            { id: "d", text: "Den omdanner leukocytter til trombocytter" },
          ],
        },
        {
          id: "w47_q5",
          category: "Aerob vs anaerob",
          text: "Hvad kan celler mangle ved shock, selv hvis luften indeholder normal ilt?",
          explanation:
            "Ved shock kan vævene mangle effektiv iltlevering på grund af nedsat cirkulation eller ilttransport.",
          options: [
            { id: "a", text: "Tilstrækkelig iltlevering", isCorrect: true },
            { id: "b", text: "Atmosfærisk kvælstof" },
            { id: "c", text: "Mavesyre i plasma" },
            { id: "d", text: "Knoglemarv i alveoler" },
          ],
        },
        {
          id: "w47_q6",
          category: "Laktat",
          text: "Hvad er laktat ofte et tegn på i akut klinisk vurdering?",
          explanation:
            "Forhøjet laktat kan afspejle øget anaerob metabolisme eller stressrespons, men årsagen skal vurderes klinisk.",
          options: [
            {
              id: "a",
              text: "Mulig vævshypoksi eller metabolisk stress",
              isCorrect: true,
            },
            { id: "b", text: "Sikker normal vævsperfusion" },
            { id: "c", text: "Kun nyresten" },
            { id: "d", text: "Fravær af inflammation" },
          ],
        },
        {
          id: "w47_q7",
          category: "Laktat",
          text: "Hvor dannes laktat især under iltmangel?",
          explanation:
            "Laktat dannes ved anaerob glykolyse, når pyruvat omdannes for at holde glykolysen i gang.",
          options: [
            {
              id: "a",
              text: "Ved anaerob glykolyse i celler",
              isCorrect: true,
            },
            { id: "b", text: "Kun i alveolernes luft" },
            { id: "c", text: "Kun i knoglevæv" },
            { id: "d", text: "I galdeblæren som hovedfunktion" },
          ],
        },
        {
          id: "w47_q8",
          category: "Laktat",
          text: "Hvorfor kan laktat være forhøjet ved sepsis?",
          explanation:
            "Ved sepsis kan mikrocirkulation, cellestofskifte og iltudnyttelse være påvirket, så laktat kan stige.",
          options: [
            {
              id: "a",
              text: "Påvirket perfusion og cellemetabolisme",
              isCorrect: true,
            },
            { id: "b", text: "Fordi blodet ikke indeholder vand" },
            { id: "c", text: "Fordi trombocytter bliver til ilt" },
            { id: "d", text: "Fordi lungerne producerer glukose" },
          ],
        },
        {
          id: "w47_q9",
          category: "Laktat",
          text: "Hvad betyder faldende laktat over tid ofte i monitorering?",
          explanation:
            "Faldende laktat kan være et positivt tegn på bedre perfusion eller metabolisk kontrol, men skal tolkes med patientens samlede tilstand.",
          options: [
            {
              id: "a",
              text: "Mulig bedring i perfusion eller metabolisme",
              isCorrect: true,
            },
            { id: "b", text: "Sikker forværring hos alle patienter" },
            { id: "c", text: "Ophør af behov for observation" },
            { id: "d", text: "Diagnose af fraktur" },
          ],
        },
        {
          id: "w47_q10",
          category: "Laktat",
          text: "Hvilket organ er vigtigt for omsætning af laktat?",
          explanation:
            "Leveren spiller en central rolle i omsætning af laktat, blandt andet via glukoneogenese.",
          options: [
            { id: "a", text: "Leveren", isCorrect: true },
            { id: "b", text: "Miltens kapsel" },
            { id: "c", text: "Mellemøret" },
            { id: "d", text: "Negleroden" },
          ],
        },
        {
          id: "w47_q11",
          category: "ATP",
          text: "Hvad er ATP's vigtigste rolle i cellen?",
          explanation:
            "ATP fungerer som cellens umiddelbare energibærer og driver mange energikrævende processer.",
          options: [
            {
              id: "a",
              text: "At levere energi til celleprocesser",
              isCorrect: true,
            },
            { id: "b", text: "At transportere ilt i blodet" },
            { id: "c", text: "At danne antistoffer direkte" },
            { id: "d", text: "At erstatte cellemembranen" },
          ],
        },
        {
          id: "w47_q12",
          category: "ATP",
          text: "Hvilken cellestruktur er central for aerob ATP-produktion?",
          explanation:
            "Mitokondrierne danner størstedelen af ATP ved aerob metabolisme gennem oxidativ fosforylering.",
          options: [
            { id: "a", text: "Mitokondriet", isCorrect: true },
            { id: "b", text: "Cellekernen alene" },
            { id: "c", text: "Lysosomet som iltpumpe" },
            { id: "d", text: "Ribosomet som blodfilter" },
          ],
        },
        {
          id: "w47_q13",
          category: "ATP",
          text: "Hvorfor er ATP-mangel kritisk for celler?",
          explanation:
            "ATP-mangel kan svække ionpumper, membranpotentiale og cellens normale funktion.",
          options: [
            {
              id: "a",
              text: "Vigtige cellepumper kan svigte",
              isCorrect: true,
            },
            { id: "b", text: "Cellerne får uendelig energi" },
            { id: "c", text: "Blodtrykket bliver altid højt" },
            { id: "d", text: "Oxygen bindes stærkere til huden" },
          ],
        },
        {
          id: "w47_q14",
          category: "ATP",
          text: "Hvad bruger natrium-kalium-pumpen ATP til?",
          explanation:
            "Natrium-kalium-pumpen bruger ATP til at opretholde iongradienter over cellemembranen.",
          options: [
            { id: "a", text: "At opretholde iongradienter", isCorrect: true },
            { id: "b", text: "At danne blodplader" },
            { id: "c", text: "At fordøje proteiner i mavesækken" },
            { id: "d", text: "At transportere luft i bronkier" },
          ],
        },
        {
          id: "w47_q15",
          category: "ATP",
          text: "Hvorfor kan hypoksi påvirke bevidstheden?",
          explanation:
            "Hjernen har højt energibehov og er afhængig af ilt og glukose til ATP-produktion.",
          options: [
            {
              id: "a",
              text: "Hjernen er følsom for energimangel",
              isCorrect: true,
            },
            { id: "b", text: "Hjernen bruger ikke ATP" },
            { id: "c", text: "Hypoksi øger altid bevidstheden" },
            { id: "d", text: "Bevidsthed styres kun af knogler" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Proces ↔ iltbehov", "Tilstand ↔ metabolisme"],
      pairsByRound: {
        1: [
          { left: "Aerob metabolisme", right: "Kræver ilt" },
          { left: "Anaerob glykolyse", right: "Kan ske uden ilt" },
          { left: "Oxidativ fosforylering", right: "Foregår i mitokondrier" },
          { left: "Laktatdannelse", right: "Øges ved anaerob belastning" },
          { left: "ATP-produktion", right: "Driver cellefunktion" },
          { left: "Glykolyse", right: "Nedbryder glukose" },
        ],
        2: [
          { left: "Shock", right: "Nedsat iltlevering" },
          { left: "Sepsis", right: "Påvirket cellemetabolisme" },
          { left: "Hypoksi", right: "Mindre aerob ATP" },
          { left: "Anstrengelse", right: "Øget energibehov" },
          { left: "Leverpåvirkning", right: "Nedsat laktatclearance" },
          { left: "Hjertestop", right: "Kritisk energimangel" },
        ],
      },
    },
    word: {
      topicTitle: "Energi",
      easy: ["Ilt"],
      medium: ["Laktat"],
      hard: ["Metabolisk"],
    },
  },

  "2026-W48": {
    title: "Blodets bestanddele",
    mcq: {
      rounds: ["Erytrocytter", "Leukocytter", "Trombocytter"],
      questions: [
        {
          id: "w48_q1",
          category: "Erytrocytter",
          text: "Hvad er erytrocytternes vigtigste funktion?",
          explanation:
            "Erytrocytter transporterer ilt bundet til hæmoglobin og bidrager også til transport af kuldioxid.",
          options: [
            {
              id: "a",
              text: "Transport af ilt via hæmoglobin",
              isCorrect: true,
            },
            { id: "b", text: "Produktion af antistoffer" },
            { id: "c", text: "Primær dannelse af blodpropper" },
            { id: "d", text: "Nedbrydning af bakterier i hud" },
          ],
        },
        {
          id: "w48_q2",
          category: "Erytrocytter",
          text: "Hvad kan lav hæmoglobin medføre?",
          explanation:
            "Lav hæmoglobin kan reducere blodets iltbærende kapacitet og give træthed, dyspnø eller svimmelhed.",
          options: [
            { id: "a", text: "Nedsat iltbærende kapacitet", isCorrect: true },
            { id: "b", text: "For mange blodplader i alle tilfælde" },
            { id: "c", text: "Sikker hyperglykæmi" },
            { id: "d", text: "Øget galdeproduktion som hovedproblem" },
          ],
        },
        {
          id: "w48_q3",
          category: "Erytrocytter",
          text: "Hvor dannes de fleste blodceller hos voksne?",
          explanation:
            "Blodceller dannes primært i knoglemarven gennem hæmatopoiese.",
          options: [
            { id: "a", text: "I knoglemarven", isCorrect: true },
            { id: "b", text: "I alveolerne" },
            { id: "c", text: "I galdeblæren" },
            { id: "d", text: "I hudens yderste lag" },
          ],
        },
        {
          id: "w48_q4",
          category: "Erytrocytter",
          text: "Hvad er anæmi?",
          explanation:
            "Anæmi er en tilstand med nedsat hæmoglobin, ofte med reduceret evne til at transportere ilt.",
          options: [
            { id: "a", text: "Nedsat hæmoglobin i blodet", isCorrect: true },
            { id: "b", text: "Forhøjet antal leukocytter alene" },
            { id: "c", text: "Blødning kun i hjernen" },
            { id: "d", text: "Mangel på mavesyre" },
          ],
        },
        {
          id: "w48_q5",
          category: "Erytrocytter",
          text: "Hvorfor kan akut blødning give kredsløbspåvirkning?",
          explanation:
            "Akut blodtab kan reducere cirkulerende volumen og ilttransport, hvilket kan føre til hypoperfusion.",
          options: [
            {
              id: "a",
              text: "Volumen og ilttransport kan falde",
              isCorrect: true,
            },
            { id: "b", text: "Blodet bliver mere basisk med det samme" },
            { id: "c", text: "Leukocytter stopper al respiration" },
            { id: "d", text: "Trombocytter bliver til neuroner" },
          ],
        },
        {
          id: "w48_q6",
          category: "Leukocytter",
          text: "Hvad er leukocytternes overordnede funktion?",
          explanation:
            "Leukocytter er hvide blodlegemer og en vigtig del af immunforsvaret mod infektion og inflammation.",
          options: [
            { id: "a", text: "At deltage i immunforsvaret", isCorrect: true },
            { id: "b", text: "At transportere mest ilt" },
            { id: "c", text: "At danne plasmaets vand" },
            { id: "d", text: "At styre knoglernes længde" },
          ],
        },
        {
          id: "w48_q7",
          category: "Leukocytter",
          text: "Hvad kan forhøjede leukocytter være foreneligt med?",
          explanation:
            "Forhøjede leukocytter kan ses ved infektion, inflammation, stressrespons og andre tilstande.",
          options: [
            { id: "a", text: "Infektion eller inflammation", isCorrect: true },
            { id: "b", text: "Sikker fravær af sygdom" },
            { id: "c", text: "Kun lavt blodsukker" },
            { id: "d", text: "Direkte mål for saturation" },
          ],
        },
        {
          id: "w48_q8",
          category: "Leukocytter",
          text: "Hvilken type leukocyt forbindes ofte med bakterielle infektioner?",
          explanation:
            "Neutrofile granulocytter stiger ofte ved bakterielle infektioner, men fundet er ikke alene diagnostisk.",
          options: [
            { id: "a", text: "Neutrofile granulocytter", isCorrect: true },
            { id: "b", text: "Erytrocytter" },
            { id: "c", text: "Trombocytter" },
            { id: "d", text: "Megakaryocytter som iltbærere" },
          ],
        },
        {
          id: "w48_q9",
          category: "Leukocytter",
          text: "Hvad kan meget lave leukocytter betyde i en akut vurdering?",
          explanation:
            "Leukopeni kan være forbundet med svækket infektionsrespons eller alvorlig sygdom og kræver klinisk kontekst.",
          options: [
            { id: "a", text: "Muligt svækket immunrespons", isCorrect: true },
            { id: "b", text: "Sikker normal infektionsevne" },
            { id: "c", text: "For meget hæmoglobin" },
            { id: "d", text: "Øget blodpladeklumpning alene" },
          ],
        },
        {
          id: "w48_q10",
          category: "Leukocytter",
          text: "Hvilke leukocytter er centrale i antistofproduktion?",
          explanation:
            "B-lymfocytter kan udvikle sig til plasmaceller, som producerer antistoffer.",
          options: [
            { id: "a", text: "B-lymfocytter", isCorrect: true },
            { id: "b", text: "Erytrocytter" },
            { id: "c", text: "Blodplader" },
            { id: "d", text: "Alveoleceller" },
          ],
        },
        {
          id: "w48_q11",
          category: "Trombocytter",
          text: "Hvad er trombocytternes vigtigste rolle?",
          explanation:
            "Trombocytter er centrale i den primære hæmostase og hjælper med at danne en blodpladeprop.",
          options: [
            { id: "a", text: "At bidrage til hæmostase", isCorrect: true },
            { id: "b", text: "At bære ilt i hæmoglobin" },
            { id: "c", text: "At producere insulin" },
            { id: "d", text: "At ventilere alveolerne" },
          ],
        },
        {
          id: "w48_q12",
          category: "Trombocytter",
          text: "Hvad kan trombocytopeni øge risikoen for?",
          explanation:
            "Lavt trombocyttal kan øge blødningstendens, afhængigt af årsag og sværhedsgrad.",
          options: [
            { id: "a", text: "Blødningstendens", isCorrect: true },
            { id: "b", text: "Bedre koagulation" },
            { id: "c", text: "Højere saturation" },
            { id: "d", text: "Sikker hypertensiv krise" },
          ],
        },
        {
          id: "w48_q13",
          category: "Trombocytter",
          text: "Hvad er petekkier?",
          explanation:
            "Petekkier er små punktformede hudblødninger, som blandt andet kan ses ved trombocytproblemer eller alvorlig infektion.",
          options: [
            {
              id: "a",
              text: "Små punktformede hudblødninger",
              isCorrect: true,
            },
            { id: "b", text: "Store luftfyldte blærer i lungen" },
            { id: "c", text: "Hævelse af knoglemarven" },
            { id: "d", text: "Normal kapillærpuls" },
          ],
        },
        {
          id: "w48_q14",
          category: "Trombocytter",
          text: "Hvad aktiveres typisk, når trombocytter møder beskadiget karvæg?",
          explanation:
            "Trombocytter adhærerer og aktiveres ved karvægsbeskadigelse, hvilket hjælper med at starte hæmostasen.",
          options: [
            { id: "a", text: "Primær hæmostase", isCorrect: true },
            { id: "b", text: "Alveolær ventilation" },
            { id: "c", text: "Galdesekretion" },
            { id: "d", text: "Nerveledning i synsnerven" },
          ],
        },
        {
          id: "w48_q15",
          category: "Trombocytter",
          text: "Hvorfor er både trombocytter og koagulationsfaktorer vigtige?",
          explanation:
            "Trombocytter danner en primær prop, mens koagulationssystemet stabiliserer proppen med fibrin.",
          options: [
            {
              id: "a",
              text: "De samarbejder om stabil blodstandsning",
              isCorrect: true,
            },
            { id: "b", text: "De erstatter hjertets pumpefunktion" },
            { id: "c", text: "De styrer glukoseoptag i hjernen" },
            { id: "d", text: "De fjerner behovet for plasma" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Celle ↔ funktion", "Mangel ↔ symptom"],
      pairsByRound: {
        1: [
          { left: "Erytrocyt", right: "Transporterer ilt" },
          { left: "Leukocyt", right: "Deltager i immunforsvar" },
          { left: "Trombocyt", right: "Bidrager til hæmostase" },
          { left: "Neutrofil", right: "Reagerer ofte ved bakterier" },
          { left: "B-lymfocyt", right: "Kan danne antistoffer" },
          { left: "Plasma", right: "Transporterer opløste stoffer" },
        ],
        2: [
          { left: "Lav hæmoglobin", right: "Træthed og dyspnø" },
          { left: "Lav trombocyt", right: "Blødningstendens" },
          { left: "Lav leukocyt", right: "Svækket infektionsforsvar" },
          { left: "Jernmangel", right: "Kan give anæmi" },
          { left: "Akut blodtab", right: "Hypoperfusion" },
          { left: "Koagulationsmangel", right: "Forlænget blødning" },
        ],
      },
    },
    word: {
      topicTitle: "Blod",
      easy: ["Røde blodlegemer"],
      medium: ["Hæmoglobin"],
      hard: ["Hæmatologi"],
    },
  },

  "2026-W49": {
    title: "Neurologisk undersøgelse",
    mcq: {
      rounds: ["Pupiller", "Kraft", "Sensibilitet"],
      questions: [
        {
          id: "w49_q1",
          category: "Pupiller",
          text: "Hvad vurderes ved pupilundersøgelse?",
          explanation:
            "Man vurderer blandt andet størrelse, sideforskel og lysreaktion som led i neurologisk vurdering.",
          options: [
            {
              id: "a",
              text: "Størrelse, sideforskel og lysreaktion",
              isCorrect: true,
            },
            { id: "b", text: "Blodets hæmoglobin direkte" },
            { id: "c", text: "Lungernes compliance" },
            { id: "d", text: "Knæleddets stabilitet" },
          ],
        },
        {
          id: "w49_q2",
          category: "Pupiller",
          text: "Hvad betyder anisokori?",
          explanation:
            "Anisokori betyder uens pupilstørrelse. Det kan være normalt hos nogle, men kan også være klinisk relevant.",
          options: [
            { id: "a", text: "Uens pupilstørrelse", isCorrect: true },
            { id: "b", text: "Manglende hørelse" },
            { id: "c", text: "Dobbeltsidig kraftnedsættelse i ben" },
            { id: "d", text: "Forhøjet blodsukker" },
          ],
        },
        {
          id: "w49_q3",
          category: "Pupiller",
          text: "Hvorfor er nyopstået stor lysstiv pupil et alvorligt fund?",
          explanation:
            "Nyopstået lysstiv pupil kan være tegn på påvirkning af kranienerver eller trykforhold og kræver opmærksomhed.",
          options: [
            {
              id: "a",
              text: "Det kan tyde på alvorlig neurologisk påvirkning",
              isCorrect: true,
            },
            { id: "b", text: "Det beviser isoleret migræne" },
            { id: "c", text: "Det er altid et normalt fund" },
            { id: "d", text: "Det viser kun lavt blodtryk" },
          ],
        },
        {
          id: "w49_q4",
          category: "Pupiller",
          text: "Hvad undersøger lysreaktionen?",
          explanation:
            "Lysreaktionen vurderer, om pupillen trækker sig sammen ved lysstimulation via relevante nervebaner.",
          options: [
            {
              id: "a",
              text: "Om pupillen kontraherer ved lys",
              isCorrect: true,
            },
            { id: "b", text: "Om patienten har normal lungefunktion" },
            { id: "c", text: "Om blodet koagulerer normalt" },
            { id: "d", text: "Om leveren danner galde" },
          ],
        },
        {
          id: "w49_q5",
          category: "Pupiller",
          text: "Hvorfor sammenlignes højre og venstre pupil?",
          explanation:
            "Sideforskel kan give vigtig information om neurologisk påvirkning, øjenskade eller normal variation.",
          options: [
            {
              id: "a",
              text: "Sideforskel kan være klinisk relevant",
              isCorrect: true,
            },
            { id: "b", text: "Pupiller må kun vurderes enkeltvis" },
            { id: "c", text: "Pupilstørrelse bestemmer blodtype" },
            { id: "d", text: "Begge pupiller er altid identiske" },
          ],
        },
        {
          id: "w49_q6",
          category: "Kraft",
          text: "Hvad vurderer man ved kraftundersøgelse?",
          explanation:
            "Kraftundersøgelse vurderer motorisk funktion og kan afsløre pareser eller sideforskel.",
          options: [
            {
              id: "a",
              text: "Motorisk styrke og sideforskel",
              isCorrect: true,
            },
            { id: "b", text: "Blodets koagulationstid" },
            { id: "c", text: "Mavesækkens syreproduktion" },
            { id: "d", text: "Hudens temperatur alene" },
          ],
        },
        {
          id: "w49_q7",
          category: "Kraft",
          text: "Hvad er parese?",
          explanation:
            "Parese betyder nedsat kraft eller delvis lammelse og kan være tegn på neurologisk påvirkning.",
          options: [
            {
              id: "a",
              text: "Nedsat kraft eller delvis lammelse",
              isCorrect: true,
            },
            { id: "b", text: "Øget urinproduktion" },
            { id: "c", text: "Normal pupilreaktion" },
            { id: "d", text: "Forhøjet kropstemperatur" },
          ],
        },
        {
          id: "w49_q8",
          category: "Kraft",
          text: "Hvorfor er armsvækkelse på én side et vigtigt fund?",
          explanation:
            "Nyopstået ensidig kraftnedsættelse kan være forenelig med stroke eller anden fokal neurologisk påvirkning.",
          options: [
            {
              id: "a",
              text: "Det kan tyde på fokal neurologisk påvirkning",
              isCorrect: true,
            },
            { id: "b", text: "Det beviser lavt blodsukker alene" },
            { id: "c", text: "Det udelukker stroke" },
            { id: "d", text: "Det viser kun muskelømhed" },
          ],
        },
        {
          id: "w49_q9",
          category: "Kraft",
          text: "Hvad kan pronator drift afsløre?",
          explanation:
            "Pronator drift kan vise diskret motorisk svaghed i en arm og bruges som del af neurologisk screening.",
          options: [
            {
              id: "a",
              text: "Diskret kraftnedsættelse i arm",
              isCorrect: true,
            },
            { id: "b", text: "Nedsat nyrefunktion" },
            { id: "c", text: "Forhøjet laktat direkte" },
            { id: "d", text: "Pneumothorax" },
          ],
        },
        {
          id: "w49_q10",
          category: "Kraft",
          text: "Hvorfor vurderes kraft ofte bilateralt?",
          explanation:
            "Sammenligning mellem siderne kan afsløre asymmetri, som kan være klinisk vigtig.",
          options: [
            { id: "a", text: "For at finde asymmetri", isCorrect: true },
            { id: "b", text: "For at måle blodtype" },
            { id: "c", text: "For at erstatte ABCDE" },
            { id: "d", text: "For at beregne temperatur" },
          ],
        },
        {
          id: "w49_q11",
          category: "Sensibilitet",
          text: "Hvad betyder sensibilitet i neurologisk undersøgelse?",
          explanation:
            "Sensibilitet handler om følesans, fx berøring, smerte og temperatur, afhængigt af undersøgelsen.",
          options: [
            { id: "a", text: "Følesans", isCorrect: true },
            { id: "b", text: "Pumpefunktion" },
            { id: "c", text: "Blodets iltmætning" },
            { id: "d", text: "Nyrefiltration" },
          ],
        },
        {
          id: "w49_q12",
          category: "Sensibilitet",
          text: "Hvorfor sammenlignes sensibilitet på begge sider af kroppen?",
          explanation:
            "Sideforskel i sensibilitet kan pege mod påvirkning af perifere nerver, rygmarv eller centralnervesystem.",
          options: [
            {
              id: "a",
              text: "Sideforskel kan være neurologisk relevant",
              isCorrect: true,
            },
            { id: "b", text: "Følesans er altid ens hos alle" },
            { id: "c", text: "Det måler direkte blodsukker" },
            { id: "d", text: "Det udelukker alle akutte tilstande" },
          ],
        },
        {
          id: "w49_q13",
          category: "Sensibilitet",
          text: "Hvad kan føleforstyrrelser i et dermatom tyde på?",
          explanation:
            "Føleforstyrrelser i et dermatom kan være forenelige med påvirkning af en nerverod.",
          options: [
            { id: "a", text: "Mulig nerverodspåvirkning", isCorrect: true },
            { id: "b", text: "Sikker hjertesvigt" },
            { id: "c", text: "Normal fordøjelse" },
            { id: "d", text: "Forhøjet hæmoglobin" },
          ],
        },
        {
          id: "w49_q14",
          category: "Sensibilitet",
          text: "Hvad bør man være opmærksom på ved ny følelsesløshed efter traume?",
          explanation:
            "Ny følelsesløshed efter traume kan være tegn på nerve- eller rygmarvspåvirkning og skal tages alvorligt.",
          options: [
            {
              id: "a",
              text: "Mulig nerve- eller rygmarvspåvirkning",
              isCorrect: true,
            },
            { id: "b", text: "Sikker ufarlig hudreaktion" },
            { id: "c", text: "Kun lavt væskeindtag" },
            { id: "d", text: "Altid normal variation" },
          ],
        },
        {
          id: "w49_q15",
          category: "Sensibilitet",
          text: "Hvorfor dokumenteres både positive og negative neurologiske fund?",
          explanation:
            "Dokumentation af fund og fravær af fund hjælper med at følge udvikling og kommunikere patientens status.",
          options: [
            {
              id: "a",
              text: "For at kunne følge ændringer over tid",
              isCorrect: true,
            },
            { id: "b", text: "For at undgå vitale værdier" },
            { id: "c", text: "For at stille diagnose uden kontekst" },
            { id: "d", text: "For at erstatte anamnese" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Fund ↔ læsion", "Test ↔ funktion"],
      pairsByRound: {
        1: [
          { left: "Ensidig parese", right: "Fokal motorisk påvirkning" },
          { left: "Anisokori", right: "Uens pupilstørrelse" },
          { left: "Dermatom-udfald", right: "Mulig nerverod" },
          { left: "Facialisparese", right: "Påvirket ansigtsmotorik" },
          { left: "Sensibilitetstab", right: "Påvirket følebane" },
          { left: "Ataksi", right: "Koordinationsproblem" },
        ],
        2: [
          { left: "Pupillys", right: "Lysreaktion" },
          { left: "Håndtryk", right: "Grov kraft" },
          { left: "Armløft", right: "Pronator drift" },
          { left: "Berøringstest", right: "Følesans" },
          { left: "Finger-næse", right: "Koordination" },
          { left: "GCS", right: "Bevidsthedsniveau" },
        ],
      },
    },
    word: {
      topicTitle: "Neurologi",
      easy: ["Følesans"],
      medium: ["Motorik"],
      hard: ["Refleks"],
    },
  },

  "2026-W50": {
    title: "Endokrine akutte",
    mcq: {
      rounds: ["Binyrer", "Thyroidea", "Krise-tilstande"],
      questions: [
        {
          id: "w50_q1",
          category: "Binyrer",
          text: "Hvilket hormon fra binyrebarken er centralt i stressrespons?",
          explanation:
            "Kortisol hjælper kroppen med at håndtere stress, blandt andet via påvirkning af stofskifte og kredsløb.",
          options: [
            { id: "a", text: "Kortisol", isCorrect: true },
            { id: "b", text: "Insulin" },
            { id: "c", text: "Melatonin" },
            { id: "d", text: "Thyroxin" },
          ],
        },
        {
          id: "w50_q2",
          category: "Binyrer",
          text: "Hvad kan binyrebarkinsufficiens medføre akut?",
          explanation:
            "Manglende kortisolrespons kan give hypotension, svaghed, kvalme og påvirket almentilstand.",
          options: [
            { id: "a", text: "Hypotension og svaghed", isCorrect: true },
            { id: "b", text: "Sikker hypertension hos alle" },
            { id: "c", text: "Øget insulinproduktion som eneste problem" },
            { id: "d", text: "Forstørrede pupiller uden systemisk effekt" },
          ],
        },
        {
          id: "w50_q3",
          category: "Binyrer",
          text: "Hvilken funktion har aldosteron især?",
          explanation:
            "Aldosteron regulerer salt- og væskebalance ved at påvirke natrium- og kaliumhåndtering i nyrerne.",
          options: [
            {
              id: "a",
              text: "Regulering af natrium og væske",
              isCorrect: true,
            },
            { id: "b", text: "Transport af ilt i erytrocytter" },
            { id: "c", text: "Nedbrydning af trombocytter" },
            { id: "d", text: "Dannelse af galde" },
          ],
        },
        {
          id: "w50_q4",
          category: "Binyrer",
          text: "Hvad producerer binyremarven især?",
          explanation:
            "Binyremarven producerer katekolaminer som adrenalin og noradrenalin, der påvirker puls og karrespons.",
          options: [
            { id: "a", text: "Adrenalin og noradrenalin", isCorrect: true },
            { id: "b", text: "Hæmoglobin" },
            { id: "c", text: "Galde" },
            { id: "d", text: "Surfactant" },
          ],
        },
        {
          id: "w50_q5",
          category: "Binyrer",
          text: "Hvorfor kan infektion være farlig ved kendt binyrebarkinsufficiens?",
          explanation:
            "Infektion øger kroppens stressbehov, og utilstrækkelig kortisolrespons kan bidrage til kredsløbspåvirkning.",
          options: [
            {
              id: "a",
              text: "Kroppen kan mangle tilstrækkelig stressrespons",
              isCorrect: true,
            },
            { id: "b", text: "Infektion stopper altid thyroidea" },
            { id: "c", text: "Kortisolbehovet forsvinder" },
            { id: "d", text: "Blodtrykket bliver altid højt" },
          ],
        },
        {
          id: "w50_q6",
          category: "Thyroidea",
          text: "Hvad påvirker thyroideahormoner især?",
          explanation:
            "Thyroideahormoner regulerer stofskifte, varmeproduktion og påvirker blandt andet puls og energiniveau.",
          options: [
            { id: "a", text: "Stofskifte og energiforbrug", isCorrect: true },
            { id: "b", text: "Primær blodkoagulation" },
            { id: "c", text: "Direkte iltbinding i hæmoglobin" },
            { id: "d", text: "Mavesækkens anatomi" },
          ],
        },
        {
          id: "w50_q7",
          category: "Thyroidea",
          text: "Hvad kan hyperthyreose give?",
          explanation:
            "For højt thyroideahormonniveau kan give takykardi, varmeintolerance, uro og vægttab.",
          options: [
            { id: "a", text: "Takykardi og varmeintolerance", isCorrect: true },
            { id: "b", text: "Kun lav kropstemperatur" },
            { id: "c", text: "Sikker bradykardi hos alle" },
            { id: "d", text: "Ophævet metabolisme" },
          ],
        },
        {
          id: "w50_q8",
          category: "Thyroidea",
          text: "Hvad kan hypothyreose være forbundet med?",
          explanation:
            "Lavt thyroideahormonniveau kan give træthed, kuldeintolerance, langsom puls og nedsat metabolisme.",
          options: [
            { id: "a", text: "Træthed og kuldeintolerance", isCorrect: true },
            { id: "b", text: "Altid svær feber" },
            { id: "c", text: "Øjeblikkelig hyperventilation" },
            { id: "d", text: "For højt stofskifte" },
          ],
        },
        {
          id: "w50_q9",
          category: "Thyroidea",
          text: "Hvad kan struma betyde?",
          explanation:
            "Struma betyder forstørret skjoldbruskkirtel og kan forekomme med normal, høj eller lav hormonfunktion.",
          options: [
            { id: "a", text: "Forstørret skjoldbruskkirtel", isCorrect: true },
            { id: "b", text: "Manglende binyrer" },
            { id: "c", text: "Akut blødning i lungen" },
            { id: "d", text: "For lavt antal trombocytter" },
          ],
        },
        {
          id: "w50_q10",
          category: "Thyroidea",
          text: "Hvorfor er temperatur og puls relevante ved mistanke om thyroideaproblem?",
          explanation:
            "Thyroideahormoner påvirker både varmeproduktion og hjertefrekvens, så afvigelser kan støtte mistanken.",
          options: [
            {
              id: "a",
              text: "De afspejler påvirkning af metabolisme",
              isCorrect: true,
            },
            { id: "b", text: "De måler direkte TSH" },
            { id: "c", text: "De beviser altid infektion" },
            { id: "d", text: "De erstatter al anamnese" },
          ],
        },
        {
          id: "w50_q11",
          category: "Krise-tilstande",
          text: "Hvad er en endokrin krise?",
          explanation:
            "En endokrin krise er en akut alvorlig hormonel ubalance, som kan påvirke kredsløb, temperatur, bevidsthed og metabolisme.",
          options: [
            {
              id: "a",
              text: "Akut alvorlig hormonel ubalance",
              isCorrect: true,
            },
            { id: "b", text: "Normal variation i hårvækst" },
            { id: "c", text: "Isoleret muskelømhed" },
            { id: "d", text: "Kun en lokal hudinfektion" },
          ],
        },
        {
          id: "w50_q12",
          category: "Krise-tilstande",
          text: "Hvad kan være et faresignal ved thyrotoksisk krise?",
          explanation:
            "Svær takykardi, feber, uro og påvirket bevidsthed kan ses ved alvorlig thyroideapåvirkning.",
          options: [
            {
              id: "a",
              text: "Feber, takykardi og påvirket bevidsthed",
              isCorrect: true,
            },
            { id: "b", text: "Kun lokal ankelsmerte" },
            { id: "c", text: "Normal puls og temperatur hos alle" },
            { id: "d", text: "Isoleret lav hårvækst" },
          ],
        },
        {
          id: "w50_q13",
          category: "Krise-tilstande",
          text: "Hvad kan Addison-krise blandt andet give?",
          explanation:
            "Addison-krise kan give hypotension, mavesmerter, opkastning, svaghed og påvirket bevidsthed.",
          options: [
            {
              id: "a",
              text: "Hypotension og påvirket almentilstand",
              isCorrect: true,
            },
            { id: "b", text: "Sikker høj feber uden kredsløbspåvirkning" },
            { id: "c", text: "Kun forhøjet hæmoglobin" },
            { id: "d", text: "Altid normal elektrolytbalance" },
          ],
        },
        {
          id: "w50_q14",
          category: "Krise-tilstande",
          text: "Hvorfor kan blodsukker være relevant ved endokrine akutte tilstande?",
          explanation:
            "Hormoner påvirker glukosemetabolismen, og afvigende blodsukker kan påvirke bevidsthed og klinisk tilstand.",
          options: [
            {
              id: "a",
              text: "Hormoner påvirker glukosebalancen",
              isCorrect: true,
            },
            { id: "b", text: "Blodsukker viser direkte pupiltryk" },
            { id: "c", text: "Det udelukker alle kriser" },
            { id: "d", text: "Det måler lungeødem" },
          ],
        },
        {
          id: "w50_q15",
          category: "Krise-tilstande",
          text: "Hvorfor er medicinanamnese vigtig ved mistanke om endokrin krise?",
          explanation:
            "Steroidbehandling, thyroideamedicin og kendte diagnoser kan være vigtige spor i vurderingen.",
          options: [
            {
              id: "a",
              text: "Den kan afsløre relevante hormonsygdomme og behandlinger",
              isCorrect: true,
            },
            { id: "b", text: "Den erstatter vitale værdier" },
            { id: "c", text: "Den beviser altid årsagen" },
            { id: "d", text: "Den bruges kun ved frakturer" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Hormon ↔ funktion", "Sygdom ↔ effekt"],
      pairsByRound: {
        1: [
          { left: "Kortisol", right: "Stressrespons" },
          { left: "Aldosteron", right: "Salt- og væskebalance" },
          { left: "Adrenalin", right: "Øger sympatikusrespons" },
          { left: "Thyroxin", right: "Øger stofskifte" },
          { left: "Insulin", right: "Sænker blodsukker" },
          { left: "Glukagon", right: "Øger blodsukker" },
        ],
        2: [
          { left: "Addison-krise", right: "Kan give hypotension" },
          { left: "Hyperthyreose", right: "Kan give takykardi" },
          { left: "Hypothyreose", right: "Kan give kuldeintolerance" },
          { left: "Diabetes", right: "Påvirker glukosebalance" },
          { left: "Thyrotoksisk krise", right: "Kan give feber og uro" },
          { left: "Binyresvigt", right: "Manglende kortisolrespons" },
        ],
      },
    },
    word: {
      topicTitle: "Hormoner",
      easy: ["Stress"],
      medium: ["Kortisol"],
      hard: ["Endokrin"],
    },
  },

  "2026-W51": {
    title: "Abdominal smerte",
    mcq: {
      rounds: ["Organplacering", "Peritonitis", "Akut abdomen"],
      questions: [
        {
          id: "w51_q1",
          category: "Organplacering",
          text: "Hvilket organ ligger typisk i højre øvre kvadrant?",
          explanation:
            "Leveren ligger primært i højre øvre del af abdomen og kan give smerter her ved forskellige tilstande.",
          options: [
            { id: "a", text: "Lever", isCorrect: true },
            { id: "b", text: "Appendiks" },
            { id: "c", text: "Urinblære" },
            { id: "d", text: "Sigmoideum" },
          ],
        },
        {
          id: "w51_q2",
          category: "Organplacering",
          text: "Hvor sidder appendiks ofte anatomisk?",
          explanation:
            "Appendiks udgår fra cøkum og ligger ofte i højre nedre kvadrant, men placeringen kan variere.",
          options: [
            { id: "a", text: "Højre nedre kvadrant", isCorrect: true },
            { id: "b", text: "Venstre øvre kvadrant" },
            { id: "c", text: "Bag sternum" },
            { id: "d", text: "I thoraxhulen" },
          ],
        },
        {
          id: "w51_q3",
          category: "Organplacering",
          text: "Hvilket organ forbindes ofte med epigastriske smerter?",
          explanation:
            "Mavesæk, pancreas og galdeveje kan blandt andet give epigastriske smerter, afhængigt af klinisk billede.",
          options: [
            { id: "a", text: "Mavesæk", isCorrect: true },
            { id: "b", text: "Knæskal" },
            { id: "c", text: "Skjoldbruskkirtel" },
            { id: "d", text: "Underarmens radius" },
          ],
        },
        {
          id: "w51_q4",
          category: "Organplacering",
          text: "Hvor projiceres urinblæresmerter ofte?",
          explanation:
            "Smerter fra urinblæren opleves ofte suprapubisk, altså nederst midt på abdomen.",
          options: [
            { id: "a", text: "Suprapubisk", isCorrect: true },
            { id: "b", text: "Højre skulder alene" },
            { id: "c", text: "Venstre kæbe" },
            { id: "d", text: "Bag øret" },
          ],
        },
        {
          id: "w51_q5",
          category: "Organplacering",
          text: "Hvorfor kan smerters placering være usikker ved abdominale tilstande?",
          explanation:
            "Viscerale smerter kan være diffuse og refererede, så placering alene er ikke nok til sikker diagnose.",
          options: [
            {
              id: "a",
              text: "Viscerale smerter kan være diffuse",
              isCorrect: true,
            },
            { id: "b", text: "Alle organer ligger samme sted" },
            { id: "c", text: "Abdomen har ingen nerver" },
            { id: "d", text: "Smerter måles kun med saturation" },
          ],
        },
        {
          id: "w51_q6",
          category: "Peritonitis",
          text: "Hvad betyder peritonitis?",
          explanation:
            "Peritonitis er inflammation i bughinden og kan være tegn på alvorlig intraabdominal sygdom.",
          options: [
            { id: "a", text: "Inflammation i bughinden", isCorrect: true },
            { id: "b", text: "Blodprop i hjernestammen" },
            { id: "c", text: "Infektion i mellemøret" },
            { id: "d", text: "Brud på underarmen" },
          ],
        },
        {
          id: "w51_q7",
          category: "Peritonitis",
          text: "Hvad er slipømhed?",
          explanation:
            "Slipømhed er smerte, når tryk på abdomen slippes, og kan være tegn på peritoneal irritation.",
          options: [
            { id: "a", text: "Smerte når trykket slippes", isCorrect: true },
            { id: "b", text: "Smerte kun ved inspiration" },
            { id: "c", text: "Manglende pupilreaktion" },
            { id: "d", text: "Nedsat kraft i arm" },
          ],
        },
        {
          id: "w51_q8",
          category: "Peritonitis",
          text: "Hvad kan défense være udtryk for?",
          explanation:
            "Défense er muskulær spænding i bugvæggen, som kan ses ved peritoneal irritation.",
          options: [
            { id: "a", text: "Peritoneal irritation", isCorrect: true },
            { id: "b", text: "Normal afslappet bugvæg" },
            { id: "c", text: "Sikker lungeemboli" },
            { id: "d", text: "Lavt hæmoglobin alene" },
          ],
        },
        {
          id: "w51_q9",
          category: "Peritonitis",
          text: "Hvorfor kan patienten med peritonitis ligge meget stille?",
          explanation:
            "Bevægelse kan forværre smerter ved peritoneal irritation, så patienten kan instinktivt ligge stille.",
          options: [
            {
              id: "a",
              text: "Bevægelse kan forværre smerterne",
              isCorrect: true,
            },
            { id: "b", text: "Bevægelse fjerner altid årsagen" },
            { id: "c", text: "Peritonitis giver ingen smerter" },
            { id: "d", text: "Det skyldes kun lavt blodsukker" },
          ],
        },
        {
          id: "w51_q10",
          category: "Peritonitis",
          text: "Hvilket fund kan støtte mistanke om peritoneal irritation?",
          explanation:
            "Direkte ømhed, slipømhed, défense og smerte ved bevægelse kan støtte mistanken, men er ikke alene diagnostiske.",
          options: [
            { id: "a", text: "Défense og slipømhed", isCorrect: true },
            { id: "b", text: "Normal abdomen uden smerter" },
            { id: "c", text: "Isoleret hoste uden mavesmerter" },
            { id: "d", text: "Kun kløe i huden" },
          ],
        },
        {
          id: "w51_q11",
          category: "Akut abdomen",
          text: "Hvad menes med akut abdomen?",
          explanation:
            "Akut abdomen beskriver et alvorligt akut mavebillede, hvor hurtig vurdering og videre udredning kan være nødvendig.",
          options: [
            {
              id: "a",
              text: "Akut alvorligt abdominalt sygdomsbillede",
              isCorrect: true,
            },
            { id: "b", text: "Normal appetit efter måltid" },
            { id: "c", text: "Kun forstoppelse uden smerter" },
            { id: "d", text: "Isoleret hududslæt" },
          ],
        },
        {
          id: "w51_q12",
          category: "Akut abdomen",
          text: "Hvilket tegn er et vigtigt red flag ved mavesmerter?",
          explanation:
            "Hypotension, påvirket bevidsthed, peritoneale tegn eller mistanke om blødning er alvorlige fund.",
          options: [
            {
              id: "a",
              text: "Hypotension og påvirket almentilstand",
              isCorrect: true,
            },
            { id: "b", text: "Let sult før frokost" },
            { id: "c", text: "Kortvarig hikke alene" },
            { id: "d", text: "Normal hudfarve som eneste fund" },
          ],
        },
        {
          id: "w51_q13",
          category: "Akut abdomen",
          text: "Hvorfor er graviditet relevant ved akutte mavesmerter?",
          explanation:
            "Graviditet kan ændre differentialdiagnoser og risikovurdering, blandt andet ved ektopisk graviditet.",
          options: [
            {
              id: "a",
              text: "Det kan ændre alvorlige differentialdiagnoser",
              isCorrect: true,
            },
            { id: "b", text: "Det udelukker blødning" },
            { id: "c", text: "Det gør abdomen smertefri" },
            { id: "d", text: "Det fjerner behovet for vitale værdier" },
          ],
        },
        {
          id: "w51_q14",
          category: "Akut abdomen",
          text: "Hvorfor spørges der til afføring, vandladning og opkast?",
          explanation:
            "Disse symptomer kan pege mod gastrointestinal, urologisk eller systemisk årsag til smerterne.",
          options: [
            {
              id: "a",
              text: "De hjælper med differentialdiagnoser",
              isCorrect: true,
            },
            { id: "b", text: "De erstatter objektiv undersøgelse" },
            { id: "c", text: "De viser direkte EKG-forandringer" },
            { id: "d", text: "De bruges kun ved hovedtraume" },
          ],
        },
        {
          id: "w51_q15",
          category: "Akut abdomen",
          text: "Hvorfor kan ældre have atypiske symptomer ved akut abdomen?",
          explanation:
            "Ældre kan have mindre tydelige smerter eller tegn, selv ved alvorlig sygdom, så helhedsvurdering er vigtig.",
          options: [
            {
              id: "a",
              text: "Alvorlig sygdom kan give mindre tydelige tegn",
              isCorrect: true,
            },
            { id: "b", text: "Ældre kan ikke få abdominale sygdomme" },
            { id: "c", text: "Smerter kommer altid samme sted" },
            { id: "d", text: "Vitale værdier er irrelevante" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Lokation ↔ organ", "Tegn ↔ årsag"],
      pairsByRound: {
        1: [
          { left: "Højre øvre kvadrant", right: "Lever og galdeblære" },
          { left: "Højre nedre kvadrant", right: "Appendiksområde" },
          { left: "Epigastriet", right: "Mavesæk og pancreas" },
          { left: "Venstre øvre kvadrant", right: "Miltområde" },
          { left: "Suprapubisk", right: "Urinblære" },
          { left: "Flankesmerter", right: "Nyre eller ureter" },
        ],
        2: [
          { left: "Slipømhed", right: "Peritoneal irritation" },
          { left: "Défense", right: "Spændt bugvæg" },
          { left: "Blodig opkast", right: "Mulig øvre GI-blødning" },
          { left: "Koliksmerter", right: "Hulorgan eller sten" },
          { left: "Hypotension", right: "Mulig blødning eller shock" },
          { left: "Feber", right: "Mulig infektion" },
        ],
      },
    },
    word: {
      topicTitle: "Abdomen",
      easy: ["Mave"],
      medium: ["Peritoneum"],
      hard: ["Appendiks"],
    },
  },

  "2026-W52": {
    title: "Luftvejsmedicin",
    mcq: {
      rounds: ["Beta2-agonister", "Steroider", "Ipratropium"],
      questions: [
        {
          id: "w52_q1",
          category: "Beta2-agonister",
          text: "Hvad er hovedvirkningen af beta2-agonister i luftvejene?",
          explanation:
            "Beta2-agonister stimulerer beta2-receptorer i bronkiernes glatte muskulatur og kan give bronkodilatation.",
          options: [
            { id: "a", text: "Bronkodilatation", isCorrect: true },
            { id: "b", text: "Øget blodkoagulation" },
            { id: "c", text: "Nedsat urinproduktion som hovedvirkning" },
            { id: "d", text: "Blokering af ilttransport i blodet" },
          ],
        },
        {
          id: "w52_q2",
          category: "Beta2-agonister",
          text: "Ved hvilke symptomer kan beta2-agonister være relevante i undervisningsmæssig sammenhæng?",
          explanation:
            "De bruges typisk ved bronkospasme med hvæsen og åndenød, fx ved astma eller KOL-forværring efter gældende retningslinjer.",
          options: [
            { id: "a", text: "Hvæsen og bronkospasme", isCorrect: true },
            { id: "b", text: "Isoleret mavesmerte" },
            { id: "c", text: "Knoglebrud uden vejrtrækningsproblem" },
            { id: "d", text: "Høretab efter støj" },
          ],
        },
        {
          id: "w52_q3",
          category: "Beta2-agonister",
          text: "Hvilken bivirkning kan beta2-agonister give?",
          explanation:
            "Beta2-agonister kan give tremor og takykardi, især ved gentagen eller høj belastning.",
          options: [
            { id: "a", text: "Tremor og takykardi", isCorrect: true },
            { id: "b", text: "Permanent lammelse" },
            { id: "c", text: "Sikker hypoglykæmi hos alle" },
            { id: "d", text: "Nedsat bevidsthed som ønsket effekt" },
          ],
        },
        {
          id: "w52_q4",
          category: "Beta2-agonister",
          text: "Hvorfor vurderes respirationsarbejde efter bronkodilatation?",
          explanation:
            "Effekt bør vurderes klinisk, fx ændring i dyspnø, respirationsfrekvens, taleevne, auskultation og saturation.",
          options: [
            {
              id: "a",
              text: "For at vurdere klinisk respons",
              isCorrect: true,
            },
            { id: "b", text: "For at undgå at se på patienten" },
            { id: "c", text: "For at stille diagnose alene" },
            { id: "d", text: "For at måle blodtype" },
          ],
        },
        {
          id: "w52_q5",
          category: "Beta2-agonister",
          text: "Hvad kan manglende effekt af bronkodilatator ved svær dyspnø minde om?",
          explanation:
            "Manglende effekt bør give opmærksomhed på differentialdiagnoser eller alvorlig forværring.",
          options: [
            {
              id: "a",
              text: "At årsagen kan være anden eller alvorlig",
              isCorrect: true,
            },
            { id: "b", text: "At patienten sikkert er rask" },
            { id: "c", text: "At saturation altid er normal" },
            { id: "d", text: "At luftvejene er irrelevante" },
          ],
        },
        {
          id: "w52_q6",
          category: "Steroider",
          text: "Hvad er steroiders primære rolle ved inflammatorisk luftvejssygdom?",
          explanation:
            "Steroider dæmper inflammation og kan reducere slimhindeødem og hyperreaktivitet over tid.",
          options: [
            { id: "a", text: "At dæmpe inflammation", isCorrect: true },
            { id: "b", text: "At virke som øjeblikkelig bronkodilatator" },
            { id: "c", text: "At transportere ilt i blodet" },
            { id: "d", text: "At erstatte ventilation" },
          ],
        },
        {
          id: "w52_q7",
          category: "Steroider",
          text: "Hvorfor virker steroider ikke som akut hurtig bronkodilatation?",
          explanation:
            "Steroider påvirker inflammatoriske processer og har typisk langsommere indsættende effekt end bronkodilatatorer.",
          options: [
            {
              id: "a",
              text: "Effekten på inflammation tager tid",
              isCorrect: true,
            },
            { id: "b", text: "De lukker bronkierne aktivt" },
            { id: "c", text: "De virker kun i knogler" },
            { id: "d", text: "De fjerner al CO2 med det samme" },
          ],
        },
        {
          id: "w52_q8",
          category: "Steroider",
          text: "Ved hvilke tilstande indgår steroider ofte i behandling?",
          explanation:
            "Steroider indgår ofte ved astma- og KOL-forværring, afhængigt af klinik og lokale retningslinjer.",
          options: [
            { id: "a", text: "Astma- og KOL-forværring", isCorrect: true },
            { id: "b", text: "Isoleret ankelforstuvning" },
            { id: "c", text: "Simpel næseblødning uden luftvejsproblem" },
            { id: "d", text: "Brud på finger uden inflammation" },
          ],
        },
        {
          id: "w52_q9",
          category: "Steroider",
          text: "Hvad er vigtigt at huske om steroider i præhospital vurdering?",
          explanation:
            "Steroider kan være relevante, men den akutte vurdering af ABCDE, respirationsarbejde og respons er fortsat central.",
          options: [
            {
              id: "a",
              text: "De erstatter ikke klinisk vurdering",
              isCorrect: true,
            },
            { id: "b", text: "De virker altid øjeblikkeligt" },
            { id: "c", text: "De måler direkte saturation" },
            { id: "d", text: "De udelukker behov for observation" },
          ],
        },
        {
          id: "w52_q10",
          category: "Steroider",
          text: "Hvilken effekt ønskes typisk ved steroidbehandling i luftveje?",
          explanation:
            "Målet er at reducere inflammation og dermed mindske luftvejsobstruktion og symptomforværring over tid.",
          options: [
            { id: "a", text: "Mindre inflammatorisk hævelse", isCorrect: true },
            { id: "b", text: "Mere bronkospasme" },
            { id: "c", text: "Stoppet alveolær gasudveksling" },
            { id: "d", text: "Øget blodtab" },
          ],
        },
        {
          id: "w52_q11",
          category: "Ipratropium",
          text: "Hvilken receptorvirkning har ipratropium primært?",
          explanation:
            "Ipratropium er en antikolinerg bronkodilatator, der hæmmer muskarine receptorer i luftvejene.",
          options: [
            { id: "a", text: "Muskarin receptorblokade", isCorrect: true },
            { id: "b", text: "Beta1-stimulation i hjertet" },
            { id: "c", text: "Dopaminblokade i hjernen" },
            { id: "d", text: "Insulinstimulation i pancreas" },
          ],
        },
        {
          id: "w52_q12",
          category: "Ipratropium",
          text: "Hvad kan ipratropium bidrage til ved obstruktiv lungesygdom?",
          explanation:
            "Ipratropium kan give bronkodilatation ved at reducere parasympatisk medieret bronkokonstriktion.",
          options: [
            { id: "a", text: "Mindre bronkokonstriktion", isCorrect: true },
            { id: "b", text: "Øget lungeødem" },
            { id: "c", text: "Nedsat iltbinding i hæmoglobin" },
            { id: "d", text: "Forværring af knoglebrud" },
          ],
        },
        {
          id: "w52_q13",
          category: "Ipratropium",
          text: "Hvorfor kombineres ipratropium nogle gange med beta2-agonist?",
          explanation:
            "De virker via forskellige mekanismer og kan supplere hinanden ved bronkospasme, afhængigt af klinik og retningslinjer.",
          options: [
            {
              id: "a",
              text: "De har forskellige bronkodilaterende mekanismer",
              isCorrect: true,
            },
            { id: "b", text: "De er samme stof med samme receptor" },
            { id: "c", text: "De fjerner behovet for iltning" },
            { id: "d", text: "De stopper al slimproduktion permanent" },
          ],
        },
        {
          id: "w52_q14",
          category: "Ipratropium",
          text: "Hvilken bivirkning kan antikolinerg inhalationsmedicin give?",
          explanation:
            "Antikolinerg medicin kan blandt andet give mundtørhed, og inhalationsteknik kan påvirke lokal effekt.",
          options: [
            { id: "a", text: "Mundtørhed", isCorrect: true },
            { id: "b", text: "Øget følesans i tæer" },
            { id: "c", text: "Sikker blødning" },
            { id: "d", text: "Laktatfri metabolisme" },
          ],
        },
        {
          id: "w52_q15",
          category: "Ipratropium",
          text: "Hvad bør vurderes ved inhalationsbehandling i akut dyspnø?",
          explanation:
            "Man bør vurdere om patienten kan inhalere effektivt, og om respirationsarbejde, taleevne og vitale værdier ændrer sig.",
          options: [
            {
              id: "a",
              text: "Inhalationsevne og klinisk respons",
              isCorrect: true,
            },
            { id: "b", text: "Kun patientens hårfarve" },
            { id: "c", text: "Kun antal tidligere knoglebrud" },
            { id: "d", text: "Direkte leverstørrelse" },
          ],
        },
      ],
    },
    match: {
      rounds: ["Medicin ↔ receptor", "Effekt ↔ symptom"],
      pairsByRound: {
        1: [
          { left: "Salbutamol", right: "Beta2-receptor" },
          { left: "Terbutalin", right: "Beta2-receptor" },
          { left: "Ipratropium", right: "Muskarin receptor" },
          { left: "Steroid", right: "Inflammationshæmning" },
          { left: "Adrenalin", right: "Adrenerg receptor" },
          { left: "Antikolinerg", right: "Hæmmer parasympatikus" },
        ],
        2: [
          { left: "Bronkodilatation", right: "Mindre hvæsen" },
          { left: "Inflammationsdæmpning", right: "Mindre slimhindeødem" },
          { left: "Beta2-stimulation", right: "Kan give tremor" },
          { left: "Muskarinblokade", right: "Mindre bronkokonstriktion" },
          { left: "Effektiv inhalation", right: "Bedre lægemiddeldeponering" },
          { left: "Svært respirationsarbejde", right: "Red flag ved dyspnø" },
        ],
      },
    },
    word: {
      topicTitle: "Bronkodilatation",
      easy: ["Spray"],
      medium: ["Beta2"],
      hard: ["Inhalation"],
    },
  },
};
