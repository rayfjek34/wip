import React from 'react';
import './templates.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m) - 1] || ''} ${y}`;
}

function DateRange({ start, end, current }) {
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  if (!s && !e) return null;
  return <span className="cv-date">{[s, e].filter(Boolean).join(' – ')}</span>;
}

// ─── CLASSIC TEMPLATE ───────────────────────────────────────────────
export function ClassicTemplate({ cv }) {
  const p = cv.personal;
  const name = [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ');
  return (
    <div className="cv-classic" id="cv-preview-root">
      <header className="cv-classic-header">
        <div className="cv-classic-name-block">
          {p.photo && <img src={p.photo} className="cv-photo" alt="Profile" />}
          <div>
            <h1 className="cv-name">{name || 'Your Name'}</h1>
            <div className="cv-contact">
              {[p.email, p.phone, p.website, p.address].filter(Boolean).map((v,i) => (
                <span key={i}>{v}</span>
              ))}
            </div>
          </div>
        </div>
        {p.summary && <p className="cv-summary">{p.summary}</p>}
      </header>

      {cv.experience?.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Work Experience</h2>
          {cv.experience.map(e => (
            <div key={e.id} className="cv-item">
              <div className="cv-item-header">
                <div><strong>{e.title}</strong>{e.company && <span className="cv-company"> · {e.company}</span>}</div>
                <DateRange start={e.startDate} end={e.endDate} current={e.current} />
              </div>
              {e.description && <p className="cv-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {cv.education?.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          {cv.education.map(e => (
            <div key={e.id} className="cv-item">
              <div className="cv-item-header">
                <div><strong>{e.degree}</strong>{e.institution && <span className="cv-company"> · {e.institution}</span>}</div>
                <DateRange start={e.startDate} end={e.endDate} current={e.current} />
              </div>
              {e.description && <p className="cv-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {cv.skills?.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Skills</h2>
          <div className="cv-skills-classic">
            {cv.skills.map(s => <span key={s.id} className="cv-skill-tag">{s.name}{s.level ? ` · ${s.level}` : ''}</span>)}
          </div>
        </section>
      )}

      {cv.certifications?.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Certifications</h2>
          {cv.certifications.map(c => (
            <div key={c.id} className="cv-item">
              <div className="cv-item-header"><strong>{c.name}</strong>{c.authority && <span className="cv-company"> · {c.authority}</span>}</div>
              {c.description && <p className="cv-desc">{c.description}</p>}
            </div>
          ))}
        </section>
      )}

      {cv.languages?.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Languages</h2>
          <div className="cv-skills-classic">
            {cv.languages.map(l => <span key={l.id} className="cv-skill-tag">{l.name} · {l.proficiency}</span>)}
          </div>
        </section>
      )}

      {cv.interests?.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Interests</h2>
          <div className="cv-skills-classic">
            {cv.interests.map(i => <span key={i.id} className="cv-skill-tag">{i.name}</span>)}
          </div>
        </section>
      )}

      {cv.customSections?.map(sec => sec.entries?.length > 0 && (
        <section key={sec.id} className="cv-section">
          <h2 className="cv-section-title">{sec.title}</h2>
          {sec.entries.map(e => <p key={e.id} className="cv-desc">{e.content}</p>)}
        </section>
      ))}
    </div>
  );
}

// ─── MODERN TEMPLATE ────────────────────────────────────────────────
export function ModernTemplate({ cv }) {
  const p = cv.personal;
  const name = [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ');
  return (
    <div className="cv-modern" id="cv-preview-root">
      <aside className="cv-modern-sidebar">
        {p.photo && <img src={p.photo} className="cv-photo-modern" alt="Profile" />}
        <h1 className="cv-modern-name">{name || 'Your Name'}</h1>
        <div className="cv-modern-contact">
          {p.email && <div><span>✉</span>{p.email}</div>}
          {p.phone && <div><span>📞</span>{p.phone}</div>}
          {p.website && <div><span>🔗</span>{p.website}</div>}
          {p.address && <div><span>📍</span>{p.address}</div>}
        </div>
        {cv.skills?.length > 0 && (
          <div className="cv-modern-sidebar-section">
            <h3>Skills</h3>
            {cv.skills.map(s => (
              <div key={s.id} className="cv-skill-bar-wrap">
                <div className="cv-skill-bar-label">{s.name}</div>
                <div className="cv-skill-bar"><div className="cv-skill-bar-fill" style={{ width: `${{ Beginner:20, Elementary:40, Intermediate:60, Advanced:80, Expert:100 }[s.level] || 60}%` }} /></div>
              </div>
            ))}
          </div>
        )}
        {cv.languages?.length > 0 && (
          <div className="cv-modern-sidebar-section">
            <h3>Languages</h3>
            {cv.languages.map(l => <div key={l.id} className="cv-lang-item"><span>{l.name}</span><small>{l.proficiency}</small></div>)}
          </div>
        )}
        {cv.interests?.length > 0 && (
          <div className="cv-modern-sidebar-section">
            <h3>Interests</h3>
            <div className="cv-interests-list">{cv.interests.map(i => <span key={i.id}>{i.name}</span>)}</div>
          </div>
        )}
      </aside>

      <main className="cv-modern-main">
        {p.summary && (
          <section className="cv-modern-section">
            <h2>Profile</h2>
            <p className="cv-desc">{p.summary}</p>
          </section>
        )}
        {cv.experience?.length > 0 && (
          <section className="cv-modern-section">
            <h2>Experience</h2>
            {cv.experience.map(e => (
              <div key={e.id} className="cv-modern-item">
                <div className="cv-modern-item-meta">
                  <DateRange start={e.startDate} end={e.endDate} current={e.current} />
                </div>
                <div className="cv-modern-item-content">
                  <strong>{e.title}</strong>
                  {e.company && <span className="cv-company-modern">{e.company}</span>}
                  {e.description && <p className="cv-desc">{e.description}</p>}
                </div>
              </div>
            ))}
          </section>
        )}
        {cv.education?.length > 0 && (
          <section className="cv-modern-section">
            <h2>Education</h2>
            {cv.education.map(e => (
              <div key={e.id} className="cv-modern-item">
                <div className="cv-modern-item-meta">
                  <DateRange start={e.startDate} end={e.endDate} current={e.current} />
                </div>
                <div className="cv-modern-item-content">
                  <strong>{e.degree}</strong>
                  {e.institution && <span className="cv-company-modern">{e.institution}</span>}
                  {e.description && <p className="cv-desc">{e.description}</p>}
                </div>
              </div>
            ))}
          </section>
        )}
        {cv.certifications?.length > 0 && (
          <section className="cv-modern-section">
            <h2>Certifications</h2>
            {cv.certifications.map(c => (
              <div key={c.id} className="cv-modern-item">
                <div className="cv-modern-item-content">
                  <strong>{c.name}</strong>
                  {c.authority && <span className="cv-company-modern">{c.authority}</span>}
                  {c.description && <p className="cv-desc">{c.description}</p>}
                </div>
              </div>
            ))}
          </section>
        )}
        {cv.customSections?.map(sec => sec.entries?.length > 0 && (
          <section key={sec.id} className="cv-modern-section">
            <h2>{sec.title}</h2>
            {sec.entries.map(e => <p key={e.id} className="cv-desc">{e.content}</p>)}
          </section>
        ))}
      </main>
    </div>
  );
}

// ─── MINIMAL TEMPLATE ───────────────────────────────────────────────
export function MinimalTemplate({ cv }) {
  const p = cv.personal;
  const name = [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ');
  return (
    <div className="cv-minimal" id="cv-preview-root">
      <header className="cv-minimal-header">
        <div className="cv-minimal-name-row">
          {p.photo && <img src={p.photo} className="cv-photo-minimal" alt="Profile" />}
          <h1 className="cv-minimal-name">{name || 'Your Name'}</h1>
        </div>
        <div className="cv-minimal-contact">
          {[p.email, p.phone, p.website, p.address].filter(Boolean).join('  ·  ')}
        </div>
        {p.summary && <p className="cv-minimal-summary">{p.summary}</p>}
      </header>
      <div className="cv-minimal-divider" />

      {cv.experience?.length > 0 && (
        <section className="cv-minimal-section">
          <h2 className="cv-minimal-title">EXPERIENCE</h2>
          {cv.experience.map(e => (
            <div key={e.id} className="cv-minimal-item">
              <div className="cv-minimal-row">
                <span><strong>{e.title}</strong>{e.company && `, ${e.company}`}</span>
                <DateRange start={e.startDate} end={e.endDate} current={e.current} />
              </div>
              {e.description && <p className="cv-desc cv-minimal-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {cv.education?.length > 0 && (
        <section className="cv-minimal-section">
          <h2 className="cv-minimal-title">EDUCATION</h2>
          {cv.education.map(e => (
            <div key={e.id} className="cv-minimal-item">
              <div className="cv-minimal-row">
                <span><strong>{e.degree}</strong>{e.institution && `, ${e.institution}`}</span>
                <DateRange start={e.startDate} end={e.endDate} current={e.current} />
              </div>
              {e.description && <p className="cv-desc cv-minimal-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {cv.skills?.length > 0 && (
        <section className="cv-minimal-section">
          <h2 className="cv-minimal-title">SKILLS</h2>
          <p className="cv-desc">{cv.skills.map(s => `${s.name}${s.level ? ` (${s.level})` : ''}`).join(' · ')}</p>
        </section>
      )}

      {cv.certifications?.length > 0 && (
        <section className="cv-minimal-section">
          <h2 className="cv-minimal-title">CERTIFICATIONS</h2>
          {cv.certifications.map(c => (
            <div key={c.id} className="cv-minimal-item">
              <div className="cv-minimal-row">
                <strong>{c.name}</strong>
                {c.authority && <span className="cv-date">{c.authority}</span>}
              </div>
              {c.description && <p className="cv-desc cv-minimal-desc">{c.description}</p>}
            </div>
          ))}
        </section>
      )}

      {(cv.languages?.length > 0 || cv.interests?.length > 0) && (
        <section className="cv-minimal-section cv-minimal-two-col">
          {cv.languages?.length > 0 && (
            <div>
              <h2 className="cv-minimal-title">LANGUAGES</h2>
              <p className="cv-desc">{cv.languages.map(l => `${l.name} (${l.proficiency})`).join(' · ')}</p>
            </div>
          )}
          {cv.interests?.length > 0 && (
            <div>
              <h2 className="cv-minimal-title">INTERESTS</h2>
              <p className="cv-desc">{cv.interests.map(i => i.name).join(' · ')}</p>
            </div>
          )}
        </section>
      )}

      {cv.customSections?.map(sec => sec.entries?.length > 0 && (
        <section key={sec.id} className="cv-minimal-section">
          <h2 className="cv-minimal-title">{sec.title?.toUpperCase()}</h2>
          {sec.entries.map(e => <p key={e.id} className="cv-desc cv-minimal-desc">{e.content}</p>)}
        </section>
      ))}
    </div>
  );
}
