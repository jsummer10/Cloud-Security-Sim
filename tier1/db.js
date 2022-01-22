/**
 * This file sets up the schema for MongoDB
 *
 * @file      db.js.
 * @author    Jacob Summerville, Jordan Elliott, Jesus Landin, 
 *            Almunthir Mohammed, Tamillia Thomas
 * @since     12/20/2021
 */

// to use mongoDB
const mongoose = require("mongoose");
const db = mongoose.connection;

// database url
const mongoDBURL = 'mongodb://127.0.0.1/PennyWise';

mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology:true });

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;