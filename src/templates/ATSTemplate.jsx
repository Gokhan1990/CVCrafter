export default function ATSTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;

  const formatDate = (d) => d ? d.replace(/-.*$/, '') : '';

  return (
    <div className="cvTemplate" style={{ fontSize: '12px', fontFamily: 'Arial, Helvetica, sans-serif', padding: '15px 20px', lineHeight: '1.4' }}>
      {personal?.fullName && (
        <div style={{ textAlign: 'center', marginBottom: 12, borderBottom: '2px solid #000', paddingBottom: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{personal.fullName}</h1>
          {personal.title && <p style={{ fontSize: 14, margin: '2px 0' }}>{personal.title}</p>}
          <p style={{ fontSize: 11, margin: '4px 0 0', color: '#333' }}>
            {[personal.email, personal.phone, personal.address, personal.linkedin, personal.github, personal.website].filter(Boolean).join(' | ')}
          </p>
        </div>
      )}

      {summary && (
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #999', paddingBottom: 2, marginBottom: 4 }}>SUMMARY</h2>
          <p style={{ fontSize: 12, margin: 0 }}>{summary}</p>
        </div>
      )}

      {experience.filter(e => e.company).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #999', paddingBottom: 2, marginBottom: 4 }}>EXPERIENCE</h2>
          {experience.filter(e => e.company).map(exp => (
            <div key={exp.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 12 }}>{exp.position} — {exp.company}</strong>
                <span style={{ fontSize: 11, color: '#555' }}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                  <li key={i} style={{ fontSize: 11, marginBottom: 2 }}>{line.replace(/^[•\-]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.filter(e => e.school).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #999', paddingBottom: 2, marginBottom: 4 }}>EDUCATION</h2>
          {education.filter(e => e.school).map(edu => (
            <div key={edu.id} style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 12 }}>{edu.degree} in {edu.field}</strong>
                <span style={{ fontSize: 11, color: '#555' }}>{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
              </div>
              <span style={{ fontSize: 11 }}>{edu.school}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</span>
            </div>
          ))}
        </div>
      )}

      {skills.filter(s => s.name).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #999', paddingBottom: 2, marginBottom: 4 }}>SKILLS</h2>
          {['languages','frameworks','tools','databases','other'].map(cat => {
            const items = skills.filter(s => s.category === cat && s.name);
            if (items.length === 0) return null;
            const labels = { languages: 'Languages', frameworks: 'Frameworks', tools: 'Tools', databases: 'Databases', other: 'Other' };
            return (
              <p key={cat} style={{ fontSize: 11, margin: '2px 0' }}>
                <strong>{labels[cat]}:</strong> {items.map(s => `${s.name} (${s.level})`).join(', ')}
              </p>
            );
          })}
        </div>
      )}

      {languages.filter(l => l.name).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #999', paddingBottom: 2, marginBottom: 4 }}>LANGUAGES</h2>
          <p style={{ fontSize: 11, margin: 0 }}>{languages.filter(l => l.name).map(l => `${l.name} (${l.level})`).join(' | ')}</p>
        </div>
      )}

      {certifications.filter(c => c.name).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #999', paddingBottom: 2, marginBottom: 4 }}>CERTIFICATIONS</h2>
          {certifications.filter(c => c.name).map(cert => (
            <p key={cert.id} style={{ fontSize: 11, margin: '2px 0' }}>{cert.name} — {cert.issuer} {cert.date ? `(${formatDate(cert.date)})` : ''}</p>
          ))}
        </div>
      )}
    </div>
  );
}
