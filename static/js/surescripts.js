//html5 location api:
function geocode(){
    map.geocode({'address' : address }, function(results, status){
            map_center_lat = results[0].geometry.location.lat();
            map_center_lng = results[0].geometry.location.lng();
            console.log("map_center_lat " +map_center_lat);
            });
}

function reverse_geocode(lat,lng){
    var latlng = new google.maps.LatLng(lat,lng);
    map.geocode({'latLng' : latlng }, function(results, status){
            if(status ==google.maps.GeocoderStatus.OK){
                if(results[0]){
                console.log("reverse geocoding");
                console.log(results[0].formatted_address);
                address=results[0].formatted_address;
                }
            }
            });
}

  navigator.geolocation.getCurrentPosition(function(d){
          console.log('in navigator')
          map_center_lat = d['coords']['latitude']
          map_center_lng = d['coords']['longitude']
          console.log(d);
          reverse_geocode(map_center_lat,map_center_lng);
          });


    function drawMap(){
      //center: new google.maps.LatLng(-33.92, 151.25),
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 2,
      center: new google.maps.LatLng(map_center_lat, map_center_lng),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    console.log("in drawMap");
    console.log(locations);
    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
 }

//explicitly specify expected return dataType in $.ajax
//call to avoid differing behavior between chrome and firefox
function find_test_centers(lat,lon,radius,maxResults)
            {
                //build query string here
                var querystring="?apikey=3a0a572b-4f5d-47a2-9a75-819888576454&lat="+lat+"&lon="+lon+"&radius="+radius+"&maxResults="+maxResults;

                $.ajax({
                        crossDomain:true,
                        dataType:'json',
                        type:'get',
                        url: location.href+'find_test_centers'+querystring,
                     success: function (results)
                     {
                     console.log(results)

                     locations.push(["hi",map_center_lat,map_center_lng])
                     $.each(results['providers'],function(index,obj){
                         var directions_link = 'Click <a href=\'http://maps.google.com/maps?saddr=\x22'+address+'\x22&daddr=\x22'+obj['address1']+','+obj['city']+','+obj['state'] +'\x22\'>here </a> for driving directions to:<br> '+obj['address1']
                         locations.push([directions_link,obj['lat'],obj['lon']])
                         
                         var short_directions = '<a href=\'http://maps.google.com/maps?saddr=\x22'+address+'\x22&daddr=\x22'+obj['address1']+','+obj['city']+','+obj['state'] +'\x22\'>'+obj['address1'] +'</a>'

                         $('#pharmacyTable tr:last').after('<tr><td>'+short_directions+'</td><td>'+obj['distance'].toFixed(1)+"</td></tr>");
                         });

                     drawMap();
                     }});
            }

