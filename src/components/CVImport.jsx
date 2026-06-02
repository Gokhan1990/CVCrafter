import { useState, useCallback, useEffect } from 'react';
import { useCV } from '../context/CVContext';
import PDFPreview from './PDFPreview';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function extractPhoto(pdfUrl) {
  try {
    const resp = await fetch(pdfUrl);
    const buffer = await resp.arrayBuffer();
    const pdfData = new Uint8Array(buffer);
    const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const page = await pdfDoc.getPage(1);

    const opList = await page.getOperatorList();
    let best = null, bestSize = 0;

    for (let j = 0; j < opList.fnArray.length; j++) {
      const op = opList.fnArray[j];
      if (op === pdfjsLib.OPS.paintImageXObject) {
        const imgName = opList.argsArray[j][0];
        let img = null;
        try { img = page.objs?.get(imgName); } catch(e) {}
        if (!img) try { img = page.commonObjs?.get(imgName); } catch(e) {}
        if (img && img.data) {
          const size = (img.width || 0) * (img.height || 0);
          if (size > bestSize) { bestSize = size; best = img; }
        }
      } else if (op === pdfjsLib.OPS.paintInlineImageXObject) {
        const inlineData = opList.argsArray[j][0];
        if (inlineData && inlineData.data) {
          const size = (inlineData.width || 0) * (inlineData.height || 0);
          if (size > bestSize) { bestSize = size; best = inlineData; }
        }
      }
    }

    if (!best) {
      const canvas = document.createElement('canvas');
      const viewport = page.getViewport({ scale: 1 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      for (let j = 0; j < opList.fnArray.length; j++) {
        if (opList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
          const imgName = opList.argsArray[j][0];
          let img = null;
          try { img = page.objs?.get(imgName); } catch(e) {}
          if (!img) try { img = page.commonObjs?.get(imgName); } catch(e) {}
          if (img && img.data) {
            const size = (img.width || 0) * (img.height || 0);
            if (size > bestSize) { bestSize = size; best = img; }
          }
        }
      }
    }

    if (best) {
      const c = document.createElement('canvas');
      c.width = best.width;
      c.height = best.height;
      const cx = c.getContext('2d');
      const imageData = cx.createImageData(best.width, best.height);
      imageData.data.set(best.data);
      cx.putImageData(imageData, 0, 0);
      return c.toDataURL('image/jpeg', 0.85);
    }

    // Fallback: crop top-right area (common CV photo position)
    const canvas = document.createElement('canvas');
    const viewport = page.getViewport({ scale: 2 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const size = Math.round(Math.min(canvas.width, canvas.height) * 0.1);
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = size;
    cropCanvas.height = size;
    const cropCtx = cropCanvas.getContext('2d');
    const cropX = canvas.width - size - Math.round(canvas.width * 0.05);
    const cropY = Math.round(canvas.height * 0.03);
    cropCtx.drawImage(canvas, cropX, cropY, size, size, 0, 0, size, size);
    return cropCanvas.toDataURL('image/jpeg', 0.85);
  } catch (e) { /* photo extraction failed silently */ }
  return null;
}

export default function CVImport({ onNavigate }) {
  const { cvData, setCVData, uploadedFile, setUploadedFile } = useCV();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetch('/api/analysis').then(r => r.json()).then(data => {
      if (data.status !== 'waiting' && data.uploadedFile) {
        setAnalysis(data);
        setUploadedFile(data.uploadedFile);
        setStep('results');
        applyParsedData(data);
      }
    }).catch(() => {});
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStep('uploading');

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setUploadedFile(data.filename);
        setStep('waiting');
        startChecking();
      } else {
        setStep('error');
      }
    } catch (err) {
      setStep('error');
    }
    setUploading(false);
  };

  const startChecking = useCallback(() => {
    setChecking(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/analysis');
        const data = await res.json();
        if (data.status !== 'waiting') {
          clearInterval(interval);
          setChecking(false);
          setAnalysis(data);
          setStep('results');
          applyParsedData(data);
        }
      } catch {}
    }, 2000);
  }, []);

  const applyParsedData = useCallback((data) => {
    if (!data?.parsed) return;
    const p = data.parsed;
    setCVData(prev => ({
      ...prev,
      personal: { ...prev.personal, ...p.personal },
      summary: p.summary || prev.summary,
      experience: p.experience?.length > 0 ? p.experience : prev.experience,
      education: p.education?.length > 0 ? p.education : prev.education,
      skills: p.skills?.length > 0 ? p.skills : prev.skills,
      languages: p.languages?.length > 0 ? p.languages : prev.languages,
      certifications: p.certifications?.length > 0 ? p.certifications : prev.certifications,
    }));
    if (data.templateRec?.id) {
      setCVData(prev => ({ ...prev, template: data.templateRec.id }));
    }
    const file = data.uploadedFile || uploadedFile;
    if (file) {
      extractPhoto(`/uploads/${file}`).then(url => {
        if (url) setCVData(prev => ({ ...prev, personal: { ...prev.personal, photo: url } }));
      });
    }
  }, [setCVData, uploadedFile]);

  const applyToForm = () => {
    applyParsedData(analysis);
    if (onNavigate) onNavigate('preview');
  };

  return (
    <div className="section">
      {step === 'upload' && (
        <div className="uploadHero">
          <div className="uploadIcon">📄</div>
          <h2 style={{ margin: '8px 0', fontSize: 20 }}>CV'nizi Yükleyin</h2>
          <p style={{ color: 'var(--textSecondary)', marginBottom: 16, fontSize: 14 }}>
            PDF formatındaki CV'nizi seçin. AI uzmanı olarak analiz edip size özel öneriler sunacağım.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFile}
              style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, maxWidth: 280 }}
            />
            {file && (
              <button className="uploadBtn" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Yükleniyor...' : 'CV\'yi AI\'ya Gönder'}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'uploading' && (
        <div className="uploadHero">
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <h3 style={{ fontSize: 18 }}>CV Yükleniyor...</h3>
          <p style={{ color: 'var(--textSecondary)', fontSize: 14 }}>PDF backend'e gönderiliyor.</p>
        </div>
      )}

      {step === 'waiting' && (
        <div>
          <div className="uploadHero">
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 18 }}>AI Analiz Ediyor...</h3>
            <p style={{ color: 'var(--textSecondary)', fontSize: 14 }}>
              CV'niz AI uzmanına iletildi. Analiz sonucu anlık olarak görünecek.
              {checking && <span style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                ⏱ Sonuç bekleniyor...
              </span>}
            </p>
          </div>
          {uploadedFile && (
            <details open style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 13, cursor: 'pointer', color: 'var(--textSecondary)', fontWeight: 500 }}>📄 CV'yi Görüntüle</summary>
              <div style={{ marginTop: 8, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <PDFPreview fileUrl={`/uploads/${uploadedFile}`} />
              </div>
            </details>
          )}
        </div>
      )}

      {step === 'results' && analysis && (
        <div>
          {uploadedFile && (
            <details style={{ marginBottom: 12 }}>
              <summary style={{ fontSize: 13, cursor: 'pointer', color: 'var(--textSecondary)', fontWeight: 500, padding: '6px 0' }}>📄 Orijinal CV'yi Görüntüle</summary>
              <div style={{ marginTop: 8, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <PDFPreview fileUrl={`/uploads/${uploadedFile}`} />
              </div>
            </details>
          )}
          <div className="card" style={{
            textAlign: 'center',
            background: analysis.score >= 75 ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', marginBottom: 12
          }}>
            <div style={{ fontSize: 48, fontWeight: 700 }}>{analysis.score}/100</div>
            <div style={{ fontSize: 18, fontWeight: 600, opacity: 0.9 }}>{analysis.grade}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{analysis.passed}/{analysis.total} kriter karşılanmış</div>
          </div>

          {analysis.summary && (
            <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 12 }}>
              <h4 style={{ fontSize: 14, color: '#065f46', marginBottom: 4 }}>📋 Özet Değerlendirme</h4>
              <p style={{ fontSize: 13, color: '#065f46', margin: 0 }}>{analysis.summary}</p>
            </div>
          )}

          {analysis.advice?.length > 0 && (
            <div className="card" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: 12 }}>
              <h4 style={{ fontSize: 14, color: '#1e40af', marginBottom: 8 }}>🧑‍💼 İK Uzmanı Yorumum</h4>
              {analysis.advice.map((a, i) => (
                <div key={i} style={{ marginBottom: 6, padding: '6px 8px', background: 'white', borderRadius: 'var(--radius)', fontSize: 13 }}>
                  {a}
                </div>
              ))}
            </div>
          )}

          {analysis.failed?.length > 0 && (
            <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca', marginBottom: 12 }}>
              <h4 style={{ fontSize: 14, color: '#dc2626', marginBottom: 8 }}>Geliştirilmesi Gereken Alanlar</h4>
              {analysis.failed.map((c, i) => (
                <div key={i} style={{ marginBottom: 6, padding: '6px 8px', background: 'white', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#dc2626' }}>✗ {c.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--textSecondary)' }}>+{c.weight}p</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--textSecondary)', margin: '2px 0 0' }}>{c.tip}</p>
                </div>
              ))}
            </div>
          )}

          {analysis.templateRec && (
            <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 12 }}>
              <h4 style={{ fontSize: 14, color: '#166534', marginBottom: 8 }}>🎨 Önerilen Şablon</h4>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{analysis.templateRec.icon}</div>
              <strong style={{ fontSize: 14 }}>{analysis.templateRec.name}</strong>
              <p style={{ fontSize: 13, color: 'var(--textSecondary)', margin: '4px 0' }}>{analysis.templateRec.reason}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btnExport" onClick={applyToForm} style={{ flex: 1 }}>
              Veriyi Şablona Uygula
            </button>
            {onNavigate && (
              <button className="btnExport" onClick={() => onNavigate('settings')} style={{ flex: 1, background: '#7c3aed' }}>
                Tüm Şablonları Gör
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'error' && (
        <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h4 style={{ color: '#dc2626', marginBottom: 8 }}>Bir Hata Oluştu</h4>
          <p style={{ fontSize: 13 }}>Dosyayı kontrol edip tekrar deneyin.</p>
          <button className="btnExport" onClick={() => setStep('upload')} style={{ marginTop: 8 }}>Tekrar Dene</button>
        </div>
      )}
    </div>
  );
}
