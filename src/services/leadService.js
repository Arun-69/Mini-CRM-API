const Lead = require('../models/Lead');
const Company = require('../models/Company');

class LeadService {
  // Create lead
  async createLead(leadData, userId) {
    const data = { ...leadData, createdBy: userId };

    // Handle company creation/finding
    if (leadData.companyName) {
      let company = await Company.findOne({
        name: leadData.companyName,
        createdBy: userId
      });

      if (!company) {
        company = new Company({
          name: leadData.companyName,
          createdBy: userId
        });
        await company.save();
      }

      data.company = company._id;
      delete data.companyName;
    }

    const lead = new Lead(data);
    await lead.save();
    await lead.populate(['company', 'assignedTo', 'createdBy']);

    return lead;
  }

  // Get all leads with pagination and filters
  async getLeads(filters, userId) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { createdBy: userId };

    // Search filter
    if (filters.search) {
      filter.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Status filter
    if (filters.status) {
      filter.status = filters.status;
    }

    // Source filter
    if (filters.source) {
      filter.source = filters.source;
    }

    // Company filter
    if (filters.company) {
      filter.company = filters.company;
    }

    // Assigned filter
    if (filters.assignedTo) {
      filter.assignedTo = filters.assignedTo;
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('company', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(filter)
    ]);

    return {
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get single lead
  async getLead(leadId, userId) {
    const lead = await Lead.findOne({
      _id: leadId,
      createdBy: userId
    }).populate(['company', 'assignedTo', 'createdBy']);

    if (!lead) {
      throw new Error('Lead not found');
    }

    return lead;
  }

  // Update lead
  async updateLead(leadId, updateData, userId) {
    const lead = await Lead.findOne({
      _id: leadId,
      createdBy: userId
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Handle company update
    if (updateData.companyName) {
      let company = await Company.findOne({
        name: updateData.companyName,
        createdBy: userId
      });

      if (!company) {
        company = new Company({
          name: updateData.companyName,
          createdBy: userId
        });
        await company.save();
      }

      updateData.company = company._id;
      delete updateData.companyName;
    }

    Object.assign(lead, updateData);
    await lead.save();
    await lead.populate(['company', 'assignedTo', 'createdBy']);

    return lead;
  }

  // Update lead status
  async updateLeadStatus(leadId, status, userId) {
    const lead = await Lead.findOne({
      _id: leadId,
      createdBy: userId
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    lead.status = status;
    await lead.save();
    await lead.populate(['company', 'assignedTo', 'createdBy']);

    return lead;
  }

  // Soft delete lead
  async deleteLead(leadId, userId) {
    const lead = await Lead.findOne({
      _id: leadId,
      createdBy: userId
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    lead.isDeleted = true;
    lead.deletedAt = new Date();
    await lead.save();

    return true;
  }

  // Get leads by company
  async getLeadsByCompany(companyId, userId) {
    const leads = await Lead.find({
      company: companyId,
      createdBy: userId
    }).populate('assignedTo', 'name email');

    return leads;
  }
}

module.exports = new LeadService();