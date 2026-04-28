const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

//  CREATE endpoint
router.post('/', leadController.createLead);

module.exports = router;