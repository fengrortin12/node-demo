var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    userName: String,
    ruleName: String,
    ruleCode: Number,
    loginName: {
        unique: true,
        type: String
    },
    password: String,
    email: String,
    address: String
});
schema.statics = {
    findBylogin: function (data, cb) {
        return this.findOne(data).exec(cb)
    }
};
module.exports = schema;