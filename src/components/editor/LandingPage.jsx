import React, { useState, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { useCV } from '../../store/CVContext';
import { parseCV } from '../../utils/parseCV';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const { setAppState, theme, toggleTheme } = useApp();
  const { dispatch } = useCV();
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    setParsing(true);
    setError('');
    setParseProgress(`Reading ${file.name}…`);
    try {
      await new Promise(r => setTimeout(r, 120)); // let UI update
      setParseProgress('Extracting content…');
      const data = await parseCV(file);
      setParseProgress('Mapping fields…');
      await new Promise(r => setTimeout(r, 80));
      dispatch({ type: 'LOAD_CV', payload: data });
      setParseProgress('Done!');
      await new Promise(r => setTimeout(r, 300));
      setAppState('editor');
    } catch (e) {
      setError(e.message || 'Failed to parse file. Try another format.');
    } finally {
      setParsing(false);
      setParseProgress('');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const startFresh = () => {
    dispatch({ type: 'RESET_CV' });
    setAppState('editor');
  };

  return (
    <div className={styles.landing}>
      <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className={styles.hero}>
        <div className={styles.badge}>
          <span>🔒</span> Privacy-First
        </div>

        <h1 className={styles.title}>
          CV<span className={styles.accent}>Maker</span>
        </h1>

        <p className={styles.tagline}>
          Build a professional resume in minutes.<br />
          No account. No tracking. No data ever leaves your device.
        </p>

        <div className={styles.cards}>
          {/* Upload Card */}
          <div
            className={`${styles.card} ${styles.cardUpload} ${dragging ? styles.dragging : ''} ${parsing ? styles.cardParsing : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !parsing && fileRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload existing CV"
            onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />

            <div className={styles.cardIconWrap}>
              {parsing
                ? <span className={styles.spinnerEmoji}>⏳</span>
                : <span className={styles.cardIcon}>📤</span>
              }
            </div>

            <h2 className={styles.cardTitle}>Upload Existing CV</h2>
            <p className={styles.cardDesc}>
              Import a PDF or DOCX — we'll extract your name, contact info,
              experience, education, and skills automatically. Then edit freely.
            </p>

            {parsing ? (
              <div className={styles.parseProgress}>
                <div className={styles.progressBar}><div className={styles.progressFill} /></div>
                <span>{parseProgress}</span>
              </div>
            ) : (
              <div className={styles.dropHint}>
                Drop file here or click to browse
                <span className={styles.formats}>PDF · DOCX</span>
              </div>
            )}

            {error && <div className={styles.errorMsg}>⚠ {error}</div>}
          </div>

          {/* Scratch Card */}
          <div
            className={`${styles.card} ${styles.cardScratch}`}
            onClick={startFresh}
            role="button"
            tabIndex={0}
            aria-label="Start CV from scratch"
            onKeyDown={e => e.key === 'Enter' && startFresh()}
          >
            <div className={styles.cardIconWrap}>
              <span className={styles.cardIcon}>✏️</span>
            </div>
            <h2 className={styles.cardTitle}>Start From Scratch</h2>
            <p className={styles.cardDesc}>
              Build your CV step by step with our guided editor.
              All sections, real-time preview, and 3 professional templates.
            </p>
            <div className={styles.startArrow}>
              Get started <span>→</span>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className={styles.features}>
          {[
            ['🎨', '3 Templates'],
            ['👁', 'Live Preview'],
            ['⬇', 'PDF & DOCX Export'],
            ['↕', 'Drag to Reorder'],
            ['🌙', 'Dark Mode'],
            ['🚫', 'Zero Tracking'],
          ].map(([icon, label]) => (
            <div key={label} className={styles.pill}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>

        <p className={styles.footer}>
          All processing happens locally in your browser.
          No servers. No cookies. No analytics.
        </p>
      </div>
    </div>
  );
}
