import React, { useRef, useEffect } from 'react';
declare var google:any;

const MapDirections: React.FC = () => {
  const mapEle:any = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  let marker:any;

  useEffect(() => {

    map.current = new google.maps.Map(mapEle.current, {
      center: { lat: 18.559008, lng: -68.388881 },
      zoom: 16,
      mapTypeId: "terrain",
    });
  
    marker = new google.maps.Marker({  map: map.current!, position: { lat: 18.559008, lng: -68.388881 }  });
  
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);
  
          // Creating Marker
          let infoWindow = new google.maps.InfoWindow({ content: `<h5>New Marker</h5>` });
    
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            map: map.current!,
            title: "New Marker"
          });
    
          marker.addListener('click', () => { infoWindow.open(map.current!, marker); });
  
          // Live Tracking 
          navigator.geolocation.watchPosition(
            position => updateLocation(position),
            err =>  alert(`Error (${err.code}): ${err.message}`)
          );
  
        },
        err => {
          alert(`Error (${err.code}): ${err.message}`)
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  
    google.maps.event.addListenerOnce(map.current, 'idle', () => {
      if (mapEle.current) {
        mapEle.current.classList.add('show-map');
      }
    });
  
    function updateLocation(position: any) {
          
      let directions = new google.maps.DirectionsService;
      let render = new google.maps.DirectionsRenderer({
        polylineOptions: {  strokeColor: "#428BE8", strokeWeight: 2 }, 
        suppressMarkers: true,  
        preserveViewport: true
      });
  
      render.addListener('directions_changed', function () {
        let _data = render.getDirections();
        let _newData = _data['routes'][0]['legs'][0];
        console.log(_newData);
      });
  
      directions.route({
        origin: { lat: position.coords.latitude, lng: position.coords.longitude},
        destination: { lat: -25.749628, lng: 28.235534}, // Hatfield Lat Long
        optimizeWaypoints: true,
        provideRouteAlternatives: false,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      }, (res:any, status:any) => {
        if (status == 'OK') {
          render.setDirections(res);
          render.setMap(map.current!);
  
        } else {
          console.warn(status);
        }
      });
    }
  }, []);


  return (
    <div ref={mapEle} className="map-canvas"></div>
  );
}

export default MapDirections;