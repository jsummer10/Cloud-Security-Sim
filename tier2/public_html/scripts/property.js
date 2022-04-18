/**
 * JavaScript for property.html
 *
 * @file      property.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const TABLENAME = 'propertyTable';

const column = {
  TYPE    : 0,
  AGE     : 1,
  BUY     : 2,
  CURRENT : 3,
  CHANGE  : 4,
  ACTION  : 5,
  HIDDEN  : 6
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
    url: '/property/remove/' + rowId,
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
 * This function displays all properties
 * @param   : None
 * @return  : None
 */
function displayTable() {
  $.ajax({
    url: '/property/get/' + loggedInUser,
    method:'GET',
    statusCode: {
      200: function (response) {

        if (response.length == 0 || !Array.isArray(response)) {
          console.log('No property history found');
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

          var cellType = row.insertCell(column.TYPE);
          cellType.classList.add('typeCol');
          cellType.innerHTML = response[i].type;

          var cellAge = row.insertCell(column.AGE);
          cellAge.classList.add('ageCol');
          cellAge.innerHTML = response[i].age;

          var cellBuy  = row.insertCell(column.BUY);
          cellBuy.classList.add('buyCol');
          cellBuy.innerHTML = response[i].buy;

          var cellCurrent  = row.insertCell(column.CURRENT);
          cellCurrent.classList.add('curCol');
          cellCurrent.innerHTML = response[i].current;

          var cellChange = row.insertCell(column.CHANGE);
          cellChange.classList.add('changeCol');
          cellChange.innerHTML = response[i].gain;

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
        alert('Unable to get bills');
      }
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

  type = safe_check(type);
  age = safe_check(age);
  buy = safe_check(buy);
  current = safe_check(current);
  change = safe_check(change);

  if (type == '' || age == '' || buy == '' || 
    current == '' || change == ''){
    alert('All fields are required');
    return;
  }

  //---------------------
  // Update the database
  //---------------------

  let property = { 
    type     : type,   
    age      : age,    
    buy      : buy,    
    current  : current,
    gain     : change,
    username : loggedInUser
  };

  $.ajax({
    url: '/property/add/',
    data: property,
    method:'POST',
    statusCode: {
      201: function (response) {
        console.log('Item saved sucessfully');
      },
      400: function (response) {
        alert('Unable to save this property');
      }
    }
  });

  clearTable(TABLENAME);
  displayTable();
}