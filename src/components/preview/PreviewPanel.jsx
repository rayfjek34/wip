import React, { useState } from 'react';
import { useCV } from '../../store/CVContext';
import { useApp } from '../../store/AppContext';
import { ClassicTemplate, ModernTemplate, MinimalTemplate } from '../templates/Templates';
import styles from './PreviewPanel.module.css';

const TEMPLATES = [
  { id: 'classic', label: 'Classic', icon: '📋' },
  { id: 'modern',  label: 'Modern',  icon: '⚡' },
  { id: 'minimal', label: 'Minimal', icon: '✦'  },
];

const ZOOM_STEPS = [0.45, 0.55, 0.65, 0.75, 0.85, 1.0];

export default function PreviewPanel() {
  const { cv } = useCV();
  const { template, setTemplate } = useApp();
  const [zoomIdx, setZoomIdx] = useState(2); // default 0.65

  const zoom = ZOOM_STEPS[zoomIdx];
  const hasContent = cv.personal.firstName || cv.personal.lastName || cv.experience?.length > 0;

  const TemplateComp =
    template === 'modern'  ? ModernTemplate  :
    template === 'minimal' ? MinimalTemplate :
    ClassicTemplate;

  return (
    <div className={styles.panel}>
      {/* Template & zoom toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.templateTabs}>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${template === t.id ? styles.tabActive : ''}`}
              onClick={() => setTemplate(t.id)}
              title={`${t.label} template`}
            >
              <span className={styles.tabIcon}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.zoomRow}>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoomIdx(i => Math.max(0, i - 1))}
            disabled={zoomIdx === 0}
            title="Zoom out"
          >−</button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoomIdx(i => Math.min(ZOOM_STEPS.length - 1, i + 1))}
            disabled={zoomIdx === ZOOM_STEPS.length - 1}
            title="Zoom in"
          >+</button>
        </div>
      </div>

      {/* Preview area */}
      <div className={styles.previewScroll}>
        {!hasContent && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👈</div>
            <p>Start filling in the editor<br />to see your CV appear here</p>
          </div>
        )}

        <div
          className={styles.pageWrap}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            marginBottom: `calc(${zoom * 297}mm - 297mm + 2rem)`,
          }}
        >
          <TemplateComp cv={cv} />
        </div>
      </div>
    </div>
  );
}
