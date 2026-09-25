import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Prevent the homepage from painting before the first-session intro is ready.
try {
  if (!sessionStorage.getItem('gokana_intro_shown')) {
    document.documentElement.classList.add('intro-pending')
  }
} catch {
  // If sessionStorage is unavailable, let the app render normally.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
