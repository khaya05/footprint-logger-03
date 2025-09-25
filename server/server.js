import * as dotenv from 'dotenv';
dotenv.config();

import { Server } from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
const app = express();

import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import activityRouter from './routes/activityRouter.js';
import goalRouter from './routes/goalRouter.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import { BadRequestError, UnauthenticatedError } from './errors/customErrors.js';
import { verifyJWT } from './util/tokenUtils.js';

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/activities', authenticateUser, activityRouter);
app.use('/api/v1/goals', authenticateUser, goalRouter);

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// error handler
app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const port = process.env.PORT || 5100;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie
    if (!cookies) next(new BadRequestError('No cookies found'))

    const req = {
      headers: {
        cookie: cookies
      }
    }
    const parsedCookies = {}
    cookieParser()(
      { headers: { cookie: cookies } },
      { cookie: (name, value) => parsedCookies[name] = value },
      () => { }
    );

    const token = req.cookies?.token || parsedCookies.token

    if (!token) next(new UnauthenticatedError('no token found'))

    const decoded = verifyJWT(token)
    socket.userId = decoded.userId
    next()
  } catch (err) {
    console.error("Socket authentication error:", err);
    next(new Error("Authentication error"));
  }
})

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

app.set('io', io);

try {
  await mongoose.connect(process.env.MONGO_URL);
  server.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

export { io }
