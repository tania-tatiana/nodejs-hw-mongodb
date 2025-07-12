import createHttpError from 'http-errors';

export function notFoundHandler() {
  throw new createHttpError[400]('Route not found');
}
