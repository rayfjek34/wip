import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { useCV } from '../../store/CVContext';
import { exportPDF, exportDOCX } from '../../utils/exportUtils';
import styles from './Toolbar.module.css';

export default function Toolbar({ onTogglePreview, previewVisible }) {
  const {
    theme, toggleTheme, setAppState,
    setShowFeedback, setPendingExport,
    feedbackGiven,
  } = useApp();
  const { cv, dispatch } = useCV();
  const [exporting, setExporting] = useState(false);

  const fullName = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(' ') || 'Untitled CV';
  const filename = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join('_') || 'resume';

  const triggerExport = async (type) => {
    if (feedbackGiven) {
      setExporting(true);
      try {
        if (type === 'pdf') await exportPDF('cv-preview-root', `${filename}_cv.pdf`);
        else await exportDOCX(cv, `${filename}_cv.docx`);
      } finally {
        setExporting(false);
      }
    } else {
      setPendingExport(type);
      setShowFeedback(true);
    }
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    if (window.confirm('Reset all CV data? This cannot be undone.')) {
      dispatch({ type: 'RESET_CV' });
    }
  };

  const handleDuplicate = (e) => {
    dispatch({ type: 'LOAD_CV', payload: JSON.parse(JSON.stringify(cv)) });
    const btn = e.currentTarget;
    const prev = btn.innerHTML;
    btn.innerHTML = '✓ <span class="btnLabel">Copied!</span>';
    setTimeout(() => { btn.innerHTML = prev; }, 1600);
  };

  return (
    <header className={styles.toolbar}>
      <div className={styles.left}>
        <button className={styles.logoBtn} onClick={() => setAppState('landing')} title="Back to home">
          <span className={styles.logoText}>
            CV<span className={styles.logoAccent}>Maker</span>
          </span>
        </button>
        <span className={styles.sep}>·</span>
        <span className={styles.docName}>{fullName}</span>
      </div>

      <div className={styles.center}>
        <div className={styles.privacyBadge}>
          <span>🔒</span>
          <span>No data stored or transmitted</span>
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={`${styles.actionBtn} ${styles.mobileOnly}`}
          onClick={onTogglePreview}
          title={previewVisible ? 'Show Editor' : 'Show Preview'}
        >
          {previewVisible ? '✏️' : '👁'}
        </button>

        <button className={styles.actionBtn} onClick={handlePrint} title="Print CV">
          🖨️ <span className={styles.btnLabel}>Print</span>
        </button>

        <button className={styles.actionBtn} onClick={handleDuplicate} title="Duplicate CV session data">
          ⧉ <span className={styles.btnLabel}>Duplicate</span>
        </button>

        <button className={styles.actionBtn} onClick={handleReset} title="Reset all CV data">
          🗑 <span className={styles.btnLabel}>Reset</span>
        </button>

        <div className={styles.divider} />

        <button
          className={`${styles.exportBtn} ${styles.docxBtn}`}
          onClick={() => triggerExport('docx')}
          disabled={exporting}
          title="Export as Word document"
        >
          📝 <span>DOCX</span>
        </button>

        <button
          className={`${styles.exportBtn} ${styles.pdfBtn}`}
          onClick={() => triggerExport('pdf')}
          disabled={exporting}
          title="Export as PDF"
        >
          {exporting ? '⏳' : '⬇'} <span>PDF</span>
        </button>

        <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle light/dark mode">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
