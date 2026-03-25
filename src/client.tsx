import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

const root = document.getElementById('root')!
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
