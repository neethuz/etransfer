$(document).ready(function ()
{
    CallLogin("setCookies", null);
});
function LoadHomeLabels() {
    $('#lbHireDriver').html(lang[etransfer_language]["res_home_hiredriver"]);
    $('#lbBookNow').html(lang[etransfer_language]["res_home_booknow"]);
    $('#lbExploreArea').html(lang[etransfer_language]["res_home_explore_area"]);
    $('#lbViewPartners').html(lang[etransfer_language]["res_home_view_partners"]);
    $('#lbExit').html(lang[etransfer_language]["res_home_exit"]);
    }
function setCookies(response)
{
    if (response.status_code == "+Ok") {
        $.cookie("token", response.obj.substring(4, response.obj.length),2000);
        LoadHomeLabels();
    }
}
