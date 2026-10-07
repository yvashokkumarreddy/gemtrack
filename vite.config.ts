import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    // Pre-compressed copies of every asset (CloudFront / nginx serve these)
    compression({ algorithms: ['gzip', 'brotliCompress'], exclude: [/\.(png|jpe?g|gif|webp|svg|woff2?)$/i] }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      // Remove console.log/info/debug calls from production builds. console.error
      // stays, so real problems still show up in users' browsers and in monitoring.
      // (To strip every console call instead, use output.minify.compress.dropConsole.)
      treeshake: { manualPureFunctions: ['console.log', 'console.info', 'console.debug'] },
      output: {
        // Split the big libraries into their own files, so a code change in
        // the app doesn't make users re-download React, Redux, etc.
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/, priority: 40 },
            { name: 'query-vendor', test: /node_modules[\\/](@tanstack|axios)[\\/]/, priority: 30 },
            { name: 'state-vendor', test: /node_modules[\\/](@reduxjs|react-redux|redux|redux-persist|redux-thunk|immer|reselect)[\\/]/, priority: 30 },
            { name: 'form-vendor', test: /node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/, priority: 30 },
            { name: 'ui-vendor', test: /node_modules[\\/](lucide-react|react-toastify|clsx)[\\/]/, priority: 30 },
          ],
        },
      },
    },
  },
})
