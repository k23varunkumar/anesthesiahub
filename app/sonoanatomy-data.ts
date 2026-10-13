export interface SonoStructure {
  id: string;
  name: string;
  type: 'artery' | 'vein' | 'nerve' | 'fascia' | 'muscle' | 'bone' | 'pleura';
  color: string;
  shape: 'circle' | 'ellipse' | 'polygon' | 'line';
  cx?: number;
  cy?: number;
  r?: number;
  rx?: number;
  ry?: number;
  points?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  description: string;
  acousticFeature: string;
}

export interface SonoBlock {
  id: string;
  name: string;
  category: 'Upper Extremity' | 'Lower Extremity' | 'Truncal' | 'Neuraxial';
  probeType: 'High-Frequency Linear (10-15 MHz)' | 'Curvilinear (2-5 MHz)';
  probeOrientation: 'Transverse (Axial)' | 'Sagittal (Longitudinal)';
  patientPosition: string;
  targetStructure: string;
  needleApproach: 'In-Plane (Lateral to Medial)' | 'In-Plane (Medial to Lateral)' | 'Out-of-Plane';
  gangaPearl: string;
  safetyWarning: string;
  localAnesthetic: {
    agent: string;
    volume: string;
    onset: string;
    duration: string;
  };
  needlePath: {
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    angleDeg: number;
  };
  structures: SonoStructure[];
}

export const SONO_BLOCKS: Record<string, SonoBlock> = {
  supraclavicular: {
    id: 'supraclavicular',
    name: 'Supraclavicular Brachial Plexus Block',
    category: 'Upper Extremity',
    probeType: 'High-Frequency Linear (10-15 MHz)',
    probeOrientation: 'Transverse (Axial)',
    patientPosition: 'Supine with head turned 45° to contralateral side; arm adducted.',
    targetStructure: 'Brachial plexus trunks/divisions (the "corner pocket" between Subclavian Artery and First Rib)',
    needleApproach: 'In-Plane (Lateral to Medial)',
    gangaPearl: 'The "Corner Pocket" injection (inferolateral to subclavian artery above 1st rib) guarantees lower trunk (C8-T1) anesthesia and avoids ulnar sparing.',
    safetyWarning: 'Pneumothorax Risk: Keep the needle tip strictly in view at all times. The first rib acts as a protective backstop against pleural puncture.',
    localAnesthetic: {
      agent: '0.5% Ropivacaine or 0.25% Bupivacaine + 2% Lignocaine',
      volume: '20 - 25 mL',
      onset: '10 - 15 mins',
      duration: '12 - 18 hrs',
    },
    needlePath: {
      startX: 370,
      startY: 40,
      targetX: 235,
      targetY: 175,
      angleDeg: 30,
    },
    structures: [
      {
        id: 'subclavian-art',
        name: 'Subclavian Artery',
        type: 'artery',
        color: '#ef4444',
        shape: 'circle',
        cx: 170,
        cy: 165,
        r: 34,
        description: 'Large, round, pulsatile, anechoic acoustic landmark sitting immediately atop the first rib.',
        acousticFeature: 'Anechoic, pulsatile, non-compressible, color Doppler affirmative.',
      },
      {
        id: 'brachial-plexus',
        name: 'Brachial Plexus ("Cluster of Grapes")',
        type: 'nerve',
        color: '#eab308',
        shape: 'ellipse',
        cx: 240,
        cy: 155,
        rx: 32,
        ry: 24,
        description: 'Compact hypoechoic nodular trunks & divisions lying posterolateral to the subclavian artery.',
        acousticFeature: 'Hypoechoic honeycomb / grape clusters surrounded by hyperechoic prevertebral fascial sheath.',
      },
      {
        id: 'first-rib',
        name: 'First Rib (Bony Backstop)',
        type: 'bone',
        color: '#94a3b8',
        shape: 'line',
        x1: 110,
        y1: 205,
        x2: 320,
        y2: 215,
        description: 'Bright hyperechoic linear interface casting dense acoustic shadow beneath the artery and nerves.',
        acousticFeature: 'Hyperechoic bony cortex with complete acoustic shadowing below.',
      },
      {
        id: 'pleura',
        name: 'Pleural Line & Lung Sliding',
        type: 'pleura',
        color: '#38bdf8',
        shape: 'line',
        x1: 40,
        y1: 235,
        x2: 120,
        y2: 238,
        description: 'Bright hyperechoic shimmering horizontal line medial to the 1st rib. Must be visualized to prevent pneumothorax.',
        acousticFeature: 'Hyperechoic sliding pleura with "seashore sign" on M-mode and comet-tail reverberations.',
      },
      {
        id: 'anterior-scalene',
        name: 'Anterior Scalene Muscle',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '80,80 150,75 145,150 70,140',
        description: 'Fleshy muscular landmark bounding the medial border of the brachial plexus.',
        acousticFeature: 'Hypoechoic muscle fascicles with fine hyperechoic perimysial striations.',
      },
      {
        id: 'middle-scalene',
        name: 'Middle Scalene Muscle',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '260,70 340,65 350,160 270,150',
        description: 'Muscular lateral boundary through which the needle passes during in-plane lateral approach.',
        acousticFeature: 'Hypoechoic striated muscle tissue.',
      },
    ],
  },
  interscalene: {
    id: 'interscalene',
    name: 'Interscalene Brachial Plexus Block',
    category: 'Upper Extremity',
    probeType: 'High-Frequency Linear (10-15 MHz)',
    probeOrientation: 'Transverse (Axial) at C6 Cricoid Level',
    patientPosition: 'Supine, head turned 30° away. Place towel roll under ipsilateral shoulder.',
    targetStructure: 'C5, C6, C7 roots in the interscalene groove between Anterior and Middle Scalene muscles ("Traffic Light Sign")',
    needleApproach: 'In-Plane (Posterior to Anterior / Lateral to Medial)',
    gangaPearl: 'Target the connective tissue between C5 and C6 roots. Never inject sub-epineurally. Injecting just outside the sheath gives dense shoulder analgesia with lower risk of intraneural injury.',
    safetyWarning: 'Ipsilateral Phrenic Nerve Paresis occurs in ~100% of cases. Strictly contraindicated in severe pre-existing COPD / restrictive lung disease.',
    localAnesthetic: {
      agent: '0.25% - 0.5% Ropivacaine + Dexamethasone 4 mg',
      volume: '10 - 15 mL',
      onset: '10 - 15 mins',
      duration: '14 - 24 hrs',
    },
    needlePath: {
      startX: 370,
      startY: 55,
      targetX: 205,
      targetY: 135,
      angleDeg: 25,
    },
    structures: [
      {
        id: 'ant-scalene-is',
        name: 'Anterior Scalene Muscle (ASM)',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '80,60 160,55 155,190 70,180',
        description: 'Medial muscle pillar. Phrenic nerve courses along its anterior fascial surface.',
        acousticFeature: 'Hypoechoic muscle with striated pennate architecture.',
      },
      {
        id: 'mid-scalene-is',
        name: 'Middle Scalene Muscle (MSM)',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '240,55 330,50 340,195 245,185',
        description: 'Lateral muscle pillar. The needle traverses MSM toward the groove.',
        acousticFeature: 'Hypoechoic muscle bellies.',
      },
      {
        id: 'c5-root',
        name: 'C5 Nerve Root',
        type: 'nerve',
        color: '#eab308',
        shape: 'circle',
        cx: 200,
        cy: 100,
        r: 12,
        description: 'Uppermost hypoechoic round root of the "traffic light".',
        acousticFeature: 'Anechoic to hypoechoic round fascicle.',
      },
      {
        id: 'c6-root',
        name: 'C6 Nerve Root',
        type: 'nerve',
        color: '#eab308',
        shape: 'circle',
        cx: 202,
        cy: 135,
        r: 15,
        description: 'Middle, larger hypoechoic root. Often bifid.',
        acousticFeature: 'Hypoechoic oval structure with hyperechoic rim.',
      },
      {
        id: 'c7-root',
        name: 'C7 Nerve Root',
        type: 'nerve',
        color: '#eab308',
        shape: 'circle',
        cx: 204,
        cy: 172,
        r: 14,
        description: 'Lowermost root in groove sitting over Chassaignac\'s tubercle (C6 anterior tubercle shadow).',
        acousticFeature: 'Hypoechoic circular bundle.',
      },
      {
        id: 'carotid-art',
        name: 'Common Carotid Artery',
        type: 'artery',
        color: '#ef4444',
        shape: 'circle',
        cx: 40,
        cy: 150,
        r: 25,
        description: 'Medial landmark artery separated by the internal jugular vein and thyroid.',
        acousticFeature: 'Pulsatile round anechoic lumen.',
      },
    ],
  },
  femoral: {
    id: 'femoral',
    name: 'Femoral Nerve Block & Fascia Iliaca Compartment',
    category: 'Lower Extremity',
    probeType: 'High-Frequency Linear (10-15 MHz)',
    probeOrientation: 'Transverse across Femoral Crease',
    patientPosition: 'Supine with leg slightly abducted and externally rotated.',
    targetStructure: 'Femoral nerve (hyperechoic wedge/lens-shaped) lateral to Femoral Artery beneath Fascia Iliaca',
    needleApproach: 'In-Plane (Lateral to Medial)',
    gangaPearl: 'Confirm the "double pop" through Fascia Lata and Fascia Iliaca. Hydrodissection under Fascia Iliaca produces a donut ring lifting the nerve.',
    safetyWarning: 'Always confirm that the needle is strictly lateral to the pulsating Femoral Artery to prevent vascular hematoma or intravascular injection.',
    localAnesthetic: {
      agent: '0.2% - 0.5% Ropivacaine or 0.25% Bupivacaine',
      volume: '15 - 20 mL (Femoral) / 30 - 40 mL (Fascia Iliaca)',
      onset: '10 - 15 mins',
      duration: '16 - 24 hrs',
    },
    needlePath: {
      startX: 370,
      startY: 60,
      targetX: 185,
      targetY: 145,
      angleDeg: 35,
    },
    structures: [
      {
        id: 'fem-artery',
        name: 'Femoral Artery',
        type: 'artery',
        color: '#ef4444',
        shape: 'circle',
        cx: 110,
        cy: 155,
        r: 30,
        description: 'Pulsatile round vessel in femoral triangle; primary anatomical landmark.',
        acousticFeature: 'Anechoic, pulsatile circular lumen.',
      },
      {
        id: 'fem-vein',
        name: 'Femoral Vein',
        type: 'vein',
        color: '#3b82f6',
        shape: 'circle',
        cx: 50,
        cy: 160,
        r: 26,
        description: 'Medial to the femoral artery. Easily compressible with transducer pressure.',
        acousticFeature: 'Anechoic compressible thin-walled ellipse.',
      },
      {
        id: 'fem-nerve',
        name: 'Femoral Nerve',
        type: 'nerve',
        color: '#eab308',
        shape: 'polygon',
        points: '165,135 210,138 200,165 170,162',
        description: 'Triangular or lens-shaped hyperechoic structure lying in groove between psoas and iliacus.',
        acousticFeature: 'Hyperechoic speckled structure ("iceberg in water") beneath Fascia Iliaca.',
      },
      {
        id: 'fascia-iliaca',
        name: 'Fascia Iliaca (Hyperechoic Band)',
        type: 'fascia',
        color: '#f8fafc',
        shape: 'line',
        x1: 80,
        y1: 125,
        x2: 320,
        y2: 130,
        description: 'Deep hyperechoic fascial sheet covering the iliacus muscle and femoral nerve.',
        acousticFeature: 'Bright continuous linear hyperechoic boundary.',
      },
      {
        id: 'fascia-lata',
        name: 'Fascia Lata (Superficial)',
        type: 'fascia',
        color: '#cbd5e1',
        shape: 'line',
        x1: 20,
        y1: 85,
        x2: 380,
        y2: 85,
        description: 'Superficial investing fascia of the thigh.',
        acousticFeature: 'Superficial continuous hyperechoic band below subcutaneous fat.',
      },
      {
        id: 'iliacus-muscle',
        name: 'Iliacus Muscle',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '150,168 350,168 360,240 140,240',
        description: 'Deep muscular floor upon which the femoral nerve rests.',
        acousticFeature: 'Hypoechoic muscle bed.',
      },
    ],
  },
  tap: {
    id: 'tap',
    name: 'Transversus Abdominis Plane (TAP) Block',
    category: 'Truncal',
    probeType: 'High-Frequency Linear (10-15 MHz) or Curvilinear (obese)',
    probeOrientation: 'Transverse across Mid-Axillary Line between Iliac Crest & Costal Margin',
    patientPosition: 'Supine with arms tucked across chest.',
    targetStructure: 'Fascial plane between Internal Oblique (IO) and Transversus Abdominis (TA) muscles',
    needleApproach: 'In-Plane (Anterior to Posterior)',
    gangaPearl: 'Notice the hydrodissection: injecting 1-2 mL of saline produces an expanding hypoechoic lens (the "eye sign") that cleanly separates the IO and TA fascial layers.',
    safetyWarning: 'Peritoneal Puncture: Transversus abdominis is the deepest muscle layer. Never advance past the deep fascial layer into the peritoneum / bowel.',
    localAnesthetic: {
      agent: '0.2% Ropivacaine or 0.25% Bupivacaine',
      volume: '20 mL per side (bilateral max 40 mL)',
      onset: '15 - 20 mins',
      duration: '18 - 24 hrs',
    },
    needlePath: {
      startX: 30,
      startY: 45,
      targetX: 205,
      targetY: 155,
      angleDeg: 30,
    },
    structures: [
      {
        id: 'ext-oblique',
        name: 'External Oblique Muscle (EO)',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '20,60 380,60 380,95 20,95',
        description: 'Most superficial of the three flat abdominal muscle layers.',
        acousticFeature: 'Hypoechoic muscular layer bounded by hyperechoic fascia.',
      },
      {
        id: 'int-oblique',
        name: 'Internal Oblique Muscle (IO)',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '20,105 380,105 380,150 20,150',
        description: 'Middle muscle layer; typically the thickest muscle belly.',
        acousticFeature: 'Hypoechoic muscle layer.',
      },
      {
        id: 'transversus-abd',
        name: 'Transversus Abdominis Muscle (TA)',
        type: 'muscle',
        color: '#64748b',
        shape: 'polygon',
        points: '20,165 380,165 380,205 20,205',
        description: 'Deepest abdominal muscle layer, tapering posteriorly into aponeurosis.',
        acousticFeature: 'Hypoechoic muscle layer immediately above peritoneum.',
      },
      {
        id: 'tap-fascia',
        name: 'TAP Target Plane (IO - TA Fascia)',
        type: 'fascia',
        color: '#f8fafc',
        shape: 'line',
        x1: 20,
        y1: 157,
        x2: 380,
        y2: 157,
        description: 'The intermuscular fascial plane carrying the thoracolumbar nerves (T7-L1).',
        acousticFeature: 'Bright hyperechoic double rail dividing IO and TA.',
      },
      {
        id: 'peritoneum',
        name: 'Peritoneum & Bowel Interface',
        type: 'pleura',
        color: '#38bdf8',
        shape: 'line',
        x1: 20,
        y1: 215,
        x2: 380,
        y2: 215,
        description: 'Deep peritoneal boundary. Peristalsis may be observed below this line.',
        acousticFeature: 'Hyperechoic shimmering line with acoustic artifacts below.',
      },
    ],
  },
};
