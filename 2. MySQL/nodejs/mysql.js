var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : 'rlagudwls12',
  database : 'nodejs_mysql'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) {
      console.log(error);
  } 
  console.log(results);
});
 
connection.end();