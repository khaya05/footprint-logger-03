import express from 'express';
import {
  getLeaderboard,
  userRank
} from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/all-time', getLeaderboard);
router.get('/my-rank', userRank);

export default router;