/**
 * This file configures the budget schema for MongoDB
 *
 * @file      budget.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const db = require("../db");

var BudgetSchema = new db.Schema({
    date      : String,
    max       : Number,
    category  : String,
    current   : Number,
    remaining : Number
});
var Budget = db.model('Budget', BudgetSchema);

module.exports = Budget; 