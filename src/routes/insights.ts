// Routes
import express from 'express';
import { getFinancialSummary, getMonthlyBreakdown } from '../controllers/insights';
import { verifyJWT } from '../middlewares/auth';

const router = express.Router();
router.use(verifyJWT);
router.get('/summary', getFinancialSummary);
router.get('/monthly', getMonthlyBreakdown);

export default router;
