import { formatDate } from '../utils/dateFormat';

const levelLabel = { 'Başlangıç': 'Temel', 'Orta': 'Orta', 'İleri': 'İleri', 'Uzman': 'Uzman' };
const levelPct = { 'Başlangıç': 25, 'Orta': 50, 'İleri': 75, 'Uzman': 95 };

function ElegantSkill({ name, level }) {
  return (
    <div className="elgSkill">
      <div className="elgSkillRow">
        <span className="elgSkillName">{name}</span>
        <span className="elgSkillLevel">{levelLabel[level] || level}</span>
      </div>
      <div className="elgSkillTrack">
        <div className="elgSkillFill" style={{ width: `${levelPct[level] || 50}%` }} />
      </div>
    </div>
  );
}

export default function ElegantTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const lang = data.language || 'tr';

  const sectionTitles = {
    summary: lang === 'tr' ? 'Özet' : 'Summary',
    experience: lang === 'tr' ? 'Deneyim' : 'Experience',
    education: lang === 'tr' ? 'Eğitim' : 'Education',
    skills: lang === 'tr' ? 'Uzmanlıklar' : 'Expertise',
    languages: lang === 'tr' ? 'Diller' : 'Languages',
    certifications: lang === 'tr' ? 'Sertifikalar' : 'Certifications',
  };

  return (
    <div className="elgTemplate">
      {personal?.fullName && (
        <header className="elgHeader">
          <div className="elgHeaderLeft">
            <h1 className="elgName">{personal.fullName}</h1>
            {personal.title && <div className="elgTitle">{personal.title}</div>}
          </div>
          <div className="elgHeaderRight">
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.address && <div>{personal.address}</div>}
            {personal.linkedin && <div>{personal.linkedin}</div>}
            {personal.github && <div>{personal.github}</div>}
            {personal.website && <div>{personal.website}</div>}
            {personal.portfolio && <div>{personal.portfolio}</div>}
          </div>
        </header>
      )}

      <div className="elgBody">
        <div className="elgMain">
          {summary && (
            <section className="elgSection">
              <h2 className="elgSecTitle">{sectionTitles.summary}</h2>
              <p className="elgText">{summary}</p>
            </section>
          )}

          {experience.some(e => e.company) && (
            <section className="elgSection">
              <h2 className="elgSecTitle">{sectionTitles.experience}</h2>
              {experience.filter(e => e.company).map(exp => (
                <div key={exp.id} className="elgExp">
                  <div className="elgExpHead">
                    <strong className="elgExpPos">{exp.position}</strong>
                    <span className="elgExpDate">{formatDate(exp.startDate, lang)} — {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}</span>
                  </div>
                  <em className="elgExpComp">{exp.company}</em>
                  {exp.description && (
                    <ul className="elgBullets">
                      {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                        <li key={i}>{line.replace(/^[•\-]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {education.some(e => e.school) && (
            <section className="elgSection">
              <h2 className="elgSecTitle">{sectionTitles.education}</h2>
              {education.filter(e => e.school).map(edu => (
                <div key={edu.id} className="elgExp">
                  <div className="elgExpHead">
                    <strong className="elgExpPos">{edu.degree} — {edu.field}</strong>
                    <span className="elgExpDate">{formatDate(edu.startDate, lang)} — {formatDate(edu.endDate, lang)}</span>
                  </div>
                  <em className="elgExpComp">{edu.school}{edu.gpa ? `  |  GPA: ${edu.gpa}` : ''}</em>
                </div>
              ))}
            </section>
          )}

          {certifications.some(c => c.name) && (
            <section className="elgSection">
              <h2 className="elgSecTitle">{sectionTitles.certifications}</h2>
              {certifications.filter(c => c.name).map(cert => (
                <div key={cert.id} className="elgExp">
                  <strong>{cert.name}</strong>
                  <em className="elgExpComp">{cert.issuer}{cert.date ? ` · ${formatDate(cert.date, lang)}` : ''}</em>
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="elgSide">
          <div className="elgSideInner">
            {education.some(e => e.school) && (
              <section className="elgSection">
                <h2 className="elgSecTitle">{sectionTitles.education}</h2>
                {education.filter(e => e.school).map(edu => (
                  <div key={edu.id} className="elgSideItem">
                    <div className="elgSideSchool">{edu.school}</div>
                    <div className="elgSideDetail">{edu.degree} — {edu.field}</div>
                    <div className="elgSideDate">{formatDate(edu.startDate, lang)} — {formatDate(edu.endDate, lang)}</div>
                  </div>
                ))}
              </section>
            )}

            {skills.filter(s => s.name).length > 0 && (
              <section className="elgSection">
                <h2 className="elgSecTitle">{sectionTitles.skills}</h2>
                {['languages','frameworks','tools','databases','other'].map((cat, ci) => {
                  const items = skills.filter(s => s.category === cat && s.name);
                  if (items.length === 0) return null;
                  const catLabels = { languages: 'Diller & Teknolojiler', frameworks: 'Framework & Kütüphaneler', tools: 'Araçlar & Platformlar', databases: 'Veritabanları', other: 'Diğer' };
                  return (
                    <div key={cat} className="elgSkillGroup">
                      <span className="elgSkillCat">{catLabels[cat]}</span>
                      {items.map((s, i) => (
                        <ElegantSkill key={`${ci}-${i}`} name={s.name} level={s.level} />
                      ))}
                    </div>
                  );
                })}
              </section>
            )}

            {languages.some(l => l.name) && (
              <section className="elgSection">
                <h2 className="elgSecTitle">{sectionTitles.languages}</h2>
                {languages.filter(l => l.name).map(l => (
                  <div key={l.id} className="elgSideItem">{l.name} — {l.level}</div>
                ))}
              </section>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
