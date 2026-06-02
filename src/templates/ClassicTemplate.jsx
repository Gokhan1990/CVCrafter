export default function ClassicTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const color = data.primaryColor || '#1a1a2e';
  const fontSize = data.fontSize === 'small' ? '12px' : data.fontSize === 'large' ? '16px' : '14px';

  return (
    <div className="cvTemplate" style={{ '--color': color, fontSize }}>
      {personal?.fullName && (
        <div className="classicHeader">
          <div className="classicHeaderLeft">
            {personal.photo && <img src={personal.photo} alt="" className="classicPhoto" />}
            <div>
              <h1 className="classicName" style={{ color }}>{personal.fullName}</h1>
              {personal.title && <p className="classicTitle">{personal.title}</p>}
            </div>
          </div>
          <div className="classicHeaderRight">
            {personal.email && <p>✉ {personal.email}</p>}
            {personal.phone && <p>📞 {personal.phone}</p>}
            {personal.address && <p>📍 {personal.address}</p>}
            {personal.linkedin && <p>🔗 {personal.linkedin}</p>}
            {personal.github && <p>💻 {personal.github}</p>}
            {personal.website && <p>🌐 {personal.website}</p>}
            {personal.portfolio && <p>📁 {personal.portfolio}</p>}
          </div>
        </div>
      )}

      <div className="classicDivider" style={{ backgroundColor: color }} />

      {summary && (
        <section className="classicSection">
          <h2 className="classicSectionTitle" style={{ color }}>Profesyonel Özet</h2>
          <p>{summary}</p>
        </section>
      )}

      {experience.some(e => e.company) && (
        <section className="classicSection">
          <h2 className="classicSectionTitle" style={{ color }}>İş Deneyimi</h2>
          {experience.filter(e => e.company).map(exp => (
            <div key={exp.id} className="classicItem">
              <div className="classicItemLeft">
                <strong>{exp.position}</strong>
                <em>{exp.company}</em>
              </div>
              <div className="classicItemRight">
                <span className="classicDate">{exp.startDate} - {exp.current ? 'Devam Ediyor' : exp.endDate}</span>
              </div>
              <p className="classicDesc">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {education.some(e => e.school) && (
        <section className="classicSection">
          <h2 className="classicSectionTitle" style={{ color }}>Eğitim</h2>
          {education.filter(e => e.school).map(edu => (
            <div key={edu.id} className="classicItem">
              <div className="classicItemLeft">
                <strong>{edu.degree} - {edu.field}</strong>
                <em>{edu.school}</em>
              </div>
              <div className="classicItemRight">
                <span className="classicDate">{edu.startDate} - {edu.endDate}</span>
              </div>
              {edu.gpa && <p className="classicDesc">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      <div className="classicFooter">
        {skills.filter(s => s.name).length > 0 && (
          <section className="classicSection">
            <h2 className="classicSectionTitle" style={{ color }}>Yetenekler</h2>
            {['languages','frameworks','tools','databases','other'].map(cat => {
              const items = skills.filter(s => s.category === cat && s.name);
              if (items.length === 0) return null;
              const catLabels = { languages: 'Diller', frameworks: 'Framework', tools: 'Araçlar', databases: 'DB', other: 'Diğer' };
              return (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: 12, color: 'var(--textSecondary)' }}>{catLabels[cat]}: </strong>
                  {items.map((s, i) => (
                    <span key={i} className="classicSkillTag" style={{ backgroundColor: color + '20', color, border: `1px solid ${color}`, marginRight: 4, fontSize: 12 }}>
                      {s.name} ({s.level})
                    </span>
                  ))}
                </div>
              );
            })}
          </section>
        )}

        {languages.some(l => l.name) && (
          <section className="classicSection">
            <h2 className="classicSectionTitle" style={{ color }}>Diller</h2>
            {languages.filter(l => l.name).map(lang => (
              <span key={lang.id} className="classicLangItem">{lang.name} ({lang.level})</span>
            ))}
          </section>
        )}

        {certifications.some(c => c.name) && (
          <section className="classicSection">
            <h2 className="classicSectionTitle" style={{ color }}>Sertifikalar</h2>
            {certifications.filter(c => c.name).map(cert => (
              <div key={cert.id} className="classicItem">
                <strong>{cert.name}</strong> - {cert.issuer} {cert.date && `(${cert.date})`}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
