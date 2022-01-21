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

const express       = require('express');
const mongoose      = require('mongoose');
const crypto        = require('crypto');
const parser        = require('body-parser');
const cookieParser  = require('cookie-parser');
const delay         = require('delay');

const app = express();
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/PennyWise';

const iterations = 1000;

app.use(cookieParser());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

/**
 * Database schema
 */

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    fname        : String,
    lname        : String,
    username     : String,
    salt         : String,
    hash         : String,
    transactions : [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    bills        : [{ type: Schema.Types.ObjectId, ref: 'Bill' }],
    budget       : [{ type: Schema.Types.ObjectId, ref: 'Budget' }],
    investments  : [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
    property     : [{ type: Schema.Types.ObjectId, ref: 'Property' }]
});
var User = mongoose.model('User', UserSchema);

var TransactionSchema = new Schema({
    account  : String,
    date     : String,
    desc     : String,
    category : String,
    amount   : Number
});
var Transaction = mongoose.model('Transaction', TransactionSchema);

var BillsSchema = new Schema({
    name     : String,
    date     : String,
    desc     : String,
    category : String,
    amount   : Number
});
var Bill = mongoose.model('Bill', BillsSchema);

var BudgetSchema = new Schema({
    date      : String,
    max       : Number,
    category  : String,
    current   : Number,
    remaining : Number
});
var Budget = mongoose.model('Budget', BudgetSchema);

var InvestmentsSchema = new Schema({
    type : String,
    name : String,
    buy  : Number,
    cur  : Number,
    gain : Number
});
var Investment = mongoose.model('Investment', InvestmentsSchema);

var PropertySchema = new Schema({
    type    : String,
    age     : String,
    buy     : String,
    current : String,
    change  : String
});
var Property = mongoose.model('Property', PropertySchema);

/**
 * Display public_html
 */

app.use(express.static('public_html'));
app.use('/home.html', authenticate);

/** 
 * Set up mongoose connection
 */

mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Handle GET request
 */

var SECOND = 1000;
var MINUTE = SECOND * 60;
var DELAY  = SECOND / 50;

var sessionKeys = {};

function updateSessions() {
    let now = Date.now();
    for (e in sessionKeys) {
        if (sessionKeys[e][1] < (now - MINUTE * 20)) {   // if session keys are > 2 minutes old
            console.log('Session keys expired, now deleting');
            delete sessionKeys[e];                  // delete session keys
        }
    }
}

setInterval(updateSessions, 2000);  // check for valid keys every 2 seconds

function authenticate(req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
        let u = req.cookies.login.username;
        let key = req.cookies.login.key;
        if (Object.keys(sessionKeys[u]).length > 0 && sessionKeys[u][0] == key) {
            next();
        }
        else {
            res.send('NOT ALLOWED');
        }
    }
    else {
        res.send('NOT ALLOWED');
    }
}

app.get('/testcookies', (req, res) => {
    res.send(req.cookies);
});

/**
 * Handle GET request
 */

// Returns a JSON array containing the information for every 
// user in the database
app.get('/get/users/', (req, res) => {
    var users = mongoose.model('User', UserSchema);
    users.find({})
        .exec(function (error, results) {
            res.send(results);
        });
});

// Returns a JSON array containing every transaction item for the 
// user username
app.get('/get/transactions/', (req, res) => {
    if (!req.cookies.login || !req.cookies.login.username) {
        res.send('BAD');
        return;
    }
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('BAD');
                return;
            }
            var userTransactions = [];
            for (transactions of users[0].transactions) {
                Transaction.find({ '_id': transactions })
                    .exec(function (error, results) {
                        userTransactions.push(results[0]);
                    })
            }
            // delay allows data to be sent in time
            await delay(DELAY);
            res.send(userTransactions);
        })
});

// Gets user's transaction object according to its ID and removes it
app.get('/remove/transaction/:id', (req, res) => {
    Transaction.deleteOne({ _id: req.params.id }, function(err) {
        if (!err) { }
        else { console.log('Unable to remove ' + req.params.id); }
    });

    // Remove transaction from users array 
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {

            if (users.length < 1) {
                res.send('BAD');
                return;
            }

            const index = users[0].transactions.indexOf(req.params.id);

            if (index > -1) {
                users[0].transactions.splice(index, 1);
            }
        
            // Update transaction for user
            User.updateOne({ username: req.cookies.login.username }, 
                { transactions: users[0].transactions }, function(err, result) {
                if (err) {
                  res.send(err);
                } else {
                  res.json(result);
                }
            });
        })
});


// Returns a JSON array containing every bill item for the 
// user username
app.get('/get/bills/', (req, res) => {
    if (!req.cookies.login || !req.cookies.login.username) {
        res.send('BAD');
        return;
    }
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('BAD');
                return;
            }
            var userBills = [];
            for (bills of users[0].bills) {
                Bill.find({ '_id': bills })
                    .exec(function (error, results) {
                        userBills.push(results[0]);
                    })
            }
            // delay allows data to be sent in time
            await delay(DELAY);
            res.send(userBills);
        })
});

// Gets user's bill object according to its ID and removes it
app.get('/remove/bill/:id', (req, res) => {
    Bill.deleteOne({ _id: req.params.id }, function(err) {
        if (!err) { }
        else { console.log('Unable to remove ' + req.params.id); }
    });

    // Remove transaction from users array 
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {

            if (users.length < 1) {
                res.send('BAD');
                return;
            }

            const index = users[0].bills.indexOf(req.params.id);

            if (index > -1) {
                users[0].bills.splice(index, 1);
            }
        
            // Update transaction for user
            User.updateOne({ username: req.cookies.login.username }, 
                { bills: users[0].bills }, function(err, result) {
                if (err) {
                  res.send(err);
                } else {
                  res.json(result);
                }
            });
        })
});


// Returns a JSON array containing every budget item for the 
// user username
app.get('/get/budgets/', (req, res) => {
    if (!req.cookies.login || !req.cookies.login.username) {
        res.send('BAD');
        return;
    }
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('BAD');
                return;
            }
            var userBudgets = [];
            for (budget of users[0].budget) {
                Budget.find({ '_id': budget })
                    .exec(function (error, results) {
                        userBudgets.push(results[0]);
                    })
            }
            // delay allows data to be sent in time
            await delay(DELAY);
            res.send(userBudgets);
        })
});

// Gets user's budget object according to its ID and removes it
app.get('/remove/budget/:id', (req, res) => {
    Budget.deleteOne({ _id: req.params.id }, function(err) {
        if (!err) { }
        else { console.log('Unable to remove ' + req.params.id); }
    });

    // Remove transaction from users array 
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {

            if (users.length < 1) {
                res.send('BAD');
                return;
            }

            const index = users[0].budget.indexOf(req.params.id);

            if (index > -1) {
                users[0].budget.splice(index, 1);
            }
        
            // Update transaction for user
            User.updateOne({ username: req.cookies.login.username }, 
                { budget: users[0].budget }, function(err, result) {
                if (err) {
                  res.send(err);
                } else {
                  res.json(result);
                }
            });
        })
});


// Returns a JSON array containing every investment item for the 
// user username
app.get('/get/investments/', (req, res) => {
    if (!req.cookies.login || !req.cookies.login.username) {
        res.send('BAD');
        return;
    }
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('BAD');
                return;
            }
            var userInvestments = [];
            for (investments of users[0].investments) {
                Investment.find({ '_id': investments })
                    .exec(function (error, results) {
                        userInvestments.push(results[0]);
                    })
            }
            // delay allows data to be sent in time
            await delay(DELAY);
            res.send(userInvestments);
        })
});

// Gets user's budget object according to its ID and removes it
app.get('/remove/investment/:id', (req, res) => {
    Investment.deleteOne({ _id: req.params.id }, function(err) {
        if (!err) { }
        else { console.log('Unable to remove ' + req.params.id); }
    });

    // Remove transaction from users array 
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {

            if (users.length < 1) {
                res.send('BAD');
                return;
            }

            const index = users[0].investments.indexOf(req.params.id);

            if (index > -1) {
                users[0].investments.splice(index, 1);
            }
        
            // Update transaction for user
            User.updateOne({ username: req.cookies.login.username }, 
                { investments: users[0].investments }, function(err, result) {
                if (err) {
                  res.send(err);
                } else {
                  res.json(result);
                }
            });
        })
});


// Returns a JSON array containing every property item for the 
// user username
app.get('/get/property/', (req, res) => {
    if (!req.cookies.login || !req.cookies.login.username) {
        res.send('BAD');
        return;
    }
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('BAD');
                return;
            }
            var userProperties = [];
            for (properties of users[0].property) {
                Property.find({ '_id': properties })
                    .exec(function (error, results) {
                        userProperties.push(results[0]);
                    })
            }
            // delay allows data to be sent in time
            await delay(DELAY);
            res.send(userProperties);
        })
});

// Gets user's property object according to its ID and removes it
app.get('/remove/property/:id', (req, res) => {
    Property.deleteOne({ _id: req.params.id }, function(err) {
        if (!err) { }
        else { console.log('Unable to remove ' + req.params.id); }
    });

    // Remove transaction from users array 
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {

            if (users.length < 1) {
                res.send('BAD');
                return;
            }

            const index = users[0].property.indexOf(req.params.id);

            if (index > -1) {
                users[0].property.splice(index, 1);
            }
        
            // Update transaction for user
            User.updateOne({ username: req.cookies.login.username }, 
                { property: users[0].property }, function(err, result) {
                if (err) {
                  res.send(err);
                } else {
                  res.json(result);
                }
            });
        })
});


// Logs in the user with matching username and password
// user username
app.get('/login/:username/:password', (req, res) => {
    let u = req.params.username;
    let p = req.params.password;
    User.find({ username: u }).exec(function (error, results) {
        if (results.length == 1) {
            let password = req.params.password;
            var salt = results[0].salt;
            crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
                if (err) {
                    throw err;
                }
                let hStr = hash.toString('base64');
                if (results[0].hash == hStr) {
                    let sessionKey = Math.floor(Math.random() * 1000);
                    sessionKeys[u] = [sessionKey, Date.now()];
                    res.cookie("login", { username: u, key: sessionKey }, { maxAge: MINUTE * 20 });
                    res.send('OK');
                }
                else {
                    res.send('BAD');
                }
            });
        }
        else {
            res.send('BAD');
        }
    });
});

app.get('/logout/', (req, res) => {
    try {
        if (!req.cookies.login.username) {
            res.send('BAD');
            return;
        }
    } catch (except) {
        res.send('BAD');
        return;
    }
    console.log('Ending session');
    for (e in sessionKeys) {
        // console.log(sessionKeys[e][1]);
        if (sessionKeys[e][0] == req.cookies.login.key) {   // if session keys are > 2 minutes old
            console.log('Deleting session keys');
            delete sessionKeys[e];                  // delete session keys
        }
    } 
    console.log('Deleting cookies');
    res.cookie("login", { username: '', key: ''}, { maxAge: 1});
    res.send('OK');
})

/**
 * Handle POST request
 */

// Adds a user to the database
app.post('/add/user/', (req, res) => {
    let userObject = JSON.parse(req.body.user);
    User.find({ username: userObject.username }).exec(function (error, results) {
        if (results.length == 0) {
            let password = userObject.password;

            // salting & hashing
            var salt = crypto.randomBytes(64).toString('base64');
            crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
                if (err) throw err;
                let hStr = hash.toString('base64');

                // save new account
                var userData = new User({
                    fname: userObject.fname,
                    lname: userObject.lname,
                    username: userObject.username,
                    password: userObject.password,
                    salt: salt,
                    hash: hStr
                });
                userData.save(function (err) { if (err) console.log('an error occurred'); });
                res.send('Account created!');
            });
        }
        else {
            res.send('Username already taken.');
        }
    });
});

// Adds a transaction to the database
app.post('/add/transaction/', (req, res) => {

    try {
        if (!req.cookies.login.username) {
            res.send('BAD');
            return;
        }
    } catch (except) {
        res.send('BAD');
        return;
    }

    let transactionObject = JSON.parse(req.body.transaction);
    // console.log(req.cookies);
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('Not logged in');
                return;
            }

            var newTransaction = new Transaction({
                account: transactionObject.account,
                date: transactionObject.date,
                desc: transactionObject.desc,
                category: transactionObject.category,
                amount: transactionObject.amount
            });
            newTransaction.save(function (err) {
                if (err) console.log('An error occurred while saving');
            })
            users[0].transactions.push(newTransaction._id);
            users[0].save();
            res.send('Transaction created!')
        });
});

// Adds a bill to the database
app.post('/add/bill/', (req, res) => {

    try {
        if (!req.cookies.login.username) {
            res.send('BAD');
            return;
        }
    } catch (except) {
        res.send('BAD');
        return;
    }

    let billObject = JSON.parse(req.body.bill);
    // console.log(req.cookies);
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('Not logged in');
                return;
            }

            var newBill = new Bill({
                name: billObject.name,
                date: billObject.date,
                desc: billObject.desc,
                category: billObject.category,
                amount: billObject.amount
            });
            newBill.save(function (err) {
                if (err) console.log('An error occurred while saving');
            })
            users[0].bills.push(newBill._id);
            users[0].save();
            res.send('Bill created!')
        });
});

// Adds a budget to the database
app.post('/add/budget/', (req, res) => {

    try {
        if (!req.cookies.login.username) {
            res.send('BAD');
            return;
        }
    } catch (except) {
        res.send('BAD');
        return;
    }

    let budgetObject = JSON.parse(req.body.budget);
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('Not logged in');
                return;
            }

            var newBudget = new Budget({
                date        : budgetObject.date,
                max         : budgetObject.max,
                category    : budgetObject.category,
                current     : budgetObject.current,
                remaining   : budgetObject.remaining
            });
            newBudget.save(function (err) {
                if (err) console.log('An error occurred while saving');
            })
            users[0].budget.push(newBudget._id);
            users[0].save();
            res.send('Budget created!')
        });
});

// Adds an investment to the database
app.post('/add/investment/', (req, res) => {

    try {
        if (!req.cookies.login.username) {
            res.send('BAD');
            return;
        }
    } catch (except) {
        res.send('BAD');
        return;
    }

    let investmentObject = JSON.parse(req.body.investment);
    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('Not logged in');
                return;
            }
            // console.log(users[0]);
            var newInvestment = new Investment({
                type : investmentObject.type,
                name : investmentObject.name,
                buy  : investmentObject.buy,
                cur  : investmentObject.cur,
                gain : investmentObject.gain
            });
            newInvestment.save(function (err) {
                if (err) console.log('An error occurred while saving');
            })
            users[0].investments.push(newInvestment._id);
            users[0].save();
            res.send('Investment created!')
        });
});

// Adds a property to the database
app.post('/add/property/', (req, res) => {

    try {
        if (!req.cookies.login.username) {
            res.send('BAD');
            return;
        }
    } catch (except) {
        res.send('BAD');
        return;
    }

    let propertyObject = JSON.parse(req.body.property);

    User.find({ username: req.cookies.login.username })
        .exec(async function (error, users) {
            if (users.length < 1) {
                res.send('Not logged in');
                return;
            }
            // console.log(users[0]);
            var newProperty = new Property({
                type    : propertyObject.type,
                age     : propertyObject.age,
                buy     : propertyObject.buy,
                current : propertyObject.current,
                change  : propertyObject.change
            });
            newProperty.save(function (err) {
                if (err) console.log('An error occurred while saving');
            })
            users[0].property.push(newProperty._id);
            users[0].save();
            res.send('Property created!')
        });
});

/**
 * Listen on LOCALHOST:3000
 */

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
