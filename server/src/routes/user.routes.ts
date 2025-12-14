import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getProfile,
  updateProfile,
  getGoals,
  getActiveGoal,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/goals', getGoals);
router.get('/goals/active', getActiveGoal);
router.post('/goals', createGoal);
router.put('/goals/:id', updateGoal);
router.delete('/goals/:id', deleteGoal);

export default router;
