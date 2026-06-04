import { formatDate } from '../utils/dateFormat';

const levelLabel = { 'Başlangıç': 'Temel', 'Orta': 'Orta', 'İleri': 'İleri', 'Uzman': 'Uzman' };
const levelPct = { 'Başlangıç': 30, 'Orta': 50, 'İleri': 75, 'Uzman': 95 };

function SkillBar({ name, level }) {
  const pct = levelPct[level] || 50;
  return (
    <div className="novaSkill">
      <div className="novaSkillRow">
        <span className="novaSkillName">{name}</span>
        <span className="novaSkillLevel">{levelLabel[level] || level}</span>
      </div>
      <div className="novaSkillTrack">
        <div className="novaSkillFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function NovaTechTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const lang = data.language || 'tr';

  const sectionTitles = {
    summary: lang === 'tr' ? 'Profesyonel Özet' : 'Summary',
    experience: lang === 'tr' ? 'Deneyim' : 'Experience',
    education: lang === 'tr' ? 'Eğitim' : 'Education',
    skills: lang === 'tr' ? 'Teknik Yetenekler' : 'Skills',
    languages: lang === 'tr' ? 'Diller' : 'Languages',
    certifications: lang === 'tr' ? 'Sertifikalar' : 'Certifications',
  };

  return (
    <div className="novaWrap">
      {personal?.fullName && (
        <header className="novaHeader">
          <div className="novaHeaderContent">
            <div className="novaAvatar">
              {personal.photo ? (
                <img src={personal.photo} alt="" className="novaPhoto" />
              ) : (
                <span className="novaInitials">
                  {personal.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="novaHeaderText">
              <h1 className="novaName">{personal.fullName}</h1>
              {personal.title && <p className="novaTitle">{personal.title}</p>}
              <div className="novaContact">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span>{personal.phone}</span>}
                {personal.address && <span>{personal.address}</span>}
              </div>
              <div className="novaContact novaContactLinks">
                {personal.linkedin && <span>{personal.linkedin}</span>}
                {personal.github && <span>{personal.github}</span>}
                {personal.website && <span>{personal.website}</span>}
                {personal.portfolio && <span>{personal.portfolio}</span>}
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="novaBody">
        {summary && (
          <section className="novaSection">
            <h2 className="novaSectionTitle">{sectionTitles.summary}</h2>
            <p className="novaText">{summary}</p>
          </section>
        )}

        {experience.some(e => e.company) && (
          <section className="novaSection">
            <h2 className="novaSectionTitle">{sectionTitles.experience}</h2>
            {experience.filter(e => e.company).map((exp, idx) => (
              <div key={exp.id} className="novaItem">
                <div className="novaItemHead">
                  <strong className="novaPosition">{exp.position}</strong>
                  <span className="novaDate">{formatDate(exp.startDate, lang)} — {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}</span>
                </div>
                <span className="novaCompany">{exp.company}</span>
                {exp.description && (
                  <ul className="novaBullet">
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
          <section className="novaSection">
            <h2 className="novaSectionTitle">{sectionTitles.education}</h2>
            {education.filter(e => e.school).map((edu, idx) => (
              <div key={edu.id} className="novaItem">
                <div className="novaItemHead">
                  <strong className="novaPosition">{edu.degree} — {edu.field}</strong>
                  <span className="novaDate">{formatDate(edu.startDate, lang)} — {formatDate(edu.endDate, lang)}</span>
                </div>
                <span className="novaCompany">{edu.school}{edu.gpa ? `  |  GPA: ${edu.gpa}` : ''}</span>
              </div>
            ))}
          </section>
        )}

        {skills.filter(s => s.name).length > 0 && (
          <section className="novaSection">
            <h2 className="novaSectionTitle">{sectionTitles.skills}</h2>
            {['languages','frameworks','tools','databases','other'].map((cat, ci) => {
              const items = skills.filter(s => s.category === cat && s.name);
              if (items.length === 0) return null;
              const catLabels = { languages: 'Diller & Teknolojiler', frameworks: 'Framework & Kütüphaneler', tools: 'Araçlar & Platformlar', databases: 'Veritabanları', other: 'Diğer' };
              return (
                <div key={cat} className="novaSkillGroup">
                  <span className="novaSkillCategory">{catLabels[cat]}</span>
                  {items.map((s, i) => (
                    <SkillBar key={`${ci}-${i}`} name={s.name} level={s.level} />
                  ))}
                </div>
              );
            })}
          </section>
        )}

        {languages.some(l => l.name) && (
          <section className="novaSection">
            <h2 className="novaSectionTitle">{sectionTitles.languages}</h2>
            <div className="novaLangList">
              {languages.filter(l => l.name).map(l => (
                <div key={l.id} className="novaLangItem">
                  <span className="novaLangName">{l.name}</span>
                  <div className="novaLangDots">
                    {['Başlangıç','Orta','İleri','Uzman'].map(lv => (
                      <span key={lv} className={`novaLangDot ${levelPct[l.level] >= levelPct[lv] ? 'fill' : ''}`} />
                    ))}
                    <span className="novaLangLabel">{levelLabel[l.level] || l.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.some(c => c.name) && (
          <section className="novaSection">
            <h2 className="novaSectionTitle">{sectionTitles.certifications}</h2>
            <div className="novaCertList">
              {certifications.filter(c => c.name).map(cert => (
                <div key={cert.id} className="novaCertItem">
                  <strong>{cert.name}</strong>
                  <span className="novaCertMeta">{cert.issuer}{cert.date ? ` · ${formatDate(cert.date, lang)}` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
