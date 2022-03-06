/**
 * Handles the user routes
 *
 * @file      user.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const crypto = require('crypto');

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
        userObject.username + "',' + userObject.password')";
      db.query(sql, function (err, result) {
        if (err) throw err;
        res.sendStatus(201)
      });
    } else {
      res.sendStatus(401);
    }
  });
};
  

//   User.find({ username: userObject.username }).exec(function (error, results) {
//     if (results.length == 0) {
//       let password = userObject.password;
// 
//       // salting & hashing
//       var salt = crypto.randomBytes(64).toString('base64');
//       crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
//         if (err) throw err;
//         let hStr = hash.toString('base64');
// 
//         // save new account
//         var userData = new User({
//           fname: userObject.fname,
//           lname: userObject.lname,
//           username: userObject.username,
//           password: userObject.password,
//           salt: salt,
//           hash: hStr
//         });
//         userData.save(function (err) { if (err) console.log('an error occurred'); });
//         res.send('Account created!');
//       });
//     }
//     else {
//       res.send('Username already taken.');
//     }
//   });

///**
// * Function that returns a JSON list of users
// * @param    {Object} req    post request
// * @param    {Object} res    post response
// * @return   None
// */
//exports.get = function(req, res){
//  var users = mongoose.model('User', UserSchema);
//  users.find({})
//    .exec(function (error, results) {
//        res.send(results);
//    });
//};
//
///**
// * Function that logs a user in
// * @param    {Object} req    post request
// * @param    {Object} res    post response
// * @return   None
// */
//exports.login = function(req, res){
//  let u = req.params.username;
//  let p = req.params.password;
//  User.find({ username: u }).exec(function (error, results) {
//    if (results.length == 1) {
//      let password = req.params.password;
//      var salt = results[0].salt;
//      crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
//        if (err) {
//          throw err;
//        }
//        let hStr = hash.toString('base64');
//        if (results[0].hash == hStr) {
//          let sessionKey = Math.floor(Math.random() * 1000);
//          sessionKeys[u] = [sessionKey, Date.now()];
//          res.cookie("login", { username: u, key: sessionKey }, { maxAge: MINUTE * 20 });
//          res.send('OK');
//        }
//        else {
//          res.send('BAD');
//        }
//      });
//    }
//    else {
//      res.send('BAD');
//    }
//  });
//};
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
