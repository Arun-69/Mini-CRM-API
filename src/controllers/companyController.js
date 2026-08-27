const CompanyService = require('../services/companyService');

class CompanyController {
  // Create company
  async createCompany(req, res) {
    try {
      const company = await CompanyService.createCompany(req.body, req.user._id);
      res.status(201).json({
        status: 'success',
        message: 'Company created successfully',
        company
      });
    } catch (error) {
      console.error('Create company error:', error);
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get all companies
  async getCompanies(req, res) {
    try {
      const result = await CompanyService.getCompanies(req.query, req.user._id);
      res.json({
        status: 'success',
        ...result
      });
    } catch (error) {
      console.error('Get companies error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Get single company
  async getCompany(req, res) {
    try {
      const result = await CompanyService.getCompany(req.params.id, req.user._id);
      res.json({
        status: 'success',
        ...result
      });
    } catch (error) {
      console.error('Get company error:', error);
      if (error.message === 'Company not found') {
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

  // Update company
  async updateCompany(req, res) {
    try {
      const company = await CompanyService.updateCompany(req.params.id, req.body, req.user._id);
      res.json({
        status: 'success',
        message: 'Company updated successfully',
        company
      });
    } catch (error) {
      console.error('Update company error:', error);
      if (error.message === 'Company not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new CompanyController();