
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fbf2e3feeab64899aeea9a7d6c93decd',
  appName: 'timeflow-daily-rhythm',
  webDir: 'dist',
  server: {
    url: 'https://fbf2e3fe-eab6-4899-aeea-9a7d6c93decd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#3E8EED',
      sound: 'beep.wav',
    },
  },
};

export default config;
