$(document).ready(function ()
{
    CallLogin("setCookies", null);
});
function LoadHomeLabels() {
    $('#lbHireDriver').html(lang[etransfer_language]["res_home_hiredriver"]);
    $('#lbBookNow').html(lang[etransfer_language]["res_home_booknow"]);
    $('#lbExploreArea').html(lang[etransfer_language]["res_menu_lbl_whereweare"]);
    $('#lblHowworks').html(lang[etransfer_language]["res_menu_lbl_howitworks"]);
    $('#lblContact').html(lang[etransfer_language]["res_menu_lbl_contactus"]);
    $('#lbExit').html(lang[etransfer_language]["res_home_exit"]);
    }
function setCookies(response)
{
    if (response.status_code == "+Ok") {
        window.localStorage.setItem("token",response.obj.substring(4, response.obj.length));
        LoadHomeLabels();
    }
}
