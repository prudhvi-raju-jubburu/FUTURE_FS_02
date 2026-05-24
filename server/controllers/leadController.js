import { Lead } from '../models/index.js';

export const getAllLeads = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search
    };

    const leads = await Lead.getAll(filters);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lead', error: error.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const newLead = await Lead.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead: newLead
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const updatedLead = await Lead.update(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Converted', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        validStatuses
      });
    }

    const lead = await Lead.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const updatedLead = await Lead.update(req.params.id, { status });
    res.json({
      success: true,
      message: 'Lead status updated successfully',
      lead: updatedLead
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lead status', error: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await Lead.delete(req.params.id);
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete lead', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await Lead.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};
