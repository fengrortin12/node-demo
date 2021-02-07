var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: String,
    age: Number,
    sex: String
});
schema.statics = {
    findList: function (cb) {
        return this.find({}).exec(cb)
    }
};
module.exports = schema;