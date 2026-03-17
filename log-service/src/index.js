require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const { Pool } = require('pg');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     process.env.DB_HOST     || 'postgres',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'taskboard',
  user:     process.env.DB_USER     || 'admin',
  password: process.env.DB_PASSWORD || 'secret123',
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// ── Middleware: ตรวจ JWT ที่ต้องเป็น admin ────────────────────────────
function requireAdmin(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden: admin only' });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ══════════════════════════════════════════════════════════════════════
// POST /api/logs/internal — รับ log จาก services อื่น
// (ไม่ต้องมี JWT เพราะเรียกภายใน Docker network)
// Nginx บล็อก path นี้จากภายนอก → return 403)
// ══════════════════════════════════════════════════════════════════════
app.post('/api/logs/internal', async (req, res) => {
  const { service, level, event, user_id, ip_address,
          method, path, status_code, message, meta } = req.body;

  if (!service || !level || !event)
    return res.status(400).json({ error: 'service, level, event are required' });

  try {
    await pool.query(
      `INSERT INTO logs
         (service, level, event, user_id, ip_address,
          method, path, status_code, message, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [service, level, event,
       user_id || null, ip_address || null,
       method || null, path || null, status_code || null,
       message || null, meta ? JSON.stringify(meta) : null]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('[log] Insert error:', err.message);
    res.status(500).json({ error: 'DB error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/logs/ — ดึง logs (admin only)
// Query params: ?service=auth-service&level=ERROR&limit=100&offset=0
// ══════════════════════════════════════════════════════════════════════
app.get('/api/logs/', requireAdmin, async (req, res) => {
  const { service, level, event, limit = 100, offset = 0 } = req.query;

  const conditions = [];
  const values     = [];
  let   idx = 1;

  if (service) { conditions.push(`service = $${idx++}`); values.push(service); }
  if (level)   { conditions.push(`level = $${idx++}`);   values.push(level);   }
  if (event)   { conditions.push(`event = $${idx++}`);   values.push(event);   }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const countRes = await pool.query(`SELECT COUNT(*) FROM logs ${where}`, values);
    const total    = parseInt(countRes.rows[0].count);

    values.push(parseInt(limit));
    values.push(parseInt(offset));
    const result = await pool.query(
      `SELECT * FROM logs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );
    res.json({ logs: result.rows, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// ══════════════════════════════════════════════════════════════════════
// GET /api/logs/stats — สถิติ logs (admin only)
// ══════════════════════════════════════════════════════════════════════
app.get('/api/logs/stats', requireAdmin, async (req, res) => {
  try {
    const [byLevel, byService, byEvent, recent] = await Promise.all([
      pool.query(`SELECT level, COUNT(*) as count FROM logs GROUP BY level`),
      pool.query(`SELECT service, COUNT(*) as count FROM logs GROUP BY service`),
      pool.query(`SELECT event, COUNT(*) as count FROM logs GROUP BY event ORDER BY count DESC LIMIT 10`),
      pool.query(`SELECT COUNT(*) as count FROM logs WHERE created_at > NOW() - INTERVAL '24 hours'`)
    ]);
    res.json({
      by_level:   byLevel.rows,
      by_service: byService.rows,
      top_events: byEvent.rows,
      last_24h:   parseInt(recent.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /api/logs/health
app.get('/api/logs/health', (_, res) =>
  res.json({ status: 'ok', service: 'log-service' })
);

// ── Start ──────────────────────────────────────────────────────────────
async function start() {
  let retries = 10;
  while (retries > 0) {
    try { await pool.query('SELECT 1'); break; }
    catch (e) {
      console.log(`[log-service] Waiting DB... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => console.log(`[log-service] Running on :${PORT}`));
}
start();