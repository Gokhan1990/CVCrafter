const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { PDFParse } = require('pdf-parse');
const { initDB, saveCV, loadCV } = require('./db.cjs');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.DEEPSEEK_API_KEY;

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const uploadsDir = path.join(__dirname, '..', 'uploads');
const analysisDir = path.join(__dirname, '..', 'analysis');
const cacheDir = path.join(analysisDir, 'cache');
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });

initDB().catch(err => console.error('DB init failed:', err.message));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const name = `cv-${Date.now()}.pdf`;
    cb(null, name);
  },
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Sadece PDF dosyaları kabul edilir'));
}});

function fileHash(filepath) {
  const data = fs.readFileSync(filepath);
  return crypto.createHash('md5').update(data).digest('hex');
}

const ANALYSIS_PROMPT = (lang) => `Sen bir İK uzmanısın. CV metnini analiz et, İK gözüyle iyileştir ve JSON çıktısı üret.

TÜM ÇIKTILAR TÜRKÇE OLMALIDIR. CV metni İngilizce olsa bile tüm değerlendirme, öneriler, özet, description alanları TÜRKÇE yazılmalıdır.

KULLANILACAK KRİTERLER (her biri 0-10 puan, max 100):
1. Kişisel bilgiler (isim, iletişim) - 5 puan
2. Profesyonel özet/amaç - 10 puan
3. İş deneyimi (ters kronolojik, tarihler) - 15 puan
4. Başarı odaklı anlatım (STAR, sayısal veri) - 10 puan
5. Eğitim bilgisi - 8 puan
6. Teknik yetenekler (kategorize edilmiş) - 10 puan
7. Sektörle ilgili anahtar kelimeler - 7 puan
8. Dil becerileri - 5 puan
9. Sertifikalar/eğitimler - 5 puan
10. GitHub/portföy linki - 5 puan
11. ATS uyumluluğu (sade format) - 5 puan
12. Yazım/dil bilgisi doğruluğu - 5 puan
13. Özgeçmiş uzunluğu (ideal 1-2 sayfa) - 3 puan
14. Profesyonel görünüm/tutarlılık - 3 puan
15. Gönüllü çalışmalar/ekstra aktiviteler - 2 puan
16. Referanslar/mevcut durum - 2 puan

ÖNEMLİ - SIRALAMA: experience dizisini en güncelden en eskiye (ters kronolojik) sırala. Önce bitiş tarihi en yeni olan iş, en sonda bitiş tarihi en eski olan iş. "Devam Ediyor" işleri en üste koy!

ÖNEMLİ - İŞ DENEYİMİ İYİLEŞTİRME:
experience[].description alanını ASLA olduğu gibi kopyalama. CV'deki ham metni al, İK uzmanı gözüyle yeniden yaz:
- STAR yöntemine uygun hale getir (Durum, Görev, Eylem, Sonuç)
- Sayısal veriler ekle/vurgula
- Daha profesyonel ve etkili bir dil kullan
- Türkçe yaz
- 2-4 cümle arası olsun, öz ve etkili

ÖNEMLİ - YETENEK ÇIKARMA:
CV metnindeki tüm teknik becerileri, programlama dillerini, araçları, framework'leri, veritabanlarını, platformları tek tek tespit et ve uygun kategorilere ayırarak skills dizisine ekle. Her yetenek için seviye belirt (Başlangıç/Orta/İleri/Uzman). KULLANILACAK KATEGORİ ID'LERİ (birebir aynı olmalı): "languages" (programlama dilleri İÇİN — JavaScript, Python, Java, C#, Go, Rust vb. AYNI ZAMANDA HTML, CSS, SQL, Bash gibi kodlama dilleri de buraya), "frameworks" (framework, kütüphane, frontend/backend teknolojileri için — React, Angular, .NET, Node.js, Express, Django vb.), "tools" (araçlar, platformlar, DevOps için — Git, Docker, AWS, Jenkins, VS Code, Figma, Jira, Linux vb.), "databases" (veritabanları için — PostgreSQL, MongoDB, Redis, MySQL, Firebase vb.), "other" (diğer tüm yetenekler için). category alanına bu ID'lerden birini yaz.

SADECE JSON çıktısı ver. Açıklama yazma.

JSON FORMATI:
{
  "score": <0-100>,
  "grade": "<puan bazlı harf notu: 90+ Mükemmel, 75+ İyi, 60+ Orta, 45+ Geliştirilmeli, 45 altı Zayıf>",
  "passed": <geçen kriter sayısı>,
  "total": 16,
  "summary": "<3-4 cümlelik genel değerlendirme (TÜRKÇE)>",
  "advice": ["<öneri 1>", "<öneri 2>", "<öneri 3>", "<öneri 4>", "<öneri 5>"],
  "failed": [
    { "label": "<kriter adı>", "weight": <puan>, "tip": "<iyileştirme önerisi>" }
  ],
  "templateRec": {
    "id": "<modern|classic|ats>",
    "name": "<Modern|Klasik|ATS Dostu>",
    "icon": "🎨",
    "reason": "<kısa açıklama>"
  },
  "parsed": {
    "personal": {
      "fullName": "<bulunamazsa null>",
      "email": "<bulunamazsa null>",
      "phone": "<bulunamazsa null>",
      "address": "<bulunamazsa null>",
      "title": "<bulunamazsa null>",
      "github": "<bulunamazsa null>",
      "portfolio": "<bulunamazsa null>",
      "linkedin": "<bulunamazsa null>"
    },
    "summary": "<CV'deki özet metin yoksa BILE CV'nin geneline bakarak İK uzmanı gözüyle 3-4 cümlelik PROFESYONEL bir özet oluştur. Bu özet; kişinin unvanı, uzmanlık alanı, deneyim süresi, öne çıkan yetenekleri ve kariyer hedefini kapsamalı, etkileyici ve akıcı bir dille TÜRKÇE yazılmalıdır.>",
    "experience": [
      { "company": "<string>", "position": "<string>", "startDate": "<string>", "endDate": "<string veya 'Devam Ediyor'>", "description": "<İK UZMANI GÖZÜYLE YENİDEN YAZILMIŞ TÜRKÇE AÇIKLAMA>", "achievements": ["<başarı 1>", "<başarı 2>"] }
    ],
    "education": [
      { "school": "<string>", "degree": "<string>", "field": "<string>", "startDate": "<string>", "endDate": "<string>", "gpa": "<string veya null>" }
    ],
    "skills": [
      { "category": "<kategori>", "name": "<yetenek adı>", "level": "<Başlangıç|Orta|İleri|Uzman>" }
    ],
    "languages": [
      { "name": "<string>", "level": "<string>" }
    ],
    "certifications": [
      { "name": "<string>", "issuer": "<string>", "date": "<string veya null>" }
    ]
  }
}

Eksik alanlar için null veya boş array kullan. TÜM METİN ALANLARI TÜRKÇE OLMALIDIR. Şirket adları (company), okul adları (school), bölüm adları (field), diploma adları (degree), pozisyon adları (position), ünvan (title) gibi İngilizce yazılmış tüm alanları Türkçe'ye çevir.

ZORUNLU ÇEVİRİ ÖRNEKLERİ:
- "Ministry Of Energy And Natural Resources" -> "Enerji ve Tabii Kaynaklar Bakanlığı"
- "Environment And Urban Ministry" -> "Çevre ve Şehircilik Bakanlığı"  
- "Ministry..." ile başlayan HER ŞEY -> "... Bakanlığı"
- "Software Specialist" -> "Yazılım Uzmanı"
- "Senior Software Development Engineer" -> "Kıdemli Yazılım Geliştirme Mühendisi"
- "Computer Engineering" -> "Bilgisayar Mühendisliği"
- "Mathematics" (lisede alan/dal adı) -> "Sayısal"
- "Computer" (lisede alan/dal adı) -> "Sayısal"

CV'deki tüm İngilizce metinler Türkçe'ye çevrilmelidir. SADECE GEÇERLİ JSON DÖNDÜR.`;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

async function analyzeWithGemini(text, lang) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY ortam değişkeni eksik');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: ANALYSIS_PROMPT(lang) }] },
      contents: [{ parts: [{ text: `CV metni:\n\n${text}` }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
    })
  });
  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Gemini API hatası: ${response.status} ${response.statusText} ${errBody}`);
  }
  const result = await response.json();
  const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('Gemini yanıtında içerik bulunamadı');
  const jsonStart = content.indexOf('{');
  const jsonEnd = content.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('Gemini yanıtı JSON formatında değil');
  let raw = content.substring(jsonStart, jsonEnd + 1);
  raw = raw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']').replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`JSON parse hatası: ${e.message}. İlk 200 karakter: ${raw.slice(0, 200)}`);
  }
}

app.post('/api/upload', upload.single('cv'), async (req, res) => {
  try {
    const filename = req.file.filename;
    const filepath = path.join(uploadsDir, filename);
    const hash = fileHash(filepath);
    const cachedPath = path.join(cacheDir, `${hash}.json`);
    fs.writeFileSync(path.join(analysisDir, 'last-upload.txt'), filename);

    if (fs.existsSync(cachedPath)) {
      const cached = JSON.parse(fs.readFileSync(cachedPath, 'utf-8'));
      fs.writeFileSync(path.join(analysisDir, 'result.json'), JSON.stringify(cached, null, 2));
      return res.json({ success: true, filename, cached: true, message: 'Bu CV daha once analiz edilmisti. Kaydedilmis sonuc yuklendi.' });
    }

    const pdfBuf = fs.readFileSync(filepath);
    const parser = new PDFParse({ data: pdfBuf });
    await parser.load();
    const pdfData = await parser.getText();
    const extractedText = pdfData.pages.map(p => p.text).join('\n');
    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({ success: false, message: "PDF'ten metin cikarilamadi." });
    }

    const lang = req.query.lang || 'tr';
    const analysis = await analyzeWithGemini(extractedText, lang);

    if (analysis?.parsed?.experience) {
      const ayMap = { 'ocak':'01','şubat':'02','mart':'03','nisan':'04','mayıs':'05','haziran':'06','temmuz':'07','ağustos':'08','eylül':'09','ekim':'10','kasım':'11','aralık':'12','january':'01','february':'02','march':'03','april':'04','may':'05','june':'06','july':'07','august':'08','september':'09','october':'10','november':'11','december':'12','oca':'01','şub':'02','mar':'03','nis':'04','haz':'06','tem':'07','ağu':'08','eyl':'09','eki':'10','kas':'11','ara':'12','jan':'01','feb':'02','apr':'04','jun':'06','jul':'07','aug':'08','sep':'09','oct':'10','nov':'11','dec':'12' };
      const toKey = (s) => {
        if (!s) return '0000-00';
        if (['Devam','Devam Ediyor','Present'].includes(String(s).trim())) return '9999-99';
        let v = String(s).trim().toLowerCase();
        for (const [ad, num] of Object.entries(ayMap)) v = v.replace(ad, num);
        const rakam = v.match(/\d+/g);
        if (!rakam || rakam.length < 2) return '0000-00';
        let y = 0, m = '00';
        for (const r of rakam) { const n = parseInt(r, 10); if (n > 31) y = n; else if (n >= 1 && n <= 12) m = String(n).padStart(2, '0'); }
        return y ? `${y}-${m}` : '0000-00';
      };
      analysis.parsed.experience.sort((a, b) => {
        const aEnd = toKey(a.endDate), bEnd = toKey(b.endDate);
        if (aEnd > bEnd) return -1;
        if (aEnd < bEnd) return 1;
        const aStart = toKey(a.startDate), bStart = toKey(b.startDate);
        if (aStart > bStart) return -1;
        if (aStart < bStart) return 1;
        return 0;
      });
    }
    const resultPath = path.join(analysisDir, 'result.json');
    fs.writeFileSync(resultPath, JSON.stringify(analysis, null, 2));
    fs.writeFileSync(cachedPath, JSON.stringify(analysis, null, 2));
    res.json({ success: true, filename, cached: false, message: 'CV analiz edildi.' });
  } catch (err) {
    console.error('Upload/analiz hatasi:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/analysis', (req, res) => {
  const resultPath = path.join(analysisDir, 'result.json');
  if (fs.existsSync(resultPath)) {
    const data = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
    const lastFile = path.join(analysisDir, 'last-upload.txt');
    if (fs.existsSync(lastFile)) {
      data.uploadedFile = fs.readFileSync(lastFile, 'utf-8').trim();
    }
    return res.json(data);
  }
  res.json({ status: 'waiting' });
});

app.post('/api/save-cv', async (req, res) => {
  try {
    await saveCV('main', req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/save-cv', async (req, res) => {
  try {
    const data = await loadCV('main');
    res.json(data || {});
  } catch (err) {
    res.status(500).json({});
  }
});

app.delete('/api/upload', (req, res) => {
  try {
    if (fs.existsSync(analysisDir)) {
      fs.readdirSync(analysisDir).forEach(f => {
        if (f !== 'cache') {
          const fp = path.join(analysisDir, f);
          if (fs.lstatSync(fp).isFile()) fs.unlinkSync(fp);
        }
      });
    }
    if (fs.existsSync(uploadsDir)) {
      fs.readdirSync(uploadsDir).forEach(f => {
        fs.unlinkSync(path.join(uploadsDir, f));
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use('/uploads', express.static(uploadsDir));

app.listen(PORT, () => {
  console.log(`CV Backend running on http://localhost:${PORT}`);
});
