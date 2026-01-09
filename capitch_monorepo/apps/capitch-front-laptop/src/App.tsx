import MainMenu from '@repo/capitch-front/pages/main-menu'
import './App.css'
import useWebSocket from "react-use-websocket";
import { useState, useEffect } from "react";

function App() {
  const [clientCount, setClientCount] = useState(0);
  const { lastMessage } = useWebSocket("ws://localhost:5001");

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === "clientCount") {
          setClientCount(data.count);
        }
      } catch {}
    }
  }, [lastMessage]);

  return (
    <>
      <MainMenu/>
      <div>Connected people: {clientCount}</div>
    </>
  )
}

export default App
