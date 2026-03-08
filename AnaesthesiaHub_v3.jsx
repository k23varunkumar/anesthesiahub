import { useState, useEffect } from "react";

/* ─── GLOBAL STYLES injected once ─────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#f0f4f8;font-family:'Nunito',sans-serif;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
  input[type=range]{-webkit-appearance:none;height:4px;border-radius:4px;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;cursor:pointer;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  .fade{animation:fadeIn 0.25s ease}
  .chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.3px;}
`;

/* ─── DESIGN TOKENS ────────────────────────────────────────── */
const T = {
  bg: "#f0f4f8",
  card: "#ffffff",
  border: "#e2e8f0",
  borderDark: "#cbd5e1",
  text: "#0f172a",
  sub: "#475569",
  muted: "#94a3b8",
  faint: "#f8fafc",
  // module colors
  c1: "#0ea5e9",  // Drug — sky blue
  c2: "#10b981",  // Infusion — emerald
  c3: "#f59e0b",  // Preop — amber
  c4: "#ef4444",  // Airway — red
  c5: "#8b5cf6",  // Crisis — violet
  ok: "#22c55e",
  warn: "#f59e0b",
  danger: "#ef4444",
};

const MOD_META = [
  { id:"drugs",   label:"Drug Doses",   icon:"💊", color:T.c1, bg:"#e0f2fe", dark:"#0369a1" },
  { id:"infusion",label:"Infusion",     icon:"💧", color:T.c2, bg:"#d1fae5", dark:"#065f46" },
  { id:"preop",   label:"Pre-op Risk",  icon:"📋", color:T.c3, bg:"#fef3c7", dark:"#92400e" },
  { id:"airway",  label:"Airway",       icon:"🫁", color:T.c4, bg:"#fee2e2", dark:"#991b1b" },
  { id:"crisis",  label:"Crisis",       icon:"🚨", color:T.c5, bg:"#ede9fe", dark:"#5b21b6" },
];

/* ─── SHARED COMPONENTS ────────────────────────────────────── */
const Card = ({ children, style={}, color, onClick }) => (
  <div onClick={onClick} style={{
    background: T.card, borderRadius: 16,
    border: `1.5px solid ${color ? color+"30" : T.border}`,
    boxShadow: color ? `0 2px 12px ${color}15` : "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden", ...style,
    cursor: onClick ? "pointer" : "default",
  }}>{children}</div>
);

const SectionHeader = ({ icon, title, color, sub }) => (
  <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`,
    background:`linear-gradient(135deg,${color}08,transparent)` }}>
    <div style={{ fontSize:17, fontWeight:800, color:T.text, display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ fontSize:20 }}>{icon}</span>{title}
    </div>
    {sub && <div style={{ fontSize:11, color:T.sub, marginTop:2 }}>{sub}</div>}
  </div>
);

const Chip = ({ children, color, bg }) => (
  <span className="chip" style={{ background: bg||color+"18", color, border:`1px solid ${color}35` }}>{children}</span>
);

const ProgressBar = ({ value, max, color, height=4 }) => (
  <div style={{ height, background:"#e2e8f0", borderRadius:10, overflow:"hidden" }}>
    <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%",
      background:`linear-gradient(90deg,${color},${color}cc)`,
      borderRadius:10, transition:"width 0.5s cubic-bezier(.34,1.56,.64,1)" }} />
  </div>
);

const CheckItem = ({ label, sub, checked, onToggle, color }) => (
  <label onClick={onToggle} style={{
    display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px",
    borderRadius:10, cursor:"pointer", transition:"all 0.15s",
    background: checked ? color+"0f" : T.faint,
    border: `1.5px solid ${checked ? color+"50" : T.border}`,
  }}>
    <div style={{
      width:18, height:18, borderRadius:5, flexShrink:0, marginTop:1,
      background: checked ? color : "#fff",
      border: `2px solid ${checked ? color : T.borderDark}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      transition:"all 0.15s", boxShadow: checked ? `0 0 6px ${color}50` : "none",
    }}>
      {checked && <span style={{ fontSize:10, color:"#fff", fontWeight:900, lineHeight:1 }}>✓</span>}
    </div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:12, fontWeight: checked?700:500, color: checked?T.text:T.sub,
        textDecoration: checked?"line-through":"none" }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:T.muted, marginTop:1 }}>{sub}</div>}
    </div>
  </label>
);

const WarnBox = ({ text, color="#ef4444" }) => (
  <div style={{ background:color+"0d", border:`1px solid ${color}30`, borderRadius:10,
    padding:"9px 12px", fontSize:11, color, display:"flex", gap:6, alignItems:"flex-start", marginTop:8 }}>
    <span style={{ flexShrink:0 }}>⚠️</span><span style={{ lineHeight:1.6 }}>{text}</span>
  </div>
);

/* ──────────────────────────────────────────────────────────── */
/*  MODULE 1 — DRUG DOSE CALCULATOR                            */
/* ──────────────────────────────────────────────────────────── */
const DRUGS = {
  induction:[
    { n:"Propofol", cat:"Induction Agent", col:"#0ea5e9",
      doses:[{l:"Induction (adult)",mn:1.5,mx:2.5,u:"mg/kg"},{l:"Induction (elderly/ASA III-IV)",mn:1.0,mx:1.5,u:"mg/kg"},{l:"TIVA maintenance",mn:4,mx:12,u:"mg/kg/hr"},{l:"ICU sedation",mn:1,mx:4,u:"mg/kg/hr"}],
      w:"Apnea & hypotension common. Avoid in egg/soy allergy. Pain on injection — use larger vein." },
    { n:"Ketamine", cat:"Dissociative", col:"#10b981",
      doses:[{l:"Induction IV",mn:1,mx:2,u:"mg/kg"},{l:"Induction IM",mn:4,mx:6,u:"mg/kg"},{l:"Sub-anaesthetic analgesia",mn:0.1,mx:0.5,u:"mg/kg"},{l:"Maintenance infusion",mn:1,mx:2,u:"mg/kg/hr"}],
      w:"Emergence delirium — co-administer midazolam. Increases secretions — consider atropine. Bronchodilator." },
    { n:"Thiopentone", cat:"Barbiturate", col:"#8b5cf6",
      doses:[{l:"Induction (adult)",mn:3,mx:5,u:"mg/kg"},{l:"Induction (elderly)",mn:2,mx:3,u:"mg/kg"},{l:"Induction (child)",mn:5,mx:6,u:"mg/kg"}],
      w:"Contraindicated in porphyria. Causes histamine release. Extravasation causes tissue necrosis." },
    { n:"Etomidate", cat:"Imidazole", col:"#f59e0b",
      doses:[{l:"Induction",mn:0.2,mx:0.3,u:"mg/kg"}],
      w:"Adrenal suppression even with single dose. Avoid in sepsis. Myoclonus common — pre-treat with midazolam." },
  ],
  opioids:[
    { n:"Fentanyl", cat:"Opioid", col:"#ef4444",
      doses:[{l:"Co-induction",mn:1,mx:3,u:"mcg/kg"},{l:"Maintenance bolus",mn:1,mx:2,u:"mcg/kg"},{l:"Post-op analgesia",mn:0.5,mx:1,u:"mcg/kg"},{l:"ICU infusion",mn:1,mx:3,u:"mcg/kg/hr"}],
      w:"Chest wall rigidity at high/rapid doses. Context-sensitive half-time prolongs with infusion. Naloxone ready." },
    { n:"Morphine", cat:"Opioid", col:"#f97316",
      doses:[{l:"Pre-medication IM",mn:0.05,mx:0.1,u:"mg/kg"},{l:"IV analgesia (slow)",mn:0.05,mx:0.15,u:"mg/kg"},{l:"Intrathecal",fx:"0.1–0.2 mg (preservative-free)"},{l:"Epidural",fx:"2–5 mg (preservative-free)"}],
      w:"Histamine release → bronchospasm risk. Accumulates in renal failure (active metabolites). Avoid in asthma." },
    { n:"Tramadol", cat:"Weak Opioid", col:"#eab308",
      doses:[{l:"Post-op analgesia IV",mn:1,mx:2,u:"mg/kg"},{l:"Oral analgesia",fx:"50–100 mg (flat dose)"}],
      w:"Lowers seizure threshold. Serotonin syndrome with SSRIs/MAOIs. Less respiratory depression than full agonists." },
    { n:"Buprenorphine", cat:"Partial Agonist", col:"#a78bfa",
      doses:[{l:"Sublingual",fx:"200–400 mcg (flat dose)"},{l:"IV analgesia",mn:0.003,mx:0.006,u:"mg/kg"}],
      w:"Ceiling effect on respiratory depression. Partial reversal with naloxone only. Long duration (6–8 hrs)." },
  ],
  nmba:[
    { n:"Succinylcholine", cat:"Depolarising NMBA", col:"#ec4899",
      doses:[{l:"RSI (adult)",mn:1.5,mx:2,u:"mg/kg"},{l:"RSI (child)",mn:2,mx:3,u:"mg/kg"},{l:"Laryngospasm",fx:"0.1 mg/kg IV or 4 mg/kg IM"}],
      w:"CONTRAINDICATED: burns >24h, crush injury >24h, hyperkalaemia, myopathies, MH susceptibility, denervation. Give atropine in children." },
    { n:"Rocuronium", cat:"Non-dep NMBA", col:"#0ea5e9",
      doses:[{l:"Intubation (standard)",mn:0.6,mx:0.9,u:"mg/kg"},{l:"RSI dose",mn:1.2,mx:1.2,u:"mg/kg"},{l:"Maintenance bolus",mn:0.1,mx:0.2,u:"mg/kg"},{l:"Maintenance infusion",mn:0.3,mx:0.6,u:"mg/kg/hr"}],
      w:"Reversed by sugammadex 16mg/kg immediately after 1.2mg/kg RSI dose. Prolonged in liver disease. TOF monitoring essential." },
    { n:"Vecuronium", cat:"Non-dep NMBA", col:"#14b8a6",
      doses:[{l:"Intubation",mn:0.1,mx:0.15,u:"mg/kg"},{l:"Maintenance",mn:0.02,mx:0.05,u:"mg/kg"},{l:"Infusion",mn:0.06,mx:0.1,u:"mg/kg/hr"}],
      w:"Accumulates in renal/hepatic failure. TOF monitoring. Onset 3–4 min — not for RSI." },
    { n:"Atracurium", cat:"Non-dep NMBA", col:"#06b6d4",
      doses:[{l:"Intubation",mn:0.5,mx:0.6,u:"mg/kg"},{l:"Maintenance",mn:0.1,mx:0.2,u:"mg/kg"},{l:"Infusion",mn:0.3,mx:0.6,u:"mg/kg/hr"}],
      w:"Hofmann elimination — safe in renal/liver failure. Histamine release at high doses. Laudanosine CNS effects." },
    { n:"Neostigmine", cat:"Reversal Agent", col:"#22c55e",
      doses:[{l:"NMBA reversal",mn:0.04,mx:0.08,u:"mg/kg"}],
      w:"Always co-administer atropine 0.02mg/kg or glycopyrrolate 0.01mg/kg. Do NOT reverse at TOF count <2 (deep block). Max 5 mg." },
    { n:"Sugammadex", cat:"Reversal Agent", col:"#2dd4bf",
      doses:[{l:"Moderate block (TOF ≥2)",mn:2,mx:2,u:"mg/kg"},{l:"Deep block (1–2 PTC)",mn:4,mx:4,u:"mg/kg"},{l:"RSI immediate reversal",mn:16,mx:16,u:"mg/kg"}],
      w:"Rocuronium/vecuronium only. Bradycardia possible. Reduces efficacy of hormonal contraceptives for 7 days. Cost: use judiciously." },
  ],
  adjuvants:[
    { n:"Midazolam", cat:"Benzodiazepine", col:"#a78bfa",
      doses:[{l:"Pre-med adult IV",mn:0.02,mx:0.05,u:"mg/kg"},{l:"Pre-med child (oral)",mn:0.3,mx:0.5,u:"mg/kg"},{l:"Sedation IV",mn:0.01,mx:0.05,u:"mg/kg"},{l:"Co-induction",mn:0.02,mx:0.04,u:"mg/kg"}],
      w:"Reversal: Flumazenil 0.01mg/kg (max 1mg). Potentiates opioid respiratory depression. Paradoxical excitation in elderly/children." },
    { n:"Atropine", cat:"Anticholinergic", col:"#f9a8d4",
      doses:[{l:"Bradycardia",mn:0.01,mx:0.02,u:"mg/kg"},{l:"With neostigmine",mn:0.02,mx:0.02,u:"mg/kg"},{l:"Antisialagogue pre-med",mn:0.01,mx:0.02,u:"mg/kg"}],
      w:"Minimum 0.1 mg to avoid paradoxical bradycardia. Always given with neostigmine. May worsen tachycardia." },
    { n:"Glycopyrrolate", cat:"Anticholinergic", col:"#fb923c",
      doses:[{l:"With neostigmine",mn:0.01,mx:0.015,u:"mg/kg"},{l:"Antisialagogue",mn:0.005,mx:0.01,u:"mg/kg"}],
      w:"Does not cross BBB (no CNS effects). Preferred over atropine with neostigmine in cardiac disease." },
    { n:"Dexamethasone", cat:"Steroid/Antiemetic", col:"#6ee7b7",
      doses:[{l:"PONV prophylaxis",fx:"8 mg IV at induction"},{l:"Airway oedema",mn:0.1,mx:0.2,u:"mg/kg"},{l:"Anti-inflammatory",mn:0.1,mx:0.2,u:"mg/kg"}],
      w:"Give at induction for PONV (not end of case). Single dose safe. Transient hyperglycaemia — monitor in diabetics." },
    { n:"Ondansetron", cat:"5HT3 Antiemetic", col:"#38bdf8",
      doses:[{l:"PONV prophylaxis/treatment",mn:0.1,mx:0.15,u:"mg/kg"},{l:"Adult flat dose",fx:"4–8 mg IV"}],
      w:"QT prolongation at high doses. Avoid in congenital long QT. Give at end of surgery for PONV prophylaxis." },
    { n:"Dexmedetomidine", cat:"Alpha-2 Agonist", col:"#34d399",
      doses:[{l:"Loading dose",mn:0.5,mx:1,u:"mcg/kg"},{l:"Maintenance infusion",mn:0.2,mx:0.7,u:"mcg/kg/hr"}],
      w:"Bradycardia & hypotension. No respiratory depression — ideal for awake procedures. Load over 10 min to reduce CV effects." },
    { n:"Ephedrine", cat:"Vasopressor", col:"#fde047",
      doses:[{l:"Hypotension bolus",mn:0.1,mx:0.2,u:"mg/kg"},{l:"Spinal hypotension",fx:"6–12 mg (flat dose, repeat PRN)"}],
      w:"Indirect sympathomimetic. Tachycardia common. Preferred in obstetric spinal hypotension (maintains uteroplacental flow)." },
    { n:"Metaraminol", cat:"Vasopressor", col:"#fbbf24",
      doses:[{l:"Hypotension bolus",fx:"0.5–2 mg IV (flat dose)"},{l:"Infusion",fx:"0.5–5 mg/hr (titrate to MAP)"}],
      w:"Alpha-dominant. Less tachycardia than ephedrine. Preferred in non-obstetric hypotension. Reflex bradycardia." },
  ],
  local:[
    { n:"Lignocaine (Lidocaine)", cat:"Local Anaesthetic", col:"#22d3ee",
      doses:[{l:"Plain (max dose)",mn:3,mx:4,u:"mg/kg"},{l:"With adrenaline (max)",mn:7,mx:7,u:"mg/kg"},{l:"Spinal 5% hyperbaric",fx:"75 mg (~1.5 mL)"},{l:"Airway topicalisation",mn:4,mx:4,u:"mg/kg (total limit)"},{l:"IV regional (Bier's block)",mn:3,mx:4,u:"mg/kg (0.5% plain, 40 mL)"}],
      w:"LAST protocol: 20% Intralipid immediately available. Less cardiotoxic than bupivacaine. IV injection causes seizures." },
    { n:"Bupivacaine", cat:"Local Anaesthetic", col:"#60a5fa",
      doses:[{l:"Plain (max dose)",mn:2,mx:2.5,u:"mg/kg"},{l:"With adrenaline (max)",mn:2.5,mx:2.5,u:"mg/kg (max 175mg)"},{l:"Spinal 0.5% hyperbaric",fx:"7.5–15 mg (1.5–3 mL) — site dependent"},{l:"Epidural top-up",mn:1,mx:2,u:"mg/kg (0.5%)"}],
      w:"CARDIOTOXIC — NEVER IV bolus. Have 20% Intralipid ready at ALL times. Hyperbaric: dose depends on dermatome level required." },
    { n:"Ropivacaine", cat:"Local Anaesthetic", col:"#a78bfa",
      doses:[{l:"Max dose",mn:3,mx:3,u:"mg/kg (max 300 mg)"},{l:"Epidural loading (labour)",fx:"20 mg (10 mL of 0.2%)"},{l:"Epidural maintenance",fx:"5–15 mL/hr of 0.1–0.2%"},{l:"Peripheral nerve block",mn:1,mx:3,u:"mg/kg (0.5–0.75%)"}],
      w:"Less cardiotoxic than bupivacaine. Preferred for epidurals and nerve blocks. Motor sparing at lower concentrations." },
    { n:"Levobupivacaine", cat:"Local Anaesthetic", col:"#818cf8",
      doses:[{l:"Max dose",mn:2,mx:2.5,u:"mg/kg (max 150 mg)"},{l:"Spinal 0.5%",fx:"7.5–15 mg (1.5–3 mL)"},{l:"Epidural",mn:1,mx:2,u:"mg/kg"}],
      w:"S-enantiomer of bupivacaine — less cardiotoxic. Similar clinical profile. Available as 0.25%, 0.5%, 0.75%." },
  ],
};

const DCATS = [
  {k:"induction",l:"Induction",i:"💉"},
  {k:"opioids",l:"Opioids",i:"🩺"},
  {k:"nmba",l:"NMBA & Reversal",i:"🧬"},
  {k:"adjuvants",l:"Adjuvants",i:"⚗️"},
  {k:"local",l:"Local Anaesthetics",i:"🔬"},
];

function DrugModule() {
  const [weight, setWeight] = useState("");
  const [cat, setCat] = useState("induction");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});
  const color = T.c1;
  const allDrugs = Object.values(DRUGS).flat();
  const drugs = search.trim() ? allDrugs.filter(d => d.n.toLowerCase().includes(search.toLowerCase())) : DRUGS[cat];
  const calc = (dose, w) => {
    if (!w || isNaN(w)) return null;
    if (dose.fx) return dose.fx;
    const lo = (dose.mn * w).toFixed(1), hi = (dose.mx * w).toFixed(1);
    return lo === hi ? `${lo} ${dose.u.replace("/kg","")}` : `${lo} – ${hi} ${dose.u.replace("/kg","")}`;
  };
  return (
    <div className="fade">
      {/* Weight + Search */}
      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:`2px solid ${color}40`, borderRadius:12, padding:"8px 14px", flex:"0 0 auto" }}>
          <span style={{ fontSize:16 }}>⚖️</span>
          <span style={{ fontSize:12, color:T.sub, fontWeight:600 }}>Weight</span>
          <input type="number" placeholder="70" value={weight} onChange={e=>setWeight(e.target.value)}
            style={{ background:"none", border:"none", outline:"none", color:color, fontSize:22, fontWeight:800, width:58, textAlign:"center", fontFamily:"'JetBrains Mono',monospace" }} />
          <span style={{ fontSize:12, color:T.muted, fontWeight:600 }}>kg</span>
        </div>
        <input type="text" placeholder="🔍  Search any drug…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, minWidth:150, background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"10px 14px", color:T.text, fontSize:13, outline:"none", fontFamily:"'Nunito',sans-serif" }} />
      </div>
      {/* Tabs */}
      {!search.trim() && (
        <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
          {DCATS.map(c => (
            <button key={c.k} onClick={() => setCat(c.k)} style={{
              display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:20, border:"none",
              cursor:"pointer", whiteSpace:"nowrap", fontSize:12, fontWeight:700,
              background: cat===c.k ? color : "#fff",
              color: cat===c.k ? "#fff" : T.sub,
              boxShadow: cat===c.k ? `0 4px 12px ${color}40` : "0 1px 3px rgba(0,0,0,0.08)",
              transition:"all 0.2s",
            }}>{c.i} {c.l}</button>
          ))}
        </div>
      )}
      {weight && (
        <div style={{ background:`${color}10`, border:`1.5px solid ${color}30`, borderRadius:10, padding:"8px 14px", marginBottom:12, fontSize:12, color, fontWeight:700, display:"flex", gap:6, alignItems:"center" }}>
          <span>✅</span> Showing calculated doses for <strong>{weight} kg</strong> patient
        </div>
      )}
      {/* Drug cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {drugs.map(drug => {
          const isOpen = open[drug.n];
          return (
            <Card key={drug.n} color={isOpen ? drug.col : null}
              style={{ transition:"all 0.2s" }}>
              <div onClick={() => setOpen(p => ({...p,[drug.n]:!p[drug.n]}))} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", cursor:"pointer" }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:drug.col, boxShadow:`0 0 8px ${drug.col}80`, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{drug.n}</div>
                  <Chip color={drug.col}>{drug.cat}</Chip>
                </div>
                {weight && <Chip color={color}>{weight}kg</Chip>}
                <div style={{ fontSize:14, color:T.muted, transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</div>
              </div>
              {isOpen && (
                <div style={{ padding:"0 16px 14px" }} className="fade">
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8, marginBottom:10 }}>
                    {drug.doses.map((dose, i) => (
                      <div key={i} style={{ background:T.faint, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"10px 12px" }}>
                        <div style={{ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5 }}>{dose.l}</div>
                        <div style={{ fontSize: weight ? 18 : 13, fontWeight:800, color:drug.col, fontFamily:"'JetBrains Mono',monospace", lineHeight:1.2 }}>
                          {weight ? calc(dose,parseFloat(weight)) : (dose.fx || `${dose.mn}–${dose.mx} ${dose.u}`)}
                        </div>
                        {!weight && !dose.fx && <div style={{ fontSize:9, color:T.muted, marginTop:3 }}>↑ enter weight to calculate</div>}
                      </div>
                    ))}
                  </div>
                  <WarnBox text={drug.w} color={drug.col} />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  MODULE 2 — INFUSION RATE CALCULATOR                        */
/* ──────────────────────────────────────────────────────────── */
const INFUSION_DRUGS = [
  { n:"Noradrenaline", i:"🫀", col:"#ef4444", u:"mcg/kg/min", mn:0.01, mx:3, st:0.01, df:0.1,
    concs:[{l:"4mg in 50mL (80 mcg/mL)",v:80},{l:"8mg in 50mL (160 mcg/mL)",v:160},{l:"4mg in 250mL (16 mcg/mL)",v:16}],
    ind:"Vasopressor — septic/distributive shock", w:"Central line preferred. Tissue necrosis on extravasation. Target MAP >65 mmHg.",
    tips:["Titrate in 0.05–0.1 mcg/kg/min steps","Low dose: mostly alpha-vasoconstriction","Combine with dobutamine in cardiogenic shock"] },
  { n:"Adrenaline", i:"⚡", col:"#f97316", u:"mcg/kg/min", mn:0.01, mx:1, st:0.01, df:0.05,
    concs:[{l:"1mg in 50mL (20 mcg/mL)",v:20},{l:"5mg in 50mL (100 mcg/mL)",v:100}],
    ind:"Cardiogenic shock, anaphylaxis, cardiac arrest adjunct", w:"Tachycardia & arrhythmias. Continuous ECG. Metabolic acidosis at high doses.",
    tips:["<0.1 mcg/kg/min: beta-dominant (inotropy)","0.1–0.3: mixed alpha + beta","  >0.3: alpha-dominant (vasoconstriction)"] },
  { n:"Dopamine", i:"🧠", col:"#8b5cf6", u:"mcg/kg/min", mn:1, mx:20, st:0.5, df:5,
    concs:[{l:"200mg in 50mL (4000 mcg/mL)",v:4000},{l:"400mg in 50mL (8000 mcg/mL)",v:8000}],
    ind:"Cardiogenic shock", w:"Tachyarrhythmias at high doses. Less preferred than noradrenaline in sepsis.",
    tips:["1–5: dopaminergic (renal/mesenteric)","5–10: beta-1 (inotropy/chronotropy)",">10: alpha-1 (vasoconstriction)"] },
  { n:"Dobutamine", i:"💓", col:"#ec4899", u:"mcg/kg/min", mn:2, mx:20, st:0.5, df:5,
    concs:[{l:"250mg in 50mL (5000 mcg/mL)",v:5000},{l:"500mg in 250mL (2000 mcg/mL)",v:2000}],
    ind:"Low cardiac output, acute decompensated heart failure", w:"Increases HR and myocardial O₂ demand. Avoid in hypovolaemia.",
    tips:["Pure inotrope — minimal effect on SVR","Combine with noradrenaline for mixed shock","Tolerance develops after 72 hrs"] },
  { n:"Propofol TIVA", i:"💉", col:"#0ea5e9", u:"mg/kg/hr", mn:4, mx:12, st:0.5, df:6,
    concs:[{l:"200mg in 20mL neat (10 mg/mL)",v:10},{l:"500mg in 50mL (10 mg/mL)",v:10}],
    ind:"TIVA maintenance, ICU sedation (1–4 mg/kg/hr)", w:"Propofol Infusion Syndrome >4mg/kg/hr >48h. Monitor triglycerides.",
    tips:["ICU sedation: 0.3–4 mg/kg/hr","TIVA: 4–12 mg/kg/hr","Always co-run analgesic (opioid)"] },
  { n:"Remifentanil", i:"🔬", col:"#a78bfa", u:"mcg/kg/min", mn:0.05, mx:2, st:0.05, df:0.1,
    concs:[{l:"2mg in 40mL (50 mcg/mL)",v:50},{l:"5mg in 50mL (100 mcg/mL)",v:100}],
    ind:"TIVA adjunct, awake craniotomy, labour analgesia", w:"Ultra-short acting — NO post-op analgesia. Plan multimodal pain management before emergence.",
    tips:["Offset 3–5 min regardless of duration","Induction: 0.5–1 mcg/kg/min","Maintenance: 0.05–0.5 mcg/kg/min"] },
  { n:"Dexmedetomidine", i:"🌙", col:"#10b981", u:"mcg/kg/hr", mn:0.2, mx:1.5, st:0.1, df:0.5,
    concs:[{l:"200mcg in 50mL (4 mcg/mL)",v:4},{l:"400mcg in 100mL (4 mcg/mL)",v:4}],
    ind:"ICU sedation, awake FOI, procedural sedation", w:"Bradycardia & hypotension common. Preserves respiratory drive.",
    tips:["Load: 1 mcg/kg over 10 min (optional)","Ramsay 2–3 target for most patients","Excellent for awake procedures"] },
  { n:"Morphine", i:"🩹", col:"#f59e0b", u:"mg/kg/hr", mn:0.01, mx:0.1, st:0.005, df:0.02,
    concs:[{l:"50mg in 50mL (1 mg/mL)",v:1},{l:"100mg in 100mL (1 mg/mL)",v:1}],
    ind:"Post-op analgesia infusion, ICU analgesia", w:"Respiratory depression. Accumulates in renal failure (M6G active metabolite).",
    tips:["Start low, titrate every 15–30 min","Naloxone 0.4mg ready for reversal","Avoid in renal failure — use fentanyl"] },
  { n:"Fentanyl", i:"🩺", col:"#6366f1", u:"mcg/kg/hr", mn:0.5, mx:5, st:0.1, df:1,
    concs:[{l:"500mcg in 50mL (10 mcg/mL)",v:10},{l:"1000mcg in 100mL (10 mcg/mL)",v:10}],
    ind:"ICU sedoanalgesia, TIVA adjunct, ventilated patients", w:"Context-sensitive half-time increases significantly with prolonged infusion.",
    tips:["Preferred over morphine in renal failure","No active metabolites","Consider switch to oral morphine at extubation"] },
  { n:"Insulin (Actrapid)", i:"🧪", col:"#22c55e", u:"units/hr", mn:1, mx:10, st:0.5, df:2, fx:true,
    concs:[{l:"50 units in 50mL NS (1 unit/mL)",v:1},{l:"100 units in 100mL NS (1 unit/mL)",v:1}],
    ind:"Perioperative glucose control, DKA, ICU hyperglycaemia", w:"Monitor BGL every 1–2 hours. Target glucose 6–10 mmol/L (NICE-SUGAR).",
    tips:["Always co-run glucose infusion if NBM","Sliding scale vs fixed — follow local protocol","Hypoglycaemia risk — have 50% dextrose available"] },
  { n:"Oxytocin", i:"🤱", col:"#f9a8d4", u:"units/hr", mn:0.5, mx:40, st:0.5, df:5, fx:true,
    concs:[{l:"10 units in 500mL (0.02 u/mL)",v:0.02},{l:"40 units in 500mL (0.08 u/mL)",v:0.08},{l:"20 units in 50mL Syntometrine",v:0.4}],
    ind:"PPH prophylaxis, augmentation of labour, uterine atony", w:"Hypotension with rapid IV bolus — use slow infusion always. ADH-like hyponatraemia with excess fluid.",
    tips:["CS prophylaxis: 5u slow IV + 40u/500mL over 4 hrs","PPH treatment: 20–40 units/hr","Carboprost for oxytocin-refractory PPH"] },
];

const calcRate = (drug, dose, wt, conc) => {
  if (!dose || !conc) return null;
  const w = drug.fx ? 1 : (parseFloat(wt) || 70);
  if (drug.u === "mcg/kg/min") return (dose * w * 60) / conc;
  if (drug.u.includes("/hr")) return (dose * w) / conc;
  return null;
};

function InfusionModule() {
  const [sel, setSel] = useState(0);
  const [wt, setWt] = useState("70");
  const [dose, setDose] = useState(INFUSION_DRUGS[0].df);
  const [ci, setCi] = useState(0);
  const [tab, setTab] = useState("fwd");
  const [rv, setRv] = useState("");
  const [showList, setShowList] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const color = T.c2;
  const drug = INFUSION_DRUGS[sel];
  const conc = drug.concs[ci]?.v;
  const rate = calcRate(drug, dose, wt, conc);
  const rvDose = (() => {
    const r = parseFloat(rv), w = drug.fx ? 1 : (parseFloat(wt) || 70);
    if (!r || !conc) return null;
    if (drug.u === "mcg/kg/min") return (r * conc) / (w * 60);
    if (drug.u.includes("/hr")) return (r * conc) / w;
    return null;
  })();
  const pick = i => { setSel(i); setDose(INFUSION_DRUGS[i].df); setCi(0); setRv(""); setShowList(false); };

  return (
    <div className="fade">
      {/* Drug Picker */}
      <button onClick={() => setShowList(!showList)} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", marginBottom:10, padding:"11px 14px", borderRadius:12, border:`1.5px solid ${color}40`, background:`${color}08`, cursor:"pointer", fontSize:13, fontWeight:700, color }}>
        <span style={{ fontSize:20 }}>{drug.i}</span>
        <span style={{ flex:1, textAlign:"left" }}>{drug.n}</span>
        <span style={{ fontSize:11, color:T.muted }}>{showList ? "▲ close" : "▼ change drug"}</span>
      </button>
      {showList && (
        <Card style={{ marginBottom:14, padding:8 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:4 }}>
            {INFUSION_DRUGS.map((d, i) => (
              <button key={d.n} onClick={() => pick(i)} style={{
                display:"flex", alignItems:"center", gap:7, padding:"8px 10px", borderRadius:10, border:"none",
                cursor:"pointer", textAlign:"left", transition:"all 0.15s",
                background: sel===i ? `${d.col}15` : "transparent",
                borderLeft: sel===i ? `3px solid ${d.col}` : "3px solid transparent",
              }}>
                <span style={{ fontSize:14 }}>{d.i}</span>
                <span style={{ fontSize:11, fontWeight:700, color: sel===i ? d.col : T.sub }}>{d.n}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Drug Header */}
      <Card color={drug.col} style={{ marginBottom:12 }}>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:T.text }}>{drug.i} {drug.n}</div>
              <div style={{ fontSize:11, color:T.sub, marginTop:3 }}>{drug.ind}</div>
              <div style={{ marginTop:8 }}><Chip color={drug.col}>{drug.mn}–{drug.mx} {drug.u}</Chip></div>
            </div>
            <button onClick={() => setShowTips(!showTips)} style={{ padding:"5px 10px", borderRadius:8, border:`1px solid ${T.border}`, background:"#fff", fontSize:11, color:T.sub, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              {showTips ? "▲ tips" : "▼ tips"}
            </button>
          </div>
          {showTips && (
            <div style={{ marginTop:10, borderTop:`1px solid ${T.border}`, paddingTop:10 }}>
              {drug.tips.map((tip, i) => (
                <div key={i} style={{ fontSize:11, color:T.sub, lineHeight:1.7 }}>› {tip}</div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Mode tabs */}
      <div style={{ display:"flex", gap:0, marginBottom:14, background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:12, padding:4, overflow:"hidden" }}>
        {[["fwd","⟶  Dose  →  Rate (mL/hr)"],["rev","⟵  Rate  →  Dose"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:"8px", border:"none", cursor:"pointer", borderRadius:9, fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif",
            background: tab===k ? drug.col : "transparent",
            color: tab===k ? "#fff" : T.sub, transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>

      <Card style={{ padding:16, marginBottom:12 }}>
        <div style={{ display:"grid", gridTemplateColumns: !drug.fx ? "1fr 1fr" : "1fr", gap:12 }}>
          {!drug.fx && (
            <div>
              <div style={{ fontSize:10, color:T.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6, fontWeight:700 }}>Patient Weight</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input type="number" value={wt} onChange={e => setWt(e.target.value)}
                  style={{ width:80, padding:"8px 10px", background:T.faint, border:`1.5px solid ${T.border}`, borderRadius:10, color:color, fontSize:22, fontWeight:800, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
                <span style={{ color:T.sub, fontSize:13, fontWeight:700 }}>kg</span>
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize:10, color:T.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6, fontWeight:700 }}>Concentration</div>
            {drug.concs.map((c, i) => (
              <label key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:9, cursor:"pointer", marginBottom:4,
                background: ci===i ? `${drug.col}12` : T.faint, border:`1.5px solid ${ci===i ? drug.col+"50" : T.border}` }}>
                <input type="radio" checked={ci===i} onChange={() => setCi(i)} style={{ accentColor:drug.col }} />
                <span style={{ fontSize:11, color: ci===i ? drug.col : T.sub, fontWeight:600 }}>{c.l}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop:12 }}>
          {tab === "fwd" ? (
            <div>
              <div style={{ fontSize:10, color:T.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6, fontWeight:700 }}>Dose ({drug.u})</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <input type="number" value={dose} step={drug.st} min={drug.mn} max={drug.mx}
                  onChange={e => setDose(parseFloat(e.target.value))}
                  style={{ width:110, padding:"8px 10px", background:T.faint, border:`1.5px solid ${T.border}`, borderRadius:10, color:drug.col, fontSize:22, fontWeight:800, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
                <span style={{ fontSize:12, color:T.sub, fontWeight:600 }}>{drug.u}</span>
              </div>
              <input type="range" min={drug.mn} max={drug.mx} step={drug.st} value={dose}
                onChange={e => setDose(parseFloat(e.target.value))}
                style={{ width:"100%", marginTop:10, accentColor:drug.col, cursor:"pointer", background:`${drug.col}30` }} />
            </div>
          ) : (
            <div>
              <div style={{ fontSize:10, color:T.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6, fontWeight:700 }}>Infusion Rate (mL/hr)</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <input type="number" value={rv} placeholder="e.g. 5.0" onChange={e => setRv(e.target.value)}
                  style={{ width:110, padding:"8px 10px", background:T.faint, border:`1.5px solid ${T.border}`, borderRadius:10, color:color, fontSize:22, fontWeight:800, outline:"none", fontFamily:"'JetBrains Mono',monospace" }} />
                <span style={{ fontSize:12, color:T.sub, fontWeight:600 }}>mL/hr</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Result */}
      <Card color={drug.col} style={{ background:`linear-gradient(135deg,${drug.col}12,${drug.col}05)`, textAlign:"center", padding:"22px 18px" }}>
        <div style={{ fontSize:10, color:T.muted, letterSpacing:3, textTransform:"uppercase", marginBottom:12, fontWeight:700 }}>
          {tab==="fwd" ? "▸ PUMP RATE" : "▸ DOSE AT THIS RATE"}
        </div>
        {tab === "fwd" ? (
          rate !== null && !isNaN(rate) ? (
            <>
              <div style={{ fontSize:56, fontWeight:900, color:drug.col, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>{rate.toFixed(2)}</div>
              <div style={{ fontSize:14, color:T.sub, marginTop:4, fontWeight:700 }}>mL / hr</div>
              <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap", marginTop:16 }}>
                {[1,2,4,8,12].map(h => (
                  <div key={h} style={{ background:"#fff", border:`1.5px solid ${T.border}`, borderRadius:10, padding:"7px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:15, fontWeight:800, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>{(rate*h).toFixed(1)}</div>
                    <div style={{ fontSize:9, color:T.muted, fontWeight:600 }}>mL in {h}h</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, fontSize:11, color:T.muted }}>
                Formula: {drug.fx ? `${dose} units/hr ÷ ${conc}` : `${dose} × ${wt}kg${drug.u.includes("min") ? " × 60" : ""} ÷ ${conc}`} = {rate.toFixed(2)} mL/hr
              </div>
            </>
          ) : <div style={{ color:T.muted, fontSize:14, fontWeight:600 }}>Enter dose and concentration above</div>
        ) : (
          rvDose !== null && !isNaN(rvDose) ? (
            <>
              <div style={{ fontSize:48, fontWeight:900, color:drug.col, fontFamily:"'JetBrains Mono',monospace" }}>{rvDose.toFixed(4)}</div>
              <div style={{ fontSize:14, color:T.sub, marginTop:4, fontWeight:700 }}>{drug.u}</div>
            </>
          ) : <div style={{ color:T.muted, fontSize:14, fontWeight:600 }}>Enter infusion rate above</div>
        )}
      </Card>
      <WarnBox text={drug.w} color={drug.col} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  MODULE 3 — PRE-OP RISK SCORES                              */
/* ──────────────────────────────────────────────────────────── */
const SCORES = [
  { id:"asa", n:"ASA Classification", i:"🏥", col:T.c3, type:"cls",
    desc:"ASA Physical Status — overall patient fitness for anaesthesia and surgery.",
    note:"Add 'E' for emergency surgery (e.g. ASA III-E). Emergency surgery approximately doubles mortality risk at each class.",
    cls:[
      {g:"I",  l:"Normal healthy patient",              col:"#22c55e",risk:"Minimal", mort:"<0.1%",  d:"No organic, physiological, biochemical or psychiatric disturbance."},
      {g:"II", l:"Mild systemic disease",               col:"#84cc16",risk:"Low",     mort:"0.1–0.4%",d:"Well-controlled DM/HTN, obesity BMI 30–40, mild COPD, social smoker, pregnancy."},
      {g:"III",l:"Severe systemic disease",             col:"#eab308",risk:"Moderate",mort:"1.8–4.3%",d:"Poorly controlled DM/HTN, morbid obesity BMI>40, COPD, active hepatitis, ESRD on dialysis, MI/CVA >3 months."},
      {g:"IV", l:"Severe disease — constant threat to life", col:"#f97316",risk:"High",mort:"7.8–23%",d:"Recent MI/CVA (<3 months), severe valve dysfunction, sepsis, DIC, ARD."},
      {g:"V",  l:"Moribund — not expected to survive",  col:"#ef4444",risk:"Very High",mort:"9.4–51%",d:"Ruptured AAA, massive trauma, intracranial bleed with mass effect. Surgery as last resort."},
      {g:"VI", l:"Brain-dead donor",                    col:"#94a3b8",risk:"N/A",     mort:"N/A",    d:"Declared brain-dead. Organs being removed for donation."},
    ]},
  { id:"rcri", n:"RCRI (Lee Score)", i:"❤️", col:"#ef4444", type:"calc", ms:6,
    desc:"Revised Cardiac Risk Index — estimates risk of Major Adverse Cardiac Events (MACE) in non-cardiac surgery.",
    items:[
      {id:"hrf",l:"High-risk surgery",                  d:"Intraperitoneal, intrathoracic, or suprainguinal vascular"},
      {id:"ihd",l:"Ischemic Heart Disease",              d:"Hx MI, positive stress test, angina, nitrate use, Q waves on ECG"},
      {id:"chf",l:"Congestive Heart Failure",            d:"Hx CHF, pulmonary oedema, bilateral crackles, S3 gallop"},
      {id:"cvd",l:"Cerebrovascular Disease",             d:"History of TIA or stroke"},
      {id:"dm", l:"Diabetes on Insulin",                 d:"Preoperative insulin therapy"},
      {id:"cr", l:"Creatinine > 177 µmol/L (2.0 mg/dL)",d:"Serum creatinine elevated preoperatively"},
    ],
    interp:s => {
      if(s===0)return{l:"Class I — Very Low",r:"0.4% MACE",col:"#22c55e",a:"Proceed. No further cardiac workup needed."};
      if(s===1)return{l:"Class II — Low",r:"0.9% MACE",col:"#84cc16",a:"Proceed. Non-invasive testing only if result changes management."};
      if(s===2)return{l:"Class III — Moderate",r:"6.6% MACE",col:"#eab308",a:"Cardiology review recommended. Consider non-invasive cardiac testing."};
      return{l:"Class IV — High",r:">11% MACE",col:"#ef4444",a:"Mandatory cardiology review. Optimize medically before elective surgery."};
    }},
  { id:"apfel", n:"Apfel PONV Score", i:"🤢", col:"#10b981", type:"calc", ms:4,
    desc:"Predicts risk of Post-Operative Nausea & Vomiting — guides prophylactic antiemetic therapy.",
    items:[
      {id:"f", l:"Female gender",                d:"Strongest single predictor of PONV"},
      {id:"ns",l:"Non-smoker",                   d:"Smoking appears protective against PONV"},
      {id:"hx",l:"History of PONV / motion sickness",d:"Personal history of either"},
      {id:"op",l:"Postoperative opioid use expected",d:"Planned opioid analgesia post-operatively"},
    ],
    interp:s => {
      const rs=["10%","21%","39%","61%","79%"],r=rs[Math.min(s,4)];
      if(s<=1)return{l:"Low Risk PONV",r,col:"#22c55e",a:"No routine prophylaxis needed. Minimize opioids. Consider TIVA."};
      if(s===2)return{l:"Moderate Risk PONV",r,col:"#eab308",a:"1 antiemetic: ondansetron (end of surgery) OR dexamethasone (induction). Consider TIVA."};
      return{l:"High Risk PONV",r,col:"#ef4444",a:"Multimodal prophylaxis: ondansetron + dexamethasone ± scopolamine patch. TIVA strongly preferred. Avoid N₂O."};
    }},
  { id:"stopbang", n:"STOP-BANG (OSA)", i:"😴", col:"#8b5cf6", type:"calc", ms:8,
    desc:"Screens for Obstructive Sleep Apnoea — critical for airway planning and post-op monitoring decisions.",
    items:[
      {id:"s",l:"S — Snoring loudly",          d:"Louder than talking or heard through closed doors"},
      {id:"t",l:"T — Tired / sleepy daytime",  d:"Often feels fatigued or sleepy during the daytime"},
      {id:"o",l:"O — Observed apneas",         d:"Anyone observed patient stopping breathing or gasping during sleep"},
      {id:"p",l:"P — Pressure (HTN)",          d:"Has or being treated for high blood pressure"},
      {id:"b",l:"B — BMI > 35 kg/m²",          d:"Body mass index greater than 35"},
      {id:"a",l:"A — Age > 50 years",          d:"Patient older than 50 years"},
      {id:"n",l:"N — Neck circumference > 40cm",d:"Neck circumference greater than 40 cm"},
      {id:"g",l:"G — Gender: Male",            d:"Patient is male"},
    ],
    interp:s => {
      if(s<=2)return{l:"Low Risk OSA",r:"Low",col:"#22c55e",a:"Standard anaesthesia care. Routine post-op monitoring."};
      if(s<=4)return{l:"Intermediate Risk OSA",r:"Intermediate",col:"#eab308",a:"Consider sleep study. Use CPAP if diagnosed. Cautious opioid use. PACU monitoring extended."};
      return{l:"High Risk OSA",r:"High",col:"#ef4444",a:"High suspicion moderate-severe OSA. HDU/ICU post-op. Minimize opioids/sedatives. All airway equipment ready."};
    }},
  { id:"mall", n:"Mallampati Score", i:"👄", col:"#f97316", type:"cls",
    desc:"Predicts ease of laryngoscopy and intubation based on oropharyngeal visibility.",
    note:"Assess with patient seated, head in neutral position, mouth FULLY open, tongue protruded, and NO phonation.",
    cls:[
      {g:"I",  l:"Soft palate, uvula, fauces, tonsillar pillars all visible",col:"#22c55e",risk:"Easy",      mort:"CL I",    d:"Full oropharyngeal visibility. Straightforward direct laryngoscopy expected."},
      {g:"II", l:"Soft palate, uvula, fauces visible (no pillars)",          col:"#84cc16",risk:"Relatively easy",mort:"CL I–II",d:"Upper portion of tonsils visible. Usually straightforward. Success with DL likely."},
      {g:"III",l:"Only soft palate and base of uvula visible",               col:"#f97316",risk:"Difficult",  mort:"CL III", d:"Only base of uvula seen. Associated with difficult laryngoscopy. Have VL ready."},
      {g:"IV", l:"Only hard palate visible — soft palate not seen",          col:"#ef4444",risk:"Very difficult",mort:"CL III–IV",d:"No soft palate visibility. High failure risk with DL. Plan awake FOI or video laryngoscopy."},
    ]},
];

function PreopModule() {
  const [aid, setAid] = useState("asa");
  const [chk, setChk] = useState({});
  const [ocl, setOcl] = useState(null);
  const color = T.c3;
  const sc = SCORES.find(s => s.id === aid);
  const tot = sc.type==="calc" ? sc.items.reduce((a,it) => a+(chk[it.id]?1:0), 0) : 0;
  const res = sc.type==="calc" ? sc.interp(tot) : null;
  const reset = () => { setChk({}); setOcl(null); };

  return (
    <div className="fade">
      {/* Score tabs */}
      <div style={{ display:"flex", gap:5, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
        {SCORES.map(s => (
          <button key={s.id} onClick={() => { setAid(s.id); reset(); }} style={{
            display:"flex", alignItems:"center", gap:5, padding:"7px 12px", borderRadius:20, border:"none",
            cursor:"pointer", whiteSpace:"nowrap", fontSize:12, fontWeight:700,
            background: aid===s.id ? s.col : "#fff",
            color: aid===s.id ? "#fff" : T.sub,
            boxShadow: aid===s.id ? `0 4px 12px ${s.col}40` : "0 1px 3px rgba(0,0,0,0.08)",
            transition:"all 0.2s",
          }}>{s.i} {s.n}</button>
        ))}
      </div>

      {/* Header card */}
      <Card color={sc.col} style={{ marginBottom:12 }}>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ fontSize:17, fontWeight:900, color:T.text }}>{sc.i} {sc.n}</div>
          <div style={{ fontSize:11, color:T.sub, marginTop:3, lineHeight:1.6 }}>{sc.desc}</div>
          {sc.note && <div style={{ marginTop:8, background:`${sc.col}12`, border:`1px solid ${sc.col}30`, borderRadius:8, padding:"7px 10px", fontSize:11, color:T.sub }}>ℹ️ {sc.note}</div>}
        </div>
      </Card>

      {sc.type === "cls" ? (
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {sc.cls.map(cl => (
            <Card key={cl.g} onClick={() => setOcl(ocl===cl.g ? null : cl.g)}
              style={{ background: ocl===cl.g ? `${cl.col}08` : "#fff", transition:"all 0.2s" }} color={ocl===cl.g ? cl.col : null}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px" }}>
                <div style={{ width:36, height:36, borderRadius:9, background:`${cl.col}20`, border:`2px solid ${cl.col}60`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:cl.col, flexShrink:0 }}>{cl.g}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{cl.l}</div>
                  <div style={{ display:"flex", gap:6, marginTop:3 }}>
                    <Chip color={cl.col}>{cl.risk}</Chip>
                    <Chip color={T.muted} bg="#f1f5f9">{cl.mort}</Chip>
                  </div>
                </div>
                <div style={{ fontSize:13, color:T.muted, transform:ocl===cl.g?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</div>
              </div>
              {ocl===cl.g && <div style={{ padding:"0 16px 12px 64px", fontSize:11, color:T.sub, lineHeight:1.7 }} className="fade">{cl.d}</div>}
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {sc.items.map(it => (
            <CheckItem key={it.id} label={it.l} sub={it.d} checked={!!chk[it.id]}
              onToggle={() => setChk(p => ({...p,[it.id]:!p[it.id]}))} color={sc.col} />
          ))}
          {res && (
            <Card color={res.col} style={{ marginTop:8 }}>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:900, color:T.text }}>{res.l}</div>
                    <div style={{ fontSize:12, color:T.sub }}>Estimated risk: <strong style={{ color:res.col }}>{res.r}</strong></div>
                  </div>
                  <div style={{ width:50, height:50, borderRadius:"50%", border:`3px solid ${res.col}`,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    background:`${res.col}12`, flexShrink:0 }}>
                    <span style={{ fontSize:18, fontWeight:900, color:res.col, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>{tot}</span>
                    <span style={{ fontSize:8, color:T.muted, fontWeight:700 }}>/{sc.ms}</span>
                  </div>
                </div>
                <ProgressBar value={tot} max={sc.ms} color={res.col} height={6} />
                <div style={{ marginTop:10, fontSize:12, color:T.sub, borderLeft:`3px solid ${res.col}`, paddingLeft:10, lineHeight:1.7 }}>{res.a}</div>
                <button onClick={reset} style={{ marginTop:10, padding:"5px 14px", borderRadius:8, background:"#fff", border:`1.5px solid ${T.border}`, color:T.sub, fontSize:11, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>↺ Reset</button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  MODULE 4 — AIRWAY GUIDE                                     */
/* ──────────────────────────────────────────────────────────── */
const LEMON_DATA = [
  { l:"L", t:"Look Externally", col:"#ef4444", items:["Small mouth, large tongue, receding chin (micrognathia)","Short/thick neck, obesity BMI>35, facial trauma or burns","Previous neck surgery, halo/collar, neck masses or haematoma","Inter-incisor distance <3 cm (2 finger breadths) = reduced mouth opening"] },
  { l:"E", t:"Evaluate 3-3-2 Rule", col:"#f97316", items:["3 fingers: inter-incisor distance (adequate mouth opening)","3 fingers: hyoid-to-mental distance (submandibular space adequacy)","2 fingers: hyoid-to-thyroid notch (adequate neck length)","Any criterion not met = predicted difficult laryngoscopy"] },
  { l:"M", t:"Mallampati Class", col:"#f59e0b", items:["Class I–II: Easy/straightforward — proceed with standard approach","Class III: Likely difficult — prepare video laryngoscope","Class IV: Very difficult — strongly consider awake FOI","Assess seated, mouth open, tongue out, NO phonation"] },
  { l:"O", t:"Obstruction / Obesity", col:"#10b981", items:["Is there any pathology obstructing the airway (tumour, abscess, haematoma)?","BMI >35: high aspiration risk, difficult BVM, rapid desaturation","Stridor or voice change = partial obstruction = URGENT senior review","Pre-oxygenation with head-up position essential"] },
  { l:"N", t:"Neck Mobility", col:"#0ea5e9", items:["Can patient fully extend neck? (atlanto-occipital joint)","Cervical spine injury/instability: manual in-line stabilisation (MILS)","Rheumatoid arthritis: atlanto-axial subluxation risk","Limited extension + high Mallampati = very high difficult intubation risk"] },
];
const RSI_DATA = [
  { l:"PREPARATION (10 min before)", col:"#0ea5e9", items:["IV access × 2 confirmed and patent","Monitoring connected: SpO₂, NIBP, ECG, EtCO₂","Patient positioned: 20–30° head-up, ramped if obese","Pre-oxygenate: 100% O₂ × 3–5 min (target EtO₂ >85%)","Suction (Yankauer) switched ON and within reach","Sellick manoeuvre operator identified, trained and briefed"] },
  { l:"EQUIPMENT CHECK", col:"#f59e0b", items:["Direct laryngoscope: tested, bright light, Mac 3 & 4 blades ready","Video laryngoscope: charged, blade attached, screen visible","ETT: planned size + one size smaller prepared, 10mL syringe ready","Bougie (Eschmann) unwrapped, lubricated, 60cm within reach","Supraglottic airway (i-gel/LMA) — correct size checked","Surgical airway kit: scalpel + bougie + 6.0 cuffed ETT","Capnography waveform confirmed functional"] },
  { l:"DRUGS DRAWN, LABELLED & CHECKED", col:"#10b981", items:["Induction agent drawn and labelled (propofol / ketamine / thiopentone)","NMB drawn: succinylcholine 1.5–2mg/kg OR rocuronium 1.2mg/kg","Vasopressor drawn: ephedrine 6–12mg aliquots OR metaraminol","Atropine drawn (essential for paediatric cases)","Sugammadex available if rocuronium used for RSI","Naloxone available if high-dose opioids planned"] },
  { l:"INDUCTION SEQUENCE", col:"#ef4444", items:["Communicate plan clearly: primary → backup → rescue → CICO","Inject induction agent IV — wait until loss of consciousness confirmed","Inject NMB — do NOT bag-mask ventilate (strict RSI)","Apply sustained cricoid pressure if indicated (controversial — discuss with team)","At 60 sec (sux) or 60–75 sec (roc 1.2mg/kg): laryngoscope","Intubate — confirm EtCO₂ waveform × 6 breaths minimum","Inflate cuff, secure tube, note and document CL grade (I–IV)"] },
];
const ALGO_DATA = [
  { id:1, t:"Pre-oxygenate & Optimise", col:"#0ea5e9", d:"100% O₂ × 3–5 min. NODESAT: nasal cannula 15 L/min during all laryngoscopy attempts. Head-up/ramped position. Consider apnoeic oxygenation.", q:null },
  { id:2, t:"1st Laryngoscopy Attempt", col:"#22c55e", d:"Use DL or VL (prefer VL if any predicted difficulty). External laryngeal manipulation (BURP). Optimal blade size and type. Bougie-assisted if view poor.", q:"Successful intubation?", yes:"✅ EtCO₂ waveform confirmed × 6 breaths. Inflate cuff, secure tube, document CL grade.", no:"→ Optimise and attempt 2nd laryngoscopy" },
  { id:3, t:"2nd & 3rd Attempt — Optimised", col:"#f59e0b", d:"Switch device if used DL → VL. Try different blade type/size. Bougie-assisted technique. Limit to maximum 3 laryngoscopy attempts total to preserve 'can't intubate' option.", q:"Successful on 2nd/3rd attempt?", yes:"✅ EtCO₂ confirmed. Secure tube. Document. Review with team.", no:"→ DECLARE Difficult Airway. Call for help NOW." },
  { id:4, t:"DECLARE Difficult Airway — Call Help", col:"#f97316", d:"Clearly state: 'This is a difficult airway.' Call senior anaesthetist + ENT/surgeon to bedside. For elective cases: consider waking patient. Maintain oxygenation at all times.", q:"Can you oxygenate (BVM / LMA / i-gel)?", yes:"→ Rescue oxygenation via SGAD (Step 5)", no:"⚠️ CICO situation — proceed to Step 6 immediately" },
  { id:5, t:"Rescue Oxygenation via SGAD", col:"#10b981", d:"Insert supraglottic airway: i-gel (first choice) or LMA. Ventilate and confirm chest rise + EtCO₂. Consider: fibreoptic intubation through SGAD, or plan to wake patient for elective cases.", q:null },
  { id:6, t:"⚠️ CICO — Front of Neck Access", col:"#ef4444", d:"CANNOT INTUBATE, CANNOT OXYGENATE — LIFE-THREATENING EMERGENCY.\n\nScalpel cricothyroidotomy (adults): Identify CTM (horizontal depression between thyroid and cricoid cartilages). Extend neck. Laryngeal handshake to stabilise. Horizontal stab incision through skin and CTM. Insert bougie at 45° caudal. Railroad 6.0mm cuffed ETT. Inflate cuff. Confirm EtCO₂.", q:null, em:true },
];
const EQUIP_DATA = [
  { cat:"Supraglottic Airways (SGAD)", col:"#10b981", items:[
    {n:"LMA Classic",d:"Reusable. Size 3 (30–50kg) cuff 20mL, 4 (50–70kg) 30mL, 5 (70–100kg) 40mL. First-line rescue airway."},
    {n:"i-gel",d:"No cuff inflation. Sizes 3/4/5. Gastric drainage channel. Easier insertion. Good for rescue."},
    {n:"LMA ProSeal / Supreme",d:"Gastric drain port. Sealed — suitable for positive pressure ventilation. Higher seal pressure."},
    {n:"LMA Fastrach (Intubating LMA)",d:"Allows ETT railroading. Size 3/4/5. Use 7.5mm cuffed ETT. Flexible rubber tube for blind or FOI-guided."},
  ]},
  { cat:"Laryngoscopes", col:"#0ea5e9", items:[
    {n:"Macintosh (DL)",d:"Standard curved blade. Size 3 (average adult), 4 (large adult). Tip in vallecula to lift epiglottis indirectly."},
    {n:"Miller Blade (DL)",d:"Straight blade — lifts epiglottis directly. Better in anterior airways, infants, and limited neck extension."},
    {n:"C-MAC / McGrath (VL)",d:"Standard or D-blade. Video-assisted — better view, fewer cervical movements. First-line in difficult airway."},
    {n:"GlideScope (VL)",d:"Hyperangulated 60° blade. Excellent view in most cases. Must use rigid stylet — cannot railroad with soft."},
  ]},
  { cat:"Tracheal Tubes", col:"#f59e0b", items:[
    {n:"Standard Cuffed ETT",d:"Adult ♀: 7.0–7.5mm, ♂: 8.0–9.0mm. Insertion depth: height(cm)/10 + 5cm (approx) or ~21cm ♀, ~23cm ♂."},
    {n:"Reinforced (Armoured) ETT",d:"Kink-resistant wire-reinforced. Head/neck surgery, prone positioning, lateral thoracotomy cases."},
    {n:"RAE Tube (N or S)",d:"Pre-formed bend. North-facing: oral/facial surgery. South-facing: nasal/cleft palate surgery."},
    {n:"Double Lumen Tube (DLT)",d:"Left DLT: ♀ 35Fr, ♂ 37–39Fr. Confirm position with fibreoptic bronchoscope. One-lung ventilation for thoracic surgery."},
  ]},
  { cat:"Adjuncts & Rescue Devices", col:"#ef4444", items:[
    {n:"Bougie (Eschmann Introducer)",d:"60cm semi-rigid guide. Confirms tracheal placement by clicking over tracheal rings. Railroad 6.0+ ETT over it."},
    {n:"Flexible Fibreoptic Bronchoscope",d:"Gold standard for awake intubation. Topicalise airway first. Use with Ovassapian or Williams oral airway."},
    {n:"Cricothyroidotomy Kit",d:"Scalpel (no.22) + bougie + 6.0mm cuffed ETT. CTM landmark: between thyroid and cricoid cartilages."},
    {n:"Nasopharyngeal Airway (NPA)",d:"Better tolerated than OPA in semi-conscious patients. Size = diameter of little finger. Always lubricate well."},
  ]},
];

function AirwayModule() {
  const [sec, setSec] = useState("lemon");
  const [op, setOp] = useState({});
  const [chk, setChk] = useState({});
  const [st, setSt] = useState(null);
  const color = T.c4;
  const tog = k => setOp(p => ({...p,[k]:!p[k]}));

  return (
    <div className="fade">
      <div style={{ display:"flex", gap:5, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
        {[{id:"lemon",l:"LEMON / RODS",i:"🔍"},{id:"rsi",l:"RSI Checklist",i:"⚡"},{id:"algo",l:"DA Algorithm",i:"🗺️"},{id:"equip",l:"Equipment",i:"🧰"}].map(s => (
          <button key={s.id} onClick={() => setSec(s.id)} style={{
            display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:20, border:"none",
            cursor:"pointer", whiteSpace:"nowrap", fontSize:12, fontWeight:700,
            background: sec===s.id ? color : "#fff",
            color: sec===s.id ? "#fff" : T.sub,
            boxShadow: sec===s.id ? `0 4px 12px ${color}40` : "0 1px 3px rgba(0,0,0,0.08)",
            transition:"all 0.2s",
          }}>{s.i} {s.l}</button>
        ))}
      </div>

      {sec==="lemon" && (
        <div className="fade">
          <Card color={color} style={{ marginBottom:12 }}>
            <SectionHeader icon="🔍" title="LEMON Airway Assessment" color={color} sub="Systematic pre-intubation assessment — complete before every intubation" />
          </Card>
          {LEMON_DATA.map(it => (
            <Card key={it.l} style={{ marginBottom:8, transition:"all 0.2s" }} color={op[it.l] ? it.col : null}
              onClick={() => tog(it.l)}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 15px" }}>
                <div style={{ width:36, height:36, borderRadius:9, background:`${it.col}20`, border:`2px solid ${it.col}60`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:it.col, flexShrink:0 }}>{it.l}</div>
                <div style={{ fontSize:13, fontWeight:800, color:T.text, flex:1 }}>{it.t}</div>
                <div style={{ fontSize:13, color:T.muted, transform:op[it.l]?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</div>
              </div>
              {op[it.l] && (
                <div style={{ padding:"0 15px 12px 63px" }} className="fade">
                  {it.items.map((d,i) => <div key={i} style={{ fontSize:11, color:T.sub, lineHeight:1.8, padding:"1px 0" }}>• {d}</div>)}
                </div>
              )}
            </Card>
          ))}
          <Card style={{ marginTop:4 }}>
            <SectionHeader icon="😷" title="RODS — Difficult BVM Prediction" color="#f59e0b" />
            <div style={{ padding:"12px 16px" }}>
              {[["R","Restricted mouth opening (<3 fingers)","#ef4444"],["O","Obstruction / Obesity (BMI>26 predictive)","#f97316"],["D","Dentition — edentulous patients (poor mask seal)","#f59e0b"],["S","Stiff lungs or Snoring / OSA","#10b981"]].map(([l,t,c]) => (
                <div key={l} style={{ display:"flex", gap:10, marginBottom:7, alignItems:"flex-start" }}>
                  <div style={{ width:24, height:24, borderRadius:6, background:`${c}20`, border:`2px solid ${c}60`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:c, flexShrink:0 }}>{l}</div>
                  <span style={{ fontSize:12, color:T.sub, lineHeight:1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {sec==="rsi" && (
        <div className="fade">
          <Card color={color} style={{ marginBottom:12 }}>
            <SectionHeader icon="⚡" title="RSI Checklist — Complete ALL steps" color={color} sub="Rapid Sequence Induction: systematic verification before induction" />
          </Card>
          {RSI_DATA.map((ph, pi) => {
            const done = ph.items.filter((_,ii) => chk[`${pi}-${ii}`]).length;
            return (
              <Card key={pi} style={{ marginBottom:10 }}>
                <div style={{ padding:"12px 16px 0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <Chip color={ph.col}>{ph.l}</Chip>
                    <span style={{ fontSize:11, color: done===ph.items.length ? T.ok : T.sub, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{done}/{ph.items.length}</span>
                  </div>
                  <ProgressBar value={done} max={ph.items.length} color={ph.col} />
                </div>
                <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:5 }}>
                  {ph.items.map((item, ii) => (
                    <CheckItem key={ii} label={item} checked={!!chk[`${pi}-${ii}`]}
                      onToggle={() => setChk(p => ({...p,[`${pi}-${ii}`]:!p[`${pi}-${ii}`]}))} color={ph.col} />
                  ))}
                </div>
              </Card>
            );
          })}
          <button onClick={() => setChk({})} style={{ padding:"7px 18px", borderRadius:10, background:"#fff", border:`1.5px solid ${T.border}`, color:T.sub, fontSize:12, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>↺ Reset All</button>
        </div>
      )}

      {sec==="algo" && (
        <div className="fade">
          <Card color="#8b5cf6" style={{ marginBottom:12 }}>
            <SectionHeader icon="🗺️" title="Difficult Airway Algorithm" color="#8b5cf6" sub="DAS/ASA guidelines — tap each step for clinical detail" />
          </Card>
          {ALGO_DATA.map((s, i) => (
            <div key={s.id}>
              <Card color={s.em ? "#ef4444" : (st===s.id ? s.col : null)}
                style={{ transition:"all 0.2s", background: s.em ? "#fff5f5" : (st===s.id ? `${s.col}06` : "#fff") }}
                onClick={() => setSt(st===s.id ? null : s.id)}>
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 15px" }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:`${s.col}20`, border:`2px solid ${s.col}`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:s.col, flexShrink:0 }}>{i+1}</div>
                  <div style={{ fontSize:13, fontWeight:800, color: s.em ? "#ef4444" : T.text, flex:1 }}>{s.t}</div>
                  <div style={{ fontSize:13, color:T.muted, transform:st===s.id?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</div>
                </div>
                {st===s.id && (
                  <div style={{ padding:"0 15px 14px 57px" }} className="fade">
                    <div style={{ fontSize:12, color:T.sub, lineHeight:1.8, whiteSpace:"pre-line", marginBottom: s.q?12:0 }}>{s.d}</div>
                    {s.q && (
                      <div>
                        <div style={{ fontSize:11, color:T.text, fontWeight:800, marginBottom:8 }}>❓ {s.q}</div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          <div style={{ flex:1, minWidth:130, background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:10, padding:"9px 12px" }}>
                            <div style={{ fontSize:9, color:T.ok, letterSpacing:1, textTransform:"uppercase", marginBottom:3, fontWeight:700 }}>✅ YES</div>
                            <div style={{ fontSize:11, color:T.sub, lineHeight:1.6 }}>{s.yes}</div>
                          </div>
                          <div style={{ flex:1, minWidth:130, background:"#fff5f5", border:"1.5px solid #fca5a5", borderRadius:10, padding:"9px 12px" }}>
                            <div style={{ fontSize:9, color:T.danger, letterSpacing:1, textTransform:"uppercase", marginBottom:3, fontWeight:700 }}>❌ NO</div>
                            <div style={{ fontSize:11, color:T.sub, lineHeight:1.6 }}>{s.no}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
              {i < ALGO_DATA.length-1 && (
                <div style={{ display:"flex", paddingLeft:29, height:12 }}>
                  <div style={{ width:2, height:"100%", background:`${s.col}40`, borderRadius:2 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {sec==="equip" && (
        <div className="fade">
          <Card color="#10b981" style={{ marginBottom:12 }}>
            <SectionHeader icon="🧰" title="Airway Equipment Reference" color="#10b981" sub="Sizes, indications, and clinical pearls" />
          </Card>
          {EQUIP_DATA.map((cat, ci) => (
            <Card key={ci} style={{ marginBottom:10 }}>
              <div style={{ padding:"12px 16px 8px" }}>
                <Chip color={cat.col}>{cat.cat}</Chip>
              </div>
              <div style={{ padding:"0 12px 12px", display:"flex", flexDirection:"column", gap:5 }}>
                {cat.items.map((item, ii) => {
                  const k = `eq-${ci}-${ii}`;
                  return (
                    <div key={ii} onClick={() => tog(k)} style={{
                      padding:"9px 12px", borderRadius:10, cursor:"pointer",
                      background: op[k] ? `${cat.col}08` : T.faint,
                      border:`1.5px solid ${op[k] ? cat.col+"40" : T.border}`, transition:"all 0.2s",
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{item.n}</div>
                        <div style={{ fontSize:12, color:T.muted, transform:op[k]?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</div>
                      </div>
                      {op[k] && <div style={{ fontSize:11, color:T.sub, marginTop:6, lineHeight:1.7 }} className="fade">{item.d}</div>}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  MODULE 5 — CRISIS CHECKLISTS                               */
/* ──────────────────────────────────────────────────────────── */
const CRISIS_DATA = [
  { id:"mh", n:"Malignant Hyperthermia", i:"🔥", col:"#ef4444",
    trigger:"Volatile anaesthetics (halothane, isoflurane, sevoflurane, desflurane), succinylcholine",
    warn:"LIFE-THREATENING. Core temp can rise 1°C every 5 min. Act immediately.",
    signs:["↑ EtCO₂ (earliest and most sensitive sign)","Masseter spasm / generalised muscle rigidity","Tachycardia, hypertension, ventricular arrhythmias","Rapidly rising core temperature (>38.5°C)","Mixed respiratory + metabolic acidosis, hyperkalaemia","Myoglobinuria (dark cola-coloured urine)"],
    steps:[
      { ph:"IMMEDIATE ACTIONS", col:"#ef4444", acts:["STOP all volatile anaesthetic agents immediately","CALL FOR HELP — activate MH emergency protocol","Switch to TIVA: propofol infusion + 100% O₂ (avoid N₂O)","Hyperventilate at 2–3× normal minute volume with 100% O₂","DANTROLENE 2.5 mg/kg IV STAT — repeat every 5 min up to cumulative 10 mg/kg","Change all anaesthetic breathing circuit, tubing and soda lime if possible"] },
      { ph:"MONITORING & INVESTIGATIONS", col:"#f97316", acts:["Insert arterial line for continuous BP and ABG sampling","Urinary catheter — measure urine output (aim >1 mL/kg/hr)","12-lead ECG: monitor for arrhythmias","Blood samples: ABG, U&E, CK, LFTs, coagulation, FBC, group & cross-match","Core temperature probe (oesophageal/rectal) — target active cooling to <38.5°C","Consider CVP line if prolonged resuscitation needed"] },
      { ph:"TREAT COMPLICATIONS", col:"#f59e0b", acts:["Hyperthermia: cold IV crystalloid (4°C), ice packs, cooling blanket/Bear Hugger","Hyperkalaemia: calcium chloride 10 mg/kg IV + dextrose 50% + insulin 0.1 U/kg IV","Acidosis: NaHCO₃ 1–2 mmol/kg IV if pH <7.1","Arrhythmias: amiodarone 5mg/kg IV (avoid Ca²⁺ channel blockers)","DIC: FFP, cryoprecipitate, platelets per coagulation results","Rhabdomyolysis: aggressive IV fluid resuscitation for renal protection"] },
      { ph:"POST-ACUTE MANAGEMENT", col:"#22c55e", acts:["Continue dantrolene 1 mg/kg IV every 6h for 24–48 hours","ICU admission for monitoring and ongoing management","Refer patient AND family for MH susceptibility testing (IVCT/CHCT)","Notify relevant anaesthetic MH database/registry (NAMH)","Complete detailed critical incident report","Full team debrief and root cause analysis"] },
    ]},
  { id:"last", n:"LAST — Local Anaesthetic Toxicity", i:"💊", col:"#8b5cf6",
    trigger:"Excessive LA dose, inadvertent intravascular injection, rapid absorption from highly vascular site",
    warn:"Bupivacaine most cardiotoxic. Symptoms may be delayed 15–60 min. Have Intralipid in every anaesthetic area.",
    signs:["CNS prodrome: perioral tingling, tinnitus, metallic taste, visual disturbance, confusion","CNS excitation: restlessness, agitation, slurred speech, seizures","CNS depression: loss of consciousness, apnoea","CVS: bradycardia, conduction delays, hypotension, VT/VF (bupivacaine)","CVS collapse can occur without CNS prodrome with rapid injection"],
    steps:[
      { ph:"IMMEDIATE ACTIONS", col:"#ef4444", acts:["STOP injecting local anaesthetic immediately","CALL FOR HELP — activate LAST emergency protocol","100% O₂ — secure airway (intubate if needed to prevent aspiration/hypoxia)","If seizing: benzodiazepine IV — midazolam 0.05 mg/kg OR thiopentone 1 mg/kg","Start 20% Lipid Emulsion (Intralipid) WITHOUT DELAY"] },
      { ph:"INTRALIPID 20% DOSING PROTOCOL", col:"#8b5cf6", acts:["BOLUS: 1.5 mL/kg IV over 1 minute (use lean body weight)","If no response after 5 min: repeat bolus × 2 further times","INFUSION: 0.25 mL/kg/min (start after bolus)","Continue infusion until haemodynamically stable for minimum 10 min","Maximum cumulative dose: 12 mL/kg total (bolus + infusion)","Intralipid does NOT replace other resuscitative measures"] },
      { ph:"IF CARDIAC ARREST", col:"#ef4444", acts:["Start CPR immediately — continue throughout","Adrenaline: REDUCED dose 10–100 mcg IV (standard 1mg dose may worsen outcomes)","AVOID: vasopressin, calcium channel blockers, beta-blockers, local anaesthetics","Continue lipid emulsion throughout CPR","ECMO/cardiopulmonary bypass if available and no response","Prolonged resuscitation justified — up to 60+ minutes"] },
      { ph:"POST-EVENT", col:"#22c55e", acts:["ICU admission for minimum 12 hours monitoring","Serial ECGs, cardiac monitoring, CK levels","Report to AAGBI/national toxicology registry","Detailed documentation: drug, dose, site, concentration","Brief patient and family. Consider MedicAlert bracelet.","Review and audit technique, dose calculation, and monitoring"] },
    ]},
  { id:"anaphylaxis", n:"Anaphylaxis", i:"🚨", col:"#f59e0b",
    trigger:"NMBAs (most common ~60%), antibiotics (penicillin, cephalosporins), latex, chlorhexidine, colloids, IV contrast, opioids",
    warn:"Most perioperative anaphylaxis occurs within 5 min of induction. Rash may be absent in severe CVS collapse.",
    signs:["CVS collapse — tachycardia + hypotension (commonest intraoperative presentation)","Erythema, urticaria (hives), angioedema","Bronchospasm — increased peak airway pressures, wheeze","Flushing, conjunctival injection","Rash may be masked by surgical drapes — check skin"],
    steps:[
      { ph:"IMMEDIATE ACTIONS", col:"#ef4444", acts:["STOP all potential trigger agents immediately","CALL FOR HELP","100% O₂ — secure and maintain airway (intubate early if angioedema)","Position: supine with legs elevated if hypotensive","ADRENALINE: 0.5–1 mg IM lateral thigh (1:1000) OR 10–100 mcg IV bolus (1:10000) — repeat every 1–2 min as needed","IV access × 2: aggressive fluid resuscitation 500 mL–1L crystalloid bolus fast"] },
      { ph:"SECONDARY TREATMENT", col:"#f97316", acts:["Adrenaline infusion: 0.05–0.5 mcg/kg/min if hypotension persists after boluses","Chlorphenamine 10 mg IV slowly over 1 min (H1 antihistamine)","Hydrocortisone 200 mg IV (delayed benefit — does NOT replace adrenaline)","Salbutamol 5mg nebulised OR 250 mcg IV if bronchospasm persists","Vasopressin 1–2 units IV if refractory hypotension (last resort)","Glucagon 1–2 mg IV if on beta-blockers (bypasses beta-blockade)"] },
      { ph:"INVESTIGATIONS — MAST CELL TRYPTASE", col:"#f59e0b", acts:["Sample 1: AT TIME OF REACTION — 5 mL clotted blood","Sample 2: 1–2 hours after reaction onset","Sample 3: 24 hours later (baseline tryptase)","Results guide allergy investigation referral in 4–6 weeks","Document: ALL drugs administered, exact timing, sequence","Document: ALL materials patient was exposed to (latex, chlorhexidine, iodine)"] },
      { ph:"POST-EVENT", col:"#22c55e", acts:["Observe minimum 6–12 hours HDU/ICU (biphasic reaction in 5–20% of patients)","Refer to clinical immunology/allergy in 4–6 weeks for full investigation","MedicAlert bracelet listing suspected trigger","Provide Anapen/EpiPen × 2 and written anaphylaxis action plan on discharge","Notify suspected drug manufacturer if applicable","Complete yellow card/adverse event reporting"] },
    ]},
  { id:"cico", n:"CICO — Can't Intubate Can't Oxygenate", i:"🫁", col:"#ef4444",
    trigger:"Failed intubation + failed BVM ventilation + failed SGAD ventilation",
    warn:"IMMEDIATELY LIFE-THREATENING EMERGENCY. Irreversible brain injury in 4–5 minutes. Act decisively without hesitation.",
    signs:["SpO₂ falling despite all oxygenation attempts","Multiple failed laryngoscopy attempts (≥3)","Supraglottic airway ventilation unsuccessful","BVM ventilation impossible"],
    steps:[
      { ph:"DECLARE CICO — CALL FOR HELP NOW", col:"#ef4444", acts:["State clearly and loudly: 'THIS IS A CICO EMERGENCY'","Call ENT/surgeon/airway team to bedside IMMEDIATELY","Continue best attempts at BVM (2-person, jaw thrust, OPA/NPA)","Consider maximum paralysis if muscle activity is obstructing airway","Prepare front of neck access (FONA) equipment NOW"] },
      { ph:"SCALPEL CRICOTHYROIDOTOMY (preferred in adults)", col:"#f43f5e", acts:["Identify cricothyroid membrane (CTM): horizontal midline depression between thyroid cartilage (above) and cricoid ring (below)","Position: neck extended, stand on patient's right side","Laryngeal handshake: stabilise larynx with non-dominant hand (thumb + middle finger on thyroid cornua, index finger on CTM)","SCALPEL (No. 22 blade): single confident horizontal stab incision through skin AND CTM — full thickness","Dilate incision with horizontal tracheal hook or caudal traction with finger","Insert bougie through incision at 45° caudal angle into trachea","Railroad 6.0mm cuffed ETT over bougie — advance ~4–5 cm past CTM","Inflate cuff, ventilate, confirm EtCO₂ waveform, secure tube definitively"] },
      { ph:"NEEDLE TECHNIQUE (if scalpel unavailable)", col:"#f97316", acts:["14G IV cannula through CTM at 45° caudal angle into trachea","Confirm tracheal placement: aspirate air freely (syringe with 2mL water — bubbles confirm)","Connect to high-pressure jet ventilation source if available","Jet ventilation: 1 sec inspiration, allow 4–5 sec for passive expiration","Risk of barotrauma, surgical emphysema — NOT a definitive airway","Use ONLY as bridge to surgical airway or definitive control"] },
      { ph:"POST-FONA MANAGEMENT", col:"#22c55e", acts:["Confirm bilateral air entry and EtCO₂ waveform","Arrange formal surgical tracheostomy when patient stable","Complete critical incident report and serious adverse event notification","Psychological support for patient, family AND team members (this is traumatic)","Human factors debrief: communication, decision-making, team dynamics","Review entire sequence: could earlier action have prevented CICO?"] },
    ]},
  { id:"bronchospasm", n:"Severe Bronchospasm", i:"💨", col:"#0ea5e9",
    trigger:"Asthma/COPD exacerbation, light anaesthesia during intubation, aspiration, anaphylaxis, airway irritation",
    warn:"Silent chest = zero airflow = critical obstruction. High peak pressures with no plateau = bronchospasm not tension PTX.",
    signs:["High or rapidly rising peak airway pressures","Prolonged expiratory phase on capnograph (shark-fin waveform)","Audible wheeze (may be ABSENT in severe bronchospasm — 'silent chest')","Decreasing SpO₂ and rising EtCO₂","Haemodynamic compromise in severe/prolonged cases"],
    steps:[
      { ph:"IMMEDIATE ACTIONS", col:"#0ea5e9", acts:["Deepen anaesthesia: propofol bolus 1 mg/kg IV OR increase volatile (sevoflurane is bronchodilatory at high MAC)","100% O₂ — extend expiratory time (I:E ratio 1:3 or longer)","Manual ventilation: assess compliance by feel, confirm ETT position at carina distance","Check for and treat precipitating cause: aspiration, anaphylaxis, endobronchial intubation, kinked ETT","Disconnect and allow passive expiration if gas trapping (auto-PEEP)"] },
      { ph:"PHARMACOLOGICAL TREATMENT", col:"#f59e0b", acts:["SALBUTAMOL: 2.5–5 mg nebulised via circuit OR 100–200 mcg via MDI spacer into circuit","ADRENALINE: 10–100 mcg IV bolus if life-threatening or haemodynamically compromised","IPRATROPIUM: 0.5 mg nebulised (add to salbutamol)","IV AMINOPHYLLINE: 5 mg/kg loading dose over 20–30 min (if not already on theophylline)","IV HYDROCORTISONE: 200 mg IV stat","IV MAGNESIUM SULPHATE: 2g over 20 min (bronchodilates by blocking Ca²⁺ channels)"] },
      { ph:"VENTILATION STRATEGY", col:"#10b981", acts:["PERMISSIVE HYPERCAPNIA: accept PaCO₂ 50–70 mmHg to avoid barotrauma","Reduce respiratory rate to 8–10 breaths/min to allow full expiration","Tidal volume 6–8 mL/kg (lung-protective)","Use minimum PEEP (can worsen air trapping in asthma)","Consider HELIOX (helium-oxygen 80:20) if available — reduces turbulent flow"] },
      { ph:"REFRACTORY / LIFE-THREATENING", col:"#ef4444", acts:["KETAMINE infusion 1–2 mg/kg/hr (direct bronchodilatory + sympathomimetic)","Sevoflurane at high concentration (2–3 MAC) as bronchodilator","Volatile anaesthetics: halothane most potent bronchodilator but arrhythmogenic","Consider extracorporeal membrane oxygenation (ECMO) if available","ICU admission with respiratory medicine/pulmonology review","Post-event: optimise controller therapy, investigate trigger"] },
    ]},
  { id:"cardiac_arrest", n:"Perioperative Cardiac Arrest", i:"💔", col:"#ec4899",
    trigger:"Hypoxia, hypovolaemia, tension PTX, drug errors/toxicity, anaphylaxis, MI, electrolyte disturbance, LAST",
    warn:"Perioperative arrest often has a reversible cause. Identify and treat H's & T's simultaneously with CPR.",
    signs:["Sudden loss of pulse and arterial waveform","Precipitous fall in EtCO₂ to near zero","ECG: VF, pulseless VT, PEA, asystole","Loss of consciousness (if not already anaesthetised)"],
    steps:[
      { ph:"BASIC LIFE SUPPORT", col:"#ef4444", acts:["CALL CARDIAC ARREST TEAM immediately","Start CPR: 100–120/min rate, 5–6 cm depth, allow full recoil","100% O₂ ventilation — 10 breaths/min if intubated (don't interrupt compressions)","Confirm IV/IO access (if not present, IO insertion while CPR continues)","Attach defibrillator pads — analyse rhythm as soon as possible","Identify and communicate team roles: compressor, airway, drugs, timekeeper, team leader"] },
      { ph:"SHOCKABLE RHYTHM: VF / pVT", col:"#f43f5e", acts:["DEFIBRILLATE: 200J biphasic (360J monophasic) — immediately","Resume CPR for 2 min immediately after shock","ADRENALINE 1 mg IV after 3rd shock, then every 3–5 min","AMIODARONE 300 mg IV after 3rd shock (2nd dose 150mg after 5th shock)","Repeat cycle: 2 min CPR → rhythm check → defibrillate if shockable → drugs","Ensure high-quality CPR throughout — rotate compressors every 2 min"] },
      { ph:"NON-SHOCKABLE: PEA / ASYSTOLE", col:"#f97316", acts:["ADRENALINE 1 mg IV immediately, then every 3–5 min","Continue CPR: 30:2 if not intubated, continuous if intubated","Identify and treat ALL reversible causes (H's & T's — see below)","Consider atropine 3 mg IV if asystole or slow PEA rate (<60/min)","Consider adrenaline dose escalation: 3–5 mg for profound refractoriness"] },
      { ph:"H's & T's — REVERSIBLE CAUSES", col:"#f59e0b", acts:["HYPOXIA → ensure airway secured, 100% O₂, confirm bilateral ventilation","HYPOVOLAEMIA → rapid IV fluid/blood resuscitation 500mL–1L crystalloid","HYPO/HYPERKALAEMIA → treat electrolytes, check ABG urgently","HYPOTHERMIA → warm IV fluids, warming blanket (consider ECMO if severe)","TENSION PNEUMOTHORAX → needle decompression (2nd ICS MCL) → chest drain","TAMPONADE → pericardiocentesis or emergency thoracotomy","TOXINS (LAST, drug error) → specific antidotes (Intralipid, flumazenil, naloxone)","THROMBOSIS (PE/AMI) → thrombolysis (tPA) or emergency PCI/surgical embolectomy"] },
      { ph:"RETURN OF SPONTANEOUS CIRCULATION (ROSC)", col:"#22c55e", acts:["12-lead ECG — exclude STEMI immediately","Target SpO₂ 94–98% (avoid hyperoxia), PaCO₂ 35–45 mmHg","Targeted Temperature Management (TTM) 32–36°C if indicated (out-of-hospital arrest, not responsive)","ICU admission for post-resuscitation care protocol","Identify and definitively treat precipitating cause","Family notification and honest communication of events","Team debrief — psychological support for all staff involved"] },
    ]},
];

function CrisisModule() {
  const [sel, setSel] = useState(null);
  const [chk, setChk] = useState({});
  const [op, setOp] = useState({});
  const color = T.c5;

  if (!sel) {
    return (
      <div className="fade">
        <Card color={T.danger} style={{ marginBottom:16 }}>
          <SectionHeader icon="🚨" title="Crisis Checklists" color={T.danger}
            sub="Real-time emergency protocols — tap any crisis to open the step-by-step checklist" />
          <div style={{ padding:"8px 16px 14px" }}>
            <WarnBox text="These checklists are for educational purposes. Always follow your institution's protocols and senior guidance in real emergencies." />
          </div>
        </Card>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10 }}>
          {CRISIS_DATA.map(cr => (
            <Card key={cr.id} color={cr.col} onClick={() => { setSel(cr.id); setChk({}); setOp({}); }}
              style={{ cursor:"pointer", transition:"all 0.2s" }}>
              <div style={{ padding:"16px" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{cr.i}</div>
                <div style={{ fontSize:14, fontWeight:800, color:T.text, marginBottom:4 }}>{cr.n}</div>
                <div style={{ fontSize:11, color:T.sub, lineHeight:1.5, marginBottom:10 }}>{cr.signs[0]}</div>
                <div style={{ fontSize:12, color:cr.col, fontWeight:700 }}>Open protocol →</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const cr = CRISIS_DATA.find(c => c.id === sel);
  const tot = cr.steps.reduce((a,s) => a+s.acts.length, 0);
  const done = cr.steps.reduce((a,s,si) => a+s.acts.filter((_,ai) => chk[`${si}-${ai}`]).length, 0);
  const pct = Math.round((done/tot)*100);

  return (
    <div className="fade">
      <button onClick={() => setSel(null)} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14, padding:"7px 14px", borderRadius:10, border:`1.5px solid ${T.border}`, background:"#fff", color:T.sub, fontSize:12, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>
        ← Back to All Crises
      </button>

      {/* Crisis Header */}
      <Card color={cr.col} style={{ marginBottom:12 }}>
        <div style={{ padding:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1, marginRight:12 }}>
              <div style={{ fontSize:22, fontWeight:900, color:T.text, marginBottom:4 }}>{cr.i} {cr.n}</div>
              <div style={{ fontSize:11, color:T.sub, lineHeight:1.5 }}><strong>Triggers:</strong> {cr.trigger}</div>
            </div>
            <div style={{ textAlign:"center", background:`${cr.col}15`, border:`2px solid ${cr.col}40`, borderRadius:12, padding:"8px 14px", flexShrink:0 }}>
              <div style={{ fontSize:22, fontWeight:900, color:cr.col, fontFamily:"'JetBrains Mono',monospace" }}>{pct}%</div>
              <div style={{ fontSize:9, color:T.muted, fontWeight:700 }}>{done}/{tot} done</div>
            </div>
          </div>
          <div style={{ marginTop:12 }}>
            <ProgressBar value={done} max={tot} color={cr.col} height={8} />
          </div>
          <WarnBox text={cr.warn} color={cr.col} />
        </div>
      </Card>

      {/* Signs */}
      <Card style={{ marginBottom:12 }}>
        <div onClick={() => setOp(p => ({...p,signs:!p.signs}))} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", cursor:"pointer" }}>
          <Chip color={cr.col}>🔎 Clinical Signs / Recognition</Chip>
          <div style={{ fontSize:13, color:T.muted, transform:op.signs?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</div>
        </div>
        {op.signs && (
          <div style={{ padding:"0 16px 14px" }} className="fade">
            {cr.signs.map((s,i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                <span style={{ color:cr.col, fontWeight:700 }}>•</span>
                <span style={{ fontSize:12, color:T.sub, lineHeight:1.6 }}>{s}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Steps */}
      {cr.steps.map((ph, si) => {
        const pd = ph.acts.filter((_,ai) => chk[`${si}-${ai}`]).length;
        const allDone = pd === ph.acts.length;
        return (
          <Card key={si} style={{ marginBottom:10, opacity: allDone ? 0.85 : 1 }}>
            <div style={{ padding:"12px 16px 8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {allDone && <span style={{ fontSize:16 }}>✅</span>}
                  <Chip color={ph.col}>{ph.ph}</Chip>
                </div>
                <span style={{ fontSize:11, color: allDone ? T.ok : T.sub, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{pd}/{ph.acts.length}</span>
              </div>
              <ProgressBar value={pd} max={ph.acts.length} color={ph.col} height={5} />
            </div>
            <div style={{ padding:"4px 12px 12px", display:"flex", flexDirection:"column", gap:5 }}>
              {ph.acts.map((act, ai) => (
                <CheckItem key={ai} label={act} checked={!!chk[`${si}-${ai}`]}
                  onToggle={() => setChk(p => ({...p,[`${si}-${ai}`]:!p[`${si}-${ai}`]}))} color={ph.col} />
              ))}
            </div>
          </Card>
        );
      })}
      <button onClick={() => setChk({})} style={{ padding:"7px 18px", borderRadius:10, background:"#fff", border:`1.5px solid ${T.border}`, color:T.sub, fontSize:12, cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>↺ Reset Entire Checklist</button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  ROOT APP                                                    */
/* ──────────────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("home");

  if (active === "home") {
    return (
      <>
        <style>{STYLE}</style>
        <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", fontFamily:"'Nunito',sans-serif" }}>
          {/* Animated background dots */}
          <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ position:"absolute", borderRadius:"50%", opacity:0.06,
                width: [300,200,400,150,250,350][i], height:[300,200,400,150,250,350][i],
                background:["#38bdf8","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"][i],
                left: ["10%","70%","40%","80%","5%","55%"][i],
                top: ["5%","10%","60%","70%","40%","20%"][i],
                filter:"blur(60px)",
              }} />
            ))}
          </div>

          <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:480 }}>
            {/* Logo */}
            <div style={{ width:80, height:80, borderRadius:22, background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, margin:"0 auto 20px", boxShadow:"0 0 40px rgba(14,165,233,0.4)" }}>⚕️</div>

            <h1 style={{ fontSize:36, fontWeight:900, color:"#fff", letterSpacing:-1, marginBottom:4 }}>
              Anaesthesia<span style={{ color:"#38bdf8" }}>Hub</span>
            </h1>
            <p style={{ fontSize:13, color:"#94a3b8", letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontWeight:600 }}>
              Educational Clinical Reference Platform
            </p>

            {/* Creator credit */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(56,189,248,0.12)", border:"1.5px solid rgba(56,189,248,0.3)", borderRadius:30, padding:"8px 18px", marginBottom:28 }}>
              <span style={{ fontSize:18 }}>👩‍⚕️</span>
              <span style={{ fontSize:13, color:"#38bdf8", fontWeight:800 }}>Created by Dr. Meghana</span>
              <span style={{ fontSize:11, color:"#64748b" }}>· Anaesthesia PG</span>
            </div>

            {/* Module preview tiles */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
              {MOD_META.map(m => (
                <div key={m.id} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"14px", textAlign:"left", backdropFilter:"blur(10px)" }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{m.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>{m.label}</div>
                  <div style={{ width:24, height:2, background:m.color, borderRadius:2, marginTop:6 }} />
                </div>
              ))}
              {/* 5th module centered */}
              <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"14px", textAlign:"left", gridColumn:"1 / -1", backdropFilter:"blur(10px)" }}>
                <div style={{ fontSize:22, marginBottom:6 }}>🚨</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#f1f5f9" }}>Crisis Checklists — 6 Emergency Protocols</div>
                <div style={{ width:40, height:2, background:T.c5, borderRadius:2, marginTop:6 }} />
              </div>
            </div>

            <button onClick={() => setActive("drugs")} style={{
              width:"100%", padding:"16px", borderRadius:16, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#0ea5e9,#0284c7)", color:"#fff",
              fontSize:16, fontWeight:800, fontFamily:"'Nunito',sans-serif",
              boxShadow:"0 8px 24px rgba(14,165,233,0.4)", letterSpacing:0.3,
            }}>Launch Platform →</button>

            <div style={{ marginTop:16, fontSize:11, color:"#334155", lineHeight:1.8 }}>
              For educational purposes only · Not for clinical decision-making<br/>
              Based on Morgan & Mikhail · Miller's Anaesthesia · DAS/ASA/AAGBI Guidelines
            </div>
          </div>
        </div>
      </>
    );
  }

  const mod = MOD_META.find(m => m.id === active) || MOD_META[0];
  const COMPS = { drugs:DrugModule, infusion:InfusionModule, preop:PreopModule, airway:AirwayModule, crisis:CrisisModule };
  const Comp = COMPS[active] || DrugModule;

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Nunito',sans-serif", color:T.text }}>
        {/* Top navbar */}
        <div style={{ background:"#fff", borderBottom:`1.5px solid ${T.border}`, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth:820, margin:"0 auto", padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setActive("home")} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0, flexShrink:0 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#0ea5e9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, boxShadow:"0 2px 8px rgba(14,165,233,0.3)" }}>⚕️</div>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:13, fontWeight:900, color:T.text, letterSpacing:-0.3 }}>Anaesthesia<span style={{ color:"#0ea5e9" }}>Hub</span></div>
                <div style={{ fontSize:8, color:T.muted, letterSpacing:1.5, textTransform:"uppercase", fontWeight:600 }}>by Dr. Meghana</div>
              </div>
            </button>
            <div style={{ flex:1 }} />
            <span style={{ fontSize:9, color:T.danger, background:"#fff5f5", border:"1.5px solid #fca5a5", padding:"3px 8px", borderRadius:6, letterSpacing:0.5, fontWeight:700, flexShrink:0 }}>⚠ EDU ONLY</span>
          </div>
          {/* Module tabs */}
          <div style={{ maxWidth:820, margin:"0 auto", display:"flex", overflowX:"auto", borderTop:`1px solid ${T.border}` }}>
            {MOD_META.map(m => (
              <button key={m.id} onClick={() => setActive(m.id)} style={{
                flex:1, minWidth:64, display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                padding:"8px 4px", border:"none", cursor:"pointer", background:"transparent",
                borderBottom: active===m.id ? `3px solid ${m.color}` : "3px solid transparent",
                transition:"all 0.18s",
              }}>
                <span style={{ fontSize:17 }}>{m.icon}</span>
                <span style={{ fontSize:10, fontWeight: active===m.id ? 800 : 500, color: active===m.id ? m.color : T.sub, whiteSpace:"nowrap" }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Module title strip */}
        <div style={{ background:`linear-gradient(135deg,${mod.bg},${mod.bg}80)`, borderBottom:`1.5px solid ${mod.color}25`, padding:"12px 16px" }}>
          <div style={{ maxWidth:820, margin:"0 auto", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>{mod.icon}</span>
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:T.text }}>{mod.label}</div>
              <div style={{ fontSize:10, color:mod.dark, fontWeight:600, letterSpacing:0.5 }}>Module {MOD_META.findIndex(m=>m.id===active)+1} of 5</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth:820, margin:"0 auto", padding:"16px 14px 80px" }}>
          <Comp />
        </div>

        {/* Footer */}
        <div style={{ borderTop:`1.5px solid ${T.border}`, padding:"14px 16px", textAlign:"center", background:"#fff" }}>
          <div style={{ fontSize:11, color:T.muted, lineHeight:2 }}>
            <strong style={{ color:T.sub }}>AnaesthesiaHub v3.0</strong> · Created by <strong style={{ color:"#0ea5e9" }}>Dr. Meghana</strong> · Anaesthesia PG<br/>
            Morgan & Mikhail · Miller's Anaesthesia · DAS / ASA / AAGBI Guidelines<br/>
            <span style={{ color:T.danger, fontWeight:700 }}>⚠ NOT for clinical decision-making without senior supervision</span>
          </div>
        </div>
      </div>
    </>
  );
}
