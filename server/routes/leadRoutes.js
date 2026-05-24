import express from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getDashboardStats
} from '../controllers/leadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateLead } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticateToken);

// Get all leads and stats (must be before /:id routes)
router.get('/', getAllLeads);

// Create lead
router.post('/', validateLead, createLead);

// Get stats - place before /:id
router.get('/stats', getDashboardStats);

// Get, update, delete specific lead
router.get('/:id', getLeadById);
router.put('/:id', validateLead, updateLead);
router.patch('/:id/status', updateLeadStatus);
router.delete('/:id', deleteLead);

export default router;
