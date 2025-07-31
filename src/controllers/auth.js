import {
  loginUser,
  logOutUser,
  refreshSession,
  registerUser,
  resetPassword,
  sendResetEmail,
} from '../services/auth.js';

export async function registerController(request, response) {
  const register = await registerUser(request.body);

  response.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: register,
  });
}

export async function loginController(request, response) {
  const session = await loginUser(request.body.email, request.body.password);
  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  response.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
}

export async function refreshController(request, response) {
  const { sessionId, refreshToken } = request.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });
  response.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
}

export async function logoutController(request, response) {
  const { sessionId } = request.cookies;
  if (typeof sessionId !== 'undefined') {
    await logOutUser(sessionId);
  }
  response.clearCookie('sessionId');
  response.clearCookie('refreshToken');

  response.status(204).end();
}

export async function sendResetEmailController(request, response) {
  const resetEmail = await sendResetEmail(request.body.email);
  response.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
  console.log(resetEmail);
}

export async function resetPasswordController(request, response) {
  const { token, password } = request.body;
  await resetPassword(token, password);
  response.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}
