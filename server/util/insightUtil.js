import Activity from "../models/activityModel.js";
import User from "../models/userModel.js";

const tips = {
  transportation: [
    "Try cycling twice this week instead of driving — save about 2kg CO₂.",
    "Use public transport once to cut your emissions."
  ],
  food: [
    "Replace one meat meal with a veggie meal — save ~1.5kg CO₂.",
    "Eat local produce this week to reduce transport emissions."
  ],
  energy: [
    "Turn off lights for an hour a day — small habits add up.",
    "Unplug devices when not in use to cut phantom energy."
  ],
  digital: [
    "Stream in standard definition once this week — save data & CO₂.",
    "Clean up unused files in the cloud to lower server impact."
  ]
};

function getRandomTip(category) {
  const categoryTips = tips[category];
  if (!categoryTips) {
    return "Focus on reducing your environmental impact this week!";
  }
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
}

export async function analyzeUserEmissions(userId) {
  try {
    const startOfWeek = new Date();
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const activities = await Activity.find({
      createdBy: userId,
      date: { $gte: startOfWeek, $lt: endOfWeek },
    });

    if (!activities || activities.length === 0) {
      return {
        message: "No activity logged this week. Try adding a new activity!",
        weekStart: startOfWeek,
        weekEnd: endOfWeek
      };
    }

    const totals = {};
    activities.forEach(activity => {
      const category = activity.category;
      const emissions = activity.emissions || 0;
      totals[category] = (totals[category] || 0) + emissions;
    });

    const totalEntries = Object.entries(totals);
    if (totalEntries.length === 0) {
      return {
        message: "No emissions data found for this week.",
        weekStart: startOfWeek,
        weekEnd: endOfWeek
      };
    }

    const highestCategory = totalEntries.sort((a, b) => b[1] - a[1])[0];
    const [category, totalEmissions] = highestCategory;

    const targetReduction = +(totalEmissions * 0.1).toFixed(2);
    const tip = getRandomTip(category);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const goal = {
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      category,
      totalEmissions,
      targetReduction,
      achievedReduction: 0,
      tip,
      createdAt: new Date()
    };

    if (!user.weeklyGoals) {
      user.weeklyGoals = [];
    }

    user.weeklyGoals.push(goal);
    await user.save();

    return goal;

  } catch (error) {
    console.error('Error in analyzeUserEmissions:', error);
    throw new Error(`Failed to analyze user emissions: ${error.message}`);
  }
}