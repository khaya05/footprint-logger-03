import { asyncWrapper } from '../util/asyncWrapper.js';
import User from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
import { comparePassword, hashPassword } from '../util/passwordUtil.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createToken } from '../util/tokenUtils.js';

export const register = asyncWrapper(async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);

  const token = createToken({ userId: user._id, role: user.role });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(StatusCodes.CREATED).json({
    user,
    token
  });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const isValidUser = user && (await comparePassword(password, user.password));

  if (!isValidUser) throw new UnauthenticatedError('invalid credentials');

  const token = createToken({ userId: user._id, role: user.role });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(StatusCodes.OK).json({
    msg: 'user logged in',
    token,
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
