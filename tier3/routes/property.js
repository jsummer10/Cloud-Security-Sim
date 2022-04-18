/**
 * Handles the property routes
 *
 * @file      property.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');

/**
 * Function that adds a new property to the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.add = async function(req, res){
  let prop = req.body;

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("INSERT INTO property (type, age, buy, current, gain, username) " + 
           "VALUES (?, ?, ?, ?, ?, ?)", 
    [
      prop.type,
      prop.age,
      prop.buy,
      prop.current,
      prop.gain,
      prop.username
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
* Function that returns an array of properties
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

  db.query("SELECT * FROM property WHERE username=?",
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
* Function that removes a property from the database
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.remove = function(req, res){
  let propId = req.params.propId;
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("DELETE FROM property where id=?",
    [
      propId
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