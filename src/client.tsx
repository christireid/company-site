import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Accessibility from './pages/Accessibility'
import Specimen from './pages/Specimen'
import './styles/globals.css'

history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

/* Tiny path router — vercel.json rewrites every non-API path to index.html. */
function route() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/accessibility') return <Accessibility />
  if (path === '/dev/specimen') return <Specimen />
  return <App />
}

const root = document.getElementById('root')!
createRoot(root).render(<React.StrictMode>{route()}</React.StrictMode>)
