import { useCV } from '../context/CVContext';

export default function HRAnalysis() {
  const { cvData } = useCV();
  const { personal, summary, experience, education, skills, languages, certifications } = cvData;

  const checks = [
    {
      label: 'Ad Soyad doldurulmuş',
      pass: !!personal.fullName,
      weight: 5,
      tip: 'İK ilk olarak isme bakar. Eksikse CV değerlendirmeye alınmaz.',
    },
    {
      label: 'E-posta doldurulmuş',
      pass: !!personal.email,
      weight: 5,
      tip: 'İletişim bilgisi olmazsa olmaz.',
    },
    {
      label: 'Telefon doldurulmuş',
      pass: !!personal.phone,
      weight: 5,
      tip: 'Hızlı geri dönüş için telefon kritik.',
    },
    {
      label: 'Profesyonel özet mevcut',
      pass: summary.length > 30,
      weight: 8,
      tip: 'Özet, CV\'nin öne çıkan bölümüdür. En az 2 cümle olmalı.',
    },
    {
      label: 'LinkedIn profili eklenmiş',
      pass: !!personal.linkedin,
      weight: 5,
      tip: 'Yazılım sektöründe LinkedIn birincil kaynaktır.',
    },
    {
      label: 'GitHub profili eklenmiş',
      pass: !!personal.github,
      weight: 10,
      tip: 'Yazılımcı için GitHub portföy niteliğindedir. Aday değerlendirmede büyük avantaj sağlar.',
    },
    {
      label: 'İş deneyimi mevcut',
      pass: experience.some(e => e.company),
      weight: 10,
      tip: 'Deneyim bölümü olmayan CV elenir.',
    },
    {
      label: 'Deneyim açıklamaları dolu',
      pass: experience.some(e => e.description && e.description.length > 50),
      weight: 10,
      tip: 'Sadece pozisyon adı yeterli değildir. Başarılarınızı yazın.',
    },
    {
      label: 'Deneyimlerde madde işareti kullanılmış',
      pass: experience.some(e => e.description && e.description.includes('•')),
      weight: 5,
      tip: 'Maddeler halinde yazılan deneyimler okunabilirliği artırır.',
    },
    {
      label: 'Eğitim bilgisi mevcut',
      pass: education.some(e => e.school),
      weight: 8,
      tip: 'Eğitim bilgisi olmayan CV eksik kabul edilir.',
    },
    {
      label: 'Teknik yetenekler kategorize edilmiş',
      pass: skills.some(s => s.category) && skills.filter(s => s.name).length > 2,
      weight: 8,
      tip: 'Kategorize edilmiş yetenekler ATS puanını yükseltir.',
    },
    {
      label: 'Yetenek seviyesi belirtilmiş',
      pass: skills.some(s => s.level && s.level !== 'Orta' && s.name),
      weight: 5,
      tip: 'Seviye belirtmek beklenti yönetimi için önemlidir.',
    },
    {
      label: 'Dil bilgisi eklenmiş',
      pass: languages.some(l => l.name),
      weight: 5,
      tip: 'Özellikle İngilizce seviyesi yazılım sektöründe kritik.',
    },
    {
      label: 'Sertifika eklenmiş',
      pass: certifications.some(c => c.name),
      weight: 5,
      tip: 'Sertifikalar farklılaşmanızı sağlar.',
    },
    {
      label: 'Sayısal veri / metrik mevcut',
      pass: experience.some(e => e.description && /\d+%|\d+x|\d+k/i.test(e.description)),
      weight: 10,
      tip: 'İK\'lar sayısal sonuçları sever. "%30 iyileştirme" gibi ifadeler güçlüdür.',
    },
    {
      label: 'Portföy / proje linki eklenmiş',
      pass: !!(personal.portfolio || personal.github),
      weight: 8,
      tip: 'Yazılımcı için yaptığı projeler en güçlü referanstır.',
    },
  ];

  const passed = checks.filter(c => c.pass);
  const failed = checks.filter(c => !c.pass);
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earnedWeight = passed.reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const getGrade = (s) => {
    if (s >= 90) return { label: 'Mükemmel', color: '#16a34a' };
    if (s >= 75) return { label: 'İyi', color: '#2563eb' };
    if (s >= 55) return { label: 'Geliştirilebilir', color: '#ca8a04' };
    return { label: 'Zayıf', color: '#dc2626' };
  };

  const grade = getGrade(score);

  return (
    <div className="section">
      <div className="sectionHeader">
        <h3>İK Analiz Paneli</h3>
      </div>

      <div className="card" style={{
        textAlign: 'center',
        background: grade.color + '10',
        border: `2px solid ${grade.color}`,
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: grade.color }}>{score}/100</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: grade.color }}>{grade.label}</div>
        <div style={{ fontSize: 12, color: 'var(--textSecondary)', marginTop: 4 }}>
          {passed.length}/{checks.length} kriter karşılanmış
        </div>
      </div>

      {failed.length > 0 && (
        <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, color: '#dc2626', marginBottom: 8 }}>İyileştirme Gereken Alanlar</h4>
          {failed.map((c, i) => (
            <div key={i} style={{ marginBottom: 8, padding: '6px 8px', background: 'white', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#dc2626' }}>✗ {c.label}</span>
                <span style={{ fontSize: 11, color: 'var(--textSecondary)', background: '#fef2f2', padding: '1px 6px', borderRadius: 8 }}>+{c.weight}p</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--textSecondary)', margin: '2px 0 0' }}>{c.tip}</p>
            </div>
          ))}
        </div>
      )}

      {passed.length > 0 && (
        <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h4 style={{ fontSize: 14, color: '#16a34a', marginBottom: 8 }}>Güçlü Yönler</h4>
          {passed.map((c, i) => (
            <div key={i} style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#16a34a' }}>✓</span>
              <span style={{ fontSize: 13 }}>{c.label}</span>
              <span style={{ fontSize: 11, color: 'var(--textSecondary)' }}>(+{c.weight}p)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
