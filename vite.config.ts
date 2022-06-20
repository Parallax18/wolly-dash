import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import Unocss from "unocss/vite";
import unoConfig from "./config/uno.config"

export default defineConfig({
  plugins: [
    react(),
    Unocss(unoConfig)
  ],
	envPrefix: "APP_"
})
