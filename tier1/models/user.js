/**
 * This file configures the user schema for MongoDB
 *
 * @file      user.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const db = require("../db");

var UserSchema = new db.Schema({
    fname        : String,
    lname        : String,
    username     : String,
    salt         : String,
    hash         : String,
    transactions : [{ type: db.Schema.Types.ObjectId, ref: 'Transaction' }],
    bills        : [{ type: db.Schema.Types.ObjectId, ref: 'Bill' }],
    budget       : [{ type: db.Schema.Types.ObjectId, ref: 'Budget' }],
    investments  : [{ type: db.Schema.Types.ObjectId, ref: 'Investment' }],
    property     : [{ type: db.Schema.Types.ObjectId, ref: 'Property' }]
});
var User = db.model('User', UserSchema);

module.exports = User; 