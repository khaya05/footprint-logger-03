import Goal from '../models/goalModel.js'
import Activity from '../models/activityModel.js'
import dayjs from 'dayjs';
import { getRandomTip } from './insightUtil.js';

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

export const getOrCreateWeeklyGoal = async (userId, category, emissions) => {
  const start = dayjs().startOf('isoWeek').toDate();
  const end = dayjs().endOf('isoWeek').toDate();

  let goal = await Goal.findOne({
    user: userId,
    category,
    weekStart: start,
    weekEnd: end,
  });

  if (!goal) {
    goal = await Goal.create({
      user: userId,
      category,
      weekStart: start,
      weekEnd: end,
      totalEmissions: emissions,
      targetReduction: Math.max(1, Math.floor(emissions * 0.2)), 
      achievedReduction: 0,
      tip: getRandomTip(category),
    });
  } else {
    goal.totalEmissions += emissions;
    await goal.save();
  }

  return goal;
};
