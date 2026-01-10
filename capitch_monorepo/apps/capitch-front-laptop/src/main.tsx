//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import WaitingRoom from './pages/waiting-trainer.tsx'
import ParticipentProvider from '@repo/capitch-front/pages/contextProvider'


createRoot(document.getElementById('root')!).render(
  <>
    <h1>Capitch ?</h1>
    <ParticipentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
        </Routes>
      </BrowserRouter>
    </ParticipentProvider>

  </>,
)