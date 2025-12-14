import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getMeasurements,
  getLatestMeasurement,
  getProgressAnalysis,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from '../controllers/progress.controller';

const router = Router();

router.use(authenticate);

router.get('/', getMeasurements);
router.get('/latest', getLatestMeasurement);
router.get('/analysis', getProgressAnalysis);
router.post('/', createMeasurement);
router.put('/:id', updateMeasurement);
router.delete('/:id', deleteMeasurement);

export default router;
