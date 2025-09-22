import Goal from '../models/goalModel.js'
import { asyncWrapper } from '../util/asyncWrapper.js';

export const acceptGoal = asyncWrapper(async (req, res) => {
  const io = req.app.get("io");

  const { goalId } = req.params;
  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, user: req.user.userId },
    { status: 'accepted' },
    { new: true }
  );

  io.emit("goal:update", {
    user: req.user.userId,
    goal: savedGoal,
  });

  res.status(200).json({ goal });
});

export const customizeGoal = asyncWrapper(async (req, res) => {
  const io = req.app.get("io");
  const { goalId } = req.params;
  const { category, targetReduction, tip } = req.body;

  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, user: req.user.userId },
    { category, targetReduction, tip, status: 'customized' },
    { new: true }
  );

  io.emit("goal:update", {
    user: req.user.userId,
    goal: savedGoal,
  });

  res.status(200).json({ goal });
});

export const getCurrentGoal = asyncWrapper(async (req, res) => {
  const goal = await Goal.findOne({
    user: req.user.userId,
    status: { $in: ['pending', 'accepted', 'customized'] },
  }).sort({ createdAt: -1 });

  res.status(200).json({ goal });
});
