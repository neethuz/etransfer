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
    LoadLabels();
}


function LoadLabels()
{

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
    loadBookingRemoteRequest();

    
    $('#btnSendBookingRequest').click(function () {
        
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
        $('#bookspinner').html('<p><img src="img/loading_animation.gif"/></p> <p>' + lang[etransfer_language]["res_msg_sending"] + '</p>');
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
        if (partnerIds.indexOf(partnerid + "|") != -1) {
            partnerIds = partnerIds.replace(partnerid + "|", "");
        }
        window.localStorage.setItem("PartnerIds", partnerIds);
        $(control).fadeOut();
        //innerselHtml = '';

        //

        //loadSelectedPartners();
        $('#loadernew').fadeOut();
}
function GetSelectedPartner(response) {

    if (response.status_code == "+Ok") {
        var partners = eval(response.obj);
        if (partners.length > 0) {
            for (var partner in partners) {
                innerselHtml += "<div class='selpartners' id='book_partner" + partners[partner].partner_id + "'><span class='seltext'>" + partners[partner].partner_firstname.substr(0, 25) + "</span><span><a  onclick='return closeImage(book_partner" + partners[partner].partner_id + "," + partners[partner].partner_id + ");'><img src='/img/cancel.png'/></a></span></div>";
            }
        }
    }
    if (innerselHtml != '')
        $('#selectedPartners').empty().html(innerselHtml);
    $('#loadernew').fadeOut();
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

    currentRequest.service_dep_areaCode = $('#pickup-areacode').html();
        currentRequest.service_dep_city = $('#pickup-city').html();
        currentRequest.service_dep_address = $('#pickup-addr').html();

        currentRequest.service_arr_areaCode = $('destination-code').html();
        currentRequest.service_arr_city = $('#destination-city').html();
        currentRequest.service_arr_address = $('#destination-addr').html();

        currentRequest.service_pax = $('#passengers').html();
        currentRequest.service_bags = $('#baggages').html();
        currentRequest.service_dep_date = $('#date').html();
        currentRequest.service_dep_time = $('#time').html();
        currentRequest.service_id_vehicle_type = $('#vehicletype').html();
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
    $('#pickup-addr').html(currentRequest.service_dep_address);
    $('#pickup-city').html(currentRequest.service_dep_city);
    $('#pickup-areacode').html(currentRequest.service_dep_areaCode);

    $('#destination-addr').html(currentRequest.service_arr_address);
    $('#destination-city').html(currentRequest.service_arr_city);
    $('#destination-code').html(currentRequest.service_arr_areaCode);
    
    
    $('#passengers').html(currentRequest.service_pax);
    $('#baggages').html(currentRequest.service_bags);
    $('#date').html(currentRequest.service_dep_date);
    $('#time').html(currentRequest.service_dep_time);
    
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
    if (currentRequest.service_id_vehicle_type != "") {
        $('#hdnVehicleType').val(currentRequest.service_id_vehicle_type);
        callWS("get_vehicletype_list_JS", "language=" + etransfer_language + "&order_by=&partner_id_or_name=&veicletype_ids=" + currentRequest.service_id_vehicle_type, "SetVehicleText");
    }
    else {
        $('.select span').text("Select");
        $('#hdnVehicleType').val("");
    }
    if (sendflag == true) {
        callWS("send_current_request_JS",
               "language=" + etransfer_language + "&ids_partner=" + window.localStorage.getItem("PartnerIds"), "SendEtransferBookRequest");
    }
    loadSelectedPartners();


    // calcRoute();

    /* managedRequest.service_details = "";
     managedRequest.client_name = "";
     managedRequest.client_surname = "";*/
    //alert("Service Area:" + currentRequest.service_dep_areaCode);
}
function SetVehicleText(response) {
    if (response.status_code == "+Ok") {
        var vehicles = eval(response.obj);
        for (var onevehicle in vehicles) {
            $('#vehicletype').html(vehicles[onevehicle].vehicletype_descr);
        }

    }
}
function loadBookingRemoteRequest() {

    callWS("get_current_request_JS", "language=" + etransfer_language, "endEtransferBookRequest");
   
}
