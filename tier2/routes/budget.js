/**
 * Handles the budget routes
 *
 * @file      budget.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const delay = require('delay');

const Budget = require('../models/budget')
const User = require('../models/user')

const SECOND = 1000;
const MINUTE = SECOND * 60;
const DELAY  = SECOND / 50;

/**
 * Function that adds a new budget to the database
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

  let budgetObject = JSON.parse(req.body.budget);
  User.find({ username: req.cookies.login.username })
    .exec(async function (error, users) {

    if (users.length < 1) {
      res.send('Not logged in');
      return;
    }

    var newBudget = new Budget({
      date        : budgetObject.date,
      max         : budgetObject.max,
      category    : budgetObject.category,
      current     : budgetObject.current,
      remaining   : budgetObject.remaining
    });

    newBudget.save(function (err) {
      if (err) console.log('An error occurred while saving');
    })

    users[0].budget.push(newBudget._id);
    users[0].save();
    res.send('Budget created!')
  });
};

/**
 * Function that returns a JSON array of budgets
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

    var userBudgets = [];
    for (budget of users[0].budget) {
      Budget.find({ '_id': budget })
        .exec(function (error, results) {
          userBudgets.push(results[0]);
        })
    }

    // delay allows data to be sent in time
    await delay(DELAY);
    res.send(userBudgets);
  })
};

/**
 * Function that removes a budget
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.remove = function(req, res){
  Budget.deleteOne({ _id: req.params.id }, function(err) {
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

    const index = users[0].budget.indexOf(req.params.id);

    if (index > -1) {
      users[0].budget.splice(index, 1);
    }
  
    // Update transaction for user
    User.updateOne({ username: req.cookies.login.username }, 
      { budget: users[0].budget }, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  })
};