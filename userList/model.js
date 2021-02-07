var mongoose = require('mongoose');
var schema = require('./schema');
var userModel = mongoose.model('user', schema, 'user');

module.exports = userModel;
