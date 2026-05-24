import express from 'express';
import { login, getProfile, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);

export default router;
