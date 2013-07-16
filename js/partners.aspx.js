function LoadPartners(response) {
    if (response.status_code == "+Ok") {
        var partners = eval(response.obj);
        var innerHtml = '';
        var nccCertif = '';
        var smartCertif = '';
        var language = '';
        for (var partner in partners) {
            var xpscore = partners[partner].etransfer_xpscore;
            var xpmax = partners[partner].etransfer_max_xpscore;
            var width = (parseInt(partners[partner].etransfer_xpscore) / parseInt(partners[partner].etransfer_max_xpscore.replace(',00', ''))) * 100;
            var xpcontrol = "<span class='outerprogress'><span class='innerprogress' style='width:" + width + "% !important; background:url(/img/xp.png) repeat-x;'><span class='progressval'>" + xpscore + "/" + xpmax.replace(',00', '') + "  xp</span></span></span>";
            selectepartner = partners[partner].partner_id;
            innerHtml += "<h1>" + partners[partner].partner_firstname + "</h1>";
            innerHtml += "<div class='partner'>";
           innerHtml += "<div class='detailimg'>";
           innerHtml += "<img id='ilogo' class='plogo'  src='http://ws.etransfer.it/transferimg/" + partners[partner].partner_logo + "'/>";
            innerHtml += "<p class='certif'><span class='label certificates'>" + lang[etransfer_language]["res_partner_lbl_driver_speaks"] + "</span>";
            if (partners[partner].partner_languages != '') {
                var langs = partners[partner].partner_languages.split('|');
                if (langs[0] == 'ITA')
                    language = "<span class='certificates'><a id='aItalian' title='Italian'><img alt='Italia' src='/img/IT.gif' width='24' /></a></span>"
                if (langs[1] == 'ENG')
                    language += "<span class='certificates'><a id='aEnglish' title='English'><img src='/img/en.jpg' alt='English' width='24' /></a></span>"
                if (langs[2] == 'FRA')
                    language += "<span class='certificates'><a id='aItalian' title='French'><img alt='French' src='/img/fr.gif' width='24' /></a></span>"

            }
            innerHtml += language + "</p>";

            if (partners[partner].ncc_online_certified != null)
                nccCertif = "<a title='NCC Online Certification'><img src='img/blue_badge.png' /></a>";
            if (partners[partner].smart_ncc_certified != null)
                smartCertif += "<a title='Smart NCC Certification'><img src='img/red_badge.png' /></a>"
            innerHtml += "<p class='certif'><span class='label certificates'>" + lang[etransfer_language]["res_partner_lbl_certifications"] + "</span>";
            innerHtml += "<span>" + nccCertif + "</span>";
            innerHtml += "<span>" + smartCertif + "</span></p></div>";
            innerHtml += "<div class='listaddress'>";
        //    innerHtml += "<p id='ck-button' title='" + lang[etransfer_language]["res_cbox_title"] + "'><label><input type='checkbox' onclick='return setPartnerQuotation(" + partners[partner].partner_id + ");' class='cbQuotation' value='" + partners[partner].partner_id + "'/><span>" + lang[etransfer_language]["res_cbox_text"] + "</span></label></p>";
            innerHtml += "<p><span class='label'>XP Score:</span>" + xpcontrol + "</p>";
            innerHtml += "<p><span class='label'>" + lang[etransfer_language]["res_partner_lbl_partner"] + "</span> <span><span id='lblAddress'>" + partners[partner].partner_address + ", " + partners[partner].partner_area + ", " + partners[partner].partner_city + ", " + partners[partner].partner_country + ", " + partners[partner].partner_zipcode + "</span></span> </p>";

            innerHtml += "<p><span class='label'>" + lang[etransfer_language]["res_alt_phone"] + "</span> <span><span id='lblTel'>" + partners[partner].partner_phone + "</span></span></p>";
            innerHtml += "<p><span class='label spacing'>" + lang[etransfer_language]["res_lbl_fax"] + "</span><span id='lblFax'>" + partners[partner].partner_fax + "</span></p>";
            innerHtml += "<p><span class='label'>" + lang[etransfer_language]["res_partner_lbl_mobile"] + "</span> <span><span id='lblMobile'>" + partners[partner].parther_mobile_phone + "</span></span> </p>";
            innerHtml += "<p><span class='label'>" + lang[etransfer_language]["res_lbl_email"] + "</span> <span><a href='mailto:" + partners[partner].partner_email + "' id='lbtnEmail'>" + partners[partner].partner_email + "</a></span></p>";
            innerHtml += "<p><span class='label'>" + lang[etransfer_language]["res_lbl_web"] + "</span> <span><a href='http://" + partners[partner].partner_website + "' id='lbtnUrl' target='_blank'>" + partners[partner].partner_website + "</a></span></p>";
            innerHtml += "<p class='socialicons'><span class='label'>Social network:</span><a href='https://www.facebook.com/pages/Arena-Travel-Casert' id='aFacebook' target='_blank' title='Facebook'><img src='/img/fb.png' alt='etrasfer facebook' /></a></p>";
            innerHtml += "<p class='paymenticons'><span class='label'>Modalita di pagamento:</span><a title='Credit card online'><img src='/img/p_visa.png' alt='Credit card online' /></a><a title='Credit card on board'><img src='/img/p_visa_ob.png' alt='Credit card on board' /></a><a title='PayPal'><img src='/img/p_paypal.png' alt='PayPal' /></a></p>";
            innerHtml += "</div>";
            innerHtml += "<div class='listdetails'><div class='subheading'><h3>" + lang[etransfer_language]["res_partner_lbl_about"] + " " + partners[partner].partner_firstname + "</h3></div>";
            innerHtml += "<p style='width:90%'>" + partners[partner].partner_seo_description + "</p>";

            $('#content').empty().html(innerHtml);
            callWS("get_vehicletype_list_JS",
                  "language=" + etransfer_language + "&order_by=&partner_id_or_name=" + partners[partner].partner_id + "&veicletype_ids=",
                  "GetVehiclesList");



        }
    }


}
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
function GetServiceList(response) {
    var innerHtml = '';
    if (response.status_code == "+Ok") {

        innerHtml += "<div class='subheading'><h3>" + lang[etransfer_language]["res_lbl_service_offered"] + "</h3></div>";
        var services = eval(response.obj);
        innerHtml += "<ul class='drivers'>";
        for (var serv in services) {
            innerHtml += "<li>" + services[serv].service_description + "</li>";
        }
        innerHtml += "</ul></div></div>";
        $('#content').append(innerHtml);
        $('.loader').fadeOut();
    }
}
function GetVehiclesList(response) {
    var innerHtml = '';
    if (response.status_code == "+Ok") {
        innerHtml += "<div class='subheading'><h3>" + lang[etransfer_language]["res_partner_lbl_available_vehicle"] + "</h3></div>";
        innerHtml += "<ul class='drivers'>";
        var vehicles = eval(response.obj);
        for (var veh in vehicles) {
            innerHtml += "<li>" + vehicles[veh].vehicletype_descr + "</li>";
        }
        innerHtml += "</ul>";

        //innerHtml +="<ul><li>Sedan</li><li>Luxury Sedan</li><li>Van/Minivan</li></ul>";
        $('#content').append(innerHtml);
        callWS("get_services_list_JS",
                          "language=" + etransfer_language + "&order_by=&partner_id_or_name=" + selectepartner,
                          "GetServiceList");
        //callWS("get_services_list_JS",
        //                  "language=&" + etransfer_language + "&order_by=&partner_id_or_name=" + $('#hdnpartner').val(),
        //                  "GetServiceList");

    }
}

function getpartner(selectedPartner) {
    $('#spinner').fadeIn();
    $('#spinner').html('<p><img src="img/loading_animation.gif"/></p> <p>' + lang[etransfer_language]["res_msg_loading"] + '</p>');
    callWS("get_partner_details_JS",
                  "language=&" + etransfer_language + "&partner_id_or_name=" + selectedPartner,
                  "LoadPartners");
}
function setPartnerQuotation(selectedPartner) {

    var strPartners = window.localStorage.getItem("PartnerIds");
    if (strPartners == null)
        strPartners = '';
    if (strPartners.indexOf(selectedPartner + "|") == -1)
        strPartners=strPartners + selectedPartner + "|";
    else
        strPartners=strPartners.replace(selectedPartner + "|", "");
    window.localStorage.setItem("PartnerIds", strPartners);
    window.location.href = '/book-request.html';

};
