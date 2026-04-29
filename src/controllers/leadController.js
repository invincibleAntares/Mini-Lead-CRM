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

// Update lead fields
const updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, source } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, source },
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// Delete lead
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update lead status with transition validation
const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { isValidTransition } = require('../utils/statusTransitions');
    
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    if (!isValidTransition(lead.status, status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${lead.status} to ${status}` 
      });
    }
    
    lead.status = status;
    await lead.save();
    
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// Create multiple leads at once
const createBulkLeads = async (req, res, next) => {
  try {
    const leads = req.body;
    
    if (!Array.isArray(leads)) {
      return res.status(400).json({ error: 'Request body must be an array of lead objects' });
    }

    const results = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < leads.length; i++) {
      try {
        const lead = new Lead(leads[i]);
        const savedLead = await lead.save();
        
        results.push({
          index: i,
          success: true,
          lead: savedLead
        });
        successful++;
      } catch (error) {
        results.push({
          index: i,
          success: false,
          error: error.message
        });
        failed++;
      }
    }

    res.status(201).json({
      total: leads.length,
      successful,
      failed,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  createBulkLeads,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus
};