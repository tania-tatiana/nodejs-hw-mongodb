import createHttpError from 'http-errors';

export function validateBody(schema) {
  return async (request, response, next) => {
    try {
      await schema.validateAsync(request.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      const errors = error.details.map((detail) => detail.message);
      next(new createHttpError.BadRequest(errors));
    }
  };
}
