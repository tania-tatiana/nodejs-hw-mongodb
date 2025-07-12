import httpErrors from 'http-errors';
const { createHttpError } = httpErrors;

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  upsertContact,
} from '../services/contacts.js';
export async function getAllContactsController(request, response) {
  const contacts = await getAllContacts();
  response.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}
export async function getContactController(request, response) {
  const contact = await getContact(request.params.contactId);

  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  response.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
}

export async function createContactController(request, response) {
  const product = await createContact(request.body);
  response.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: product,
  });
}

export async function patchContactController(request, response) {
  const product = await upsertContact(request.params.contactId, request.body);
  if (product == null) {
    throw new createHttpError.NotFound('Contact not found');
  }
  response.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: product,
  });
}

export async function deleteContactController(request, response) {
  const product = await deleteContact(request.params.contactId);
  if (product == null) {
    throw new createHttpError.NotFound('Contact not found');
  }
  response.status(204).end();
}
