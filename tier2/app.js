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

app.get('/testcookies',  userRoute.testCookies);
app.get('/get/users/',   userRoute.get);
app.get('/user/logout/', userRoute.logout);

app.get('/transaction/get/',        transactionRoute.get);
app.get('/transaction/remove/:id',  transactionRoute.remove);
app.get('/bill/get/',               billRoute.get);
app.get('/bill/remove/:id',         billRoute.remove);
app.get('/budget/get/',             budgetRoute.get);
app.get('/budget/remove/:id',       budgetRoute.remove);
app.get('/investment/get/',         investmentRoute.get);
app.get('/investment/remove/:id',   investmentRoute.remove);
app.get('/property/get/',           propertyRoute.get);
app.get('/property/remove/:id',     propertyRoute.remove);

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
