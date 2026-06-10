import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const isVercelBuild = process.env.VERCEL === '1' || process.env.VERCEL === 'true'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: isVercelBuild ? false : {
        name: 'WA Açaí',
        short_name: 'WA Açaí',
        description: 'Cardápio, pedidos e estoque de açaí.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#12081d',
        theme_color: '#6F2DBD',
      },
      includeAssets: ['icons/icon.svg', 'icons/icon-maskable.svg'],
      workbox: {
        navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    port: 5173,
    cors: {
      origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://waacaipython.vercel.app',
      ],
    },
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/ws': {
        target: 'ws://127.0.0.1:8000',
        ws: true,
      },
    },
  },
})
