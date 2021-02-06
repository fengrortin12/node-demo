var mongoose = require('mongoose');
var user = new mongoose.Schema('user',{
    name: String,
    age: Number,
    sex: String
});
var schema = new user();
schema.pre('save', function (next) {

});
schema.statics = {
    findList: function (callback) {
        return this.find({}).sort().exec(callback)
    }
};
module.exports = schema;