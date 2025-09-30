import Activity from '../models/activityModel.js';
import mongoose from 'mongoose';

export const getAllTimeLeaderboard = async (limit = 5) => {
  const leaderboard = await Activity.aggregate([
    {
      $group: {
        _id: '$createdBy',
        totalEmissions: { $sum: '$emissions' },
        activitiesCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        userId: '$_id',
        name: {
          $concat: [
            '$user.name',
            ' ',
            { $substr: ['$user.lastName', 0, 1] }
          ]
        },
        totalEmissions: { $round: ['$totalEmissions', 1] },
        activitiesCount: 1
      }
    },
    {
      $sort: { totalEmissions: 1 }
    },
    {
      $limit: limit
    }
  ]);

  return leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
}

export const getUserRank = async (userId) => {

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const [userStats] = await Activity.aggregate([
    {
      $match: {
        createdBy: userObjectId,
      }
    },
    {
      $group: {
        _id: null,
        totalEmissions: { $sum: '$emissions' }
      }
    }
  ]);

  if (!userStats) {
    return { rank: null, totalEmissions: 0 };
  }

  const [rankData] = await Activity.aggregate([
    {
      $group: {
        _id: '$createdBy',
        totalEmissions: { $sum: '$emissions' }
      }
    },
    {
      $match: {
        totalEmissions: { $lt: userStats.totalEmissions }
      }
    },
    {
      $count: 'usersWithLowerEmissions'
    }
  ]);

  const rank = (rankData?.usersWithLowerEmissions || 0) + 1;

  return {
    rank,
    totalEmissions: userStats.totalEmissions
  };
}
