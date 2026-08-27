const mongoose = require('mongoose');
const leadSchema = require('../schemas/leadSchema');

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;