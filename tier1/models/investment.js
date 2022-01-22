/**
 * This file configures the user schema for MongoDB
 *
 * @file      user.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const db = require("../db");

var InvestmentsSchema = new db.Schema({
    type : String,
    name : String,
    buy  : Number,
    cur  : Number,
    gain : Number
});
var Investment = db.model('Investment', InvestmentsSchema);

module.exports = Investment; 