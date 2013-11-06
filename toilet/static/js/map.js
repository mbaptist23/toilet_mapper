
function showMap(from) {
    //clear prev directions from the page
    $("#step_panel").html("");
    lat=$('#lat').val();//||36.991366;
    lng=$('#lng').val();//||-122.059844;
    //decide on which travel option the user chose
    var travelOption = google.maps.DirectionsTravelMode.WALKING;
    if($('#dropDown').val() === 'DRIVING')
        travelOption = google.maps.DirectionsTravelMode.DRIVING;
    else if($('#dropDown').val() === 'TRANSIT')
        travelOption = google.maps.DirectionsTravelMode.TRANSIT;
    else if($('#dropDown').val() === 'BICYCLING')
        travelOption = google.maps.DirectionsTravelMode.BICYCLING;
    console.log(travelOption);    
    console.log(lat, lng);
    var toilet_address = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 17,
        center: toilet_address,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker = new google.maps.Marker({
        position: toilet_address,
        map: map,
        title: $('#toilet_name').val()
    });
    // Try W3C Geolocation (Preferred)
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsRequest = {
        origin: from,
        destination: toilet_address,
        travelMode: travelOption,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('step_panel'));
    directionsService.route(directionsRequest, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}
 

function initMap () {
    // If the browser supports the Geolocation API
    if (typeof navigator.geolocation == "undefined") {
        $("#error").text("Your browser doesn't support the Geolocation API");
        return;
    }
    $("#from-link").click(function(event) {
        event.preventDefault();
        var addressId = this.id.substring(0, this.id.indexOf("-"));

        navigator.geolocation.getCurrentPosition(function(position) {
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                "location": new google.maps.LatLng(position.coords.latitude, 
                                                   position.coords.longitude)
            },
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK)
                    $("#" + addressId).val(results[0].formatted_address);
                else
                    $("#error").append("Unable to retrieve your address<br />");
           });
         },
        function(positionError){
            $("#error").append("Error: " + positionError.message + "<br />");
         },
         {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
         });
    });
    $("#calculate-route").submit(function(event) {
        event.preventDefault();
        showMap($("#from").val());
    });
}

function loadMap(){
    showMap($("#from").val());
}
     
google.maps.event.addDomListener(window,'load',loadMap);

