import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import Goal from "../models/goalModel.js";
import { asyncWrapper } from "../util/asyncWrapper.js";
import { getWeeklyGoalForUser } from "../util/goalUtil.js";
import { updateGoalProgress, updateUserInsights } from "../util/insightUtil.js";

export const getGoal = asyncWrapper(async (req, res) => {
  const goals = await Goal.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ goals });
});

export const getWeeklyGoal = asyncWrapper(async (req, res) => {
  const goalData = await getWeeklyGoalForUser(req.user.userId);
  res.status(StatusCodes.OK).json(goalData || {});
});

export const acceptGoal = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    { status: "accepted" },
    { new: true }
  );

  if (!goal) throw new NotFoundError("Goal not found");

  try {
    const progressData = await updateGoalProgress(goal._id, req.user.userId);

    req.io.to(req.user.userId).emit("goalUpdate", {
      ...progressData,
      message: "Goal accepted!",
    });

    await updateUserInsights(req.user.userId, req.io);

    res.status(StatusCodes.OK).json({
      goal: progressData.goal,
      progressPercentage: progressData.progressPercentage,
      message: "Goal accepted successfully",
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(StatusCodes.OK).json({ goal });
  }
});

export const customizeGoal = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { customTarget, customActivity } = req.body;

  const goal = await Goal.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    { customTarget, customActivity, status: "accepted" },
    { new: true }
  );

  if (!goal) throw new NotFoundError("Goal not found");

  req.io.to(req.user.userId).emit("goalUpdate", {
    goal,
    message: "Goal customized successfully",
  });

  await updateUserInsights(req.user.userId, req.io);

  res.status(StatusCodes.OK).json({ goal });
});

export const completeGoal = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    { status: "completed", completedAt: new Date() },
    { new: true }
  );

  if (!goal) throw new NotFoundError("Goal not found");

  req.io.to(req.user.userId).emit("goalCompleted", {
    goal,
    message: "Congratulations! Goal completed 🎉",
  });

  await updateUserInsights(req.user.userId, req.io);

  res.status(StatusCodes.OK).json({ goal });
});

// export const regenerateGoal = asyncWrapper(async (req, res) => {
//   const newGoal = new Goal({
//     user: req.user.userId,
//     activity: "Walk 15,000 steps",
//     target: "15,000 steps in 7 days",
//     status: "pending",
//   });

//   await newGoal.save();

//   req.io.to(req.user.userId).emit("newWeeklyGoal", {
//     goal: newGoal,
//     message: "A new weekly goal has been generated",
//   });

//   await updateUserInsights(req.user.userId, req.io);

//   res.status(StatusCodes.CREATED).json({ goal: newGoal });
// });

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

  res.status(StatusCodes.OK).json({ goal });
});
