import useWebSocket from "react-use-websocket";
import { useState, useEffect } from "react";
import { useParticipent } from './contextProvider';
import CapitchButton from '../components/capitch-button';
import { Link, useNavigate } from 'react-router';

function MainMenu() {
  const { participent, setParticipent } = useParticipent();
  const [clientCount, setClientCount] = useState(0);
  const navigate = useNavigate();
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

  const handlePlayAsTrainer = () => {
    navigate("/play-form?role=trainer");
  };

  const handlePlayAsStudent = () => {
    navigate("/play-form?role=student");
  };

  return (
    <>
      <CapitchButton><Link to="/waiting-room">Screen display</Link></CapitchButton>
      
      <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
        <h3>Play as:</h3>
        <CapitchButton onClick={handlePlayAsTrainer}>Play as Trainer</CapitchButton>
        <CapitchButton onClick={handlePlayAsStudent}>Play as Student</CapitchButton>
      </div>
      
      <div style={{ marginTop: "20px" }}>Connected people: {clientCount}</div>
    </>
  )
}

export default MainMenu