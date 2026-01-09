import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import WaitingRoom from './pages/waiting-trainer.tsx'
import ParticipentProvider from './contextProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Capitch ?</h1>
    <ParticipentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
        </Routes>
      </BrowserRouter>
    </ParticipentProvider>

  </StrictMode>,
)