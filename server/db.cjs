const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  user: process.env.DB_USER || 'cvuser',
  password: process.env.DB_PASS || 'cvpass',
  database: process.env.DB_NAME || 'cvapp',
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cv_saves (
        id SERIAL PRIMARY KEY,
        key VARCHAR(64) UNIQUE NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }
}

async function saveCV(key, data) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO cv_saves (key, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()`,
      [key, JSON.stringify(data)]
    );
    return true;
  } finally {
    client.release();
  }
}

async function loadCV(key) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT data FROM cv_saves WHERE key = $1', [key]
    );
    return result.rows[0]?.data || null;
  } finally {
    client.release();
  }
}

module.exports = { initDB, saveCV, loadCV };
