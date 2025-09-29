import { StatusCodes } from 'http-status-codes';
import { asyncWrapper } from '../util/asyncWrapper.js';
import { getUserRank, getAllTimeLeaderboard } from '../services/leaderboardService.js'

export const getLeaderboard = asyncWrapper(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const leaderboard = await getAllTimeLeaderboard(limit);

  res.status(StatusCodes.OK).json({
    success: true,
    leaderboard,
    period: 'all-time'
  });
});

export const userRank = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;
  const period = req.query.period || 'weekly';

  const rankData = await getUserRank(userId, period);

  res.status(StatusCodes.OK).json({
    success: true,
    ...rankData,
    period
  });
});