import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendMail } from '../utils/sendMail.js';
export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict('Email in use');
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }
  const isMathced = await bcrypt.compare(password, user.password);
  if (isMathced !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }
  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);
  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }
  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function logOutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function sendResetEmail(email) {
  const user = await User.findOne({ email });
  const domainSendMail = getEnvVariable('APP_DOMAIN');
  const sendMailFrom = getEnvVariable('SMTP_FROM');
  if (user === null) {
    throw new createHttpError.NotFound('User not found!');
    // Or return;
  }
  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
      email: user.email,
    },
    getEnvVariable('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );
  await sendMail({
    from: `${sendMailFrom}`,
    to: email,
    subject: 'Reset password',
    html: `<p>To reset password, please tap this <a href="${domainSendMail}/reset-pwd?token=${token}
">Link</a></p>`,
  });
}

export async function resetPassword(token, password) {
  try {
    console.log('Token:', token);
    console.log('Secret:', getEnvVariable('JWT_SECRET'));
    const decoded = jwt.verify(token, getEnvVariable('JWT_SECRET'));
    const user = await User.findById(decoded.sub);
    if (user === null) {
      throw new createHttpError.NotFound('User not found!');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }
    throw error;
  }
}
