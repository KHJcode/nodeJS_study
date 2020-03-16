var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'nodejs',
    password: 'rlagudwls12',
    database: 'nodejs_mysql'
  });
  db.connect();
  module.exports = db;