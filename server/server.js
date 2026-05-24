import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './database/init.js';
import { errorHandler, authenticateToken } from './middleware/auth.js';
import { getDashboardStats } from './controllers/leadController.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Initialize Database and start server
initializeDatabase()
  .then(() => {
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/leads', leadRoutes);

    // Dashboard stats endpoint
    app.get('/api/dashboard/stats', authenticateToken, getDashboardStats);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK' });
    });

    // Error handler
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Default admin: admin@crm.com / admin123`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Shutting down gracefully...');
  closeDatabase();
  process.exit(0);
});
