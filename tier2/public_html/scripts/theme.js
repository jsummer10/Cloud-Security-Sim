/**
 * JavaScript for the whole website
 *
 * @file      transactions.js.
 * @author    Jacob Summerville, Martin Lopez, Diego Moscoso
 * @since     01/21/2022
 */

/**
 * Logs out the current user
 * @param   : None
 * @return  : None
 */
function logout(){
    
    $.ajax({
        url: '/user/logout/',
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

/**
 * Redirect after logout
 * @param   : None
 * @return  : None
 */
function changeLocation() {
    window.location.href = "index.html";

}