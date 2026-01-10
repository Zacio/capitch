//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import TrainerWaitingRoom from './pages/waiting-room.tsx' 
import ParticipentProvider from '@repo/capitch-front/pages/contextProvider'
import JoinGame from '@repo/capitch-front/pages/join-game';


createRoot(document.getElementById('root')!).render(
  <>
    <h1>Capitch ?</h1>
    <ParticipentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/waiting-room/:roomId" element={<TrainerWaitingRoom />} />
          <Route path="/play-form" element={<JoinGame />} />
        </Routes>
      </BrowserRouter>
    </ParticipentProvider>
  </>,
)
