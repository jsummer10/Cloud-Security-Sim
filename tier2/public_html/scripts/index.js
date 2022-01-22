/**
 * JavaScript for index.html
 *
 * @file      index.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

/**
 * This function verifies a user's credentials
 * @param   : None
 * @return  : None
 */
function verifyUser() {
  let username = document.getElementById('usernameInput').value;
  let password = document.getElementById('passwordInput').value;

  if (username == '') {
    alert('Enter a username');
    return;
  }

  if (password == '') {
    alert('Enter a password');
    return;
  }

  let user = { 
    username : username, 
    password : password
  };

  let user_str = JSON.stringify(user);

  $.ajax({
    url:'/user/login/',
    data: { data: user_str },
    method: 'POST',

    success: function() {
      window.location = '/home.html';
    },

    error: function() {
      alert('Unable to login');
    }
  });
}

/**
 * Display entered password
 * @param   : None
 * @return  : None
 */
function showPassword() {
  var passInput = document.getElementById('passwordInput');
  if (passInput.type === 'password') {
    passInput.type = 'text';
  } else {
    passInput.type = 'password';
  }
}
