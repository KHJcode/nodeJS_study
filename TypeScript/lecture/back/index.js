"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var prod = process.env.NODE_ENV === 'production';
app.set('port', prod ? process.env.PORT : 3060);
app.get('/', function (req, res, next) {
    res.send('Hello, Nodejs TypeScript!');
});
app.listen(app.get('port'), function () {
    console.log("Server is running on " + app.get('port') + "!");
});
