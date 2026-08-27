const express = require('express');
const CompanyController = require('../controllers/companyController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', CompanyController.createCompany);
router.get('/', CompanyController.getCompanies);
router.get('/:id', CompanyController.getCompany);
router.put('/:id', CompanyController.updateCompany);

module.exports = router;