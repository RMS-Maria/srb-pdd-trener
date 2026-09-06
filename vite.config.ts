import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path matches the GitHub Pages project URL (https://<user>.github.io/srb-pdd-trener/).
// Update this if the repo is renamed.
export default defineConfig({
  base: '/srb-pdd-trener/',
  plugins: [react()],
})
