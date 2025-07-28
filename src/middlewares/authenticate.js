import createHttpError from 'http-errors';
import { Session } from '../db/models/Session.js';
import { User } from '../db/models/User.js';

export async function authenticate(request, response, next) {
  const { authorization } = request.headers;
  if (typeof authorization !== 'string') {
    throw new createHttpError.Unauthorized('Please provide access token');
  }
  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    throw new createHttpError.Unauthorized('Please provide access token');
  }

  const session = await Session.findOne({ accessToken });

  if (session === null) {
    throw new createHttpError.Unauthorized('Session is not found');
  }

  if (session.accessTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Access token expired');
  }

  const user = await User.findById(session.userId);

  if (user === null) {
    throw new createHttpError.NotFound('User not found');
  }

  request.user = { id: user._id, name: user.name };

  next();
}
