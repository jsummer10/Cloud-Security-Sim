/**
 * JavaScript for investments.html
 *
 * @file      investments.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

let TABLENAME = 'investmentTable';

// Display table data on load
window.onload = function() {
    displayTable();
};

// Enum style objects to handle column values
const column = {
    TYPE     : 0,
    NAME     : 1,
    BUY      : 2,
    CURRENT  : 3,
    GAIN     : 4,
    ACTION   : 5,
    HIDDEN   : 6
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
        url:'/remove/investment/' + rowId,
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
 * This function displays all investments
 * @param   : None
 * @return  : None
 */
function displayTable() {

    $.ajax({
        url:'/get/investments/',
        method: 'GET',

        success: function( result ) {

            if (result.length == 0 || !Array.isArray(result)) {
                console.log('No investment history found');
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

                var cellType = row.insertCell(column.TYPE);
                cellType.classList.add('typeCol');
                cellType.innerHTML = result[i].type;

                var cellName = row.insertCell(column.NAME);
                cellName.classList.add('nameCol');
                cellName.innerHTML = result[i].name;

                var cellBuy  = row.insertCell(column.BUY);
                cellBuy.classList.add('buyCol');
                cellBuy.innerHTML = result[i].buy;

                var cellCur  = row.insertCell(column.CURRENT);
                cellCur.classList.add('curCol');
                cellCur.innerHTML = result[i].cur;

                var cellGain = row.insertCell(column.GAIN);
                cellGain.classList.add('gainCol');
                cellGain.innerHTML = result[i].gain;

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
 * This function adds a investment to the database
 * @param   : None
 * @return  : None
 */
function addInvestment() {
    let type = makeTitle($('#typeInput').val().trim());
    let name = $('#nameInput').val().trim();
    let buy  = $('#buyInput').val().trim();
    let cur  = $('#curInput').val().trim();
    let gain = $('#gainInput').val().trim();

    if (type == '' || name == '' || buy == '' || 
        cur == '' || gain == ''){
        alert('All fields are required');
        return;
    }

    $('#typeInput').val('');
    $('#nameInput').val('');
    $('#buyInput').val('');
    $('#curInput').val('');
    $('#gainInput').val('');

    //---------------------
    // Update the database
    //---------------------

    let investment = { 
        type : type,
        name : name,
        buy  : buy,
        cur  : cur,
        gain : gain
    };

    let investment_str = JSON.stringify(investment);

    $.ajax({
        url: '/add/investment/',
        data: { investment: investment_str },
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
    table = document.getElementById("investmentTable");
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
        
            if (n == column.BUY || n == column.CURRENT || n == column.GAIN) {
                curCell = parseFloat(curElement.innerHTML);
                nextCell = parseFloat(nextElement.innerHTML);
            }

            else if (n == column.TYPE || n == column.NAME) {
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