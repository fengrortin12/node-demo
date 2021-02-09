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
            // console.log('输入密码：' + pwd + '  <--|-->  ' + '输出密码：' + data.password + '\n');
            if (pwd == data.password) {
                successObj.code = 10000;
                successObj.msg = 'success';
                data.id = data._id;
                successObj.userInfo = _.pick(data, ['id', 'userName', 'ruleName', 'loginName', 'phoneNumber', 'email', 'address', 'ruleCode', 'delFlag', 'createTime', 'updateTime']);
            } else {
                successObj.code = 10001;
                successObj.msg = '亲，密码写错了！';
                res.statusCode = 202;
            }
            res.send(successObj);
        }
    })
});
//注册or编辑
app.post(api + '/saveUser', function (req, res) {
    var parmas = req.body;
    //判断是否是编辑
    if (parmas.id) {
        parmas.updateTime = new Date().toLocaleString();
        userInfo.updateOne({'_id': parmas.id}, {$set: parmas}, function (err, data) {
            if (err) {
                console.log(err);
                return
            }
            var result = new Object();
            result.code = 10000;
            result.msg = 'success';
            res.send(data);
        });
    } else {
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
                parmas.delFlag = 0;
                parmas.ruleCode = 1;
                parmas.ruleName = '普通用户';
                parmas.createTime = new Date().toLocaleString();
                parmas.updateTime = parmas.createTime;
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
    }
});
//用户列表
app.post(api + '/userList', function (req, res) {
    var parmas = req.body;
    userInfo.findCount({delFlag: 0}, function (err, count) {
        if (err) {
            console.log(err);
            return
        }
        parmas.count = count;
        parmas.delFlag = 0;
        userInfo.limitUserList(parmas, function (err, data) {
            if (err) {
                console.log(err);
                return
            }
            if (data && data.length > 0) {
                var content = [];
                for (var i = 0; i < data.length; i++) {
                    data[i].id = data[i]._id;
                    data[i] = _.pick(data[i], ['id', 'userName', 'ruleName', 'ruleCode', 'loginName', 'email', 'address', 'phoneNumber', 'delFlag', 'createTime', 'updateTime']);
                    // if (data[i].delFlag == 0) {
                    content.push(data[i]);
                    // }
                }
            }
            var result = new Object();
            var totalPages = (parmas.count / parmas.pageSize) > 1 ? (parmas.count / parmas.pageSize) : 1;
            result.lists = {
                content: content,
                number: parmas.pageNumber,
                size: parmas.pageSize,
                totalElements: parmas.count,
                totalPages: Math.ceil(totalPages)
            };
            result.code = 10000;
            result.msg = 'success';
            res.send(result);
        })
    });

});
//用户详情
app.get(api + '/userDetail/:id', function (req, res) {
    var id = req.params.id;
    userInfo.findBylogin({'_id': id}, function (err, data) {
        if (err) {
            console.log(err);
            return
        }
        var result = new Object();
        result.code = 10000;
        result.msg = 'success';
        data.id = data._id;
        result.content = _.pick(data, ['id', 'userName', 'ruleName', 'loginName', 'phoneNumber', 'email', 'address', 'ruleCode', 'delFlag', 'createTime', 'updateTime']);
        res.send(result);
    })
});
//用户删除
app.post(api + '/userDel', function (req, res) {
    var id = req.body.id;
    var result = new Object();
    if (id) {
        userInfo.updateOne({'_id': id}, {$set: {'delFlag': 1}}, function (err, data) {
            if (err) {
                console.log(err);
                return
            }
            result.code = 10000;
            result.msg = 'success';
            res.send(data);
        });
    } else {
        result.code = 10001;
        result.msg = '没有id';
        res.send(result);
    }
});

//监听端口
app.listen(port);