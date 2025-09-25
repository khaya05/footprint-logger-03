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
  weekStart: Date,
  weekEnd: Date,
  totalEmissions: Number,
  targetReduction: Number,
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

GoalSchema.methods.calculateAchievedReduction = async function () {
  const Activity = this.model('Activity')

  const activities = await Activity.find({
    user: this.user,
    category: this.category,
    date: { $gte: this.weekStart, $lte: this.weekEnd }
  })

  const total = activities.reduce((sum, act) => sum + act.emissions, 0)
  const reduction = Math.max(0, this.totalEmissions - total)
  this.archivedReduction = reduction

  await this.save();

  return this.archivedReduction;

}

GoalSchema.methods.calculateProgress = function () {
  if (!this.targetReduction || this.this.targetReduction <= 0) return 0

  const percent = (this.achievedReduction / this.targetReduction) * 100
  return Math.min(100, Math.round(percent))

}

export default mongoose.model('Goal', GoalSchema)
