var map,
  infoWindow,
  request,
  service,
  pos,
  center,
  count = 0;
var markers = [];
var places = [];
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 11
  });
  service = new google.maps.places.PlacesService(map);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow = new google.maps.InfoWindow();
        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
        var request = {
          location: pos,
          radius: 15000,
          types: ["hospital", "health"]
        };
        service.nearbySearch(request, callback);
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      markers.push(createMarker(results[i]));
    }
  }
  fetch("http://localhost:5000/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: pos,
      hospitals: places,
      length: places.length
    })
  });
  for (let i = 0; i < places.length; i++) {
    var ul = document.getElementById("box");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(places[i]));
    ul.appendChild(li);
  }
  createMarker(center);
}

function createMarker(place) {
  places.push(place.name);
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, "click", function() {
    infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
  count--;
  return marker;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

//   function clearResults(markers) {
//     for (var m in markers) {
//       markers[m].setMap(null);
//     }
//     markers = [];
//   }

// var ele = document.getElementById("button2");
// ele.className = "show2";
// var directionsService = new google.maps.DirectionsService();
// var directionsDisplay = new google.maps.DirectionsRenderer();
// var map = new google.maps.Map(document.getElementById("map"), {
//   zoom: 7,
//   mapTypeId: google.maps.MapTypeId.ROADMAP
// });

// directionsDisplay.setMap(map);
// directionsDisplay.setPanel(document.getElementById("panel"));

// var request = {
//   origin: pos,
//   destination: place.name,
//   travelMode: google.maps.DirectionsTravelMode.DRIVING
// };

// directionsService.route(request, function(response, status) {
//   if (status == google.maps.DirectionsStatus.OK) {
//     directionsDisplay.setDirections(response);
//   }
// });
