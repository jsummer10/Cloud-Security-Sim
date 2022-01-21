/***************************************************************
 * 
 * Project     : PennyWise
 * 
 * File name   : index.js
 * 
 * Authors     : Diego Moscoso & Jacob Summerville
 * 
 * Description : This script contains JavaScript for index.html
 * 
 ***************************************************************/

/**********************************************************
 * Name     : verifyUser
 * Purpose  : This function verifies a user's credentials
 * 
 * @param   : None
 * @return  : None
 **********************************************************/
function verifyUser() {
    // window.location.href = "home.html";

    var httpRequest = new XMLHttpRequest();
    
    let u = document.getElementById('usernameInput').value;
    let p = document.getElementById('passwordInput').value;

    if (u == '') {
        alert('Enter a username');
        return;
    }

    if (p == '') {
        alert('Enter a password');
        return;
    }

    // console.log(u + ' ' + p);    // uncomment when testing
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (httpRequest.responseText == 'BAD') {
                    alert('Issue logging in with that info');
                } 
                else {
                    let url = '/home.html';
                    console.log(url);
                    window.location = url;
                }
                console.log('#' + httpRequest.responseText + '#') ;       
            } 
            else { 
                alert('ERROR'); 
            }
        }
    }
  
    httpRequest.open('GET', '/login/' + u + '/' + p, true);
    httpRequest.send();
}

function showPassword() {
    var passInput = document.getElementById('passwordInput');
    if (passInput.type === 'password') {
        passInput.type = 'text';
    } else {
        passInput.type = 'password';
    }
}
