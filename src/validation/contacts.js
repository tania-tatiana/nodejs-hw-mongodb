import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min().max().required(),
  phoneNumber: Joi.number().required(),
  email: Joi.email().required(),
  isFavourite: Joi.boolean().required(),
  contactType: Joi.string().valid('home', 'not home').required(),
});
