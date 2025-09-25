import express from "express";
import {
  acceptGoal,
  customizeGoal,
  dismissGoal,
  getGoal,
  getWeeklyGoal,
  completeGoal,
  // regenerateGoal,
} from "../controllers/goalController.js";
// import { getGoalHistory } from "../util/insightUtil.js";

const router = express.Router();

router.get("/", getGoal);
router.get("/weekly", getWeeklyGoal);
router.patch("/:id/accept", acceptGoal);
router.patch("/:id/customize", customizeGoal);
router.patch("/:id/complete", completeGoal);
// router.get("/history", getGoalHistory);
// router.post("/regenerate", regenerateGoal);
router.delete("/:id/dismiss", dismissGoal);

export default router;
