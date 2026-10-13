export interface DrugDose {
  name: string;
  category: 'Induction' | 'Neuromuscular Block' | 'Reversal' | 'Opioid' | 'Emergency / Vasopressor';
  indication: string;
  dosePerKg: number;
  unit: 'mg/kg' | 'mcg/kg' | 'mL/kg';
  concentrationMgPerMl?: number;
  maxDose?: number;
  clinicalNote: string;
}

export interface CrisisProtocol {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  immediateActions: string[];
  drugDosing: {
    drug: string;
    calculation: (weightKg: number) => string;
    route: string;
    instructions: string;
  }[];
  criticalPearls: string[];
}

export const CORE_ANESTHESIA_DRUGS: DrugDose[] = [
  {
    name: 'Propofol',
    category: 'Induction',
    indication: 'Standard Induction of General Anesthesia',
    dosePerKg: 2.0,
    unit: 'mg/kg',
    concentrationMgPerMl: 10,
    clinicalNote: 'Reduce to 1.0 - 1.5 mg/kg in elderly or hemodynamically unstable. Causes vasodilation & apnea.',
  },
  {
    name: 'Ketamine',
    category: 'Induction',
    indication: 'Dissociative Induction (Shock, Asthma, Trauma)',
    dosePerKg: 1.5,
    unit: 'mg/kg',
    concentrationMgPerMl: 50,
    clinicalNote: 'Sympathomimetic; preserves airway reflexes & systemic BP. Bronchodilator.',
  },
  {
    name: 'Etomidate',
    category: 'Induction',
    indication: 'Hemodynamically Stable Induction (Severe CAD, Valvular Disease)',
    dosePerKg: 0.25,
    unit: 'mg/kg',
    concentrationMgPerMl: 2,
    clinicalNote: 'Minimal myocardial depression. Inhibits 11-beta-hydroxylase (adrenal suppression).',
  },
  {
    name: 'Rocuronium',
    category: 'Neuromuscular Block',
    indication: 'Tracheal Intubation (Elective vs RSI)',
    dosePerKg: 0.6,
    unit: 'mg/kg',
    concentrationMgPerMl: 10,
    clinicalNote: 'For Rapid Sequence Induction (RSI), use 1.2 mg/kg. Reversible with Sugammadex.',
  },
  {
    name: 'Succinylcholine',
    category: 'Neuromuscular Block',
    indication: 'Rapid Sequence Induction (Gold Standard)',
    dosePerKg: 1.5,
    unit: 'mg/kg',
    concentrationMgPerMl: 50,
    clinicalNote: 'Contraindicated in burns >24h, denervation, hyperkalemia, muscular dystrophy, MH susceptibility.',
  },
  {
    name: 'Sugammadex',
    category: 'Reversal',
    indication: 'Specific Reversal of Rocuronium / Vecuronium',
    dosePerKg: 2.0,
    unit: 'mg/kg',
    concentrationMgPerMl: 100,
    clinicalNote: '2 mg/kg for moderate block (TOF count 2); 4 mg/kg for deep block (PTC 1-2); 16 mg/kg for immediate rescue after 1.2 mg/kg rocuronium.',
  },
  {
    name: 'Neostigmine + Glycopyrrolate',
    category: 'Reversal',
    indication: 'Conventional Reversal of Non-depolarizing Blockers',
    dosePerKg: 0.05,
    unit: 'mg/kg',
    concentrationMgPerMl: 0.5,
    maxDose: 5.0,
    clinicalNote: 'Administer with Glycopyrrolate 0.01 mg/kg. Never reverse at TOF < 2 to prevent recurarization.',
  },
  {
    name: 'Fentanyl',
    category: 'Opioid',
    indication: 'Analgesia & Blunting Intubation Stress Response',
    dosePerKg: 2.0,
    unit: 'mcg/kg',
    concentrationMgPerMl: 0.05,
    clinicalNote: 'Rapid onset (2-3 mins). High/rapid boluses can cause chest wall / glottic rigidity.',
  },
];

export const CRISIS_PROTOCOLS: Record<string, CrisisProtocol> = {
  last: {
    id: 'last',
    title: 'ASRA LAST (Local Anesthetic Systemic Toxicity)',
    subtitle: 'Immediate 20% Lipid Emulsion Protocol',
    color: '#ef4444',
    immediateActions: [
      'STOP local anesthetic injection immediately & call for LAST Crash Cart + Lipid 20%.',
      'Airway: 100% O2 via bag-valve-mask or intubation. Hyperventilate to prevent acidosis/hypoxia.',
      'Control seizures with Benzodiazepines (Midazolam 1-2 mg). AVOID Propofol in cardiovascular collapse.',
      'AVOID Vasopressin, Calcium channel blockers, and Beta-blockers.',
      'Reduce Epinephrine aliquots to < 1 mcg/kg boluses.',
    ],
    drugDosing: [
      {
        drug: '20% Lipid Emulsion Initial Bolus (1.5 mL/kg)',
        calculation: (wt) => `${Math.round(wt * 1.5)} mL over 2 - 3 minutes`,
        route: 'IV Bolus',
        instructions: 'May repeat bolus 1 - 2 times for persistent cardiovascular instability.',
      },
      {
        drug: '20% Lipid Emulsion Maintenance Infusion (0.25 mL/kg/min)',
        calculation: (wt) => `${(wt * 0.25).toFixed(1)} mL/min (~${Math.round(wt * 0.25 * 60)} mL/hr)`,
        route: 'IV Continuous',
        instructions: 'Continue for at least 10 - 15 minutes after hemodynamic stability is restored. Max total dose: 12 mL/kg.',
      },
      {
        drug: 'Cardiopulmonary Resuscitation (CPB Alert)',
        calculation: () => 'Alert nearest ECMO / Perfusion team',
        route: 'Systemic',
        instructions: 'Prolonged CPR (>60 mins) may be necessary as lipid acts as metabolic sink.',
      },
    ],
    criticalPearls: [
      'Lipid Sink Hypothesis: 20% Intralipid extracts lipophilic local anesthetics (Bupivacaine, Ropivacaine) from cardiac myocyte ion channels.',
      'Acidosis and hypoxemia dramatically potentiate local anesthetic cardiotoxicity.',
    ],
  },
  das: {
    id: 'das',
    title: 'DAS Failed Intubation / CICO Algorithm',
    subtitle: 'Difficult Airway Society Guideline',
    color: '#f59e0b',
    immediateActions: [
      'Plan A: Direct or Video Laryngoscopy (Max 3 attempts + 1 by senior). Optimize external laryngeal manipulation, bougie.',
      'Plan B: Maintain oxygenation via Second-Generation Supraglottic Airway (i-gel / ProSeal LMA). Max 2 attempts.',
      'Plan C: Facemask oxygenation with 2-person technique + oropharyngeal airway. Wake the patient if elective!',
      'Plan D: CANNOT INTUBATE, CANNOT OXYGENATE (CICO) → Emergency Front of Neck Access (e-FONA).',
    ],
    drugDosing: [
      {
        drug: 'Emergency e-FONA (Scalpel - Bougie - Tube)',
        calculation: () => 'No. 10 Scalpel + Size 5.0/6.0 cuffed ETT + Frova/Bougie',
        route: 'Surgical Cricothyroidotomy',
        instructions: 'Laryngeal handshake → Transverse stab incision through cricothyroid membrane → Rotate blade 90° → Slide bougie alongside blade into trachea → Railroad lubricated 6.0 ETT.',
      },
      {
        drug: 'Paralysis Optimization',
        calculation: (wt) => `Rocuronium ${Math.round(wt * 1.2)} mg or Sugammadex ${Math.round(wt * 16)} mg`,
        route: 'IV',
        instructions: 'Ensure full neuromuscular blockade before declaring failed mask ventilation.',
      },
    ],
    criticalPearls: [
      'Never hesitate to declare CICO early. Hypoxemic cardiac arrest occurs within 3-4 minutes of total apnea.',
      'e-FONA uses the "Scalpel, Bougie, Tube" rapid sequence technique.',
    ],
  },
  mh: {
    id: 'mh',
    title: 'Malignant Hyperthermia (MH) Protocol',
    subtitle: 'Hypermetabolic Crisis Management',
    color: '#8b5cf6',
    immediateActions: [
      'Turn OFF all volatile anesthetics and discontinue succinylcholine immediately!',
      'Hyperventilate with 100% O2 at maximum fresh gas flow (≥10 L/min). Insert charcoal filters.',
      'Call for MH Cart and notify team: designated Dantrolene reconstituters needed.',
      'Active cooling: Cold IV normal saline (4°C), bladder lavage, surface ice packs. STOP cooling when temp reaches 38.5°C.',
    ],
    drugDosing: [
      {
        drug: 'Dantrolene Sodium Initial Bolus (2.5 mg/kg)',
        calculation: (wt) => `${Math.round(wt * 2.5)} mg (~${Math.ceil((wt * 2.5) / 20)} vials of 20 mg)`,
        route: 'Rapid IV push',
        instructions: 'Reconstitute each 20 mg vial with 60 mL sterile water (without bacteriostatic agent). Shake vigorously.',
      },
      {
        drug: 'Dantrolene Repeat Dosing',
        calculation: (wt) => `Up to ${Math.round(wt * 10)} mg total cumulative dose`,
        route: 'IV',
        instructions: 'Repeat 1-2.5 mg/kg every 5-10 minutes until tachycardia, ETCO2, and muscle rigidity resolve.',
      },
      {
        drug: 'Sodium Bicarbonate for Metabolic Acidosis',
        calculation: (wt) => `${Math.round(wt * 1.0 - wt * 2.0)} mEq (1-2 mEq/kg)`,
        route: 'IV infusion',
        instructions: 'Treat hyperkalemia with Calcium chloride 10 mg/kg, Regular Insulin 10 units + 50% Dextrose 50 mL.',
      },
    ],
    criticalPearls: [
      'Ryanodine receptor 1 (RYR1) mutation causes uncontrolled calcium release from sarcoplasmic reticulum.',
      'Unexplained precipitous rise in ETCO2 refractory to minute ventilation is the earliest sign, followed by masseter spasm and tachycardia. Hyperthermia is a late sign!',
    ],
  },
};
