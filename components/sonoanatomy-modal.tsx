import { useState } from 'react';
import { SONO_BLOCKS, type SonoBlock, type SonoStructure } from '@/app/sonoanatomy-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Volume2, ShieldAlert, Sparkles, Navigation, Layers } from 'lucide-react';

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
  const [showNeedle, setShowNeedle] = useState(true);

  const block: SonoBlock = SONO_BLOCKS[selectedBlockId] || SONO_BLOCKS['supraclavicular'];

  return (
    <div className="sono-overlay" role="dialog" aria-modal="true" aria-label="Sonoanatomy Ultrasound Simulator">
      <div className="sono-window glass">
        {/* Header */}
        <div className="sono-header">
          <div className="sono-title-group">
            <span className="sono-icon">📡</span>
            <div>
              <div className="sono-title">{block.name}</div>
              <div className="sono-subtitle">USGRA Live Sonoanatomy & Needle Trajectory Simulator</div>
            </div>
          </div>
          <div className="sono-header-actions">
            <Badge variant="secondary" className="sono-badge">{block.probeType}</Badge>
            <Button variant="ghost" className="icon-button" onClick={onClose} aria-label="Close Sonoanatomy Simulator">
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
              }}
            >
              {b.name.split(' ')[0]} {b.name.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        {/* Main Grid: US Screen on Left, Clinical Specs on Right */}
        <div className="sono-body-grid">
          {/* Ultrasound Screen Viewport */}
          <div className="sono-screen-container">
            <div className="sono-bezel">
              <div className="sono-bezel-top">
                <span className="sono-bezel-tag">US 12-3 MHz Linear</span>
                <span className="sono-bezel-tag">Depth: 3.5 cm</span>
                <span className="sono-bezel-tag">Gain: 54 dB</span>
                <button
                  type="button"
                  className={`sono-needle-toggle ${showNeedle ? 'on' : ''}`}
                  onClick={() => setShowNeedle((v) => !v)}
                  title="Toggle In-Plane Needle Trajectory"
                >
                  <Navigation size={13} />
                  <span>{showNeedle ? 'Needle: ON' : 'Needle: OFF'}</span>
                </button>
              </div>

              {/* Ultrasound Visual Canvas (SVG) */}
              <div className="sono-screen">
                {/* Acoustic Speckle Noise Layer */}
                <div className="sono-speckle" />

                <svg viewBox="0 0 400 280" className="sono-svg" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <radialGradient id="artGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                      <stop offset="85%" stopColor="#7f1d1d" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#1e293b" stopOpacity="0.1" />
                    </radialGradient>
                    <radialGradient id="nerveGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#eab308" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#713f12" stopOpacity="0.3" />
                    </radialGradient>
                    <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="85%" stopColor="#00f0ff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  {/* Anatomical Acoustic Structures */}
                  {block.structures.map((s) => {
                    const isSelected = activeStructure?.id === s.id;
                    if (s.shape === 'circle') {
                      return (
                        <circle
                          key={s.id}
                          cx={s.cx}
                          cy={s.cy}
                          r={s.r}
                          fill={s.type === 'artery' ? 'url(#artGlow)' : s.type === 'nerve' ? 'url(#nerveGlow)' : s.color}
                          stroke={isSelected ? '#00f0ff' : s.color}
                          strokeWidth={isSelected ? 3 : 1.5}
                          className="sono-shape interactive"
                          onClick={() => setActiveStructure(s)}
                        />
                      );
                    }
                    if (s.shape === 'ellipse') {
                      return (
                        <ellipse
                          key={s.id}
                          cx={s.cx}
                          cy={s.cy}
                          rx={s.rx}
                          ry={s.ry}
                          fill="url(#nerveGlow)"
                          stroke={isSelected ? '#00f0ff' : '#ca8a04'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          className="sono-shape interactive"
                          onClick={() => setActiveStructure(s)}
                        />
                      );
                    }
                    if (s.shape === 'polygon') {
                      return (
                        <polygon
                          key={s.id}
                          points={s.points}
                          fill={s.type === 'nerve' ? 'url(#nerveGlow)' : s.color + '33'}
                          stroke={isSelected ? '#00f0ff' : s.color}
                          strokeWidth={isSelected ? 2.5 : 1}
                          strokeDasharray={s.type === 'muscle' ? '3,3' : 'none'}
                          className="sono-shape interactive"
                          onClick={() => setActiveStructure(s)}
                        />
                      );
                    }
                    if (s.shape === 'line') {
                      return (
                        <line
                          key={s.id}
                          x1={s.x1}
                          y1={s.y1}
                          x2={s.x2}
                          y2={s.y2}
                          stroke={isSelected ? '#00f0ff' : s.color}
                          strokeWidth={isSelected ? 4 : s.type === 'bone' ? 3.5 : 2}
                          className="sono-shape interactive"
                          onClick={() => setActiveStructure(s)}
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Needle Path Simulation */}
                  {showNeedle && (
                    <g className="sono-needle-group">
                      {/* Needle Shaft Line */}
                      <line
                        x1={block.needlePath.startX}
                        y1={block.needlePath.startY}
                        x2={block.needlePath.targetX}
                        y2={block.needlePath.targetY}
                        stroke="url(#needleGrad)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeDasharray="8,2"
                      />
                      {/* Needle Tip Indicator */}
                      <circle
                        cx={block.needlePath.targetX}
                        cy={block.needlePath.targetY}
                        r="4"
                        fill="#00f0ff"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Local Anesthetic Pool / Hydrodissection spread */}
                      <ellipse
                        cx={block.needlePath.targetX + 6}
                        cy={block.needlePath.targetY + 4}
                        rx="16"
                        ry="9"
                        fill="#00f0ff28"
                        stroke="#00f0ff"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                      {/* Needle Entry Annotation */}
                      <text
                        x={block.needlePath.startX - 35}
                        y={block.needlePath.startY - 10}
                        fill="#38bdf8"
                        fontSize="10"
                        fontWeight="700"
                      >
                        In-Plane Needle ({block.needlePath.angleDeg}°)
                      </text>
                    </g>
                  )}
                </svg>

                {/* Acoustic Depth Caliper Overlay */}
                <div className="sono-caliper">
                  <span>0 cm</span>
                  <span>1 cm</span>
                  <span>2 cm</span>
                  <span>3 cm</span>
                </div>
              </div>

              {/* Bottom Structure Key Pill List */}
              <div className="sono-legend">
                {block.structures.map((s) => (
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

          {/* Right Panel: Detailed Sonoanatomy & Ganga Hospital Block Pearl */}
          <div className="sono-spec-panel">
            {/* Active Structure Inspector */}
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
                <span>Click any acoustic landmark or vessel on the ultrasound screen to inspect details.</span>
              </div>
            )}

            {/* Block Clinical Parameters Card */}
            <div className="sono-clinical-card glass">
              <div className="sono-card-heading">
                <Volume2 size={16} />
                <span>Ganga Hospital Clinical Technique</span>
              </div>
              <p className="sono-ganga-pearl">{block.gangaPearl}</p>

              <div className="sono-dosage-grid">
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Local Anesthetic</span>
                  <span className="sono-dose-val">{block.localAnesthetic.agent}</span>
                </div>
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Recommended Volume</span>
                  <span className="sono-dose-val">{block.localAnesthetic.volume}</span>
                </div>
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Onset</span>
                  <span className="sono-dose-val">{block.localAnesthetic.onset}</span>
                </div>
                <div className="sono-dose-col">
                  <span className="sono-dose-label">Block Duration</span>
                  <span className="sono-dose-val">{block.localAnesthetic.duration}</span>
                </div>
              </div>

              {/* Safety Warning */}
              <div className="sono-warning-box">
                <ShieldAlert size={16} color="#ef4444" className="sono-warn-icon" />
                <span><strong>High-Stakes Warning:</strong> {block.safetyWarning}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
