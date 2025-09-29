import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../util/asyncWrapper.js";
import Goal from '../models/goalModel.js'
import Activity from '../models/activityModel.js'

export const getWeeklyInsight = asyncWrapper(async (req, res) => {
  const { userId } = req.user
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const activities = await Activity.find({
    createdBy: userId,
    date: { $gte: weekStart, $lt: weekEnd },
  });

  if (!activities.length) {
    return res.status(200).json({ goal: null });
  }

  const categoryTotals = activities.reduce((acc, act) => {
    acc[act.category] = (acc[act.category] || 0) + act.emissions;
    return acc;
  }, {});

  const [category, totalEmissions] = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const targetReduction = totalEmissions * 0.1;
  const tip = `Try reducing ${category} activities this week by 10% to save ~${targetReduction.toFixed(
    1
  )} kg CO2.`;

  let goal = await Goal.findOne({
    user: userId,
    weekStart,
    weekEnd,
  });

  if (!goal) {
    goal = await Goal.create({
      user: userId,
      category,
      weekStart,
      weekEnd,
      totalEmissions,
      targetReduction,
      tip,
      status: 'pending',
    });
  } else {
    goal.category = category;
    goal.totalEmissions = totalEmissions;
    goal.targetReduction = targetReduction;
    goal.tip = tip;
    await goal.save();
  }

  res.status(StatusCodes.OK).json({ goal });
})
