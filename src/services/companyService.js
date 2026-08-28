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

    // Search filter - by name, industry, city
    if (filters.search) {
      filter.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { industry: { $regex: filters.search, $options: 'i' } },
        { 'address.city': { $regex: filters.search, $options: 'i' } }
      ];
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

  // Delete company
  async deleteCompany(companyId, userId) {
    const company = await Company.findOne({
      _id: companyId,
      createdBy: userId
    });

    if (!company) {
      throw new Error('Company not found');
    }

    // Check if company has associated leads
    const leads = await LeadService.getLeadsByCompany(companyId, userId);
    if (leads && leads.length > 0) {
      throw new Error('Cannot delete company with associated leads. Please reassign or delete the leads first.');
    }

    await Company.findByIdAndDelete(companyId);
    return true;
  }

  // Search companies
  async searchCompanies(query, userId) {
    const filter = {
      createdBy: userId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { industry: { $regex: query, $options: 'i' } },
        { 'address.city': { $regex: query, $options: 'i' } }
      ]
    };

    const companies = await Company.find(filter)
      .sort({ name: 1 })
      .limit(20);

    return companies;
  }
}

module.exports = new CompanyService();