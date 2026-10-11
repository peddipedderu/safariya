import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import gameRoutes from './routes/game.js';
import hiveRoutes from './routes/hive.js';
import marketRoutes from './routes/market.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/game', gameRoutes);
app.use('/api/hive', hiveRoutes);
app.use('/api/market', marketRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Safariya - Africa Explorer',
    version: '1.0.0',
    blockchain: 'Hive',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦁 Safariya server running on port ${PORT}`);
  console.log(`🌍 Africa Explorer - Hive Blockchain Game`);
});

export default app;
