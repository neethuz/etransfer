var area_name=''
function LoadAreaList(response)
{
    var innerHtml = '';
    if (response.status_code == "+Ok")
    {
        var areas = eval(response.obj);
        innerHtml = "<ul class='drivers'>";
        for (var area in areas) {
            innerHtml += "<li><a href='/area.html?name=" + areas[area].area_desc + "'>" + areas[area].area_desc + "</a></li>";

        }
        innerHtml += "</ul>";
        $('#area-list').empty().html(innerHtml);
    }
    $('.loader').fadeOut();
}
function setnewquotation(control, selectedPartner) {
    var strPartners = window.localStorage.getItem("PartnerIds");
    if (strPartners == null)
        strPartners = '';
    // $('#hdnSelectedPartners').val(strPartners);
    if ($(control).is(':checked')) {
        if (strPartners.indexOf(selectedPartner + "|") == -1)
            strPartners = strPartners + selectedPartner + "|";
    }
    else
        strPartners = strPartners.replace(selectedPartner + "|", "");
    if ($(".searchchkbox").length == $(".searchchkbox:checked").length) {
        $("#chkSearch").attr("checked", "checked");
        $("#chkSearchB").attr("checked", "checked");

    } else {
        $("#chkSearch").removeAttr("checked");
        $("#chkSearchB").removeAttr("checked");
    }
    window.localStorage.setItem("PartnerIds", strPartners);
}
function LoadLabels(area_name) {
    $('#area-header').html(area_name.replace('%20',' ') + " - " + lang[etransfer_language]["res_areadetails_lbl_allpartners"]);
    $('.areadetailimg').html("<img src='/img/area/"+area_name+".jpg' />");
    $(".checkall span").html(lang[etransfer_language]["res_search_result_lbl_select_all"]);
    $("#btnEnquire").html(lang[etransfer_language]["res_global_link_enquire_text"]);
    $("#btnEnquire1").html(lang[etransfer_language]["res_global_link_enquire_text"]);
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
                    strPartners = strPartners + selectedPartner + "|";
            }
            else {
                strPartners = strPartners.replace(selectedPartner + "|", "");
            }
        });
        window.localStorage.setItem("PartnerIds", strPartners);
    });
    $('#btnEnquire1').click(function () {
        if (window.localStorage.getItem("PartnerIds") != null) {
            //alert(window.localStorage.getItem("PartnerIds"));
            window.location.href = '/book-request.html';
            return false;

        }
        else {
            alert(lang[etransfer_language]["res_booking_msg_sending"]);
        }
    });
    $('#btnEnquire').click(function () {
        if (window.localStorage.getItem("PartnerIds") != null) {
            //alert(window.localStorage.getItem("PartnerIds"));
            window.location.href = '/book-request.html';
            return false;

        }
        else {
            alert(lang[etransfer_language]["res_booking_msg_sending"]);
        }
    });
}
function LoadPartnersList(response) {
    var innerHtml = '';
    if (response.status_code == "+Ok") {
        var partners = eval(response.obj);
        
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
                    "<a href='partner.html?id=" + partners[partner].partner_id + "' href='#'>" + partners[partner].partner_firstname + "</a><span class='spacing'>" + partners[partner].partner_address + "</span></div><div class='listingsimg'><a href='/partner.html?id=" + partners[partner].partner_id + "' href='#'><img src='" + img + "' alt='' /></a></div>" +
                        "<div class='listaddress'><br/><p><span  class='label'>XP Score:</span><span style='float:left'>" + xpcontrol + "</span></p>" +
                        "<p><span class='label'>" + lang[etransfer_language]["res_lbl_phone"] + "</span><span>" + partners[partner].partner_phone + "</span></p><p><span class='label'>" + lang[etransfer_language]["res_lbl_fax"] + "</span><span>" + partners[partner].partner_fax + "</span> </p><p><span class='label'>" + lang[etransfer_language]["res_lbl_email"] + "</span><span> <a href='mailto:" + partners[partner].partner_email + "'>" + partners[partner].partner_email + "</span></a> </p>" +

                            "<p><span class='label'>" + lang[etransfer_language]["res_lbl_web"] + "</span> <span><a target='_blank' href='http://" + partners[partner].partner_website + "'>" + partners[partner].partner_website + "</a></span></p></div>" +
                            "<div class='listdetails'><span class='more-link'><a title='" + lang[etransfer_language]["res_ncc_badge_alt"] + "'>" + redbadge + "</a></span><span class='more-link'><a title='" + lang[etransfer_language]["res_smart_badge_alt"] + "'>" + bluebadge + "</a></span></div><div class='listdetails'><p><span class='label' style='width:120px'>" + lang[etransfer_language]["res_lbl_service_offered"] + "</span><span>" + partners[partner].partner_seo_title + "<span></p><p>" + partners[partner].partner_seo_description + "<a target='_blank' href='" + partners[partner].partner_url + "'> " + lang[etransfer_language]["res_lbl_lnk_continue"] + "</a></p></div></div>";

            }
            $('#areapartners').empty().html(innerHtml);
            $('.loader').fadeOut();
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