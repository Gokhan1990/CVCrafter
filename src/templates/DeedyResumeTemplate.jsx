import { formatDate } from '../utils/dateFormat';

export default function DeedyResumeTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const lang = data.language || 'tr';

  const sectionTitles = {
    summary: lang === 'tr' ? 'Özet' : 'Summary',
    experience: lang === 'tr' ? 'Deneyim' : 'Experience',
    education: lang === 'tr' ? 'Eğitim' : 'Education',
    languages: lang === 'tr' ? 'Diller' : 'Languages',
    certifications: lang === 'tr' ? 'Sertifikalar' : 'Certifications',
    skills: 'Yetenekler',
  };

  return (
    <div className="deedyTemplate">
      {personal?.fullName && (
        <div className="deedyHeader">
          <h1 className="deedyName">
            <span className="deedyFirst">{personal.fullName.split(' ').slice(0, -1).join(' ')}</span>{' '}
            <span className="deedyLast">{personal.fullName.split(' ').pop()}</span>
          </h1>
          <div className="deedyContact">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span> | {personal.phone}</span>}
            {personal.address && <span> | {personal.address}</span>}
          </div>
          <div className="deedyLinks">
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.github && <span> | {personal.github}</span>}
            {personal.website && <span> | {personal.website}</span>}
            {personal.portfolio && <span> | {personal.portfolio}</span>}
          </div>
        </div>
      )}

      <div className="deedyColumns">
        <div className="deedyLeft">
          {education.some(e => e.school) && (
            <section className="deedySection">
              <h2 className="deedySecTitle">{sectionTitles.education}</h2>
              {education.filter(e => e.school).map(edu => (
                <div key={edu.id} className="deedyEdu">
                  <div className="deedyEduSchool">{edu.school}</div>
                  <div className="deedyEduDetail">{edu.degree} — {edu.field}</div>
                  <div className="deedyEduDate">{formatDate(edu.startDate, lang)} — {formatDate(edu.endDate, lang)}</div>
                  {edu.gpa && <div className="deedyEduDetail">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {skills.filter(s => s.name).length > 0 && (
            <section className="deedySection">
              <h2 className="deedySecTitle">{sectionTitles.skills}</h2>
              {['languages','frameworks','tools','databases','other'].map(cat => {
                const items = skills.filter(s => s.category === cat && s.name);
                if (items.length === 0) return null;
                const catLabels = { languages: 'Diller & Teknolojiler', frameworks: 'Framework & Kütüphaneler', tools: 'Araçlar & Platformlar', databases: 'Veritabanları', other: 'Diğer' };
                return (
                  <div key={cat} className="deedySkillGroup">
                    <div className="deedySkillCat">{catLabels[cat]}</div>
                    <div className="deedySkillList">
                      {items.map(s => s.name).join(', ')}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {languages.some(l => l.name) && (
            <section className="deedySection">
              <h2 className="deedySecTitle">{sectionTitles.languages}</h2>
              {languages.filter(l => l.name).map(l => (
                <div key={l.id}>{l.name} ({l.level})</div>
              ))}
            </section>
          )}

          {certifications.some(c => c.name) && (
            <section className="deedySection">
              <h2 className="deedySecTitle">{sectionTitles.certifications}</h2>
              {certifications.filter(c => c.name).map(cert => (
                <div key={cert.id}>
                  <div className="deedyEduSchool">{cert.name}</div>
                  <div className="deedyEduDetail">{cert.issuer}</div>
                  {cert.date && <div className="deedyEduDate">{formatDate(cert.date, lang)}</div>}
                </div>
              ))}
            </section>
          )}

          {summary && (
            <section className="deedySection">
              <h2 className="deedySecTitle">{sectionTitles.summary}</h2>
              <p className="deedySummary">{summary}</p>
            </section>
          )}
        </div>

        <div className="deedyRight">
          {experience.some(e => e.company) && (
            <section className="deedySection">
              <h2 className="deedySecTitle">{sectionTitles.experience}</h2>
              {experience.filter(e => e.company).map(exp => (
                <div key={exp.id} className="deedyExp">
                  <div className="deedyExpHead">
                    <div className="deedyExpRole">{exp.position}</div>
                    <div className="deedyExpDate">{formatDate(exp.startDate, lang)} — {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}</div>
                  </div>
                  <div className="deedyExpLocation">{exp.company}</div>
                  {exp.description && (
                    <ul className="deedyBullets">
                      {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                        <li key={i}>{line.replace(/^[•\-]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
