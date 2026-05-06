import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/colleges - List with search, filter, pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search = '',
      state = '',
      type = '',
      fees_min = '0',
      fees_max = '99999999',
      course = '',
      sort = 'nirf_rank',
      page = '1',
      limit = '12'
    } = req.query as Record<string, string>;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params: (string | number)[] = [];
    let paramIndex = 1;

    let whereClause = 'WHERE 1=1';

    if (search) {
      whereClause += ` AND (c.name ILIKE $${paramIndex} OR c.city ILIKE $${paramIndex} OR c.location ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (state) {
      whereClause += ` AND c.state = $${paramIndex}`;
      params.push(state);
      paramIndex++;
    }

    if (type) {
      whereClause += ` AND c.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (fees_min !== '0' || fees_max !== '99999999') {
      whereClause += ` AND c.annual_fees_min >= $${paramIndex} AND c.annual_fees_max <= $${paramIndex + 1}`;
      params.push(parseInt(fees_min), parseInt(fees_max));
      paramIndex += 2;
    }

    if (course) {
      whereClause += ` AND EXISTS (SELECT 1 FROM courses co WHERE co.college_id = c.id AND co.name ILIKE $${paramIndex})`;
      params.push(`%${course}%`);
      paramIndex++;
    }

    const sortMap: Record<string, string> = {
      'nirf_rank': 'c.nirf_rank ASC NULLS LAST',
      'rating': 'c.rating DESC',
      'fees_low': 'c.annual_fees_min ASC',
      'fees_high': 'c.annual_fees_min DESC',
      'placement': 'c.placement_percentage DESC NULLS LAST',
    };
    const orderBy = sortMap[sort] || 'c.nirf_rank ASC NULLS LAST';

    const countParams = [...params];
    const countQuery = `SELECT COUNT(*) FROM colleges c ${whereClause}`;
    const dataParams = [...params, parseInt(limit), offset];
    const dataQuery = `
      SELECT 
        c.id, c.name, c.location, c.city, c.state, c.type, c.established,
        c.rating, c.total_reviews, c.annual_fees_min, c.annual_fees_max,
        c.placement_avg_package, c.placement_highest_package, c.placement_percentage,
        c.total_seats, c.nirf_rank, c.image_url, c.accreditation,
        (SELECT COUNT(*)::int FROM courses co WHERE co.college_id = c.id) as course_count
      FROM colleges c
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, countParams),
      pool.query(dataQuery, dataParams)
    ]);

    res.json({
      colleges: dataResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/colleges/filters
router.get('/filters', async (_req: Request, res: Response) => {
  try {
    const [states, types] = await Promise.all([
      pool.query('SELECT DISTINCT state FROM colleges ORDER BY state'),
      pool.query('SELECT DISTINCT type FROM colleges ORDER BY type')
    ]);
    res.json({
      states: states.rows.map((r: any) => r.state),
      types: types.rows.map((r: any) => r.type),
      courses: [
        'Computer Science Engineering',
        'Electronics & Communication Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Information Technology',
        'Data Science & AI',
        'MBA (General Management)',
        'Computer Science (M.Tech)',
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/colleges/compare/multi?ids=id1,id2,id3
router.get('/compare/multi', async (req: Request, res: Response) => {
  try {
    const ids = ((req.query.ids as string) || '').split(',').filter(Boolean).slice(0, 3);
    if (ids.length === 0) return res.status(400).json({ error: 'No IDs provided' });
    const result = await pool.query(
      `SELECT c.*,
        (SELECT json_agg(co.* ORDER BY co.annual_fees DESC) FROM courses co WHERE co.college_id = c.id) as courses
       FROM colleges c WHERE c.id = ANY($1::uuid[])
       ORDER BY c.nirf_rank ASC NULLS LAST`,
      [ids]
    );
    res.json({ colleges: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/colleges/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [collegeResult, coursesResult, reviewsResult] = await Promise.all([
      pool.query('SELECT * FROM colleges WHERE id = $1', [id]),
      pool.query('SELECT * FROM courses WHERE college_id = $1 ORDER BY annual_fees DESC', [id]),
      pool.query('SELECT * FROM reviews WHERE college_id = $1 ORDER BY created_at DESC LIMIT 10', [id])
    ]);
    if (collegeResult.rows.length === 0) return res.status(404).json({ error: 'College not found' });
    res.json({ college: collegeResult.rows[0], courses: coursesResult.rows, reviews: reviewsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
