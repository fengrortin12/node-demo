/**
 * Created by fuqiang on 2017/7/19.
 */
var express = require('express');
var mongoose = require('mongoose');
var userModel = require('./model');
var port = process.env.PORT || 4000;
var app = express();

mongoose.connect('mongodb://localhost:27017/myTest');
app.get('/', function (req, res) {
    res.send('hello world');
});
app.get('/userList', function (req, res) {
    userModel.findList(function (err, data) {
        if (err) {
            console.log(err)
        }
        res.send(data.json());
    })
});
app.listen(port);