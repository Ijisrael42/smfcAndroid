import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';

const AppUrlListener: React.FC<any> = () => {
  let history = useHistory();
  useEffect(() => {

    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
    });

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2
      const slug = event.url.split('.app').pop();
      if (slug) {
        history.push(slug);
      }
      // If no match, do nothing - let regular routing
      // logic take over
    });

/*     const checkAppLaunchUrl = async () => {
      const url:any = await App.getLaunchUrl();
    
      alert('App opened with URL: ' + url);
      history.push(url);

    };

    checkAppLaunchUrl();
 */
  }, []);

  return null;
};

export default AppUrlListener;