import React, { useState } from 'react';
import { useCV } from '../../store/CVContext';
import { useCVScore } from '../../utils/useCVScore';
import styles from './ScoreBar.module.css';

export default function ScoreBar() {
  const { cv } = useCV();
  const { score, label, missing } = useCVScore(cv);
  const [showTips, setShowTips] = useState(false);

  const color = score >= 80 ? 'great' : score >= 50 ? 'good' : 'low';

  return (
    <div className={styles.wrap}>
      <div className={styles.header} onClick={() => missing.length > 0 && setShowTips(v => !v)}>
        <div className={styles.left}>
          <span className={styles.scoreNum} data-color={color}>{score}%</span>
          <span className={styles.scoreLabel}>{label}</span>
        </div>
        <div className={styles.barWrap}>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              data-color={color}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        {missing.length > 0 && (
          <button className={styles.tipBtn} title="Show tips">
            {showTips ? '▲' : '▼'} {missing.length} tip{missing.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {showTips && missing.length > 0 && (
        <div className={styles.tips}>
          <p className={styles.tipsLabel}>Add these to improve your CV:</p>
          <ul className={styles.tipsList}>
            {missing.map(m => (
              <li key={m}>
                <span className={styles.tipDot} /> {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
