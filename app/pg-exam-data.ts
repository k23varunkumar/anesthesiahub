export interface VivaQuestion {
  question: string;
  answer: string;
  source: string;
}

export interface TroubleshootingRow {
  problem: string;
  reason: string;
  solution: string;
}

export interface PGTopicData {
  id: string;
  structureKeywords: string[];
  title: string;
  subtitle: string;
  sourceBooks: string[];
  examSummary: string;
  vivaQuestions: VivaQuestion[];
  sonoanatomy?: {
    probe: string;
    needle: string;
    acousticLandmarks: string;
    targetPattern: string;
    volumeAndDrugs: string;
  };
  troubleshooting?: TroubleshootingRow[];
  highYieldPearls: string[];
  complications: string[];
}

export interface OSCESpotter {
  id: string;
  title: string;
  targetStructureName: string;
  system: string;
  prompt: string;
  questions: string[];
  modelAnswers: string[];
  highYieldTip: string;
}

export const PG_EXAM_TOPICS: PGTopicData[] = [
  {
    id: 'cricoid-airway',
    structureKeywords: ['cricoid cartilage', 'cricothyroid'],
    title: 'Cricoid Cartilage & Sellick\'s Maneuver',
    subtitle: 'Rapid Sequence Induction (RSI) & Airway Anatomy',
    sourceBooks: ['Anesthesia Review for DNB (Koushik)', 'Barash Clinical Anesthesiology', 'Dorsch Equipment'],
    examSummary: 'The cricoid cartilage is the only complete ring encircling the entire airway at C6. It forms the fulcrum for Sellick\'s maneuver (cricoid pressure) and the inferior boundary of the cricothyroid membrane.',
    vivaQuestions: [
      {
        question: 'What is Sellick\'s maneuver and what exact force should be applied?',
        answer: 'Sellick\'s maneuver applies backward and upward pressure against the cricoid ring to compress the underlying esophagus against the body of C6 vertebra. Force applied: 10 Newtons (~1 kg) while patient is awake, increasing to 30 Newtons (~3 kg) immediately upon loss of consciousness.',
        source: 'Barash & DNB Koushik',
      },
      {
        question: 'What are the absolute and relative contraindications to cricoid pressure?',
        answer: 'Contraindications: 1) Active vomiting (risk of esophageal rupture / Boerhaave syndrome - must release immediately); 2) Suspected or known cricoid/laryngeal fracture; 3) Unstable cervical spine trauma; 4) Foreign body in upper airway.',
        source: 'DNB Koushik p. 128',
      },
      {
        question: 'Describe the complete innervation of the larynx (frequently asked viva table question).',
        answer: 'Sensory: 1) Supraglottic (above vocal cords) = Internal branch of Superior Laryngeal Nerve (SLN); 2) Infraglottic (below vocal cords) = Recurrent Laryngeal Nerve (RLN). Motor: All intrinsic laryngeal muscles are supplied by RLN EXCEPT the Cricothyroid muscle, which is supplied by the External branch of SLN.',
        source: 'DNB Koushik & Barash',
      },
      {
        question: 'What is the clinical presentation of bilateral recurrent laryngeal nerve palsy?',
        answer: 'Bilateral RLN injury causes paralysis of all intrinsic muscles including the primary abductors (posterior cricoarytenoids). The vocal cords assume a median/paramedian position, producing severe inspiratory stridor, aphonia, and acute respiratory obstruction requiring immediate re-intubation or emergency tracheostomy.',
        source: 'Barash Clinical Anesthesia',
      },
    ],
    sonoanatomy: {
      probe: 'High-frequency linear probe (10-15 MHz) in transverse and sagittal planes.',
      needle: '20G-22G for cricoid block / transtracheal injection.',
      acousticLandmarks: 'Cricoid appears as an inverted U-shaped or rounded hypoechoic arch with dense posterior acoustic shadow, sitting directly above the first tracheal ring.',
      targetPattern: 'Thick continuous anterior cartilaginous bar with absence of posterior ring defect.',
      volumeAndDrugs: 'Transtracheal topicalization: 4 mL of 2% or 4% preservative-free Lignocaine rapidly injected on expiration.',
    },
    troubleshooting: [
      {
        problem: 'Difficulty visualizing vocal cords during direct laryngoscopy',
        reason: 'Over-vigorous or asymmetrical cricoid pressure can distort the laryngeal inlet',
        solution: 'Relax pressure slightly or convert to BURP maneuver (Backward-Upward-Rightward Pressure on thyroid cartilage).',
      },
      {
        problem: 'Patient retches or actively vomits during RSI',
        reason: 'Esophageal pressure exceeds intragastric threshold during violent retching',
        solution: 'Release cricoid pressure immediately, tilt table head-down (Trendelenburg), and suction oropharynx.',
      },
    ],
    highYieldPearls: [
      'Adult cricoid level corresponds to C6; in neonates, the larynx is higher (C3-C4 level) and funnel-shaped, making the cricoid the narrowest part of the pediatric airway.',
      'Transtracheal block: Aspirate air first to confirm needle is in the tracheal lumen before injecting local anesthetic.',
      'Thyromental distance < 6 cm, sternomental distance < 12.5 cm, and inter-incisor gap < 3 cm indicate anticipated difficult laryngoscopy.',
    ],
    complications: [
      'Esophageal rupture if cricoid pressure maintained during active vomiting',
      'Laryngeal trauma or fractured cartilage with excessive force (>40 N)',
      'Airway obstruction or worsening Cormack-Lehane laryngoscopy view',
    ],
  },
  {
    id: 'cricothyroid-cico',
    structureKeywords: ['median cricothyroid ligament', 'cricothyroid'],
    title: 'Median Cricothyroid Ligament & Emergency Airway (CICO)',
    subtitle: 'Cannot Intubate Cannot Oxygenate (CICO) & Surgical Cricothyroidotomy',
    sourceBooks: ['DAS Difficult Airway Guidelines', 'Barash Clinical Anesthesia', 'Dorsch Anesthesia Equipment'],
    examSummary: 'The median cricothyroid ligament connects the cricoid cartilage inferiorly to the thyroid cartilage superiorly. It is the primary site for emergency front-of-neck access (FONA) in a CICO emergency.',
    vivaQuestions: [
      {
        question: 'What are the anatomical boundaries of the cricothyroid membrane?',
        answer: 'Superior boundary: Inferior margin of the thyroid cartilage; Inferior boundary: Upper margin of the cricoid ring; Lateral boundaries: Cricothyroid muscles; Depth: ~10 mm height and ~10 mm width in adults.',
        source: 'Barash & DAS Guidelines',
      },
      {
        question: 'Describe the DAS 2015 Scalpel-Bougie-Tube emergency cricothyroidotomy technique step-by-step.',
        answer: '1) "Laryngeal handshake" to immobilize larynx; 2) Transverse stab incision through skin and cricothyroid membrane with size 10 scalpel; 3) Rotate scalpel blade 90° caudally; 4) Coude-tip bougie railroaded along the blade into trachea; 5) Size 6.0 mm cuffed ETT railroaded over bougie; 6) Inflate cuff, confirm bilateral ventilation & ETCO2.',
        source: 'DAS Difficult Airway Guidelines / Koushik',
      },
      {
        question: 'What vascular structures are at risk during emergency cricothyroidotomy?',
        answer: 'Cricothyroid arteries (branches of superior thyroid arteries) anastomose across the upper half of the membrane. Punctures or incisions must stay in the lower half of the cricothyroid membrane to minimize bleeding.',
        source: 'Barash Clinical Anesthesia',
      },
    ],
    highYieldPearls: [
      'In a CICO crisis, muscle relaxation (e.g. 1.5 mg/kg rocuronium or succinylcholine) must be ensured to optimize oxygenation and surgical landmark exposure before scalpel incision.',
      'Always use a 6.0 mm or smaller cuffed endotracheal tube; larger tubes cannot easily pass through the cricothyroid space without cartilage fracture.',
    ],
    complications: [
      'Hemorrhage from cricothyroid artery or anterior jugular veins',
      'False passage into the pretracheal fascia or posterior tracheal wall puncture',
      'Subglottic stenosis (long-term complication; convert to formal tracheostomy within 24-48 hrs)',
    ],
  },
  {
    id: 'neuraxial-spinal-epidural',
    structureKeywords: ['spinal cord', 'lumbar vertebra', 'sacrum'],
    title: 'Neuraxial Anatomy: Spinal & Epidural Blockade',
    subtitle: 'Subarachnoid Space, Epidural Landmarks, Ligaments & Cauda Equina',
    sourceBooks: ['Anesthesia Review for DNB (Koushik p. 1115)', 'Barash Clinical Anesthesiology', 'Dorsch Equipment'],
    examSummary: 'Neuraxial anesthesia requires precise appreciation of spinal column anatomy, ligamentum flavum tactile feedback, conus medullaris termination level, and dural sac boundaries.',
    vivaQuestions: [
      {
        question: 'Enumerate the anatomical layers traversed in a midline spinal puncture from skin to CSF.',
        answer: '1) Skin; 2) Subcutaneous fat; 3) Supraspinous ligament; 4) Interspinous ligament; 5) Ligamentum flavum (distinct loss of resistance / "pop"); 6) Epidural space; 7) Dura mater; 8) Arachnoid mater -> Entry into subarachnoid space (CSF flash).',
        source: 'DNB Koushik p. 1115',
      },
      {
        question: 'What is Tuffier\'s line and why does it frequently mislead clinicians?',
        answer: 'Tuffier\'s (intercrestal) line joins the superior borders of the iliac crests, traditionally estimated at L4 body or L4-L5 interspace. However, radiographic and ultrasound studies show that clinical palpation underestimates the level in 30-50% of patients, frequently being 1-2 segments higher (L3 or L2-L3), especially in pregnant, female, and obese patients.',
        source: 'Koushik DNB & Barash',
      },
      {
        question: 'Where do the spinal cord (conus medullaris) and the dural sac end in adults vs. neonates?',
        answer: 'Spinal Cord (Conus Medullaris): Adults = lower border of L1 (or L1-L2); Neonates = L3. Dural Sac (Thecal sac): Adults = S2; Neonates = S3-S4. Therefore, lumbar puncture must be performed at L3-L4 or L4-L5 in adults and L4-L5 or L5-S1 in infants.',
        source: 'Barash & DNB Koushik',
      },
      {
        question: 'Compare cutting (Quincke) vs. pencil-point (Whitacre, Sprotte) spinal needles regarding Post-Dural Puncture Headache (PDPH).',
        answer: 'Quincke cutting needle cuts longitudinal elastic fibers of the dura mater, creating a persistent oval fistula with higher CSF leak and PDPH incidence (10-30% with 22G). Pencil-point needles (Whitacre, Sprotte) separate and stretch the dural fibers without cutting them; fibers re-appose upon removal, dropping PDPH rate to <1-2%.',
        source: 'Dorsch Anesthesia Equipment',
      },
      {
        question: 'What are the landmarks and anatomical technique for Caudal Epidural Block?',
        answer: 'Landmarks: Sacral hiatus formed by failure of S5 lamina to fuse, bounded laterally by the sacral cornua. Needle (22G short bevel) is inserted at 45° angle until a distinct "pop" through the sacrococcygeal ligament is felt, then depressed to 10-15° parallel to sacral canal and advanced 1-2 cm. Dural sac ends at S2 in adults; always aspirate for CSF and blood.',
        source: 'Koushik DNB & Ganga Manual',
      },
    ],
    sonoanatomy: {
      probe: 'Low-frequency curvilinear probe (2-5 MHz) for adults; high-frequency linear (6-13 MHz) for pediatric/lean patients.',
      needle: '18G Tuohy needle (epidural) or 25G-27G Whitacre/Pencil-point needle (spinal).',
      acousticLandmarks: 'Paramedian sagittal oblique view: lamina appear as a "sawtooth pattern"; intervertebral space reveals "batman sign" with ligamentum flavum, posterior dura, intrathecal space, and anterior complex.',
      targetPattern: 'Hyperechoic linear ligamentum flavum paired with hyperechoic posterior dura mater.',
      volumeAndDrugs: 'Spinal anesthesia: 2.5-3.5 mL (12.5-17.5 mg) of 0.5% Hyperbaric Bupivacaine with 15-25 mcg Fentanyl.',
    },
    highYieldPearls: [
      'Ligamentum flavum thickness: 3-5 mm in lumbar region; thinnest in cervical region (1.5-2 mm). It may be discontinuous in the midline in up to 50% of cervical and high thoracic segments.',
      'Epidural negative pressure is due to transmission of intrapleural pressures through intervertebral foramina and dural tenting by the advancing needle.',
      'Sympathetic blockade extends 2-4 dermatomes higher than sensory block, which in turn is 2 dermatomes higher than motor block.',
    ],
    complications: [
      'Post-Dural Puncture Headache (PDPH) - onset 24-48 hrs, postural in nature, treat with hydration, caffeine, and autologous epidural blood patch (15-20 mL)',
      'High/Total Spinal Anesthesia - profound hypotension, bradycardia (cardioaccelerators T1-T4 blocked), respiratory arrest',
      'Epidural Hematoma or Abscess - progressive motor block/back pain; emergency MRI and surgical decompression within 6-8 hrs',
      'Transverse myelitis / anterior spinal artery syndrome',
    ],
  },
  {
    id: 'brachial-interscalene',
    structureKeywords: ['nerve', 'brachial artery'],
    title: 'Interscalene Brachial Plexus Block',
    subtitle: 'Shoulder & Upper Arm Anesthesia & Phrenic Nerve Anatomy',
    sourceBooks: ['Ganga Hospital Blocks Book (p. 59-64)', 'Anesthesia Review for DNB (Koushik)', 'Barash'],
    examSummary: 'Interscalene block targets the roots and trunks of the brachial plexus (C5, C6, C7) in the groove between the anterior and middle scalene muscles. Standard gold-standard block for shoulder and proximal humerus surgeries.',
    vivaQuestions: [
      {
        question: 'What is the ultrasound appearance of the brachial plexus at the interscalene level?',
        answer: 'Transverse scan at C6 (cricoid level): Brachial plexus trunks appear as hypoechoic round structures stacked vertically like a "traffic light" or "stoplight" (C5 superiorly, C6 in middle, C7 inferiorly) between the hyperechoic anterior scalene muscle and middle scalene muscle.',
        source: 'Ganga Hospital Blocks Book p. 62',
      },
      {
        question: 'What is the incidence of phrenic nerve block in interscalene anesthesia and what is its significance?',
        answer: 'Incidence is near 100% due to local anesthetic tracking anteriorly across the fascia of the anterior scalene muscle where the phrenic nerve (C3-C5) descends. It causes ipsilateral hemidiaphragmatic paresis and a 25-30% reduction in FVC/FEV1. Contraindicated in severe COPD or contralateral diaphragmatic paralysis.',
        source: 'Ganga Book p. 64 & Barash',
      },
      {
        question: 'What is the Bezold-Jarisch reflex during shoulder arthroscopy in beach-chair position?',
        answer: 'Profound bradycardia and hypotension triggered by pooling of blood in lower extremities, vigorous ventricular contraction against an underfilled chamber, activating intracardiac mechanoreceptors and triggering sudden vagal surge. Treat with epinephrine/atropine, head-down tilt, and IV fluids.',
        source: 'Ganga Book p. 64 & Barash',
      },
      {
        question: 'How do you troubleshoot diaphragm twitch vs. bicep twitch during nerve stimulator guided interscalene block?',
        answer: 'Diaphragm twitch = needle is too anterior (stimulating phrenic nerve on anterior scalene); redirect needle 15° posterior. Biceps/deltoid twitch = desired stimulation of superior trunk (C5-C6); target current 0.3-0.5 mA.',
        source: 'Ganga Hospital Blocks Book p. 61',
      },
    ],
    sonoanatomy: {
      probe: 'High-frequency linear probe (10-15 MHz) placed transversely at the level of the cricoid cartilage (C6).',
      needle: '22G, 5 cm short-bevel insulated echogenic needle; in-plane approach from lateral to medial.',
      acousticLandmarks: 'Anterior scalene muscle, Middle scalene muscle, Internal jugular vein, Carotid artery, Vertebral artery (in transverse foramen deep).',
      targetPattern: '"Stoplight / Traffic light" hypoechoic circles between anterior and middle scalenes.',
      volumeAndDrugs: '10-15 mL 0.5% Ropivacaine or 0.25% Bupivacaine (diaphragm-sparing low volume: 5-7 mL under USG).',
    },
    troubleshooting: [
      {
        problem: 'Diaphragm twitch observed on nerve stimulator',
        reason: 'Needle is too anterior, contacting the phrenic nerve on the surface of the anterior scalene',
        solution: 'Withdraw and redirect needle 15 degrees posteriorly into the interscalene groove.',
      },
      {
        problem: 'Bony contact with sharp resistance',
        reason: 'Needle impinging on the transverse process (Chassaignac tubercle of C6)',
        solution: 'Withdraw slightly and angulate needle caudad and laterally.',
      },
      {
        problem: 'Aspiration of bright red arterial blood',
        reason: 'Puncture of vertebral artery (deep) or carotid artery (too anterior)',
        solution: 'Withdraw needle completely, hold firm manual pressure for 5 minutes, ensure no hematoma or LAST.',
      },
    ],
    highYieldPearls: [
      'Chassaignac\'s tubercle is the prominent anterior tubercle of the transverse process of the C6 vertebra, against which the carotid artery can be compressed.',
      'Horner\'s syndrome (ptosis, miosis, anhidrosis, enophthalmos) occurs in up to 20-30% due to stellate ganglion block; reassure the patient that it is benign and self-limiting.',
      'Never inject against high resistance (>15 psi) to prevent intraneural injection and spinal cord trauma.',
    ],
    complications: [
      '100% ipsilateral phrenic nerve paresis / hemidiaphragmatic paralysis',
      'Horner\'s syndrome & Hoarseness (RLN block)',
      'Accidental vertebral artery injection causing immediate convulsions (LAST)',
      'Subarachnoid or epidural injection (total spinal)',
      'Pneumothorax (if needle directed too far caudad toward cupola of pleura)',
    ],
  },
  {
    id: 'vascular-cvc-ijv',
    structureKeywords: ['internal jugular vein', 'common carotid artery', 'subclavian vein'],
    title: 'Central Venous Catheterization: Internal Jugular & Subclavian Veins',
    subtitle: 'Vascular Access Sonoanatomy, Complications & CVP Waveform Analysis',
    sourceBooks: ['Anesthesia Review for DNB (Koushik p. 271)', 'Barash Clinical Anesthesiology', 'Dorsch Equipment'],
    examSummary: 'Internal Jugular Vein (IJV) and Subclavian Vein (SCV) catheterization provide central venous access for inotropic infusions, hyperalimentation, and central venous pressure (CVP) monitoring.',
    vivaQuestions: [
      {
        question: 'Describe the anatomical relationship between the Internal Jugular Vein and the Common Carotid Artery.',
        answer: 'The IJV lies within the carotid sheath anterolateral to the internal and common carotid arteries. However, anatomical variations occur in 5-10% of patients where the IJV lies directly anterior or medial to the carotid artery, highlighting why ultrasound guidance is standard of care.',
        source: 'Barash & Koushik DNB',
      },
      {
        question: 'Why is Trendelenburg tilt used during IJV cannulation?',
        answer: '1) Increases venous hydrostatic pressure, engorging the IJV and increasing its cross-sectional area by 25-35%; 2) Raises intraluminal pressure above atmospheric pressure, preventing fatal air embolism during needle puncture and catheter introduction.',
        source: 'Barash Clinical Anesthesia',
      },
      {
        question: 'What are the normal components of a CVP waveform and what does each signify?',
        answer: 'Waves: 1) a wave = Right atrial contraction (end diastole); 2) c wave = Tricuspid valve bulging during isovolumetric ventricular contraction; 3) v wave = Right atrial filling against closed tricuspid valve (systole). Descents: 1) x descent = Atrial relaxation & ventricular ejection; 2) y descent = Tricuspid valve opening & rapid ventricular filling.',
        source: 'Barash & Koushik p. 271',
      },
      {
        question: 'Compare Right IJV vs Left IJV vs Subclavian vein for CVC placement.',
        answer: 'Right IJV: Straight direct path to superior vena cava and right atrium, lower cupola of pleura (lower pneumothorax risk), no thoracic duct. Left IJV: More tortuous, passes thoracic duct (risk of chylothorax), higher pleural dome. Subclavian: Lowest infection and thrombosis rate, easiest for long-term care, but non-compressible (cannot manually compress if arterial puncture occurs) and higher apical pneumothorax risk.',
        source: 'Koushik DNB p. 271',
      },
    ],
    sonoanatomy: {
      probe: 'High-frequency linear probe (7-12 MHz) in short-axis (transverse) and long-axis (in-plane).',
      needle: '18G introducer needle or 20G over-the-needle catheter with Seldinger J-tip guidewire.',
      acousticLandmarks: 'SCM muscle superficial; IJV is an easily compressible oval hypoechoic structure with thin walls lateral to the thick, non-compressible, pulsatile circular carotid artery.',
      targetPattern: 'Needle tip visualization entering anterior wall without puncture of posterior wall.',
      volumeAndDrugs: 'Heparinized saline flush (10-100 U/mL) or sterile saline flushes.',
    },
    troubleshooting: [
      {
        problem: 'Vein collapses immediately upon needle approach',
        reason: 'Excessive downward transducer pressure compressing the thin-walled vein',
        solution: 'Use gentle "float" probe technique with copious ultrasound gel.',
      },
      {
        problem: 'Guidewire meets resistance at 10-15 cm',
        reason: 'Guidewire impinging on vessel wall, entering internal thoracic vein, or coiled',
        solution: 'Never force guidewire! Withdraw slightly, rotate wire 90-180°, lower angle, or re-verify with ultrasound.',
      },
      {
        problem: 'Pulsatile bright red blood aspirated',
        reason: 'Inadvertent carotid arterial cannulation',
        solution: 'Do not dilate! Remove needle, apply direct firm manual pressure for 10-15 minutes, check neurological status.',
      },
    ],
    highYieldPearls: [
      'Depth of right IJV catheter insertion in average adult: ~12-15 cm; Left IJV: ~15-18 cm (formula: height in cm / 10).',
      'The tip of the CVC should sit at the junction of the superior vena cava and right atrium (cavoatrial junction), outside the pericardial reflection to prevent cardiac tamponade.',
      'Always observe real-time ultrasound needle entrance and confirm venous blood color/manometry prior to using the dilator.',
    ],
    complications: [
      'Pneumothorax / Tension Pneumothorax / Hemothorax',
      'Accidental arterial puncture, arteriovenous fistula, or hematoma causing airway compromise',
      'Air embolism (maintain Trendelenburg, occlude needle hub with finger)',
      'Cardiac arrhythmias (guidewire irritating right ventricle)',
      'Catheter-related bloodstream infection (CRBSI) & venous thrombosis',
    ],
  },
  {
    id: 'femoral-block',
    structureKeywords: ['femoral artery', 'femoral vein'],
    title: 'Femoral Nerve & Fascia Iliaca Blockade',
    subtitle: 'Femoral Triangle Anatomy, 3-in-1 Block & Hip Fracture Analgesia',
    sourceBooks: ['Ganga Hospital Blocks Book (p. 91-95)', 'Barash Clinical Anesthesiology'],
    examSummary: 'The femoral nerve (L2, L3, L4 posterior divisions) supplies the anterior thigh and knee. Gold standard analgesic block for femur fractures, total knee arthroplasty, and skin grafting.',
    vivaQuestions: [
      {
        question: 'What are the anatomical boundaries and contents of the femoral triangle?',
        answer: 'Boundaries: Superior = Inguinal ligament; Lateral = Medial border of Sartorius; Medial = Medial border of Adductor Longus; Floor = Pectineus & Iliopsoas; Roof = Fascia lata. Contents from Lateral to Medial: Femoral Nerve, Femoral Artery, Femoral Vein, Empty space (canal), Lymphatics (NAVEL).',
        source: 'Ganga Manual p. 91',
      },
      {
        question: 'Describe the sonoanatomy of the femoral nerve block.',
        answer: 'Transverse probe just distal to inguinal crease: Femoral artery is the primary pulsatile acoustic landmark; Femoral vein lies medial. The femoral nerve appears as a hyperechoic triangular or oval "honeycomb" structure lying lateral to the artery, beneath the hyperechoic Fascia Lata and Fascia Iliaca, resting on the iliopsoas muscle.',
        source: 'Ganga Hospital Blocks Book p. 92',
      },
      {
        question: 'What is the characteristic motor response sought on a nerve stimulator during femoral nerve block?',
        answer: '"Dancing patella" sign - rhythmic quadriceps contraction with vigorous superior patellar snap (stimulation of motor branches to rectus femoris/vastus) at 0.3-0.5 mA. Sartorius contraction alone (hip flexion/medial knee twitch) means needle is too anterior/superficial and must be redirected deeper.',
        source: 'Ganga Manual p. 93',
      },
    ],
    sonoanatomy: {
      probe: 'High-frequency linear probe (6-13 MHz) placed transversely over the femoral crease.',
      needle: '22G, 5-8 cm insulated needle; in-plane approach from lateral to medial.',
      acousticLandmarks: 'Pulsatile Femoral Artery, compressible Femoral Vein, hyperechoic Fascia Iliaca, Iliopsoas muscle bed.',
      targetPattern: 'Hyperechoic wedge/oval lateral to the artery under fascia iliaca.',
      volumeAndDrugs: '15-20 mL 0.2% Ropivacaine or 0.25% Bupivacaine (doughnut distribution around nerve).',
    },
    troubleshooting: [
      {
        problem: 'Sartorius muscle twitch without patellar snap',
        reason: 'Needle is stimulating anterior superficial branch to sartorius',
        solution: 'Direct needle deeper and slightly laterally to contact the posterior division for quadriceps snap.',
      },
    ],
    highYieldPearls: [
      'Adductor canal block (targeting the saphenous nerve and nerve to vastus medialis) preserves quadriceps motor strength, enabling early post-op ambulation compared to femoral nerve block.',
      'Fascia Iliaca block relies on volume (30-40 mL) to spread beneath the fascia to block both the femoral and lateral femoral cutaneous nerves.',
    ],
    complications: [
      'Femoral nerve palsy / persistent quadriceps weakness (fall risk)',
      'Intravascular injection into femoral artery or vein',
      'Local hematoma formation',
    ],
  },
];

export const OSCE_SPOTTERS: OSCESpotter[] = [
  {
    id: 'spotter-1',
    title: 'Spotter 1: Cricoid Cartilage',
    targetStructureName: 'cricoid cartilage',
    system: 'respiratory',
    prompt: 'Observe the highlighted cartilage in the laryngeal framework.',
    questions: [
      '1. Identify the highlighted structure.',
      '2. What is its unique anatomical feature compared to all other airway cartilages?',
      '3. Name the clinical maneuver performed at this site during RSI and the pressure required.',
      '4. Mention two absolute contraindications to this maneuver.',
    ],
    modelAnswers: [
      '1. Cricoid cartilage.',
      '2. It is the ONLY complete circular cartilaginous ring in the entire respiratory tract (signet ring shape with tall posterior lamina).',
      '3. Sellick\'s maneuver (cricoid pressure): 10 N awake, increased to 30 N (~3 kg force) upon loss of consciousness.',
      '4. Active vomiting (risk of esophageal rupture) and suspected cricoid/laryngeal fracture or unstable cervical spine injury.',
    ],
    highYieldTip: 'Pediatric airway: Cricoid was traditionally taught as the narrowest site; recent video studies show glottic opening is functionally equal, but cricoid remains nondistensible.',
  },
  {
    id: 'spotter-2',
    title: 'Spotter 2: Median Cricothyroid Ligament',
    targetStructureName: 'median cricothyroid ligament',
    system: 'connective',
    prompt: 'Observe the highlighted membrane between the two main laryngeal cartilages.',
    questions: [
      '1. Identify the highlighted anatomical landmark.',
      '2. In what clinical emergency algorithm is this structure the final rescue step?',
      '3. Describe the 3-step surgical technique recommended by DAS 2015 guidelines.',
      '4. What size endotracheal tube is railroaded over the bougie?',
    ],
    modelAnswers: [
      '1. Median Cricothyroid Ligament (Cricothyroid membrane).',
      '2. Cannot Intubate, Cannot Oxygenate (CICO) emergency protocol.',
      '3. Scalpel-Bougie-Tube technique: 1) Transverse stab incision with size 10 scalpel; 2) 90° caudally rotated blade to hold space; 3) Railroad coude-tip bougie into trachea.',
      '4. Size 6.0 mm cuffed endotracheal tube (cuff inflated, confirmed with ETCO2).',
    ],
    highYieldTip: 'Keep incisions in the lower half of the ligament to avoid the transverse cricothyroid arterial anastomosis.',
  },
  {
    id: 'spotter-3',
    title: 'Spotter 3: Spinal Cord & Conus Medullaris',
    targetStructureName: 'spinal cord',
    system: 'nervous',
    prompt: 'Observe the terminal portion of the central nervous system bundle in the vertebral column.',
    questions: [
      '1. Identify the highlighted structure and its tapered terminal region.',
      '2. At what vertebral level does the conus medullaris terminate in adults and neonates?',
      '3. Which lumbar interspaces are considered safe for subarachnoid puncture in adults?',
      '4. What landmark is traditionally used to locate the L4 spine?',
    ],
    modelAnswers: [
      '1. Spinal cord and Conus Medullaris.',
      '2. Adults: Lower border of L1 (or L1-L2 interspace). Neonates: L3 vertebral level.',
      '3. L3-L4 or L4-L5 interspaces (strictly below L2 to prevent direct cord trauma).',
      '4. Tuffier\'s line (intercrestal line connecting superior iliac crests), though it frequently intersects L3 or L3-L4 in pregnant and obese patients.',
    ],
    highYieldTip: 'Paraesthesia upon needle insertion mandates immediate cessation of advancement and re-direction.',
  },
  {
    id: 'spotter-4',
    title: 'Spotter 4: Internal Jugular Vein',
    targetStructureName: 'internal jugular vein',
    system: 'venous',
    prompt: 'Observe the highlighted vascular structure in the anterolateral cervical region.',
    questions: [
      '1. Identify the highlighted vessel.',
      '2. Describe its anatomical relationship to the common carotid artery within the carotid sheath.',
      '3. State two reasons why Trendelenburg positioning is maintained during cannulation.',
      '4. Why is the right internal jugular vein preferred over the left?',
    ],
    modelAnswers: [
      '1. Internal Jugular Vein (IJV).',
      '2. Lies anterolateral to the internal and common carotid arteries within the carotid sheath.',
      '3. 1) Increases venous hydrostatic pressure, distending the vein by 25-35%; 2) Prevents air embolism by maintaining positive venous pressure.',
      '4. Right IJV offers a straight direct course into the SVC and right atrium, has a lower pleural dome (lower pneumothorax risk), and avoids the thoracic duct (left side).',
    ],
    highYieldTip: 'Depth formula for CVC tip at cavoatrial junction: Height (cm) / 10 for right IJV.',
  },
  {
    id: 'spotter-5',
    title: 'Spotter 5: Radial Artery',
    targetStructureName: 'radial artery',
    system: 'arterial',
    prompt: 'Observe the highlighted arterial vessel at the lateral distal forearm.',
    questions: [
      '1. Identify the highlighted vessel.',
      '2. What is the clinical indication for its cannulation in anesthesiology and critical care?',
      '3. What clinical test is historically performed to assess palmar arch collateral circulation?',
      '4. Name two clinical causes of an overdamped arterial line waveform.',
    ],
    modelAnswers: [
      '1. Radial Artery.',
      '2. Continuous invasive arterial blood pressure monitoring, frequent arterial blood gas (ABG) sampling, and stroke volume variation (SVV) analysis.',
      '3. Modified Allen\'s Test (evaluates patency of ulnar artery and deep palmar arch; normal return of flush < 5-7 seconds).',
      '4. Air bubbles in pressure tubing, blood clot at catheter tip, kinked tubing, arterial spasm, or compliance in compliant stopcocks.',
    ],
    highYieldTip: 'Transducer must be zeroed at the level of the phlebostatic axis (4th intercostal space, mid-axillary line) representing the right atrium.',
  },
];

export function getPGTopic(structureName: string): PGTopicData | null {
  const lower = structureName.toLowerCase();
  for (const topic of PG_EXAM_TOPICS) {
    if (topic.structureKeywords.some(kw => lower.includes(kw))) {
      return topic;
    }
  }
  return null;
}
