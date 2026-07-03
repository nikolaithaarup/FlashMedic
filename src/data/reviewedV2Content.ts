import type { Flashcard } from "../types/Flashcard";
import type { SourceReference } from "../types/Learning";

const REVIEWED_AT = "2026-07-03";

const respirationSource: SourceReference = {
  title: "ABCDE approach and assessment of breathing",
  publisher: "Resuscitation Council UK",
  editionOrDate: "Current online educational guidance",
  note: "Used as general educational support; local clinical instructions take precedence.",
};

const shockSource: SourceReference = {
  title: "European Resuscitation Council Guidelines: The ABCDE approach",
  publisher: "European Resuscitation Council",
  note: "General assessment and reassessment principles; not a local treatment protocol.",
};

const sepsisSource: SourceReference = {
  title: "Suspected sepsis in people aged 16 or over: recognition, assessment and early management (NG253)",
  publisher: "National Institute for Health and Care Excellence",
  editionOrDate: "2025",
  note: "Used for recognition and assessment concepts; local Danish guidance takes precedence.",
};

const consciousnessSource: SourceReference = {
  title: "The Glasgow Structured Approach to Assessment of the Glasgow Coma Scale",
  publisher: "Glasgow Coma Scale / University of Glasgow",
  note: "Emphasises component reporting, confounders and serial assessment.",
};

type Area = "respiration" | "shock" | "consciousness";

const areaById: Readonly<Record<string, Area>> = Object.fromEntries([
  ...Array.from({ length: 20 }, (_, index) => [`resp_${String(index + 1).padStart(3, "0")}`, "respiration"]),
  ...Array.from({ length: 20 }, (_, index) => [`shock_${String(index + 1).padStart(3, "0")}`, "shock"]),
  ...Array.from({ length: 20 }, (_, index) => [`diff_${String(index + 1).padStart(3, "0")}`, "consciousness"]),
  ...["neuro_010", "neuro_011", "tbi_006", "tbi_010", "tbi_011", "tbi_017"].map((id) => [id, "consciousness"]),
  ...["lung_001", "lung_003", "lung_004", "lung_005", "lung_010", "lung_015", "lung_017"].map((id) => [id, "respiration"]),
]) as Record<string, Area>;

const appliedIds = new Set([
  "resp_008", "resp_009", "resp_014", "resp_020",
  "shock_003", "shock_008", "shock_010", "shock_013", "shock_020",
  "diff_004", "diff_006", "diff_007", "diff_010", "diff_012", "diff_015",
  "tbi_006", "tbi_011", "tbi_017",
  "lung_004", "lung_010", "lung_015",
]);

const contentOverrides: Readonly<Record<string, Partial<Flashcard>>> = {
  resp_004: {
    answer: "Primært bundet til hæmoglobin; en mindre del er fysisk opløst i plasma.",
  },
  resp_020: {
    answer: "Hypokapni giver respiratorisk alkalose og cerebral vasokonstriktion, som kan udløse svimmelhed og paræstesier.",
  },
  lung_001: {
    answer: "Utilstrækkelig oxygenation og/eller ventilation, vurderet sammen med kliniske tegn, ikke kun SpO₂.",
  },
  lung_003: {
    question: "Hvorfor skal iltbehandling hos patienter med risiko for hyperkapni titreres og revurderes?",
    answer: "For at behandle hypoksæmi uden at overse tiltagende CO₂-retention; hypoksi må ikke efterlades ubehandlet.",
  },
  lung_004: {
    answer: "Astma og KOL kan begge give obstruktion; alder, anamnese, baseline, udløsere og udvikling hjælper, men overlap er almindeligt.",
  },
  lung_005: {
    answer: "Udtalt respirationsarbejde, manglende taleevne, udtrætning, ændret bevidsthed eller svage/stille respirationslyde.",
  },
  lung_010: {
    question: "Hvilke fund taler mere for lungeødem end for isoleret obstruktiv lungesygdom?",
    answer: "Ortopnø, bilaterale krepitationer og tegn på hjertesvigt; fundene skal vurderes samlet.",
  },
  lung_015: {
    question: "Hvilke observationer indgår i en ABCDE-vurdering af dyspnø ud over SpO₂?",
    answer: "RF, dybde, respirationsarbejde, taleevne, respirationslyde, hud, mental status og udvikling over tid.",
  },
  lung_017: {
    answer: "Mulig udtrætning og truende respirationsstop; ventilation og luftvej skal vurderes straks efter gældende instruks.",
  },
  shock_002: {
    answer: "Se efter samlet hypoperfusion: ændret mental status, unormal puls/RF, hud- og kapillærrespons samt udvikling i BT.",
  },
  shock_003: {
    answer: "Perifer vasokonstriktion kan give kold hud, mens distributivt shock tidligt kan give varm hud; ingen af fundene står alene.",
  },
  shock_012: {
    answer: "Cyanose kan afspejle utilstrækkelig oxygenation eller perifer cirkulation, men fravær af cyanose udelukker ikke shock.",
  },
  shock_014: {
    answer: "Faldende urinproduktion over tid kan afspejle nedsat nyreperfusion, men er sjældent et isoleret præhospitalt mål.",
  },
  shock_016: {
    question: "Hvad er de overordnede præhospitale prioriteter ved mistænkt hypovolæmisk shock?",
    answer: "Kontrollér ydre blødning, støt ABCDE, forebyg varmetab, revurdér hyppigt og følg gældende behandlingsinstruks.",
  },
  shock_017: {
    question: "Hvad er hovedprincippet ved mistænkt anafylaktisk shock?",
    answer: "Tilstanden er tidskritisk: håndtér luftvej og kredsløb og følg gældende instruks for adrenalin og øvrig støtte.",
  },
  shock_018: {
    question: "Hvad er de præhospitale prioriteter ved mistænkt septisk shock?",
    answer: "Genkend infektion med organpåvirkning, støt ABCDE, monitorér trends og varsle/transportér rettidigt efter lokal instruks.",
  },
  shock_019: {
    question: "Hvad afgør, om vasopressorbehandling er relevant præhospitalt?",
    answer: "Patientens fysiologi, shockårsag, kompetenceniveau, monitoreringsmuligheder og gældende lokale instruks.",
  },
  diff_007: {
    answer: "Anamnese, temperatur, sekret, auskultation og tidligere mønster kan støtte vurderingen, men KOL og pneumoni kan sameksistere.",
  },
  diff_013: {
    answer: "Lungeødem taler især for kardiogent svigt, men væske i lungerne kan have flere årsager og kræver samlet vurdering.",
  },
  diff_016: {
    question: "Hvorfor må psykogen bevidsthedspåvirkning betragtes som en udelukkelsesdiagnose præhospitalt?",
    answer: "Fordi hypoksi, hypoglykæmi, shock, sepsis, intoxikation og neurologisk sygdom først skal vurderes systematisk.",
  },
  diff_017: {
    answer: "Begge kan give takykardi og kredsløbspåvirkning; temperatur, infektionsfokus, væsketab og trends hjælper, men feber kan mangle ved sepsis.",
  },
  diff_020: {
    answer: "Identificér ABCDE-trusler, beskyt luftvejen ved reduceret bevidsthed, undersøg reversible årsager og følg udviklingen.",
  },
  neuro_010: {
    question: "Hvad bruges AVPU eller en RAS-lignende hurtig vurdering til?",
    answer: "Til hurtigt at beskrive patientens reaktionsniveau; unormale fund uddybes systematisk, fx med GCS.",
  },
  neuro_011: {
    question: "Hvilke tre komponenter skal rapporteres ved GCS?",
    answer: "Øjenåbning, verbal respons og motorisk respons.",
  },
  tbi_006: {
    answer: "Forskellig pupilstørrelse; det kan være et alarmsignal, men skal sammenholdes med øvrige neurologiske fund og udviklingen.",
  },
  tbi_010: {
    answer: "At beskrive øjen-, verbal- og motorisk respons og følge ændringer over tid.",
  },
  tbi_011: {
    answer: "En klinisk relevant neurologisk forværring, som kræver ny ABCDE- og neurologisk vurdering.",
  },
  tbi_017: {
    answer: "Kontakt, pupiller, lateraliserende udfald, ekstremitetsmotorik og systematisk reaktionsniveau/GCS.",
  },
};

const scenarios: Readonly<Record<string, Partial<Flashcard>>> = {
  resp_006: {
    question: "En patient har RF 30, taler i korte sætninger og bruger accessoriske muskler. Hvad er vigtigst at konkludere?",
    answer: "Der er betydeligt øget respirationsarbejde og risiko for udtrætning.",
    scenario: { presentation: "Tiltagende dyspnø og korte sætninger.", vitals: { respiratoryRate: 30, spo2: 93 } },
  },
  resp_007: {
    question: "En KOL-patient bliver mere træt trods mindre hørbar hvæsen. Hvad kan udviklingen betyde?",
    answer: "Faldende ventilation og begyndende respiratorisk udtrætning.",
    scenario: { presentation: "Kendt KOL, tiltagende træthed og svagere respirationslyde.", ageGroup: "older-adult", vitals: { respiratoryRate: 10, spo2: 88 } },
  },
  resp_015: {
    question: "Efter thoraxtraume får en patient ensidigt svækkede respirationslyde, dyspnø og kredsløbspåvirkning. Hvad skal mistænkes?",
    answer: "Trykpneumothorax skal mistænkes som en tidskritisk differentialdiagnose.",
    scenario: { presentation: "Akut forværring efter stumpt thoraxtraume.", ageGroup: "adult", vitals: { pulse: 128, systolicBp: 86, respiratoryRate: 34, spo2: 87 } },
  },
  resp_017: {
    question: "En patient har normal SpO₂, men bliver sløv med langsom, overfladisk respiration. Hvilket problem kan saturation ikke udelukke?",
    answer: "Hypoventilation med hyperkapni.",
    scenario: { presentation: "Tiltagende sløvhed og ineffektiv ventilation trods normal SpO₂.", vitals: { respiratoryRate: 7, spo2: 96, gcs: 12 } },
  },
  resp_019: {
    question: "En dyspnøisk patient har krepitation, ortopnø og kold hud. Hvilken mekanisme er mest sandsynlig?",
    answer: "Venstresidigt hjertesvigt med pulmonal stase/lungeødem.",
    scenario: { presentation: "Akut dyspnø, ortopnø og bilaterale krepitationer.", ageGroup: "older-adult", vitals: { pulse: 112, systolicBp: 168, respiratoryRate: 30, spo2: 89 } },
  },
  shock_004: {
    question: "En patient med mulig intern blødning er takykard, bleg og urolig, men har normalt blodtryk. Kan shock udelukkes?",
    answer: "Nej. Fundene kan passe med kompenseret hypovolæmisk shock.",
    scenario: { presentation: "Mavesmerter, bleghed og uro efter traume.", ageGroup: "adult", vitals: { pulse: 122, systolicBp: 112, respiratoryRate: 26, gcs: 14 } },
  },
  shock_005: {
    question: "En patient med infektion er varm, konfus og takykard. Hvad taler for distributivt/septisk shock?",
    answer: "Infektionsmistanke sammen med ændret mental status og tegn på kredsløbspåvirkning.",
    scenario: { presentation: "Feber, konfusion og almen forværring.", ageGroup: "older-adult", vitals: { pulse: 118, systolicBp: 94, respiratoryRate: 28, temperatureC: 39.1, gcs: 13 } },
  },
  shock_007: {
    question: "En patient med brystsmerter er hypotensiv, kold og har krepitation. Hvilken shocktype er mest sandsynlig?",
    answer: "Kardiogent shock.",
    scenario: { presentation: "Brystsmerter, dyspnø og kold klam hud.", ageGroup: "older-adult", vitals: { pulse: 116, systolicBp: 78, respiratoryRate: 32, spo2: 86 } },
  },
  shock_009: {
    question: "En shockpatient går fra uro til sløvhed. Hvordan skal ændringen fortolkes?",
    answer: "Som mulig forværring af cerebral perfusion og dekompensation.",
    scenario: { presentation: "Tiltagende bevidsthedspåvirkning under observation.", ageGroup: "adult", vitals: { pulse: 132, systolicBp: 82, respiratoryRate: 30, gcs: 11 } },
  },
  shock_015: {
    question: "En patient går fra takykardi med normalt BT til hypotension og sløvhed. Hvad beskriver udviklingen?",
    answer: "Overgang fra kompenseret til dekompenseret shock.",
    scenario: { presentation: "Progredierende kredsløbssvigt ved gentagne målinger.", ageGroup: "adult", vitals: { pulse: 136, systolicBp: 76, respiratoryRate: 32, gcs: 12 } },
  },
  diff_001: {
    question: "En ukendt patient findes konfus. Hvilke reversible ABCDE-problemer skal vurderes straks?",
    answer: "Især hypoksi, hypoglykæmi og kredsløbssvigt; vurder samtidig øvrige årsager.",
    scenario: { presentation: "Akut uklar konfusion uden sikker anamnese.", ageGroup: "adult", vitals: { respiratoryRate: 24, spo2: 90, gcs: 13, bloodGlucoseMmolL: 3.0 } },
  },
  diff_002: {
    question: "En konfus patient er koldsvedende og har glukose 2,4 mmol/L. Hvilken reversibel årsag er mest oplagt?",
    answer: "Hypoglykæmi.",
    scenario: { presentation: "Akut konfusion, tremor og koldsved.", ageGroup: "adult", vitals: { pulse: 108, gcs: 13, bloodGlucoseMmolL: 2.4 } },
  },
  diff_003: {
    question: "En patient har pludselig afasi og ensidig kraftnedsættelse uden feber. Hvilken årsag er mest sandsynlig?",
    answer: "Akut stroke er mere sandsynligt end diffus infektiøs encefalopati.",
    scenario: { presentation: "Pludseligt fokalt neurologisk udfald.", ageGroup: "older-adult", vitals: { pulse: 84, systolicBp: 176, respiratoryRate: 16, temperatureC: 37.0, gcs: 14 } },
  },
  diff_014: {
    question: "En febril patient er diffust konfus uden lateraliserende udfald. Hvilken forklaring skal overvejes?",
    answer: "Infektionsrelateret encefalopati/sepsis, uden at andre årsager udelukkes.",
    scenario: { presentation: "Feber og ny diffus mental påvirkning.", ageGroup: "older-adult", vitals: { pulse: 114, systolicBp: 98, respiratoryRate: 26, temperatureC: 39.0, gcs: 13 } },
  },
  diff_019: {
    question: "En KOL-patient bliver søvnig med langsom, overfladisk respiration. Hvilken årsag skal mistænkes?",
    answer: "Hyperkapni på grund af utilstrækkelig ventilation.",
    scenario: { presentation: "Tiltagende somnolens hos patient med kendt KOL.", ageGroup: "older-adult", vitals: { respiratoryRate: 8, spo2: 91, gcs: 11 } },
  },
};

const settings = {
  respiration: {
    objective: "lo.anatomi-fysiologi.respiration.grundlag",
    source: respirationSource,
    relevance: "Præhospitalt skal oxygenation, ventilation og respirationsarbejde vurderes hver for sig og følges over tid.",
    explanation: "Fundet skal sættes ind i en samlet ABCDE-vurdering; en enkelt SpO₂- eller RF-måling beskriver ikke alene ventilation eller klinisk reserve.",
    mistakes: ["At sidestille normal SpO₂ med normal ventilation", "At overse udtrætning, når respirationslydene bliver svagere"],
    redFlag: "Faldende respirationsarbejde sammen med tiltagende træthed, stille thorax eller ændret bevidsthed kan være forværring—ikke bedring.",
  },
  shock: {
    objective: "lo.kliniske-parametre.shock.grundlag",
    source: shockSource,
    relevance: "Tidlig genkendelse bygger på samlet perfusionsvurdering og gentagne målinger, ikke kun blodtrykket.",
    explanation: "Kompensation kan holde blodtrykket normalt tidligt. Hud, mental status, puls, RF, kapillærrespons og udvikling skal vurderes samlet.",
    mistakes: ["At vente på hypotension før shock mistænkes", "At bruge ét hudfund til at fastslå shocktypen"],
    redFlag: "Faldende mental status, svagere perifer puls eller ny hypotension kan markere dekompensation.",
  },
  consciousness: {
    objective: "lo.kliniske-parametre.differentialdiagnoser.grundlag",
    source: consciousnessSource,
    relevance: "Ændret bevidsthed kan true luftvejen og skyldes reversible ABCDE-problemer, som skal opspores parallelt med neurologisk vurdering.",
    explanation: "Beskriv øjen-, verbal- og motorisk respons, vurder mulige konfunderende faktorer og gentag undersøgelsen; trenden er ofte vigtigere end én totalscore.",
    mistakes: ["At dokumentere kun total GCS", "At antage intoxikation uden at udelukke hypoksi, hypoglykæmi, shock, sepsis eller stroke"],
    redFlag: "Faldende reaktionsniveau, ny anisokori eller lateraliserende udfald kræver hurtig revurdering af ABCDE og neurologisk status.",
  },
} as const;

export function enrichReviewedV2Cards(cards: readonly Flashcard[]): Flashcard[] {
  return cards.map((card) => {
    const area = areaById[card.id];
    if (!area) return card;
    const config = settings[area];
    const scenario = scenarios[card.id];
    const override = contentOverrides[card.id];
    const source = area === "shock" && (card.tags?.includes("sepsis") || card.id === "shock_005") ? sepsisSource : config.source;
    const objective = card.id.startsWith("neuro_")
      ? "lo.anatomi-fysiologi.nervesystemet.grundlag"
      : card.id.startsWith("tbi_")
        ? "lo.traumatologi-itls.traumatisk-hjerneskade-og-neurologi.grundlag"
        : card.id.startsWith("lung_")
          ? "lo.sygdomslaere.lungesygdomme.grundlag"
        : config.objective;
    const enrichedAnswer = scenario?.answer ?? override?.answer ?? card.answer;
    return {
      ...card,
      ...override,
      ...scenario,
      schemaVersion: 2,
      kind: scenario ? "scenario" : appliedIds.has(card.id) ? "applied" : "recall",
      learningObjectiveId: objective,
      explanation: `${enrichedAnswer} ${config.explanation}`,
      commonMistakes: [...config.mistakes],
      prehospitalRelevance: config.relevance,
      examTip: "Begrund svaret med ABCDE, klinisk helhed og udvikling over tid.",
      redFlag: config.redFlag,
      references: [source],
      reviewStatus: "reviewed",
      reviewedAt: REVIEWED_AT,
      contentRevision: 1,
      tags: [...new Set([...(card.tags ?? []), area, "ABCDE", "reviewed-v2"])],
    };
  });
}
