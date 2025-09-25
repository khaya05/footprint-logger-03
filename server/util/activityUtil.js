import mongoose from "mongoose";
import Activity from '../models/activityModel.js'

export const getEmissionsTotalForDays = async (days, userId) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const userObjectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const result = await Activity.aggregate([
    {
      $match: {
        createdBy: userObjectId,
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalEmissions: { $sum: '$emissions' },
        count: { $sum: 1 },
        avgEmission: { $avg: '$emissions' },
      },
    },
  ]);

  return result[0] || { totalEmissions: 0, count: 0 };
};