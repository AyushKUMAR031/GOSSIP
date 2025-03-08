import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      REACT_APP_LOCALHOST_KEY: 'your_key_value'
    }
  },
  plugins: [react()],
})
