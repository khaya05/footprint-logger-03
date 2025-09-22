import express from 'express'
import { acceptGoal, customizeGoal, getCurrentGoal } from '../controllers/goalController.js';

const router = express.Router();

router.get('/', getCurrentGoal);
router.patch('/:goalId/accept', acceptGoal);
router.patch('/:goalId/customize', customizeGoal);

export default router;
