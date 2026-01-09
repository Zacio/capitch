import useWebSocket from "react-use-websocket";
import { useState, useEffect } from "react";
import { useParticipent } from './contextProvider';
import CapitchButton from '../components/capitch-button';
import { Link } from 'react-router';

function MainMenu() {
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
        console.log("new ID from server:", data.newId);

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
      <CapitchButton><Link to="/waiting-room">Screen display</Link></CapitchButton>
      <CapitchButton>Play</CapitchButton>
      <div>Connected people: {clientCount}</div>

    </>
  )
}

export default MainMenu