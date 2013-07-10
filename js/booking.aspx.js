var partner_name;
var single_partner;
var sendflag = false;
var currentRequest = null;
var innerselHtml = '';
function PopulateCountry(response) {
    var control = $('#ddlCountry');
    var countries = eval(response.obj);
    var innerHtml = "<option value='0'>" + lang[etransfer_language]["res_global_select"] + "</option>";
    for (var country in countries) {
        innerHtml += '<option country_description="' + countries[country].country_name + '" value="' + countries[country].country_id + '">' + countries[country].country_name + '</option>';
    }
    control.empty().append(innerHtml);
    
}
function PopulatePartnersList(response) {
    if (response.status_code == "+Ok") {
        var partners = eval(response.obj);
        var innerHtml = '';

        $('#searchtop').fadeIn();
        $('#filterpane').fadeIn();
        for (var partner in partners) {
            var xpscore = partners[partner].etransfer_xpscore;
            var xpmax = partners[partner].etransfer_max_xpscore;
            var img = "/img/noresult.jpg";
            var redbadge = "<img src='/img/red_badge.png' style='display:none;'/>";
            var bluebadge = "<img src='/img/blue_badge.png' style='display:none;'/>";
            if (partners[partner].partner_logo != '')
                img = "http://ws.etransfer.it/transferimg/" + partners[partner].partner_logo;
            if (partners[partner].ncc_online_certified != '')
                redbadge = "<img src='/img/red_badge.png' style='display:block;'/>";
            if (partners[partner].smart_ncc_certified != '')
                bluebadge = "<img src='/img/blue_badge.png' style='display:block;'/>";
            var width = (parseInt(partners[partner].etransfer_xpscore) / parseInt(partners[partner].etransfer_max_xpscore.replace(",00", ""))) * 100;
            var xpcontrol = "<span class='outerprogress'><span class='innerprogress' style='width:" + width + "% !important; background:url(/img/xp.png) repeat-x;'><span class='progressval'>" + partners[partner].etransfer_xpscore + "/" + partners[partner].etransfer_max_xpscore.replace(",00", "") + "  xp</span></span></span>";
            /*<span class='label'>" + res_lbl_rating + "</span><span>" + rateimg + "</span><span class='more-link'><a title='" + res_ncc_badge_alt + "'>" + redbadge + "</a></span>*/
            innerHtml += "<div class='listings' id='partner" + partners[partner].partner_id + "'>" +
                "<div class='listhead'><div class='listcheck'><input type='checkbox'  id='checkbox" + partners[partner].partner_id + "' onclick='return setnewquotation(this," + partners[partner].partner_id + ");' class='regular-checkbox searchchkbox' value='" + partners[partner].partner_id + "' /><label for='checkbox" + partners[partner].partner_id + "'></label></div>" +
                "<a href='/partner.html?id=" + partners[partner].partner_id + "' href='#'>" + partners[partner].partner_firstname + "</a><span class='spacing'>" + partners[partner].partner_address + "</span></div><div class='listingsimg'><a href='/partner.html?id=" + partners[partner].partner_id + "' href='#'><img src='" + img + "' alt='' /></a></div>" +
                    "<div class='listaddress'><br/><p><span  class='label'>XP Score:</span><span style='float:left'>" + xpcontrol + "</span></p>" +
                    "<p><span class='label'>" + lang[etransfer_language]["res_lbl_phone"] + "</span><span>" + partners[partner].partner_phone + "</span></p><p><span class='label'>" + lang[etransfer_language]["res_lbl_fax"] + "</span><span>" + partners[partner].partner_fax + "</span> </p><p><span class='label'>" + lang[etransfer_language]["res_lbl_email"] + "</span><span> <a href='mailto:" + partners[partner].partner_email + "'>" + partners[partner].partner_email + "</span></a> </p>" +

                        "<p><span class='label'>" + lang[etransfer_language]["res_lbl_web"] + "</span> <span><a target='_blank' href='http://" + partners[partner].partner_website + "'>" + partners[partner].partner_website + "</a></span></p></div>" +
                        "<div class='listdetails'><span class='more-link'><a title='" + lang[etransfer_language]["res_ncc_badge_alt"] + "'>" + redbadge + "</a></span><span class='more-link'><a title='" + lang[etransfer_language]["res_smart_badge_alt"] + "'>" + bluebadge + "</a></span></div><div class='listdetails'><p><span class='label' style='width:120px'>" + lang[etransfer_language]["res_lbl_service_offered"] + "</span><span>" + partners[partner].partner_seo_title + "<span></p><p>" + partners[partner].partner_seo_description + "<a target='_blank' href='" + partners[partner].partner_url + "'> " + lang[etransfer_language]["res_lbl_lnk_continue"] + "</a></p></div></div>";
        }
        $('.searchpane').fadeOut();
        $('#areapartners').empty().html(innerHtml);
        $('#spinner').html();
        $('#spinner').fadeOut();
    }
    else {
        var innerHtml = "<div class='etransfer-error'><h4>" + lang[etransfer_language]["res_global_session"] + "</h4><p>" + lang[etransfer_language]["res_global_gohome"] + "</p></div>";
        $('.searchpane').fadeOut();
        $('#searchtop').fadeIn();
        $('#areapartners').empty().html(innerHtml);
        $('#spinner').html();
        $('#spinner').fadeOut();
        return;

    }

}
function PopulateAreaCodeList(reponse) {
    PopulateAreaCode(eval(reponse.obj), $('#ddlAreaSource'), $('#hdnSourceArea').val());
    PopulateAreaCode(eval(reponse.obj), $('#ddlAreaDestination'), $('#hdnDestArea').val());

    if ($('#hdnSourceArea').val() != '')
        callWS("get_city_list_JS",
               "language=" + etransfer_language + "&order_by=&nation=&partner_id=&area_id=" + $('#hdnSourceArea').val(),
               "PopulateCityListSource");

    if ($('#hdnDestArea').val() != '')
        callWS("get_city_list_JS",
               "language=" + etransfer_language + "&order_by=&nation=&partner_id=&area_id=" + $('#hdnDestArea').val(),
               "PopulateCityListDestination");


}

function PopulateAreaCode(areas, control, selection) {
    var innerHtml = "<option value='0' area_code=''>" + lang[etransfer_language]["res_ddl_area_code"] + "</option>";

    for (var area in areas) {
        if (selection == areas[area].area_code)
            innerHtml += '<option selected="selected" area_desc="' + areas[area].area_desc + '" area_code="' + areas[area].area_code + '" value="' + areas[area].area_id + '">' + areas[area].area_desc + ' (' + areas[area].area_code + ')</option>';
        else
            innerHtml += '<option area_desc="' + areas[area].area_desc + '" area_code="' + areas[area].area_code + '" value="' + areas[area].area_id + '">' + areas[area].area_desc + ' (' + areas[area].area_code + ')</option>';
    }

    control.empty().append(innerHtml);
}

function PopulateCityListSource(response) {
    var control = $('#ddlCityPartenza');
    var cities = eval(response.obj);
    var innerHtml = "<option value='0'>" + lang[etransfer_language]["res_ddl_city_code"] + "</option>";
    for (var city in cities) {
        if (cities[city].city_description == $('#hdnSourceCity').val())
            innerHtml += '<option selected="selected" area_code="' + cities[city].area_code + '" city_description="' + cities[city].city_description + '" value="' + cities[city].city_id + '">' + cities[city].city_description + '</option>';
        else
            innerHtml += '<option area_code="' + cities[city].area_code + '" city_description="' + cities[city].city_description + '" value="' + cities[city].city_id + '">' + cities[city].city_description + '</option>';
    }
    control.empty().append(innerHtml);
   
    }
function PopulateCityListDestination(response) {
    var control = $('#ddlArrivo');
    var cities = eval(response.obj);
    var innerHtml = "<option value='0'>" + lang[etransfer_language]["res_ddl_city_code"] + "</option>";
    for (var city in cities) {
        if (cities[city].city_description == $('#hdnDestCity').val())
            innerHtml += '<option selected="selected" area_code="' + cities[city].area_code + '" city_description="' + cities[city].city_description + '" value="' + cities[city].city_id + '">' + cities[city].city_description + '</option>';
        else
            innerHtml += '<option area_code="' + cities[city].area_code + '" city_description="' + cities[city].city_description + '" value="' + cities[city].city_id + '">' + cities[city].city_description + '</option>';
    }
    control.empty().append(innerHtml);
    if (currentRequest.service_id_vehicle_type != "") {
        $('#hdnVehicleType').val(currentRequest.service_id_vehicle_type);
        callWS("get_vehicletype_list_JS", "language=" + etransfer_language + "&order_by=&partner_id_or_name=&veicletype_ids=" + currentRequest.service_id_vehicle_type, "SetVehicleText");
    }
    else {
        $('.select span').text("Select");
        $('#hdnVehicleType').val("");
    }
    }

function SetVehicleText(response) {
    if (response.status_code == "+Ok") {
        var vehicles = eval(response.obj);
        for (var onevehicle in vehicles) {
            $('.select span').text(vehicles[onevehicle].vehicletype_descr);
        }

    }
}
function LoadLabels()
{
    $("#txtDate").datepicker({
        showButtonPanel: false,
        showOn: "button",
        buttonImage: "/img/calendar/calendar.gif",
        buttonImageOnly: true,
        dateFormat: 'dd/mm/yy'
    });

    $('#txtTime').timepicker({ 'scrollDefaultNow': true });
    $('.select').click(function () { $('.vehicleDropdown').fadeToggle(); });
    $('.select li').click(function () {
        $('.select span').text($(this).text());
        $('#hdnVehicleType').val($(this).attr("title"));
    });

    $('#ddlAreaSource').change(function () {
        $('#hdnSourceArea').val($('#ddlAreaSource').val());
        //alert($('#ddlAreaSource').find("option:selected").text());
       

        //autocomplete = new google.maps.places.Autocomplete(input, options);
        callWS("get_city_list_JS",
              "language=" + etransfer_language + "&order_by=&nation=&partner_id=&area_id=" + $('#ddlAreaSource').val(),
              "PopulateCityListSource");
    });
    $('#ddlAreaDestination').change(function () {
        $('#hdnDestArea').val($('#ddlAreaDestination').val());
       

        //autocomplete = new google.maps.places.Autocomplete(input, options);
        callWS("get_city_list_JS",
              "language=" + etransfer_language + "&order_by=&nation=&partner_id=&area_id=" + $('#ddlAreaDestination').val(),
              "PopulateCityListDestination");

    });

    $('#br-head').html(lang[etransfer_language]["res_bookjourney_lbl_head"]);
    $('#br-personnel').html(lang[etransfer_language]["res_bookjourney_lbl_customer_type"]);
    $('#br-customer-type').html(lang[etransfer_language]["res_bookjourney_lbl_personnal"]);
    $('#br-surname').html(lang[etransfer_language]["res_global_js_Surname"]);
    $('#br-name').html(lang[etransfer_language]["res_global_lbl_name"]);
    $('#br-address').html(lang[etransfer_language]["res_global_lbl_address"]);
    $('#br-email').html(lang[etransfer_language]["res_global_lbl_email"]);
    $('#br-phone').html(lang[etransfer_language]["res_global_lbl_phone"]);
    $('#br-zip').html(lang[etransfer_language]["res_global_lbl_zip"]);
    $('#br-country').html(lang[etransfer_language]["res_global_lbl_country"]);
    $('#br-service-details').html(lang[etransfer_language]["res_global_lbl_service_details"]);
    $('#br-select-service').html(lang[etransfer_language]["res_bookjourney_lbl_selectservice"]);
    $('#br-air-transfer').html(lang[etransfer_language]["res_global_lbl_airporttransfer"]);
    $('#br-is-air-transfer').html(lang[etransfer_language]["res_bookjourney_lbl_if_airpot_transfer"]);
    $('#br-air-type').html(lang[etransfer_language]["res_global_lbl_air_transfer_type"]);
    $('#br-arrival').html(lang[etransfer_language]["res_bookjourney_ddlitem_arrival"]);
    $('#br-departure').html(lang[etransfer_language]["res_bookjourney_ddlitem_departure"]);
    $('#br-flight-no').html(lang[etransfer_language]["res_global_lbl_flight_number"]);
    $('#br-dep-time').html(lang[etransfer_language]["res_booking_lbl_dep_boarding_time"]);
    $('#br-add-info').html(lang[etransfer_language]["res_global_lbl_add_info"]);
    $('#br-request-mail').html(lang[etransfer_language]["res_bookjourney_lbl_request_mail"]);
    $('#br-wait-msg').html(lang[etransfer_language]["res_bookjourney_lbl_wait_partners"]);
    $('#btnSendBookingRequest').val(lang[etransfer_language]["res_global_btn_send_request"]);
    $('#br-yes').html(lang[etransfer_language]["res_global_yes"]);
    $('#br-no').html(lang[etransfer_language]["res_global_no"]);
    $('#br-company').html(lang[etransfer_language]["res_bookjourney_radioitem_company"]);
    $('#br-indiv').html(lang[etransfer_language]["res_bookjourney_radioitem_individual"]);
    callWS("get_area_list_JS",
          "language=" + etransfer_language + "&order_by=&nation=&partner_id_or_name=",
          "PopulateAreaCodeList");
}
function PopulateServiceType(response) {
    var control = $('#ddlServiceType');
    var servicetypes = eval(response.obj);
    var innerHtml = "<option value='0'>" + lang[etransfer_language]["res_global_select"] + "</option>";
    for (var type in servicetypes) {
        innerHtml += '<option service_description="' + servicetypes[type].servicetype_descr + '" value="' + servicetypes[type].servicetype_id + '">' + servicetypes[type].servicetype_descr + '</option>';
    }
    control.empty().append(innerHtml);
    callWS("get_country_list_JS",
             "language=" + etransfer_language + "&order_by=",
             "PopulateCountry");
}
$(document).ready(function () {
    $('#loadernew').fadeIn();
  
    callWS("get_service_types_list_JS",
          "language=" + etransfer_language + "&order_by=&partner_id_or_name=&servicetype_ids=",
          "PopulateServiceType");
    LoadLabels();
    $('#txtDepTime').timepicker({ 'scrollDefaultNow': true });

    $('#rdAirport_0').click(function () {
        $('#tblAirport').fadeIn();
    });
    $('#rdAirport_1').click(function () {

        $('#tblAirport').fadeOut();

    });
    $('#rbIndvComp_0').click(function () {
        $('#lblSurname').text(lang[etransfer_language]["res_lbl_surname"]);
        $('#lblName').text(lang[etransfer_language]["res_lbl_name"]);
    });
    $('#rbIndvComp_1').click(function () {
        $('#lblSurname').text(lang[etransfer_language]["res_lbl_companyname"]);
        $('#lblName').text(lang[etransfer_language]["res_lbl_companycontact"]);
    });
    loadSelectedPartners();
    
    $('#btnSendBookingRequest').click(function () {
        //if ($('#ddlServiceType').prop("selectedIndex") == 0) {
        //    alert("Please select service type");
        //    $('#ddlServiceType').focus();
        //    return false;
        //}
        
        
        if ($('#ddlAreaSource').prop("selectedIndex") < 1) {
            $('#ddlAreaSource').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_search_msg_pickuparea"]);
            $('#ddlAreaSource').focus();
            return false;
        }
        if ($('#ddlCityPartenza').prop("selectedIndex") < 1) {
            $('#ddlCityPartenza').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_search_msg_pickupcity"]);
            $('#ddlCityPartenza').focus();
            return false;
        }
        if ($('#ddlAreaDestination').prop("selectedIndex") < 1) {
            $('#ddlAreaDestination').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_search_msg_arrival_area"]);
            $('#ddlAreaDestination').focus();
            return false;
        }
        if ($('#ddlArrivo').prop("selectedIndex") < 1) {
            $('#ddlArrivo').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_search_msg_arrival_city"]);
            $('#ddlArrivo').focus();
            return false;
        }
        if ($('#txtDate').val() == '') {
            $('#txtDate').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_search_msg_pickup_date"]);
            $('#txtDate').focus();
            return false;
        }
        if ($('#txtTime').val() == '') {
            $('#txtTime').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_search_msg_pickup_time"]);
            $('#txtTime').focus();
            return false;
        }
        if ($('#hdnVehicleType').val() == '') {
            alert(lang[etransfer_language]["res_search_msg_vehicletype"]);
            return false;
        }
        if ($('#txtSurname').val() == '') {
            $('#txtSurname').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_book_msg_surname"]);
            $('#txtSurname').focus();
            return false;
        }
        if ($('#txtName').val() == '') {
            $('#txtName').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_book_msg_name"]);
            $('#txtName').focus();
            return false;
        }
        if ($('#txtAddress').val() == '') {
            $('#txtAddress').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_book_msg_address"]);
            $('#txtAddress').focus();
            return false;
        }
        if ($('#txtEmail').val() == '') {
            $('#txtEmail').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_book_msg_email"]);
            $('#txtEmail').focus();
            return false;
        }
        if ($('#txtPhone').val() == '') {
            $('#txtPhone').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_book_msg_phone"]);
            $('#txtPhone').focus();
            return false;
        }
        if ($('#ddlCountry').prop("selectedIndex") < 1) {
            $('#ddlCountry').css({ "background-color": "#fdc0c0" })
            alert(lang[etransfer_language]["res_book_msg_country"]);
            $('#ddlCountry').focus();
            return false;
        }
        $('#bookspinner').html('<p><img src="/img/loading_animation.gif"/></p> <p>' + lang[etransfer_language]["res_msg_sending"] + '</p>');
        $('#bookspinner').fadeIn();
        sendflag = true;
        
        sendBookingRequest();

        //sendRemoteRequest();
    });


});
function loadSelectedPartners() {
    innerselHtml = '';
    if (window.localStorage.getItem("PartnerIds") != null && window.localStorage.getItem("PartnerIds") != "") {
        var arr = window.localStorage.getItem("PartnerIds").toString().split('|');
        if (arr.length > 0) {
            for (var item in arr) {
                if (arr[item] != '') {
                    callWS("get_partner_details_JS",
                             "language=" + etransfer_language + "&partner_id_or_name=" + arr[item],
                             "GetSelectedPartner");
                }
            }

        }

    }
    else { $('#selectedPartners').empty().html(); $('#loadernew').fadeOut(); }
}
function closeImage(control, partnerid) {
    $('#loadernew').fadeIn();

    var partnerIds = window.localStorage.getItem("PartnerIds");
    window.localStorage.removeItem("PartnerIds");
    innerselHtml = '';
    if (partnerIds.indexOf(partnerid + "|") != -1) {
        partnerIds = partnerIds.replace(partnerid + "|", "");
    }
    window.localStorage.setItem("PartnerIds", partnerIds);

    loadSelectedPartners();
    $('#loadernew').fadeOut();
}
function GetSelectedPartner(response) {

    if (response.status_code == "+Ok") {
        var partners = eval(response.obj);
        if (partners.length > 0) {
            for (var partner in partners) {
                innerselHtml += "<div class='selpartners'><span class='seltext'>" + partners[partner].partner_firstname.substr(0, 25) + "</span><span><a  onclick='return closeImage(this," + partners[partner].partner_id + ");'><img src='/img/cancel.png'/></a></span></div>";
            }
        }
    }
    if (innerselHtml != '')
        $('#selectedPartners').empty().html(innerselHtml);
    $('#loadernew').fadeOut();
    loadBookingRemoteRequest();
}
function endEtransferSetBookRequest(response) {
    if (response.status_code == "+Ok") {
        callWS("get_current_request_JS",
              "language=" + etransfer_language,
              "endEtransferBookRequest");
    }
    else {
        var innerHtml = "<div class='etransfer-error'><h4>" + lang[etransfer_language]["res_global_session"] + "</h4><p>" + lang[etransfer_language]["res_global_gohome"] + "</p></div>";
        $('.content').empty().html(innerHtml);
        $('#spinner').html();
        $('#spinner').fadeOut();
        return;

    }
   
}
// ----------------     loading content from the server  -------------------------
function SendEtransferBookRequest(response) {
    if (response.status_code == "+Ok") {
        if (partner_name != "undefined" && single_partner == true) {
            $(window).scrollTop(0);
            $("#pnlContent").fadeOut();
            $("#pnlBooking").fadeOut();
            $("#pnlThankyou").fadeIn();
            $('#bookspinner').fadeOut();
            return;
        }
        else {
            $('#bookspinner').fadeOut();
            window.location.href = '/thank-you.html';
        }
    }
    else {
        var innerHtml = "<div class='etransfer-error'><h4>" +lang[etransfer_language]["res_global_session"] + "</h4><p>" + lang[etransfer_language]["res_global_gohome"] + "</p></div>";
        $('.content').empty().html(innerHtml);
        $('#bookspinner').fadeOut();
        return; 
    }
}
function sendBookingRequest() {
    if (window.localStorage.getItem("PartnerIds") == null || window.localStorage.getItem("PartnerIds") == "") {
        alert(lang[etransfer_language]["res_booking_msg_sending"]);
        $('#bookspinner').fadeOut();
        return;
    }
    //alert("Setting remote etransfer request");
   // if (partner_name != "undefined" && single_partner == true) {

        currentRequest.service_dep_areaCode = $('#ddlCityPartenza').find('option:selected').attr("area_code");
        currentRequest.service_dep_city = $('#ddlCityPartenza').find('option:selected').attr("city_description");
        currentRequest.service_dep_address = $('#txtSourceAddress').val();

        currentRequest.service_arr_areaCode = $('#ddlArrivo').find('option:selected').attr("area_code");
        currentRequest.service_arr_city = $('#ddlArrivo').find('option:selected').attr("city_description");
        currentRequest.service_arr_address = $('#txtDestAddress').val();

        currentRequest.service_pax = $('#ddlPassengers').val();
        currentRequest.service_bags = $('#ddlBaggage').val();
        currentRequest.service_dep_date = $('#txtDate').val();
        currentRequest.service_dep_time = $('#txtTime').val();
        currentRequest.service_id_vehicle_type = $('#hdnVehicleType').val();
   // }
    currentRequest.service_transfer_type = $('#ddlServiceType').attr("value");

    if ($('#rbIndvComp_1').attr("checked") == "checked") {
        currentRequest.client_type = "COMPANY";
    } else {
        currentRequest.client_type = "INDIVIDUAL";
    }

    currentRequest.client_name = $('#txtName').val();
    currentRequest.client_surname = $('#txtSurname').val();

    currentRequest.client_address = $('#txtAddress').val();
    // currentRequest.client_areaCode = '';
    //currentRequest.client_city = $('#txtCity').val();
    currentRequest.client_email = $('#txtEmail').val();
    currentRequest.client_phone = $('#txtPhone').val();
    currentRequest.client_zipcode = $('#txtZip').val();
    currentRequest.client_country = $('#ddlCountry').val();
    currentRequest.service_is_airport_transfer = $('#rdAirport input:checked').val();
    currentRequest.service_airport_transfer_type = $('#ddlType').val();
    currentRequest.service_flightno = $('#txtFlightNo').val();
    currentRequest.service_pickuptime = $('#txtDepTime').val();
    currentRequest.service_details = $('#txtAddInfo').val();

    callWS("set_current_request_JS",
          "language="+etransfer_language+"&json_etransfer_request=" + JSON.stringify(currentRequest),
          "endEtransferSetBookRequest");
}


//------------------------------------------------------------------------------
function endEtransferBookRequest(response) {
    //alert("Getting remote etransfer request");
    currentRequest = eval("[" + response.obj + "]")[0];
    $('#hdnSourceCity').val(currentRequest.service_dep_city);
    $('#hdnDestCity').val(currentRequest.service_arr_city);
    $('#hdnSourceArea').val(currentRequest.service_dep_areaCode);
    $('#hdnDestArea').val(currentRequest.service_arr_areaCode);
    

    $('#txtSourceAddress').val(currentRequest.service_dep_address);
    $('#txtDestAddress').val(currentRequest.service_arr_address);
    $('#ddlPassengers').val(currentRequest.service_pax);
    $('#ddlBaggage').val(currentRequest.service_bags);
    $('#txtDate').val(currentRequest.service_dep_date);
    $('#txtTime').val(currentRequest.service_dep_time);
    $('#ddlServiceType').val(currentRequest.service_transfer_type);
    $('#rbIndvComp').val(currentRequest.client_type);
    $('#txtSurname').val(currentRequest.client_surname);
    $('#txtName').val(currentRequest.client_name);
    $('#txtAddress').val(currentRequest.client_address);
    $('#txtEmail').val(currentRequest.client_email);
    $('#txtPhone').val(currentRequest.client_phone);
    $('#txtZip').val(currentRequest.client_zipcode);
    $("#ddlCountry").val(currentRequest.client_country);
    if (currentRequest.service_is_airport_transfer != "") {
        if (currentRequest.service_is_airport_transfer == "Yes") {
            $('#rdAirport').find("input[value='Yes']").attr("checked", "checked");
            $('#tblAirport').fadeIn();
        }
        else {
            $('#rdAirport').find("input[value='No']").attr("checked", "checked");
            $('#tblAirport').fadeOut();
        }
    }
        $('#ddlType').val(currentRequest.service_airport_transfer_type);
    $('#txtFlightNo').val(currentRequest.service_flightno);
    $('#txtDepTime').val(currentRequest.service_pickuptime);
    $('#txtAddInfo').val(currentRequest.service_details);
    if (sendflag == true) {
        callWS("send_current_request_JS",
               "language=" + etransfer_language + "&ids_partner=" + window.localStorage.getItem("PartnerIds"), "SendEtransferBookRequest");
    }

    // calcRoute();

    /* managedRequest.service_details = "";
     managedRequest.client_name = "";
     managedRequest.client_surname = "";*/
    //alert("Service Area:" + currentRequest.service_dep_areaCode);
}
function loadBookingRemoteRequest() {

    callWS("get_current_request_JS", "language=" + etransfer_language, "endEtransferBookRequest");
   
}
