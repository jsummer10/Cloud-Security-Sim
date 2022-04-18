/**
 * Handles the user routes
 *
 * @file      user.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');

/**
 * Function that adds a new user to the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.add = async function(req, res){
  let userObject = JSON.parse(req.body.user);

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  var sql = "SELECT * FROM users where username='" + userObject.username + "'";
  db.query(sql, function (err, foundUsers) {
    if (err) {
      res.sendStatus(401);
      throw err;
    }
    if (foundUsers.length == 0) {
      sql = "INSERT INTO users (fname, lname, username, password) " + 
        "VALUES ('" + userObject.fname + "','" + userObject.lname + "','" + 
        userObject.username + "','" + userObject.password + "')";
      db.query(sql, function (err, result) {
        if (err) {
          res.sendStatus(401);
          throw err;
        }
        res.sendStatus(201)
      });
    } else {
      res.sendStatus(401);
    }
  });
};

/**
* Function that logs a user in
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.login = function(req, res){
  let userObject = JSON.parse(req.body.user);
  let usr = userObject.username;
  let psw = userObject.password;
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  var sql = "SELECT * FROM users where username='" + usr + "' AND " +
    "password='" + psw + "'";
  db.query(sql, function (err, foundUsers) {
    if (err) throw err;
    if (foundUsers.length == 1) {
      res.status(200).send(foundUsers[0]);
    } else {
      res.sendStatus(401);
    }
  });
};