import { formatDate } from '../utils/dateFormat';

const levelLabel = { 'Başlangıç': 'Temel', 'Orta': 'Orta', 'İleri': 'İleri', 'Uzman': 'Uzman' };
const levelPct = { 'Başlangıç': 25, 'Orta': 50, 'İleri': 75, 'Uzman': 95 };

function DevSkillBar({ name, level }) {
  const pct = levelPct[level] || 50;
  return (
    <div className="devSkill">
      <div className="devSkillRow">
        <span className="devSkillName">{name}</span>
        <span className="devSkillLevel">{levelLabel[level] || level}</span>
      </div>
      <div className="devSkillTrack">
        <div className="devSkillFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DeveloperTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const lang = data.language || 'tr';

  const sectionTitles = {
    summary: lang === 'tr' ? 'Profesyonel Özet' : 'Summary',
    experience: lang === 'tr' ? 'Deneyim' : 'Experience',
    education: lang === 'tr' ? 'Eğitim' : 'Education',
    skills: lang === 'tr' ? 'Teknik Yetenekler' : 'Technical Skills',
    languages: lang === 'tr' ? 'Diller' : 'Languages',
    certifications: lang === 'tr' ? 'Sertifikalar' : 'Certifications',
  };

  return (
    <div className="devTemplate">
      {personal?.fullName && (
        <header className="devHeader">
          <h1 className="devName">{personal.fullName}</h1>
          {personal.title && <div className="devTitle">{personal.title}</div>}
          <div className="devContact">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.address && <span>{personal.address}</span>}
            {personal.github && <span>{personal.github}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.website && <span>{personal.website}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        </header>
      )}

      {summary && (
        <section className="devSection">
          <h2 className="devSectionTitle">{sectionTitles.summary}</h2>
          <p className="devText">{summary}</p>
        </section>
      )}

      {experience.some(e => e.company) && (
        <section className="devSection">
          <h2 className="devSectionTitle">{sectionTitles.experience}</h2>
          {experience.filter(e => e.company).map((exp, idx) => (
            <div key={exp.id} className="devExp">
              <div className="devExpHead">
                <strong className="devExpPos">{exp.position}</strong>
                <span className="devExpDate">{formatDate(exp.startDate, lang)} — {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}</span>
              </div>
              <em className="devExpComp">{exp.company}</em>
              {exp.description && (
                <ul className="devBullets">
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
        <section className="devSection">
          <h2 className="devSectionTitle">{sectionTitles.education}</h2>
          {education.filter(e => e.school).map(edu => (
            <div key={edu.id} className="devExp">
              <div className="devExpHead">
                <strong className="devExpPos">{edu.degree} — {edu.field}</strong>
                <span className="devExpDate">{formatDate(edu.startDate, lang)} — {formatDate(edu.endDate, lang)}</span>
              </div>
              <em className="devExpComp">{edu.school}{edu.gpa ? `  |  GPA: ${edu.gpa}` : ''}</em>
            </div>
          ))}
        </section>
      )}

      <div className="devColumns">
        <div className="devColMain">
          {certifications.some(c => c.name) && (
            <section className="devSection">
              <h2 className="devSectionTitle">{sectionTitles.certifications}</h2>
              {certifications.filter(c => c.name).map(cert => (
                <div key={cert.id} className="devCert">
                  <strong>{cert.name}</strong>
                  <em>{cert.issuer}</em>
                  {cert.date && <span className="devExpDate">{formatDate(cert.date, lang)}</span>}
                </div>
              ))}
            </section>
          )}

          {languages.some(l => l.name) && (
            <section className="devSection">
              <h2 className="devSectionTitle">{sectionTitles.languages}</h2>
              {languages.filter(l => l.name).map(l => (
                <div key={l.id} className="devLang">{l.name} — {l.level}</div>
              ))}
            </section>
          )}
        </div>

        <div className="devColSide">
          {skills.filter(s => s.name).length > 0 && (
            <section className="devSection">
              <h2 className="devSectionTitle">{sectionTitles.skills}</h2>
              {['languages','frameworks','tools','databases','other'].map((cat, ci) => {
                const items = skills.filter(s => s.category === cat && s.name);
                if (items.length === 0) return null;
                const catLabels = { languages: 'Diller & Teknolojiler', frameworks: 'Framework & Kütüphaneler', tools: 'Araçlar & Platformlar', databases: 'Veritabanları', other: 'Diğer' };
                return (
                  <div key={cat} className="devSkillGroup">
                    <span className="devSkillCat">{catLabels[cat]}</span>
                    {items.map((s, i) => (
                      <DevSkillBar key={`${ci}-${i}`} name={s.name} level={s.level} />
                    ))}
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
