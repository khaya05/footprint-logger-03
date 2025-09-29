import { calculateStats } from '../util/statsUtil';
import Activity from '../models/activityModel.js'

function getDaysSinceFirstActivity(activities) {
  if (!activities.length) return 0;
  const firstActivity = activities[activities.length - 1];
  const daysDiff =
    (new Date() - new Date(firstActivity.createdAt)) / (1000 * 60 * 60 * 24);
  return Math.floor(daysDiff);
}

async function getUserReadinessStats(userId) {
  const activities = await Activity.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .limit(20);
  const stats = await calculateStats(userId);

  const daysSinceFirst = getDaysSinceFirstActivity(activities);
  const categoriesUsed = new Set(activities.map((a) => a.category)).size;
  const totalEmissions = stats.user.totalEmissions;
  const activitiesCount = stats.user.activitiesCount;

  return {
    activities,
    stats,
    daysSinceFirst,
    categoriesUsed,
    totalEmissions,
    activitiesCount,
    avgDailyEmissions: totalEmissions / Math.max(daysSinceFirst, 1),
    hasWeekOfData: daysSinceFirst >= 7,
    hasPattern: activitiesCount >= 10,
  };
};

async function shouldShowGoalSuggestion(userId, newActivity) {
  const userStats = await getUserReadinessStats(userId);
  const hasEnoughActivities = checkActivitiesRequired(userStats);
  const hasEnoughEmissions = checkEmissionsRequired(userStats);
  const isOldUser = checkTimeRequired(userStats);
  const hasHighImpactCategory = checkHighImpactActivity(newActivity, userStats);
  const hasPattern = checkPatternDetection(userStats);
  const hasWeeklyGoal = checkWeeklyMilestone(userStats);

  const triggers = [
    hasEnoughActivities,
    hasEnoughEmissions,
    isOldUser,
    hasHighImpactCategory,
    hasPattern,
    hasWeeklyGoal,
  ];

  return (
    triggers.find((trigger) => trigger.shouldTrigger) || {
      shouldTrigger: false,
    }
  );
};

async function getUserReadinessStats(userId) {
  const activities = await Activity.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(20)
  const stats = await calculateStats(userId)

  const daysSinceFirst = getDaysSinceFirstActivity(activities);
  const categoriesUsed = new Set(activities.map(a => a.category)).size;
  const totalEmissions = stats.user.totalEmissions;
  const activitiesCount = stats.user.activitiesCount;

  return {
    activities,
    stats,
    daysSinceFirst,
    categoriesUsed,
    totalEmissions,
    activitiesCount,
    avgDailyEmissions: totalEmissions / Math.max(daysSinceFirst, 1),
    hasWeekOfData: daysSinceFirst >= 7,
    hasPattern: activitiesCount >= 10
  };
}

function checkActivitiesRequired(data) {
  const minActivities = 5;
  const maxActivities = 15; 

  if (data.activitiesCount >= minActivities &&
    data.activitiesCount <= maxActivities) {
    return {
      shouldTrigger: true,
      type: 'activity_threshold',
      priority: 'medium',
      message: `Great job logging ${data.activitiesCount} activities!?`,
      context: 'sufficient_data'
    };
  }

  return { shouldTrigger: false };
}

function checkEmissionsRequired(data) {
  const minEmissions = 50; 

  if (data.totalEmissions >= minEmissions) {
    const topCategory = getTopEmissionCategory(data.stats.categories);

    return {
      shouldTrigger: true,
      type: 'emission_threshold',
      priority: 'high',
      message: `You've logged ${data.totalEmissions.toFixed(1)} kg CO2. Your biggest category is ${topCategory.name}.`,
      context: 'high_emissions',
      suggestion: topCategory
    };
  }

  return { shouldTrigger: false };
}

function checkTimeRequired(data) {
  if (data.hasWeekOfData && data.activitiesCount >= 3) {
    return {
      shouldTrigger: true,
      type: 'weekly_review',
      priority: 'medium',
      message: `Week complete! You've tracked ${data.activitiesCount} activities.`,
      context: 'weekly_milestone',
      timing: 'end_of_week'
    };
  }

  return { shouldTrigger: false };
}

function checkHighImpactActivity(newActivity, data) {
  const highImpactThreshold = 15;
  const hasBaseline = data.activitiesCount >= 3;

  if (newActivity.emissions >= highImpactThreshold && hasBaseline) {
    return {
      shouldTrigger: true,
      type: 'high_impact_activity',
      priority: 'high',
      message: `${newActivity.category} had (${newActivity.emissions} kg CO2)!`,
      context: 'immediate_after_high_emission',
      category: newActivity.category,
      timing: 'immediate'
    };
  }

  return { shouldTrigger: false };
}

function checkPatternDetection(data) {
  if (!data.hasPattern) return { shouldTrigger: false };

  const patterns = analyzeActivityPatterns(data.activities);

  if (patterns.highImpactCategory && patterns.frequency >= 3) {
    return {
      shouldTrigger: true,
      type: 'pattern_detected',
      priority: 'medium',
      message: `You frequently log ${patterns.highImpactCategory} activities.`,
      context: 'pattern_recognition',
      pattern: patterns
    };
  }

  return { shouldTrigger: false };
}

function checkWeeklyMilestone(data) {
  const now = new Date();
  const isSundayEvening = now.getDay() === 0 && now.getHours() >= 18;
  const hasWeeklyData = data.activitiesCount >= 5;

  if (isSundayEvening && hasWeeklyData) {
    return {
      shouldTrigger: true,
      type: 'weekly_milestone',
      priority: 'medium',
      message: `Your weakly avarage is ${data.avgDailyEmissions.toFixed(1)} kg CO2`,
      context: 'weekly_reflection',
      timing: 'sunday_evening'
    };
  }

  return { shouldTrigger: false };
}

function getTopEmissionCategory(categories) {
  let topCategory = { name: null, total: 0 };

  for (const [name, data] of Object.entries(categories)) {
    if (data.total > topCategory.total) {
      topCategory = { name, ...data };
    }
  }

  return topCategory;
}

function analyzeActivityPatterns(activities) {
  const categoryCount = {};

  activities.forEach(activity => {
    categoryCount[activity.category] = (categoryCount[activity.category] || 0) + 1;
  });

  let highImpactCategory = null;
  let maxFrequency = 0;

  for (const [category, frequency] of Object.entries(categoryCount)) {
    if (frequency > maxFrequency) {
      highImpactCategory = category;
      maxFrequency = frequency;
    }
  }

  return {
    highImpactCategory,
    frequency: maxFrequency,
    totalCategories: Object.keys(categoryCount).length
  };
}

