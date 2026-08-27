class Helpers {
  // Format response
  static formatResponse(status, message, data = null) {
    return {
      status,
      message,
      ...(data && { data })
    };
  }

  // Generate random ID
  static generateId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Validate email
  static isValidEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  // Validate phone number
  static isValidPhone(phone) {
    const regex = /^\+?[\d\s-]{10,}$/;
    return regex.test(phone);
  }

  // Sanitize string
  static sanitizeString(str) {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }

  // Get status color
  static getStatusColor(status) {
    const colors = {
      new: 'blue',
      contacted: 'orange',
      qualified: 'green',
      lost: 'red',
      converted: 'green',
      pending: 'orange',
      'in-progress': 'blue',
      completed: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  }

  // Format date
  static formatDate(date) {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  }

  // Get date difference in days
  static getDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d2 - d1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Check if date is overdue
  static isOverdue(date) {
    if (!date) return false;
    return new Date() > new Date(date);
  }

  // Generate pagination metadata
  static getPaginationMetadata(page, limit, total) {
    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1
    };
  }

  // Get query filters from request
  static getQueryFilters(req, allowedFilters) {
    const filters = {};
    allowedFilters.forEach(filter => {
      if (req.query[filter]) {
        filters[filter] = req.query[filter];
      }
    });
    return filters;
  }
}

module.exports = Helpers;