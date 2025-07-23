import { isValidObjectId } from 'mongoose';
export function isValidId(request, response, next) {
  if (!isValidObjectId(request.params.contactId)) {
    return response
      .status(400)
      .json({ status: 400, message: 'ID is not valid' });
  }
  next();
}
