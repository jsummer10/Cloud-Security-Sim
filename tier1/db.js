/**
 * This file sets up the schema for MongoDB
 *
 * @file      db.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');

const mainDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cloudsecurity",
  database: "pennywise"
});

exports.createDatabase = function(){
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity"
  });

  db.connect(function(err) {
    if (err) throw err;

    // Create database called pennywise
    const sql = "CREATE DATABASE IF NOT EXISTS pennywise";
    db.query(sql, function (err, result) {
      if (err) throw err;
    });
  });
}

exports.createUserTable = function(){
  mainDB.connect(function(err) {
    if (err) throw err;

    // Create users table
    const sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, " + 
      "fname VARCHAR(255), lname VARCHAR(255), username VARCHAR(255), " + 
      "password VARCHAR(255))";
    mainDB.query(sql, function (err, result) {
      if (err) throw err;
    });
  }); 
}

exports.sqlQuery = function(sqlQuery){
  mainDB.query(sqlQuery, function (err, result) {
    if (err) throw err;
    return result;
  });
}