import { isValidObjectId } from 'mongoose';
export function isValidId(request, response, next) {
  if (isValidObjectId(request.params.id !== true)) {
    return response
      .status(400)
      .json({ status: 404, message: 'ID is not valid' });
  }
  next();
}
