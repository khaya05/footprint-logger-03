import Goal from '../models/goalModel.js'
import Activity from '../models/activityModel.js'

export const getWeeklyGoalForUser = async (userId) => {
  const goal = await Goal.findOne({ user: userId }).sort({ createdAt: -1 });

  if (!goal) return null;

  const weekStart = goal.weekStart;
  const weekEnd = goal.weekEnd;

  const activities = await Activity.aggregate([
    {
      $match: {
        createdBy: goal.user,
        date: { $gte: weekStart, $lte: weekEnd },
        category: goal.category,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$emissions" },
      },
    },
  ]);

  const achievedReduction =
    Math.max(0, goal.totalEmissions - (activities[0]?.total || 0));

  goal.achievedReduction = achievedReduction;
  await goal.save();

  return goal;
};
