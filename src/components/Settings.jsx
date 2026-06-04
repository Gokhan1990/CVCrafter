import { useState } from 'react';
import { useCV } from '../context/CVContext';

const availableTemplates = [
  { id: 'premium', name: 'Premium ⭐9.0', desc: 'Şık, tek sütunlu, progress bar — en yüksek kalite' },
  { id: 'premiumMinimal', name: 'Premium Minimal', desc: 'Premium\'ın sade versiyonu, daha az yoğun' },
  { id: 'modern', name: 'Modern', desc: 'Renkli, yan panel, görsel ağırlıklı' },
  { id: 'classic', name: 'Klasik', desc: 'Dengeli, iki sütunlu, profesyonel' },
  { id: 'ats', name: 'ATS Dostu', desc: 'Sade, siyah-beyaz, sistemler tarafından okunabilir' },
  { id: 'pragmatic', name: 'Pragmatic Engineer ⭐9.5', desc: 'Tek sütun, ATS canavarı — 6.500+ indirme, FAANG geri dönüşü kanıtlanmış' },
  { id: 'beamjobs', name: 'BeamJobs Harvard ⭐9.0', desc: 'Ters kronolojik, metrik odaklı, ATS 95%+ başarı' },
  { id: 'reziJake', name: 'Rezi Jake\'s ⭐9.0', desc: 'Tek sütun, yüksek yoğunluk, Overleaf\'ten HTML\'e' },
  { id: 'faangSingle', name: 'FAANG Single ⭐8.5', desc: '1 sayfa, action+result+metric, recruitler 6 saniyede tarar' },
  { id: 'minimalCanva', name: 'Minimal Canva ⭐8.0', desc: 'İnce çizgiler, bol beyaz alan, minimalist şıklık' },
  { id: 'dualColumn', name: 'Dual Column ⭐8.0', desc: 'İki sütunlu, sol panel iletişim+yetenek' },
  { id: 'googleDocsATS', name: 'Google Docs ATS ⭐8.5', desc: '97.8% ATS başarı, Calibri 11pt, en güvenilir format' },
  { id: 'enhancvModern', name: 'Enhancv Modern ⭐7.5', desc: 'Gradient header, progress bar, görsel ağırlıklı' },
  { id: 'sleekTech', name: 'Sleek Tech ⭐8.0', desc: 'Blue accent, temiz hizalama, border-left deneyim' },
  { id: 'standardParker', name: 'Standard Parker ⭐8.5', desc: 'Pragmatic Engineer portu, web-based, trackable' },
];

const fontSizes = [
  { id: 'small', name: 'Küçük' },
  { id: 'medium', name: 'Orta' },
  { id: 'large', name: 'Büyük' },
];

export default function Settings() {
  const { cvData, updateSetting, resetCV } = useCV();

  return (
    <div className="section">
      <h3>CV Ayarları</h3>

      <div className="card" style={{ marginBottom: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Şablon Seçimi</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {availableTemplates.map(t => (
            <label key={t.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              border: `2px solid ${cvData.template === t.id ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              background: cvData.template === t.id ? 'rgba(37,99,235,0.05)' : 'transparent',
            }}>
              <input
                type="radio"
                name="template"
                checked={cvData.template === t.id}
                onChange={() => updateSetting('template', t.id)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <div>
                <strong style={{ fontSize: 13 }}>{t.name}</strong>
                <p style={{ fontSize: 11, color: 'var(--textSecondary)', margin: 0 }}>{t.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="formGrid">
        <div className="field">
          <label>Ana Renk</label>
          <input type="color" value={cvData.primaryColor} onChange={e => updateSetting('primaryColor', e.target.value)} />
        </div>
        <div className="field">
          <label>Yazı Boyutu</label>
          <select value={cvData.fontSize} onChange={e => updateSetting('fontSize', e.target.value)}>
            {fontSizes.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Dil / Language</label>
          <select value={cvData.language || 'tr'} onChange={e => updateSetting('language', e.target.value)}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ background: '#fefce8', border: '1px solid #facc15', marginTop: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#854d0e' }}>İK Tavsiyesi</h4>
        <p style={{ fontSize: 12, color: '#854d0e', margin: 0 }}>
          ATS (Applicant Tracking System) dostu şablon, yazılım sektöründe başvuruların %75'inde kullanılan sistemler tarafından sorunsuz okunur. Renkli şablonlar görsel olarak etkileyici olsa da ATS uyumluluğu düşüktür. Başvuru yaparken ATS şablonunu, portföy için modern şablonu kullanın.
        </p>
      </div>

      <button className="btnReset" onClick={resetCV} style={{ marginTop: 12 }}>Tüm CV'yi Sıfırla</button>
    </div>
  );
}
