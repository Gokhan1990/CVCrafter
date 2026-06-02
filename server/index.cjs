const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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

app.post('/api/upload', upload.single('cv'), (req, res) => {
  const filename = req.file.filename;
  const filepath = path.join(uploadsDir, filename);
  const hash = fileHash(filepath);
  const cachedPath = path.join(cacheDir, `${hash}.json`);
  fs.writeFileSync(path.join(analysisDir, 'last-upload.txt'), filename);

  if (fs.existsSync(cachedPath)) {
    const cached = JSON.parse(fs.readFileSync(cachedPath, 'utf-8'));
    fs.writeFileSync(path.join(analysisDir, 'result.json'), JSON.stringify(cached, null, 2));
    const pendingPath = path.join(analysisDir, 'pending.txt');
    if (fs.existsSync(pendingPath)) fs.unlinkSync(pendingPath);
    return res.json({ success: true, filename, cached: true, message: 'Bu CV daha once analiz edilmisti. Kaydedilmis sonuc yuklendi.' });
  }

  fs.writeFileSync(path.join(analysisDir, 'pending.txt'), `${filename}|${hash}`);
  res.json({ success: true, filename, cached: false, message: 'CV yuklendi. AI analizi bekleniyor...' });
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

app.post('/api/save-analysis', (req, res) => {
  const data = req.body;
  const resultPath = path.join(analysisDir, 'result.json');
  fs.writeFileSync(resultPath, JSON.stringify(data, null, 2));
  const pendingPath = path.join(analysisDir, 'pending.txt');

  let hash = null;
  if (fs.existsSync(pendingPath)) {
    const content = fs.readFileSync(pendingPath, 'utf-8').trim();
    const parts = content.split('|');
    hash = parts.length > 1 ? parts[1] : null;
    fs.unlinkSync(pendingPath);
  }

  if (hash) {
    fs.writeFileSync(path.join(cacheDir, `${hash}.json`), JSON.stringify(data, null, 2));
  }

  res.json({ success: true, cached: !!hash });
});

app.post('/api/verify-hash', (req, res) => {
  const { hash } = req.body;
  const cachedPath = path.join(cacheDir, `${hash}.json`);
  res.json({ exists: fs.existsSync(cachedPath) });
});

app.use('/uploads', express.static(uploadsDir));

app.listen(PORT, () => {
  console.log(`CV Backend running on http://localhost:${PORT}`);
});
