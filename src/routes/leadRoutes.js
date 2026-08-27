const express = require('express');
const LeadController = require('../controllers/leadController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', LeadController.createLead);
router.get('/', LeadController.getLeads);
router.get('/:id', LeadController.getLead);
router.put('/:id', LeadController.updateLead);
router.patch('/:id/status', LeadController.updateLeadStatus);
router.delete('/:id', LeadController.deleteLead);

module.exports = router;