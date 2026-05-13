import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import AppRouter from './routes/AppRouter.jsx'
import "./index.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <AppRouter />
    </ThemeProvider>
  </StrictMode>
)
