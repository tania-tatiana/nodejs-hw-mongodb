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
  const product = await createContact({
    ...request.body,
    userId: request.user.id,
  });
  response.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: product,
  });
}

export async function patchContactController(request, response) {
  const product = await upsertContact(
    request.params.contactId,
    request.body,
    request.user.id,
  );
  if (product == null) {
    throw new createHttpError(404, 'Contact not found');
  }
  response.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: product,
  });
}

export async function deleteContactController(request, response) {
  const product = await deleteContact(
    request.params.contactId,
    request.user.id,
  );
  if (product == null) {
    throw new createHttpError(404, 'Contact not found');
  }
  response.status(204).end();
}
