import { body, param, query, validationResult } from 'express-validator';
import { CATEGORY_TYPES } from '../util/constants.js';
import { BadRequestError } from '../errors/customErrors.js';
import User from '../models/userModel.js'

const handleValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateCreateActivity = handleValidationErrors([
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CATEGORY_TYPES)
    .withMessage('Category must be one of: transport, food, energy, digital'),

  body('activity')
    .notEmpty()
    .withMessage('Activity name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Activity name must be between 2-50 characters'),

  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('unit')
    .notEmpty()
    .withMessage('Unit is required')
    .isLength({ min: 1, max: 20 })
    .withMessage('Unit must be between 1-20 characters'),

  body('emissions')
    .isFloat({ min: 0 })
    .withMessage('Emissions must be a positive number'),

  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .toDate(),

  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
]);

export const validateUpdateActivity = handleValidationErrors([
  param('id')
    .isMongoId()
    .withMessage('Invalid activity ID'),

  body('category')
    .optional()
    .isIn(CATEGORY_TYPES)
    .withMessage('Category must be one of: transport, food, energy, digital'),

  body('activity')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Activity name must be between 2-50 characters'),

  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('unit')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Unit must be between 1-20 characters'),

  body('emissions')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Emissions must be a positive number'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .toDate(),

  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
]);

export const validateGetActivity = handleValidationErrors([
  param('id')
    .isMongoId()
    .withMessage('Invalid activity ID')
]);

export const validateActivityQuery = handleValidationErrors([
  query('category')
    .optional({ values: 'falsy' }) 
    .isIn(['all', ...CATEGORY_TYPES])
    .withMessage('Category must be one of: transport, food, energy, digital, all'),

  query('search')
    .optional({ values: 'falsy' }) 
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),

  query('sort')
    .optional({ values: 'falsy' }) 
    .isIn(['newest', 'oldest', 'highest', 'lowest', 'a-z', 'z-a'])
    .withMessage('Invalid sort option'),

  query('page')
    .optional({ values: 'falsy' })
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional({ values: 'falsy' })
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
]);

export const validateDeleteActivity = handleValidationErrors([
  param('id')
    .isMongoId()
    .withMessage('Invalid activity ID')
]);

export const validateRegisterUser = handleValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('name is required'),

  body('lastName')
    .notEmpty()
    .withMessage('last name is required'),

  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (email) => {
      const user = await User.findOne({ email })

      if (user) {
        throw new BadRequestError('email already exist')
      }
    }),

  body('password')
    .notEmpty()
    .withMessage('password is required!')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('invalid role')

])

export const validateLoginUser = handleValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email'),

  body('password')
    .notEmpty()
    .withMessage('password is required!')
])

export const validateUpdateUserInput = handleValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('name is required'),

  body('lastName')
    .notEmpty()
    .withMessage('last name is required'),

  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (email) => {
      const user = await User.findOne({ email })

      if (user) {
        throw new BadRequestError('email already exist')
      }
    }),
])