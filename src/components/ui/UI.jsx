import React from 'react';
import styles from './UI.module.css';

export function Input({ label, error, hint, className, required, ...props }) {
  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input className={`${styles.input} ${error ? styles.inputError : ''}`} {...props} />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, hint, className, rows = 4, required, ...props }) {
  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        className={`${styles.input} ${styles.textarea} ${error ? styles.inputError : ''}`}
        rows={rows}
        {...props}
      />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export function Select({ label, options, error, hint, className, required, ...props }) {
  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        className={`${styles.input} ${styles.select} ${error ? styles.inputError : ''}`}
        {...props}
      >
        {options.map(opt =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className, icon, ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${styles[`btn_${size}`]} ${className || ''}`}
      {...props}
    >
      {icon && <span className={styles.btnIcon}>{icon}</span>}
      {children}
    </button>
  );
}

export function SectionCard({ title, children, collapsible = true, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={styles.sectionCard}>
      <button
        className={styles.sectionHeader}
        onClick={() => collapsible && setOpen(o => !o)}
        type="button"
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>{title}</span>
        {collapsible && (
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▼</span>
        )}
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

export function IconBtn({ icon, title, onClick, danger, className }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`${styles.iconBtn} ${danger ? styles.iconBtnDanger : ''} ${className || ''}`}
    >
      {icon}
    </button>
  );
}

export function Row({ children, cols }) {
  return (
    <div
      className={styles.row}
      style={cols ? { gridTemplateColumns: `repeat(${cols}, 1fr)` } : undefined}
    >
      {children}
    </div>
  );
}

export function SkillLevelBar({ level }) {
  const pct = { Beginner: 20, Elementary: 40, Intermediate: 60, Advanced: 80, Expert: 100 }[level] || 60;
  return (
    <div className={styles.levelBar} title={level}>
      <div className={styles.levelFill} style={{ width: `${pct}%` }} />
    </div>
  );
}
