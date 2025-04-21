import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: "C:/Users/jakub/localhost.key",
      cert: "C:/Users/jakub/localhost.cert"
    },
    port: 5173 // nebo jakýkoli jiný port
  }
});