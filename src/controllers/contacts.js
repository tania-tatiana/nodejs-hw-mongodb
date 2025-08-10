import * as fs from 'node:fs/promises';

import path from 'node:path';

import createHttpError from 'http-errors';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  upsertContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';

export async function getAllContactsController(request, response) {
  const { page, perPage } = parsePaginationParams(request.query);
  const { sortBy, sortOrder } = parseSortParams(request.query);
  const filters = parseFilterParams(request.query);

  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
    request.user.id,
  );
  response.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}
export async function getContactController(request, response) {
  const contact = await getContact(request.params.contactId, request.user.id);

  if (contact === null) {
    throw new createHttpError(404, 'Contact not found');
  }

  if (contact.userId.toString() !== request.user.id.toString()) {
    throw new createHttpError.Forbidden('Contact restricted');
  }

  response.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
}

export async function createContactController(request, response) {
  let photo = null;
  if (getEnvVariable('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(request.file.path);
    await fs.unlink(request.file.path);
    photo = result.secure_url;
  } else {
    await fs.rename(
      request.file.path,
      path.resolve('src/uploads/photo', request.file.filename),
    );
    photo = `http://localhost:3000/photo/${request.file.filename}`;
  }

  const contact = await createContact({
    ...request.body,
    photo,
    userId: request.user.id,
  });
  response.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function patchContactController(request, response) {
  let photo = null;
  if (getEnvVariable('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(request.file.path);
    await fs.unlink(request.file.path);
    photo = result.secure_url;
  } else {
    await fs.rename(
      request.file.path,
      path.resolve('src/uploads/photo', request.file.filename),
    );
    photo = `http://localhost:3000/photo/${request.file.filename}`;
  }
  const contact = await upsertContact(
    request.params.contactId,
    request.body,
    request.user.id,
    photo,
  );
  if (contact == null) {
    throw new createHttpError(404, 'Contact not found');
  }
  response.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export async function deleteContactController(request, response) {
  const contact = await deleteContact(
    request.params.contactId,
    request.user.id,
  );
  if (contact == null) {
    throw new createHttpError(404, 'Contact not found');
  }
  response.status(204).end();
}
