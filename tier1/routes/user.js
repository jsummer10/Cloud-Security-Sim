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
    if (err) throw err;
    if (foundUsers.length == 0) {
      sql = "INSERT INTO users (fname, lname, username, password) " + 
        "VALUES ('" + userObject.fname + "','" + userObject.lname + "','" + 
        userObject.username + "','" + userObject.password + "')";
      db.query(sql, function (err, result) {
        if (err) throw err;
        res.sendStatus(201)
      });
    } else {
      res.sendStatus(401);
    }
  });
};

/**
* Function that returns a JSON list of users
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
// exports.get = function(req, res){
//  var users = mongoose.model('User', UserSchema);
//  users.find({})
//    .exec(function (error, results) {
//        res.send(results);
//    });
// };

/**
* Function that logs a user in
* @param    {Object} req    post request
* @param    {Object} res    post response
* @return   None
*/
exports.login = function(req, res){
 let usr = req.params.username;
 let psw = req.params.password;
 
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
    res.status(201).send(foundUsers[0]);
  } else {
    res.sendStatus(401);
  }
});

};

//
///**
// * Function that logs a user out
// * @param    {Object} req    post request
// * @param    {Object} res    post response
// * @return   None
// */
//exports.logout = function(req, res){
//  try {
//    if (!req.cookies.login.username) {
//      res.send('BAD');
//      return;
//    }
//  } catch (except) {
//    res.send('BAD');
//    return;
//  }
//
//  console.log('Ending session');
//  
//  for (e in sessionKeys) {
//    // console.log(sessionKeys[e][1]);
//    if (sessionKeys[e][0] == req.cookies.login.key) {   // if session keys are > 2 minutes old
//      console.log('Deleting session keys');
//      delete sessionKeys[e];                  // delete session keys
//    }
//  } 
//
//  console.log('Deleting cookies');
//  res.cookie("login", { username: '', key: ''}, { maxAge: 1});
//  res.send('OK');
//};
