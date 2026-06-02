import { useCV } from '../context/CVContext';

export default function Experience() {
  const { cvData, updateExperience, addExperience, removeExperience } = useCV();

  return (
    <div className="section">
      <div className="sectionHeader">
        <h3>Deneyim</h3>
        <button className="btnAdd" onClick={addExperience}>+ Ekle</button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--textSecondary)', marginBottom: 12 }}>
        İK tavsiyesi: STAR yöntemiyle yazın — <strong>S</strong>ituation (Durum), <strong>T</strong>ask (Görev), <strong>A</strong>ction (Aksiyon), <strong>R</strong>esult (Sonuç). Sayısal veri ekleyin!
      </p>
      {cvData.experience.map((exp, i) => (
        <div key={exp.id} className="card">
          <div className="cardHeader">
            <span className="cardIndex">{i + 1}</span>
            {cvData.experience.length > 1 && (
              <button className="btnRemove" onClick={() => removeExperience(exp.id)}>x</button>
            )}
          </div>
          <div className="formGrid">
            <div className="field">
              <label>Şirket</label>
              <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Şirket Adı" />
            </div>
            <div className="field">
              <label>Pozisyon</label>
              <input type="text" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="Senior Frontend Developer" />
            </div>
            <div className="field">
              <label>Başlangıç</label>
              <input type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
            </div>
            <div className="field">
              <label>Bitiş</label>
              <input type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} />
              <label className="checkboxLabel">
                <input type="checkbox" checked={exp.current} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} />
                Devam ediyor
              </label>
            </div>
            <div className="field fullWidth">
              <label>Başarılar (maddeler halinde, STAR yöntemi)</label>
              <textarea rows="4" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                placeholder={"• Ekibin performansını %30 artırmak için React uygulamasını optimize ettim\n• 50k+ kullanıcılı mikroservis mimarisinde payment servisini sıfırdan kurdum\n• 3 kişilik ekibi yönettim, teslimat süresini 2 hafta kısalttım"} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
