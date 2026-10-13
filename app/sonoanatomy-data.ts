import { resolveAssetUrl } from '@/lib/utils';

export interface SonoStructure {
  id: string;
  name: string;
  type: 'artery' | 'vein' | 'nerve' | 'fascia' | 'muscle' | 'bone' | 'pleura';
  color: string;
  description: string;
  acousticFeature: string;
}

export interface SonoBlock {
  id: string;
  name: string;
  category: 'Upper Extremity' | 'Lower Extremity' | 'Truncal';
  probeType: string;
  probeOrientation: string;
  patientPosition: string;
  targetStructure: string;
  needleApproach: string;
  realSonoImage: string;
  probePhoto?: string;
  gangaPearl: string;
  troubleshootingTip: string;
  safetyWarning: string;
  localAnesthetic: {
    agent: string;
    volume: string;
    onset: string;
    duration: string;
  };
  keyStructures: SonoStructure[];
}

export const SONO_BLOCKS: Record<string, SonoBlock> = {
  supraclavicular: {
    id: 'supraclavicular',
    name: 'Supraclavicular Brachial Plexus Block',
    category: 'Upper Extremity',
    probeType: 'High-Frequency Linear (10 - 15 MHz)',
    probeOrientation: 'Transverse (Coronal oblique in supraclavicular fossa)',
    patientPosition: 'Supine with head turned 45° to contralateral side; chin to opposite mid-clavicle.',
    targetStructure: 'Brachial plexus trunks/divisions in "Corner Pocket" atop First Rib and lateral to Subclavian Artery',
    needleApproach: 'In-Plane (Lateral to Medial toward Subclavian Artery)',
    realSonoImage: resolveAssetUrl('/ganga-sono/supraclavicular_real_sono.jpg'),
    probePhoto: resolveAssetUrl('/ganga-sono/supraclavicular_probe.jpg'),
    gangaPearl: 'The "Corner Pocket" injection: Deposit 10-15 mL into the pocket formed between the lower edge of the Subclavian Artery and the First Rib to block C8-T1 and prevent ulnar nerve sparing.',
    troubleshootingTip: '• Biceps twitch: Needle too lateral (superior trunk)\n• Pectoralis major twitch: Needle too anterior\n• Scapular winging: Needle too posterior (dorsal scapular nerve)',
    safetyWarning: 'PNEUMOTHORAX DANGER: The parietal pleura lies immediately medial/deep. Always visualize the bright hyperechoic first rib as your bony backstop before needle advancement.',
    localAnesthetic: {
      agent: '0.5% Ropivacaine or 0.25% Bupivacaine + 1.5% Lignocaine',
      volume: '20 - 25 mL',
      onset: '10 - 15 mins',
      duration: '14 - 18 hrs',
    },
    keyStructures: [
      {
        id: 'sa',
        name: 'Subclavian Artery (SA)',
        type: 'artery',
        color: '#ef4444',
        description: 'Large round pulsatile anechoic vascular landmark resting on 1st rib.',
        acousticFeature: 'Anechoic round lumen with arterial pulsation and systolic color Doppler flow.',
      },
      {
        id: 'bp',
        name: 'Brachial Plexus ("Bunch of Grapes")',
        type: 'nerve',
        color: '#eab308',
        description: 'Compact bundle of hypoechoic round nodules (divisions) posterolateral to the artery.',
        acousticFeature: 'Hypoechoic nodular cluster with hyperechoic connective tissue borders.',
      },
      {
        id: 'r1',
        name: 'First Rib (Bony Shield)',
        type: 'bone',
        color: '#94a3b8',
        description: 'Bright continuous curved line casting a dense acoustic shadow directly beneath artery.',
        acousticFeature: 'Hyperechoic bony cortex with complete acoustic dropout / shadowing beneath.',
      },
      {
        id: 'pleura',
        name: 'Pleura & Sliding Lung',
        type: 'pleura',
        color: '#38bdf8',
        description: 'Bright horizontal shimmering line medial to 1st rib. Must never be breached.',
        acousticFeature: 'Hyperechoic sliding interface with comet-tail artifacts and seashore sign on M-mode.',
      },
    ],
  },
  interscalene: {
    id: 'interscalene',
    name: 'Interscalene Brachial Plexus Block',
    category: 'Upper Extremity',
    probeType: 'High-Frequency Linear (10 - 15 MHz)',
    probeOrientation: 'Transverse across C6 Cricoid Cartilage level',
    patientPosition: 'Supine, head turned 30° away. Towel roll under ipsilateral scapula.',
    targetStructure: 'C5, C6, C7 nerve roots in the groove between Anterior and Middle Scalene muscles ("Traffic Light")',
    needleApproach: 'In-Plane (Lateral to Medial / Posterior to Anterior)',
    realSonoImage: resolveAssetUrl('/ganga-sono/interscalene_real_sono.jpg'),
    probePhoto: resolveAssetUrl('/ganga-sono/interscalene_probe.jpg'),
    gangaPearl: 'Target the connective tissue sheath between C5 and C6 roots. Never advance needle subepineurally. Injection should show circumferential spread without high injection pressures (>15 psi).',
    troubleshootingTip: '• Diaphragm twitch: Phrenic nerve stimulation on anterior surface of Anterior Scalene (ASM). Withdraw needle slightly posterior.',
    safetyWarning: 'Phrenic Nerve Blockade occurs in ~100% of cases. Strictly contraindicated in patients with severe contralateral diaphragm dysfunction or severe COPD.',
    localAnesthetic: {
      agent: '0.25% - 0.5% Ropivacaine + Dexamethasone 4 mg',
      volume: '10 - 15 mL',
      onset: '10 - 15 mins',
      duration: '16 - 24 hrs',
    },
    keyStructures: [
      {
        id: 'c5-c6',
        name: 'C5 & C6 Nerve Roots ("Traffic Light Sign")',
        type: 'nerve',
        color: '#eab308',
        description: 'Hypoechoic dark circular roots aligned vertically in interscalene groove.',
        acousticFeature: 'Round anechoic/hypoechoic fascicles stacked between ASM and MSM.',
      },
      {
        id: 'asm',
        name: 'Anterior Scalene Muscle (ASM)',
        type: 'muscle',
        color: '#64748b',
        description: 'Medial muscle pillar. Phrenic nerve lies on its anterior fascial surface.',
        acousticFeature: 'Hypoechoic striated muscle belly.',
      },
      {
        id: 'msm',
        name: 'Middle Scalene Muscle (MSM)',
        type: 'muscle',
        color: '#64748b',
        description: 'Lateral muscle pillar traversed by the in-plane needle approach.',
        acousticFeature: 'Pennate hypoechoic muscle tissue.',
      },
      {
        id: 'va',
        name: 'Vertebral Artery (Deep Danger Landmark)',
        type: 'artery',
        color: '#ef4444',
        description: 'Deep artery coursing through transverse foramina. Direct intravascular injection risk.',
        acousticFeature: 'Pulsatile vessel between acoustic shadows of transverse process tubercles.',
      },
    ],
  },
  femoral: {
    id: 'femoral',
    name: 'Femoral Nerve Block & Fascia Iliaca',
    category: 'Lower Extremity',
    probeType: 'High-Frequency Linear (10 - 15 MHz)',
    probeOrientation: 'Transverse across Inguinal Crease',
    patientPosition: 'Supine with operative leg slightly abducted and externally rotated.',
    targetStructure: 'Femoral nerve (hyperechoic triangular/lenticular structure) lateral to Femoral Artery under Fascia Iliaca',
    needleApproach: 'In-Plane (Lateral to Medial)',
    realSonoImage: resolveAssetUrl('/ganga-sono/femoral_real_sono.jpg'),
    probePhoto: resolveAssetUrl('/ganga-sono/femoral_probe.jpg'),
    gangaPearl: 'Confirm the "double pop" through Fascia Lata and Fascia Iliaca. Hydrodissection under Fascia Iliaca lifts the nerve off Iliacus muscle, creating a safe circular pool.',
    troubleshootingTip: '• Sartorius twitch (lateral thigh): Needle too superficial/lateral.\n• Patellar twitch (quadriceps dance): Ideal motor endpoint if using PNS (0.3-0.5 mA).',
    safetyWarning: 'Accidental intravascular injection: Femoral vein lies immediately medial to the artery. Always aspirate before injecting each 5 mL aliquot.',
    localAnesthetic: {
      agent: '0.2% - 0.5% Ropivacaine or 0.25% Bupivacaine',
      volume: '15 - 20 mL (Femoral) / 30 - 40 mL (Fascia Iliaca)',
      onset: '10 - 15 mins',
      duration: '16 - 24 hrs',
    },
    keyStructures: [
      {
        id: 'fa',
        name: 'Femoral Artery (FA)',
        type: 'artery',
        color: '#ef4444',
        description: 'Primary anatomical landmark in femoral triangle.',
        acousticFeature: 'Pulsatile non-compressible anechoic round circle.',
      },
      {
        id: 'fv',
        name: 'Femoral Vein (FV)',
        type: 'vein',
        color: '#3b82f6',
        description: 'Medial to femoral artery. Readily compresses with transducer pressure.',
        acousticFeature: 'Thin-walled compressible anechoic oval.',
      },
      {
        id: 'fn',
        name: 'Femoral Nerve (FN)',
        type: 'nerve',
        color: '#eab308',
        description: 'Hyperechoic speckled triangular structure sitting atop iliacus muscle.',
        acousticFeature: 'Hyperechoic "honeycomb" or dense wedge under Fascia Iliaca.',
      },
      {
        id: 'fi',
        name: 'Fascia Iliaca & Fascia Lata',
        type: 'fascia',
        color: '#f8fafc',
        description: 'Hyperechoic double rail dividing subcutaneous tissue from iliopsoas bed.',
        acousticFeature: 'Bright continuous hyperechoic linear boundaries.',
      },
    ],
  },
  axillary: {
    id: 'axillary',
    name: 'Axillary Brachial Plexus Block',
    category: 'Upper Extremity',
    probeType: 'High-Frequency Linear (10 - 15 MHz)',
    probeOrientation: 'Transverse across Axilla perpendicular to humerus',
    patientPosition: 'Supine, arm abducted 90° and elbow flexed 90° ("statue of liberty" position).',
    targetStructure: 'Axillary Artery surrounded by Median (superomedial), Ulnar (inferomedial), and Radial (inferolateral/posterior) nerves, plus Musculocutaneous nerve in Coracobrachialis',
    needleApproach: 'In-Plane (Anterior/Superior to Posterior/Inferior)',
    realSonoImage: resolveAssetUrl('/ganga-sono/axillary_real_sono.jpg'),
    probePhoto: resolveAssetUrl('/ganga-sono/axillary_probe.jpg'),
    gangaPearl: 'Do not forget the Musculocutaneous Nerve! It leaves the sheath early and sits inside the belly of Coracobrachialis muscle. Separate injection of 5 mL is required for forearm/lateral elbow analgesia.',
    troubleshootingTip: '• Compressibility: Axillary veins easily compress, masquerading as avascular spaces. Light transducer pressure is essential.',
    safetyWarning: 'Multiple septations in axillary sheath: A single injection does not reliably spread to all 4 terminal branches. Multiple perivascular deposits (donut sign around artery) are recommended.',
    localAnesthetic: {
      agent: '0.375% - 0.5% Ropivacaine or 0.25% Bupivacaine',
      volume: '20 mL perivascular + 5 mL musculocutaneous',
      onset: '15 - 20 mins',
      duration: '12 - 18 hrs',
    },
    keyStructures: [
      {
        id: 'aa',
        name: 'Axillary Artery (AA)',
        type: 'artery',
        color: '#ef4444',
        description: 'Central pulsatile vascular reference in axilla.',
        acousticFeature: 'Pulsatile round anechoic lumen.',
      },
      {
        id: 'mn',
        name: 'Median Nerve',
        type: 'nerve',
        color: '#eab308',
        description: 'Hyperechoic round nerve at 11 to 12 o\'clock position over the artery.',
        acousticFeature: 'Round hyperechoic fascicle.',
      },
      {
        id: 'un',
        name: 'Ulnar Nerve',
        type: 'nerve',
        color: '#eab308',
        description: 'Hyperechoic round nerve at 1 to 2 o\'clock position medial to artery.',
        acousticFeature: 'Oval hyperechoic bundle.',
      },
      {
        id: 'rn',
        name: 'Radial Nerve',
        type: 'nerve',
        color: '#eab308',
        description: 'Lies deep to artery at 4 to 6 o\'clock position, often with acoustic enhancement.',
        acousticFeature: 'Deep hyperechoic nerve bundle.',
      },
      {
        id: 'mcn',
        name: 'Musculocutaneous Nerve',
        type: 'nerve',
        color: '#facc15',
        description: 'Triangular/bright nerve embedded inside Coracobrachialis muscle belly.',
        acousticFeature: 'Hyperechoic oval structure separated from the main neurovascular bundle.',
      },
    ],
  },
  popliteal: {
    id: 'popliteal',
    name: 'Popliteal Sciatic Nerve Block',
    category: 'Lower Extremity',
    probeType: 'High-Frequency Linear (10 - 15 MHz)',
    probeOrientation: 'Transverse across Popliteal Fossa (5-7 cm above popliteal crease)',
    patientPosition: 'Prone or Lateral Decubitus with operative leg uppermost and knee slightly flexed.',
    targetStructure: 'Sciatic nerve division into Tibial Nerve (TN) and Common Peroneal Nerve (CPN) within Paraneural Sheath of Vloka',
    needleApproach: 'In-Plane (Lateral to Medial)',
    realSonoImage: resolveAssetUrl('/ganga-sono/popliteal_real_sono.jpg'),
    probePhoto: resolveAssetUrl('/ganga-sono/popliteal_probe.jpg'),
    gangaPearl: 'Inject sub-paraneurally (within Vloka\'s sheath) but strictly extra-epineurally. A single 15-20 mL injection within the paraneural envelope produces circumferential donut hydrodissection covering both TN and CPN.',
    troubleshootingTip: '• Plantarflexion / Inversion: Tibial nerve stimulation.\n• Dorsiflexion / Eversion: Common peroneal nerve stimulation.',
    safetyWarning: 'Intraneural injection: Never inject against resistance (>15 psi) or if patient reports severe electrical radiating paresthesia into toes.',
    localAnesthetic: {
      agent: '0.5% Ropivacaine or 0.25% - 0.5% Bupivacaine',
      volume: '15 - 20 mL',
      onset: '15 - 20 mins',
      duration: '18 - 24 hrs',
    },
    keyStructures: [
      {
        id: 'tn',
        name: 'Tibial Nerve (TN)',
        type: 'nerve',
        color: '#eab308',
        description: 'Larger, medial hyperechoic oval branch continuing straight down leg.',
        acousticFeature: 'Hyperechoic honeycomb round structure.',
      },
      {
        id: 'cpn',
        name: 'Common Peroneal Nerve (CPN)',
        type: 'nerve',
        color: '#facc15',
        description: 'Lateral branch tracking towards fibular head.',
        acousticFeature: 'Smaller hyperechoic oval nerve lateral to TN.',
      },
      {
        id: 'pa',
        name: 'Popliteal Artery & Vein',
        type: 'artery',
        color: '#ef4444',
        description: 'Vessels lie deep and medial to the sciatic nerve division.',
        acousticFeature: 'Pulsatile round artery with overlying vein.',
      },
      {
        id: 'vloka',
        name: 'Paraneural Sheath of Vloka',
        type: 'fascia',
        color: '#f8fafc',
        description: 'Connective tissue envelope enclosing both nerve divisions.',
        acousticFeature: 'Hyperechoic fascial sleeve containing hypoechoic nerve fascicles.',
      },
    ],
  },
  tap: {
    id: 'tap',
    name: 'Transversus Abdominis Plane (TAP) Block',
    category: 'Truncal',
    probeType: 'High-Frequency Linear (10 - 15 MHz) or Curvilinear (obese)',
    probeOrientation: 'Transverse across Mid-Axillary Line between Iliac Crest & Costal Margin',
    patientPosition: 'Supine with arms tucked across chest.',
    targetStructure: 'Fascial plane between Internal Oblique (IO) and Transversus Abdominis (TA) muscles',
    needleApproach: 'In-Plane (Anterior to Posterior)',
    realSonoImage: resolveAssetUrl('/ganga-sono/tap_real_sono.jpg'),
    probePhoto: resolveAssetUrl('/ganga-sono/adductor_probe.jpg'),
    gangaPearl: 'Hydrodissection sign: Injecting 1-2 mL of test saline produces an expanding hypoechoic elliptical lens ("eye sign") separating the IO and TA fascial layers.',
    troubleshootingTip: '• Difficult layer differentiation: Scan posterolaterally toward lumbar triangle of Petit where the three distinct muscle bellies become clearest.',
    safetyWarning: 'PERITONEAL BREACH: The Transversus Abdominis is the deepest muscle layer. Never advance past its deep fascia into peritoneal cavity or bowel.',
    localAnesthetic: {
      agent: '0.2% Ropivacaine or 0.25% Bupivacaine',
      volume: '20 mL per side (bilateral total max 40 mL)',
      onset: '15 - 20 mins',
      duration: '18 - 24 hrs',
    },
    keyStructures: [
      {
        id: 'eo',
        name: 'External Oblique Muscle (EO)',
        type: 'muscle',
        color: '#64748b',
        description: 'Superficial muscle layer beneath subcutaneous fat.',
        acousticFeature: 'Hypoechoic muscle belly bounded by hyperechoic fascia.',
      },
      {
        id: 'io',
        name: 'Internal Oblique Muscle (IO)',
        type: 'muscle',
        color: '#64748b',
        description: 'Middle muscle layer; typically the thickest.',
        acousticFeature: 'Hypoechoic muscle layer.',
      },
      {
        id: 'ta',
        name: 'Transversus Abdominis Muscle (TA)',
        type: 'muscle',
        color: '#64748b',
        description: 'Deepest muscle layer, immediately overlying transversalis fascia and peritoneum.',
        acousticFeature: 'Hypoechoic muscle layer tapering posteriorly.',
      },
      {
        id: 'tap-plane',
        name: 'TAP Target Plane (IO - TA Interfascial Line)',
        type: 'fascia',
        color: '#f8fafc',
        description: 'Target plane carrying T7-L1 anterior rami nerves.',
        acousticFeature: 'Bright hyperechoic double rail.',
      },
    ],
  },
};
