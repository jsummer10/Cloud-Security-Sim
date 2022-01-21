/**
 * JavaScript for budget.html
 *
 * @file      budget.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

let TABLENAME = 'budgetTable';

// Display table data on load
window.onload = function() {
    displayTable();
};

// Enum style objects to handle column values
const column = {
    CATEGORY  : 0,
    DATE      : 1,
    MAX       : 2,
    CURRENT   : 3,
    REMAINING : 4,
    ACTION    : 5,
    HIDDEN    : 6
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
        url:'/remove/budget/' + rowId,
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
 * This function displays all budgets
 * @param   : None
 * @return  : None
 */
function displayTable() {

    $.ajax({
        url:'/get/budgets/',
        method: 'GET',

        success: function( result ) {

            if (result == 'BAD') {
                alert('You are no longer signed in! Redirecting to login.'); 
                window.location.href = "index.html";
                return;
            }

            if (result.length == 0 || !Array.isArray(result)) {
                console.log('No budget history found');
                return
            } 

            var table = document.getElementById(TABLENAME);

            for (i in result) {
                i = parseInt(i);
                
                if (!result[i] || result[i] === undefined){
                    continue;
                }

                // Insert row after the headers and new data 
                var row = table.insertRow(i+2);

                var cellCat = row.insertCell(column.CATEGORY);
                cellCat.classList.add('catCol');
                cellCat.innerHTML = result[i].category;

                var cellDate = row.insertCell(column.DATE);
                cellDate.classList.add('dateCol');
                cellDate.innerHTML = result[i].date;

                var cellMax  = row.insertCell(column.MAX);
                cellMax.classList.add('maxCol');
                cellMax.innerHTML = result[i].max;

                var cellCur  = row.insertCell(column.CURRENT);
                cellCur.classList.add('curCol');
                cellCur.innerHTML = result[i].current;

                var cellRemain = row.insertCell(column.REMAINING);
                cellRemain.classList.add('remainCol');
                cellRemain.innerHTML = result[i].remaining;

                var cellAction = row.insertCell(column.ACTION);
                cellAction.classList.add('actionCol');
                
                const delBtn = document.createElement("input");
                delBtn.setAttribute("type", "submit");
                delBtn.setAttribute("value", "del");
                delBtn.setAttribute("onclick","deleteRow(this)");
                delBtn.style.fontSize = '14px';
                cellAction.appendChild(delBtn);

                var cellId = row.insertCell(column.HIDDEN);
                cellId.classList.add('hiddenCol');
                cellId.innerHTML = result[i]._id;
            }
        },

        error: function() {
            console.log('Unable to get user data');
        }
    });
}

/**
 * This function adds a budget to the database
 * @param   : None
 * @return  : None
 */
function addBudget() {
    let category  = makeTitle($('#catInput').val().trim());
    let date      = $('#dateInput').val().trim();
    let max       = $('#maxInput').val().trim();
    let current   = $('#curInput').val().trim();
    let remaining = $('#remainInput').val().trim();

    if (category == '' || date == '' || max == '' || 
        current == '' || remaining == ''){
        alert('All fields are required');
        return;
    }

    $('#catInput').val('');
    $('#dateInput').val('');
    $('#maxInput').val('');
    $('#curInput').val('');
    $('#remainInput').val('');

    //---------------------
    // Update the database
    //---------------------

    let budget = { 
        category   : category, 
        date       : date,     
        max        : max,      
        current    : current,  
        remaining  : remaining    
    };

    let budget_str = JSON.stringify(budget);

    $.ajax({
        url: '/add/budget/',
        data: { budget: budget_str },
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
    table = document.getElementById("budgetTable");
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
        
            else if (n == column.MAX || n == column.CURRENT || n == column.REMAINING) {
                curCell = parseFloat(curElement.innerHTML);
                nextCell = parseFloat(nextElement.innerHTML);
            }

            else if (n == column.CATEGORY) {
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