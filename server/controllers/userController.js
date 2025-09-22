import { asyncWrapper } from "../util/asyncWrapper.js";
import User from '../models/userModel.js'
import { StatusCodes } from "http-status-codes";

export const getCurrentUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user.userId)
  res.status(StatusCodes.OK).json({ user })
})

export const updateUser = asyncWrapper(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body)
  res.status(StatusCodes.OK).json({ msg: 'user update' })
})