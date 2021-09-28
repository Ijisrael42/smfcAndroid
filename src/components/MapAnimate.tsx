import React, { useRef, useEffect } from 'react';
declare var google:any;

const MapAnimate: React.FC = () => {
  const mapEle:any = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();

  useEffect(() => {

    map.current = new google.maps.Map(mapEle.current, {
      center: { lat: 18.559008, lng: -68.388881 },
      zoom: 16,
      mapTypeId: "terrain",

    });

    const lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      strokeColor: "#393",
    };
  
    // Create the polyline and add the symbol to it via the 'icons' property.
    let line = new google.maps.Polyline({
      path: [
        { lat: 18.558908, lng: -68.389916 },
        { lat: 18.558853, lng: -68.389922 },
        { lat: 18.558375, lng: -68.389729 },
        { lat: 18.558032, lng: -68.389182 },
        { lat: 18.55805, lng: -68.388613 },
        { lat: 18.558256, lng: -68.388213 },
        { lat: 18.558744, lng: -68.387929 }
      ],
      icons: [
        {
          icon: lineSymbol,
          offset: "100%",
        },
      ],
      map: map.current,
    });
  
    animateCircle(line);

    google.maps.event.addListenerOnce(map.current, 'idle', () => {
      if (mapEle.current) {
        mapEle.current.classList.add('show-map');
      }
    });

    function animateCircle(line: google.maps.Polyline) {
      let count = 0;
      window.setInterval(() => {
        count = (count + 1) % 200;
    
        const icons = line.get("icons");
        icons[0].offset = count / 2 + "%";
        line.set("icons", icons);
      }, 20);
    }

  }, []);


  return (
    <div ref={mapEle} className="map-canvas"></div>
  );
}

export default MapAnimate;