import React, { useRef, useEffect } from 'react';

const Map: React.FC = () => {
  const mapEle:any = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  const marker = useRef<google.maps.Marker>();

  useEffect(() => {
    setTimeout(() => {

        map.current = new google.maps!.Map(mapEle.current, {
          center: { lat: 18.559008, lng: -68.388881 },
          zoom: 16,
          mapTypeId: "terrain",
        });
      
        marker.current = new google.maps!.Marker({  map: map.current!, position: { lat: 18.559008, lng: -68.388881 }  });
      
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            position => {
              console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

              marker.current!.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
              map.current!.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });

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
      
        google.maps!.event.addListenerOnce(map.current, 'idle', () => {
          if (mapEle.current) {
            mapEle.current.classList.add('show-map');
          }
        });

    },0);

    function updateLocation(position: any) {

      console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

      marker.current!.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
      map.current!.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });

    }

  }, []);


  return (
    <div ref={mapEle} className="map-canvas"></div>
  );
}

export default Map;
const google = window.google;
