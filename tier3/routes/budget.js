/**
 * Handles the budget routes
 *
 * @file      budget.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');

/**
 * Function that adds a new budget to the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.add = async function(req, res){
  let budget = req.body;

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("INSERT INTO budget (date, max, category, current, remaining, username) " + 
           "VALUES (?, ?, ?, ?, ?, ?)", 
    [
      budget.date,
      budget.max,
      budget.category,
      budget.current,
      budget.remaining,
      budget.username
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
* Function that returns an array of budgets
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

  db.query("SELECT * FROM budget WHERE username=?",
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
* Function that removes a budget from the database
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.remove = function(req, res){
  let budgetId = req.params.budgetId;
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("DELETE FROM budget where id=?",
    [
      budgetId
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