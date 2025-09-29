import Activity from "../models/activityModel.js";
import Goal from "../models/goalModel.js";
import { getWeeklyGoalForUser } from "./goalUtil.js";
import { calculateStats } from "./statsUtil.js";
import { TIPS } from "./constants.js";

export const getRandomTip = (category) => {
  const categoryTips = TIPS[category];
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
}

export const getWeekBoundaries = (date = new Date()) => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return { startOfWeek, endOfWeek };
}

export async function analyzeUserEmissions(userId) {
  const { startOfWeek, endOfWeek } = getWeekBoundaries();

  const activities = await Activity.find({
    createdBy: userId,
    date: { $gte: startOfWeek, $lt: endOfWeek },
  });

  if (activities.length === 0) {
    return {
      message: "No activities logged this week. Add an activity to get tips!",
      totalEmissions: 0,
    };
  }

  const totals = {};
  activities.forEach((a) => {
    totals[a.category] = (totals[a.category] || 0) + (a.emissions || 0);
  });

  const [highestCategory, categoryEmissions] =
    Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  k
  let goal = await Goal.findOne({
    user: userId,
    weekStart: startOfWeek,
  });

  if (!goal) {
    goal = new Goal({
      user: userId,
      category: highestCategory,
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      totalEmissions: +categoryEmissions.toFixed(2),
      targetReduction: +(categoryEmissions * 0.15).toFixed(2),
      achievedReduction: 0,
      tip: getRandomTip(highestCategory),
      status: "pending",
    });
    await goal.save();
  }

  return {
    goal,
    totals,
    totalEmissions: Object.values(totals).reduce((s, v) => s + v, 0),
    message: `Your focus this week: reduce emissions from ${highestCategory}`,
  };
}

export async function updateGoalProgress(goalId, userId) {
  const { startOfWeek, endOfWeek } = getWeekBoundaries();

  const goal = await Goal.findOne({ _id: goalId, user: userId });
  if (!goal) return null;

  if (!(goal instanceof Goal)) {
    goal = new Goal(goal);
  }

  await goal.calculateAchievedReduction();

  return { goal, progress: goal.calculateProgress() };
}

export const updateUserInsights = async (userId, io) => {
  const stats = await calculateStats(userId);
  const goalData = await getWeeklyGoalForUser(userId);

  io.to(userId).emit("statsUpdate", stats);
  if (goalData) io.to(userId).emit("goalUpdate", goalData);

  io.emit("leaderboardUpdate", { message: "Leaderboard will be dynamic soon." });

  return { stats, goalData };
}
