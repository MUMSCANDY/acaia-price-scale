import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.mumsscale',
  appName: 'MUMS Scale',
  webDir: 'dist',
  // Enable hot-reload from web preview for debugging
  server: {
    url: 'https://4eaf5f36-5218-4ecd-badd-18f04a837b9f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
