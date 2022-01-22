/**
 * Handles the bill routes
 *
 * @file      bill.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const delay = require('delay');

const Bill = require('../models/bill')
const User = require('../models/user')

const SECOND = 1000;
const MINUTE = SECOND * 60;
const DELAY  = SECOND / 50;

/**
 * Function that adds a new bill to the database
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

  let billObject = JSON.parse(req.body.bill);
  // console.log(req.cookies);
  User.find({ username: req.cookies.login.username })
    .exec(async function (error, users) {
    if (users.length < 1) {
      res.send('Not logged in');
      return;
    }

    var newBill = new Bill({
      name: billObject.name,
      date: billObject.date,
      desc: billObject.desc,
      category: billObject.category,
      amount: billObject.amount
    });

    newBill.save(function (err) {
      if (err) console.log('An error occurred while saving');
    })

    users[0].bills.push(newBill._id);
    users[0].save();
    res.send('Bill created!')
  });

};

/**
 * Function that returns a JSON array of bills
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
    var userBills = [];
    for (bills of users[0].bills) {
      Bill.find({ '_id': bills })
        .exec(function (error, results) {
          userBills.push(results[0]);
        })
    }

    // delay allows data to be sent in time
    await delay(DELAY);
    res.send(userBills);
  })
};

/**
 * Function that removes a bill
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.remove = function(req, res){
  Bill.deleteOne({ _id: req.params.id }, function(err) {
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

    const index = users[0].bills.indexOf(req.params.id);

    if (index > -1) {
      users[0].bills.splice(index, 1);
    }
    
    // Update transaction for user
    User.updateOne({ username: req.cookies.login.username }, 
      { bills: users[0].bills }, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  })
};