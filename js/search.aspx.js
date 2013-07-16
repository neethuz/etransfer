var currentRequest = null;
var partner_name;
var selectepartner;
var single_partner;
var currentFilter = {
    min_rating : 0,
    sel_languages: "",
    sms_ready: false,
    ncc_ready: false,
    nccol_ready: false
}


// ----------------     loading content from the server  -------------------------
function endEtransferLoadRequest(response) {
    currentRequest = eval("[" + response.obj + "]")[0];
    
    $('#hdnSourceCity').val(currentRequest.service_dep_city);
    //$("#ddlCityPartenza option[city_description='" + currentRequest.service_dep_city + "']").attr("selected", "selected");

    $('#hdnDestCity').val(currentRequest.service_arr_city);
    //$("#ddlArrivo option[city_description='" + currentRequest.service_arr_city + "']").attr("selected", "selected");

    $('#hdnSourceArea').val(currentRequest.service_dep_areaCode);
    //$("#ddlAreaSource option[area_code='" + currentRequest.service_dep_areaCode + "']").attr("selected", "selected");

    $('#hdnDestArea').val(currentRequest.service_arr_areaCode);
    //$("#ddlAreaDestination option[area_code='" + currentRequest.service_arr_areaCode + "']").attr("selected", "selected");

    callWS("get_area_list_JS",
           "language=" + etransfer_language + "&order_by=&nation=&partner_id_or_name=",
           "PopulateAreaCodeList", {onOk:"doOk", onErr:"doErr"});

    $('#txtSourceAddress').val(currentRequest.service_dep_address);
    $('#txtDestAddress').val(currentRequest.service_arr_address);

    $('#ddlPassengers').val(currentRequest.service_pax);
    $('#ddlBaggage').val(currentRequest.service_bags);
    $('#txtDate').val(currentRequest.service_dep_date);
    $('#txtTime').val(currentRequest.service_dep_time);
   
    $('#txtSurname').val(currentRequest.client_surname);
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
            for(var onevehicle in vehicles){
                $('.select span').text(vehicles[onevehicle].vehicletype_descr);
            }

    }
}
function loadRemoteRequest() {
    callWS("get_current_request_JS", "language=" + etransfer_language , "endEtransferLoadRequest");
}
//-------------------------------------------------------------------------------


//-------------- Setting request content server side ---------------------------
function endEtransferSetRequest(response) {
    if (response.status_code == "+Ok") {
        callWS("get_current_request_JS",
              "language=" + etransfer_language,
              "loadRemoteRequest");
    }
    else {
        var innerHtml = "<div class='etransfer-error'><h4>" + lang[etransfer_language]["res_global_session"] + "</h4><p>" + lang[etransfer_language]["res_global_gohome"] + "</p></div>";
        $('.searchpane').fadeOut();
        $('#searchtop').fadeIn();
        $('#areapartners').empty().html(innerHtml);
        $('#filterpane').fadeOut();
        $('#spinner').html();
        $('#spinner').fadeOut();
        return;
        
    }
}
function setRemoteRequest() {
    //alert("Setting remote etransfer request");

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
    
    callWS("set_current_request_JS",
          "language=" + etransfer_language + "&json_etransfer_request=" + JSON.stringify(currentRequest),
          "endEtransferSetRequest");
}
//------------------------------------------------------------------------------

function PopulatePartnersList(response) {
    var strBookPartners = '';
    if (window.localStorage.getItem("PartnerIds") == null)
        strBookPartners = '';
    else
        strBookPartners = window.localStorage.getItem("PartnerIds");
    if (response.status_code == "+Ok") {
        var partners = eval(response.obj);
        var innerHtml = '';

        //$('#searchtop').fadeIn();
        //$('#filterpane').fadeIn();
        for (var partner in partners) {
            var selectedPartner = partners[partner].partner_id;
            if (strBookPartners.indexOf(selectedPartner + "|") == -1)
                strBookPartners = strBookPartners + selectedPartner + "|";
        }
        window.localStorage.setItem("PartnerIds", strBookPartners);
        window.location.href = 'book-request.html';

        //    var xpscore = partners[partner].etransfer_xpscore;
        //    var xpmax = partners[partner].etransfer_max_xpscore;
        //    var img = "/img/noresult.jpg";
        //    var redbadge = "<img src='img/red_badge.png' style='display:none;'/>";
        //    var bluebadge = "<img src='img/blue_badge.png' style='display:none;'/>";
        //    if (partners[partner].partner_logo != '')
        //        img = "http://ws.etransfer.it/transferimg/" + partners[partner].partner_logo;
        //    if (partners[partner].ncc_online_certified != '')
        //        redbadge = "<img src='img/red_badge.png' style='display:block;'/>";
        //    if (partners[partner].smart_ncc_certified != '')
        //        bluebadge = "<img src='img/blue_badge.png' style='display:block;'/>";
        //    var width = (parseInt(partners[partner].etransfer_xpscore) / parseInt(partners[partner].etransfer_max_xpscore.replace(",00", ""))) * 100;
        //    var xpcontrol = "<span class='outerprogress'><span class='innerprogress' style='width:" + width + "% !important; background:url(/img/xp.png) repeat-x;'><span class='progressval'>" + partners[partner].etransfer_xpscore + "/" + partners[partner].etransfer_max_xpscore.replace(",00", "") + "  xp</span></span></span>";
        //    /*<span class='label'>" + res_lbl_rating + "</span><span>" + rateimg + "</span><span class='more-link'><a title='" + res_ncc_badge_alt + "'>" + redbadge + "</a></span>*/
        //    innerHtml += "<div class='listings' id='partner" + partners[partner].partner_id + "'>" +
        //        "<div class='listhead'><div class='listcheck'><input type='checkbox'  id='checkbox" + partners[partner].partner_id + "' onclick='return setnewquotation(this," + partners[partner].partner_id + ");' class='regular-checkbox searchchkbox' value='" + partners[partner].partner_id + "' /><label for='checkbox" + partners[partner].partner_id + "'></label></div>" +
        //        "<a href='/partner.html?id=" + partners[partner].partner_id + "' href='#'>" + partners[partner].partner_firstname + "</a><span class='spacing'>" + partners[partner].partner_address + "</span></div><div class='listingsimg'><a href='/partner.html?id=" + partners[partner].partner_id + "' href='#'><img src='" + img + "' alt='' /></a></div>" +
        //            "<div class='listaddress'><br/><p><span  class='label'>XP Score:</span><span style='float:left'>" + xpcontrol + "</span></p>" +
        //            "<p><span class='label'>" + lang[etransfer_language]["res_lbl_phone"] + "</span><span>" + partners[partner].partner_phone + "</span></p><p><span class='label'>" + lang[etransfer_language]["res_lbl_fax"] + "</span><span>" + partners[partner].partner_fax + "</span> </p><p><span class='label'>" + lang[etransfer_language]["res_lbl_email"] + "</span><span> <a href='mailto:" + partners[partner].partner_email + "'>" + partners[partner].partner_email + "</span></a> </p>" +

        //                "<p><span class='label'>" + lang[etransfer_language]["res_lbl_web"] + "</span> <span><a target='_blank' href='http://" + partners[partner].partner_website + "'>" + partners[partner].partner_website + "</a></span></p></div>" +
        //                "<div class='listdetails'><span class='more-link'><a title='" + lang[etransfer_language]["res_ncc_badge_alt"] + "'>" + redbadge + "</a></span><span class='more-link'><a title='" + lang[etransfer_language]["res_smart_badge_alt"] + "'>" + bluebadge + "</a></span></div><div class='listdetails'><p><span class='label' style='width:120px'>" + lang[etransfer_language]["res_lbl_service_offered"] + "</span><span>" + partners[partner].partner_seo_title + "<span></p><p>" + partners[partner].partner_seo_description + "<a target='_blank' href='" + partners[partner].partner_url + "'> " + lang[etransfer_language]["res_lbl_lnk_continue"] + "</a></p></div></div>";
        //}
        //$('.searchpane').fadeOut();
        //$('#areapartners').empty().html(innerHtml);
        //$('#spinner').html();
        //$('#spinner').fadeOut();
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
    if (reponse.status_code == "+Ok") {
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
    else
        window.location.href = '/error.html';

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
    geoTestAddress($('#ddlCityPartenza'), $('#txtSourceAddress'), function () {
        calcRoute();
    });
    //calcRoute();
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
    geoTestAddress($('#ddlArrivo'), $('#txtDestAddress'), function () {
        calcRoute();
    });
    //calcRoute();
}



function setPartnerQuotation(selectedPartner) {

    var strPartners = window.localStorage.getItem("PartnerIds");
    if (strPartners == null)
        strPartners = '';
    if (strPartners.indexOf(selectedPartner + "|") == -1)
        strPartners = strPartners + selectedPartner + "|";
    else
        strPartners = strPartners.replace(selectedPartner + "|", "");
    window.localStorage.setItem("PartnerIds", strPartners);
    window.location.href = 'book-request.html';

};
function setQuotation(selectedPartner) {

    var strPartners = window.localStorage.getItem("PartnerIds");
    if (strPartners.indexOf(selectedPartner + "|") == -1)
        strPartners=strPartners + selectedPartner + "|";
    else
        strPartners=strPartners.replace(selectedPartner + "|", "");
    window.localStorage.setItem("PartnerIds", strPartners);
}
function setnewquotation(control,selectedPartner) {
    var strPartners = window.localStorage.getItem("PartnerIds");
    if (strPartners == null)
        strPartners = '';
   // $('#hdnSelectedPartners').val(strPartners);
    if ($(control).is(':checked')) {
        if (strPartners.indexOf(selectedPartner + "|") == -1)
            strPartners=strPartners + selectedPartner + "|";
    }
    else
        strPartners=strPartners.replace(selectedPartner + "|", "");
    if ($(".searchchkbox").length == $(".searchchkbox:checked").length) {
        $("#chkSearch").attr("checked", "checked");
        $("#chkSearchB").attr("checked", "checked");

    } else {
        $("#chkSearch").removeAttr("checked");
        $("#chkSearchB").removeAttr("checked");
    }
    window.localStorage.setItem("PartnerIds", strPartners);
}
function doPartnerSearch() {
    if ($('#ddlAreaSource').val() != '0') {
       // window.localStorage.setItem("PartnerIds", "");
        


        setRemoteRequest();
        $(window).scrollTop(0);
       // $('#hdnSelectedPartners').val('');
        //location.hash = "#searchtop"
        $('#spinner').fadeIn();
        $('#spinner').html('<p><img src="img/loading_animation.gif"/></p> <p>' + lang[etransfer_language]["res_msg_loading"] + '</p>');
        
        callWS("get_partner_list_JS",
              "language=" + etransfer_language + "&order_by=&nation_id=&area_ids_or_names=" + $('#ddlAreaSource').val() + "&spoken_languages=" + currentFilter.sel_languages + "&smart_ncc_certified=" + currentFilter.ncc_ready + "&ncc_online_certified=" + currentFilter.nccol_ready + "&sms_ready=" + currentFilter.sms_ready + "&min_score=" + currentFilter.min_rating + "&topList=0",
              "PopulatePartnersList");
    }
}

function LoadLabels() {
    $("#result-head").html(lang[etransfer_language]["res_search_result_lbl_head"]);
    $(".checkall span").html(lang[etransfer_language]["res_search_result_lbl_select_all"]);
    $("#btnEnquire3").html(lang[etransfer_language]["res_global_link_enquire_text"]);
    $("#btnEnquire2").html(lang[etransfer_language]["res_global_link_enquire_text"]);
    $("#pickup-place").html(lang[etransfer_language]["res_search_lbl_from"]);
    $("#destination-place").html(lang[etransfer_language]["res_search_lbl_to"]);
    $("#google-map").html(lang[etransfer_language]["res_search_lbl_gmap"]);
    $("#n-passenger").html(lang[etransfer_language]["res_search_lbl_passenger"]);
    $("#n-baggage").html(lang[etransfer_language]["res_search_lbl_baggage"]);
    $("#pick-date").html(lang[etransfer_language]["res_search_lbl_pickupdate"]);
    $("#pick-time").html(lang[etransfer_language]["res_search_lbl_pickuptime"]);
    $("#vehicle-type").html(lang[etransfer_language]["res_search_lbl_vehicle"]);
    $("#select-text").html(lang[etransfer_language]["res_global_select"]);
    $("#btnSubmit").val(lang[etransfer_language]["res_global_btn_send_request"]);
    $("#btnCancel").val(lang[etransfer_language]["res_global_btn_cancel"]);
    $("#search-head").html(lang[etransfer_language]["res_search_lbl_head"]);
    

}
function PostBack() {
    LoadLabels();
        $('[id^="chkSearch"]').click(function () {
            var strPartners = window.localStorage.getItem("PartnerIds");
            if (strPartners == null)
                strPartners = '';
            $('.searchchkbox').attr('checked', this.checked);
            $("#chkSearch").attr('checked', this.checked);
            $("#chkSearchB").attr('checked', this.checked);
            $('#areapartners input:checkbox').each(function () {
                //$('#hdnSelectedPartners').val(strPartners);
                var selectedPartner = $(this).val();
                if ($(this).is(':checked')) {
                    if (strPartners.indexOf(selectedPartner + "|") == -1)
                        strPartners=strPartners + selectedPartner + "|";
                }
                else {
                    strPartners=strPartners.replace(selectedPartner + "|", "");
                }
            });
            window.localStorage.setItem("PartnerIds", strPartners);
        });
       

  

    callWS("get_area_list_JS",
           "language=" + etransfer_language + "&order_by=&nation=&partner_id_or_name=",
           "PopulateAreaCodeList");

    
    
    $('#btnSubmit').click(function () {
        if (partner_name != "undefined" && single_partner == true) {
            $(window).scrollTop(0);
            $('.searchresults').fadeOut();
            $("#pnlContent").fadeOut();
            $("#pnlBooking").fadeIn();
            return false;
        }
        else
            doPartnerSearch();
    });
    $('#btnEnquire3').click(function () {
        if (window.localStorage.getItem("PartnerIds") != null) {
            //alert(window.localStorage.getItem("PartnerIds"));
            window.location.href = 'book-request.html';
            return false;

        }
        else {
            alert(lang[etransfer_language]["res_booking_msg_sending"]);
        }
    });
    $('#btnEnquire2').click(function () {
        if (window.localStorage.getItem("PartnerIds") != null) {
            //alert(window.localStorage.getItem("PartnerIds"));
            window.location.href = 'book-request.html';
            return false;

        }
        else {
            alert(lang[etransfer_language]["res_booking_msg_sending"]);
        }
    });
    $(".filter_ico").click(function () {
        if ($(this).hasClass("btn_clicked")) {
            //Button selected
            $(this).removeClass("btn_clicked");
        } else {
            //Button unselected
            $(this).addClass("btn_clicked");
        }

        if ($(this).attr("filter_type") == "sms_ready") {
            currentFilter.sms_ready = $(this).hasClass("btn_clicked");
        }
        if ($(this).attr("filter_type") == "ncc_ready") {
            currentFilter.ncc_ready = $(this).hasClass("btn_clicked");
        }
        if ($(this).attr("filter_type") == "nccol_ready") {
            currentFilter.nccol_ready = $(this).hasClass("btn_clicked");
        }
        if ($(this).attr("filter_type") == "sel_languages") {
            if ($(this).hasClass("btn_clicked")) {
                currentFilter.sel_languages = currentFilter.sel_languages.replace($(this).attr("lang") + "|", "") + $(this).attr("lang") + "|";
            } else {
                currentFilter.sel_languages = currentFilter.sel_languages.replace($(this).attr("lang") + "|", "");
            }
        }
        doPartnerSearch();
    });

    $('#ddlAreaSource').change(function () {
        $('#hdnSourceArea').val($('#ddlAreaSource').val());
        //alert($('#ddlAreaSource').find("option:selected").text());
        $('#hdnSourceCity').val('');
        $('#txtSourceAddress').val("");
        var input = document.getElementById('txtSourceAddress');
        var options = {
            //types: ['geocode'],
            offset: 2,
            componentRestrictions: { country: 'it' }
            
        };

        //autocomplete = new google.maps.places.Autocomplete(input, options);
        callWS("get_city_list_JS",
              "language=" + etransfer_language + "&order_by=&nation=&partner_id=&area_id=" + $('#ddlAreaSource').val(),
              "PopulateCityListSource");
    });
    $('#ddlAreaDestination').change(function () {
        $('#hdnDestArea').val($('#ddlAreaDestination').val());
        $('#hdnDestCity').val('');
        $('#txtDestAddress').val("");
        var input = document.getElementById('txtDestAddress');
        var options = {
            offset:2,
            componentRestrictions: { country: 'it' }

        };

        //autocomplete = new google.maps.places.Autocomplete(input, options);
        callWS("get_city_list_JS",
              "language=" + etransfer_language + "&order_by=&nation=&partner_id=&area_id=" + $('#ddlAreaDestination').val(),
              "PopulateCityListDestination");

    });

    if ($('#hdnVehicleType').val() != '') {
        callWS("get_vehicletype_list_JS", "language=" + etransfer_language + "&order_by=&partner_id_or_name=&veicletype_ids=" + $('#hdnVehicleType').val(), "SetVehicleText");
        
    }

    $('#ddlAreaSource, #ddlAreaDestination').blur(function () {
        calcRoute();
    });

    $('#ddlCityPartenza').change(function () {
        $('#hdnSourceCity').val($('#ddlCityPartenza').val());
        //$('#txtSourceAddress').val("");
        calcRoute();
    });
    $('#ddlArrivo').change(function () {
        $('#hdnDestCity').val($('#ddlArrivo').val());
        //$('#txtDestAddress').val("");
        calcRoute();
    });

    $('#txtSourceAddress').blur(function () {
        geoTestAddress($('#ddlCityPartenza'), $('#txtSourceAddress'), function () {
            calcRoute();
        });
    });
    $('#txtDestAddress').blur(function () {
        geoTestAddress($('#ddlArrivo'), $('#txtDestAddress'), function () {
            calcRoute();
        });
    });

    $("#txtDate").datepicker({
        showButtonPanel: false,
        showOn: "button",
        buttonImage: "../img/calendar/calendar.gif",
        buttonImageOnly: true,
		dateFormat: 'dd/mm/yy' 
    });

    $('#txtTime').timepicker({ 'scrollDefaultNow': true });
    $('.select').click(function () { $('.vehicleDropdown').fadeToggle(); });
    $('.select li').click(function () {
        $('.select span').text($(this).text());
        $('#hdnVehicleType').val($(this).attr("title"));
    });

    initialize();
    loadRemoteRequest();

}
$(document).ready(function () {
    PostBack();
    
});
