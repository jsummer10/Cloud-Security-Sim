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

const app = express();

/**
 * Custom modules and routes
 */

const db = require('./db');

const billRoute        = require('./routes/bill');
const budgetRoute      = require('./routes/budget');
const investmentRoute  = require('./routes/investment');
const propertyRoute    = require('./routes/property');
const transactionRoute = require('./routes/transaction');
const userRoute        = require('./routes/user');

/**
 * Express app setup
 */

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
 * Display public_html
 */

app.use('/home.html', userRoute.mainAuth);

/**
 * GET requests
 */

app.get('/testcookies', userRoute.testCookies);
app.get('/get/users/',  userRoute.get);
app.get('/logout/',     userRoute.logout);
app.get('/login/:username/:password', userRoute.login);

app.get('/get/transactions/',       transactionRoute.get);
app.get('/remove/transaction/:id',  transactionRoute.remove);
app.get('/get/bills/',              billRoute.get);
app.get('/remove/bill/:id',         billRoute.remove);
app.get('/get/budgets/',            budgetRoute.get);
app.get('/remove/budget/:id',       budgetRoute.remove);
app.get('/add/investment',          investmentRoute.get);
app.get('/get/investments',         investmentRoute.get);
app.get('/remove/investment/:id',   investmentRoute.remove);
app.get('/get/property/',           propertyRoute.get);
app.get('/remove/property/:id',     propertyRoute.remove);

/**
 * Handle POST request
 */

app.post('/add/user/',        userRoute.add);
app.post('/add/transaction/', transactionRoute.add);
app.post('/add/bill/',        billRoute.add);
app.post('/add/budget/',      budgetRoute.add);
app.post('/add/investment',   investmentRoute.add);
app.post('/add/property/',    propertyRoute.add);

/**
 * Listen on LOCALHOST:3000
 */

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
