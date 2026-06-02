import { useCV } from '../context/CVContext';

export default function Certifications() {
  const { cvData, updateCertification, addCertification, removeCertification } = useCV();

  return (
    <div className="section">
      <div className="sectionHeader">
        <h3>Sertifikalar</h3>
        <button className="btnAdd" onClick={addCertification}>+ Ekle</button>
      </div>
      {cvData.certifications.map((cert, i) => (
        <div key={cert.id} className="card">
          <div className="cardHeader">
            <span className="cardIndex">{i + 1}</span>
            {cvData.certifications.length > 1 && (
              <button className="btnRemove" onClick={() => removeCertification(cert.id)}>x</button>
            )}
          </div>
          <div className="formGrid">
            <div className="field">
              <label>Sertifika Adı</label>
              <input type="text" value={cert.name} onChange={e => updateCertification(cert.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
            </div>
            <div className="field">
              <label>Kurum</label>
              <input type="text" value={cert.issuer} onChange={e => updateCertification(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
            </div>
            <div className="field">
              <label>Tarih</label>
              <input type="month" value={cert.date} onChange={e => updateCertification(cert.id, 'date', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
