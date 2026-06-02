import { useCV } from '../context/CVContext';

const levels = ['Başlangıç', 'Orta', 'İleri', 'Ana Dil'];

export default function Languages() {
  const { cvData, updateLanguage, addLanguage, removeLanguage } = useCV();

  return (
    <div className="section">
      <div className="sectionHeader">
        <h3>Diller</h3>
        <button className="btnAdd" onClick={addLanguage}>+ Ekle</button>
      </div>
      {cvData.languages.map((lang, i) => (
        <div key={lang.id} className="card">
          <div className="cardHeader">
            <span className="cardIndex">{i + 1}</span>
            {cvData.languages.length > 1 && (
              <button className="btnRemove" onClick={() => removeLanguage(lang.id)}>x</button>
            )}
          </div>
          <div className="formGrid">
            <div className="field">
              <label>Dil</label>
              <input type="text" value={lang.name} onChange={e => updateLanguage(lang.id, 'name', e.target.value)} placeholder="İngilizce" />
            </div>
            <div className="field">
              <label>Seviye</label>
              <select value={lang.level} onChange={e => updateLanguage(lang.id, 'level', e.target.value)}>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
