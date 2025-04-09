import {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
} from '../services/auth.js';

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 201,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (sessionId && refreshToken) {
    await logoutUser(sessionId, refreshToken);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
};

export const refreshController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshUser(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};
