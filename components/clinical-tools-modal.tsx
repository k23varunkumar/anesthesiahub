import { useState } from 'react';
import { CORE_ANESTHESIA_DRUGS, CRISIS_PROTOCOLS, type CrisisProtocol } from '@/app/clinical-tools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, Syringe, Flame, HeartPulse, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function ClinicalToolsModal({ onClose }: Props) {
  const [weightKg, setWeightKg] = useState<number>(60);
  const [activeTab, setActiveTab] = useState<'drugs' | 'crisis'>('drugs');
  const [selectedCrisisKey, setSelectedCrisisKey] = useState<string>('last');
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const crisis: CrisisProtocol = CRISIS_PROTOCOLS[selectedCrisisKey] || CRISIS_PROTOCOLS['last'];

  const toggleAction = (idx: number) => {
    const key = `${selectedCrisisKey}-${idx}`;
    setCheckedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="clinical-overlay" role="dialog" aria-modal="true" aria-label="Clinical Decision & Drug Calculator">
      <div className="clinical-window glass">
        {/* Header */}
        <div className="clinical-header">
          <div className="clinical-title-row">
            <div className="clinical-title-main">
              <span className="clinical-title-icon">💉</span>
              <div>
                <div className="clinical-title-text">Operating Theater Decision Support & Crisis Master</div>
                <div className="clinical-sub-text">Weight-Calibrated Dosing & ASRA / DAS Emergency Guidelines</div>
              </div>
            </div>
            <Button variant="ghost" className="icon-button" onClick={onClose} aria-label="Close Clinical Decision Support">
              <X size={20} />
            </Button>
          </div>

          {/* Interactive Weight Slider Bar */}
          <div className="patient-weight-bar">
            <div className="patient-weight-label">
              <span>Patient Weight:</span>
              <span className="patient-weight-badge">{weightKg} kg</span>
            </div>
            <input
              type="range"
              min={30}
              max={120}
              step={1}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="weight-slider"
              aria-label="Patient Weight in Kilograms"
            />
            <div className="weight-presets">
              {[40, 50, 60, 70, 80, 90].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`weight-chip ${weightKg === w ? 'active' : ''}`}
                  onClick={() => setWeightKg(w)}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="clinical-mode-tabs">
            <button
              type="button"
              className={`clinical-mode-tab ${activeTab === 'drugs' ? 'active' : ''}`}
              onClick={() => setActiveTab('drugs')}
            >
              <Syringe size={16} />
              <span>Weight-Based Drug Dosing ({CORE_ANESTHESIA_DRUGS.length} Drugs)</span>
            </button>
            <button
              type="button"
              className={`clinical-mode-tab ${activeTab === 'crisis' ? 'active' : ''}`}
              onClick={() => setActiveTab('crisis')}
            >
              <AlertTriangle size={16} />
              <span>🚨 Emergency Crisis Protocols (LAST, CICO, MH)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Weight-Based Induction, NMBAs, Reversals */}
        {activeTab === 'drugs' && (
          <div className="clinical-drugs-scroll">
            <div className="drugs-grid">
              {CORE_ANESTHESIA_DRUGS.map((d) => {
                const totalDose = (d.dosePerKg * weightKg).toFixed(d.unit === 'mg/kg' ? 1 : 0);
                const volumeMl = d.concentrationMgPerMl
                  ? ((d.dosePerKg * weightKg) / d.concentrationMgPerMl).toFixed(1)
                  : null;

                return (
                  <div className="drug-card glass" key={d.name}>
                    <div className="drug-card-top">
                      <div>
                        <span className="drug-name">{d.name}</span>
                        <Badge variant="outline" className="drug-cat-badge">{d.category}</Badge>
                      </div>
                      <div className="drug-total-box">
                        <span className="drug-total-val">{totalDose}</span>
                        <span className="drug-total-unit">{d.unit.replace('/kg', '')}</span>
                      </div>
                    </div>

                    <div className="drug-calc-sub">
                      <span>Dose: {d.dosePerKg} {d.unit}</span>
                      {volumeMl && <span className="drug-vol-pill">Volume: ~{volumeMl} mL</span>}
                    </div>

                    <p className="drug-note">{d.clinicalNote}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Emergency Crisis Checklists & Protocols */}
        {activeTab === 'crisis' && (
          <div className="crisis-scroll">
            {/* Crisis Protocol Selection Buttons */}
            <div className="crisis-tabs">
              <button
                type="button"
                className={`crisis-selector-btn ${selectedCrisisKey === 'last' ? 'active last' : ''}`}
                onClick={() => setSelectedCrisisKey('last')}
              >
                <HeartPulse size={16} />
                <span>ASRA LAST (Lipid Rescue)</span>
              </button>
              <button
                type="button"
                className={`crisis-selector-btn ${selectedCrisisKey === 'das' ? 'active das' : ''}`}
                onClick={() => setSelectedCrisisKey('das')}
              >
                <AlertTriangle size={16} />
                <span>DAS Failed Intubation / CICO</span>
              </button>
              <button
                type="button"
                className={`crisis-selector-btn ${selectedCrisisKey === 'mh' ? 'active mh' : ''}`}
                onClick={() => setSelectedCrisisKey('mh')}
              >
                <Flame size={16} />
                <span>Malignant Hyperthermia (MH)</span>
              </button>
            </div>

            {/* Protocol Content */}
            <div className="crisis-content-box glass">
              <div className="crisis-box-header" style={{ borderLeftColor: crisis.color }}>
                <div className="crisis-box-title" style={{ color: crisis.color }}>{crisis.title}</div>
                <div className="crisis-box-sub">{crisis.subtitle}</div>
              </div>

              {/* Patient Weight Specific Calculations */}
              <div className="crisis-dosing-section">
                <div className="crisis-section-heading">⚡ Weight-Calibrated Crisis Medication ({weightKg} kg):</div>
                <div className="crisis-dosing-cards">
                  {crisis.drugDosing.map((d, i) => (
                    <div className="crisis-dose-card" key={i}>
                      <div className="crisis-dose-name">{d.drug}</div>
                      <div className="crisis-dose-calc" style={{ color: crisis.color }}>
                        {d.calculation(weightKg)}
                      </div>
                      <div className="crisis-dose-route">Route: {d.route}</div>
                      <div className="crisis-dose-inst">{d.instructions}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Step-by-Step Action Checklist */}
              <div className="crisis-checklist-section">
                <div className="crisis-section-heading">📋 Immediate OR Action Checklist:</div>
                <div className="checklist-items">
                  {crisis.immediateActions.map((action, i) => {
                    const isDone = !!checkedActions[`${selectedCrisisKey}-${i}`];
                    return (
                      <div
                        key={i}
                        className={`checklist-item ${isDone ? 'checked' : ''}`}
                        onClick={() => toggleAction(i)}
                      >
                        <div className={`check-icon ${isDone ? 'on' : ''}`}>
                          {isDone ? <CheckCircle2 size={16} /> : <span>{i + 1}</span>}
                        </div>
                        <span className="check-text">{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* High Stakes Pearls */}
              <div className="crisis-pearls-section">
                <div className="crisis-section-heading">🧠 High-Yield Examination Pearls:</div>
                <ul className="crisis-pearls-list">
                  {crisis.criticalPearls.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
