/**
 * JavaScript for investments.html
 *
 * @file      investments.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const TABLENAME = 'investmentTable';

const column = {
  TYPE     : 0,
  NAME     : 1,
  BUY      : 2,
  CURRENT  : 3,
  GAIN     : 4,
  ACTION   : 5,
  HIDDEN   : 6
}

// Display table data on load
window.onload = function() {
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
    url:'/investment/remove/' + rowId,
    method: 'GET',
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
 * This function displays all investments
 * @param   : None
 * @return  : None
 */
function displayTable() {

  const loggedInUser = localStorage.getItem("user");
  if (!loggedInUser) {
    alert('Unable to find user');
    return;
  }

  $.ajax({
    url:'/investment/get/' + loggedInUser,
    method: 'GET',
    statusCode: {
      200: function (response) {
        if (response.length == 0 || !Array.isArray(response)) {
          console.log('No investment history found');
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

          var cellName = row.insertCell(column.NAME);
          cellName.classList.add('nameCol');
          cellName.innerHTML = response[i].name;

          var cellBuy  = row.insertCell(column.BUY);
          cellBuy.classList.add('buyCol');
          cellBuy.innerHTML = response[i].buy;

          var cellCur  = row.insertCell(column.CURRENT);
          cellCur.classList.add('curCol');
          cellCur.innerHTML = response[i].current;

          var cellGain = row.insertCell(column.GAIN);
          cellGain.classList.add('gainCol');
          cellGain.innerHTML = response[i].gain;

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
        alert('Unable to get investments');
      }
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

  type = safe_check(type);
  name = safe_check(name);
  buy = safe_check(buy);
  cur = safe_check(cur);
  gain = safe_check(gain);

  if (type == '' || name == '' || buy == '' || 
    cur == '' || gain == ''){
    alert('All fields are required');
    return;
  }

  //---------------------
  // Update the database
  //---------------------

  const loggedInUser = localStorage.getItem("user");
  if (!loggedInUser) {
    alert('Unable to find user');
    return;
  }

  let investment = { 
    type     : type,
    name     : name,
    buy      : buy,
    current  : cur,
    gain     : gain,
    username : loggedInUser
  };

  $.ajax({
    url: '/investment/add/',
    data: investment,
    method:'POST',
    statusCode: {
      201: function (response) {
        console.log('Item saved sucessfully');
      },
      400: function (response) {
        alert('Unable to save this investment');
      }
    }
  });

  clearTable(TABLENAME);
  displayTable();
}