const LeadService = require('./leadService');
const TaskService = require('./taskService');
const CompanyService = require('./companyService');

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats(userId) {
    try {
      // Get all data in parallel
      const [
        leadStats,
        taskStats,
        totalCompanies,
        recentLeads,
        recentTasks
      ] = await Promise.all([
        this.getLeadStats(userId),
        this.getTaskStats(userId),
        this.getCompanyStats(userId),
        this.getRecentLeads(userId, 5),
        this.getRecentTasks(userId, 5)
      ]);

      return {
        stats: {
          ...leadStats,
          ...taskStats,
          totalCompanies
        },
        recent: {
          leads: recentLeads,
          tasks: recentTasks
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard statistics: ${error.message}`);
    }
  }

  // Get lead statistics
  async getLeadStats(userId) {
    const leads = await LeadService.getLeads({ limit: 1000 }, userId);
    
    const totalLeads = leads.pagination.total;
    
    // Get leads by status
    const leadsByStatus = leads.leads.reduce((acc, lead) => {
      const status = lead.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Get leads by source
    const leadsBySource = leads.leads.reduce((acc, lead) => {
      const source = lead.source;
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    // Format for frontend
    const statusMap = {
      'new': 'New',
      'contacted': 'Contacted',
      'qualified': 'Qualified',
      'lost': 'Lost',
      'converted': 'Converted'
    };

    const sourceMap = {
      'website': 'Website',
      'referral': 'Referral',
      'social': 'Social Media',
      'email': 'Email',
      'other': 'Other'
    };

    return {
      totalLeads,
      leadsByStatus: Object.entries(leadsByStatus).reduce((acc, [key, value]) => {
        acc[statusMap[key] || key] = value;
        return acc;
      }, {}),
      leadsBySource: Object.entries(leadsBySource).reduce((acc, [key, value]) => {
        acc[sourceMap[key] || key] = value;
        return acc;
      }, {})
    };
  }

  // Get task statistics
  async getTaskStats(userId) {
    const taskStats = await TaskService.getTaskStats(userId);
    return taskStats;
  }

  // Get company statistics
  async getCompanyStats(userId) {
    const companies = await CompanyService.getCompanies({ limit: 1000 }, userId);
    return companies.pagination.total;
  }

  // Get recent leads
  async getRecentLeads(userId, limit = 5) {
    const result = await LeadService.getLeads({ limit, page: 1 }, userId);
    return result.leads;
  }

  // Get recent tasks
  async getRecentTasks(userId, limit = 5) {
    const result = await TaskService.getTasks({ limit, page: 1 }, userId);
    return result.tasks;
  }
}

module.exports = new DashboardService();