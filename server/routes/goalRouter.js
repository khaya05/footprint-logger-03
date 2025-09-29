import express from "express";
import {
  acceptGoal,
  customizeGoal,
  dismissGoal,
  getGoal,
  getWeeklyGoal,
  completeGoal,
  createGoal,
  getGoalSuggestions,
  updateUserGoalProgress, 
  // regenerateGoal,
} from "../controllers/goalController.js";

const router = express.Router();

router.get("/", getGoal);
router.post("/", createGoal);
router.get("/suggestions", getGoalSuggestions);
router.get("/weekly", getWeeklyGoal);
router.patch("/:id/accept", acceptGoal);
router.patch("/:id/customize", customizeGoal);
router.patch("/:id/complete", completeGoal);
router.patch("/:id/progress", updateUserGoalProgress);
router.delete("/:id/dismiss", dismissGoal);

export default router;