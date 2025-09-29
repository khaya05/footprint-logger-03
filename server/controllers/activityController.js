import mongoose from 'mongoose';
import Activity from '../models/activityModel.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.js';
import { asyncWrapper } from '../util/asyncWrapper.js';
import { getEmissionsTotalForDays } from '../util/activityUtil.js';
import { updateGoalProgress, updateUserInsights } from '../util/insightUtil.js';
import { getOrCreateWeeklyGoal } from '../util/goalUtil.js';
import Goal from '../models/goalModel.js';
import { generateTwoSuggestions, getCurrentWeekGoal, isReadyForGoals } from '../services/goalService.js';

export const getAllActivities = asyncWrapper(async (req, res) => {
  const { search, category, sort } = req.query;

  const queryObj = { createdBy: req.user.userId };

  if (search) {
    queryObj.$or = [
      { activity: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'all') {
    queryObj.category = category;
  }

  const sortOptions = {
    newest: '-date',
    oldest: 'date',
    highest: '-emissions',
    lowest: 'emissions',
    'a-z': 'activity',
    'z-a': '-activity',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 24;
  const skip = (page - 1) * limit;

  const activities = await Activity.find(queryObj)
    .select('-createdBy -updatedAt -__v')
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalActivities = await Activity.countDocuments(queryObj);
  const pages = Math.ceil(totalActivities / limit);

  res.status(StatusCodes.OK).json({
    totalActivities,
    pages,
    currentPage: page,
    activities,
  });
});

export const getActivity = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const activity = await Activity.findById(id).select(
    '-createdAt -updatedAt -createdBy -_v'
  );

  if (!activity) throw new NotFoundError(`no activity with id: ${id}`);
  res.status(StatusCodes.OK).json({ activity });
});

export const createActivity = asyncWrapper(async (req, res) => {
  const { userId } = req.user
  req.body.createdBy = userId
  const activity = await Activity.create(req.body)

  const response = {
    activity
  }

  const showSuggestions = await isReadyForGoals(req.user.userId);

  if (showSuggestions.ready) {
    const existingGoal = await getCurrentWeekGoal(req.user.userId);

    if (!existingGoal) {
      const suggestions = await generateTwoSuggestions(req.user.userId);

      if (suggestions.length > 0) {
        response.goalSuggestions = {
          message: "Lower your emissions with these suggestions:",
          suggestions: suggestions,
          showPrompt: true
        };

        req.io.to(req.user.userId).emit("goalSuggestionsAvailable", {
          userId: req.user.userId,
          suggestions: suggestions,
          message: "Challenges unlocked!"
        });
      }
    }
  } else {
    const needed = [];
    if (!showSuggestions.reasons.activities) {
      needed.push(`${5 - showSuggestions.stats.activitiesCount} more activities`);
    }
    if (!showSuggestions.reasons.emissions) {
      needed.push(`${Math.ceil(20 - showSuggestions.stats.totalEmissions)} more kg CO2`);
    }

    if (needed.length > 0) {
      const progressData = {
        message: `Log ${needed.join(' and ')} more activities to unlock suggestions.`,
        progress: {
          activities: showSuggestions.stats.activitiesCount,
          targetActivities: 5,
          emissions: Math.round(showSuggestions.stats.totalEmissions * 10) / 10,
          targetEmissions: 20
        }
      };

      response.goalProgress = progressData;

      req.io.to(req.user.userId).emit("goalProgressUpdate", {
        userId: req.user.userId,
        progress: progressData.progress,
        message: progressData.message
      });
    }
  }

  res.status(StatusCodes.CREATED).json(response);
})

export const updateActivity = asyncWrapper(async (req, res) => {
  const { id } = req.params
  const activity = await Activity.findByIdAndUpdate(id, req.body, { new: true })

  if (!activity) throw new NotFoundError(`no activity with id: ${id}`)
  res.status(StatusCodes.OK).json({ activity })
})

export const deleteActivity = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const activity = await Activity.findByIdAndDelete(id);

  if (!activity) if (!activity) throw new NotFoundError(`no activity with id: ${id}`)

  const remainingActivities = await Activity.find({ user: id })

  if (remainingActivities.length === 0) {
    await Goal.findOneAndUpdate(
      { user: req.user._id, status: { $in: ['pending', 'accepted', 'customized'] } },
      { status: 'dismissed' }
    );
  }

  res.status(StatusCodes.OK).json({ msg: 'Activity deleted successfully' });
});

export const getActivitiesStats = asyncWrapper(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(String(req.user.userId));
  const [aggregationResult] = await Activity.aggregate([
    {
      $facet: {
        userStats: [
          { $match: { createdBy: userId } },
          {
            $group: {
              _id: null,
              totalEmissions: { $sum: '$emissions' },
              noOfActivities: { $sum: 1 },
              avgEmission: { $avg: '$emissions' },
            },
          },
        ],
        communityStats: [
          {
            $group: {
              _id: null,
              communityAvg: { $avg: '$emissions' },
            },
          },
        ],
      },
    },
  ]);

  const userStats = aggregationResult.userStats[0] || {
    totalEmissions: 0,
    noOfActivities: 0,
    avgEmission: 0,
  };

  const communityAvg = aggregationResult.communityStats[0]?.communityAvg || 0;

  const weeklySummary = await getEmissionsTotalForDays(7, userId);
  const monthlySummary = await getEmissionsTotalForDays(30, userId);

  res.status(StatusCodes.OK).json({
    userStats,
    weeklySummary,
    monthlySummary,
    communityAvg,
  });
});
