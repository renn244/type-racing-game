import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './Context/ThemeContext.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import AuthProvider from './Context/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from './Context/SocketContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme' >
            <BrowserRouter>
              <App />
              <Toaster />
            </BrowserRouter>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
