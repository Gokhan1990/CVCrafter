const { getPendingFile, hasResult, getCachedAnalysis, saveAnalysis } = require('./analyze.cjs');

const pending = getPendingFile();

if (!pending) {
  console.log('No pending CV to analyze.');
  process.exit(0);
}

const cached = getCachedAnalysis(pending.hash);
if (cached) {
  saveAnalysis(cached, pending.hash);
  console.log('Cached analysis restored. No re-analysis needed.');
  process.exit(0);
}

console.log(`NEW CV: ${pending.filename}`);
console.log(`Hash: ${pending.hash}`);
console.log('Analyze it, then run: node server/save-cache.cjs <json-data>');
