/**
 * This file configures the transaction schema for MongoDB
 *
 * @file      transaction.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const db = require("../db");

var TransactionSchema = new db.Schema({
    account  : String,
    date     : String,
    desc     : String,
    category : String,
    amount   : Number
});
var Transaction = db.model('Transaction', TransactionSchema);

module.exports = Transaction; 