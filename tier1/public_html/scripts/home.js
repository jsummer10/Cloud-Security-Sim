/**
 * JavaScript for home.html
 *
 * @file      home.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */
// Display data on load
window.onload = function() {
  displayTransactions();
  displayBills();
  displayInvest();
  displayProperty();
};

/**
 * This function displays transactions
 * @param   : None
 * @return  : None
 */
function displayTransactions() {

  $.ajax({
    url:'/transaction/get/',
    method: 'GET',

    success: function( result ) {
      
      if (result == 'BAD') {
        alert('You are no longer signed in! Redirecting to login.'); 
        window.location.href = "index.html";
        return;
      }

      var table = document.getElementById("acctTable");

      if (result.length == 0 || !Array.isArray(result)) {
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.classList.add('col1');
        cell.innerHTML = 'No accounts found';
        return
      } 

      for (i in result) {
        if (result[i] === undefined){
          continue;
        }

        var row = table.insertRow(i);

        var col1 = row.insertCell(0);
        col1.classList.add('col1');
        col1.innerHTML = result[i].desc;

        var col2 = row.insertCell(1);
        col2.classList.add('col2');
        var category = '-';
        if (result[i].category.toLowerCase() == 'income') {
          category = '+';
        }
        col2.innerHTML = category + '$' + result[i].amount;
      }
    },

    error: function() {
      console.log('Unable to get account data');
    }
  });
}

/**
 * This function displays bills
 * @param   : None
 * @return  : None
 */
function displayBills() {

  const loggedInUser = localStorage.getItem("user");
  if (!loggedInUser) {
    alert('Unable to find user');
    return;
  }

  $.ajax({
    url: '/bill/get/' + loggedInUser,
    method:'GET',
    statusCode: {
      200: function (response) {
        var table = document.getElementById("billsTable");
        if (response.length == 0 || !Array.isArray(response)) {
          var row = table.insertRow(0);
          var cell = row.insertCell(0);
          cell.classList.add('col1');
          cell.innerHTML = 'No bills found';
          return
        } 

        for (i in response) {
          if (response[i] === undefined){
            continue;
          }

          var row = table.insertRow(i);

          var col1 = row.insertCell(0);
          col1.classList.add('col1');
          col1.innerHTML = response[i].name;

          var col2 = row.insertCell(1);
          col2.classList.add('col2');
          col2.innerHTML = '$' + response[i].amount;
        }
      },
      400: function (response) {
        alert('Unable to get bills');
      }
    }
  });
}

/**
 * This function displays investments
 * @param   : None
 * @return  : None
 */
function displayInvest() {

  $.ajax({
    url:'/investment/get/',
    method: 'GET',

    success: function( result ) {
        
      if (result == 'BAD') {
        alert('You are no longer signed in! Redirecting to login.'); 
        window.location.href = "index.html";
        return;
      }

      var table = document.getElementById("investTable");

      if (result.length == 0 || !Array.isArray(result)) {
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.classList.add('col1');
        cell.innerHTML = 'No investments found';
        return
      } 

      for (i in result) {
        if (result[i] === undefined){
          continue;
        }

        var row = table.insertRow(i);

        var col1 = row.insertCell(0);
        col1.classList.add('col1');
        col1.innerHTML = result[i].name;

        var col2 = row.insertCell(1);
        col2.classList.add('col2');
        col2.innerHTML = '$' + result[i].cur;
      }
    },

    error: function() {
        console.log('Unable to get investment data');
    }
  });
}

/**
 * This function displays property
 * @param   : None
 * @return  : None
 */
function displayProperty() {

  $.ajax({
    url:'/property/get/',
    method: 'GET',

    success: function( result ) {
        
      if (result == 'BAD') {
        alert('You are no longer signed in! Redirecting to login.'); 
        window.location.href = "index.html";
        return;
      }
      
      var table = document.getElementById("propTable");

      if (result.length == 0 || !Array.isArray(result)) {
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.classList.add('col1');
        cell.innerHTML = 'No property found';
        return
      } 

      for (i in result) {
        if (result[i] === undefined){
          continue;
        }

        var row = table.insertRow(i);

        var col1 = row.insertCell(0);
        col1.classList.add('col1');
        col1.innerHTML = result[i].type;

        var col2 = row.insertCell(1);
        col2.classList.add('col2');
        col2.innerHTML = '$' + result[i].current;
      }
    },

    error: function() {
      console.log('Unable to get property data');
    }
  });
}