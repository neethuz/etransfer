function callWS(method, request_params, cbFunction, cbObject) {
    if (cbObject == null) cbObject = "";
    else cbObject = JSON.stringify(cbObject, null, 2);
    if (window.localStorage.getItem("token") != null) {
        var reqUrl = "http://ws.etransfer.it/progettogestionale/wssmartncc/WS_etransfer.asmx/" + method + "?callback=" + cbFunction + "&cbObject=" + encodeURIComponent(cbObject) + "&rnd=" + Math.random() + "&token=" + window.localStorage.getItem("token") + "&" + request_params;
        //var reqUrl = "http://devgiancarlo/progettogestionale/wssmartncc/WS_etransfer.asmx/" + method + "?callback=" + cbFunction + "&cbObject=" + encodeURIComponent(cbObject) + "&rnd=" + Math.random() + "&token=" + $("#hdnToken").val() + "&" + request_params;

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
    else
        window.location.href = 'error.html';
}

//function callWS(method, request_params, cbFunction, cbObject) {
//    if (cbObject == null) cbObject = "";
//    else cbObject = JSON.stringify(cbObject, null, 2);
//    if ($.cookie("token") != null) {
//        var reqUrl = "http://ws.etransfer.it/progettogestionale/wssmartncc/WS_etransfer.asmx/" + method + "?callback=" + cbFunction + "&cbObject=" + cbObject + "&rnd=" + Math.random() + "&token=" + $.cookie("token") + "&" + request_params;
//        //var reqUrl = "http://localhost:3013/progettogestionale/wssmartncc/WS_etransfer.asmx/" + method + "?callback=" + cbFunction + "&cbObject=" + cbObject + "&rnd=" + Math.random() + "&token=" + $("#hdnToken").val() + "&" + request_params;
//        //var reqUrl = "http://devgiancarlo/progettogestionale/wssmartncc/WS_etransfer.asmx/" + method + "?callback=" + cbFunction + "&cbObject=" + cbObject + "&rnd=" + Math.random() + "&token=" + $("#hdnToken").val() + "&" + request_params;

//        var script_id = null;
//        var script = document.createElement('script');
//        script.setAttribute('type', 'text/javascript');
//        script.setAttribute('src', reqUrl);
//        script.setAttribute('id', 'script_id' + Math.random);

//        script_id = document.getElementById('script_id');
//        if (script_id) {
//            document.getElementsByTagName('head')[0].removeChild(script_id);
//        }

//        document.getElementsByTagName('head')[0].appendChild(script);
//    }
//    else
//        window.location.href = '/error.html';
//}
function CallLogin(cbFunction,cbObject) {
    if (cbObject == null) cbObject = "";
    else cbObject = JSON.stringify(cbObject, null, 2);
    var reqUrl = "http://ws.etransfer.it/progettogestionale/wssmartncc/WSGD.asmx/login_JS" + "?callback=" + cbFunction + "&cbObject="+cbObject+"&rnd=" + Math.random() + "&username=neethu&password=ratheeshps";

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