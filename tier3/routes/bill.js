/**
 * Handles the bill routes
 *
 * @file      bill.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');

/**
 * Function that adds a new bill to the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.add = async function(req, res){
  let bill = req.body;

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  sql = "INSERT INTO bill (name, date, description, category, amount, username) " + 
    "VALUES ('" + bill.name + "','" + bill.date + "','" + 
    bill.description + "','" + bill.category + "','" + bill.amount + 
    "','" + bill.username + "')";
  db.query(sql, function (err, result) {
    if (err) {
      res.sendStatus(400);
      throw err;
    }
    res.sendStatus(201)
  });
};

/**
* Function that returns an array of bills
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.get = function(req, res){
  let usr = req.params.username;
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  var sql = "SELECT * FROM bill where username='" + usr + "'";
  db.query(sql, function (err, bills) {
    if (err) {
      res.sendStatus(400);
      throw err;
    }
    res.status(200).send(bills);
  });
};

/**
* Function that removes a bill from the database
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.remove = function(req, res){
  let billId = req.params.billId;
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  var sql = "DELETE FROM bill where id='" + billId + "'";
  db.query(sql, function (err, bills) {
    if (err) {
      res.sendStatus(400);
      throw err;
    }
    res.sendStatus(200);
  });
};