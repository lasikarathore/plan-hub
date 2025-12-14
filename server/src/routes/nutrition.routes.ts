import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getNutritionLogs,
  getDailyTotals,
  createNutritionLog,
  updateNutritionLog,
  deleteNutritionLog,
} from '../controllers/nutrition.controller';

const router = Router();

router.use(authenticate);

router.get('/', getNutritionLogs);
router.get('/daily-totals', getDailyTotals);
router.post('/', createNutritionLog);
router.put('/:id', updateNutritionLog);
router.delete('/:id', deleteNutritionLog);

export default router;
