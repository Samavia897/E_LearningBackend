const Joi = require("joi");

const contactSchema = Joi.object({
  role: Joi.string().valid("student", "teacher", "other").required(),
  info: Joi.string().min(3).max(100).required(),
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  title: Joi.string().min(3).max(100).required(),
  message: Joi.string().min(10).max(500).required(),
  captcha: Joi.string().allow("").optional(), // ✅ captcha ko allow kar dia
});

module.exports = contactSchema;
