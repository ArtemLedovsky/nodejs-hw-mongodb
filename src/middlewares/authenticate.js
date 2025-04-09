import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/users.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(createHttpError(401, 'Please provide access token'));
  }

  const bearer = authorization.split(' ')[0];
  const accessToken = authorization.split(' ')[1];

  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};
