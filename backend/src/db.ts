import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('IIT', 'NIT', 'IIIT', 'Private', 'Government', 'Deemed')),
        established INTEGER,
        rating DECIMAL(2,1) NOT NULL DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        annual_fees_min INTEGER NOT NULL,
        annual_fees_max INTEGER NOT NULL,
        placement_avg_package DECIMAL(10,2),
        placement_highest_package DECIMAL(10,2),
        placement_percentage INTEGER,
        total_seats INTEGER,
        nirf_rank INTEGER,
        website VARCHAR(255),
        image_url VARCHAR(500),
        description TEXT,
        facilities TEXT[],
        accreditation VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        degree VARCHAR(50) NOT NULL CHECK (degree IN ('B.Tech', 'M.Tech', 'MBA', 'MCA', 'BCA', 'B.Sc', 'M.Sc', 'PhD', 'B.E')),
        duration INTEGER NOT NULL,
        annual_fees INTEGER NOT NULL,
        total_seats INTEGER,
        exam_accepted TEXT[],
        cutoff_general INTEGER,
        cutoff_obc INTEGER,
        cutoff_sc INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
        reviewer_name VARCHAR(100) NOT NULL,
        batch_year INTEGER,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        title VARCHAR(255),
        content TEXT NOT NULL,
        infrastructure_rating INTEGER CHECK (infrastructure_rating BETWEEN 1 AND 5),
        faculty_rating INTEGER CHECK (faculty_rating BETWEEN 1 AND 5),
        placement_rating INTEGER CHECK (placement_rating BETWEEN 1 AND 5),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS predictor_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
        course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
        exam VARCHAR(50) NOT NULL CHECK (exam IN ('JEE Main', 'JEE Advanced', 'CAT', 'GATE', 'NEET', 'State CET')),
        category VARCHAR(20) NOT NULL DEFAULT 'General',
        rank_min INTEGER NOT NULL,
        rank_max INTEGER NOT NULL,
        year INTEGER NOT NULL DEFAULT 2024
      );

      CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges(state);
      CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(type);
      CREATE INDEX IF NOT EXISTS idx_colleges_fees ON colleges(annual_fees_min, annual_fees_max);
      CREATE INDEX IF NOT EXISTS idx_courses_college ON courses(college_id);
      CREATE INDEX IF NOT EXISTS idx_predictor_exam ON predictor_data(exam, rank_min, rank_max);

      -- Auth: Users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_color VARCHAR(20) DEFAULT '#6c47ff',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Saved colleges
      CREATE TABLE IF NOT EXISTS saved_colleges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, college_id)
      );

      -- Saved comparisons
      CREATE TABLE IF NOT EXISTS saved_comparisons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        college_ids UUID[] NOT NULL,
        label VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Q&A questions
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        body TEXT,
        tags TEXT[],
        answer_count INTEGER DEFAULT 0,
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Q&A answers
      CREATE TABLE IF NOT EXISTS answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        body TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        is_accepted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Upvote tracking
      CREATE TABLE IF NOT EXISTS question_upvotes (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, question_id)
      );

      CREATE TABLE IF NOT EXISTS answer_upvotes (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, answer_id)
      );

      CREATE INDEX IF NOT EXISTS idx_questions_college ON questions(college_id);
      CREATE INDEX IF NOT EXISTS idx_questions_user ON questions(user_id);
      CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
      CREATE INDEX IF NOT EXISTS idx_saved_colleges_user ON saved_colleges(user_id);
    `);
    console.log('Database initialized successfully');
  } finally {
    client.release();
  }
};
