import mongoose from 'mongoose';
import { CATEGORY_TYPES } from '../util/constants.js';

const WeeklyGoalSchema = new mongoose.Schema(
  {
    weekStart: {
      type: Date,
      required: true
    },
    category: {
      type: String,
      enum: CATEGORY_TYPES,
      required: true,
    },
    targetReduction: {
      type: Number,
      required: true
    },
    achievedReduction: {
      type: Number,
      default: 0
    },
    tip: {
      type: String,
      required: true
    },
  },
  { _id: false }
);

const UserSchema = mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  weeklyGoals: [WeeklyGoalSchema]
});

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', UserSchema);
