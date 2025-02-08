import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.fullstackpro.ionic.capacitor',
  appName: 'Ionic Capacitor',
  webDir: 'www',
  android: {
    allowMixedContent: true
  }
};

export default config;