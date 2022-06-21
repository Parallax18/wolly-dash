import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import Unocss from "unocss/vite";
import unoConfig from "./config/uno.config"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [
    svgr({
      exportAsDefault: true,
      svgrOptions: {
        dimensions: true,
        svgoConfig: {
          removeViewBox: false
        }
      }
    }),
    react(),
    Unocss(unoConfig)
  ],
	envPrefix: "APP_"
})
