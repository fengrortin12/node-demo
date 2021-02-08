var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    userName: String,
    ruleName: String,
    ruleCode: {
        type: Number,
        min: 0
    },
    loginName: {
        unique: true,//唯一索引
        type: String,//数据类型
        required: true//必填
    },
    password: String,
    email: String,
    address: String,
    phoneNumber: String,
    createTime: {
        type: Date,
        default: Date.now()
    }
});
//userInfo实例方法集合
schema.methods = {};
//userInfo静态方法集合
schema.statics = {
    //查询单条数据
    findBylogin: function (data, cb) {
        return this.findOne(data).exec(cb);
    },
    findCount: function (cb) {
        return this.find().count().exec(cb);
    },
    //分页查询
    limitUserList: function (data, cb) {
        return this
            .find()
            .sort({createTime: -1})
            .skip(data.pageSize < data.count ? (data.pageNumber * data.pageSize) : 0)
            .limit(data.pageSize)
            .exec(cb);
    }
};
module.exports = schema;