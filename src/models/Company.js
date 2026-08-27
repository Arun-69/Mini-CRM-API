const mongoose = require('mongoose');
const companySchema = require('../schemas/companySchema');

const Company = mongoose.model('Company', companySchema);

module.exports = Company;