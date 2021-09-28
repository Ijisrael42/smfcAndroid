import React, { useRef, useEffect, useState } from 'react';

const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAjPYLPZnfhQYszOkRp4BcHtEvJc3NJ7js&libraries=places`;

const MapReturn: React.FC = () => {
  const mapEle:any = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  const marker = useRef<google.maps.Marker>();
  const line = useRef<google.maps.Polyline>();

  const [latlong, setLatlong] = useState<any>();
  const [location, setLocation] = useState<any>();

  useEffect(() => {

    const googleMapScript = document.createElement('script');
    googleMapScript.src= scriptUrl;
    googleMapScript.async = true;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {

      const currLatlong = { lat: 18.559008, lng: -68.388881 };
      let slatlong:any = currLatlong;
      let timer:any;

      map.current = new google.maps!.Map(mapEle.current, { center: currLatlong, zoom: 16, mapTypeId: "terrain", });
      marker.current = new google.maps!.Marker({  map: map.current!, position: currLatlong  });

      const lineSymbol = { 
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: "#393",
      };

      // Create the polyline and add the symbol to it via the 'icons' property.
      line.current = new google.maps.Polyline({
        path: [ slatlong, currLatlong],
        icons: [ { icon: lineSymbol, offset: "100%", }, ],
        map: map.current!,
      });

      google.maps!.event.addListenerOnce(map.current, 'idle', () => {
        if (mapEle.current) {
          mapEle.current.classList.add('show-map');
        }
      });

      if ('geolocation' in navigator) {

        navigator.geolocation.getCurrentPosition(
          position => {
            const currLatlong = { lat: position.coords.latitude, lng: position.coords.longitude };
            setLocation(currLatlong);
            slatlong = currLatlong;
      
            console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);
            // alert(`In Current Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

            marker.current!.setPosition(currLatlong);
            map.current!.panTo(currLatlong);
            
            navigator.geolocation.watchPosition(
              position => updateLocation(position),
              err =>  alert(`Error (${err.code}): ${err.message}`)
            );
    
          },
          err => { alert(`Error (${err.code}): ${err.message}`) }
        );

      } else  alert('Geolocation is not supported by your browser.');

      function updateLocation(position: any) {
        const currLatlong = { lat: position.coords.latitude, lng: position.coords.longitude };
        drawSymbol( slatlong, currLatlong);
        setLatlong(currLatlong);

        console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);
        // alert(`In Watch Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

        marker.current!.setPosition(currLatlong);
        map.current!.panTo(currLatlong);

      }

      const drawSymbol = ( from: any, to: any) => {

        // Define the symbol, using one of the predefined paths ('CIRCLE')
        // supplied by the Google Maps JavaScript API.
        line.current!.setPath([from, to]);
        animateCircle(line.current!);          
      };
      
      // Use the DOM setInterval() function to change the offset of the symbol
      // at fixed intervals.
      function animateCircle(line: google.maps.Polyline) {

        let count = 0;
        if( timer ) window.clearInterval(timer);

        timer = window.setInterval(() => {
          count = (count + 1) % 200;

          const icons = line.get("icons");
          icons[0].offset = count / 2 + "%";
          line.set("icons", icons);
          console.log(count)
          
          if( count === 199 ) window.clearInterval(timer);

        }, 100);
      }

    });

  }, []);

  return (
      <div ref={mapEle} className="map-canvas"></div>
  );
}

export default MapReturn;
