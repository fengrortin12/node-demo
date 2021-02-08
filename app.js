/**
 * Created by fuqiang on 2017/7/19.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//引入lodash模块
var _ = require('lodash');
//引入md5加密模块
var md5 = require('md5');
var userInfo = require('./userInfo/model');
var port = process.env.PORT || 4000;
var api = '/api';
var app = express();
//用于格式化post请求传过来的参数
app.use(bodyParser.json());
//创建数据库连接
mongoose.connect('mongodb://localhost:27017/myTest', {useMongoClient: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
    console.log('连接成功！');
});


/*
*
* Node接口定义
*
* */


//登录
app.post(api + '/weblogin', function (req, res) {
    var parmas = req.body;
    var pwd = md5(parmas.password);
    userInfo.findBylogin({loginName: parmas.loginName}, function (err, data) {
        if (err) {
            console.log('出错了：' + err);
            return
        }
        if (data == null) {
            var errorObj = new Object();
            errorObj.code = 10001;
            errorObj.msg = '亲，您还没有注册哦！';
            res.statusCode = 202;
            res.send(errorObj)
        } else {
            var successObj = new Object();
            console.log('输入密码：' + pwd + '  <--|-->  ' + '输出密码：' + data.password + '\n');
            if (pwd == data.password) {
                successObj.code = 10000;
                successObj.msg = 'success';
                data.id = data._id;
                successObj.userInfo = _.pick(data, ['id', 'userName', 'ruleName', 'loginName', 'email', 'address', 'ruleCode']);
            } else {
                successObj.code = 10001;
                successObj.msg = '亲，密码写错了！';
                res.statusCode = 202;
            }
            res.send(successObj);
        }
    })
});
//注册
app.post(api + '/saveUser', function (req, res) {
    var parmas = req.body;
    parmas.password = md5(parmas.password);
    //查询是否存在用户
    userInfo.findBylogin({loginName: parmas.loginName}, function (err, data) {
        if (err) {
            console.log(err);
            return
        }
        if (data) {
            var errorObj = new Object();
            errorObj.code = 10001;
            errorObj.msg = '亲，您已经注册过了，不能重复注册哦！';
            res.statusCode = 202;
            res.send(errorObj)
        } else {
            //执行注册方法
            userInfo.create(parmas, function (err, data) {
                if (err) {
                    console.log(err);
                    return
                }
                var result = new Object();
                result.code = 10000;
                result.msg = 'success';
                res.send(result)
            })
        }
    })
});
//用户列表
app.post(api + '/userList', function (req, res) {
    var parmas = req.body;
    userInfo.findCount(function (err, data) {
        if (err) {
            console.log(err);
            return
        }
        parmas.count = data;
        console.log(parmas.count);
        userInfo.limitUserList(parmas, function (err, data) {
            if (err) {
                console.log(err);
                return
            }
            var result = new Object();
            result.content = data;
            result.code = 10000;
            result.msg = 'success';
            res.send(result);
        })
    });

});
app.listen(port);