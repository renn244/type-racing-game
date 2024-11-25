import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const __dirname = path.resolve();
// https://vite.dev/config/
export default defineConfig(({ mode}) => {
  const env = loadEnv(mode, process.cwd())
  
  const backendUrl = env.VITE_BACKEND_URL
  const socketUrl = env.VITE_SOCKET_URL

  if(!backendUrl) throw new Error('Backend API URL is not defined')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // for the rest API endpoints
        '/api': {
          target: backendUrl + '/api',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        // for socket
        '/socker.io': {
          changeOrigin: true,
          target: socketUrl, // change later
          ws: true
        },
      },
      // for docker
      // host: "0.0.0.0",
      // port: 5173
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
