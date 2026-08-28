const Lead = require('../models/Lead');
const Company = require('../models/Company');
const mongoose = require('mongoose');

class LeadService {
  // Create lead
  async createLead(leadData, userId) {
    const data = { ...leadData, createdBy: userId };

    if (data.company) {
      const company = await Company.findOne({
        _id: data.company,
        createdBy: userId
      });
      if (!company) {
        throw new Error('Company not found');
      }
    } else {
      data.company = null;
    }

    if (data.assignedTo && mongoose.Types.ObjectId.isValid(data.assignedTo)) {

    } else {
      data.assignedTo = null;
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

    // Company filter
    if (filters.company) {
      filter.company = filters.company;
    }

    // Assigned filter
    if (filters.assignedTo && mongoose.Types.ObjectId.isValid(filters.assignedTo)) {
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
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      throw new Error('Invalid lead ID format');
    }

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
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      throw new Error('Invalid lead ID format');
    }

    const lead = await Lead.findOne({
      _id: leadId,
      createdBy: userId
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Handle company update
    if (updateData.company !== undefined) {
      if (updateData.company) {
        const company = await Company.findOne({
          _id: updateData.company,
          createdBy: userId
        });
        if (!company) {
          throw new Error('Company not found');
        }
        lead.company = updateData.company;
      } else {
        lead.company = null;
      }
      delete updateData.company;
    }


    if (updateData.assignedTo !== undefined) {
      if (updateData.assignedTo && mongoose.Types.ObjectId.isValid(updateData.assignedTo)) {
        lead.assignedTo = updateData.assignedTo;
      } else {
        lead.assignedTo = null;
      }
      delete updateData.assignedTo;
    }


    if (updateData.name) lead.name = updateData.name;
    if (updateData.email) lead.email = updateData.email;
    if (updateData.phone) lead.phone = updateData.phone;
    if (updateData.status) lead.status = updateData.status;

    await lead.save();
    await lead.populate(['company', 'assignedTo', 'createdBy']);

    return lead;
  }

  // Update lead status
  async updateLeadStatus(leadId, status, userId) {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      throw new Error('Invalid lead ID format');
    }

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

  async deleteLead(leadId, userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error('Invalid lead ID format');
      }

      console.log('Deleting lead:', leadId, 'for user:', userId);

      const lead = await Lead.findOne({
        _id: leadId,
        createdBy: userId
      });

      if (!lead) {
        throw new Error('Lead not found');
      }

      if (lead.isDeleted) {
        throw new Error('Lead is already deleted');
      }

      lead.isDeleted = true;
      lead.deletedAt = new Date();
      await lead.save();

      console.log('Lead soft deleted successfully:', leadId);

      return true;
    } catch (error) {
      console.error('Delete lead error:', error);
      throw error;
    }
  }

  // Get leads by company
  async getLeadsByCompany(companyId, userId) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return [];
    }

    const leads = await Lead.find({
      company: companyId,
      createdBy: userId,
      isDeleted: false
    }).populate('assignedTo', 'name email');

    return leads;
  }
}

module.exports = new LeadService();