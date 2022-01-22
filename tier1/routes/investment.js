/**
 * Handles the investment routes
 *
 * @file      investment.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const delay = require('delay');

const Investment = require('../models/investment')
const User = require('../models/user')

const SECOND = 1000;
const MINUTE = SECOND * 60;
const DELAY  = SECOND / 50;

/**
 * Function that adds a new investment to the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.add = function(req, res){

  try {
    if (!req.cookies.login.username) {
      res.send('BAD');
      return;
    }
  } catch (except) {
    res.send('BAD');
    return;
  }

  let investmentObject = JSON.parse(req.body.investment);
  User.find({ username: req.cookies.login.username })
    .exec(async function (error, users) {

    if (users.length < 1) {
      res.send('Not logged in');
      return;
    }

    // console.log(users[0]);
    var newInvestment = new Investment({
      type : investmentObject.type,
      name : investmentObject.name,
      buy  : investmentObject.buy,
      cur  : investmentObject.cur,
      gain : investmentObject.gain
    });

    newInvestment.save(function (err) {
      if (err) console.log('An error occurred while saving');
    })

    users[0].investments.push(newInvestment._id);
    users[0].save();
    res.send('Investment created!')
  });
};

/**
 * Function that returns a JSON array of investments
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.get = function(req, res){

  if (!req.cookies.login || !req.cookies.login.username) {
    res.send('BAD');
    return;
  }

  User.find({ username: req.cookies.login.username })
    .exec(async function (error, users) {

    if (users.length < 1) {
      res.send('BAD');
      return;
    }

    var userInvestments = [];
    for (investments of users[0].investments) {
      Investment.find({ '_id': investments })
        .exec(function (error, results) {
          userInvestments.push(results[0]);
        })
    }

    // delay allows data to be sent in time
    await delay(DELAY);
    res.send(userInvestments);
  })
};

/**
 * Function that removes an investment
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.remove = function(req, res){
  Investment.deleteOne({ _id: req.params.id }, function(err) {
    if (!err) { }
    else { console.log('Unable to remove ' + req.params.id); }
  });

  // Remove transaction from users array 
  User.find({ username: req.cookies.login.username })
    .exec(async function (error, users) {

    if (users.length < 1) {
      res.send('BAD');
      return;
    }

    const index = users[0].investments.indexOf(req.params.id);

    if (index > -1) {
      users[0].investments.splice(index, 1);
    }
  
    // Update transaction for user
    User.updateOne({ username: req.cookies.login.username }, 
      { investments: users[0].investments }, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  })
};