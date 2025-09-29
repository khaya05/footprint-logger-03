import mongoose from 'mongoose';
import { CATEGORY_TYPES } from '../util/constants.js';

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: CATEGORY_TYPES,
    required: true,
  },
  weekStart: {
    type: Date,
    required: true,
  },
  weekEnd: {
    type: Date,
    required: true,
  },
  totalEmissions: {
    type: Number,
    required: true,
  },
  targetReduction: {
    type: Number,
    required: true,
  },
  achievedReduction: {
    type: Number,
    default: 0,
  },
  tip: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'customized', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

GoalSchema.index({ user: 1, createdAt: -1 });
GoalSchema.index({ user: 1, weekStart: 1, weekEnd: 1 });

GoalSchema.methods.calculateAchievedReduction = async function () {
  const Activity = this.model('Activity');

  const activities = await Activity.find({
    createdBy: this.user, 
    category: this.category,
    date: { $gte: this.weekStart, $lte: this.weekEnd }
  });

  const totalCurrentEmissions = activities.reduce((sum, act) => sum + (act.emissions || 0), 0);
  const reduction = Math.max(0, this.totalEmissions - totalCurrentEmissions);

  this.achievedReduction = reduction; 
  await this.save();

  return this.achievedReduction;
};

GoalSchema.methods.calculateProgress = function () {
  if (!this.targetReduction || this.targetReduction <= 0) return 0; 

  const percent = (this.achievedReduction / this.targetReduction) * 100;
  return Math.min(100, Math.round(percent));
};

GoalSchema.methods.isCurrentWeek = function () {
  const now = new Date();
  return now >= this.weekStart && now <= this.weekEnd;
};

GoalSchema.methods.updateProgress = async function () {
  await this.calculateAchievedReduction();
  const progress = this.calculateProgress();

  if (progress >= 100 && this.status === 'accepted') {
    this.status = 'completed';
    await this.save();
  }

  return {
    goal: this,
    progress,
    isCompleted: this.status === 'completed'
  };
};

export default mongoose.model('Goal', GoalSchema);