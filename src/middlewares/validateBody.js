export function validateBody(schema) {
  return async (request, response, next) => {
    try {
      const result = await schema.validateAsync(request.body);
      console.log(result);
      next();
    } catch (error) {
      next(error);
    }
  };
}
