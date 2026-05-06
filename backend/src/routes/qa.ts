import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/qa - list questions (optionally filtered by college)
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { college_id, search, sort = 'latest', page = '1', limit = '15' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params: any[] = [];
    let where = 'WHERE 1=1';
    let p = 1;

    if (college_id) {
      where += ` AND q.college_id = $${p++}`;
      params.push(college_id);
    }
    if (search) {
      where += ` AND (q.title ILIKE $${p} OR q.body ILIKE $${p})`;
      params.push(`%${search}%`);
      p++;
    }

    const orderMap: Record<string, string> = {
      latest: 'q.created_at DESC',
      popular: 'q.upvotes DESC, q.answer_count DESC',
      unanswered: 'q.answer_count ASC, q.created_at DESC',
    };
    const order = orderMap[sort] || 'q.created_at DESC';

    const countQ = `SELECT COUNT(*) FROM questions q ${where}`;
    const dataQ = `
      SELECT q.*,
        u.name as author_name, u.avatar_color,
        c.name as college_name, c.type as college_type
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      LEFT JOIN colleges c ON q.college_id = c.id
      ${where}
      ORDER BY ${order}
      LIMIT $${p} OFFSET $${p + 1}
    `;

    const [count, data] = await Promise.all([
      pool.query(countQ, params),
      pool.query(dataQ, [...params, parseInt(limit), offset]),
    ]);

    res.json({
      questions: data.rows,
      total: parseInt(count.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(count.rows[0].count) / parseInt(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/qa/:id - single question with answers
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [qResult, aResult] = await Promise.all([
      pool.query(
        `SELECT q.*, u.name as author_name, u.avatar_color,
          c.name as college_name, c.type as college_type, c.id as college_id
         FROM questions q
         LEFT JOIN users u ON q.user_id = u.id
         LEFT JOIN colleges c ON q.college_id = c.id
         WHERE q.id = $1`,
        [id]
      ),
      pool.query(
        `SELECT a.*, u.name as author_name, u.avatar_color
         FROM answers a LEFT JOIN users u ON a.user_id = u.id
         WHERE a.question_id = $1 ORDER BY a.is_accepted DESC, a.upvotes DESC, a.created_at ASC`,
        [id]
      ),
    ]);

    if (qResult.rows.length === 0) return res.status(404).json({ error: 'Question not found' });

    // Check if user upvoted
    let userUpvotedAnswers: string[] = [];
    if (req.userId) {
      const upvotes = await pool.query(
        'SELECT answer_id FROM answer_upvotes WHERE user_id = $1 AND answer_id = ANY($2)',
        [req.userId, aResult.rows.map((a: any) => a.id)]
      );
      userUpvotedAnswers = upvotes.rows.map((r: any) => r.answer_id);
    }

    res.json({
      question: qResult.rows[0],
      answers: aResult.rows.map((a: any) => ({
        ...a,
        userUpvoted: userUpvotedAnswers.includes(a.id),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/qa - create question
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, college_id, tags } = req.body;
    if (!title || title.trim().length < 10)
      return res.status(400).json({ error: 'Title must be at least 10 characters' });

    const result = await pool.query(
      `INSERT INTO questions (user_id, college_id, title, body, tags)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.userId, college_id || null, title.trim(), body?.trim() || null, tags || []]
    );
    res.status(201).json({ question: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/qa/:id/answers - post an answer
router.post('/:id/answers', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    if (!body || body.trim().length < 10)
      return res.status(400).json({ error: 'Answer must be at least 10 characters' });

    const [answerResult] = await Promise.all([
      pool.query(
        'INSERT INTO answers (question_id, user_id, body) VALUES ($1, $2, $3) RETURNING *',
        [id, req.userId, body.trim()]
      ),
      pool.query(
        'UPDATE questions SET answer_count = answer_count + 1, updated_at = NOW() WHERE id = $1',
        [id]
      ),
    ]);

    const answer = answerResult.rows[0];
    const userRes = await pool.query('SELECT name, avatar_color FROM users WHERE id = $1', [req.userId]);
    res.status(201).json({
      answer: { ...answer, author_name: userRes.rows[0]?.name, avatar_color: userRes.rows[0]?.avatar_color },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/qa/:id/upvote - upvote a question
router.post('/:id/upvote', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await pool.query(
      'SELECT 1 FROM question_upvotes WHERE user_id = $1 AND question_id = $2',
      [req.userId, id]
    );
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM question_upvotes WHERE user_id = $1 AND question_id = $2', [req.userId, id]);
      await pool.query('UPDATE questions SET upvotes = GREATEST(0, upvotes - 1) WHERE id = $1', [id]);
      res.json({ upvoted: false });
    } else {
      await pool.query('INSERT INTO question_upvotes (user_id, question_id) VALUES ($1, $2)', [req.userId, id]);
      await pool.query('UPDATE questions SET upvotes = upvotes + 1 WHERE id = $1', [id]);
      res.json({ upvoted: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/qa/answers/:id/upvote - upvote an answer
router.post('/answers/:id/upvote', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await pool.query(
      'SELECT 1 FROM answer_upvotes WHERE user_id = $1 AND answer_id = $2',
      [req.userId, id]
    );
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM answer_upvotes WHERE user_id = $1 AND answer_id = $2', [req.userId, id]);
      await pool.query('UPDATE answers SET upvotes = GREATEST(0, upvotes - 1) WHERE id = $1', [id]);
      res.json({ upvoted: false });
    } else {
      await pool.query('INSERT INTO answer_upvotes (user_id, answer_id) VALUES ($1, $2)', [req.userId, id]);
      await pool.query('UPDATE answers SET upvotes = upvotes + 1 WHERE id = $1', [id]);
      res.json({ upvoted: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/qa/answers/:id/accept - accept an answer (only question author)
router.patch('/answers/:id/accept', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const answerRes = await pool.query(
      `SELECT a.*, q.user_id as question_author FROM answers a
       JOIN questions q ON a.question_id = q.id WHERE a.id = $1`,
      [id]
    );
    if (answerRes.rows.length === 0) return res.status(404).json({ error: 'Answer not found' });
    if (answerRes.rows[0].question_author !== req.userId)
      return res.status(403).json({ error: 'Only the question author can accept answers' });

    // Unaccept all other answers for this question
    await pool.query(
      'UPDATE answers SET is_accepted = FALSE WHERE question_id = $1',
      [answerRes.rows[0].question_id]
    );
    await pool.query('UPDATE answers SET is_accepted = TRUE WHERE id = $1', [id]);
    res.json({ accepted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
