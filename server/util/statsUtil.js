import Activity from '../models/activityModel.js';
import mongoose from 'mongoose';
import { getEmissionsTotalForDays } from './activityUtil.js';

export const calculateStats = async (userId) => {
  const userObjectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const [aggregationResult] = await Activity.aggregate([
    {
      $facet: {
        userStats: [
          { $match: { createdBy: userObjectId } },
          {
            $group: {
              _id: null,
              totalEmissions: { $sum: '$emissions' },
              activitiesCount: { $sum: 1 },
              avgEmission: { $avg: '$emissions' },
            },
          },
        ],
        categoryStats: [
          { $match: { createdBy: userObjectId } },
          {
            $group: {
              _id: '$category',
              total: { $sum: '$emissions' },
              count: { $sum: 1 },
            },
          },
        ],
        communityStats: [
          {
            $group: {
              _id: null,
              communityAvg: { $avg: '$emissions' },
            },
          },
        ],
      },
    },
  ]);

  const userStats = aggregationResult.userStats[0] || {
    totalEmissions: 0,
    activitiesCount: 0,
    avgEmission: 0,
  };

  const communityAvg = aggregationResult.communityStats[0]?.communityAvg || 0;

  const categoryStats = aggregationResult.categoryStats.reduce((acc, item) => {
    acc[item._id] = {
      total: item.total,
      count: item.count,
    };
    return acc;
  }, {});

  const weeklySummary = await getEmissionsTotalForDays(7, userObjectId);
  const monthlySummary = await getEmissionsTotalForDays(30, userObjectId);

  return {
    totals: userStats,
    categories: categoryStats,
    weeklySummary,
    monthlySummary,
    communityAvg,
  };
};
