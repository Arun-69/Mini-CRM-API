const express = require('express');
const CompanyController = require('../controllers/companyController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create company
router.post('/', CompanyController.createCompany);

// Get all companies (with pagination)
router.get('/', CompanyController.getCompanies);

// Get single company
router.get('/:id', CompanyController.getCompany);

// Update company
router.put('/:id', CompanyController.updateCompany);

// Delete company
router.delete('/:id', CompanyController.deleteCompany);

module.exports = router;