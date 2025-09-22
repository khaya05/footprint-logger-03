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

export default mongoose.model('Goal', GoalSchema)
