import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.best-nwachinemere.timely',
  appName: 'timeflow-daily-rhythm',
  webDir: 'dist',
  server: {
    url: 'https://best-nwachinemere.github.io/Timely/',
    cleartext: false
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
