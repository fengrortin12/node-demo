var mongoose = require('mongoose');
var schema = require('./schema');
var userInfo = mongoose.model('userInfo', schema, 'userInfo');

module.exports = userInfo;
