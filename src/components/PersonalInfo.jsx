import { useCV } from '../context/CVContext';

export default function PersonalInfo() {
  const { cvData, updatePersonal } = useCV();
  const { personal } = cvData;

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => updatePersonal('photo', ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="section">
      <h3>Kişisel Bilgiler</h3>
      <div className="formGrid">
        <div className="field">
          <label>Ad Soyad</label>
          <input type="text" value={personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} placeholder="Ahmet Yılmaz" />
        </div>
        <div className="field">
          <label>Ünvan</label>
          <input type="text" value={personal.title} onChange={e => updatePersonal('title', e.target.value)} placeholder="Frontend Geliştirici" />
        </div>
        <div className="field">
          <label>E-posta</label>
          <input type="email" value={personal.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="ahmet@ornek.com" />
        </div>
        <div className="field">
          <label>Telefon</label>
          <input type="tel" value={personal.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+90 555 123 4567" />
        </div>
        <div className="field">
          <label>Adres</label>
          <input type="text" value={personal.address} onChange={e => updatePersonal('address', e.target.value)} placeholder="İstanbul, Türkiye" />
        </div>
        <div className="field">
          <label>LinkedIn</label>
          <input type="text" value={personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/ahmet" />
        </div>
        <div className="field">
          <label>GitHub</label>
          <input type="text" value={personal.github} onChange={e => updatePersonal('github', e.target.value)} placeholder="github.com/ahmet" />
        </div>
        <div className="field">
          <label>Portföy / Projeler</label>
          <input type="text" value={personal.portfolio} onChange={e => updatePersonal('portfolio', e.target.value)} placeholder="github.com/ahmet/projeler" />
        </div>
        <div className="field">
          <label>Web Sitesi</label>
          <input type="text" value={personal.website} onChange={e => updatePersonal('website', e.target.value)} placeholder="ahmet.com" />
        </div>
        <div className="field">
          <label>Fotoğraf</label>
          <input type="file" accept="image/*" onChange={handlePhoto} />
          {personal.photo && <img src={personal.photo} alt="preview" className="photoPreview" />}
        </div>
      </div>
    </div>
  );
}
