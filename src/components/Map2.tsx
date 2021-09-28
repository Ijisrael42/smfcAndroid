import React, { useRef, useEffect } from 'react';

const Map: React.FC = () => {
  const mapEle:any = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();

  useEffect(() => {

    map.current = new google.maps.Map(mapEle.current, {
      center: { lat: 18.559008, lng: -68.388881 },
      zoom: 16,
      mapTypeId: "terrain",
    });

    addMarkers();

    google.maps.event.addListenerOnce(map.current, 'idle', () => {
      if (mapEle.current) {
        mapEle.current.classList.add('show-map');
      }
    });

    function addMarkers() {
      /* locations.forEach((markerData) => {
        let infoWindow = new google.maps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });
  
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerData.lat, markerData.lng),
          map: map.current!,
          title: markerData.name
        });
  
        marker.addListener('click', () => {
          infoWindow.open(map.current!, marker);
        });
      }); */
    }

  }, []);

  return (
    <div ref={mapEle} className="map-canvas"></div>
  );
}

export default Map;