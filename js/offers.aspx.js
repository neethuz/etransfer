var currentRequest = null;
var map;
var innerContent = "";
var pendingPartners = "";
var price = '';
var paymentnote = '';
var offernote = '';


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}
$(document).ready(function () {
    innertContent="";
        CallLogin("setCookies", null);
   
});
function setCookies(response) {
    if (response.status_code == "+Ok") {
        $.cookie("token", response.obj.substring(4, response.obj.length), 2000);
    }
}
function setPartnerOffer() {
    // var hash = encodeURIComponent("EybQOocGyexHA7h4jVZdyMLgN2Vp+yrbVZ0tOTMnF0ao9J0TOJoI71CgcfzBr0NsCg4R4C193iv92w+oriPzWdRZeypScXJjXH0qC8o9aDI=");
    var hash = encodeURIComponent(getParameterByName('hash'));
    //var hash = getParameterByName('hash').replace(/=/g, '%3D');
    
    //currentRequest[1].offer_id_partner = '';
    currentRequest[1].offer_price = $('#txtPrice').val();
    currentRequest[1].offer_client_note = $('#lblRemarks').html();
    currentRequest[1].offer_partner_note = $('#txtOfferNotes').val();
    currentRequest[1].offer_payment_note = $('#hdnPayment').val().substr(0,$('#hdnPayment').val().length-1);
    var param = encodeURIComponent(JSON.stringify(currentRequest[1]));
    callWS("set_offer_by_hash_JS",
    "language=" + etransfer_language + "&hash=" + hash + "&json_etransfer_offer=" + JSON.stringify(currentRequest[1]),
        "setOfferbyHash");
}
function setOfferbyHash(response) {
    if (response.obj == "+Ok") {
        $('#loadernew').fadeOut();
        if (getParameterByName('custom_style') == "true") {
            $('.partnerdetails').fadeOut();
            $('#pnlThankyou').fadeIn();
        }
        else
            window.location.href = '/thank-you.aspx';

    }
    else {
        $('#lblMsg').html(lang[etransfer_language]["res_msg_offer_unable"]);
        $('#loadernew').fadeOut();
    }
}

function loadOfferlist(response) {
    if (response.status_code == "+Ok") {
        innerContent = "";
        var offerlists = eval("[" + response.obj + "]")[0];
        if (offerlists[1].length == 0)
            $('#loadernew').fadeOut();
        for (var offerlist in offerlists[1]) {
            
            var cbObject = {
                offer_price: offerlists[1][offerlist].offer_price,
                offer_partner_note: offerlists[1][offerlist].offer_partner_note,
                offer_payment_note: offerlists[1][offerlist].offer_payment_note,
                offer_id: offerlists[1][offerlist].offer_id,
                offer_status: offerlists[1][offerlist].offer_status
            }

            callWS("get_partner_details_JS",
                    "language="+ etransfer_language+"&partner_id_or_name=" + offerlists[1][offerlist].offer_id_partner,
                    "PopulateOfferLists", cbObject);

        }
    } else alert(response.status_message);
}
function LoadPendingOffers(response) {
    if (response.status_code == "+Ok") {
        pendingPartners = "";
        var offerlists = eval("[" + response.obj + "]")[0];
        $('#lblFrom').html(offerlists[0].service_dep_city);
        $('#hdnCityFrom').val(offerlists[0].service_dep_city);
        //SetSourceCityName();
        $('#lblTo').html(offerlists[0].service_arr_city);
        $('#hdnCityTo').val(offerlists[0].service_arr_city);
        //SetDestCityName();

        $('#lblFromArea').html(offerlists[0].service_dep_areaCode);
        //$('#lblTo').html(offerlists[0].service_arr_city);
        $('#lblDestArea').html(offerlists[0].service_arr_areaCode);
        $('#lblDepDate').html(offerlists[0].service_dep_date.substr(0, 10));
        $('#lblDepTime').html(offerlists[0].service_dep_time.substr(11, 5));
        $('#lblToAdd').html(offerlists[0].service_dep_address);
        $('#lblFromAdd').html(offerlists[0].service_arr_address);
        $('#lblPassengers').html(offerlists[0].service_pax);
        $('#lblBaggages').html(offerlists[0].service_bags);

       // $('#lblTypeTransfer').html(offerlists[0].service_transfer_type);
        if (offerlists[0].service_is_airport_transfer == 'true')
            $('#lblAirport').html('YES');
        else
            $('#lblAirport').html('NO');

        $('#lblAirportTypeTrans').html(offerlists[0].service_airport_transfer_type);
        $('#lblFlightNo').html(offerlists[0].service_flightno);
        

        if (offerlists[0].client_type == "COMPANY") {
            $("#lblSurnameDescr").text("Company name:");
            $("#lblNameDescr").text("Contact name:");
        };
        $('#lblClientName').html(offerlists[0].client_name);
        $('#lblClientSurName').html(offerlists[0].client_surname);
        $('#lblAddress').html(offerlists[0].client_address);
        $('#lblZip').html(offerlists[0].client_zipcode);
        $('#lblPhone').html(offerlists[0].client_phone);
        $('#lblEmail').html(offerlists[0].client_email);
        $('#lblCustomerType').html(offerlists[0].client_type);
        $('#lblRemarks').html(offerlists[0].service_details);

        $('#txtOfferNotes').val(offerlists[1].offer_partner_note);
        $('#txtPrice').val(offerlists[1].offer_price);
        if (offerlists[0].service_pickuptime.length > 16)
            $('#lblPickTime').html(offerlists[0].service_pickuptime.substr(11, 5));

       // $('#lblVehType').html(offerlists[0].service_id_vehicle_type);
        callWS("get_service_types_list_JS",
             "language=" + etransfer_language + "&order_by=&partner_id_or_name=&servicetype_ids=" + offerlists[0].service_transfer_type,
             "SetServiceType");
        callWS("get_vehicletype_list_JS", "language=" + etransfer_language + "&order_by=&partner_id_or_name=&veicletype_ids=" + offerlists[0].service_id_vehicle_type, "SetVehicleText");
        
        if (offerlists[1].length == 0)
            $('#loadpending').fadeOut();
        LoadLabels();

        for (var offerlist in offerlists[1]) {
            callWS("get_partner_details_JS",
                     "language=" + etransfer_language + "&partner_id_or_name=" + offerlists[1][offerlist].offer_id_partner,
                     "GetPendingPartners");

        }
    }
    else
        alert(response.status_message);
}
function SetServiceType(response) {
    if (response.status_code == "+Ok") {
        var services = eval(response.obj);
        for (var service in services) {
            $('#lblTypeTransfer').html(services[service].servicetype_descr);
        }

    }

}
function SetVehicleText(response) {
    if (response.status_code == "+Ok") {
        var vehicles = eval(response.obj);
        for (var onevehicle in vehicles) {
            $('#lblVehType').html(vehicles[onevehicle].vehicletype_descr);
        }

    }
   
}
function GetPendingPartners(response) {
    var partners = eval(response.obj);
    if (partners.length > 0) {
        for (var partner in partners) {
            var img = "img/noresult.jpg";
            if (partners[partner].partner_logo != '')
                img = "http://ws.etransfer.it/transferimg/" + partners[partner].partner_logo;
            pendingPartners += "<div class='waitingoffers'><img src='" + img + "' /><h3>" + partners[partner].partner_firstname + "</h3></div>";
            $('#pendingpartners').empty().html(pendingPartners);
            $('#loadpending').fadeOut();
        }
    } else {
        innerContent = "<div><div class='etransfer-error'>" + lang[etransfer_language]["res_msg_offer_please"] + "</div></div>";
        $('#pendingpartners').empty().html(innerContent);
    }
}
function LoadLabels()
{

    $('#offer-head').html(lang[etransfer_language]["res_reviewoffer_lbl_offer_head"]);
    $('#waiting-head').html(lang[etransfer_language]["res_reviewoffer_lbl_waiting_head"]);
    $('#service-details').html(lang[etransfer_language]["res_global_lbl_service_details"]);
    $('#pick-up').html(lang[etransfer_language]["res_search_lbl_from"]);
    $('#destination').html(lang[etransfer_language]["res_search_lbl_to"]);
    $('#dep-date').html(lang[etransfer_language]["res_global_lbl_departure_date"]);
    $('#dep-time').html(lang[etransfer_language]["res_global_lbl_departure_time"]);
    $('#n-passengers').html(lang[etransfer_language]["res_search_lbl_passenger"]);
    $('#n-baggage').html(lang[etransfer_language]["res_search_lbl_baggage"]);
    $('#v-type').html(lang[etransfer_language]["res_search_lbl_vehicle"]);
    $('#service-type').html(lang[etransfer_language]["res_global_lbl_service_type"]);
    $('#cust-info').html(lang[etransfer_language]["res_global_lbl_customer_info"]);
    $('#name').html(lang[etransfer_language]["res_global_lbl_name"]);
    $('#surname').html(lang[etransfer_language]["res_global_js_Surname"]);
    $('#customer-type').html(lang[etransfer_language]["res_global_lbl_customer_type"]);
    $('#comp-name').html(lang[etransfer_language]["res_lbl_companyname"]);
    $('#address').html(lang[etransfer_language]["res_global_lbl_address"]);
    $('#email').html(lang[etransfer_language]["res_global_lbl_email"]);
    $('#phone').html(lang[etransfer_language]["res_global_lbl_phone"]);
    $('#zip').html(lang[etransfer_language]["res_global_lbl_zip"]);
    $('#air-transfer').html(lang[etransfer_language]["res_global_lbl_airporttransfer"]);
    $('#type').html(lang[etransfer_language]["res_global_lbl_air_transfer_type"]);
    $('#flight-no').html(lang[etransfer_language]["res_global_lbl_flight_number"]);
    $('#pick-time').html(lang[etransfer_language]["res_booking_lbl_dep_boarding_time"]);
    $('#add-info').html(lang[etransfer_language]["res_global_lbl_add_info"]);

}
function AcceptOfferByID_callBack(response) {
    if (response.status_code == "+Ok") {

        alert("Thank you. We have notified the partner");
        var hash = encodeURIComponent(getParameterByName('hash'));
        callWS("get_offerList_by_hash_JS",
              "language=" + etransfer_language + "&hash=" + hash + "&filters=" + JSON.stringify({ pending: false, accepted: null }, null, 2),
              "loadOfferlist");
    }
    else { alert(response.status_message); }
}

function AcceptOfferByID(s,offer_id) {
    var hash = encodeURIComponent(getParameterByName('hash'));
    //var hash = encodeURIComponent("gyU3Fay9G3HV++TVN0ZpwtfZ4p+m47j7izxLswBCODf0yrs4WRkkrV1XNNn+q0Xsh36Lp1dXg6RE4u6VGzFNwQIp/gIGs8a8237aDmcwfy4=");
    $('#loadernew').fadeIn();

    callWS("accept_offer_by_hash_JS",
           "language=" + etransfer_language + "&hash=" + hash +
           "&offer_id=" + offer_id,
           "AcceptOfferByID_callBack",null);
   // $(s).hide();

   
    

}
function PopulateOfferLists(response) {

    var partners = eval(response.obj);
    eval("var offer = " + response.cbObject);
    var price = offer.offer_price;
    var paymentnote = offer.offer_payment_note;
    var offernote = offer.offer_partner_note;
    var offer_id = offer.offer_id;
    var offer_status = offer.offer_status;

    if (partners.length > 0) {
        for (var partner in partners) {
            var img = "img/noresult.jpg";
            if (partners[partner].partner_logo != '')
                img = "http://ws.etransfer.it/transferimg/" + partners[partner].partner_logo;
            var contacttext = '';
            if (partners[partner].partner_phone != '')
                contacttext += "<p><span><img src='img/phone.png'/></span><span class=label'>" + partners[partner].partner_phone + "</span></p>";
            if (partners[partner].partner_fax != '')
                contacttext += "<p><span><img src='img/fax.png' alt='" + lang[etransfer_language]["res_alt_fax"] + "'/></span><span class=label'>" + partners[partner].partner_fax + "</span></p>";
            if (partners[partner].partner_email != '')
                contacttext += "<p><span><img src='img/email.png' alt='" + lang[etransfer_language]["res_alt_email"] + "'/></span><span class=label'> <a>" + partners[partner].partner_email + "</span></a></p>";

            if (partners[partner].partner_website != '')
                contacttext += "<p><span><img src='img/web.png' alt='" + lang[etransfer_language]["res_alt_web"] + "'/></span> <span class=label'><a>" + partners[partner].partner_website + "</a><span></p>";

            if (offer_status=="ASSIGNED")
            {
                innerContent += "<div class='offers'><div class='offerimg'><img src='" + img + "' /></div>";
                innerContent += "<div class='offerprices'><p>" + lang[etransfer_language]["res_lbl_price"] + "<span class='price'>" + price + " €</span></p>";
                innerContent += "<p class='accepted'><input disabled='disabled' type='button' value='accepted'/></p></div>";
                innerContent += "<div class='offerpartner'><h3><a>" + partners[partner].partner_firstname + "</a></h3>" +
                                contacttext + "<p><span class='labels'>" + lang[etransfer_language]["res_lbl_paymethod"] + "</span> <span>" + paymentnote + "</span></p><p><span class='labels'>" + lang[etransfer_language]["res_lbl_paynote"] + "</span> <span>" + offernote + "</span></p></div></div>";
            }
            else if (offer_status =="REFUSED") {
                innerContent += "<div class='refoffers'><div class='refofferimg'><img src='" + img + "' /></div>";
                innerContent += "<div class='refofferprices'><p>" + lang[etransfer_language]["res_lbl_price"] + "<span class='price'>" + price + " €</span></p>";
                innerContent += "<p class='refused'><input disabled='disabled' type='button' value='refused'/></p></div>";
                innerContent += "<div class='refofferpartner'><h3><a>" + partners[partner].partner_firstname + "</a></h3>" +
                                   contacttext + "<p><span class='labels'>"+ lang[etransfer_language]["res_lbl_paymethod"] +"</span> <span>" + paymentnote + "</span></p><p><span class='labels'>" + lang[etransfer_language]["res_lbl_paynote"] + "</span> <span>" + offernote + "</span></p></div></div>";
                
            }
            else {
                innerContent += "<div class='offers'><div class='offerimg'><img src='" + img + "' /></div>";
                innerContent += "<div class='offerprices'><p>" + lang[etransfer_language]["res_lbl_price"] + "<span class='price'>" + price + " €</span></p>";

                innerContent += "<p><input type='button' id='btn" + offer_id + "' value='Accept' onclick='return AcceptOfferByID(btn" + offer_id + "," + offer_id + ");' /></p></div>";
                innerContent += "<div class='offerpartner'><h3><a>" + partners[partner].partner_firstname + "</a></h3>" +
                                    contacttext + "<p><span class='labels'>"+ lang[etransfer_language]["res_lbl_paymethod"] +"</span> <span>" + paymentnote + "</span></p><p><span class='labels'>" + lang[etransfer_language]["res_lbl_paynote"] + "</span> <span>" + offernote + "</span></p></div></div>";
                
            }   
            $('#partneroffers').empty().html(innerContent);

            $('#loadernew').fadeOut();
        }
    } else {
        innerContent = "<div><div class='etransfer-error'>" + lang[etransfer_language]["res_msg_offer_please"] + "</div></div>";
        $('#partneroffers').empty().html(innerContent);
    }

}

/*
function SetSourceCityName() {
    callWS("get_city_list_JS",
              "language=it&order_by=&nation=&partner_id=&area_id=",
              "GetCitySourceDesc");
}
function GetCitySourceDesc(response) {
    var cities = eval(response.obj);
    for (var city in cities) {
        if (cities[city].city_id == $('#hdnCityFrom').val()) {
            $('#lblFrom').html(cities[city].city_description);

        }
     }
    //alert("Source"+$("#ddlCityPartenza").find("option:selected").text());
}
function SetDestCityName() {
    callWS("get_city_list_JS",
              "language=it&order_by=&nation=&partner_id=&area_id=",
              "GetCityDestDesc");
}
function GetCityDestDesc(response) {
    var cities = eval(response.obj);
    for (var city in cities) {
        if (cities[city].city_id == $('#hdnCityTo').val()) {
            $('#lblTo').html(cities[city].city_description);

        }
    }
    

    //alert("Source"+$("#ddlCityPartenza").find("option:selected").text());
}
 */
function loadOfferbyHash(response) {
    if (response.status_code == "+Ok")
    {
        currentRequest = eval("[" + response.obj + "]")[0];
        $('#lblFrom').html(currentRequest[0].service_dep_city);
        $('#hdnCityFrom').val(currentRequest[0].service_dep_city);
        //SetSourceCityName();
        $('#lblTo').html(currentRequest[0].service_arr_city);
        $('#hdnCityTo').val(currentRequest[0].service_arr_city);
        //SetDestCityName();

        $('#lblFromArea').html(currentRequest[0].service_dep_areaCode);
        //$('#lblTo').html(currentRequest[0].service_arr_city);
        $('#lblDestArea').html(currentRequest[0].service_arr_areaCode);
        $('#lblDepDate').html(currentRequest[0].service_dep_date.substr(0,10));
        $('#lblDepTime').html(currentRequest[0].service_dep_time.substr(11, 5));
        $('#lblToAdd').html(currentRequest[0].service_dep_address);
        $('#lblFromAdd').html(currentRequest[0].service_arr_address);
        $('#lblPassengers').html(currentRequest[0].service_pax);
        $('#lblBaggages').html(currentRequest[0].service_bags);
       // $('#lblVehType').html(currentRequest[0].service_id_vehicle_type);

      //  $('#lblTypeTransfer').html(currentRequest[0].service_transfer_type);
        if (currentRequest[0].service_is_airport_transfer == 'true')
            $('#lblAirport').html('YES');
        else
            $('#lblAirport').html('NO');
        $('#lblAirportTypeTrans').html(currentRequest[0].service_airport_transfer_type);
        $('#lblFlightNo').html(currentRequest[0].service_flightno);
        if (currentRequest[0].service_pickuptime.length > 16)
            $('#lblPickTime').html(currentRequest[0].service_pickuptime.substr(11, 5));

        if (currentRequest[0].client_type == "COMPANY") {
            $("#lblSurnameDescr").text("Company name:");
            $("#lblNameDescr").text("Contact name:");
        };
        $('#lblClientName').html(currentRequest[0].client_name);
        $('#lblClientSurName').html(currentRequest[0].client_surname);
        $('#lblAddress').html(currentRequest[0].client_address);
        $('#lblZip').html(currentRequest[0].client_zipcode);
        $('#lblPhone').html(currentRequest[0].client_phone);
        $('#lblEmail').html(currentRequest[0].client_email);
        $('#lblCustomerType').html(currentRequest[0].client_type);
        $('#lblRemarks').html(currentRequest[0].service_details);
    
        $('#txtOfferNotes').val(currentRequest[1].offer_partner_note);
        $('#txtPrice').val(currentRequest[1].offer_price);
        $('#hdnPartnerID').val(currentRequest[1].offer_id_partner);
        callWS("get_service_types_list_JS",
             "language=" + etransfer_language + "&order_by=&partner_id_or_name=&servicetype_ids=" + currentRequest[0].service_transfer_type,
             "SetServiceType");
        callWS("get_vehicletype_list_JS", "language=" + etransfer_language + "&order_by=&partner_id_or_name=&veicletype_ids=" + currentRequest[0].service_id_vehicle_type, "SetVehicleText");
        if ((currentRequest[1].offer_status == "ASSIGNED")||(currentRequest[1].offer_status == "REFUSED"))
        {
            $('#btnPlaceOrder').fadeOut();
            $('#txtOfferNotes').attr('disabled', true);
            $('#txtPrice').attr('disabled', true);
            $('#BankTransfer').attr('disabled', true);
            $('#Paypal').attr('disabled', true);
            $('#CashOnBoard').attr('disabled', true);
            $('#Visa').attr('disabled', true);
            var innerHtml = '';
            if (currentRequest[1].offer_status == "ASSIGNED")
                innerHtml = "<p>" + lang[etransfer_language]["res_offer_accepted"] + "</p>";
            if (currentRequest[1].offer_status == "REFUSED")
                innerHtml = "<p>" + lang[etransfer_language]["res_offer_refused"] + "</p>";
            $('.notification').empty().html(innerHtml);
        }
        
        //{\"offer_id\":\"9\",\"offer_id_partner\":\"4213\",\"offer_price\":\"\",\"offer_client_note\":\"\",\"offer_partner_note\":\"\",\"offer_payment_note\":\"\"}]","status_code":"+Ok","status_message":""}
    } else alert(response.status_message);
    $('#place-head').html(lang[etransfer_language]["res_placeoffer_lbl_main_head"]);
    $('#btnPlaceOrder').val(lang[etransfer_language]["res_placeoffer_lbl_your_offer"]);
}

