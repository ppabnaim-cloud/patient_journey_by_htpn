import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)

/* Service worker: caches the shell, the posters and the OCR assets so the app
   opens with no connection. Registered after load so it never delays first
   paint. Failure is silent and harmless — the app simply needs the network. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
