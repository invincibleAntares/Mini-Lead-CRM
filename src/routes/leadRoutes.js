const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

// All CRUD endpoints
router.post('/', leadController.createLead);
router.post('/bulk', leadController.createBulkLeads);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);
router.patch('/:id/status', leadController.updateLeadStatus);

module.exports = router;