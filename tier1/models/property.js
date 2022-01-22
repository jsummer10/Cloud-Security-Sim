/**
 * This file configures the property schema for MongoDB
 *
 * @file      property.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const db = require("../db");

var PropertySchema = new db.Schema({
    type    : String,
    age     : String,
    buy     : String,
    current : String,
    change  : String
});
var Property = db.model('Property', PropertySchema);

module.exports = Property; 