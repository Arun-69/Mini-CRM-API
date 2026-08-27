const Company = require('../models/Company');
const LeadService = require('./leadService');

class CompanyService {
  // Create company
  async createCompany(companyData, userId) {
    const data = { ...companyData, createdBy: userId };

    // Check if company exists
    const existingCompany = await Company.findOne({
      name: data.name,
      createdBy: userId
    });

    if (existingCompany) {
      throw new Error('Company already exists');
    }

    const company = new Company(data);
    await company.save();

    return company;
  }

  // Get all companies with pagination and filters
  async getCompanies(filters, userId) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { createdBy: userId };

    // Search filter
    if (filters.search) {
      filter.name = { $regex: filters.search, $options: 'i' };
    }

    // Industry filter
    if (filters.industry) {
      filter.industry = filters.industry;
    }

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Company.countDocuments(filter)
    ]);

    return {
      companies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get single company with leads
  async getCompany(companyId, userId) {
    const company = await Company.findOne({
      _id: companyId,
      createdBy: userId
    });

    if (!company) {
      throw new Error('Company not found');
    }

    // Get associated leads
    const leads = await LeadService.getLeadsByCompany(companyId, userId);

    return {
      company,
      leads
    };
  }

  // Update company
  async updateCompany(companyId, updateData, userId) {
    const company = await Company.findOne({
      _id: companyId,
      createdBy: userId
    });

    if (!company) {
      throw new Error('Company not found');
    }

    // Check if name is taken by another company
    if (updateData.name) {
      const existingCompany = await Company.findOne({
        name: updateData.name,
        createdBy: userId,
        _id: { $ne: company._id }
      });

      if (existingCompany) {
        throw new Error('Company name already exists');
      }
    }

    Object.assign(company, updateData);
    await company.save();

    return company;
  }

  // Get company by name
  async getCompanyByName(name, userId) {
    const company = await Company.findOne({
      name,
      createdBy: userId
    });
    return company;
  }

  // Get or create company
  async getOrCreateCompany(name, userId) {
    let company = await this.getCompanyByName(name, userId);
    
    if (!company) {
      company = await this.createCompany({ name }, userId);
    }
    
    return company;
  }
}

module.exports = new CompanyService();