const LeadService = require('../services/leadService');

class LeadController {
  // Create lead
  async createLead(req, res) {
    try {
      const lead = await LeadService.createLead(req.body, req.user._id);
      res.status(201).json({
        status: 'success',
        message: 'Lead created successfully',
        lead
      });
    } catch (error) {
      console.error('Create lead error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get all leads
  async getLeads(req, res) {
    try {
      const result = await LeadService.getLeads(req.query, req.user._id);
      res.json({
        status: 'success',
        ...result
      });
    } catch (error) {
      console.error('Get leads error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get single lead
  async getLead(req, res) {
    try {
      const lead = await LeadService.getLead(req.params.id, req.user._id);
      res.json({
        status: 'success',
        lead
      });
    } catch (error) {
      console.error('Get lead error:', error);
      if (error.message === 'Lead not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Update lead
  async updateLead(req, res) {
    try {
      const lead = await LeadService.updateLead(req.params.id, req.body, req.user._id);
      res.json({
        status: 'success',
        message: 'Lead updated successfully',
        lead
      });
    } catch (error) {
      console.error('Update lead error:', error);
      if (error.message === 'Lead not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Update lead status
  async updateLeadStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          status: 'error',
          message: 'Status is required'
        });
      }

      const lead = await LeadService.updateLeadStatus(req.params.id, status, req.user._id);
      res.json({
        status: 'success',
        message: 'Lead status updated successfully',
        lead
      });
    } catch (error) {
      console.error('Update lead status error:', error);
      if (error.message === 'Lead not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Delete lead
  async deleteLead(req, res) {
    try {
      await LeadService.deleteLead(req.params.id, req.user._id);
      res.json({
        status: 'success',
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      console.error('Delete lead error:', error);
      if (error.message === 'Lead not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new LeadController();