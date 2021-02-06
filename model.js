var mongoose = require('mongoose');
var schema = require('./schema');
var userModel = mongoose.model('userModel', schema);

module.exports = userModel;