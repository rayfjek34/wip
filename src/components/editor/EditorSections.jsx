import React, { useRef } from 'react';
import { useCV } from '../../store/CVContext';
import { Input, Textarea, SectionCard, Row } from '../ui/UI';
import styles from './EditorSections.module.css';

export function PersonalSection() {
  const { cv, dispatch } = useCV();
  const p = cv.personal;
  const photoRef = useRef();

  const set = (field) => (e) => dispatch({ type: 'SET_PERSONAL', payload: { [field]: e.target.value } });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => dispatch({ type: 'SET_PERSONAL', payload: { photo: ev.target.result } });
    reader.readAsDataURL(file);
  };

  return (
    <SectionCard title="👤 Personal Information" defaultOpen={true}>
      <div className={styles.photoRow}>
        <div className={styles.photoPreview} onClick={() => photoRef.current?.click()}>
          {p.photo
            ? <img src={p.photo} alt="Profile" className={styles.photoImg} />
            : <div className={styles.photoPlaceholder}><span>📷</span><small>Upload Photo</small></div>
          }
        </div>
        <div style={{ flex: 1 }}>
          <Row>
            <Input label="First Name *" value={p.firstName} onChange={set('firstName')} placeholder="John" />
            <Input label="Middle Name" value={p.middleName} onChange={set('middleName')} placeholder="M." />
            <Input label="Last Name *" value={p.lastName} onChange={set('lastName')} placeholder="Doe" />
          </Row>
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
      </div>
      <Row>
        <Input label="Email *" type="email" value={p.email} onChange={set('email')} placeholder="john@example.com" />
        <Input label="Phone" type="tel" value={p.phone} onChange={set('phone')} placeholder="+1 555 000 0000" />
      </Row>
      <Row>
        <Input label="Website / LinkedIn" type="url" value={p.website} onChange={set('website')} placeholder="https://..." />
        <Input label="Address" value={p.address} onChange={set('address')} placeholder="City, Country" />
        <Input label="Postal Code" value={p.postalCode} onChange={set('postalCode')} placeholder="10001" />
      </Row>
      <Textarea
        label="About / Summary"
        value={p.summary}
        onChange={set('summary')}
        placeholder="A brief professional summary highlighting your key strengths and career goals..."
        rows={4}
      />
    </SectionCard>
  );
}

export function ExperienceSection() {
  const { cv, dispatch } = useCV();
  return (
    <SectionCard title="💼 Work Experience">
      {cv.experience.map((exp, idx) => (
        <div key={exp.id} className={styles.entry}>
          <div className={styles.entryHeader}>
            <span className={styles.entryNum}>{idx + 1}</span>
            <button className={styles.removeBtn} onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', id: exp.id })} title="Remove">✕</button>
          </div>
          <Row>
            <Input label="Job Title *" value={exp.title} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { title: e.target.value } })} placeholder="Software Engineer" />
            <Input label="Company *" value={exp.company} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { company: e.target.value } })} placeholder="Acme Corp" />
          </Row>
          <Row>
            <Input label="Start Date" type="month" value={exp.startDate} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { startDate: e.target.value } })} />
            <Input label="End Date" type="month" value={exp.endDate} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { endDate: e.target.value } })} disabled={exp.current} />
            <div className={styles.checkField}>
              <label><input type="checkbox" checked={exp.current} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { current: e.target.checked, endDate: '' } })} /> Currently working here</label>
            </div>
          </Row>
          <Textarea label="Description" value={exp.description} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { description: e.target.value } })} placeholder="Describe your role and achievements..." rows={3} />
        </div>
      ))}
      <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })}>+ Add Experience</button>
    </SectionCard>
  );
}

export function EducationSection() {
  const { cv, dispatch } = useCV();
  return (
    <SectionCard title="🎓 Education">
      {cv.education.map((edu, idx) => (
        <div key={edu.id} className={styles.entry}>
          <div className={styles.entryHeader}>
            <span className={styles.entryNum}>{idx + 1}</span>
            <button className={styles.removeBtn} onClick={() => dispatch({ type: 'REMOVE_EDUCATION', id: edu.id })} title="Remove">✕</button>
          </div>
          <Row>
            <Input label="Degree / Field *" value={edu.degree} onChange={e => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { degree: e.target.value } })} placeholder="B.Sc. Computer Science" />
            <Input label="Institution *" value={edu.institution} onChange={e => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { institution: e.target.value } })} placeholder="MIT" />
          </Row>
          <Row>
            <Input label="Start Date" type="month" value={edu.startDate} onChange={e => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { startDate: e.target.value } })} />
            <Input label="End Date" type="month" value={edu.endDate} onChange={e => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { endDate: e.target.value } })} disabled={edu.current} />
            <div className={styles.checkField}>
              <label><input type="checkbox" checked={edu.current} onChange={e => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { current: e.target.checked, endDate: '' } })} /> Currently studying</label>
            </div>
          </Row>
          <Textarea label="Description" value={edu.description} onChange={e => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { description: e.target.value } })} placeholder="Awards, thesis, relevant coursework..." rows={2} />
        </div>
      ))}
      <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_EDUCATION' })}>+ Add Education</button>
    </SectionCard>
  );
}

export function SkillsSection() {
  const { cv, dispatch } = useCV();
  const levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
  return (
    <SectionCard title="⚡ Skills">
      <div className={styles.chipGrid}>
        {cv.skills.map(skill => (
          <div key={skill.id} className={styles.chipEntry}>
            <input className={styles.chipInput} value={skill.name} onChange={e => dispatch({ type: 'UPDATE_SKILL', id: skill.id, payload: { name: e.target.value } })} placeholder="Skill name" />
            <select className={styles.chipSelect} value={skill.level} onChange={e => dispatch({ type: 'UPDATE_SKILL', id: skill.id, payload: { level: e.target.value } })}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
            <button className={styles.chipRemove} onClick={() => dispatch({ type: 'REMOVE_SKILL', id: skill.id })}>✕</button>
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_SKILL' })}>+ Add Skill</button>
    </SectionCard>
  );
}

export function CertificationsSection() {
  const { cv, dispatch } = useCV();
  return (
    <SectionCard title="🏆 Certifications" defaultOpen={false}>
      {cv.certifications.map(cert => (
        <div key={cert.id} className={styles.entry}>
          <div className={styles.entryHeader}>
            <span />
            <button className={styles.removeBtn} onClick={() => dispatch({ type: 'REMOVE_CERTIFICATION', id: cert.id })}>✕</button>
          </div>
          <Row>
            <Input label="Certification Name" value={cert.name} onChange={e => dispatch({ type: 'UPDATE_CERTIFICATION', id: cert.id, payload: { name: e.target.value } })} placeholder="AWS Solutions Architect" />
            <Input label="Issuing Authority" value={cert.authority} onChange={e => dispatch({ type: 'UPDATE_CERTIFICATION', id: cert.id, payload: { authority: e.target.value } })} placeholder="Amazon Web Services" />
          </Row>
          <Input label="Description / Date" value={cert.description} onChange={e => dispatch({ type: 'UPDATE_CERTIFICATION', id: cert.id, payload: { description: e.target.value } })} placeholder="Issued Jan 2024 · No expiry" />
        </div>
      ))}
      <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_CERTIFICATION' })}>+ Add Certification</button>
    </SectionCard>
  );
}

export function LanguagesSection() {
  const { cv, dispatch } = useCV();
  const levels = ['Native', 'Fluent', 'Intermediate', 'Basic'];
  return (
    <SectionCard title="🌍 Languages" defaultOpen={false}>
      <div className={styles.chipGrid}>
        {cv.languages.map(lang => (
          <div key={lang.id} className={styles.chipEntry}>
            <input className={styles.chipInput} value={lang.name} onChange={e => dispatch({ type: 'UPDATE_LANGUAGE', id: lang.id, payload: { name: e.target.value } })} placeholder="Language" />
            <select className={styles.chipSelect} value={lang.proficiency} onChange={e => dispatch({ type: 'UPDATE_LANGUAGE', id: lang.id, payload: { proficiency: e.target.value } })}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
            <button className={styles.chipRemove} onClick={() => dispatch({ type: 'REMOVE_LANGUAGE', id: lang.id })}>✕</button>
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_LANGUAGE' })}>+ Add Language</button>
    </SectionCard>
  );
}

export function InterestsSection() {
  const { cv, dispatch } = useCV();
  return (
    <SectionCard title="✨ Interests" defaultOpen={false}>
      <div className={styles.chipGrid}>
        {cv.interests.map(interest => (
          <div key={interest.id} className={styles.chipEntry}>
            <input className={styles.chipInput} value={interest.name} onChange={e => dispatch({ type: 'UPDATE_INTEREST', id: interest.id, payload: { name: e.target.value } })} placeholder="Interest name" />
            <input className={styles.chipInput} value={interest.description} onChange={e => dispatch({ type: 'UPDATE_INTEREST', id: interest.id, payload: { description: e.target.value } })} placeholder="Short description" />
            <button className={styles.chipRemove} onClick={() => dispatch({ type: 'REMOVE_INTEREST', id: interest.id })}>✕</button>
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_INTEREST' })}>+ Add Interest</button>
    </SectionCard>
  );
}

export function CustomSectionsEditor() {
  const { cv, dispatch } = useCV();
  return (
    <>
      {cv.customSections.map(section => (
        <SectionCard key={section.id} title={`📝 ${section.title}`} defaultOpen={false}>
          <Input label="Section Title" value={section.title} onChange={e => dispatch({ type: 'UPDATE_CUSTOM_SECTION', id: section.id, payload: { title: e.target.value } })} />
          {section.entries.map(entry => (
            <div key={entry.id} className={styles.chipEntry} style={{ width: '100%' }}>
              <textarea
                className={styles.chipInput}
                style={{ flex: 1, minHeight: 60, resize: 'vertical' }}
                value={entry.content}
                onChange={e => dispatch({ type: 'UPDATE_CUSTOM_ENTRY', sectionId: section.id, id: entry.id, content: e.target.value })}
                placeholder="Entry content..."
              />
              <button className={styles.chipRemove} onClick={() => dispatch({ type: 'REMOVE_CUSTOM_ENTRY', sectionId: section.id, id: entry.id })}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className={styles.addBtn} onClick={() => dispatch({ type: 'ADD_CUSTOM_ENTRY', sectionId: section.id })}>+ Add Entry</button>
            <button className={styles.removeBtn} style={{ marginLeft: 'auto' }} onClick={() => dispatch({ type: 'REMOVE_CUSTOM_SECTION', id: section.id })}>Remove Section</button>
          </div>
        </SectionCard>
      ))}
      <button className={styles.addSectionBtn} onClick={() => dispatch({ type: 'ADD_CUSTOM_SECTION' })}>+ Add Custom Section</button>
    </>
  );
}
