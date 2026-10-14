css_additions = """
/* ─── DETAIL SHEET & ACTION PILL ENHANCEMENTS (FIX CRIMPED TEXT & X-RAY BUTTON) ─── */
.detail-sheet {
  top: 75px !important;
  bottom: 75px !important;
  right: 28px !important;
  width: 380px !important;
  max-width: 380px !important;
  padding: 18px 20px !important;
  gap: 10px !important;
  border-radius: 14px !important;
  display: flex !important;
  flex-direction: column !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18), 0 0 25px rgba(0, 240, 255, 0.08) !important;
}

@media (max-width: 767px) {
  .detail-sheet {
    left: 12px !important;
    right: 12px !important;
    top: auto !important;
    bottom: calc(115px + env(safe-area-inset-bottom)) !important;
    width: auto !important;
    max-width: none !important;
    max-height: 75dvh !important;
    padding: 16px !important;
  }
}

.detail-header {
  gap: 4px !important;
  padding-right: 24px !important;
  margin-bottom: 2px !important;
}

.detail-header .structure-title {
  font-size: 19px !important;
  line-height: 1.25 !important;
  font-weight: 700 !important;
  letter-spacing: -0.4px !important;
  color: #0f172a !important;
  margin-top: 2px !important;
}

.detail-header .eyebrow {
  font-size: 10px !important;
  letter-spacing: 0.12em !important;
  font-weight: 700 !important;
  color: #0284c7 !important;
}

.detail-accent {
  width: 28px !important;
  height: 3px !important;
  border-radius: 2px !important;
  margin-bottom: 2px !important;
}

.pg-tab-bar {
  margin: 4px 0 8px !important;
}

.detail-scroll {
  flex: 1 1 auto !important;
  min-height: 180px !important;
  overflow-y: auto !important;
  overscroll-behavior: contain !important;
  scrollbar-width: thin !important;
  scrollbar-color: #94a3b844 transparent !important;
  padding-right: 4px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
}

.detail-scroll::-webkit-scrollbar {
  width: 5px !important;
}

.detail-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1 !important;
  border-radius: 4px !important;
}

.structure-description {
  font-size: 13px !important;
  line-height: 1.55 !important;
  color: #334155 !important;
  margin: 0 !important;
}

.detail-actions {
  flex-shrink: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  padding-top: 8px !important;
  border-top: 1px solid #e2e8f0 !important;
}

.detail-action-row {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 8px !important;
}

.action-pill-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  padding: 9px 10px !important;
  border-radius: 8px !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  border: 1px solid #cbd5e1 !important;
  background: #1e293b !important;
  color: #ffffff !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  white-space: nowrap !important;
}

.action-pill-btn:hover {
  background: #334155 !important;
}

.action-pill-btn.active {
  background: #0284c7 !important;
  border-color: #0284c7 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35) !important;
}

/* X-Ray Ghost Button (100% visible, high-contrast, teal-accented) */
.action-pill-btn.xray {
  background: #ffffff !important;
  color: #0f172a !important;
  border: 1.5px solid #0f766e55 !important;
}

.action-pill-btn.xray:hover {
  background: #f0fdfa !important;
  border-color: #0f766e !important;
  color: #0f766e !important;
}

.action-pill-btn.xray.active {
  background: #0f766e !important;
  color: #ffffff !important;
  border-color: #0f766e !important;
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.35) !important;
}

.action-pill-btn svg {
  flex-shrink: 0 !important;
}

.action-pill-btn.xray:not(.active) svg {
  color: #0f766e !important;
}

.secondary-action {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #64748b !important;
  padding: 4px 8px !important;
  min-height: 28px !important;
}

/* ─── CLINICAL PRESETS BAR (ENSURE CARDIOPULMONARY & ALL PILLS NEVER CLIP) ─── */
.clinical-presets-bar {
  position: absolute !important;
  top: 92px !important;
  left: 32px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  z-index: 10 !important;
  max-width: calc(100vw - 64px) !important;
  overflow-x: auto !important;
  padding: 6px 12px !important;
  padding-right: 32px !important;
  border-radius: 12px !important;
  scrollbar-width: thin !important;
  scrollbar-color: #cbd5e1 transparent !important;
  scroll-behavior: smooth !important;
}

@media (min-width: 1150px) {
  /* On wide screens with detail sheet open, preserve right-side clearance */
  body:has(.detail-sheet) .clinical-presets-bar {
    max-width: calc(100vw - 440px) !important;
  }
}

.clinical-presets-bar::-webkit-scrollbar {
  height: 5px !important;
  display: block !important;
}

.clinical-presets-bar::-webkit-scrollbar-track {
  background: transparent !important;
}

.clinical-presets-bar::-webkit-scrollbar-thumb {
  background: #cbd5e1 !important;
  border-radius: 4px !important;
}

.clinical-presets-bar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8 !important;
}

.clinical-preset-btn {
  flex-shrink: 0 !important;
  white-space: nowrap !important;
  padding: 7px 12px !important;
  font-size: 11.5px !important;
}
"""

with open('app/globals.css', 'a', encoding='utf-8') as f:
    f.write(css_additions)

print('Successfully appended enhanced CSS fixes to app/globals.css!')
