import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.js';
import Activity from '../models/activityModel.js'
import { asyncWrapper } from '../util/asyncWrapper.js';
import mongoose from 'mongoose';

export const getAllActivities = asyncWrapper(async (req, res) => {
  const { search, category, sort } = req.query;

  const queryObj = {
    createdBy: req.user.userId
  };

  if (search) {
    queryObj.$or = [
      { activity: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } }
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
    activities 
  });
});

export const getActivity = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const activity = await Activity.findById(id).select('-createdAt -updatedAt -createdBy -_v')

  if (!activity) throw new NotFoundError(`no activity with id: ${id}`)
  res.status(StatusCodes.OK).json({ activity })
})

export const createActivity = asyncWrapper(async (req, res) => {
  req.body.createdBy = req.user.userId
  const activity = await Activity.create(req.body)
  res.status(StatusCodes.CREATED).json({ activity })
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

  res.status(StatusCodes.OK).json({ msg: 'Activity deleted successfully' });
});

// userStats
const getEmissionsTotalForDays = async (days, userId) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const userObjectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const result = await Activity.aggregate([
    {
      $match: {
        createdBy: userObjectId,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalEmissions: { $sum: "$emissions" },
        count: { $sum: 1 },
        avgEmission: { $avg: "$emissions" }
      }
    }
  ]);

  return result[0] || { totalEmissions: 0, count: 0 };
};


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
              totalEmissions: { $sum: "$emissions" },
              noOfActivities: { $sum: 1 },
              avgEmission: { $avg: "$emissions" },
            },
          },
        ],
        communityStats: [
          {
            $group: {
              _id: null, 
              communityAvg: { $avg: "$emissions" }
            }
          }
        ]
      }
    }
  ]);

  const userStats = aggregationResult.userStats[0] || {
    totalEmissions: 0,
    noOfActivities: 0,
    avgEmission: 0,
  };

  const communityAvg = aggregationResult.communityStats[0]?.communityAvg || 0;

  const weeklySummary = await getEmissionsTotalForDays(7, userId)
  const monthlySummary = await getEmissionsTotalForDays(30, userId)

  res.status(StatusCodes.OK).json({
    userStats,
    weeklySummary,
    monthlySummary,
    communityAvg,
  });
});

