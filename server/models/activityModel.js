import mongoose from 'mongoose'
import { CATEGORY_TYPES } from '../util/constants.js'

const ActivitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: CATEGORY_TYPES
    },
    activity: String,
    amount: Number,
    unit: String,
    emissions: Number,
    date: Date,
    notes: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }

  }, { timestamps: true }
)

export default mongoose.model('Activity', ActivitySchema)