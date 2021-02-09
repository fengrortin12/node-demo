var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    id: String,
    userName: String,
    ruleName: String,
    ruleCode: {
        type: Number,
        min: 0,
        max: 5
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
    delFlag: {
        type: Number,
        min: 0,
        max: 1
    },
    createTime: {
        type: Date
    },
    updateTime: Date
});
//userInfo实例方法集合
schema.methods = {};
//userInfo静态方法集合
schema.statics = {
    //查询单条数据
    findBylogin: function (data, cb) {
        return this.findOne(data).exec(cb);
    },
    findCount: function (data, cb) {
        return this.find(data).count().exec(cb);
    },
    //分页查询
    findUserList: function (data, cb) {
        var skip = data.pageSize >= data.count ? 0 : ((data.pageNumber - 1) == 0 ? 0 : (data.pageNumber - 1) * data.pageSize);
        // console.log(skip);
        var params = {
            delFlag: data.delFlag
        };
        // createTime: {$gte: data.startTime, $lte: data.endTime},
        // params.userName = /data.userName/;
        // params.loginName = /data.loginName/;
        if (data.ruleCode) {
            params.ruleCode = data.ruleCode;
        }
        if (data.userName) {
            params.userName = '/' + data.userName + '/';
        }
        if (data.loginName) {
            params.loginName = '/' + data.loginName + '/';
        }
        console.log(params);
        return this
            .find(params)
            .sort({createTime: -1})
            .limit(data.pageSize)
            .skip(skip)
            .exec(cb);
    }
}
;
module.exports = schema;