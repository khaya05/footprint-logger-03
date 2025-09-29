import Activity from '../models/activityModel.js';
import mongoose from 'mongoose';
import { getEmissionsTotalForDays } from './activityUtil.js';
import { getGoalWithProgress } from '../services/goalService.js';

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
              avg: { $avg: '$emissions' },
            },
          },
        ],
        communityStats: [
          {
            $group: {
              _id: null,
              communityAvg: { $avg: '$emissions' },
              totalCommunityEmissions: { $sum: '$emissions' },
              totalActivities: { $sum: 1 },
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

  const communityData = aggregationResult.communityStats[0] || {
    communityAvg: 0,
    totalCommunityEmissions: 0,
    totalActivities: 0
  };

  const categoryStats = aggregationResult.categoryStats.reduce((acc, item) => {
    acc[item._id] = {
      total: Math.round(item.total * 100) / 100,
      count: item.count,
      avg: Math.round(item.avg * 100) / 100,
    };
    return acc;
  }, {});


  const weeklySummary = await getEmissionsTotalForDays(7, userObjectId)
  const monthlySummary = await getEmissionsTotalForDays(30, userObjectId)

  return {
    user: {
      totalEmissions: Math.round(userStats.totalEmissions * 100) / 100,
      activitiesCount: userStats.activitiesCount,
      avgEmission: Math.round(userStats.avgEmission * 100) / 100,
    },
    categories: categoryStats,
    timePeriods: {
      weekly: weeklySummary,
      monthly: monthlySummary,
    },
    community: {
      avgEmission: Math.round(communityData.communityAvg * 100) / 100,
      totalEmissions: Math.round(communityData.totalCommunityEmissions * 100) / 100,
      totalActivities: communityData.totalActivities,
      userRank: await calculateUserRank(userId, userStats.totalEmissions),
    },
  };
}

export const calculateUserRank = async (_, userTotalEmissions) => {
  const usersWithLowerEmissions = await Activity.aggregate([
    {
      $group: {
        _id: '$createdBy',
        totalEmissions: { $sum: '$emissions' }
      }
    },
    {
      $match: {
        totalEmissions: { $lt: userTotalEmissions }
      }
    },
    {
      $count: 'count'
    }
  ]);

  const rank = (usersWithLowerEmissions[0]?.count || 0) + 1;
  return rank;
}

export const updateUserInsights = async (userId, io) => {
  try {
    const [stats, goalData] = await Promise.all([
      calculateStats(userId),
      GoalService.getGoalWithProgress(userId)
    ]);

    io.to(userId).emit("statsUpdate", {
      ...stats,
      lastUpdated: new Date().toISOString()
    });

    if (goalData) {
      io.to(userId).emit("goalUpdate", {
        ...goalData,
        message: "Goal progress updated"
      });
    }

    io.emit("leaderboardUpdate", {
      message: "Leaderboard updated",
      timestamp: new Date().toISOString()
    });

    return { stats, goalData };

  } catch (error) {
    console.error("Error updating user insights:", error);
    throw error;
  }
}

export const getTopCategory = (categories) => {
  let topCategory = null;
  let maxEmissions = 0;

  for (const [category, data] of Object.entries(categories)) {
    if (data.total > maxEmissions) {
      maxEmissions = data.total;
      topCategory = {
        name: category,
        emissions: data.total,
        count: data.count
      };
    }
  }

  return topCategory;
}

export const getDashboardData = async (userId) => {
  const stats = await calculateStats(userId)
  const goalData = await getGoalWithProgress(userId)

  return {
    stats,
    goal: goalData,
    summary: {
      hasActiveGoal: !!goalData,
      weeklyEmissions: stats.timePeriods.weekly,
      monthlyEmissions: stats.timePeriods.monthly,
      topCategory: getTopCategory(stats.categories),
      communityRanking: stats.community.userRank
    }
  };
}

export const getEmissionsTrend = async (userId, days = 7) => {
  const userObjectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const trend = await Activity.aggregate([
    {
      $match: {
        createdBy: userObjectId,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date"
          }
        },
        dailyEmissions: { $sum: "$emissions" },
        activityCount: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return trend.map(day => ({
    date: day._id,
    emissions: Math.round(day.dailyEmissions * 100) / 100,
    activities: day.activityCount
  }));
}