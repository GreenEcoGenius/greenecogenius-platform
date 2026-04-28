import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

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
      resize: KeyboardResize.Native,
      style: KeyboardStyle.Dark,
    },
  },
};

export default config;
