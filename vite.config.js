import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    pluginRewriteAll(), 
    VitePWA({ 
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      // minify: false,
      // injectRegister: null,
      manifest: {
        id: '/',
        start_url: '/',
        name: 'Get Emojos',
        short_name: 'Emojos',
        icons: [
          {
            "src": "img/icon1024.png",
            "type": "image/png",
            "sizes": "1024x1024"
          }
        ],
        display: 'standalone'
      }, 
    })
  ],
})
