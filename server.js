import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import alumniRoutes from './routes/alumni.js';
import adminRoutes from './routes/admin.js';
import eventRoutes from './routes/events.js';
import jobRoutes from './routes/jobs.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/jobs', jobRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
pool.getConnection()
  .then((c) => { c.release(); console.log('MySQL connected'); app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)); })
  .catch((e) => { console.error('MySQL connection failed:', e.message); process.exit(1); });
