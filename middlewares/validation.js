const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCardBody = celebrate({
  body: Joi.object().keys({
    objectID: Joi.number().required().messages({
      "number.base": 'The "objectID" field must be a number',
      "any.required": 'The "objectID" field is required',
    }),

    title: Joi.string().required().messages({
      "string.empty": 'The "title" field must be filled in',
      "any.required": 'The "title" field is required',
    }),

    artistDisplayName: Joi.string().allow("").messages({
      "string.base": 'The "artistDisplayName" field must be a string',
    }),

    objectDate: Joi.string().allow("").messages({
      "string.base": 'The "objectDate" field must be a string',
    }),

    primaryImageSmall: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "primaryImageSmall" field must be filled in',
      "string.uri": 'The "primaryImageSmall" field must be a valid URL',
      "any.required": 'The "primaryImageSmall" field is required',
    }),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
      "any.required": 'The "avatar" field is required',
    }),

    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "any.required": 'The "email" field is required',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "any.required": 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.length": 'The "userId" must be 24 characters long',
      "string.hex": 'The "userId" must be a hexadecimal value',
      "any.required": 'The "userId" field is required',
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length": 'The "itemId" must be 24 characters long',
      "string.hex": 'The "itemId" must be a hexadecimal value',
      "any.required": 'The "itemId" field is required',
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
      "any.required": 'The "avatar" field is required',
    }),
  }),
});

module.exports = {
  validateCardBody,
  validateSignup,
  validateLogin,
  validateUserId,
  validateItemId,
  validateUserUpdate,
};
