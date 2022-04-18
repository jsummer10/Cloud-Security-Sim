/**
 * JavaScript for bills.html
 *
 * @file      transactions.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const TABLENAME = 'billsTable';

const column = {
  ACCOUNT  : 0,
  DATE     : 1,
  AMOUNT   : 2,
  CATEGORY : 3,
  DESC     : 4,
  ACTION   : 5,
  HIDDEN   : 6
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
    url: '/bill/remove/' + rowId,
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
 * This function displays all bills
 * @param   : None
 * @return  : None
 */
function displayTable() {
  $.ajax({
    url: '/bill/get/' + loggedInUser,
    method:'GET',
    statusCode: {
      200: function (response) {
        if (response.length == 0 || !Array.isArray(response)) {
          console.log('No bill history found');
          return
        } 

        var table = document.getElementById(TABLENAME);

        for (i = 0; i < response.length; i++) {
          i = parseInt(i);
          
          if (!response[i] || response[i] === undefined){
              continue;
          }

          // Insert row after the headers and new data 
          var row = table.insertRow(i+2);

          var cellAcct = row.insertCell(column.ACCOUNT);
          cellAcct.classList.add('acctCol');
          cellAcct.innerHTML = response[i].name;

          var cellDate = row.insertCell(column.DATE);
          cellDate.classList.add('dateCol');
          cellDate.innerHTML = response[i].date;

          var cellAmt  = row.insertCell(column.AMOUNT);
          cellAmt.classList.add('amtCol');
          cellAmt.innerHTML = response[i].amount;

          var cellCat  = row.insertCell(column.CATEGORY);
          cellCat.classList.add('catCol');
          cellCat.innerHTML = response[i].category;

          var cellDesc = row.insertCell(column.DESC);
          cellDesc.classList.add('descCol');
          cellDesc.innerHTML = response[i].description;

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
          cellId.innerHTML = response[i].id;
        }
      },
      400: function (response) {
        alert('Unable to get bills');
      }
    }
  });
}

/**
 * This function adds a bill to the database
 * @param   : None
 * @return  : None
 */
function addBill() {
  let name     = makeTitle($('#acctInput').val().trim());
  let date     = $('#dateInput').val().trim();
  let amount   = $('#amtInput').val().trim();
  let category = makeTitle($('#catInput').val().trim());
  let desc     = $('#descInput').val().trim();

  name = safe_check(name);
  date = safe_check(date);
  amount = safe_check(amount);
  category = safe_check(category);
  desc = safe_check(desc);

  if (name == '' || date == '' || amount == '' || 
    category == '' || desc == ''){
    alert('All fields are required');
    return;
  }

  //---------------------
  // Update the database
  //---------------------

  let bill = { 
    name        : name, 
    date        : date,
    amount      : amount,
    category    : makeTitle(category),
    description : desc,
    username    : loggedInUser
  };

  $.ajax({
    url: '/bill/add/',
    data: bill,
    method:'POST',
    statusCode: {
      201: function (response) {
        console.log('Item saved sucessfully');
      },
      400: function (response) {
        alert('Unable to save this bill');
      }
    }
  });

  clearTable(TABLENAME);
  displayTable();
}