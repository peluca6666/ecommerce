import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],server: {
    proxy: {
        '/categoria': 'http://localhost:3000/api',
        '/producto': 'http://localhost:3000/api',
    },
     port: 5173,       
    strictPort: true, 
    
  }
});

