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

// Get all leads with optional status filter
const getAllLeads = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const leads = await Lead.find(filter);
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

// Get single lead by ID
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById
};