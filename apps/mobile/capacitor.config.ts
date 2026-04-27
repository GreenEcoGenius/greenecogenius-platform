import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tech.greenecogenius.app',
  appName: 'GreenEcoGenius',
  webDir: 'out',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0A2F1F',
    scheme: 'GreenEcoGenius',
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A2F1F',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A2F1F',
    },
    Keyboard: {
      resize: 'native',
      style: 'DARK',
    },
  },
};

export default config;
