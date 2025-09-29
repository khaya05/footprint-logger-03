import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/customErrors.js";
import Goal from "../models/goalModel.js";
import { asyncWrapper } from "../util/asyncWrapper.js";
import { getWeeklyGoalForUser } from "../util/goalUtil.js";
import { updateGoalProgress, updateUserInsights } from "../util/insightUtil.js";
import {
  acceptUserGoal,
  generateTwoSuggestions,
  getGoalWithProgress,
  isReadyForGoals,
  createWeeklyGoal,
  calculateBaseline,
  getUserGoalHistory
} from "../services/goalService.js";

export const getWeeklyGoal = asyncWrapper(async (req, res) => {
  const goalData = await getWeeklyGoalForUser(req.user.userId);
  res.status(StatusCodes.OK).json(goalData || {});
});

export const getGoal = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;

  const goalData = await getGoalWithProgress(userId);

  if (!goalData) {
    return res.status(StatusCodes.OK).json({
      success: true,
      goal: null,
      message: "No active goal found for this week"
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    ...goalData,
  });
});

export const createGoal = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;
  const { category, targetReduction, tip } = req.body;

  if (!category || !targetReduction) {
    throw new BadRequestError("Category and target reduction are required");
  }

  try {
    const baseline = await calculateBaseline(userId, category);

    if (!baseline.hasData) {
      throw new BadRequestError(
        `No activity data found for ${category}. Add some activities first to create a goal.`
      );
    }

    const goalData = {
      category,
      targetReduction,
      totalEmissions: baseline.avgWeeklyEmissions,
      tip: tip || `Try to reduce your ${category} emissions this week!`
    };

    const goal = await createWeeklyGoal(userId, goalData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      goal,
      baseline: baseline,
      message: "Goal created successfully"
    });

  } catch (error) {
    if (error.message.includes("already exists")) {
      throw new BadRequestError("You already have a goal for this week");
    }
    throw error;
  }
});

export const acceptGoal = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const progressData = await acceptUserGoal(id, userId);

    req.io.to(userId).emit("goalUpdate", {
      ...progressData,
      message: "Goal accepted!",
    });

    updateUserInsights(userId, req.io).catch(error => {
      console.error("Error updating user insights:", error);
    });

    res.status(StatusCodes.OK).json({
      success: true,
      goal: progressData.goal,
      progress: progressData.progress,
      isCompleted: progressData.isCompleted,
      message: "Goal accepted successfully",
    });

  } catch (error) {
    if (error.message === "Goal not found") {
      throw new NotFoundError("Goal not found");
    }
    throw error;
  }
});

export const updateUserGoalProgress = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const progressData = await updateGoalProgress(id, userId);

  if (!progressData) {
    throw new NotFoundError("Goal not found");
  }

  req.io.to(userId).emit("goalUpdate", {
    ...progressData,
    message: "Goal progress updated",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    ...progressData,
  });
});

export const getGoalHistory = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;
  const limit = parseInt(req.query.limit) || 10;

  const history = await getUserGoalHistory(userId, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    goals: history,
    count: history.length
  });
});

export const customizeGoal = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { targetReduction, tip } = req.body;

  const goal = await Goal.findOneAndUpdate(
    { _id: id, user: userId, status: { $in: ['pending', 'accepted'] } },
    {
      ...(targetReduction && { targetReduction }),
      ...(tip && { tip }),
      status: 'customized'
    },
    { new: true }
  );

  if (!goal) {
    throw new NotFoundError("Goal not found!");
  }

  const progressData = await goal.updateProgress();

  req.io.to(userId).emit("goalUpdate", {
    ...progressData,
    message: "Goal customized successfully",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    ...progressData,
    message: "Goal customized successfully"
  });
});

export const completeGoal = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const goal = await Goal.findOneAndUpdate(
    { _id: id, user: userId },
    { status: "completed", completedAt: new Date() },
    { new: true }
  );

  if (!goal) throw new NotFoundError("Goal not found");

  req.io.to(userId).emit("goalCompleted", {
    goal,
    message: "Goal completed 🎉",
  });

  await updateUserInsights(userId, req.io);

  res.status(StatusCodes.OK).json({
    success: true,
    goal,
    message: "Goal completed successfully!"
  });
});

export const dismissGoal = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    { status: "dismissed" },
    { new: true }
  );

  if (!goal) throw new NotFoundError("Goal not found");

  req.io.to(req.user.userId).emit("goalDismissed", {
    goal,
    message: "Goal dismissed",
  });

  await updateUserInsights(req.user.userId, req.io);

  res.status(StatusCodes.OK).json({
    success: true,
    goal,
    message: "Goal dismissed successfully"
  });
});

export const getGoalSuggestions = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;

  const readiness = await isReadyForGoals(userId);

  if (!readiness.ready) {
    return res.status(StatusCodes.OK).json({
      ready: false,
      message: "Log more activities to unlock goal suggestions!",
      progress: readiness.stats
    });
  }

  const suggestions = await generateTwoSuggestions(userId);

  res.status(StatusCodes.OK).json({
    ready: true,
    suggestions: suggestions,
    message: suggestions.length > 0 ? "Here are your personalized tips:" : "No suggestions available."
  });
});