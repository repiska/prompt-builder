import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative base so it works on GitHub Pages under any path.
export default defineConfig({
  plugins: [react()],
  base: './',
})
