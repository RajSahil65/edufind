import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// POST /api/predictor - Predict colleges based on exam + rank
router.post('/', async (req: Request, res: Response) => {
  try {
    const { exam, rank, category = 'General' } = req.body;

    if (!exam || !rank) {
      return res.status(400).json({ error: 'exam and rank are required' });
    }

    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum < 1) {
      return res.status(400).json({ error: 'Invalid rank' });
    }

    const result = await pool.query(
      `SELECT DISTINCT
        c.id, c.name, c.location, c.city, c.state, c.type,
        c.rating, c.annual_fees_min, c.annual_fees_max,
        c.placement_avg_package, c.placement_percentage,
        c.nirf_rank, c.image_url, c.accreditation,
        p.rank_min, p.rank_max,
        CASE
          WHEN $3 <= p.rank_max * 0.8 AND $3 >= p.rank_min THEN 'safe'
          WHEN $3 <= p.rank_max AND $3 >= p.rank_min THEN 'moderate'
          WHEN $3 <= p.rank_max * 1.3 AND $3 >= p.rank_min * 0.7 THEN 'ambitious'
          ELSE 'ambitious'
        END as admission_chance
      FROM predictor_data p
      JOIN colleges c ON c.id = p.college_id
      WHERE p.exam = $1
        AND p.category = $2
        AND p.rank_min <= $3 * 1.5
        AND p.rank_max >= $3 * 0.5
      ORDER BY c.nirf_rank ASC NULLS LAST
      LIMIT 30`,
      [exam, category, rankNum]
    );

    const safe = result.rows.filter(r => r.admission_chance === 'safe');
    const moderate = result.rows.filter(r => r.admission_chance === 'moderate');
    const ambitious = result.rows.filter(r => r.admission_chance === 'ambitious');

    res.json({
      exam,
      rank: rankNum,
      category,
      total: result.rows.length,
      results: {
        safe: safe.slice(0, 6),
        moderate: moderate.slice(0, 6),
        ambitious: ambitious.slice(0, 6),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/predictor/exams
router.get('/exams', async (_req: Request, res: Response) => {
  res.json({
    exams: ['JEE Main', 'JEE Advanced', 'CAT', 'GATE', 'NEET', 'State CET'],
    categories: ['General', 'OBC', 'SC', 'ST', 'EWS']
  });
});

export default router;