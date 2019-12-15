const joi = require('joi');

module.exports = joi.object().keys({
  name: joi.string().required(),
  bio: joi.string(),
  url: joi
    .string()
    .uri()
    .required()
});
