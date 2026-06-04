import { formatDate } from '../utils/dateFormat';

export default function ModernTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const color = data.primaryColor || '#2563eb';
  const fontSize = data.fontSize === 'small' ? '12px' : data.fontSize === 'large' ? '16px' : '14px';
  const lang = data.language || 'tr';

  return (
    <div className="cvTemplate" style={{ '--color': color, fontSize }}>
      {personal?.fullName && (
        <div className="modernHeader">
          <div className="modernHeaderContent">
            {personal.photo && (
              <img src={personal.photo} alt="" className="modernPhoto" />
            )}
            <div>
              <h1 className="modernName">{personal.fullName}</h1>
              {personal.title && <p className="modernTitle">{personal.title}</p>}
            </div>
          </div>
          <div className="modernContact">
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>📞 {personal.phone}</span>}
            {personal.address && <span>📍 {personal.address}</span>}
            {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            {personal.github && <span>💻 {personal.github}</span>}
            {personal.portfolio && <span>📁 {personal.portfolio}</span>}
            {personal.website && <span>🌐 {personal.website}</span>}
          </div>
        </div>
      )}

      <div className="modernBody">
        <div className="modernMain">
          {summary && (
            <section>
              <h2 style={{ borderBottomColor: color }}>Hakkımda</h2>
              <p>{summary}</p>
            </section>
          )}

          {experience.some(e => e.company) && (
            <section>
              <h2 style={{ borderBottomColor: color }}>Deneyim</h2>
              {experience.filter(e => e.company).map(exp => (
                <div key={exp.id} className="modernItem">
                  <div className="modernItemHeader">
                    <strong>{exp.position}</strong>
                    <span className="modernDate"> | {formatDate(exp.startDate, lang)} - {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}</span>
                  </div>
                  <em>{exp.company}</em>
                  <p>{exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {education.some(e => e.school) && (
            <section>
              <h2 style={{ borderBottomColor: color }}>Eğitim</h2>
              {education.filter(e => e.school).map(edu => (
                <div key={edu.id} className="modernItem">
                  <div className="modernItemHeader">
                    <strong>{edu.degree} - {edu.field}</strong>
                    <span className="modernDate"> | {formatDate(edu.startDate, lang)} - {formatDate(edu.endDate, lang)}</span>
                  </div>
                  <em>{edu.school}</em>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </section>
          )}

          {certifications.some(c => c.name) && (
            <section>
              <h2 style={{ borderBottomColor: color }}>Sertifikalar</h2>
              {certifications.filter(c => c.name).map(cert => (
                <div key={cert.id} className="modernItem">
                  <strong>{cert.name}</strong>
                  <em>{cert.issuer}</em>
                  {cert.date && <span className="modernDate">{formatDate(cert.date, lang)}</span>}
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="modernSide" style={{ backgroundColor: color + '15' }}>
          {skills.filter(s => s.name).length > 0 && (
            <section>
              <h2 style={{ borderBottomColor: color }}>Yetenekler</h2>
              {['languages','frameworks','tools','databases','other'].map(cat => {
                const items = skills.filter(s => s.category === cat && s.name);
                if (items.length === 0) return null;
                const catLabels = { languages: 'Diller & Teknolojiler', frameworks: 'Framework & Kütüphaneler', tools: 'Araçlar & Platformlar', databases: 'Veritabanları', other: 'Diğer' };
                return (
                  <div key={cat} style={{ marginBottom: 10 }}>
                    <strong style={{ fontSize: 12, color: 'var(--textSecondary)' }}>{catLabels[cat]}</strong>
                    <div className="modernSkills" style={{ marginTop: 4 }}>
                      {items.map((s, i) => (
                        <span key={i} className="modernSkillTag" style={{ borderColor: color, color }}>
                          {s.name}{s.level ? ` (${s.level})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {languages.some(l => l.name) && (
            <section>
              <h2 style={{ borderBottomColor: color }}>Diller</h2>
              {languages.filter(l => l.name).map(lang => (
                <div key={lang.id} className="modernLangItem">
                  <span>{lang.name}</span>
                  <span className="modernLangLevel" style={{ color }}>{lang.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
