const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const analysisDir = path.join(__dirname, '..', 'analysis');
const uploadsDir = path.join(__dirname, '..', 'uploads');
const cacheDir = path.join(analysisDir, 'cache');

function getPendingFile() {
  const pendingPath = path.join(analysisDir, 'pending.txt');
  if (!fs.existsSync(pendingPath)) return null;
  const content = fs.readFileSync(pendingPath, 'utf-8').trim();
  const parts = content.split('|');
  const filename = parts[0];
  const hash = parts.length > 1 ? parts[1] : null;
  const filepath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filepath)) return null;
  return { filename, filepath, hash };
}

function hasResult() {
  return fs.existsSync(path.join(analysisDir, 'result.json'));
}

function getCachedAnalysis(hash) {
  const cachedPath = path.join(cacheDir, `${hash}.json`);
  if (fs.existsSync(cachedPath)) {
    return JSON.parse(fs.readFileSync(cachedPath, 'utf-8'));
  }
  return null;
}

function saveAnalysis(data, hash = null) {
  fs.writeFileSync(path.join(analysisDir, 'result.json'), JSON.stringify(data, null, 2));

  if (hash) {
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(path.join(cacheDir, `${hash}.json`), JSON.stringify(data, null, 2));
  }

  const pendingPath = path.join(analysisDir, 'pending.txt');
  if (fs.existsSync(pendingPath)) fs.unlinkSync(pendingPath);
  console.log(`Analysis saved${hash ? ' (cached)' : ''}`);
}

module.exports = { getPendingFile, hasResult, getCachedAnalysis, saveAnalysis };
