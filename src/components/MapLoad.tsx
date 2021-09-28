import React, { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: "AIzaSyAjPYLPZnfhQYszOkRp4BcHtEvJc3NJ7js",
  version: "weekly",
  libraries: ["places"]
});

const MapLoad: React.FC = () => {
  const mapEle:any = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  const marker = useRef<google.maps.Marker>();
  const [latlong, setLatlong] = useState<any>();
  const [location, setLocation] = useState<any>();
  const [google, setGoogle] = useState<any>();

  useEffect(() => {

    loader.load()
    .then((google) => {
      setGoogle(google);
      const currLatlong = { lat: 18.559008, lng: -68.388881 };
      setLatlong(currLatlong);

      map.current = new google.maps!.Map(mapEle.current, {
        center: currLatlong,
        zoom: 16,
        mapTypeId: "terrain",
      });
    
      marker.current = new google.maps!.Marker({  map: map.current!, position: currLatlong  });
    
      google.maps!.event.addListenerOnce(map.current, 'idle', () => {
        if (mapEle.current) {
          mapEle.current.classList.add('show-map');
        }
      });

    }).catch(e => console.log(e)); 

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currLatlong = { lat: position.coords.latitude, lng: position.coords.longitude };
          setLocation(currLatlong);
    
          console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);
          alert(`In Current Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

          marker.current!.setPosition(currLatlong);
          map.current!.panTo(currLatlong);

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

    function updateLocation(position: any) {
      const currLatlong = { lat: position.coords.latitude, lng: position.coords.longitude };
      drawSymbol( latlong, currLatlong);
      setLatlong(currLatlong);

      console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);
      alert(`In Watch Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

      marker.current!.setPosition(currLatlong);
      map.current!.panTo(currLatlong);

    }

    const drawSymbol = ( from: any, to: any) => {

      // Define the symbol, using one of the predefined paths ('CIRCLE')
      // supplied by the Google Maps JavaScript API.

      loader.load()
      .then((google) => {
  
        const lineSymbol = { 
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          strokeColor: "#393",
        };

        // Create the polyline and add the symbol to it via the 'icons' property.
        const line = new google.maps.Polyline({
          path: [ from, to],
          icons: [ { icon: lineSymbol, offset: "100%", }, ],
          map: map.current!,
        });

        animateCircle(line);
      }).catch(e => console.log(e)); 

    };
    
    // Use the DOM setInterval() function to change the offset of the symbol
    // at fixed intervals.
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

export default MapLoad;
