/**
 * JavaScript for property.html
 *
 * @file      transactions.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

let TABLENAME = 'propertyTable';

// Display table data on load
window.onload = function() {
    displayTable();
};

// Enum style objects to handle column values
const column = {
    TYPE    : 0,
    AGE     : 1,
    BUY     : 2,
    CURRENT : 3,
    CHANGE  : 4,
    ACTION  : 5,
    HIDDEN  : 6
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
        url:'/property/remove/' + rowId,
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
 * This function displays all properties
 * @param   : None
 * @return  : None
 */
function displayTable() {

    $.ajax({
        url:'/property/get/',
        method: 'GET',

        success: function( result ) {

            if (result == 'BAD') {
                alert('You are no longer signed in! Redirecting to login.'); 
                window.location.href = "index.html";
                return;
            }

            if (result.length == 0 || !Array.isArray(result)) {
                console.log('No property history found');
                return
            } 

            var table = document.getElementById("propertyTable");

            for (i in result) {
                i = parseInt(i);
                
                if (!result[i] || result[i] === undefined){
                    continue;
                }

                // Insert row after the headers and new data 
                var row = table.insertRow(i+2);

                var cellType = row.insertCell(column.TYPE);
                cellType.classList.add('typeCol');
                cellType.innerHTML = result[i].type;

                var cellAge = row.insertCell(column.AGE);
                cellAge.classList.add('ageCol');
                cellAge.innerHTML = result[i].age;

                var cellBuy  = row.insertCell(column.BUY);
                cellBuy.classList.add('buyCol');
                cellBuy.innerHTML = result[i].buy;

                var cellCurrent  = row.insertCell(column.CURRENT);
                cellCurrent.classList.add('curCol');
                cellCurrent.innerHTML = result[i].current;

                var cellChange = row.insertCell(column.CHANGE);
                cellChange.classList.add('changeCol');
                cellChange.innerHTML = result[i].change;

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
 * This function adds a property to the database
 * @param   : None
 * @return  : None
 */
function addProperty() {
    let type    = makeTitle($('#typeInput').val().trim());
    let age     = $('#ageInput').val().trim();
    let buy     = $('#buyInput').val().trim();
    let current = $('#curInput').val().trim();
    let change  = $('#changeInput').val().trim();

    if (type == '' || age == '' || buy == '' || 
        current == '' || change == ''){
        alert('All fields are required');
        return;
    }

    $('#typeInput').val('');
    $('#ageInput').val('');
    $('#buyInput').val('');
    $('#curInput').val('');
    $('#changeInput').val('');

    //---------------------
    // Update the database
    //---------------------

    let property = { 
        type    : type,   
        age     : age,    
        buy     : buy,    
        current : current,
        change  : change 
    };

    let property_str = JSON.stringify(property);

    $.ajax({
        url: '/property/add/',
        data: { property: property_str },
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
    table = document.getElementById("propertyTable");
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
        
            if (n == column.BUY || n == column.CURRENT || 
                     n == column.CHANGE) {
                curCell = parseFloat(curElement.innerHTML);
                nextCell = parseFloat(nextElement.innerHTML);
            }

            else if (n == column.TYPE || n == column.AGE || 
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