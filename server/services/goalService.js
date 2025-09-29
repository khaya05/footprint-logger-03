import mongoose from 'mongoose';
import Goal from '../models/goalModel.js';
import Activity from '../models/activityModel.js';
import { getWeekBoundaries } from '../util/insightUtil.js';
import { calculateStats } from '../util/statsUtil.js';
import { TIPS } from '../util/constants.js';

export const getCurrentWeekGoal = async (userId) => {
  const { startOfWeek, endOfWeek } = getWeekBoundaries();

  const goal = await Goal.findOne({
    user: userId,
    weekStart: { $lte: endOfWeek },
    weekEnd: { $gte: startOfWeek },
  }).sort({ createdAt: -1 });

  return goal;
};

export const getLatestGoal = async (userId) => {
  return await Goal.findOne({ user: userId }).sort({ createdAt: -1 });
};

export const acceptUserGoal = async (goalId, userId) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, user: userId },
    { status: 'accepted' },
    { new: true }
  );

  if (!goal) {
    throw new Error('Goal not found');
  }

  const progressData = await goal.updateProgress();

  return progressData;
};

export const updateGoalProgress = async (goalId, userId) => {
  const goal = await Goal.findOne({ _id: goalId, user: userId });

  if (!goal) {
    return null;
  }

  return await goal.updateProgress();
};

export const createWeeklyGoal = async (userId, goalData) => {
  const { startOfWeek, endOfWeek } = getWeekBoundaries();

  const existingGoal = await getCurrentWeekGoal(userId);
  if (existingGoal) {
    throw new Error('Goal already exists for this week');
  }

  const goal = new Goal({
    user: userId,
    weekStart: startOfWeek,
    weekEnd: endOfWeek,
    ...goalData,
  });

  await goal.save();
  return goal;
};

const calculateDaysRemaining = (weekEnd) => {
  const now = new Date();
  const diffTime = weekEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const getGoalWithProgress = async (userId) => {
  const goal = await getCurrentWeekGoal(userId);

  if (!goal) {
    return null;
  }

  const progressData = await goal.updateProgress();

  return {
    goal: progressData.goal,
    progress: progressData.progress,
    isCompleted: progressData.isCompleted,
    daysRemaining: calculateDaysRemaining(goal.weekEnd),
  };
};

export const getUserGoalHistory = async (userId) => {
  return await Goal.find({ user: userId }).sort({ createdAt: -1 });
};

export const calculateBaseline = async (userId, category, weeks = 4) => {
  const weeksAgo = new Date();
  weeksAgo.setDate(weeksAgo.getDate() - weeks * 7);

  const activities = await Activity.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        category: category,
        date: { $gte: weeksAgo },
      },
    },
    {
      $group: {
        _id: null,
        avgWeeklyEmissions: { $avg: '$emissions' },
        totalEmissions: { $sum: '$emissions' },
        count: { $sum: 1 },
      },
    },
  ]);

  const result = activities[0];
  if (!result || result.count === 0) {
    return {
      avgWeeklyEmissions: 0,
      totalEmissions: 0,
      hasData: false,
    };
  }

  const weeklyEstimate = result.totalEmissions / weeks;

  return {
    avgWeeklyEmissions: Math.round(weeklyEstimate * 100) / 100,
    totalEmissions: result.totalEmissions,
    hasData: true,
    weeksAnalyzed: weeks,
  };
};

export const generateTwoSuggestions = async (userId) => {
  const stats = await calculateStats(userId);
  const topCategories = getTopEmissionCategories(stats.categories, 2);

  if (topCategories.length === 0) {
    return [];
  }

  const suggestions = [];

  for (const category of topCategories) {
    const baseline = await calculateBaseline(userId, category.name, 4);

    if (baseline.hasData) {
      const suggestion = {
        id: `${category.name}-reduction`,
        category: category.name,
        title: getCategoryTitle(category.name),
        tip: getCategoryTip(category.name),
        currentWeekly: baseline.avgWeeklyEmissions,
        targetReduction: calculateSuggestedReduction(
          baseline.avgWeeklyEmissions,
          category.name
        ),
        totalEmissions: baseline.avgWeeklyEmissions,
        difficulty: getDifficulty(category.name),
        impact: category.total > 20 ? 'high' : 'medium',
      };

      suggestion.reductionPercent = Math.round(
        (suggestion.targetReduction / suggestion.currentWeekly) * 100
      );
      suggestions.push(suggestion);
    }
  }

  return suggestions;
};

function getTopEmissionCategories(categories, limit = 2) {
  return Object.entries(categories)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

function getCategoryTitle(category) {
  const titles = {
    transport: 'Transport Challenge',
    energy: 'Energy Efficiency',
    food: 'Mindful Eating',
    digital: 'Energy Efficiency',
  };
  return titles[category] || `${category} Challenge`;
}

function getCategoryTip(category) {
  const categoryTips = TIPS[category];
  if (!categoryTips) return 'Try reducing your environmental impact this week!';
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
}

function calculateSuggestedReduction(weeklyEmissions, category) {
  const reductionRates = {
    energy: 0.15,
    food: 0.18,
    transport: 0.12,
    digital: 0.1,
  };

  const rate = reductionRates[category] || 0.15;
  return Math.round(weeklyEmissions * rate * 100) / 100;
}

function getDifficulty(category) {
  const difficulty = {
    energy: 'easy',
    food: 'medium',
    transport: 'hard',
    digital: 'easy',
  };
  return difficulty[category] || 'medium';
}

async function isReadyForGoals(userId) {
  const stats = await calculateStats(userId);

  const hasEnoughActivities = stats.user.activitiesCount >= 5;
  const hasEnoughEmissions = stats.user.totalEmissions >= 20;
  const hasMultipleCategories = Object.keys(stats.categories).length >= 2;

  return {
    ready: hasEnoughActivities && hasEnoughEmissions,
    reasons: {
      activities: hasEnoughActivities,
      emissions: hasEnoughEmissions,
      categories: hasMultipleCategories,
    },
    stats: {
      activitiesCount: stats.user.activitiesCount,
      totalEmissions: stats.user.totalEmissions,
      categoriesUsed: Object.keys(stats.categories).length,
    },
  };
}

export { isReadyForGoals };
