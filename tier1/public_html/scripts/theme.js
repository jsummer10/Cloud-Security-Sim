/***************************************************************
 * 
 * Project     : PennyWise
 * 
 * File name   : theme.js
 * 
 * Authors     : Diego Moscoso & Jacob Summerville
 * 
 * Description : This script contains JavaScript for the entire
 *               website
 * 
 ***************************************************************/

function logout(){
    
    $.ajax({
        url: '/logout/',
        method: 'GET',

        success: function() {
            console.log('Logged out');
            changeLocation();
        },
        error: function() {
            alert('Issue logging you out');
        }
    });
}

function changeLocation() {
    window.location.href = "index.html";

}