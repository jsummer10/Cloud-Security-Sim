/**
 * The main controller for the node.js server
 *
 * @file      server.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

/**
 * Constants
 */

// establish port to listen on 
const PORT = process.env.PORT || 3000;

/**
 * NPM modules
 */

const cookieParser  = require('cookie-parser');
const express       = require('express');
const parser        = require('body-parser');
const path          = require('path');
const rateLimit     = require('express-rate-limit')

const app = express();

/**
 * DB Setup
 */

const db = require('./db');
db.createDatabase();
db.createTables();

/**
 * Custom modules and routes
 */

 
const billRoute        = require('./routes/bill');
const budgetRoute      = require('./routes/budget');
const investmentRoute  = require('./routes/investment');
const propertyRoute    = require('./routes/property');
const transactionRoute = require('./routes/transaction');
const userRoute        = require('./routes/user');

/**
 * Express app setup
 */

// limit the number of requests to mitigate DoS Attacks
const apiRatelimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 200,
  message: 'You have exceeded the 100 requests in 1 hrs limit!', 
  headers: true, 
});

app.use(apiRatelimit);
app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static('public_html'));

// enable cross-origin access
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, \
                                                 Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/**
 * GET requests
 */

app.get('/transaction/get/:username',      transactionRoute.get);
app.get('/transaction/remove/:transId',    transactionRoute.remove);
app.get('/bill/get/:username',             billRoute.get);
app.get('/bill/remove/:billId',            billRoute.remove);
app.get('/budget/get/:username',           budgetRoute.get);
app.get('/budget/remove/:budgetId',        budgetRoute.remove);
app.get('/investment/get/:username',       investmentRoute.get);
app.get('/investment/remove/:investId',    investmentRoute.remove);
app.get('/property/get/:username',         propertyRoute.get);
app.get('/property/remove/:propId',        propertyRoute.remove);

/**
 * POST requests
 */

app.post('/user/login/',      userRoute.login);
app.post('/user/add/',        userRoute.add);
app.post('/transaction/add/', transactionRoute.add);
app.post('/bill/add/',        billRoute.add);
app.post('/budget/add/',      budgetRoute.add);
app.post('/investment/add/',  investmentRoute.add);
app.post('/property/add/',    propertyRoute.add);

/**
 * Listen on LOCALHOST:3000
 */

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
