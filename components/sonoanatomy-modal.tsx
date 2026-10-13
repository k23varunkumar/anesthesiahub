import { useState } from 'react';
import { SONO_BLOCKS, type SonoBlock, type SonoStructure } from '@/app/sonoanatomy-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Volume2, ShieldAlert, Sparkles, Layers, Image as ImageIcon, Crosshair, Wrench } from 'lucide-react';

interface Props {
  initialBlockId?: string;
  onClose: () => void;
  onSelectAtlasStructure?: (name: string) => void;
}

export function SonoanatomyModal({ initialBlockId = 'supraclavicular', onClose, onSelectAtlasStructure }: Props) {
  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    SONO_BLOCKS[initialBlockId] ? initialBlockId : 'supraclavicular'
  );
  const [activeStructure, setActiveStructure] = useState<SonoStructure | null>(null);
  const [viewMode, setViewMode] = useState<'scan' | 'probe'>('scan');

  const block: SonoBlock = SONO_BLOCKS[selectedBlockId] || SONO_BLOCKS['supraclavicular'];

  return (
    <div className="sono-overlay" role="dialog" aria-modal="true" aria-label="Authentic Sonoanatomy Ultrasound Viewer">
      <div className="sono-window glass">
        {/* Header */}
        <div className="sono-header">
          <div className="sono-title-group">
            <span className="sono-icon">📡</span>
            <div>
              <div className="sono-title">{block.name}</div>
              <div className="sono-subtitle">Authentic Clinical Sonoanatomy & Probe Orientation · Ganga Hospital Compendium</div>
            </div>
          </div>
          <div className="sono-header-actions">
            <Badge variant="secondary" className="sono-badge">{block.category}</Badge>
            <Button variant="ghost" className="icon-button" onClick={onClose} aria-label="Close Ultrasound Simulator">
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Block Selector Chips */}
        <div className="sono-selector-bar">
          {Object.values(SONO_BLOCKS).map((b) => (
            <button
              key={b.id}
              type="button"
              className={`sono-tab-btn ${selectedBlockId === b.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedBlockId(b.id);
                setActiveStructure(null);
                setViewMode('scan');
              }}
            >
              {b.name.split(' ')[0]} {b.name.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        {/* Main Grid: Real Clinical Scan on Left, Clinical Specs on Right */}
        <div className="sono-body-grid">
          {/* Ultrasound Screen Viewport */}
          <div className="sono-screen-container">
            <div className="sono-bezel">
              <div className="sono-bezel-top">
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className={`sono-needle-toggle ${viewMode === 'scan' ? 'on' : ''}`}
                    onClick={() => setViewMode('scan')}
                  >
                    <ImageIcon size={13} />
                    <span>Clinical Sonogram</span>
                  </button>
                  {block.probePhoto && (
                    <button
                      type="button"
                      className={`sono-needle-toggle ${viewMode === 'probe' ? 'on' : ''}`}
                      onClick={() => setViewMode('probe')}
                    >
                      <Crosshair size={13} />
                      <span>Probe Placement Photo</span>
                    </button>
                  )}
                </div>
                <span className="sono-bezel-tag">{block.probeType.split('(')[0]}</span>
              </div>

              {/* Real Textbook Ultrasound Scan */}
              <div className="sono-screen-real">
                {viewMode === 'scan' ? (
                  <div className="real-sono-img-wrapper">
                    <img
                      src={block.realSonoImage}
                      alt={`Authentic clinical ultrasound scan for ${block.name}`}
                      className="real-sono-img"
                    />
                    <div className="real-sono-caption">
                      <span>📸 Authentic High-Yield Ultrasound Scan · Ganga Hospital Regional Anesthesia</span>
                    </div>
                  </div>
                ) : (
                  <div className="real-sono-img-wrapper">
                    <img
                      src={block.probePhoto}
                      alt={`Probe placement and patient position for ${block.name}`}
                      className="real-sono-img probe-img"
                    />
                    <div className="real-sono-caption">
                      <span>🩺 Clinical Probe Orientation & Patient Position</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Acoustic Structure Chips */}
              <div className="sono-structure-chips-row">
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', width: '100%', marginBottom: 2 }}>
                  Identified Acoustic Landmarks:
                </span>
                {block.keyStructures.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`sono-legend-item ${activeStructure?.id === s.id ? 'active' : ''}`}
                    onClick={() => setActiveStructure(s)}
                  >
                    <span className="sono-legend-dot" style={{ background: s.color }} />
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Ganga Hospital Clinical Pearls & Specs */}
          <div className="sono-spec-panel">
            {/* Active Landmark Inspector */}
            {activeStructure ? (
              <div className="sono-inspector-card glass">
                <div className="sono-inspector-head">
                  <span className="sono-tag-type">{activeStructure.type.toUpperCase()}</span>
                  <span className="sono-structure-title">{activeStructure.name}</span>
                </div>
                <div className="sono-feature-row">
                  <strong>Acoustic Appearance:</strong>
                  <span>{activeStructure.acousticFeature}</span>
                </div>
                <div className="sono-feature-row">
                  <strong>Clinical Significance:</strong>
                  <span>{activeStructure.description}</span>
                </div>
                {onSelectAtlasStructure && (
                  <Button
                    variant="outline"
                    className="sono-atlas-link-btn"
                    onClick={() => {
                      onSelectAtlasStructure(activeStructure.name);
                      onClose();
                    }}
                  >
                    <Layers size={14} />
                    <span>Locate in 3D Anatomy Atlas →</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="sono-inspector-empty">
                <Sparkles size={20} color="#00f0ff" />
                <span>Tap any anatomical landmark above to view its acoustic signature & clinical endpoints.</span>
              </div>
            )}

            {/* Block Clinical Parameters Card */}
            <div className="sono-clinical-card glass">
              <div className="sono-card-heading">
                <Volume2 size={16} />
                <span>Ganga Hospital Block Pearl</span>
              </div>
              <p className="sono-ganga-pearl">{block.gangaPearl}</p>

              {/* Troubleshooting Tips */}
              <div className="sono-troubleshoot-box">
                <div className="sono-troubleshoot-head">
                  <Wrench size={14} color="#0284c7" />
                  <span>Clinical Troubleshooting:</span>
                </div>
                <p className="sono-troubleshoot-text">{block.troubleshootingTip}</p>
              </div>

              {/* Local Anesthetic Choice & Volume */}
              <div className="sono-dosage-grid" style={{ marginTop: 10 }}>
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Local Anesthetic</span>
                  <span className="sono-dose-val">{block.localAnesthetic.agent}</span>
                </div>
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Target Volume</span>
                  <span className="sono-dose-val">{block.localAnesthetic.volume}</span>
                </div>
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Onset</span>
                  <span className="sono-dose-val">{block.localAnesthetic.onset}</span>
                </div>
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Duration</span>
                  <span className="sono-dose-val">{block.localAnesthetic.duration}</span>
                </div>
              </div>

              {/* Safety Warning */}
              <div className="sono-warning-box">
                <ShieldAlert size={16} color="#ef4444" className="sono-warn-icon" />
                <span><strong>Safety Alert:</strong> {block.safetyWarning}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
