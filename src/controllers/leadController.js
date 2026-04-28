const Lead = require('../models/leadModel');

// Create a new lead
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, source } = req.body;
    
    const lead = new Lead({
      name,
      email,
      phone,
      source
    });

    const savedLead = await lead.save();
    
    res.status(201).json(savedLead);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead
};