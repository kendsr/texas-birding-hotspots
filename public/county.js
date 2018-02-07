function initMap(){
    let hotspots = $('#map').data('hotspots');

    // Map options
    var options = {
      zoom:5,
      center:{lat:30.307182,lng:-97.755996} // Austin, Tx
    }

    // New map
    var map = new google.maps.Map(document.getElementById('map'), options);

    // Array of markers - could come from a database
    var markers = [];
    for (let i=0; i < hotspots.length; i++) {
      coords = {lat:hotspots[i].latitude, lng:hotspots[i].longitude};
      content = hotspots[i].hotspot;
      markers.push({
        coords: coords,
        content:'<h3>'+ content + '</h3>'
      });
    }
    
    // Loop through markers
    for(var i = 0;i < markers.length;i++){
      // Add marker
      addMarker(markers[i]);
    }

    // Add Marker Function
    function addMarker(props){
      var marker = new google.maps.Marker({
        position:props.coords,
        map:map
      });

      // Check content
      if(props.content){
        var infoWindow = new google.maps.InfoWindow({
          content:props.content
        });

        marker.addListener('click', function(){
          infoWindow.open(map, marker);
        });
      }
    }
  }