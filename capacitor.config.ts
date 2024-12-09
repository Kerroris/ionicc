import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'contactos',
  webDir: 'www',
  plugins: { 
    Share: { 
      dialogTitle: 'Compartir video' 
    }}
};

export default config;
