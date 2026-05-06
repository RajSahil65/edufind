import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db';
import collegesRouter from './routes/colleges';
import predictorRouter from './routes/predictor';
import authRouter from './routes/auth';
import qaRouter from './routes/qa';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/health', (_req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/colleges', collegesRouter);
app.use('/api/predictor', predictorRouter);
app.use('/api/auth', authRouter);
app.use('/api/qa', qaRouter);

app.use((_req: any, res: any) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const start = async () => {
  try {
    await initDB();

    if (process.env.RUN_SEED === 'true') {
      console.log('Running seed...');
      const seedModule = await import('./seed');
      await seedModule.seed();
      console.log('Seed completed!');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;