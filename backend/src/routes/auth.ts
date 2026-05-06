import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db';
import { requireAuth, signToken, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const colors = ['#6c47ff', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, avatar_color) VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar_color, created_at',
      [name.trim(), email.toLowerCase().trim(), hash, color]
    );
    const user = result.rows[0];
    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const result = await pool.query(
      'SELECT id, name, email, password_hash, avatar_color, created_at FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password' });

    const { password_hash, ...safeUser } = user;
    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar_color, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/saved - get saved colleges
router.get('/saved', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const colleges = await pool.query(
      `SELECT c.id, c.name, c.location, c.type, c.rating, c.annual_fees_min,
        c.placement_avg_package, c.placement_percentage, c.nirf_rank, c.image_url,
        sc.created_at as saved_at
       FROM saved_colleges sc JOIN colleges c ON sc.college_id = c.id
       WHERE sc.user_id = $1 ORDER BY sc.created_at DESC`,
      [req.userId]
    );
    const comparisons = await pool.query(
      `SELECT sc.id, sc.college_ids, sc.label, sc.created_at,
        (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'type', c.type))
         FROM colleges c WHERE c.id = ANY(sc.college_ids)) as colleges
       FROM saved_comparisons sc WHERE sc.user_id = $1 ORDER BY sc.created_at DESC`,
      [req.userId]
    );
    res.json({ savedColleges: colleges.rows, savedComparisons: comparisons.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/saved/college/:id - save a college
router.post('/saved/college/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'INSERT INTO saved_colleges (user_id, college_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, req.params.id]
    );
    res.json({ saved: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/auth/saved/college/:id - unsave a college
router.delete('/saved/college/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM saved_colleges WHERE user_id = $1 AND college_id = $2',
      [req.userId, req.params.id]
    );
    res.json({ saved: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/saved/comparison - save a comparison
router.post('/saved/comparison', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { college_ids, label } = req.body;
    if (!college_ids || college_ids.length < 2)
      return res.status(400).json({ error: 'At least 2 colleges required' });
    const result = await pool.query(
      'INSERT INTO saved_comparisons (user_id, college_ids, label) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, college_ids, label || null]
    );
    res.status(201).json({ comparison: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/auth/saved/comparison/:id
router.delete('/saved/comparison/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM saved_comparisons WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
