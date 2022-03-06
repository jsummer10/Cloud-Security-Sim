/**
 * JavaScript for create.html
 *
 * @file      create.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

/**
 * Add new user to the database
 * @param   : None
 * @return  : None
 */
function createUser() {
  let fname     = $('#fname').val().trim();
  let lname     = $('#lname').val().trim();
  let username  = $('#username').val().trim();
  let psw       = $('#psw').val().trim();
  let pswRepeat = $('#psw-repeat').val().trim();

  if (psw != pswRepeat) {
    alert('Password do not match');
    return;
  }

  let user = { 
      fname    : fname,
      lname    : lname,
      username : username,
      password : psw
  };
  let user_str = JSON.stringify(user);

  // add new user
  $.ajax({
    url: '/user/add/',
    data: { user: user_str },
    method:'POST',
    statusCode: {
      201: function (response) {
        alert('Account created');
        window.location.href = "home.html";
      },
      401: function (response) {
        alert('Username Taken');
      }
    }
  });
}