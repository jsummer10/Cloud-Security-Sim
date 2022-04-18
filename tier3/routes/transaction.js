/**
 * Handles the transaction routes
 *
 * @file      transaction.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');

/**
 * Function that adds a new transaction to the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.add = async function(req, res){
  let trans = req.body;

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("INSERT INTO transaction (account, date, description, category, amount, username) " + 
           "VALUES (?, ?, ?, ?, ?, ?)", 
    [
      trans.account,
      trans.date,
      trans.description,
      trans.category,
      trans.amount,
      trans.username
    ], 
    function (err, result) {
      if (err) {
        res.sendStatus(400);
        throw err;
      }
      res.sendStatus(201)
    }
  );
};

/**
* Function that returns an array of transactions
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

  db.query("SELECT * FROM transaction WHERE username=?",
    [
     usr
    ],  
    function (err, result) {
      if (err) {
        res.sendStatus(400);
        throw err;
      }
      res.status(200).send(result);
    }
  );
};

/**
* Function that removes a transaction from the database
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.remove = function(req, res){
  let transId = req.params.transId;
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("DELETE FROM transaction where id=?",
    [
      transId
    ], 
    function (err, result) {
      if (err) {
        res.sendStatus(400);
        throw err;
      }
      res.sendStatus(200);
    }
  );
};