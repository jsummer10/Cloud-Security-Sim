/**
 * JavaScript for the whole website
 *
 * @file      utility.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */


/**
 * Logs out the current user
 * @param   : None
 * @return  : None
 */
function logout(){
  localStorage.clear();
  window.location.href = "index.html";
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
 * Resets the table to default
 * @param   : None
 * @return  : None
 */
function clearTable(tableName) {
  var table = document.getElementById(tableName);
  while (table.rows.length > 2) {
    table.deleteRow(2);
  }
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
        curCell = parseFloat(curElement.innerHTML);
        nextCell = parseFloat(nextElement.innerHTML);
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

      if (direction == "ascending" && curCell > nextCell) {
        shouldSwitch = true;
        break;
      } else if (direction == "descending" && curCell < nextCell) {
        shouldSwitch = true;
        break;
      }
    }

    //---------------------------------------
    // Perform switch or alternate direction
    //---------------------------------------

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
      switching = true;
      switchcount ++;
    } else if (switchcount == 0 && direction == "ascending") {
      direction = "descending";
      switching = true;
    }
  }
}