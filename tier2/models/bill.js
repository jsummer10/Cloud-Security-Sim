/**
 * This file configures the bill schema for MongoDB
 *
 * @file      bill.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const db = require("../db");

var BillsSchema = new db.Schema({
    name     : String,
    date     : String,
    desc     : String,
    category : String,
    amount   : Number
});
var Bill = db.model('Bill', BillsSchema);

module.exports = Bill; 