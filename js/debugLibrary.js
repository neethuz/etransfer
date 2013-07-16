function logWS(cbFunction, cbObject, uid_hash, evt_type, evt_details) {
    if (cbObject == null) cbObject = "";
    if (cbFunction == null) cbFunction = "";
    else cbObject = JSON.stringify(cbObject, null, 2);
    var reqUrl = "http://devgiancarlo/progettogestionale/wssmartncc/WS_log.asmx/log_JS?callback=" + cbFunction + "&cbObject=" + cbObject + "&rnd=" + Math.random() + "&token=" + window.localStorage.getItem("token") + "&uid_hash=" + uid_hash + "&evt_type=" + evt_type + "&evt_details=" + evt_details;
    //var reqUrl = "http://ws.etransfer.it/progettogestionale/wssmartncc/WS_log.asmx/log_JS?callback=" + cbFunction + "&cbObject=" + cbObject + "&rnd=" + Math.random() + "&token=" + $("#hdnToken").val() + "&uid_hash=" + uid_hash + "&evt_type=" + evt_type + "&evt_details=" + evt_details;

    var script_id = null;
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', reqUrl);
    script.setAttribute('id', 'script_id' + Math.random);

    script_id = document.getElementById('script_id');
    if (script_id) {
        document.getElementsByTagName('head')[0].removeChild(script_id);
    }

    document.getElementsByTagName('head')[0].appendChild(script);

}

$(document).ready(function () {
    $('.debug_click').click(function () {
        logWS(null, null, "", "on_change", $(this).attr("id") + "|" + $(this).val());
    });

    $('.debug_change').change(function () {
        logWS(null, null, "", "on_change", $(this).attr("id") + "|" + $(this).val());
    });

    $("select, input").change(function () {
        logWS(null, null, "", "on_change", $(this).attr("id") + "|" + $(this).val());
    });

    $("a, #ck-button").click(function () {
        logWS(null, null, "", "on_click", $(this).attr('name') + "|" + $(this).text() + "|" + $(this).attr('href'));
    });

    $("input[type='button']").click(function () {
        logWS(null, null, "", "on_click", $(this).attr("id") + "|" + $(this).val());
    });

    logWS(null, null, "", "on_load", document.URL);



});
