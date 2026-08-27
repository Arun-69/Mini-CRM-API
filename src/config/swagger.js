const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini CRM API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for Mini CRM Application',
      contact: {
        name: 'API Support',
        email: 'support@minicrm.com',
        url: 'https://minicrm.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server'
      },
      {
        url: 'https://api.minicrm.com/api',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token with Bearer prefix'
        }
      },
      schemas: {
        // User Schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Login successful' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        },

        // Lead Schemas
        Lead: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', example: 'jane@company.com' },
            phone: { type: 'string', example: '+1234567890' },
            company: { type: 'string', example: '507f1f77bcf86cd799439012' },
            status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost', 'converted'], example: 'new' },
            source: { type: 'string', enum: ['website', 'referral', 'social', 'email', 'other'], example: 'website' },
            notes: { type: 'string', example: 'Interested in our product' },
            assignedTo: { type: 'string', example: '507f1f77bcf86cd799439013' },
            createdBy: { type: 'string', example: '507f1f77bcf86cd799439014' },
            isDeleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateLeadRequest: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', example: 'jane@company.com' },
            phone: { type: 'string', example: '+1234567890' },
            companyName: { type: 'string', example: 'Tech Corp' },
            status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost', 'converted'], example: 'new' },
            source: { type: 'string', enum: ['website', 'referral', 'social', 'email', 'other'], example: 'website' },
            notes: { type: 'string', example: 'Interested in our product' },
            assignedTo: { type: 'string', example: '507f1f77bcf86cd799439013' }
          }
        },
        UpdateLeadRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', example: 'jane@company.com' },
            phone: { type: 'string', example: '+1234567890' },
            companyName: { type: 'string', example: 'Tech Corp' },
            status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost', 'converted'] },
            source: { type: 'string', enum: ['website', 'referral', 'social', 'email', 'other'] },
            notes: { type: 'string', example: 'Updated notes' },
            assignedTo: { type: 'string', example: '507f1f77bcf86cd799439013' }
          }
        },
        UpdateLeadStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost', 'converted'] }
          }
        },
        LeadListResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            leads: {
              type: 'array',
              items: { $ref: '#/components/schemas/Lead' }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                total: { type: 'number', example: 100 },
                pages: { type: 'number', example: 10 }
              }
            }
          }
        },

        // Company Schemas
        Company: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            name: { type: 'string', example: 'Tech Corp' },
            email: { type: 'string', example: 'info@techcorp.com' },
            phone: { type: 'string', example: '+1234567890' },
            website: { type: 'string', example: 'https://techcorp.com' },
            industry: { type: 'string', example: 'Technology' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'San Francisco' },
                state: { type: 'string', example: 'CA' },
                country: { type: 'string', example: 'USA' },
                zipCode: { type: 'string', example: '94105' }
              }
            },
            createdBy: { type: 'string', example: '507f1f77bcf86cd799439014' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateCompanyRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Tech Corp' },
            email: { type: 'string', example: 'info@techcorp.com' },
            phone: { type: 'string', example: '+1234567890' },
            website: { type: 'string', example: 'https://techcorp.com' },
            industry: { type: 'string', example: 'Technology' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'San Francisco' },
                state: { type: 'string', example: 'CA' },
                country: { type: 'string', example: 'USA' },
                zipCode: { type: 'string', example: '94105' }
              }
            }
          }
        },
        CompanyDetailResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            company: { $ref: '#/components/schemas/Company' },
            leads: {
              type: 'array',
              items: { $ref: '#/components/schemas/Lead' }
            }
          }
        },

        // Task Schemas
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439015' },
            title: { type: 'string', example: 'Follow up with client' },
            description: { type: 'string', example: 'Call to discuss proposal' },
            lead: { type: 'string', example: '507f1f77bcf86cd799439011' },
            assignedTo: { type: 'string', example: '507f1f77bcf86cd799439013' },
            assignedBy: { type: 'string', example: '507f1f77bcf86cd799439014' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'cancelled'], example: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
            dueDate: { type: 'string', format: 'date' },
            completedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title', 'lead', 'assignedTo'],
          properties: {
            title: { type: 'string', example: 'Follow up with client' },
            description: { type: 'string', example: 'Call to discuss proposal' },
            lead: { type: 'string', example: '507f1f77bcf86cd799439011' },
            assignedTo: { type: 'string', example: '507f1f77bcf86cd799439013' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
            dueDate: { type: 'string', format: 'date', example: '2024-12-31' }
          }
        },
        UpdateTaskStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'cancelled'] }
          }
        },

        // Dashboard Schemas
        DashboardStats: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                totalLeads: { type: 'number', example: 150 },
                totalTasks: { type: 'number', example: 45 },
                totalCompanies: { type: 'number', example: 30 },
                overdueTasks: { type: 'number', example: 5 },
                taskCompletionRate: { type: 'number', example: 75 },
                leadsByStatus: {
                  type: 'object',
                  additionalProperties: { type: 'number' },
                  example: { New: 50, Contacted: 30, Qualified: 40, Lost: 20, Converted: 10 }
                },
                tasksByStatus: {
                  type: 'object',
                  additionalProperties: { type: 'number' },
                  example: { Pending: 15, 'In Progress': 10, Completed: 15, Cancelled: 5 }
                }
              }
            },
            recent: {
              type: 'object',
              properties: {
                leads: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Lead' }
                },
                tasks: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Task' }
                }
              }
            }
          }
        },

        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error message here' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints - Login & Register'
      },
      {
        name: 'Leads',
        description: 'Lead management endpoints'
      },
      {
        name: 'Companies',
        description: 'Company management endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard statistics endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;