var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var geocoder;
function initialize() {
    geocoder = new google.maps.Geocoder();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var rome = new google.maps.LatLng(41.92476, 12.461014);
    var mapOptions = {
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: rome
    }
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    directionsDisplay.setMap(map);
}
function getLatLong(address) {
    var geo = new google.maps.Geocoder;

    geo.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //alert(results[0].geometry.location);
            return results[0].geometry.location;
        } else {
            alert(res_msg_gmap_geocode + status);
        }

    });

}

function calcRoute() {
    //var start = document.getElementById('ddlCityPartenza').options[document.getElementById('ddlCityPartenza').selectedIndex].text + ", " + document.getElementById('ddlAreaSource').options[document.getElementById('ddlAreaSource').selectedIndex].text;
    //var end = document.getElementById('ddlArrivo').options[document.getElementById('ddlArrivo').selectedIndex].text + ", " + document.getElementById('ddlAreaDestination').options[document.getElementById('ddlAreaDestination').selectedIndex].text;
    //via a. locatelli, 24, Zogno, Bergamo (BG)

    if ($('#hdnSourceCity').val() == "" || $('#hdnDestCity').val() == "") return;
	if ($("#ddlArrivo").find("option:selected").text() == "" || $("#ddlCityPartenza").find("option:selected").text()=="") return;
	
    var start = $("#ddlCityPartenza").find("option:selected").text() + " (" + $("#ddlCityPartenza").find("option:selected").attr("area_code") + ")";
    var end = $("#ddlArrivo").find("option:selected").text() + " (" + $("#ddlArrivo").find("option:selected").attr("area_code") + ")";


    if (($('#txtSourceAddress').val() != '' && $('#txtSourceAddress').attr("geocode_ok") == "true")) {
        var start = document.getElementById('txtSourceAddress').value + ", " + start;
    }
    if (($('#txtDestAddress').val() != '' && $('#txtDestAddress').attr("geocode_ok") == "true")) {
        var end = document.getElementById('txtDestAddress').value + ", " + end;
    }
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            calculateDistances(start, end);
        } else if (status == "NOT_FOUND") {
            //  alert("n");
        }
    });


}
function calculateDistances(start, end) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
     {
         origins: [start],
         destinations: [end],
         travelMode: google.maps.TravelMode.DRIVING,
         unitSystem: google.maps.UnitSystem.METRIC,
         avoidHighways: false,
         avoidTolls: false
     }, callback);
}
function callback(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
        alert(global_js_callback_error + status);
    } else {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var dist = document.getElementById('lblDistance');
        dist.innerHTML = lang[etransfer_language]["res_lbl_callback_approx"];
        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                if (results[j].status != "NOT_FOUND")
                    dist.innerHTML += results[j].distance.text + ' in '
                        + results[j].duration.text + '<br>';
            }
        }
    }
}
function geoTestAddress(cityCtrl, addrCtrl, onOk) {
    if (addrCtrl.val() == "" || cityCtrl.find("option:selected").text() == "" || cityCtrl.find("option:selected").attr("area_code") == "undefined") {
        addrCtrl
            .css("background-color", "#FFFFFF")
            .attr("geocode_ok", "false");
        onOk();
    } else {
        var addrStr = addrCtrl.val() + "," + cityCtrl.find("option:selected").text() + " (" + cityCtrl.find("option:selected").attr("area_code") + ")";
        geocoder.geocode({ 'address': addrStr }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                addrCtrl
                    .css("background-color", "#AEFFC9")
                    .attr("geocode_ok", "true");
                //.val(results[0].address_components[1].long_name + ", " + results[0].address_components[0].long_name);
                onOk();
            } else {
                addrCtrl
                    .css("background-color", "#FDDB95")
                    .attr("geocode_ok", "false");
                onOk();
            }
        });
    }
}
