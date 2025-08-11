import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.number().required(),
  email: Joi.string().email().allow('').optional(),
  isFavourite: Joi.boolean().allow('').optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  photo: Joi.any().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.number().optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
  photo: Joi.any().optional(),
});
