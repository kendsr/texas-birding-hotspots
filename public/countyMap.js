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
      hotspot = hotspots[i].hotspot;
      notes = hotspots[i].notes;
      if (notes) {
         content =  '<h3>'+ hotspot + '</h3><br><p>'+notes+'</p>'
      } else {
         content = '<h3>'+ hotspot + '</h3>'
      }
      markers.push({
        coords: coords,
        content: content
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