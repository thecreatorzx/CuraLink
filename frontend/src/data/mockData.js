export const MOCK_RESPONSE = {
  condition_overview:
    "Glioblastoma Multiforme (GBM) is the most aggressive primary brain tumor in adults, classified as WHO Grade IV. It arises from astrocytes and is characterized by rapid proliferation, extensive neovascularization, and diffuse infiltration of surrounding brain tissue. Median overall survival remains approximately 14–16 months with standard-of-care therapy; however, emerging immunotherapy and targeted-agent trials are demonstrating early efficacy signals in molecularly selected subgroups.",
  research_insights: [
    "IDH-wildtype GBM accounts for ~90% of cases and carries a significantly worse prognosis compared to IDH-mutant variants; molecular stratification is now mandatory for treatment planning.",
    "MGMT promoter methylation is the strongest predictive biomarker for temozolomide response, present in ~45% of newly diagnosed GBM patients and strongly associated with improved OS.",
    "Tumor Treating Fields (Optune) combined with maintenance temozolomide demonstrated a statistically significant 3-month overall survival benefit in the landmark EF-14 randomized trial.",
    "CAR-T cell therapies targeting EGFRvIII and IL13Rα2 are under active Phase I/II investigation, with early data showing intracranial antitumor activity in heavily pre-treated patients.",
  ],
  recommendations: [
    "Obtain comprehensive genomic profiling — including IDH1/2, MGMT, EGFR amplification, TERT promoter, and 1p/19q codeletion — prior to initiating any treatment protocol.",
    "Initiate Stupp protocol (maximal safe surgical resection → RT 60 Gy + concurrent TMZ → 6 cycles adjuvant TMZ) as the current standard-of-care backbone.",
    "For MGMT-unmethylated patients, where TMZ benefit is limited, strongly consider enrollment in a Phase II/III clinical trial evaluating novel agents.",
    "Multidisciplinary neuro-oncology tumor board review is mandatory before finalizing the treatment strategy.",
  ],
  publications: [
    {
      title:
        "Radiotherapy plus Concomitant and Adjuvant Temozolomide for Glioblastoma",
      url: "#",
      year: 2005,
      journal: "New England Journal of Medicine",
    },
    {
      title:
        "Tumor Treating Fields with Maintenance Temozolomide in Newly Diagnosed GBM: EF-14 Trial",
      url: "#",
      year: 2017,
      journal: "JAMA",
    },
    {
      title:
        "MGMT Promoter Methylation and Benefit from Bevacizumab in Glioblastoma",
      url: "#",
      year: 2021,
      journal: "Nature Medicine",
    },
    {
      title:
        "CAR-T Targeting EGFRvIII in Recurrent Glioblastoma: Phase I Safety and Efficacy",
      url: "#",
      year: 2023,
      journal: "Journal of Clinical Oncology",
    },
  ],
  clinical_trials: [
    {
      title: "INDIGO: Vorasidenib in IDH1/2-Mutant Diffuse Glioma",
      status: "Active",
      location: "Multi-center, USA / Europe",
      url: "#",
      phase: "Phase III",
    },
    {
      title: "GBM-AGILE: Adaptive Global Innovative Learning Environment",
      status: "Recruiting",
      location: "International",
      url: "#",
      phase: "Phase II/III",
    },
    {
      title: "PANOVA-3: TTFields + Gemcitabine / Nab-Paclitaxel",
      status: "Completed",
      location: "Multi-center, USA",
      url: "#",
      phase: "Phase III",
    },
    {
      title: "CARTEGENE: CAR-T for Recurrent GBM with EGFRvIII Expression",
      status: "Recruiting",
      location: "Memorial Sloan Kettering, NYC",
      url: "#",
      phase: "Phase I/II",
    },
  ],
};

export const RECENT_SESSIONS = [
  {
    id: 1,
    name: "Glioblastoma Multiforme",
    subtitle: "GBM Grade IV · Research",
    time: "2m ago",
    active: true,
  },
  {
    id: 2,
    name: "Elena Vasquez, 58F",
    subtitle: "Pancreatic Adenocarcinoma",
    time: "1h ago",
    active: false,
  },
  {
    id: 3,
    name: "Marcus Obi, 42M",
    subtitle: "Acute Myeloid Leukemia",
    time: "3h ago",
    active: false,
  },
  {
    id: 4,
    name: "Hypertrophic CM",
    subtitle: "Obstructive phenotype review",
    time: "Yesterday",
    active: false,
  },
  {
    id: 5,
    name: "Sarah Chen, 31F",
    subtitle: "Systemic Lupus Erythematosus",
    time: "2d ago",
    active: false,
  },
  {
    id: 6,
    name: "COPD Exacerbation",
    subtitle: "GOLD Stage III protocol",
    time: "3d ago",
    active: false,
  },
];
