/**
 * Handles the investment routes
 *
 * @file      investment.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');

/**
 * Function that adds a new investment to the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.add = async function(req, res){
  let invest = req.body;

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("INSERT INTO investment (type, name, buy, current, gain, username) " + 
           "VALUES (?, ?, ?, ?, ?, ?)", 
    [
      invest.type,
      invest.name,
      invest.buy,
      invest.current,
      invest.gain,
      invest.username
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
* Function that returns an array of investments
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

  db.query("SELECT * FROM investment WHERE username=?",
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
* Function that removes a investment from the database
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.remove = function(req, res){
  let investId = req.params.investId;
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("DELETE FROM investment where id=?",
    [
      investId
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