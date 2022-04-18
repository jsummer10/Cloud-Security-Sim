/**
 * Handles the user routes
 *
 * @file      user.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

var mysql = require('mysql');
const crypto = require('crypto');

const iterations = 1000;

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

  db.query("SELECT * FROM users WHERE username=?",
    [
      userObject.username
    ], 
    function (err, foundUsers) {
      if (err) {
        res.sendStatus(401);
        throw err;
      }
      if (foundUsers.length == 0) {
        var salt = crypto.randomBytes(64).toString('base64');
        crypto.pbkdf2(userObject.password, salt, iterations, 64, 'sha512', (err, hash) => {
          if (err) throw err;
          let hStr = hash.toString('base64');

          db.query("INSERT INTO users (fname, lname, username, salt, hash) " + 
            "VALUES (?, ?, ?, ?, ?)", 
            [
              userObject.fname,
              userObject.lname,
              userObject.username,
              salt,
              hStr,
            ],
            function (err, result) {
              if (err) {
                res.sendStatus(401);
                throw err;
              }
              res.sendStatus(201)
            }
          );
        });
      } else {
        res.sendStatus(401);
      }
    }
  );
};

/**
* Function that logs a user in
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.login = function(req, res){
  let userObject = JSON.parse(req.body.user);
 
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cloudsecurity",
    database: "pennywise"
  });

  db.query("SELECT * FROM users WHERE username=?",
    [
      userObject.username
    ],
    function(err, foundUsers) { 
      if (err) throw err;
      if (foundUsers.length == 1) {
        var salt = foundUsers[0].salt;
        crypto.pbkdf2(userObject.password, salt, iterations, 64, 'sha512', async (err, hash) => {
          if (err) { throw err; }
          let hStr = hash.toString('base64');
          
          if (foundUsers[0].hash == hStr) {
            res.status(200).send(foundUsers[0]);
          } else {
            res.sendStatus(403);
          }
        });
      } else {
        res.sendStatus(401);
      }
    }
  );
};