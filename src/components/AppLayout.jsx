import { useState, useEffect } from 'react';
import { useCV } from '../context/CVContext';
import CVImport from './CVImport';
import PDFPreview from './PDFPreview';
import MultiPagePreview from './MultiPagePreview';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Languages from './Languages';
import Certifications from './Certifications';
import Summary from './Summary';
import HRAnalysis from './HRAnalysis';
import Settings from './Settings';
import ModernTemplate from '../templates/ModernTemplate';
import PremiumTemplate from '../templates/PremiumTemplate';
import NovaTechTemplate from '../templates/NovaTechTemplate';
import JakesResumeTemplate from '../templates/JakesResumeTemplate';
import DeedyResumeTemplate from '../templates/DeedyResumeTemplate';
import DeveloperTemplate from '../templates/DeveloperTemplate';
import ElegantTemplate from '../templates/ElegantTemplate';
import TechResumeTemplate from '../templates/TechResumeTemplate';
import { exportPDF } from '../utils/pdfExport';

const sections = [
  { id: 'import', label: '📥 CV Yükle', comp: CVImport },
  { id: 'personal', label: '👤 Kişisel', comp: PersonalInfo },
  { id: 'summary', label: '📝 Özet', comp: Summary },
  { id: 'experience', label: '💼 Deneyim', comp: Experience },
  { id: 'education', label: '🎓 Eğitim', comp: Education },
  { id: 'skills', label: '🔧 Yetenekler', comp: Skills },
  { id: 'languages', label: '🌐 Diller', comp: Languages },
  { id: 'certifications', label: '📜 Sertifikalar', comp: Certifications },
  { id: 'analysis', label: '📊 İK Analizi', comp: HRAnalysis },
  { id: 'settings', label: '⚙️ Şablon & Ayarlar', comp: Settings },
];

const templates = {
  premium: PremiumTemplate,
  modern: ModernTemplate,
  novaTech: NovaTechTemplate,
  jakes: JakesResumeTemplate,
  deedy: DeedyResumeTemplate,
  developer: DeveloperTemplate,
  elegant: ElegantTemplate,
  tech: TechResumeTemplate,
};
const templateNames = {
  premium: 'Premium',
  modern: 'Modern',
  novaTech: 'NovaTech',
  jakes: "Jake's Resume",
  deedy: 'Deedy Resume',
  developer: 'Developer',
  elegant: 'Elegant',
  tech: 'Tech Resume',
};

export default function AppLayout() {
  const { cvData, uploadedFile, resetCV, updateSetting, saveCV } = useCV();
  const [activeSection, setActiveSection] = useState('import');
  const [showPdf, setShowPdf] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setShowPdf(!!uploadedFile);
  }, [uploadedFile]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const ActiveComp = sections.find(s => s.id === activeSection)?.comp || CVImport;
  const PreviewTemplate = templates[cvData.template] || ModernTemplate;

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportPDF('cvPreview', `${(cvData.personal.fullName || 'CV').replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    }
    setExporting(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveCV();
    setSaving(false);
    setToast(ok ? '✅ Kaydedildi' : '❌ Kaydetme başarısız');
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="app">
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.includes('✅') ? '#059669' : '#dc2626',
          color: 'white', padding: '12px 24px', borderRadius: 8,
          fontSize: 14, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'opacity 0.3s'
        }}>
          {toast}
        </div>
      )}
      <header className="appHeader">
        <div className="appHeaderLeft">
          <h1>🧑‍💼 CV Geliştirici</h1>
          <span className="appSubtitle">İK Uzmanı Gözüyle CV Danışmanlığı</span>
        </div>
        <div className="appHeaderActions">
          <button className="btnExport" onClick={handleSave} style={{ background: '#059669' }} disabled={saving}>
            {saving ? '⏳' : '💾 Kaydet'}
          </button>
          <button className="btnExport" onClick={handleExport} disabled={exporting}>
            {exporting ? '⏳ Hazırlanıyor...' : '📄 PDF İndir'}
          </button>
          <button className="btnReset" onClick={resetCV} style={{ margin: 0, padding: '6px 12px', fontSize: 12 }}>
            Sıfırla
          </button>
        </div>
      </header>

      <div className="appBody">
        <aside className="sidebar">
          <nav className="sidebarNav">
            {sections.map(s => (
              <button
                key={s.id}
                className={`sidebarBtn ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
          <div className="sidebarContent">
            <ActiveComp onNavigate={handleNavigate} />
          </div>
        </aside>

        <main className="preview" id="cvPreview">
          <div className="previewToolbar">
            <span className="previewLabel">
              {showPdf ? '📄 Yüklenen CV (PDF)' : `Önizleme — ${templateNames[cvData.template] || 'Premium'} Şablonu`}
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {uploadedFile && (
                <button
                  className="sidebarBtn"
                  onClick={() => setShowPdf(p => !p)}
                  style={{ fontSize: 12, padding: '4px 10px' }}
                >
                  {showPdf ? 'Şablon Göster' : 'PDF Göster'}
                </button>
              )}
              <select
                value={cvData.template}
                onChange={e => { updateSetting('template', e.target.value); setShowPdf(false); }}
                style={{ fontSize: 12, padding: '2px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'white' }}
              >
                {Object.entries(templateNames).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="previewScroll">
            {showPdf && uploadedFile ? (
              <PDFPreview fileUrl={`/uploads/${uploadedFile}`} />
            ) : (
              <MultiPagePreview Template={PreviewTemplate} data={cvData} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
