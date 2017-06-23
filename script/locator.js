var pickup_locations;

// Computes the distance between two earth coordinates
// in the format {lat: NUMBER, lon: NUMBER}
function earthDistance(coord1, coord2) {
  var RADIUS_OF_EARTH = 3961; // miles
  var lat1 = coord1.lat * Math.PI / 180;
  var lat2 = coord2.lat * Math.PI / 180;
  var lon1 = coord1.lon * Math.PI / 180;
  var lon2 = coord2.lon * Math.PI / 180;

  var dlon = lon2 - lon1;
  var dlat = lat2 - lat1;

  var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  console.log('RADIUS_OF_EARTH*c=', RADIUS_OF_EARTH * c);
  return RADIUS_OF_EARTH * c;
}

$("form").submit(function() {
  clearMarkers();
  convertAddressToCoordinates();
  return false;
});

var map;
var markers = [];
function initMap() {
  default_center = new google.maps.LatLng(33.189847, -111.599879);
  let mapProp = {
    center: default_center,
    zoom: 10
  };
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

function addMarker(loc) {
  let latlng = new google.maps.LatLng(loc.lat, loc.lon);
  let marker = new google.maps.Marker({position: latlng});
  markers.push(marker);
  marker.setMap(map);
  return marker;
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function addInfo(marker, loc) {
  let content_str = '<div>'
  content_str += '<p><b>' + loc.description + '</b></p>';
  content_str += '<p>' + loc.street + '</p>';
  content_str += '<p>' + loc.city + ', ' + loc.state + ' ' + loc.zip + '</p>';
  content_str += '<p>' + loc.phone + '</p>';
  content_str += '<p>Hours: ' + loc.hours + '</p>';
  content_str += '</div>';
  let infowindow = new google.maps.InfoWindow({content: content_str});
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
  return infowindow;
}

function convertAddressToCoordinates() {
  let address = $('#address').val() || '3111 W Hunt Hwy, San Tan Valley, AZ 85142';
  console.log('address=' + address);
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == 'OK') {
      console.log('long=', results[0].geometry.location.lng());
      console.log('lat=', results[0].geometry.location.lat());
      filterLocations(map, results[0].geometry.location.lng(), results[0].geometry.location.lat());
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function filterLocations(map, longitude, latitude) {
  $.get("https://hidden-taiga-38421.herokuapp.com/listLocations").then(function(data) {
    pickup_locations = JSON.parse(data).locations;
    let search_locations = pickup_locations.filter(function(curr) {
      let dist = earthDistance({
        lat: latitude,
        lon: longitude
      }, {
        lat: parseFloat(curr.lat),
        lon: parseFloat(curr.lon)
      });
      return dist <= $('#distance').val();
    });
    search_locations.forEach(function(curr) {
      let marker = addMarker(curr);
      let infowindow = addInfo(marker, curr);
    });
  });
}
