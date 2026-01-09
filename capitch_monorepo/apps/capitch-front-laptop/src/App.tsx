import MainMenu from '@repo/capitch-front/pages/main-menu';
import './App.css';
import useWebSocket from "react-use-websocket";
import { useState, useEffect } from "react";
import { useParticipent } from './contextProvider';

function App() {
  const { participent, setParticipent } = useParticipent();
  const [clientCount, setClientCount] = useState(0);
  const { lastMessage } = useWebSocket("ws://localhost:5001");

  useEffect(() => {
    console.log("Participent changed:", participent);
  }, [participent]);

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage.data);

      if (data.type === "clientCount") {
        setClientCount(data.count);
      } 
      else if (data.type === "newId") {
        console.log("Received new ID from server:", data.newId);

        setParticipent((prev) => {
          if (!prev) {
            return {
              id: data.newId,
              name: null,
              score: null,
              answers: [],
              role: null,
            };
          }
          return {
            ...prev,
            id: data.newId,
          };
        });
      }
    } catch (e) {
      console.error("Failed to parse WebSocket message", e);
    }
  }, [lastMessage]);

  return (
    <>
      <MainMenu />
      <div>Connected people: {clientCount}</div>
    </>
  );
}

export default App;
