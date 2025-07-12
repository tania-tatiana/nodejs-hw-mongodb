import { Contact } from '../db/models/contacts.js';

export const getAllContacts = () => Contact.find();

export const getContact = (contactId) => Contact.findById(contactId);

export const createContact = (contactData) => Contact.create(contactData);

export const upsertContact = (contactId, updateData) =>
  Contact.findByIdAndUpdate(contactId, updateData, { new: true });

export const deleteContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);
