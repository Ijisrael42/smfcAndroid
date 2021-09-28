import { IonButton } from '@ionic/react';
import React, { useRef, useEffect, useState } from 'react';
import { config } from '../helpers/config';

const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAjPYLPZnfhQYszOkRp4BcHtEvJc3NJ7js&libraries=places`;
declare var google:any;

const Map: React.FC = () => { 
  const mapEle:any = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  const marker = useRef<google.maps.Marker>();
  let origin:any, current:any, originPolyline:any, currentPolyline:any, timer:any, frame:any;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {

    const googleMapScript = document.createElement('script');
    googleMapScript.src= scriptUrl;
    googleMapScript.async = true;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {

      const lineSymbol = { 
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: "#393",
      };

      origin = current = { lat: -25.731340, lng: 28.218370 }; // Pretoria
      map.current = new google.maps!.Map(mapEle.current, { center: origin, zoom: 16, mapTypeId: "terrain", });
      marker.current = new google.maps!.Marker({  map: map.current!, position: origin  });
      originPolyline = new google.maps.Polyline({ path: [ origin, origin], map: map.current! });

      let startTime = new Date().getTime();

      google.maps!.event.addListenerOnce(map.current, 'idle', () => {
        if (mapEle.current) {
          mapEle.current.classList.add('show-map');
        }
      });

      handlePermission();

      function handlePermission() {
        navigator.permissions.query({name:'geolocation'}).then(function(result) {
          if (result.state == 'granted') {
            report(result.state);
            getLocation();
          } else if (result.state == 'prompt') {
            report(result.state);
            getLocation();
          } else if (result.state == 'denied') {
            report(result.state);
            setEnabled(true);
            // geoBtn.style.display = 'inline';
          }
          result.onchange = function() {
            report(result.state);
          }
        });
      }

      function report(state: string) {
        console.log('Permission ' + state);
      }      

      function getLocation() {
        if ('geolocation' in navigator) {

          navigator.geolocation.getCurrentPosition(
            position => {
              
              console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);
              // alert(`In Current Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

              origin = current = { lat: position.coords.latitude, lng: position.coords.longitude };
              marker.current!.setPosition(origin);
              map.current!.panTo(origin);
              
              navigator.geolocation.watchPosition(
                position => updateLocation(position),
                err =>  alert(`Error (${err.code}): ${err.message}`)
              );
      
            },
            err => { alert(`Error (${err.code}): ${err.message}`) }
          );

        } else  alert('Geolocation is not supported by your browser.');

      }

      function updateLocation(position: any) {

        console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);
        // alert(`In Watch Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`);

        const positionLatlong = { lat: position.coords.latitude, lng: position.coords.longitude };

        const delta = new Date().getTime() - startTime;
        if( current === origin || delta > 90000 ) 
        {
          // alert("Delta > 90000 is");
          startTime = delta;
          animate(positionLatlong); 

          /* const metres = ( window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(current),
            new window.google.maps.LatLng(positionLatlong)
          )); 

          // console.log(metres)
          // Animate at the begining and after the stipulated metres
          if( current === origin || metres > 100 )  {
            // alert("Metres: " + metres );
            animate(positionLatlong);   
          } */

        }  
      }
      
      // Use the DOM setInterval() function to change the offset of the symbol
      // at fixed intervals.
      function animate(positionLatlong: any) {

        if(currentPolyline) currentPolyline.set("icons", null);

        originPolyline.setPath([origin, current]);
        currentPolyline = new google.maps.Polyline({
          path: [ current, positionLatlong],
          icons: [ { icon: { 
            path: config.carPath2, scale: .03, fillColor: 'blue', fillOpacity: 1, rotation: 180, }, 
            offset: "100%", 
            fixedRotation: true
          },], // icons: [ { icon: lineSymbol, offset: "100%", }, ],
          map: map.current!,
        });

        map.current?.panTo(positionLatlong);
        animateCircle(currentPolyline); 
        current = positionLatlong;

      }      
      
      function animateCircle(line: google.maps.Polyline) {

        let start = Date.now();
        let count = 0;

        window.requestAnimationFrame(function animateBall() {
            let interval = Date.now() - start;

            count = (count + 1) % 200;

            const icons = line.get("icons");
            icons[0].offset = count / 2 + "%";
            line.set("icons", icons);

            if( count === 199 ) return;
            if (interval < 10000) window.requestAnimationFrame(animateBall); // queue request for next frame

        });
        
      }

      /* function animateCircle(line: google.maps.Polyline) {

        let count = 0;
        if( timer ) window.clearInterval(timer);

        timer = window.setInterval(() => {
          count = (count + 1) % 200;

          const icons = line.get("icons");
          icons[0].offset = count / 2 + "%";
          line.set("icons", icons);
          // console.log(count)
          
          if( count === 199 ) window.clearInterval(timer);

        }, 10000);
      } */

    });
    
  }, []);

  return (
    <>
      <div ref={mapEle} className="map-canvas"></div>
      {enabled && (<IonButton >Enable Location</IonButton>)}
    </>
  );
}

export default Map;
