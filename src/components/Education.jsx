import { useCV } from '../context/CVContext';

export default function Education() {
  const { cvData, updateEducation, addEducation, removeEducation } = useCV();

  return (
    <div className="section">
      <div className="sectionHeader">
        <h3>Eğitim</h3>
        <button className="btnAdd" onClick={addEducation}>+ Ekle</button>
      </div>
      {cvData.education.map((edu, i) => (
        <div key={edu.id} className="card">
          <div className="cardHeader">
            <span className="cardIndex">{i + 1}</span>
            {cvData.education.length > 1 && (
              <button className="btnRemove" onClick={() => removeEducation(edu.id)}>x</button>
            )}
          </div>
          <div className="formGrid">
            <div className="field">
              <label>Okul</label>
              <input type="text" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} placeholder="Üniversite Adı" />
            </div>
            <div className="field">
              <label>Derece</label>
              <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Lisans / Yüksek Lisans" />
            </div>
            <div className="field">
              <label>Alan</label>
              <input type="text" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Bilgisayar Mühendisliği" />
            </div>
            <div className="field">
              <label>Başlangıç</label>
              <input type="month" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
            </div>
            <div className="field">
              <label>Bitiş</label>
              <input type="month" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
            </div>
            <div className="field">
              <label>GPA (opsiyonel)</label>
              <input type="text" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
