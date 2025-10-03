// backend/validators/subscriptionValidator.js
const Joi = require('joi');

const schema = Joi.object({
  userId: Joi.string().required(),
  testId: Joi.string().required(),
  title: Joi.string().required(),
  price: Joi.number().positive().required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  payment: Joi.string().valid('Credit/Debit Card','Easypaisa','JazzCash','Bank Transfer').required(),
  extraInfo: Joi.string().allow('', null),
  paymentIntentId: Joi.string().allow('', null),
  cardLast4: Joi.string().allow('', null),
  cardBrand: Joi.string().allow('', null),
  cardDetails: Joi.object().optional(),
  mobileNumber: Joi.string().allow('', null),
  transactionId: Joi.string().allow('', null)
});

module.exports = schema;
