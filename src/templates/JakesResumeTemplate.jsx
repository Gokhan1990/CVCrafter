import { formatDate } from '../utils/dateFormat';

export default function JakesResumeTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const lang = data.language || 'tr';

  const sectionTitles = {
    summary: lang === 'tr' ? 'Profesyonel Özet' : 'Summary',
    experience: lang === 'tr' ? 'Deneyim' : 'Experience',
    education: lang === 'tr' ? 'Eğitim' : 'Education',
    skills: lang === 'tr' ? 'Yetenekler' : 'Skills',
    languages: lang === 'tr' ? 'Diller' : 'Languages',
    certifications: lang === 'tr' ? 'Sertifikalar' : 'Certifications',
  };

  return (
    <div className="jakesTemplate">
      {personal?.fullName && (
        <div className="jakesHeader">
          <div className="jakesHeaderLeft">
            <h1 className="jakesName">{personal.fullName}</h1>
            {personal.title && <div className="jakesTitle">{personal.title}</div>}
          </div>
          <div className="jakesHeaderRight">
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.address && <div>{personal.address}</div>}
            {personal.linkedin && <div>{personal.linkedin}</div>}
            {personal.github && <div>{personal.github}</div>}
            {personal.website && <div>{personal.website}</div>}
            {personal.portfolio && <div>{personal.portfolio}</div>}
          </div>
        </div>
      )}

      {summary && (
        <section className="jakesSection">
          <h2 className="jakesSectionTitle">{sectionTitles.summary}</h2>
          <p className="jakesText">{summary}</p>
        </section>
      )}

      {experience.some(e => e.company) && (
        <section className="jakesSection">
          <h2 className="jakesSectionTitle">{sectionTitles.experience}</h2>
          {experience.filter(e => e.company).map(exp => (
            <div key={exp.id} className="jakesExp">
              <div className="jakesExpHead">
                <div>
                  <strong className="jakesExpPosition">{exp.position}</strong>
                  <em className="jakesExpCompany">{exp.company}</em>
                </div>
                <div className="jakesExpDate">
                  {formatDate(exp.startDate, lang)} — {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}
                </div>
              </div>
              {exp.description && (
                <ul className="jakesBullets">
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
        <section className="jakesSection">
          <h2 className="jakesSectionTitle">{sectionTitles.education}</h2>
          {education.filter(e => e.school).map(edu => (
            <div key={edu.id} className="jakesExp">
              <div className="jakesExpHead">
                <div>
                  <strong className="jakesExpPosition">{edu.degree} — {edu.field}</strong>
                  <em className="jakesExpCompany">{edu.school}</em>
                </div>
                <div className="jakesExpDate">
                  {formatDate(edu.startDate, lang)} — {formatDate(edu.endDate, lang)}
                </div>
              </div>
              {edu.gpa && <div className="jakesText">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {skills.filter(s => s.name).length > 0 && (
        <section className="jakesSection">
          <h2 className="jakesSectionTitle">{sectionTitles.skills}</h2>
          <div className="jakesSkills">
            {['languages','frameworks','tools','databases','other'].map(cat => {
              const items = skills.filter(s => s.category === cat && s.name);
              if (items.length === 0) return null;
              const catLabels = { languages: 'Languages', frameworks: 'Frameworks', tools: 'Tools', databases: 'Databases', other: 'Other' };
              return (
                <div key={cat}>
                  <strong>{catLabels[cat]}: </strong>
                  {items.map((s, i) => (
                    <span key={i}>{s.name}{s.level ? ` (${s.level})` : ''}{i < items.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {languages.some(l => l.name) && (
        <section className="jakesSection">
          <h2 className="jakesSectionTitle">{sectionTitles.languages}</h2>
          <div className="jakesSkills">
            {languages.filter(l => l.name).map((l, i) => (
              <span key={l.id}>{l.name} ({l.level}){i < languages.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </section>
      )}

      {certifications.some(c => c.name) && (
        <section className="jakesSection">
          <h2 className="jakesSectionTitle">{sectionTitles.certifications}</h2>
          <div className="jakesSkills">
            {certifications.filter(c => c.name).map((cert, i) => (
              <span key={cert.id}>{cert.name} — {cert.issuer}{cert.date ? ` (${formatDate(cert.date, lang)})` : ''}{i < certifications.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
