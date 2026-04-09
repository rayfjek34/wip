import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { useCV } from '../../store/CVContext';
import { exportPDF, exportDOCX } from '../../utils/exportUtils';
import styles from './FeedbackModal.module.css';

export default function FeedbackModal() {
  const { setShowFeedback, pendingExport, setPendingExport, setFeedbackGiven, template } = useApp();
  const { cv } = useCV();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [exporting, setExporting] = useState(false);

  const name = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join('_') || 'resume';

  const handleSubmit = () => {
    if (!rating) return;
    const feedback = { rating, review, template, timestamp: new Date().toISOString() };
    console.log('[CVMaker Feedback]', feedback);
    setSubmitted(true);
    setFeedbackGiven(true);
  };

  const handleDownload = async () => {
    setExporting(true);
    try {
      if (pendingExport === 'pdf') {
        await exportPDF('cv-preview-root', `${name}_cv.pdf`);
      } else {
        await exportDOCX(cv, `${name}_cv.docx`);
      }
    } finally {
      setExporting(false);
      setShowFeedback(false);
      setPendingExport(null);
    }
  };

  const close = () => {
    setShowFeedback(false);
    setPendingExport(null);
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={close}>✕</button>

        {!submitted ? (
          <>
            <div className={styles.icon}>💬</div>
            <h2 className={styles.title}>Before you download…</h2>
            <p className={styles.subtitle}>Take 10 seconds to rate your experience. It helps us improve.</p>

            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={`${styles.star} ${n <= (hover || rating) ? styles.starActive : ''}`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className={styles.ratingLabel}>
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
              </div>
            )}

            <textarea
              className={styles.review}
              placeholder="Optional: share any thoughts or suggestions…"
              value={review}
              onChange={e => setReview(e.target.value)}
              rows={3}
            />

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!rating}
            >
              Submit & Unlock Download
            </button>

            <p className={styles.privacyNote}>
              🔒 Your feedback is not stored or transmitted. Console log only.
            </p>
          </>
        ) : (
          <>
            <div className={styles.icon}>🎉</div>
            <h2 className={styles.title}>Thanks for your feedback!</h2>
            <p className={styles.subtitle}>Your {pendingExport?.toUpperCase()} is ready to download.</p>

            <button
              className={styles.downloadBtn}
              onClick={handleDownload}
              disabled={exporting}
            >
              {exporting ? 'Preparing…' : `⬇ Download ${pendingExport?.toUpperCase()}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
