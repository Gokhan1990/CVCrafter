import { useCV } from '../context/CVContext';

const categories = [
  { id: 'languages', label: 'Diller & Teknolojiler' },
  { id: 'frameworks', label: 'Framework & Kütüphaneler' },
  { id: 'tools', label: 'Araçlar & Platformlar' },
  { id: 'databases', label: 'Veritabanları' },
  { id: 'other', label: 'Diğer Yetenekler' },
];

const levels = ['Başlangıç', 'Orta', 'İleri', 'Uzman'];

export default function Skills() {
  const { cvData, updateSkill, addSkill, removeSkill } = useCV();

  const getSkillsByCategory = (catId) => cvData.skills.filter(s => s.category === catId);

  return (
    <div className="section">
      <h3>Teknik Yetenekler</h3>
      <p style={{ fontSize: 13, color: 'var(--textSecondary)', marginBottom: 12 }}>
        İK uzmanı notu: Yetenekleri kategorize etmek ve seviye belirtmek ATS puanınızı %40 artırır.
      </p>
      {categories.map(cat => (
        <div key={cat.id} className="card" style={{ marginBottom: 12 }}>
          <div className="sectionHeader">
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{cat.label}</h4>
            <button
              className="btnAdd"
              onClick={() => addSkill(cat.id)}
              style={{ padding: '2px 10px', fontSize: 12 }}
            >+ Ekle</button>
          </div>
          {getSkillsByCategory(cat.id).length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--textSecondary)', fontStyle: 'italic' }}>Henüz yetenek eklenmedi</p>
          )}
          {getSkillsByCategory(cat.id).map((skill, i) => {
            const idx = cvData.skills.indexOf(skill);
            return (
              <div key={skill.id} className="skillItem" style={{ marginBottom: 6 }}>
                <input
                  type="text"
                  value={skill.name}
                  onChange={e => updateSkill(idx, 'name', e.target.value)}
                  placeholder="Yetenek adı"
                  style={{ flex: 1 }}
                />
                <select
                  value={skill.level}
                  onChange={e => updateSkill(idx, 'level', e.target.value)}
                  style={{ width: 110, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 12, background: 'var(--surface)' }}
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {cvData.skills.filter(s => s.category === cat.id).length > 1 && (
                  <button className="btnRemove" onClick={() => removeSkill(idx)} style={{ width: 24, height: 24, fontSize: 14 }}>x</button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
