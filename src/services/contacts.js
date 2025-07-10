import mongoose from 'mongoose';
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: false },
    isFavourite: { type: Boolean, required: false, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true,
  },
);

const Contact = mongoose.model('Contact', contactSchema);

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

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
}

export { getAllContacts };
export { getContact };
