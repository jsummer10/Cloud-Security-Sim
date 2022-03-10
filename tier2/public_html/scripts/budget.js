/**
 * JavaScript for budget.html
 *
 * @file      budget.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const TABLENAME = 'budgetTable';

const column = {
  CATEGORY  : 0,
  DATE      : 1,
  MAX       : 2,
  CURRENT   : 3,
  REMAINING : 4,
  ACTION    : 5,
  HIDDEN    : 6
}

let loggedInUser = localStorage.getItem("user");

// Display table data on load
window.onload = function() {
  if (!loggedInUser) {
    alert('Unable to find user');
    window.location.href = "index.html";
    return;
  }
  displayTable();
};

/**
 * This function deletes a row from the table
 * @param   : btn
 * @return  : None
 */
function deleteRow(btn) {
  var row = btn.parentNode.parentNode;
  var rowId = row.childNodes[column.HIDDEN].innerHTML;

  $.ajax({
    url: '/budget/remove/' + rowId,
    method:'GET',
    statusCode: {
      200: function (response) {
        clearTable(TABLENAME);
        displayTable();
      },
      400: function (response) {
        alert('Unable to remove row');
      }
    }
  });

  row.parentNode.removeChild(row);
}


/**
 * This function displays all budgets
 * @param   : None
 * @return  : None
 */
function displayTable() {
  $.ajax({
    url: '/budget/get/' + loggedInUser,
    method:'GET',
    statusCode: {
      200: function (response) {
        if (response.length == 0 || !Array.isArray(response)) {
          console.log('No budget history found');
          return
        } 

        var table = document.getElementById(TABLENAME);

        for (i in response) {
          i = parseInt(i);
          
          if (!response[i] || response[i] === undefined){
              continue;
          }

          // Insert row after the headers and new data 
          var row = table.insertRow(i+2);

          var cellCat = row.insertCell(column.CATEGORY);
          cellCat.classList.add('catCol');
          cellCat.innerHTML = response[i].category;

          var cellDate = row.insertCell(column.DATE);
          cellDate.classList.add('dateCol');
          cellDate.innerHTML = response[i].date;

          var cellMax  = row.insertCell(column.MAX);
          cellMax.classList.add('maxCol');
          cellMax.innerHTML = response[i].max;

          var cellCur  = row.insertCell(column.CURRENT);
          cellCur.classList.add('curCol');
          cellCur.innerHTML = response[i].current;

          var cellRemain = row.insertCell(column.REMAINING);
          cellRemain.classList.add('remainCol');
          cellRemain.innerHTML = response[i].remaining;

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
          cellId.innerHTML = response[i]._id;
        }
      },
      400: function (response) {
        alert('Unable to get budgets');
      }
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

  //---------------------
  // Update the database
  //---------------------

  let budget = { 
      category   : category, 
      date       : date,     
      max        : max,      
      current    : current,  
      remaining  : remaining,
      username   : loggedInUser    
  };

  $.ajax({
    url: '/budget/add/',
    data: budget,
    method:'POST',
    statusCode: {
      201: function (response) {
        console.log('Item saved sucessfully');
      },
      400: function (response) {
        alert('Unable to save this budget');
      }
    }
  });

  clearTable(TABLENAME);
  displayTable();
}