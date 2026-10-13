import type { SystemId, View } from './anatomy';

export interface ClinicalPreset {
  id: string;
  name: string;
  badge: string;
  icon: string;
  description: string;
  guide: string;
  systems: SystemId[];
  view: View;
  explode?: number;
  highlightKeywords?: string[];
}

export interface ClinicalPearl {
  procedure: string;
  technique: string;
  safety: string;
  ultrasoundTip?: string;
}

export const CLINICAL_PRESETS: ClinicalPreset[] = [
  {
    id: 'all',
    name: 'All Systems',
    badge: '2,234 Parts',
    icon: 'Activity',
    description: 'Complete 3D human body model across all 15 anatomical systems.',
    guide: 'Comprehensive full-body anatomical explorer. Use the explode slider below to separate layers radially.',
    systems: ['cardiac','sensory','skeletal','muscular','arterial','venous','nervous','respiratory','digestive','urinary','lymphatic','endocrine','reproductive','connective'],
    view: 'three-quarter',
    explode: 0,
  },
  {
    id: 'airway',
    name: 'Airway & Intubation',
    badge: 'Airway',
    icon: 'Wind',
    description: 'Laryngeal framework, vocal cords, cricoid, thyroid cartilage & trachea.',
    guide: 'Crucial landmarks for direct laryngoscopy, video laryngoscopy, and emergency cricothyroidotomy (CICO). Note the thyroid cartilage, cricoid cartilage, cricothyroid membrane, vocalis, and tracheal rings.',
    systems: ['respiratory', 'skeletal', 'muscular', 'connective'],
    view: 'front',
    explode: 0,
    highlightKeywords: ['cricoid', 'thyroid cartilage', 'epiglottis', 'vocal', 'trachea', 'hyoid', 'cricothyroid'],
  },
  {
    id: 'neuraxial',
    name: 'Neuraxial (Spinal & Epidural)',
    badge: 'Spinal / Epidural',
    icon: 'Shield',
    description: 'Spinal cord, lumbar & thoracic vertebrae, sacral hiatus & spinal canal.',
    guide: 'Landmarks for spinal, epidural, and caudal blocks. Conus medullaris terminates at L1-L2; lumbar puncture/spinal needle is targeted at L3-L4 or L4-L5 (Tuffier\'s intercrestal line). Sacral hiatus serves as target for caudal anesthesia.',
    systems: ['nervous', 'skeletal'],
    view: 'back',
    explode: 0,
    highlightKeywords: ['spinal cord', 'vertebra', 'sacrum'],
  },
  {
    id: 'vascular',
    name: 'Vascular Access (CVC & A-Line)',
    badge: 'Lines & Access',
    icon: 'HeartPulse',
    description: 'Internal jugular vein, carotid, subclavian, radial & femoral vessels.',
    guide: 'Anatomical mapping for ultrasound-guided central venous catheterization (Internal Jugular, Subclavian, Femoral) and arterial line cannulation (Radial, Femoral). Note the IJ vein lying anterolateral to the carotid artery.',
    systems: ['arterial', 'venous', 'skeletal'],
    view: 'front',
    explode: 0,
    highlightKeywords: ['jugular', 'carotid', 'subclavian', 'femoral artery', 'femoral vein', 'radial artery'],
  },
  {
    id: 'regional',
    name: 'Peripheral Nerve Blocks',
    badge: 'Nerve Blocks',
    icon: 'Zap',
    description: 'Cranial & peripheral nerves, vascular bundles, and muscular fascia.',
    guide: 'Anatomical targets for ultrasound-guided regional anesthesia. Companion vessels serve as essential acoustic and anatomical landmarks for interscalene, axillary, and femoral nerve blocks.',
    systems: ['nervous', 'arterial', 'skeletal'],
    view: 'three-quarter',
    explode: 0,
    highlightKeywords: ['nerve', 'brachial', 'femoral', 'radial artery'],
  },
  {
    id: 'cardiothoracic',
    name: 'Cardiopulmonary',
    badge: 'Hemodynamics',
    icon: 'Heart',
    description: 'Heart chambers, great vessels, pulmonary tree, trachea & thoracic cage.',
    guide: 'Hemodynamic anatomy for CPR chest compressions, transesophageal echocardiography (TEE) orientation, and thoracic drain insertions.',
    systems: ['cardiac', 'respiratory', 'arterial', 'venous', 'skeletal'],
    view: 'front',
    explode: 0,
    highlightKeywords: ['heart', 'trachea', 'pulmonary', 'aorta'],
  },
];

export const ANESTHESIA_PEARLS: Record<string, ClinicalPearl> = {
  'cricoid cartilage': {
    procedure: 'Rapid Sequence Induction (RSI) / Sellick\'s Maneuver & Cricothyroidotomy',
    technique: 'The only complete cartilaginous ring in the respiratory tract. Sellick\'s maneuver applies posterior pressure (20-30 N) against C6 to compress the esophagus against the vertebral body, minimizing passive aspiration.',
    safety: 'Must release cricoid pressure immediately if active vomiting occurs to avoid esophageal rupture.',
    ultrasoundTip: 'Appears as a prominent hypoechoic round arch with posterior acoustic shadow above the first tracheal ring.',
  },
  'median cricothyroid ligament': {
    procedure: 'Emergency Surgical Airway (Cricothyroidotomy)',
    technique: 'Puncture site for "Cannot Intubate, Cannot Oxygenate" (CICO) rescue. Palpate the thyroid notch down into the cricothyroid depression. Incise horizontally through the membrane and cannulate/intubate.',
    safety: 'Stay in the midline to avoid bilateral cricothyroid arteries and vocal cords superiorly.',
    ultrasoundTip: 'Identified as a hyperechoic linear band bridging the thyroid and cricoid cartilages.',
  },
  'thyroid cartilage': {
    procedure: 'Airway Assessment & BURP Maneuver',
    technique: 'Prominent laryngeal cartilage. Thyromental distance > 6.5 cm indicates favorable direct laryngoscopy alignment. Backward-Upward-Rightward-Pressure (BURP) improves Cormack-Lehane glottic view.',
    safety: 'Excessive external pressure during laryngoscopy can distort the glottic aperture.',
    ultrasoundTip: 'Appears as an inverted hypoechoic "V" or chevron shape in transverse scanning.',
  },
  'epiglottis': {
    procedure: 'Direct & Video Laryngoscopy (Macintosh vs. Miller Blade)',
    technique: 'Leaf-shaped fibrocartilaginous structure. Macintosh curved blade tip is seated in the vallecula anterior to the epiglottis to lift the hyoepiglottic ligament. Miller straight blade lifts the posterior surface directly.',
    safety: 'Avoid levering blade against maxillary teeth (fulcrum effect). Lift upward and forward along the handle axis.',
    ultrasoundTip: 'Seen as a curved hypoechoic stripe within the pre-epiglottic space.',
  },
  'trachea': {
    procedure: 'Endotracheal Intubation & Depth Verification',
    technique: 'Extends from C6 to T4/T5 (carina). Distance from incisors to mid-trachea is typically ~21 cm in adult females and ~23 cm in adult males. The ETT cuff should reside 2-3 cm below the vocal cords.',
    safety: 'Right mainstem bronchial intubation can occur if inserted too deeply (bronchus branching angle ~25° right vs ~45° left). Confirm bilateral breath sounds and ETCO2 capnography.',
    ultrasoundTip: 'Shows characteristic "air-mucosal interface" with reverberation artifacts ("comet tails").',
  },
  'vocalis': {
    procedure: 'Glottic Exposure & Laryngospasm Prevention',
    technique: 'Intrinsic laryngeal muscle forming the true vocal cord. Visualized abducting during inspiration. Topical lidocaine spray onto cords blunts sympathetic surge and coughing during emergence.',
    safety: 'Intense stimulation in light plane of anesthesia can trigger severe laryngospasm. Treat with CPAP, positive pressure ventilation, and propofol/succinylcholine if unresolved.',
  },
  'vocal ligament': {
    procedure: 'Glottic Visualization (Cormack-Lehane Grading)',
    technique: 'Forms the medial boundary of the vocal fold. Grade 1: full vocal cord view; Grade 2: posterior cords only; Grade 3: epiglottis only; Grade 4: soft palate only.',
    safety: 'Never force an endotracheal tube without visualizing the cords or using an introducer (Bougie).',
  },
  'spinal cord': {
    procedure: 'Neuraxial Anesthesia (Spinal / Epidural Safety Boundary)',
    technique: 'Terminates at the conus medullaris (typically L1-L2 in adults). Spinal anesthesia must be performed at or below L3-L4 interspace (intercrestal Tuffier\'s line) to guarantee safety.',
    safety: 'Puncture above L2 interspace risks direct spinal cord impalement, hematoma, and irreversible neurodeficits.',
    ultrasoundTip: 'In paramedian sagittal oblique view, visualized within the hypoechoic intrathecal space with pulsatile movement.',
  },
  'first lumbar vertebra': {
    procedure: 'Conus Medullaris Anatomical Boundary',
    technique: 'Level of transition between spinal cord and cauda equina. Upper boundary for safe lumbar spinal anesthesia.',
    safety: 'Never perform spinal puncture above the L2-L3 interspace.',
  },
  'second lumbar vertebra': {
    procedure: 'Neuraxial Safety Margin',
    technique: 'In 1-2% of adults, conus medullaris may reach the inferior border of L2. Standard teaching advises L3-L4 or L4-L5 for subarachnoid block.',
    safety: 'Paraesthesia upon needle insertion mandates immediate cessation of advancement.',
  },
  'sacrum': {
    procedure: 'Caudal Epidural Block',
    technique: 'Sacral hiatus is formed by failure of S5 lamina to fuse. Palpate between the bilateral sacral cornua. Needle inserted at 45° through sacrococcygeal ligament until a distinct "pop" is felt, then flattened to 15°.',
    safety: 'Dural sac ends at S2 in adults (S3-S4 in infants). Always aspirate carefully for CSF and blood to prevent total spinal or systemic toxicity.',
    ultrasoundTip: 'Transverse ultrasound reveals "frog eyes" appearance (sacral cornua) bridged by hyperechoic sacrococcygeal ligament.',
  },
  'internal jugular vein': {
    procedure: 'Central Venous Catheterization (IJ CVC)',
    technique: 'Runs inside carotid sheath anterolateral to internal carotid artery. Real-time ultrasound guidance (out-of-plane or in-plane) is standard of care. Trendelenburg tilt increases cross-sectional area by 25-35%.',
    safety: 'Maintain needle visualization at all times. Inadvertent carotid arterial puncture risks hematoma, stroke, and airway compromise.',
    ultrasoundTip: 'Vein is easily compressible under gentle probe pressure, unlike the thick-walled pulsatile carotid artery.',
  },
  'common carotid artery': {
    procedure: 'Vascular Landmark & Pulse Palpation',
    technique: 'Lies medial and slightly posterior to the internal jugular vein. Key landmark for CPR pulse check at thyroid cartilage level.',
    safety: 'Avoid compressing bilateral carotid arteries simultaneously. Avoid cannulation during IJ line placement.',
    ultrasoundTip: 'Pulsatile, non-compressible thick hyperechoic muscular wall with systolic expansion.',
  },
  'subclavian vein': {
    procedure: 'Infraclavicular Subclavian Line Insertion',
    technique: 'Passes under clavicle anterior to anterior scalene muscle. Needle enters 1-2 cm inferior to clavicle junction of medial and middle thirds, directed toward suprasternal notch.',
    safety: 'Carries risk of apical pneumothorax (1-3%) and hemothorax. Puncture must stay horizontal and hug the clavicular posterior surface.',
    ultrasoundTip: 'Can be visualized in the supraclavicular fossa (end-on view) or infraclavicularly with a microconvex/linear transducer.',
  },
  'radial artery': {
    procedure: 'Arterial Line Cannulation (Invasive Hemodynamic Monitoring)',
    technique: 'Palpable at distal radial groove of forearm. Wrist dorsiflexed ~30-45°. 20G/22G cannula inserted under real-time ultrasound or palpation.',
    safety: 'Ensure collateral blood supply (modified Allen\'s test / Doppler). Avoid multiple blind attempts to prevent thrombosis or spasm.',
    ultrasoundTip: 'Appears as a hypoechoic circular pulsating vessel between flexor carpi radialis and brachioradialis tendons.',
  },
  'femoral artery': {
    procedure: 'Femoral Arterial Line & Femoral Triangle Anatomy',
    technique: 'Located midway between anterior superior iliac spine (ASIS) and pubic symphysis. Sequence from lateral to medial: Nerve, Artery, Vein, Empty space, Lymphatics (NAVEL).',
    safety: 'Higher infection and thrombosis risk compared to radial line. Reserve for emergency resuscitation or when radial access fails.',
  },
  'femoral vein': {
    procedure: 'Femoral Central Venous Line',
    technique: 'Lies immediately medial to the femoral arterial pulsation. Insert needle at 45° angle, 1-2 cm below inguinal ligament.',
    safety: 'Watch for deep vein thrombosis (DVT) and local hematoma.',
    ultrasoundTip: 'Easily collapsible oval vessel medial to the round pulsatile femoral artery.',
  },
  'brachial artery': {
    procedure: 'Axillary Brachial Plexus Landmark',
    technique: 'Runs medially in upper arm. In axillary block, terminal branches (radial, median, ulnar) surround the axillary/brachial artery; musculocutaneous nerve lies in the coracobrachialis muscle.',
    safety: 'Avoid intra-arterial local anesthetic injection which triggers immediate Local Anesthetic Systemic Toxicity (LAST). Always aspirate prior to each 3-5 mL aliquot.',
    ultrasoundTip: 'Central pulsating landmark on transverse axillary ultrasound scan.',
  },
  'diaphragm': {
    procedure: 'Respiratory Mechanics & Phrenic Nerve Monitoring',
    technique: 'Innervated by phrenic nerve (C3, C4, C5: "keeps the diaphragm alive"). Interscalene brachial plexus block produces near 100% incidence of ipsilateral phrenic nerve paresis and hemidiaphragmatic paralysis.',
    safety: 'Caution or avoid interscalene block in patients with severe baseline COPD or compromised contralateral pulmonary function.',
    ultrasoundTip: 'Subcostal ultrasound evaluates diaphragmatic excursion (M-mode) and thickening fraction.',
  },
  'hyoid bone': {
    procedure: 'Airway Landmark & Thyrohyoid Membrane Access',
    technique: 'U-shaped bone at C3 level. Landmark for superior laryngeal nerve block (internal branch) deposited beneath the greater cornu of hyoid bone for awake fiberoptic intubation.',
    safety: 'Gentle palpation; excessive pressure causes distress and laryngospasm in awake patients.',
  },
};

export function getAnesthesiaPearl(structureName: string): ClinicalPearl | null {
  const lower = structureName.toLowerCase();
  for (const [key, pearl] of Object.entries(ANESTHESIA_PEARLS)) {
    if (lower.includes(key)) {
      return pearl;
    }
  }
  return null;
}
