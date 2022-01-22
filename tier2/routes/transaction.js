/**
 * Handles the transaction routes
 *
 * @file      transaction.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const delay = require('delay');

const Transaction = require('../models/transaction')
const User = require('../models/user')

const SECOND = 1000;
const MINUTE = SECOND * 60;
const DELAY  = SECOND / 50;

/**
 * Function that adds a new transaction to the database
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

  let transactionObject = JSON.parse(req.body.transaction);
  // console.log(req.cookies);
  User.find({ username: req.cookies.login.username })
    .exec(async function (error, users) {
    if (users.length < 1) {
      res.send('Not logged in');
      return;
    }

    var newTransaction = new Transaction({
      account: transactionObject.account,
      date: transactionObject.date,
      desc: transactionObject.desc,
      category: transactionObject.category,
      amount: transactionObject.amount
    });

    newTransaction.save(function (err) {
      if (err) console.log('An error occurred while saving');
    })

    users[0].transactions.push(newTransaction._id);
    users[0].save();
    res.send('Transaction created!')
  });
};

/**
 * Function that returns a JSON array of transactions
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
      var userTransactions = [];
      for (transactions of users[0].transactions) {
        Transaction.find({ '_id': transactions })
          .exec(function (error, results) {
            userTransactions.push(results[0]);
          })
      }

    // delay allows data to be sent in time
    await delay(DELAY);
    res.send(userTransactions);
  })
};

/**
 * Function that removes a transaction
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.remove = function(req, res){
  Transaction.deleteOne({ _id: req.params.id }, function(err) {
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

    const index = users[0].transactions.indexOf(req.params.id);

    if (index > -1) {
      users[0].transactions.splice(index, 1);
    }
    
    // Update transaction for user
    User.updateOne({ username: req.cookies.login.username }, 
      { transactions: users[0].transactions }, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  })
};