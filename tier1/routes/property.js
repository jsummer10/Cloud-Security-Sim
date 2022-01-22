/**
 * Handles the property routes
 *
 * @file      property.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const delay = require('delay');

const Property = require('../models/property')
const User = require('../models/user')

const SECOND = 1000;
const MINUTE = SECOND * 60;
const DELAY  = SECOND / 50;

/**
 * Function that adds a new property to the database
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

  let propertyObject = JSON.parse(req.body.property);

  User.find({ username: req.cookies.login.username })
    .exec(async function (error, users) {

    if (users.length < 1) {
      res.send('Not logged in');
      return;
    }

    // console.log(users[0]);
    var newProperty = new Property({
      type    : propertyObject.type,
      age     : propertyObject.age,
      buy     : propertyObject.buy,
      current : propertyObject.current,
      change  : propertyObject.change
    });

    newProperty.save(function (err) {
      if (err) console.log('An error occurred while saving');
    })

    users[0].property.push(newProperty._id);
    users[0].save();
    res.send('Property created!')
  });
};

/**
 * Function that returns a JSON array of properties
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

    var userProperties = [];
    for (properties of users[0].property) {
      Property.find({ '_id': properties })
        .exec(function (error, results) {
          userProperties.push(results[0]);
        })
    }

    // delay allows data to be sent in time
    await delay(DELAY);
    res.send(userProperties);
  })
};

/**
 * Function that removes a property
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.remove = function(req, res){
  Property.deleteOne({ _id: req.params.id }, function(err) {
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

    const index = users[0].property.indexOf(req.params.id);

    if (index > -1) {
      users[0].property.splice(index, 1);
    }
  
    // Update transaction for user
    User.updateOne({ username: req.cookies.login.username }, 
      { property: users[0].property }, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  })
};