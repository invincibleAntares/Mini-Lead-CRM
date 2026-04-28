const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

// CREATE and READ endpoints
router.post('/', leadController.createLead);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);

module.exports = router;