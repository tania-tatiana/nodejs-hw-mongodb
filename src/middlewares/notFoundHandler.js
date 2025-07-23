import createHttpError from 'http-errors';

export function notFoundHandler() {
  throw createHttpError(400, 'Route not found');
}
