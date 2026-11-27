import type { PatientCase } from './caseEngine';
// Original fictional cases; curriculum alignment does not constitute clinical approval.
export const lupCases: PatientCase[] = [
  {
    "id": "abd-01",
    "title": "Smerter omkring navlen",
    "category": "Gastroenterologi",
    "difficulty": "Behandler",
    "subjects": [
      "Anatomi",
      "Patofysiologi",
      "Sygdomslære",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar visceral og somatisk smerte.",
      "Relatér smertemigration til peritoneal irritation."
    ],
    "intro": "En 24-årig har haft kvalme og smerter omkring navlen siden i morges. Nu er smerten tydeligst i højre nedre del af abdomen.",
    "vitals": {
      "Puls": "104/min",
      "Temp": "38,1 °C"
    },
    "takeaway": "Smertens udvikling og lokalisation er vigtige, men alene ikke diagnostiske.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvilken struktur er et vedhæng til caecum?",
        "options": [
          {
            "id": "3",
            "text": "Galdeblære"
          },
          {
            "id": "1",
            "text": "Jejunum"
          },
          {
            "id": "2",
            "text": "Appendix vermiformis"
          },
          {
            "id": "4",
            "text": "Colon sigmoideum"
          }
        ],
        "correct": "2",
        "explanation": "Appendix afgår fra caecum i højre nedre abdomen."
      },
      {
        "id": "q2",
        "kind": "match",
        "prompt": "Forbind smertetype med typisk karakter.",
        "left": [
          {
            "id": "1",
            "text": "Visceral"
          },
          {
            "id": "2",
            "text": "Somatisk fra parietalt peritoneum"
          },
          {
            "id": "3",
            "text": "Refereret"
          }
        ],
        "right": [
          {
            "id": "2",
            "text": "Diffus og dårligt lokaliseret"
          },
          {
            "id": "1",
            "text": "Opleves et andet sted end kilden"
          },
          {
            "id": "3",
            "text": "Mere præcist lokaliseret"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Visceral smerte er ofte diffus, mens parietal irritation kan lokaliseres tydeligere."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvad kan forklare, at smerten bliver mere lokaliseret?",
        "options": [
          {
            "id": "1",
            "text": "Stimulation af parietalt peritoneum"
          },
          {
            "id": "3",
            "text": "Øget galdeproduktion"
          },
          {
            "id": "2",
            "text": "Nedsat nerveledning i synsnerven"
          }
        ],
        "correct": "1",
        "explanation": "Lokal peritoneal irritation kan aktivere somatiske afferente nerver."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke oplysninger er nyttige ved vurdering af akutte mavesmerter?",
        "options": [
          {
            "id": "1",
            "text": "Debut og migration"
          },
          {
            "id": "4",
            "text": "Kun smertens talværdi"
          },
          {
            "id": "3",
            "text": "Mulighed for graviditet, når relevant"
          },
          {
            "id": "2",
            "text": "Tidligere operationer"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Anamnese, kontekst og udvikling hjælper med at afgrænse mulige årsager."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "ortho-01",
    "title": "Et forkert trin på fortovet",
    "category": "Traumatologi",
    "difficulty": "Elev",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Identificér knogler i underbenet.",
      "Forklar distal neurovaskulær vurdering."
    ],
    "intro": "En 42-årig vrider anklen og har hævelse og smerte. Foden er varm, og patienten kan bevæge tæerne.",
    "vitals": {
      "Puls": "92/min"
    },
    "takeaway": "Distal motorik, sensibilitet og cirkulation giver forskellige oplysninger om ekstremiteten.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind struktur og placering.",
        "left": [
          {
            "id": "1",
            "text": "Tibia"
          },
          {
            "id": "2",
            "text": "Fibula"
          },
          {
            "id": "3",
            "text": "Talus"
          }
        ],
        "right": [
          {
            "id": "3",
            "text": "Mediale, vægtbærende underbensknogle"
          },
          {
            "id": "2",
            "text": "Laterale underbensknogle"
          },
          {
            "id": "1",
            "text": "Rulleben i ankelleddet"
          }
        ],
        "correct": {
          "1": "3",
          "2": "2",
          "3": "1"
        },
        "explanation": "Tibia og fibula omslutter talus i ankelgaflen."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad forbinder et ligament typisk?",
        "options": [
          {
            "id": "3",
            "text": "Nerve til hud"
          },
          {
            "id": "1",
            "text": "Muskel til knogle"
          },
          {
            "id": "2",
            "text": "Knogle til knogle"
          }
        ],
        "correct": "2",
        "explanation": "Ligamenter stabiliserer led ved at forbinde knogler."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvad undersøges distalt for en ekstremitetsskade?",
        "options": [
          {
            "id": "1",
            "text": "Sensibilitet"
          },
          {
            "id": "4",
            "text": "Patientens synsstyrke"
          },
          {
            "id": "3",
            "text": "Hudfarve og temperatur"
          },
          {
            "id": "2",
            "text": "Motorik"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Neurovaskulær vurdering omfatter nervefunktion og tegn på perfusion."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvad kan en palpabel distal puls ikke alene udelukke?",
        "options": [
          {
            "id": "1",
            "text": "Enhver alvorlig vævsskade"
          },
          {
            "id": "3",
            "text": "At arterielt blod kan nå foden"
          },
          {
            "id": "2",
            "text": "At hjertet slår"
          }
        ],
        "correct": "1",
        "explanation": "En palpabel puls udelukker ikke nerve-, knogle- eller anden alvorlig vævsskade."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "pacing-01",
    "title": "Svimmel med langsom puls",
    "category": "Kardiologi",
    "difficulty": "Paramediciner",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar AV-overledning og elektrisk capture.",
      "Skeln mellem elektrisk og mekanisk respons."
    ],
    "intro": "En 79-årig bliver svimmel ved oprejsning. EKG viser P-takker med uafhængig, langsom ventrikulær rytme.",
    "vitals": {
      "Puls": "34/min",
      "BT": "80/48 mmHg"
    },
    "takeaway": "Elektrisk aktivitet og effektiv mekanisk perfusion skal vurderes hver for sig.",
    "steps": [
      {
        "id": "q1",
        "kind": "order",
        "prompt": "Placér den normale impulsledning i rækkefølge.",
        "options": [
          {
            "id": "3",
            "text": "AV-knuden"
          },
          {
            "id": "1",
            "text": "His-Purkinje-systemet"
          },
          {
            "id": "2",
            "text": "Sinusknuden"
          }
        ],
        "correct": [
          "2",
          "3",
          "1"
        ],
        "explanation": "Sinusknuden initierer impulsen, AV-knuden forsinker den, og His-Purkinje leder til ventriklerne."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad beskriver AV-dissociation i dette tilfælde?",
        "options": [
          {
            "id": "3",
            "text": "Ingen atrial aktivitet"
          },
          {
            "id": "1",
            "text": "Atrier og ventrikler aktiveres uafhængigt"
          },
          {
            "id": "2",
            "text": "Alle P-takker efterfølges af QRS med fast PR"
          }
        ],
        "correct": "1",
        "explanation": "Uafhængige atrie- og ventrikelrytmer med bradykardi kan passe med komplet AV-blok."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Ved en undervisningssimulation med pacing ses QRS efter pacingimpulser. Hvad mangler for at vurdere mekanisk capture?",
        "options": [
          {
            "id": "2",
            "text": "Tegn på effektiv puls og perfusion i takt med QRS"
          },
          {
            "id": "1",
            "text": "Kun flere pacingimpulser på EKG"
          },
          {
            "id": "3",
            "text": "En ny temperaturmåling"
          }
        ],
        "correct": "2",
        "explanation": "Elektrisk capture viser depolarisering; mekanisk capture kræver effektiv kontraktion og perfusion."
      },
      {
        "id": "q4",
        "kind": "number",
        "prompt": "Hvad er minutvolumen ved puls 34/min og antaget slagvolumen 70 ml?",
        "answer": 2.38,
        "unit": "L/min",
        "tolerance": 0.05,
        "explanation": "34 × 70 = 2380 ml/min. Slagvolumen er antaget og ikke et klinisk måleresultat."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "syncope-01",
    "title": "Kortvarigt kollaps i køen",
    "category": "Kardiologi",
    "difficulty": "Behandler",
    "subjects": [
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering",
      "Sygdomslære"
    ],
    "objectives": [
      "Forklar cerebral hypoperfusion ved synkope.",
      "Identificér fund som kræver bredere differentialdiagnostik."
    ],
    "intro": "En 32-årig bliver varm, kvalm og bleg efter at have stået længe. Personen falder om og er hurtigt vågen igen.",
    "vitals": {
      "Puls": "72/min",
      "BT": "112/70 mmHg"
    },
    "takeaway": "Synkope er kortvarigt bevidsthedstab fra global cerebral hypoperfusion; årsagen skal stadig overvejes.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvilken mekanisme definerer synkope?",
        "options": [
          {
            "id": "2",
            "text": "Permanent cerebral nekrose"
          },
          {
            "id": "1",
            "text": "Forbigående global cerebral hypoperfusion"
          },
          {
            "id": "3",
            "text": "Isoleret perifer neuropati"
          }
        ],
        "correct": "1",
        "explanation": "Synkope skyldes kortvarigt utilstrækkelig perfusion af hjernen med spontan restitution."
      },
      {
        "id": "q2",
        "kind": "match",
        "prompt": "Match mekanisme og mulig synkopetype.",
        "left": [
          {
            "id": "1",
            "text": "Vasovagal"
          },
          {
            "id": "2",
            "text": "Ortostatisk"
          },
          {
            "id": "3",
            "text": "Arytmisk"
          }
        ],
        "right": [
          {
            "id": "1",
            "text": "Utilstrækkelig rytmebetinget minutvolumen"
          },
          {
            "id": "3",
            "text": "Utilstrækkelig kompensation ved oprejsning"
          },
          {
            "id": "2",
            "text": "Refleksbetinget hypotension og eventuelt bradykardi"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Mekanismerne overlapper, men adskiller sig i udløsende fysiologi."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke oplysninger øger mistanken om kardial årsag?",
        "options": [
          {
            "id": "1",
            "text": "Synkope under anstrengelse"
          },
          {
            "id": "2",
            "text": "Palpitationer umiddelbart før"
          },
          {
            "id": "4",
            "text": "Typisk langvarig ståen med kvalme alene"
          },
          {
            "id": "3",
            "text": "Kendt strukturel hjertesygdom"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Anstrengelse, palpitationer og hjertesygdom er væsentlige kardiale risikofund."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvad betyder normalt blodtryk efter hændelsen?",
        "options": [
          {
            "id": "3",
            "text": "Der har ikke været bevidsthedstab"
          },
          {
            "id": "1",
            "text": "Kardial årsag er udelukket"
          },
          {
            "id": "2",
            "text": "Den aktuelle måling beskriver ikke nødvendigvis hændelsen"
          }
        ],
        "correct": "2",
        "explanation": "Forbigående ændringer kan være ophørt, når patienten undersøges."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "adrenal-01",
    "title": "Svag efter maveinfektion",
    "category": "Endokrinologi",
    "difficulty": "Paramediciner",
    "subjects": [
      "Endokrinologi",
      "Fysiologi",
      "Patofysiologi",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar kortisol og aldosterons funktion.",
      "Relatér primær binyrebarkinsufficiens til kredsløb og elektrolytter."
    ],
    "intro": "En 46-årig med kendt Addisons sygdom har haft opkast og tiltagende svaghed. Patienten er svimmel og konfus.",
    "vitals": {
      "BT": "78/46 mmHg",
      "Puls": "118/min",
      "Glukose": "3,2 mmol/L"
    },
    "takeaway": "Kortisolmangel og ved primær insufficiens ofte aldosteronmangel kan bidrage til alvorlig kredsløbspåvirkning.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind hormon og væsentlig funktion.",
        "left": [
          {
            "id": "1",
            "text": "Kortisol"
          },
          {
            "id": "2",
            "text": "Aldosteron"
          },
          {
            "id": "3",
            "text": "ADH"
          }
        ],
        "right": [
          {
            "id": "1",
            "text": "Øger vandreabsorption i samlerør"
          },
          {
            "id": "3",
            "text": "Understøtter stressrespons og vaskulær respons på katekolaminer"
          },
          {
            "id": "2",
            "text": "Fremmer natriumretention og kaliumudskillelse"
          }
        ],
        "correct": {
          "1": "3",
          "2": "2",
          "3": "1"
        },
        "explanation": "Hormonerne påvirker forskellige dele af energi- og væskebalancen."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvilket elektrolytmønster kan ses ved primær binyrebarkinsufficiens?",
        "options": [
          {
            "id": "2",
            "text": "Hyponatriæmi og hyperkaliæmi"
          },
          {
            "id": "3",
            "text": "Isoleret hypercalcæmi hos alle"
          },
          {
            "id": "1",
            "text": "Hypernatriæmi og hypokaliæmi"
          }
        ],
        "correct": "2",
        "explanation": "Aldosteronmangel kan øge natriumtab og mindske kaliumudskillelse."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvorfor kan infektion udløse en krise?",
        "options": [
          {
            "id": "1",
            "text": "Stress øger behovet for kortisol"
          },
          {
            "id": "3",
            "text": "Insulinproduktion stopper altid"
          },
          {
            "id": "2",
            "text": "Infektion ophæver altid behovet for glukokortikoider"
          }
        ],
        "correct": "1",
        "explanation": "Stressrespons kræver øget kortisoltilgængelighed; utilstrækkelig reserve kan dekompensere."
      },
      {
        "id": "q4",
        "kind": "scale",
        "prompt": "Estimér MAP fra 78/46 mmHg (SBP + 2 × DBP)/3.",
        "answer": 57,
        "unit": "mmHg",
        "min": 30,
        "max": 100,
        "step": 1,
        "tolerance": 1,
        "explanation": "(78 + 92)/3 = 56,7 mmHg. MAP er et estimat."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      },
      {
        "title": "Lægemiddelstyrelsen – Produktresuméer (til faglig kontrol)",
        "url": "https://produktresume.dk/"
      }
    ],
    "status": "draft"
  },
  {
    "id": "tonsil-01",
    "title": "Blod i spyttet om natten",
    "category": "ØNH",
    "difficulty": "Behandler",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar tonsillernes placering og immunfunktion.",
      "Genkend luftvejs- og kredsløbsrisici ved blødning."
    ],
    "intro": "En 19-årig er opereret for mandler for seks dage siden og vågner med frisk blod i munden. Patienten synker hyppigt.",
    "vitals": {
      "Puls": "110/min",
      "BT": "118/75 mmHg"
    },
    "takeaway": "Synket blod kan skjule blødningens omfang; luftveje og perfusion er begge relevante.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvor findes de palatinale tonsiller?",
        "options": [
          {
            "id": "2",
            "text": "Lateralt i oropharynx"
          },
          {
            "id": "3",
            "text": "I tracheas bifurkation"
          },
          {
            "id": "1",
            "text": "I larynx under stemmelæberne"
          }
        ],
        "correct": "2",
        "explanation": "De palatinale tonsiller sidder mellem ganebuerne i oropharynx."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvilken vævstype dominerer tonsillerne?",
        "options": [
          {
            "id": "2",
            "text": "Tværstribet hjertemuskulatur"
          },
          {
            "id": "3",
            "text": "Brusk"
          },
          {
            "id": "1",
            "text": "Lymfoidt væv"
          }
        ],
        "correct": "1",
        "explanation": "Tonsiller er lymfoidt væv og indgår i immunforsvaret."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke mekanismer kan gøre tilstanden alvorlig?",
        "options": [
          {
            "id": "1",
            "text": "Aspiration af blod"
          },
          {
            "id": "4",
            "text": "Øget knoglemarvsproduktion på sekunder"
          },
          {
            "id": "2",
            "text": "Blodtab"
          },
          {
            "id": "3",
            "text": "Luftvejspåvirkning"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Blod kan både true luftveje og reducere cirkulerende volumen."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvorfor kan normalt blodtryk være misvisende ved akut blødning?",
        "options": [
          {
            "id": "1",
            "text": "Kompenserende takykardi og vasokonstriktion kan bevare trykket midlertidigt"
          },
          {
            "id": "3",
            "text": "Blødning ændrer aldrig perfusion"
          },
          {
            "id": "2",
            "text": "Blodtryk måler præcist blodtab"
          }
        ],
        "correct": "1",
        "explanation": "Kredsløbskompensation kan skjule tidlig hypovolæmi."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "spine-01",
    "title": "Fald fra et stillads",
    "category": "Traumatologi",
    "difficulty": "Paramediciner",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar sympatisk innervation og neurogent shock.",
      "Skeln mellem neurogent shock og spinalt shock."
    ],
    "intro": "En 37-årig har efter et fald nakkesmerter, svaghed i benene og påvirket kredsløb. Huden er varm.",
    "vitals": {
      "Puls": "48/min",
      "BT": "82/46 mmHg"
    },
    "takeaway": "Bradykardi og hypotension efter rygmarvstraume kan være neurogent shock; blødning og andre årsager skal stadig overvejes.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvor findes rygmarven?",
        "options": [
          {
            "id": "3",
            "text": "I processus spinosus"
          },
          {
            "id": "1",
            "text": "I spinalkanalen"
          },
          {
            "id": "2",
            "text": "I discus intervertebralis"
          }
        ],
        "correct": "1",
        "explanation": "Rygmarven ligger i spinalkanalen, beskyttet af columna og hinder."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvilken mekanisme kan give neurogent shock ved høj rygmarvsskade?",
        "options": [
          {
            "id": "3",
            "text": "Isoleret insulinmangel"
          },
          {
            "id": "1",
            "text": "Tab af sympatisk vasomotorisk tonus"
          },
          {
            "id": "2",
            "text": "Øget cirkulerende blodvolumen"
          }
        ],
        "correct": "1",
        "explanation": "Tab af sympatisk tonus kan give vasodilatation og bradykardi."
      },
      {
        "id": "q3",
        "kind": "match",
        "prompt": "Forbind begreb og betydning.",
        "left": [
          {
            "id": "1",
            "text": "Neurogent shock"
          },
          {
            "id": "2",
            "text": "Spinalt shock"
          },
          {
            "id": "3",
            "text": "Hypovolæmisk shock"
          }
        ],
        "right": [
          {
            "id": "3",
            "text": "Hæmodynamisk påvirkning ved tab af sympatisk tonus"
          },
          {
            "id": "1",
            "text": "Nedsat cirkulerende volumen"
          },
          {
            "id": "2",
            "text": "Forbigående tab af reflekser og neurologisk funktion under skadeniveau"
          }
        ],
        "correct": {
          "1": "3",
          "2": "2",
          "3": "1"
        },
        "explanation": "Spinalt shock er neurologisk, mens neurogent shock er hæmodynamisk."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke vurderinger er stadig relevante?",
        "options": [
          {
            "id": "2",
            "text": "Motorik og sensibilitet"
          },
          {
            "id": "4",
            "text": "At hypotension altid skyldes rygmarven"
          },
          {
            "id": "3",
            "text": "Andre mulige blødningskilder"
          },
          {
            "id": "1",
            "text": "Gentagne vitale værdier"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Samtidige skader kan være til stede; fund skal sammenholdes."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "mening-01",
    "title": "Feber og hurtigt tiltagende sløvhed",
    "category": "Infektion",
    "difficulty": "Paramediciner",
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Patofysiologi",
      "Klinisk vurdering",
      "Hygiejne"
    ],
    "objectives": [
      "Forklar meningokokkers bakterielle egenskaber.",
      "Relatér endotoksin, inflammation og koagulation til kliniske fund."
    ],
    "intro": "En 18-årig har feber, hovedpine og tiltagende konfusion. Der ses enkelte hudblødninger, som ikke forsvinder ved tryk.",
    "vitals": {
      "Temp": "39,5 °C",
      "Puls": "132/min",
      "BT": "90/54 mmHg"
    },
    "takeaway": "Meningokoksygdom kan udvikle sig hurtigt; fravær af klassiske tegn udelukker den ikke.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvilken organisme er Neisseria meningitidis?",
        "options": [
          {
            "id": "2",
            "text": "RNA-virus"
          },
          {
            "id": "1",
            "text": "Gramnegativ diplokok"
          },
          {
            "id": "3",
            "text": "Encellede svampe"
          }
        ],
        "correct": "1",
        "explanation": "Meningokokker er gramnegative diplokokker."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad kan meningokokkens lipooligosakkarid fremkalde?",
        "options": [
          {
            "id": "1",
            "text": "Udtalt innate immunaktivering"
          },
          {
            "id": "3",
            "text": "Hæmning af alle cytokiner"
          },
          {
            "id": "2",
            "text": "Direkte insulinproduktion"
          }
        ],
        "correct": "1",
        "explanation": "Lipooligosakkarid kan aktivere medfødt immunrespons og bidrage til systemisk inflammation."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvad er en mulig mekanisme bag purpura ved svær sepsis?",
        "options": [
          {
            "id": "1",
            "text": "Koagulationsdysregulation og mikrovaskulær skade"
          },
          {
            "id": "2",
            "text": "Øget melaninproduktion på minutter"
          },
          {
            "id": "3",
            "text": "Isoleret hyperventilation"
          }
        ],
        "correct": "1",
        "explanation": "Svær sepsis kan medføre endotelskade og dissemineret intravaskulær koagulation."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke fund kan forekomme ved meningitis eller meningokoksepsis?",
        "options": [
          {
            "id": "4",
            "text": "Feber"
          },
          {
            "id": "3",
            "text": "Ikke-afblegende hudblødninger"
          },
          {
            "id": "2",
            "text": "Bevidsthedspåvirkning"
          },
          {
            "id": "1",
            "text": "Hovedpine"
          }
        ],
        "correct": [
          "1",
          "2",
          "3",
          "4"
        ],
        "explanation": "Manifestationerne varierer; ingen enkelt klassisk kombination er nødvendig for mistanke."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Microbiology (læseforslag)",
        "url": "https://openstax.org/details/books/microbiology"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      },
      {
        "title": "SSI – Nationale infektionshygiejniske retningslinjer (til faglig kontrol)",
        "url": "https://hygiejne.ssi.dk/retningslinjer/nir"
      }
    ],
    "status": "draft"
  },
  {
    "id": "aorta-01",
    "title": "Pludselige rygsmerter ved morgenkaffen",
    "category": "Kardiologi",
    "difficulty": "Paramediciner",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar aneurisme og dissektion.",
      "Relatér akut aortablødning til kompensatorisk fysiologi."
    ],
    "intro": "En 73-årig med kendt abdominalt aortaaneurisme får pludselige ryg- og mavesmerter, bliver bleg og svimmel.",
    "vitals": {
      "Puls": "112/min",
      "BT": "84/50 mmHg"
    },
    "takeaway": "Pludselige smerter og kredsløbspåvirkning kan være tegn på alvorlig aortapatologi.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind begreb og anatomi.",
        "left": [
          {
            "id": "1",
            "text": "Aneurisme"
          },
          {
            "id": "2",
            "text": "Dissektion"
          },
          {
            "id": "3",
            "text": "Ruptur"
          }
        ],
        "right": [
          {
            "id": "1",
            "text": "Brud med blødning gennem karvæggen"
          },
          {
            "id": "2",
            "text": "Patologisk udvidelse af et kar"
          },
          {
            "id": "3",
            "text": "Blod trænger ind mellem lag i karvæggen"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Begreberne beskriver forskellige strukturelle ændringer, som kan være samtidige."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvor kan blod fra et abdominalt aneurisme bløde hen?",
        "options": [
          {
            "id": "3",
            "text": "Kun i alveolerne"
          },
          {
            "id": "1",
            "text": "Retroperitonealt"
          },
          {
            "id": "2",
            "text": "Kun i perikardiet"
          }
        ],
        "correct": "1",
        "explanation": "Abdominal aorta er overvejende retroperitoneal, og ruptur kan give retroperitoneal blødning."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvad sker der typisk med slagvolumen ved akut stort blodtab?",
        "options": [
          {
            "id": "1",
            "text": "Falder ved reduceret preload"
          },
          {
            "id": "3",
            "text": "Ændres ikke ved hypovolæmi"
          },
          {
            "id": "2",
            "text": "Stiger uanset preload"
          }
        ],
        "correct": "1",
        "explanation": "Mindre venøst tilbageløb reducerer ventrikelfyldning og ofte slagvolumen."
      },
      {
        "id": "q4",
        "kind": "number",
        "prompt": "Beregn shockindeks (puls/systolisk BT) med to decimaler.",
        "answer": 1.33,
        "unit": "",
        "tolerance": 0.02,
        "explanation": "112/84 ≈ 1,33. Shockindeks er et supplement, ikke en diagnose."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "seizure-01",
    "title": "Rykninger i stuen",
    "category": "Neurologi",
    "difficulty": "Behandler",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar neuronal excitation og hæmning.",
      "Skeln mellem iktal og postiktal fase."
    ],
    "intro": "En 29-årig har haft generaliserede kramper og er nu søvnig og gradvis mere kontaktbar.",
    "vitals": {
      "Puls": "108/min",
      "Glukose": "5,8 mmol/L"
    },
    "takeaway": "Et krampeanfald har flere mulige årsager; udvikling efter anfaldet er vigtig.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvad kendetegner et epileptisk anfald?",
        "options": [
          {
            "id": "3",
            "text": "Altid cerebral blødning"
          },
          {
            "id": "1",
            "text": "Abnorm overdreven eller synkron neuronal aktivitet"
          },
          {
            "id": "2",
            "text": "Permanent ophør af alle nerveimpulser"
          }
        ],
        "correct": "1",
        "explanation": "Epileptiske anfald skyldes abnorm neuronal aktivitet, men årsagerne varierer."
      },
      {
        "id": "q2",
        "kind": "match",
        "prompt": "Forbind signalstof eller receptor og typisk funktion.",
        "left": [
          {
            "id": "1",
            "text": "GABA-A-receptor"
          },
          {
            "id": "2",
            "text": "Glutamat"
          },
          {
            "id": "3",
            "text": "Benzodiazepin"
          }
        ],
        "right": [
          {
            "id": "1",
            "text": "Positiv allosterisk modulation af GABA-A"
          },
          {
            "id": "3",
            "text": "Ligandstyret kloridkanal"
          },
          {
            "id": "2",
            "text": "Vigtigste excitatoriske signalstof i CNS"
          }
        ],
        "correct": {
          "1": "3",
          "2": "2",
          "3": "1"
        },
        "explanation": "GABA-A bidrager til hæmning; benzodiazepiner forstærker GABA-effekten."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvad betyder postiktal?",
        "options": [
          {
            "id": "2",
            "text": "Tiden før fødslen"
          },
          {
            "id": "1",
            "text": "Perioden efter anfaldet"
          },
          {
            "id": "3",
            "text": "Et normalt EKG"
          }
        ],
        "correct": "1",
        "explanation": "Postiktal fase kan omfatte forvirring og træthed efter anfald."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke alternative eller udløsende årsager er relevante?",
        "options": [
          {
            "id": "3",
            "text": "Infektion"
          },
          {
            "id": "1",
            "text": "Hypoglykæmi"
          },
          {
            "id": "4",
            "text": "Elektrolytforstyrrelse"
          },
          {
            "id": "2",
            "text": "Forgiftning"
          }
        ],
        "correct": [
          "1",
          "2",
          "3",
          "4"
        ],
        "explanation": "Kramper kan have metaboliske, toksiske, infektiøse og andre årsager."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      },
      {
        "title": "Lægemiddelstyrelsen – Produktresuméer (til faglig kontrol)",
        "url": "https://produktresume.dk/"
      }
    ],
    "status": "draft"
  },
  {
    "id": "head-01",
    "title": "Tiltagende hovedpine efter fald",
    "category": "Traumatologi",
    "difficulty": "Paramediciner",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar intrakraniel tryk-volume-relation.",
      "Beregn estimeret cerebral perfusion i en model."
    ],
    "intro": "En 58-årig bliver tiltagende sløv efter et fald. Patienten har hovedpine og har kastet op.",
    "vitals": {
      "BT": "170/92 mmHg",
      "Puls": "54/min"
    },
    "takeaway": "Sekundær hjerneskade kan påvirkes af hypoksi, perfusion og intrakranielt tryk.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind blødningslokalisation med anatomisk rum.",
        "left": [
          {
            "id": "1",
            "text": "Epidural"
          },
          {
            "id": "2",
            "text": "Subdural"
          },
          {
            "id": "3",
            "text": "Subaraknoidal"
          }
        ],
        "right": [
          {
            "id": "2",
            "text": "Mellem arachnoidea og pia"
          },
          {
            "id": "1",
            "text": "Mellem dura og arachnoidea"
          },
          {
            "id": "3",
            "text": "Mellem kranium og dura"
          }
        ],
        "correct": {
          "1": "3",
          "2": "1",
          "3": "2"
        },
        "explanation": "Hjernehinderne afgrænser de anatomiske rum."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad beskriver Monro-Kellie-doktrinen?",
        "options": [
          {
            "id": "1",
            "text": "Kraniets samlede indhold af hjerne, blod og CSF har begrænset plads"
          },
          {
            "id": "3",
            "text": "Hjernens perfusion er uafhængig af tryk"
          },
          {
            "id": "2",
            "text": "Kraniets volumen stiger frit ved blødning"
          }
        ],
        "correct": "1",
        "explanation": "Når kompensationsmuligheder udtømmes, kan volumenstigning øge ICP."
      },
      {
        "id": "q3",
        "kind": "number",
        "prompt": "I en tænkt model er MAP 100 og ICP 25 mmHg. Beregn CPP = MAP − ICP.",
        "answer": 75,
        "unit": "mmHg",
        "tolerance": 0.1,
        "explanation": "100 − 25 = 75 mmHg. ICP er givet som en undervisningsværdi, ikke et præhospitalt estimat."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke mekanismer kan bidrage til sekundær hjerneskade?",
        "options": [
          {
            "id": "3",
            "text": "Øget intrakranielt tryk"
          },
          {
            "id": "4",
            "text": "Normal ilttilførsel i sig selv"
          },
          {
            "id": "2",
            "text": "Hypotension"
          },
          {
            "id": "1",
            "text": "Hypoksi"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Forringet iltlevering og perfusion samt stigende tryk kan skade hjernen yderligere."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "arrest-01",
    "title": "Pludseligt kollaps ved aftensmaden",
    "category": "Kardiologi",
    "difficulty": "Elev",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar forskellen på elektrisk aktivitet og blodflow.",
      "Relatér hjertestop til ilttransport."
    ],
    "intro": "En 65-årig kollapser og reagerer ikke. I den fiktive case er hjertestop konstateret.",
    "vitals": {},
    "takeaway": "Effektiv cirkulation og ilttilførsel er afgørende for hjernens og hjertets overlevelse.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvad er hjertets vigtigste mekaniske funktion?",
        "options": [
          {
            "id": "1",
            "text": "At skabe blodflow gennem kredsløbet"
          },
          {
            "id": "3",
            "text": "At filtrere plasma"
          },
          {
            "id": "2",
            "text": "At producere røde blodlegemer"
          }
        ],
        "correct": "1",
        "explanation": "Hjertet fungerer som pumpe for lunge- og systemkredsløbet."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad beskriver ventrikelflimren?",
        "options": [
          {
            "id": "1",
            "text": "Kaotisk ventrikulær elektrisk aktivitet uden effektiv pumpefunktion"
          },
          {
            "id": "3",
            "text": "Regelmæssig atriel kontraktion med normal perfusion"
          },
          {
            "id": "2",
            "text": "Normal sinusrytme"
          }
        ],
        "correct": "1",
        "explanation": "Ved VF er ventriklernes aktivering ukoordineret og giver ikke effektivt minutvolumen."
      },
      {
        "id": "q3",
        "kind": "match",
        "prompt": "Forbind begreb med funktion.",
        "left": [
          {
            "id": "1",
            "text": "Ventilation"
          },
          {
            "id": "2",
            "text": "Perfusion"
          },
          {
            "id": "3",
            "text": "Diffusion"
          }
        ],
        "right": [
          {
            "id": "3",
            "text": "Luftbevægelse ind og ud af lungerne"
          },
          {
            "id": "1",
            "text": "Passage af gas over en membran"
          },
          {
            "id": "2",
            "text": "Blodgennemstrømning"
          }
        ],
        "correct": {
          "1": "3",
          "2": "2",
          "3": "1"
        },
        "explanation": "Alle tre indgår i transport af ilt fra omgivelser til væv."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvorfor kan elektrisk aktivitet på EKG ikke alene vise ROSC?",
        "options": [
          {
            "id": "3",
            "text": "EKG måler arteriel iltmætning"
          },
          {
            "id": "2",
            "text": "Alle rytmer giver normal puls"
          },
          {
            "id": "1",
            "text": "Elektrisk aktivitet kan være uden effektiv mekanisk cirkulation"
          }
        ],
        "correct": "1",
        "explanation": "Organiseret elektrisk aktivitet kan forekomme ved pulsløs elektrisk aktivitet."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "peds-02",
    "title": "Et barn bliver hurtigt udtrættet",
    "category": "Pædiatri",
    "difficulty": "Behandler",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar børns respiratoriske reserve.",
      "Relatér hypoksi til kredsløbspåvirkning hos børn."
    ],
    "intro": "Et 2-årigt barn har haft hoste og tiltagende respirationsarbejde. Barnet bliver mere stille og træt.",
    "vitals": {
      "RF": "48/min",
      "Puls": "148/min",
      "SpO₂": "89 %"
    },
    "takeaway": "Tiltagende træthed kan være tegn på svigtende kompensation selv uden mere synligt respirationsarbejde.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvorfor kan slimhindehævelse relativt hurtigt påvirke små børns luftveje?",
        "options": [
          {
            "id": "2",
            "text": "Børn har ingen bronkier"
          },
          {
            "id": "1",
            "text": "Mindre udgangsdiameter gør en given hævelse relativt større"
          },
          {
            "id": "3",
            "text": "Modstanden er uafhængig af diameter"
          }
        ],
        "correct": "1",
        "explanation": "Små luftveje har mindre reserve; en lille reduktion i radius øger modstanden."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad er en væsentlig årsag til hjertestop hos børn sammenlignet med voksne?",
        "options": [
          {
            "id": "1",
            "text": "Respirationssvigt og hypoksi"
          },
          {
            "id": "2",
            "text": "Altid primær koronar trombose"
          },
          {
            "id": "3",
            "text": "Altid hyperthyreose"
          }
        ],
        "correct": "1",
        "explanation": "Pædiatriske hjertestop følger ofte respiratorisk eller cirkulatorisk svigt."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke fund kan tyde på respiratorisk udtrætning?",
        "options": [
          {
            "id": "3",
            "text": "Uregelmæssig respiration"
          },
          {
            "id": "1",
            "text": "Tiltagende sløvhed"
          },
          {
            "id": "4",
            "text": "Normal kontakt og fuld symptomfrihed"
          },
          {
            "id": "2",
            "text": "Aftagende respirationsarbejde trods fortsat hypoksi"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Faldende arbejde kan være udtrætning snarere end bedring."
      },
      {
        "id": "q4",
        "kind": "number",
        "prompt": "Barnet har i en model et tidalvolumen på 100 ml og RF 48/min. Beregn minutventilation.",
        "answer": 4.8,
        "unit": "L/min",
        "tolerance": 0.05,
        "explanation": "100 × 48 = 4800 ml/min. Det antagne tidalvolumen er ikke en klinisk måling."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "hygiene-02",
    "title": "En syg rejsende",
    "category": "Infektion",
    "difficulty": "Behandler",
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Hygiejne",
      "Klinisk vurdering",
      "Kommunikation"
    ],
    "objectives": [
      "Skeln mellem smitteveje.",
      "Forklar hvorfor særlige forholdsregler afhænger af mistænkt agens."
    ],
    "intro": "En patient med feber er nyligt hjemvendt fra rejse og har haft nær kontakt med en person med ukendt alvorlig infektion.",
    "vitals": {
      "Temp": "39,0 °C"
    },
    "takeaway": "Ved mistanke om højrisikosmitte kræves aktuel lokal instruks; sygdommen kan ikke identificeres alene ud fra rejse og feber.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind smittevej og eksempel på overførsel.",
        "left": [
          {
            "id": "1",
            "text": "Kontaktsmitte"
          },
          {
            "id": "2",
            "text": "Dråbesmitte"
          },
          {
            "id": "3",
            "text": "Luftbåren smitte"
          }
        ],
        "right": [
          {
            "id": "3",
            "text": "Respiratoriske dråber til modtagelige slimhinder"
          },
          {
            "id": "1",
            "text": "Inhalation af smittebærende partikler som kan forblive i luften"
          },
          {
            "id": "2",
            "text": "Direkte eller indirekte kontakt med forurenet materiale"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Smitteveje er forskellige og kan overlappe."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad er inkubationstid?",
        "options": [
          {
            "id": "2",
            "text": "Tiden fra behandling til udskrivelse"
          },
          {
            "id": "3",
            "text": "Altid den periode man er mest smitsom"
          },
          {
            "id": "1",
            "text": "Tiden fra smitte til symptomdebut"
          }
        ],
        "correct": "1",
        "explanation": "Inkubationstid beskriver tiden til symptomer og er ikke identisk med smitteperioden."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke oplysninger er relevante for smitterisikovurdering?",
        "options": [
          {
            "id": "3",
            "text": "Symptomdebut"
          },
          {
            "id": "1",
            "text": "Rejsemål og datoer"
          },
          {
            "id": "4",
            "text": "Blodtype alene"
          },
          {
            "id": "2",
            "text": "Eksponering for syge personer"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Epidemiologisk kontekst og tidsforløb er væsentlige."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvad afgør konkrete særlige værnemidler og håndtering?",
        "options": [
          {
            "id": "2",
            "text": "Feberens størrelse alene"
          },
          {
            "id": "3",
            "text": "Patientens alder alene"
          },
          {
            "id": "1",
            "text": "En gældende instruks og konkret smitterisikovurdering"
          }
        ],
        "correct": "1",
        "explanation": "Forholdsregler afhænger af risiko og gældende instrukser."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Microbiology (læseforslag)",
        "url": "https://openstax.org/details/books/microbiology"
      },
      {
        "title": "SSI – Nationale infektionshygiejniske retningslinjer (til faglig kontrol)",
        "url": "https://hygiejne.ssi.dk/retningslinjer/nir"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "burn-01",
    "title": "En gryde vælter",
    "category": "Traumatologi",
    "difficulty": "Elev",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Identificér hudens lag og funktioner.",
      "Forklar følger af større hudskader."
    ],
    "intro": "En 36-årig har fået varm væske over underarmen. Huden er rød, smertefuld og enkelte steder med blærer.",
    "vitals": {
      "Puls": "98/min"
    },
    "takeaway": "Hudskader påvirker barriere, væske- og temperaturregulation; udseende og omfang kræver klinisk vurdering.",
    "steps": [
      {
        "id": "q1",
        "kind": "order",
        "prompt": "Sortér hudens og underhudens lag fra yderst til inderst.",
        "options": [
          {
            "id": "1",
            "text": "Subcutis"
          },
          {
            "id": "2",
            "text": "Dermis"
          },
          {
            "id": "3",
            "text": "Epidermis"
          }
        ],
        "correct": [
          "3",
          "2",
          "1"
        ],
        "explanation": "Epidermis ligger yderst, derefter dermis og subcutis."
      },
      {
        "id": "q2",
        "kind": "multi",
        "prompt": "Hvilke funktioner har huden?",
        "options": [
          {
            "id": "2",
            "text": "Temperaturregulation"
          },
          {
            "id": "4",
            "text": "Produktion af insulin"
          },
          {
            "id": "3",
            "text": "Sansning"
          },
          {
            "id": "1",
            "text": "Barriere mod mikroorganismer"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Huden er både fysisk barriere, sanseorgan og medvirker til temperaturregulation."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvilken mekanisme kan give væsketab ved omfattende forbrænding?",
        "options": [
          {
            "id": "3",
            "text": "Lukning af alle hudkar"
          },
          {
            "id": "2",
            "text": "Øget albuminsyntese på sekunder"
          },
          {
            "id": "1",
            "text": "Øget kapillærpermeabilitet og beskadiget barriere"
          }
        ],
        "correct": "1",
        "explanation": "Inflammation og tab af hudbarriere kan føre til væskeforskydning og tab."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvorfor er smerteintensitet alene ikke et sikkert mål for skadens dybde?",
        "options": [
          {
            "id": "2",
            "text": "Alle dybe skader gør altid mest ondt"
          },
          {
            "id": "3",
            "text": "Smerte kommer kun fra knogler"
          },
          {
            "id": "1",
            "text": "Dybe skader kan ødelægge sensoriske nerveender"
          }
        ],
        "correct": "1",
        "explanation": "Ved dybe skader kan nerveender være beskadigede, så smerte varierer."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "cold-01",
    "title": "Fundet i en kold have",
    "category": "Traumatologi",
    "difficulty": "Behandler",
    "subjects": [
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar kroppens varmebalance.",
      "Relatér hypotermi til metabolisme og koagulation."
    ],
    "intro": "En ældre person findes udendørs efter længere tid i kulde. Personen er sløv og har langsom puls.",
    "vitals": {
      "Kernetemperatur (fiktiv)": "32,5 °C",
      "Puls": "46/min"
    },
    "takeaway": "Hypotermi kan ændre både stofskifte, rytme og koagulation.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind varmetab med eksempel.",
        "left": [
          {
            "id": "1",
            "text": "Konduktion"
          },
          {
            "id": "2",
            "text": "Konvektion"
          },
          {
            "id": "3",
            "text": "Fordampning"
          }
        ],
        "right": [
          {
            "id": "2",
            "text": "Kontakt med kold jord"
          },
          {
            "id": "1",
            "text": "Våd hud afgiver varme ved fordampning"
          },
          {
            "id": "3",
            "text": "Vind fjerner opvarmet luft omkring kroppen"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Varme kan afgives på flere måder samtidig."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvordan påvirkes stofskiftet generelt ved faldende kernetemperatur?",
        "options": [
          {
            "id": "3",
            "text": "Det er altid konstant"
          },
          {
            "id": "2",
            "text": "Det stiger ubegrænset"
          },
          {
            "id": "1",
            "text": "Det falder"
          }
        ],
        "correct": "1",
        "explanation": "Lavere temperatur reducerer mange enzymatiske og metaboliske processer."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke ændringer kan ses ved betydelig hypotermi?",
        "options": [
          {
            "id": "1",
            "text": "Bradykardi"
          },
          {
            "id": "3",
            "text": "Bevidsthedspåvirkning"
          },
          {
            "id": "2",
            "text": "Koagulationsforstyrrelser"
          },
          {
            "id": "4",
            "text": "Konstant normal hjerterytme"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Hypotermi påvirker elektrisk aktivitet, enzymfunktion og CNS."
      },
      {
        "id": "q4",
        "kind": "scale",
        "prompt": "Placér den oplyste kernetemperatur på skalaen.",
        "answer": 32.5,
        "unit": "°C",
        "min": 25,
        "max": 40,
        "step": 0.5,
        "tolerance": 0.01,
        "explanation": "Den fiktive måling er 32,5 °C. Temperatur er en del af samlet vurdering."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "electric-01",
    "title": "Et stød på værkstedet",
    "category": "Traumatologi",
    "difficulty": "Behandler",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar elektrisk ledning gennem væv.",
      "Relatér elektrisk skade til arytmi og skjult vævsskade."
    ],
    "intro": "En elektriker har fået elektrisk stød og er nu vågen med smerte i hånden og hjertebanken.",
    "vitals": {
      "Puls": "104/min"
    },
    "takeaway": "Små hudfund udelukker ikke dybere skader eller påvirkning af hjertets rytme.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvilken vævsegenskab påvirker strøm gennem kroppen?",
        "options": [
          {
            "id": "3",
            "text": "Knoglens navn"
          },
          {
            "id": "1",
            "text": "Elektrisk modstand"
          },
          {
            "id": "2",
            "text": "Blodtype alene"
          }
        ],
        "correct": "1",
        "explanation": "Strømfordeling afhænger blandt andet af modstand, kontakt og spænding."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvilket system i hjertet kan påvirkes akut af elektrisk strøm?",
        "options": [
          {
            "id": "3",
            "text": "Kun koronarkarrenes anatomi"
          },
          {
            "id": "2",
            "text": "Kun perikardiets fedtvæv"
          },
          {
            "id": "1",
            "text": "Det elektriske ledningssystem"
          }
        ],
        "correct": "1",
        "explanation": "Elektrisk strøm kan forstyrre depolarisering og udløse arytmier."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke skader kan forekomme efter elektrisk påvirkning?",
        "options": [
          {
            "id": "4",
            "text": "Kun hudrødme"
          },
          {
            "id": "2",
            "text": "Dybe vævsskader"
          },
          {
            "id": "1",
            "text": "Arytmi"
          },
          {
            "id": "3",
            "text": "Sekundært faldtraume"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Elektricitet kan påvirke muskler, nerver, hjerte og give sekundære traumer."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvad betyder et beskedent hudmærke?",
        "options": [
          {
            "id": "1",
            "text": "Det siger ikke sikkert noget om dyb vævsskade"
          },
          {
            "id": "3",
            "text": "Det beviser hjertestop"
          },
          {
            "id": "2",
            "text": "Det udelukker alle skader"
          }
        ],
        "correct": "1",
        "explanation": "Ydre hudfund kan undervurdere den interne skade."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "geriatric-01",
    "title": "Mere forvirret efter en ny tablet",
    "category": "Geriatri",
    "difficulty": "Paramediciner",
    "subjects": [
      "Farmakologi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering",
      "Kommunikation"
    ],
    "objectives": [
      "Forklar clearance, halveringstid og akkumulering.",
      "Relatér polyfarmaci til delirium og fald."
    ],
    "intro": "En 84-årig har fået ændret medicin og er nu sløv og usikker på benene. Patienten har kendt nedsat nyrefunktion.",
    "vitals": {
      "BT": "100/62 mmHg",
      "Puls": "66/min"
    },
    "takeaway": "Polyfarmaci og ændret organfunktion kan gøre bivirkninger svære at skelne fra akut sygdom.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvad kan nedsat renal clearance gøre ved et primært renalt elimineret lægemiddel?",
        "options": [
          {
            "id": "2",
            "text": "Altid sænke koncentrationen"
          },
          {
            "id": "1",
            "text": "Øge eksponering og risiko for akkumulering"
          },
          {
            "id": "3",
            "text": "Ophæve lægemidlets virkning straks"
          }
        ],
        "correct": "1",
        "explanation": "Langsommere elimination kan øge eksponeringen ved uændret dosering."
      },
      {
        "id": "q2",
        "kind": "match",
        "prompt": "Forbind farmakokinetisk begreb og betydning.",
        "left": [
          {
            "id": "1",
            "text": "Absorption"
          },
          {
            "id": "2",
            "text": "Distribution"
          },
          {
            "id": "3",
            "text": "Elimination"
          }
        ],
        "right": [
          {
            "id": "3",
            "text": "Fordeling mellem blod og væv"
          },
          {
            "id": "1",
            "text": "Fjernelse fra kroppen via metabolisme og/eller udskillelse"
          },
          {
            "id": "2",
            "text": "Optagelse til systemisk kredsløb"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Farmakokinetik beskriver, hvad kroppen gør ved lægemidlet."
      },
      {
        "id": "q3",
        "kind": "number",
        "prompt": "I en model med førsteordenskinetik er halveringstiden 8 timer. Hvor mange procent er tilbage efter 16 timer?",
        "answer": 25,
        "unit": "%",
        "tolerance": 0.01,
        "explanation": "Efter to halveringstider er ½ × ½ = ¼ tilbage. Modellen antager ingen ny dosis."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke oplysninger er relevante ved pludselig forvirring hos en ældre?",
        "options": [
          {
            "id": "1",
            "text": "Habituel funktion"
          },
          {
            "id": "2",
            "text": "Nye lægemidler"
          },
          {
            "id": "4",
            "text": "At alder alene forklarer akut ændring"
          },
          {
            "id": "3",
            "text": "Infektionstegn og væskeindtag"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Delirium er en akut ændring, som kan have mange samtidige udløsere."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      },
      {
        "title": "Lægemiddelstyrelsen – Produktresuméer (til faglig kontrol)",
        "url": "https://produktresume.dk/"
      }
    ],
    "status": "draft"
  },
  {
    "id": "psyche-01",
    "title": "En urolig patient i en lejlighed",
    "category": "Psykiatri",
    "difficulty": "Behandler",
    "subjects": [
      "Sygdomslære",
      "Klinisk vurdering",
      "Kommunikation"
    ],
    "objectives": [
      "Skeln mellem hallucinationer og vrangforestillinger.",
      "Anvend rolig, respektfuld kommunikation og overvej somatiske årsager."
    ],
    "intro": "En 30-årig oplever stemmer og er bange for at blive overvåget. Patienten er vågen, men har svært ved at finde ro.",
    "vitals": {
      "Puls": "106/min"
    },
    "takeaway": "Psykiske symptomer kan have både psykiatriske og somatiske årsager; kommunikation og sikkerhed er centrale.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind begreb med beskrivelse.",
        "left": [
          {
            "id": "1",
            "text": "Hallucination"
          },
          {
            "id": "2",
            "text": "Vrangforestilling"
          },
          {
            "id": "3",
            "text": "Delirium"
          }
        ],
        "right": [
          {
            "id": "3",
            "text": "Fast overbevisning, som ikke korrigeres af modstridende evidens og ikke er kulturelt forventelig"
          },
          {
            "id": "1",
            "text": "Akut, ofte fluktuerende forstyrrelse af opmærksomhed og bevidsthed"
          },
          {
            "id": "2",
            "text": "Sanseoplevelse uden tilsvarende ydre stimulus"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Begreberne beskriver forskellige symptomtyper og tilstande."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvilken sætning anerkender patientens oplevelse uden at bekræfte en vrangforestilling?",
        "options": [
          {
            "id": "3",
            "text": "Det er noget pjat."
          },
          {
            "id": "2",
            "text": "Ja, de overvåger dig helt sikkert."
          },
          {
            "id": "1",
            "text": "Jeg kan se, at det er skræmmende for dig."
          }
        ],
        "correct": "1",
        "explanation": "Anerkend følelsen og bevar en neutral, respektfuld tilgang."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke somatiske årsager kan give ændret adfærd?",
        "options": [
          {
            "id": "3",
            "text": "Infektion"
          },
          {
            "id": "4",
            "text": "Hypoksi"
          },
          {
            "id": "2",
            "text": "Forgiftning"
          },
          {
            "id": "1",
            "text": "Hypoglykæmi"
          }
        ],
        "correct": [
          "1",
          "2",
          "3",
          "4"
        ],
        "explanation": "Akut ændret adfærd kræver også overvejelse af somatisk årsag."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvilken kommunikationsform er ofte hensigtsmæssig ved uro?",
        "options": [
          {
            "id": "2",
            "text": "Rolig stemme og korte, tydelige budskaber"
          },
          {
            "id": "1",
            "text": "Flere taler hurtigt samtidig"
          },
          {
            "id": "3",
            "text": "Konfrontation om alle oplevelser"
          }
        ],
        "correct": "2",
        "explanation": "En enkel og rolig kommunikation kan reducere stimuli og fremme samarbejde."
      }
    ],
    "sources": [
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "birth-01",
    "title": "Veer i hjemmet",
    "category": "Obstetrik",
    "difficulty": "Elev",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Endokrinologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar placenta, navlesnor og fødslens faser.",
      "Skeln mellem maternel og føtal cirkulation."
    ],
    "intro": "En gravid i uge 39 har regelmæssige veer og tiltagende trykfornemmelse.",
    "vitals": {
      "Puls": "90/min"
    },
    "takeaway": "Fødsel er en fysiologisk proces, men både mor og barn kan udvikle akutte komplikationer.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvad er placentas væsentlige funktion?",
        "options": [
          {
            "id": "3",
            "text": "Direkte sammenblanding af alt moderens og fosterets blod"
          },
          {
            "id": "2",
            "text": "Produktion af moderens urin"
          },
          {
            "id": "1",
            "text": "Udveksling af gasser og næringsstoffer mellem mor og foster"
          }
        ],
        "correct": "1",
        "explanation": "Placenta muliggør udveksling over en barriere; de to kredsløb er normalt adskilt."
      },
      {
        "id": "q2",
        "kind": "match",
        "prompt": "Forbind struktur og funktion.",
        "left": [
          {
            "id": "1",
            "text": "Navlevene"
          },
          {
            "id": "2",
            "text": "Navlearterier"
          },
          {
            "id": "3",
            "text": "Uterus"
          }
        ],
        "right": [
          {
            "id": "2",
            "text": "Fører relativt iltrigt blod fra placenta til foster"
          },
          {
            "id": "1",
            "text": "Muskelorgan som kontraherer under fødslen"
          },
          {
            "id": "3",
            "text": "Fører blod fra foster til placenta"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Navlevenen fører blod mod fosteret, arterierne mod placenta."
      },
      {
        "id": "q3",
        "kind": "order",
        "prompt": "Sæt fødslens hovedfaser i rækkefølge.",
        "options": [
          {
            "id": "3",
            "text": "Udvidningsfase"
          },
          {
            "id": "1",
            "text": "Efterbyrdsfase"
          },
          {
            "id": "2",
            "text": "Uddrivningsfase"
          }
        ],
        "correct": [
          "3",
          "2",
          "1"
        ],
        "explanation": "Livmoderhalsen udvides, barnet fødes, derefter placenta."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvilket hormon stimulerer kontraktion af uterus?",
        "options": [
          {
            "id": "1",
            "text": "Oxytocin"
          },
          {
            "id": "2",
            "text": "Insulin"
          },
          {
            "id": "3",
            "text": "Melatonin"
          }
        ],
        "correct": "1",
        "explanation": "Oxytocin fremmer kontraktion af uterus og indgår i fødslens feedbackmekanisme."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "obst-02",
    "title": "Hovedpine sent i graviditeten",
    "category": "Obstetrik",
    "difficulty": "Paramediciner",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Endokrinologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar præeklampsi som multisystemisk sygdom.",
      "Relatér endoteldysfunktion til symptomer."
    ],
    "intro": "En gravid i uge 34 har ny svær hovedpine, synsforstyrrelser og ubehag under højre ribbenskant.",
    "vitals": {
      "BT": "168/110 mmHg",
      "Puls": "94/min"
    },
    "takeaway": "Hypertension med neurologiske eller andre organsymptomer i graviditeten kan afspejle alvorlig multisystemisk sygdom.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvilken mekanisme er central ved præeklampsi?",
        "options": [
          {
            "id": "2",
            "text": "Isoleret insulinmangel hos alle"
          },
          {
            "id": "1",
            "text": "Placental dysfunktion og systemisk endoteldysfunktion"
          },
          {
            "id": "3",
            "text": "Udelukkende lavt venøst tilbageløb"
          }
        ],
        "correct": "1",
        "explanation": "Placental dysfunktion kan medføre systemisk vaskulær og organpåvirkning."
      },
      {
        "id": "q2",
        "kind": "match",
        "prompt": "Forbind manifestation og mulig organpåvirkning.",
        "left": [
          {
            "id": "1",
            "text": "Synsforstyrrelser"
          },
          {
            "id": "2",
            "text": "Proteinuri"
          },
          {
            "id": "3",
            "text": "Smerte under højre ribbenskant"
          }
        ],
        "right": [
          {
            "id": "3",
            "text": "Glomerulær påvirkning"
          },
          {
            "id": "2",
            "text": "Neurologisk påvirkning"
          },
          {
            "id": "1",
            "text": "Leverpåvirkning"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Symptomer kan afspejle påvirkning af forskellige organer."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvad betegner eklampsi?",
        "options": [
          {
            "id": "3",
            "text": "Normal livmoderkontraktion"
          },
          {
            "id": "2",
            "text": "Enhver gravid med ødemer"
          },
          {
            "id": "1",
            "text": "Nyopståede kramper relateret til præeklampsi uden anden forklaring"
          }
        ],
        "correct": "1",
        "explanation": "Eklampsi er kramper i forbindelse med præeklampsi, når anden årsag ikke forklarer anfaldet."
      },
      {
        "id": "q4",
        "kind": "number",
        "prompt": "Estimér MAP fra 168/110 mmHg.",
        "answer": 129.3,
        "unit": "mmHg",
        "tolerance": 1,
        "explanation": "(168 + 2 × 110)/3 ≈ 129,3 mmHg. MAP er et estimat og ikke et selvstændigt diagnostisk kriterium."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "renal-02",
    "title": "Svaghed med kendt nyresygdom",
    "category": "Nefrologi",
    "difficulty": "Paramediciner",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar kaliumhomeostase og membranpotentiale.",
      "Relatér nyresvigt til arytmirisiko."
    ],
    "intro": "En 67-årig med nyresygdom har muskelsvaghed og føler sig utilpas. I et fiktivt efterfølgende laboratoriesvar er kalium forhøjet.",
    "vitals": {
      "Puls": "54/min",
      "K⁺ (fiktiv)": "6,8 mmol/L"
    },
    "takeaway": "Hyperkaliæmi kan påvirke hjertets elektriske aktivitet; et normalt EKG udelukker ikke alvorlig hyperkaliæmi.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvilken vigtig funktion har nyrerne for kaliumbalancen?",
        "options": [
          {
            "id": "3",
            "text": "Forhindrer al kaliumfiltration"
          },
          {
            "id": "1",
            "text": "Regulerer udskillelse af kalium"
          },
          {
            "id": "2",
            "text": "Producerer alle kroppens kaliumioner"
          }
        ],
        "correct": "1",
        "explanation": "Renal udskillelse er en vigtig del af kaliumhomeostasen."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad gør øget ekstracellulært kalium typisk ved hvilemembranpotentialet?",
        "options": [
          {
            "id": "2",
            "text": "Gør det altid mere negativt"
          },
          {
            "id": "1",
            "text": "Gør det mindre negativt"
          },
          {
            "id": "3",
            "text": "Ændrer det ikke"
          }
        ],
        "correct": "1",
        "explanation": "Den reducerede kaliumgradient depolariserer hvilepotentialet; ved alvorlig hyperkaliæmi kan natriumkanaler inaktiveres."
      },
      {
        "id": "q3",
        "kind": "match",
        "prompt": "Forbind mekanisme og effekt.",
        "left": [
          {
            "id": "1",
            "text": "Insulin"
          },
          {
            "id": "2",
            "text": "Aldosteron"
          },
          {
            "id": "3",
            "text": "Nedsat renal funktion"
          }
        ],
        "right": [
          {
            "id": "1",
            "text": "Kan begrænse kaliumudskillelse"
          },
          {
            "id": "3",
            "text": "Fremmer renal kaliumsekretion"
          },
          {
            "id": "2",
            "text": "Fremmer cellulært kaliumoptag"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Kaliumkoncentration påvirkes både af transcellulær fordeling og udskillelse."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke EKG-ændringer kan forekomme ved hyperkaliæmi?",
        "options": [
          {
            "id": "3",
            "text": "Svækket eller manglende P-tak"
          },
          {
            "id": "1",
            "text": "Spidse T-takker"
          },
          {
            "id": "2",
            "text": "Breddeøget QRS"
          },
          {
            "id": "4",
            "text": "Altid helt identisk normalrytme"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "EKG-forandringer varierer, og fravær af disse udelukker ikke hyperkaliæmi."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      },
      {
        "title": "Lægemiddelstyrelsen – Produktresuméer (til faglig kontrol)",
        "url": "https://produktresume.dk/"
      }
    ],
    "status": "draft"
  },
  {
    "id": "drug-02",
    "title": "En forveksling i medicintasken",
    "category": "Farmakologi",
    "difficulty": "Elev",
    "subjects": [
      "Farmakologi",
      "Medicinregning",
      "Hygiejne",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Beregn volumen ud fra en fiktiv ordination.",
      "Forklar grundlæggende medicinsikkerhed."
    ],
    "intro": "Under en simulation er to ampuller med samme fiktive stof mærket med forskellige koncentrationer. Instruktøren angiver en øvelsesordination på 6 mg.",
    "vitals": {},
    "takeaway": "Koncentration og samlet mængde er forskellige. Beregninger erstatter ikke kontrol af lægemiddel og ordination.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvad betyder 2 mg/ml?",
        "options": [
          {
            "id": "1",
            "text": "2 mg stof i hver ml"
          },
          {
            "id": "2",
            "text": "2 ml stof i hver mg"
          },
          {
            "id": "3",
            "text": "2 mg i hele ampullen uanset volumen"
          }
        ],
        "correct": "1",
        "explanation": "Koncentration er mængde pr. volumen."
      },
      {
        "id": "q2",
        "kind": "number",
        "prompt": "Hvor mange ml svarer 6 mg til ved 2 mg/ml?",
        "answer": 3,
        "unit": "ml",
        "tolerance": 0.01,
        "explanation": "6 mg / 2 mg/ml = 3 ml. Dette er en fiktiv regneøvelse."
      },
      {
        "id": "q3",
        "kind": "number",
        "prompt": "Hvor mange ml svarer 6 mg til ved 10 mg/ml?",
        "answer": 0.6,
        "unit": "ml",
        "tolerance": 0.01,
        "explanation": "6 / 10 = 0,6 ml. Samme stofmængde kræver mindre volumen ved højere koncentration."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke kontroller er relevante før medicinadministration?",
        "options": [
          {
            "id": "4",
            "text": "Kun ampullens farve"
          },
          {
            "id": "1",
            "text": "Identitet og ordination"
          },
          {
            "id": "3",
            "text": "Administrationsvej og udløb"
          },
          {
            "id": "2",
            "text": "Stof og koncentration"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Systematisk kontrol reducerer risikoen for forvekslinger. Følg gældende lokal instruks."
      }
    ],
    "sources": [
      {
        "title": "Lægemiddelstyrelsen – Produktresuméer (til faglig kontrol)",
        "url": "https://produktresume.dk/"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "drug-03",
    "title": "Svimmel efter et nyt lægemiddel",
    "category": "Farmakologi",
    "difficulty": "Behandler",
    "subjects": [
      "Farmakologi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Skeln mellem agonist, antagonist og bivirkning.",
      "Forklar additive farmakodynamiske virkninger."
    ],
    "intro": "En 68-årig har svimmelhed efter en medicinændring. Personen tager allerede flere blodtrykssænkende lægemidler.",
    "vitals": {
      "BT": "90/56 mmHg",
      "Puls": "60/min"
    },
    "takeaway": "Lægemiddeleffekter kan interagere; tidsforløb og andre sygdomsårsager skal vurderes.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind farmakologisk begreb og definition.",
        "left": [
          {
            "id": "1",
            "text": "Agonist"
          },
          {
            "id": "2",
            "text": "Antagonist"
          },
          {
            "id": "3",
            "text": "Bivirkning"
          }
        ],
        "right": [
          {
            "id": "1",
            "text": "Uønsket skadelig reaktion på et lægemiddel"
          },
          {
            "id": "3",
            "text": "Hæmmer aktivering af en receptor"
          },
          {
            "id": "2",
            "text": "Aktiverer en receptor"
          }
        ],
        "correct": {
          "1": "2",
          "2": "3",
          "3": "1"
        },
        "explanation": "Agonister aktiverer, antagonister blokerer receptoraktivitet, og bivirkninger er uønskede virkninger."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvad er en farmakodynamisk interaktion?",
        "options": [
          {
            "id": "2",
            "text": "Kun ændret renal udskillelse"
          },
          {
            "id": "3",
            "text": "Kun en ændret tabletfarve"
          },
          {
            "id": "1",
            "text": "Lægemidler påvirker hinandens virkninger"
          }
        ],
        "correct": "1",
        "explanation": "Farmakodynamiske interaktioner ændrer effekten uden nødvendigvis at ændre koncentrationen."
      },
      {
        "id": "q3",
        "kind": "choice",
        "prompt": "Hvad kan ske, når to midler begge sænker blodtrykket?",
        "options": [
          {
            "id": "1",
            "text": "Effekterne kan være additive"
          },
          {
            "id": "2",
            "text": "De ophæver altid hinanden"
          },
          {
            "id": "3",
            "text": "De virker kun i lungerne"
          }
        ],
        "correct": "1",
        "explanation": "Samtidige blodtrykssænkende effekter kan øge risiko for hypotension."
      },
      {
        "id": "q4",
        "kind": "multi",
        "prompt": "Hvilke oplysninger hjælper ved vurdering af mulig lægemiddelbivirkning?",
        "options": [
          {
            "id": "3",
            "text": "Øvrige lægemidler"
          },
          {
            "id": "1",
            "text": "Tidspunkt for sidste dosis"
          },
          {
            "id": "2",
            "text": "Nylige ændringer"
          },
          {
            "id": "4",
            "text": "Andre mulige årsager til symptomerne"
          }
        ],
        "correct": [
          "1",
          "2",
          "3",
          "4"
        ],
        "explanation": "Tidsforløb og samlet klinisk kontekst er nødvendige."
      }
    ],
    "sources": [
      {
        "title": "Lægemiddelstyrelsen – Produktresuméer (til faglig kontrol)",
        "url": "https://produktresume.dk/"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "bariatric-01",
    "title": "Åndenød i fladt rygleje",
    "category": "Respiration",
    "difficulty": "Behandler",
    "subjects": [
      "Anatomi",
      "Fysiologi",
      "Patofysiologi",
      "Klinisk vurdering",
      "Kommunikation"
    ],
    "objectives": [
      "Forklar funktionel residualkapacitet og respirationsmekanik.",
      "Anvend værdig og individuelt tilpasset kommunikation."
    ],
    "intro": "En svært overvægtig patient oplever mere åndenød i fladt rygleje. Patienten fortæller om tidligere dårlige oplevelser ved transport.",
    "vitals": {
      "RF": "26/min",
      "SpO₂": "93 %"
    },
    "takeaway": "Respirationsmekanik og individuelle behov skal vurderes uden at reducere patienten til kropsvægt.",
    "steps": [
      {
        "id": "q1",
        "kind": "choice",
        "prompt": "Hvad beskriver funktionel residualkapacitet (FRC)?",
        "options": [
          {
            "id": "3",
            "text": "Blodvolumen i lungerne"
          },
          {
            "id": "1",
            "text": "Luftvolumen tilbage efter normal passiv eksspiration"
          },
          {
            "id": "2",
            "text": "Luft indåndet ved maksimal inspiration"
          }
        ],
        "correct": "1",
        "explanation": "FRC er residualvolumen plus eksspiratorisk reservevolumen."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvorfor kan svært øget abdominal belastning i rygleje mindske FRC?",
        "options": [
          {
            "id": "1",
            "text": "Diafragma forskydes kranielt"
          },
          {
            "id": "2",
            "text": "Trachea forsvinder"
          },
          {
            "id": "3",
            "text": "Hæmoglobin mister altid al ilt"
          }
        ],
        "correct": "1",
        "explanation": "Abdominal belastning kan begrænse diafragmas bevægelse og reducere lungevolumen."
      },
      {
        "id": "q3",
        "kind": "multi",
        "prompt": "Hvilke forhold bør vurderes individuelt?",
        "options": [
          {
            "id": "4",
            "text": "Antagelse om at alle symptomer skyldes vægten"
          },
          {
            "id": "3",
            "text": "Respiratoriske fund"
          },
          {
            "id": "1",
            "text": "Patientens foretrukne stilling og komfort"
          },
          {
            "id": "2",
            "text": "Egnet udstyr og arbejdsmiljø"
          }
        ],
        "correct": [
          "1",
          "2",
          "3"
        ],
        "explanation": "Individuel vurdering, sikkerhed og værdighed er centrale."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvilket spørgsmål er mest respektfuldt?",
        "options": [
          {
            "id": "1",
            "text": "Hvilken stilling gør det lettest for dig at trække vejret?"
          },
          {
            "id": "3",
            "text": "Kan du ikke tage dig sammen?"
          },
          {
            "id": "2",
            "text": "Hvorfor er du ikke bare gået ned i vægt?"
          }
        ],
        "correct": "1",
        "explanation": "Spørgsmål om funktion og patientens behov fremmer samarbejde."
      }
    ],
    "sources": [
      {
        "title": "OpenStax – Anatomy and Physiology 2e (læseforslag)",
        "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
      },
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  },
  {
    "id": "comm-01",
    "title": "Tre personer taler samtidig",
    "category": "Kommunikation",
    "difficulty": "Elev",
    "subjects": [
      "Kommunikation",
      "Klinisk vurdering"
    ],
    "objectives": [
      "Forklar struktureret overlevering og closed-loop.",
      "Skeln mellem observation og fortolkning."
    ],
    "intro": "Ved overlevering af en patient taler flere medarbejdere samtidig. Der er risiko for, at en ændring i bevidsthedsniveauet overses.",
    "vitals": {},
    "takeaway": "Tydelig kommunikation og dokumentation kan reducere tab af vigtig information.",
    "steps": [
      {
        "id": "q1",
        "kind": "match",
        "prompt": "Forbind ISBAR-element og indhold.",
        "left": [
          {
            "id": "1",
            "text": "I – Identifikation"
          },
          {
            "id": "2",
            "text": "S – Situation"
          },
          {
            "id": "3",
            "text": "B – Baggrund"
          },
          {
            "id": "4",
            "text": "A – Analyse"
          },
          {
            "id": "5",
            "text": "R – Råd/Recommendation"
          }
        ],
        "right": [
          {
            "id": "5",
            "text": "Relevant sygehistorie"
          },
          {
            "id": "2",
            "text": "Hvad der ønskes eller aftales"
          },
          {
            "id": "1",
            "text": "Aktuel vurdering"
          },
          {
            "id": "3",
            "text": "Hvem taler og hvem patienten er"
          },
          {
            "id": "4",
            "text": "Aktuelt problem"
          }
        ],
        "correct": {
          "1": "3",
          "2": "4",
          "3": "5",
          "4": "1",
          "5": "2"
        },
        "explanation": "ISBAR organiserer oplysninger til en struktureret overlevering."
      },
      {
        "id": "q2",
        "kind": "choice",
        "prompt": "Hvilken formulering er en observation?",
        "options": [
          {
            "id": "2",
            "text": "Patienten er sikkert bare træt"
          },
          {
            "id": "3",
            "text": "Patienten er altid besværlig"
          },
          {
            "id": "1",
            "text": "Patienten åbner øjnene ved tiltale"
          }
        ],
        "correct": "1",
        "explanation": "Observation beskriver konkrete fund; de andre er fortolkninger eller vurderinger."
      },
      {
        "id": "q3",
        "kind": "order",
        "prompt": "Sæt et closed-loop-forløb i rækkefølge.",
        "options": [
          {
            "id": "3",
            "text": "Afsender giver tydelig besked"
          },
          {
            "id": "2",
            "text": "Modtager gentager besked"
          },
          {
            "id": "1",
            "text": "Afsender bekræfter eller korrigerer"
          }
        ],
        "correct": [
          "3",
          "2",
          "1"
        ],
        "explanation": "Gentagelse og bekræftelse giver mulighed for at opdage misforståelser."
      },
      {
        "id": "q4",
        "kind": "choice",
        "prompt": "Hvilken information er særlig relevant ved ændring i bevidsthed?",
        "options": [
          {
            "id": "2",
            "text": "Kun patientens fornavn"
          },
          {
            "id": "1",
            "text": "Tidspunkt, objektive fund og udvikling"
          },
          {
            "id": "3",
            "text": "Kun tidligere normal måling"
          }
        ],
        "correct": "1",
        "explanation": "En tidslinje og konkrete observationer gør ændringen tydelig."
      }
    ],
    "sources": [
      {
        "title": "MSD Manual Professional (læseforslag)",
        "url": "https://www.msdmanuals.com/professional"
      }
    ],
    "status": "draft"
  }
];
