/**
 * JavaScript for transactions.html
 *
 * @file      transactions.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

let TABLENAME = 'transactionTable';

// Display table data on load
window.onload = function() {
    displayTable();
};

// Enum style objects to handle column values
const column = {
    ACCOUNT  : 0,
    DATE     : 1,
    AMOUNT   : 2,
    CATEGORY : 3,
    DESC     : 4,
    ACTION   : 5,
    HIDDEN   : 6
}

const column_id = {
    ACCOUNT  : 'acctCol',
    DATE     : 'dateCol',
    AMOUNT   : 'amtCol',
    CATEGORY : 'catCol',
    DESC     : 'descCol',
    ACTION   : 'actionCol',
    HIDDEN   : 'hiddenCol'
}

/**
 * This function capitalizes each word in a string
 * @param   : string phrase
 * @return  : capitalized string phrase
 */
function makeTitle(string) {

    var newString = '';
    var capNext = false;

    for (i in string) {
        if (string[i] == ' ') {
            capNext == true;
        }

        if (capNext || i == 0) {
            newString += string[i].toUpperCase();
        } else {
            newString += string[i];
        }
    }

    return newString;
}

/**
 * This function deletes a row from the table
 * @param   : btn
 * @return  : None
 */
function deleteRow(btn) {

    var row = btn.parentNode.parentNode;

    var rowId = row.childNodes[column.HIDDEN].innerHTML;

    $.ajax({
        url:'/transaction/remove/' + rowId,
        method: 'GET',

        success: function() {
            clearTable();
            displayTable();
        },

        error: function() {
            alert('Unable to remove row');
        }
    });

    row.parentNode.removeChild(row);
}

/**
 * Resets the table to default
 * @param   : None
 * @return  : None
 */
function clearTable() {
    var table = document.getElementById(TABLENAME);
    while (table.rows.length > 2) {
        table.deleteRow(2);
    }
}

/**
 * This function displays all transactions
 * @param   : None
 * @return  : None
 */
function displayTable() {

    $.ajax({
        url:'/transaction/get/',
        method: 'GET',

        success: function( result ) {

            if (result == 'BAD') {
                alert('You are no longer signed in! Redirecting to login.'); 
                window.location.href = "index.html";
            }

            if (result.length == 0 || !Array.isArray(result)) {
                console.log('No transaction history found');
                return
            } 

            var table = document.getElementById(TABLENAME);

            for (i = 0; i < result.length; i++) {
                if (!result[i] || result[i] === undefined){
                    continue;
                }

                // Insert row after the headers and new data 
                var row = table.insertRow(i+2);

                var cellAcct = row.insertCell(column.ACCOUNT);
                cellAcct.classList.add(column_id.ACCOUNT);
                cellAcct.innerHTML = result[i].account;

                var cellDate = row.insertCell(column.DATE);
                cellDate.classList.add(column_id.DATE);
                cellDate.innerHTML = result[i].date;

                var cellAmt  = row.insertCell(column.AMOUNT);
                cellAmt.classList.add(column_id.AMOUNT);
                cellAmt.innerHTML = '$' + result[i].amount;

                var cellCat  = row.insertCell(column.CATEGORY);
                cellCat.classList.add(column_id.CATEGORY);
                cellCat.innerHTML = result[i].category;

                var cellDesc = row.insertCell(column.DESC);
                cellDesc.classList.add(column_id.DESC);
                cellDesc.innerHTML = result[i].desc;

                var cellAction = row.insertCell(column.ACTION);
                cellAction.classList.add(column_id.ACTION);
                
                const delBtn = document.createElement("input");
                delBtn.setAttribute("type", "submit");
                delBtn.setAttribute("value", "del");
                delBtn.setAttribute("onclick","deleteRow(this)");
                delBtn.style.fontSize = '14px';
                cellAction.appendChild(delBtn);

                var cellId = row.insertCell(column.HIDDEN);
                cellId.classList.add(column_id.HIDDEN);
                cellId.innerHTML = result[i]._id;
            }
        },

        error: function() {
            console.log('Unable to get user data');
        }
    });
}

/**
 * This function adds a transaction to the database
 * @param   : None
 * @return  : None
 */
function addTransaction() {
    let account  = makeTitle($('#acctInput').val().trim());
    let date     = $('#dateInput').val().trim();
    let amount   = $('#amtInput').val().trim();
    let category = makeTitle($('#catInput').val().trim());
    let desc     = $('#descInput').val().trim();

    if (account == '' || date == '' || amount == '' || 
        category == '' || desc == ''){
        alert('All fields are required');
        return;
    }

    $('#acctInput').val('');
    $('#dateInput').val('');
    $('#amtInput').val('');
    $('#catInput').val('');
    $('#descInput').val('');

    //---------------------
    // Update the database
    //---------------------

    let transaction = { 
        account  : account, 
        date     : date,
        amount   : amount,
        category : makeTitle(category),
        desc     : desc,
    };
    let transaction_str = JSON.stringify(transaction);

    $.ajax({
        url: '/transactions/add/',
        data: { transaction: transaction_str },
        method:'POST',

        success: function(result) {

            if (result == 'BAD') {
                alert('You are no longer signed in! Redirecting to login.'); 
                window.location.href = "index.html";
            }

            console.log('Item sent sucessfully');
        },

        error: function() {
            console.log('Item failed to send');
        }
    });

    clearTable();
    displayTable();
}

/**
 * This function sorts the table rows
 * @param   : column number to be sorted
 * @return  : None
 */
function sortTable(n) {
    var rows, shouldSwitch, switchcount = 0;
    table = document.getElementById(TABLENAME);
    switching = true;

    direction = "ascending";

    while (switching) {
        switching = false;
        rows = table.rows;

        //--------------------------------
        // Iterate through the table rows
        //--------------------------------

        for (i = 2; i < (rows.length - 1); i++) {

            shouldSwitch = false;
        
            curElement = rows[i].getElementsByTagName("TD")[n];
            nextElement = rows[i + 1].getElementsByTagName("TD")[n];
        
            var curCell = '';
            var nextCell = '';

            //----------------------------------------
            // Get current and next cell data by type
            //----------------------------------------

            if (n == column.DATE) {
                curCell = new Date(curElement.innerHTML.toLowerCase());
                nextCell = new Date(nextElement.innerHTML.toLowerCase());
            }
        
            else if (n == column.AMOUNT) {
                curCell = parseFloat(curElement.innerHTML.replace('$', ''));
                nextCell = parseFloat(nextElement.innerHTML.replace('$', ''));
            }

            else if (n == column.CATEGORY || n == column.DESC || 
                     n == column.ACCOUNT) {
                curCell = curElement.innerHTML.toLowerCase();
                nextCell = nextElement.innerHTML.toLowerCase();
            }

            else {
                console.log('Error with row sorting');
                continue;
            }

            //-----------------------------------------
            // Determine if a swap should be performed
            //-----------------------------------------

            if (direction == "ascending") {
                if (curCell > nextCell) {
                    shouldSwitch = true;
                    break;
                }
            } else if (direction == "descending") {
                if (curCell < nextCell) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        //---------------------------------------
        // Perform switch or alternate direction
        //---------------------------------------

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && direction == "ascending") {
                direction = "descending";
                switching = true;
            }
        }
    }
}