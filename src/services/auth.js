import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
  return result;
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) throw createHttpError(404, 'User not found');

  const isPassword = await bcrypt.compare(payload.password, user.password);

  if (!isPassword) throw createHttpError(401, 'Wrong password');

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });
  return;
};

export const refreshUser = async (sessionId, refreshToken) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionsCollection.create({
    userId: session.userId,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};
