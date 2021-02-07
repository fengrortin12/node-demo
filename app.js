/**
 * Created by fuqiang on 2017/7/19.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//引入lodash模块
var _ = require('lodash');
var userModel = require('./userList/model');
var userInfo = require('./userInfo/model');
var port = process.env.PORT || 4000;
var api = '/api';
var app = express();
//用于格式化post请求传过来的参数
app.use(bodyParser.json());
//创建数据库连接
mongoose.connect('mongodb://localhost:27017/myTest',{useMongoClient:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
    console.log('连接成功！');
});
//获取user表数据
app.get(api + '/userList', function (req, res) {
    userModel.findList(function (err, data) {
        if (err) {
            console.log('出错了：' + err)
        } else {
            res.send(data);
        }
    })
});
//登录
app.post(api + '/weblogin', function (req, res) {
    var parmas = req.body;
    userInfo.findBylogin(parmas, function (err, data) {
        if (err) {
            console.log('出错了：' + err);
            return
        }
        if (data == null) {
            var obj = new Object();
            obj.code = 10001;
            obj.msg = '用户名或密码不正确！';
            res.statusCode = 202;
            res.send(obj)
        } else {
            var obj = new Object();
            obj.code = 10000;
            obj.msg = 'success';
            data.id = data._id;
            obj.userInfo = _.pick(data,['id','userName','ruleName','loginName','email','address','ruleCode']);
            res.send(obj);
        }
    })
});
app.listen(port);