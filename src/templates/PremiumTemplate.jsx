import { formatDate } from '../utils/dateFormat';

const levelLabel = { 'Başlangıç': 'Temel', 'Orta': 'Orta', 'İleri': 'İleri', 'Uzman': 'Uzman' };
const levelPct = { 'Başlangıç': 30, 'Orta': 50, 'İleri': 75, 'Uzman': 95 };

function SkillBar({ name, level }) {
  const pct = levelPct[level] || 50;
  return (
    <div className="premiumSkill">
      <div className="premiumSkillRow">
        <span className="premiumSkillName">{name}</span>
        <span className="premiumSkillLevel">{levelLabel[level] || level}</span>
      </div>
      <div className="premiumSkillTrack">
        <div className="premiumSkillFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="premiumSectionTitleWrap">
      <span className="premiumSectionBar" />
      <h2 className="premiumSectionTitle">{icon}{title}</h2>
    </div>
  );
}

export default function PremiumTemplate({ data }) {
  const { personal, summary, experience, education, skills, languages, certifications } = data;
  const lang = data.language || 'tr';

  const sectionTitles = {
    summary: lang === 'tr' ? 'Profesyonel Özet' : 'Professional Summary',
    experience: lang === 'tr' ? 'Deneyim' : 'Experience',
    education: lang === 'tr' ? 'Eğitim' : 'Education',
    languages: lang === 'tr' ? 'Diller' : 'Languages',
    certifications: lang === 'tr' ? 'Sertifikalar' : 'Certifications',
    skills: 'Yetenekler',
  };

  return (
    <div className="premiumTemplate">
      {personal?.fullName && (
        <header className="premiumHeader">
          <div className="premiumHeaderInner">
            {personal.photo && (
              <img src={personal.photo} alt="" className="premiumPhoto" />
            )}
            <div className="premiumHeaderText">
              <h1 className="premiumName">{personal.fullName}</h1>
              {personal.title && <p className="premiumTitle">{personal.title}</p>}
              <div className="premiumContact">
                {personal.email && <span>✉ {personal.email}</span>}
                {personal.phone && <span>📞 {personal.phone}</span>}
                {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
                {personal.github && <span>💻 {personal.github}</span>}
                {personal.portfolio && <span>📁 {personal.portfolio}</span>}
                {personal.website && <span>🌐 {personal.website}</span>}
                {personal.address && <span>📍 {personal.address}</span>}
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="premiumBodyColumns">
        <div className="premiumMain">
          {summary && (
            <section className="premiumSection" data-section="summary">
              <SectionTitle icon="📝" title={sectionTitles.summary} />
              <p className="premiumText">{summary}</p>
            </section>
          )}

          {experience.some(e => e.company) && (
            <section className="premiumSection" data-section="experience">
              <SectionTitle icon="💼" title={sectionTitles.experience} />
              {experience.filter(e => e.company).map((exp, idx) => (
                <div key={exp.id} className="premiumItem" data-card="experience" data-card-index={idx}>
                  <div className="premiumItemHead">
                    <strong className="premiumItemPosition">{exp.position}</strong>
                    <span className="premiumItemDate">{formatDate(exp.startDate, lang)} - {exp.current ? (lang === 'tr' ? 'Devam Ediyor' : 'Present') : formatDate(exp.endDate, lang)}</span>
                  </div>
                  <em className="premiumItemCompany">{exp.company}</em>
                  {exp.description && <p className="premiumText">{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education.some(e => e.school) && (
            <section className="premiumSection" data-section="education">
              <SectionTitle icon="🎓" title={sectionTitles.education} />
              {education.filter(e => e.school).map((edu, idx) => (
                <div key={edu.id} className="premiumItem" data-card="education" data-card-index={idx}>
                  <div className="premiumItemHead">
                    <strong className="premiumItemPosition">{edu.degree} — {edu.field}</strong>
                    <span className="premiumItemDate">{formatDate(edu.startDate, lang)} - {formatDate(edu.endDate, lang)}</span>
                  </div>
                  <em className="premiumItemCompany">{edu.school}</em>
                  {edu.gpa && <p className="premiumText">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="premiumSide">
          {(() => {
            const allSkills = skills.filter(s => s.name);
            if (allSkills.length === 0) return null;
            let skillGlobalIdx = 0;
            const catLabels = { languages: 'Diller & Teknolojiler', frameworks: 'Framework & Kütüphaneler', tools: 'Araçlar & Platformlar', databases: 'Veritabanları', other: 'Diğer' };
            return (
              <section className="premiumSection premiumSectionSide" data-section="skills">
                <SectionTitle icon="🔧" title="Yetenekler" />
                {['languages','frameworks','tools','databases','other'].map((cat, ci) => {
                  const items = allSkills.filter(s => s.category === cat);
                  if (items.length === 0) return null;
                  const groupStartIdx = skillGlobalIdx;
                  skillGlobalIdx += items.length;
                  return (
                    <div key={cat} className="premiumSkillGroup" data-card="skill-group" data-card-index={ci} data-count={items.length}>
                      <span className="premiumSkillCategory">{catLabels[cat]}</span>
                      {items.map((s, i) => (
                        <div key={groupStartIdx + i} data-card="skill" data-card-index={groupStartIdx + i}>
                          <SkillBar name={s.name} level={s.level} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </section>
            );
          })()}

          {languages.some(l => l.name) && (
            <section className="premiumSection premiumSectionSide" data-section="languages">
              <SectionTitle icon="🌐" title={sectionTitles.languages} />
              <div className="premiumLangList">
                {languages.filter(l => l.name).map((lang, idx) => (
                  <div key={lang.id} className="premiumLangItem" data-card="language" data-card-index={idx}>
                    <span className="premiumLangName">{lang.name}</span>
                    <div className="premiumLangDots">
                      {['Başlangıç','Orta','İleri','Uzman'].map(lv => (
                        <span key={lv} className={`premiumLangDot ${levelPct[lang.level] >= levelPct[lv] ? 'fill' : ''}`} />
                      ))}
                      <span className="premiumLangLabel">{levelLabel[lang.level] || lang.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.some(c => c.name) && (
            <section className="premiumSection premiumSectionSide" data-section="certifications">
              <SectionTitle icon="📜" title={sectionTitles.certifications} />
              <div className="premiumCertList">
                {certifications.filter(c => c.name).map((cert, idx) => (
                  <div key={cert.id} className="premiumCertItem" data-card="certification" data-card-index={idx}>
                    <strong>{cert.name}</strong>
                    <span className="premiumCertMeta">{cert.issuer}{cert.date ? ` · ${formatDate(cert.date, lang)}` : ''}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
