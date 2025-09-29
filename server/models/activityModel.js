import mongoose from 'mongoose'
import { CATEGORY_TYPES } from '../util/constants.js'
import { BadRequestError } from '../errors/customErrors.js'

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

ActivitySchema.post(['save', 'findByIdAndUpdate', 'findByIdAndDelete'], async function (doc) {
  try {
    const Goal = mongoose.model('Goal')

    const currentGoal = await Goal.findOne({
      user: doc.user,
      category: doc.category,
      weekStart: { $lte: doc.createdAt },
      weekEnd: { $gte: doc.createdAt },
      status: { $in: ['accepted', 'customized'] }
    })

    if (currentGoal) {
      await currentGoal.calculateAchievedReduction();
      currentGoal.calculateProgress();
      await currentGoal.save();

      const io = require('../socket').getIO();
      io.to(doc.user.toString()).emit('goalUpdated', currentGoal);
    }
  } catch (error) {
    throw BadRequestError('Error updating goal:', error.message)
  }
})

export default mongoose.model('Activity', ActivitySchema)