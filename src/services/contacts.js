import { Contact } from '../db/models/contacts.js';
async function getAllContacts(req, res) {
  const contacts = await Contact.find();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}
async function getContact(req, res) {
  const contact = await Contact.findById(req.params.contactId);

  if (contact === null) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
}

export { getAllContacts, getContact };
