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

exports.createTables = function(){
  mainDB.connect(function(err) {
    if (err) throw err;

    // Create users table
    var sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, " + 
      "fname VARCHAR(255), lname VARCHAR(255), username VARCHAR(255), " + 
      "salt VARCHAR(255), hash VARCHAR(255))";
    mainDB.query(sql, function (err, result) {
      if (err) throw err;
    });

    // Create bill table
    sql = "CREATE TABLE IF NOT EXISTS bill (id INT AUTO_INCREMENT PRIMARY KEY, " + 
      "name VARCHAR(255), date VARCHAR(255), description VARCHAR(255), " + 
      "category VARCHAR(255), amount VARCHAR(255), username VARCHAR(255))";
    mainDB.query(sql, function (err, result) {
      if (err) throw err;
    });

    // Create budget table
    sql = "CREATE TABLE IF NOT EXISTS budget (id INT AUTO_INCREMENT PRIMARY KEY, " + 
      "date VARCHAR(255), max VARCHAR(255), category VARCHAR(255), " + 
      "current VARCHAR(255), remaining VARCHAR(255), username VARCHAR(255))";
    mainDB.query(sql, function (err, result) {
      if (err) throw err;
    });

    // Create investment table
    sql = "CREATE TABLE IF NOT EXISTS investment (id INT AUTO_INCREMENT PRIMARY KEY, " + 
      "type VARCHAR(255), name VARCHAR(255), buy VARCHAR(255), " + 
      "current VARCHAR(255), gain VARCHAR(255), username VARCHAR(255))";
    mainDB.query(sql, function (err, result) {
      if (err) throw err;
    });

    // Create property table
    sql = "CREATE TABLE IF NOT EXISTS property (id INT AUTO_INCREMENT PRIMARY KEY, " + 
      "type VARCHAR(255), age VARCHAR(255), buy VARCHAR(255), " + 
      "current VARCHAR(255), gain VARCHAR(255), username VARCHAR(255))";
    mainDB.query(sql, function (err, result) {
      if (err) throw err;
    });

    // Create transaction table
    sql = "CREATE TABLE IF NOT EXISTS transaction (id INT AUTO_INCREMENT PRIMARY KEY, " + 
      "account VARCHAR(255), date VARCHAR(255), description VARCHAR(255), " + 
      "category VARCHAR(255), amount VARCHAR(255), username VARCHAR(255))";
    mainDB.query(sql, function (err, result) {
      if (err) throw err;
    });
  }); 
}