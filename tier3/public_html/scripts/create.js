/**
 * JavaScript for create.html
 *
 * @file      create.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

const passwordRE = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

/**
 * Add new user to the database
 * @param   : None
 * @return  : None
 */
function createUser() {
  var response = grecaptcha.getResponse();
  if(response.length == 0) { 
    alert("Please verify you are humann!"); 
    evt.preventDefault();
    return;
  }

  let fname     = $('#fname').val().trim();
  let lname     = $('#lname').val().trim();
  let username  = $('#username').val().trim();
  let psw       = $('#psw').val().trim();
  let pswRepeat = $('#psw-repeat').val().trim();

  fname = safe_check(fname);
  lname = safe_check(lname);
  username = safe_check(username);
  psw = safe_check(psw);
  pswRepeat = safe_check(pswRepeat);

  if (psw != pswRepeat) {
    alert('Password do not match');
    return;
  }

  if (!passwordRE.test(psw)) {
    alert('Password does not meet criteria');
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