const { body, param, query } = require('express-validator');

// User validation rules
const userValidationRules = {
  register: [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
      .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('email')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  login: [
    body('email')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ]
};

// Lead validation rules
const leadValidationRules = {
  create: [
    body('name')
      .notEmpty().withMessage('Lead name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
      .isEmail().withMessage('Please provide a valid email'),
    body('phone')
      .notEmpty().withMessage('Phone number is required'),
    body('status')
      .optional()
      .isIn(['new', 'contacted', 'qualified', 'lost', 'converted'])
      .withMessage('Invalid status value'),
    body('source')
      .optional()
      .isIn(['website', 'referral', 'social', 'email', 'other'])
      .withMessage('Invalid source value')
  ],
  updateStatus: [
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['new', 'contacted', 'qualified', 'lost', 'converted'])
      .withMessage('Invalid status value')
  ],
  id: [
    param('id')
      .isMongoId().withMessage('Invalid lead ID')
  ]
};

// Company validation rules
const companyValidationRules = {
  create: [
    body('name')
      .notEmpty().withMessage('Company name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
      .optional()
      .isEmail().withMessage('Please provide a valid email')
  ],
  id: [
    param('id')
      .isMongoId().withMessage('Invalid company ID')
  ]
};

// Task validation rules
const taskValidationRules = {
  create: [
    body('title')
      .notEmpty().withMessage('Task title is required')
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('lead')
      .isMongoId().withMessage('Invalid lead ID'),
    body('assignedTo')
      .isMongoId().withMessage('Invalid user ID'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority value'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
      .withMessage('Invalid status value')
  ],
  updateStatus: [
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
      .withMessage('Invalid status value')
  ],
  id: [
    param('id')
      .isMongoId().withMessage('Invalid task ID')
  ]
};

// Pagination validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

module.exports = {
  userValidationRules,
  leadValidationRules,
  companyValidationRules,
  taskValidationRules,
  paginationValidation
};