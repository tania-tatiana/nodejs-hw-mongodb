import { Contact } from '../db/models/contacts.js';

export async function getAllContacts(
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
) {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactQuery = Contact.find();

  if (typeof filters.type !== 'undefined') {
    contactQuery.where('contactType').equals(filters.type);
  }

  if (typeof filters.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const [totalItems, data] = await Promise.all([
    await Contact.find().countDocuments(contactQuery),
    await contactQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
}

export const getContact = (contactId) => Contact.findById(contactId);

export const createContact = (contactData) => Contact.create(contactData);

export const upsertContact = (contactId, updateData) =>
  Contact.findByIdAndUpdate(contactId, updateData, { new: true });

export const deleteContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);
