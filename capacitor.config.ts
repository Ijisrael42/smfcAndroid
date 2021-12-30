import { CapacitorConfig } from '@capacitor/cli';

const config = {
  appId: 'com.smfc.tutors',
  appName: 'smfc',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
      PushNotifications: { presentationOptions: ["badge", "sound", "alert"], },
      GoogleAuth: {
      "scopes": ["profile","email"],
      "serverClientId": "968241431019-rb0hh1ncpisdbjd5r3qhjkomu5kg9esj.apps.googleusercontent.com"
      }
  },
};

export default config;
