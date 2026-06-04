import { formatDate } from '../utils/dateFormat';

const levelLabel = { 'Başlangıç': 'Temel', 'Orta': 'Orta', 'İleri': 'İleri', 'Uzman': 'Uzman' };
const levelPct = { 'Başlangıç': 25, 'Orta': 50, 'İleri': 75, 'Uzman': 95 };

function TechSkillBar({ name, level }) {
  return (
    <div className="techSkill">
      <div className="techSkillRow">
        <span className="techSkillName">{name}</span>
        <span className="techSkillLevel">{levelLabel[level] || level}</span>
      </div>
      <div className="techSkillTrack">
        <div className="techSkillFill" style={{ width: `${levelPct[level] || 50}%` }} />
      </div>
    </div>
  );
}

export default function TechResumeTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const lang = data.language || 'tr';

  const sectionTitles = {
    summary: lang === 'tr' ? 'Hakkımda' : 'About',
    experience: lang === 'tr' ? 'Deneyim' : 'Experience',
    education: lang === 'tr' ? 'Eğitim' : 'Education',
    skills: lang === 'tr' ? 'Teknik Beceriler' : 'Technical Skills',
    languages: lang === 'tr' ? 'Diller' : 'Languages',
    certifications: lang === 'tr' ? 'Sertifikalar' : 'Certifications',
  };

  return (
    <div className="techTemplate">
      {personal?.fullName && (
        <header className="techHeader">
          <div className="techHeaderContent">
            <div className="techHeaderLeft">
              <h1 className="techName">{personal.fullName}</h1>
              {personal.title && <div className="techTitle">{personal.title}</div>}
            </div>
            <div className="techHeaderRight">
              {personal.email && <div className="techContactItem">✉ {personal.email}</div>}
              {personal.phone && <div className="techContactItem">📞 {personal.phone}</div>}
              {personal.address && <div className="techContactItem">📍 {personal.address}</div>}
              {personal.linkedin && <div className="techContactItem">🔗 {personal.linkedin}</div>}
              {personal.github && <div className="techContactItem">💻 {personal.github}</div>}
              {personal.website && <div className="techContactItem">🌐 {personal.website}</div>}
              {personal.portfolio && <div className="techContactItem">📁 {personal.portfolio}</div>}
            </div>
          </div>
        </header>
      )}

      <div className="techColumns">
        <div className="techMain">
          {summary && (
            <section className="techSection">
              <h2 className="techSecTitle">{sectionTitles.summary}</h2>
              <p className="techText">{summary}</p>
            </section>
          )}

          {experience.some(e => e.company) && (
            <section className="techSection">
              <h2 className="techSecTitle">{sectionTitles.experience}</h2>
              {experience.filter(e => e.company).map(exp => (
                <div key={exp.id} className="techExp">
                  <div className="techExpHead">
                    <strong className="techExpPos">{exp.position}</strong>
                    <span className="techExpDate">{formatDate(exp.startDate, lang)} — {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}</span>
                  </div>
                  <em className="techExpComp">{exp.company}</em>
                  {exp.description && (
                    <ul className="techBullets">
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
            <section className="techSection">
              <h2 className="techSecTitle">{sectionTitles.education}</h2>
              {education.filter(e => e.school).map(edu => (
                <div key={edu.id} className="techExp">
                  <div className="techExpHead">
                    <strong className="techExpPos">{edu.degree} — {edu.field}</strong>
                    <span className="techExpDate">{formatDate(edu.startDate, lang)} — {formatDate(edu.endDate, lang)}</span>
                  </div>
                  <em className="techExpComp">{edu.school}{edu.gpa ? `  |  GPA: ${edu.gpa}` : ''}</em>
                </div>
              ))}
            </section>
          )}

          {certifications.some(c => c.name) && (
            <section className="techSection">
              <h2 className="techSecTitle">{sectionTitles.certifications}</h2>
              {certifications.filter(c => c.name).map(cert => (
                <div key={cert.id} className="techCert">
                  <strong>{cert.name}</strong>
                  <em className="techExpComp">{cert.issuer}{cert.date ? ` · ${formatDate(cert.date, lang)}` : ''}</em>
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="techSide">
          {languages.some(l => l.name) && (
            <section className="techSideSection">
              <h2 className="techSecTitle">{sectionTitles.languages}</h2>
              {languages.filter(l => l.name).map(l => (
                <div key={l.id} className="techSideItem">{l.name} — {l.level}</div>
              ))}
            </section>
          )}

          {skills.filter(s => s.name).length > 0 && (
            <section className="techSideSection">
              <h2 className="techSecTitle">{sectionTitles.skills}</h2>
              {['languages','frameworks','tools','databases','other'].map((cat, ci) => {
                const items = skills.filter(s => s.category === cat && s.name);
                if (items.length === 0) return null;
                const catLabels = { languages: 'Diller & Teknolojiler', frameworks: 'Framework & Kütüphaneler', tools: 'Araçlar & Platformlar', databases: 'Veritabanları', other: 'Diğer' };
                return (
                  <div key={cat} className="techSkillGroup">
                    <span className="techSkillCat">{catLabels[cat]}</span>
                    {items.map((s, i) => (
                      <TechSkillBar key={`${ci}-${i}`} name={s.name} level={s.level} />
                    ))}
                  </div>
                );
              })}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
