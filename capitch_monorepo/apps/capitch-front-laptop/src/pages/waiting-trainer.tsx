import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import "./waiting-trainer.css"

function WaitingRoom() {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [trainerJoined, setTrainerJoined] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [trainer, setTrainer] = useState<any>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    // Clear localStorage for a fresh start
    localStorage.removeItem("trainerInfo");
    localStorage.removeItem("studentInfo");

    // Create room when component mounts
    fetch("http://localhost:5001/laptop/createRoom", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json" 
      },
      body: JSON.stringify({ 
        streamerId: `streamer_${Date.now()}` 
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Room created:", data)
        setRoomId(data.roomId)
      })
      .catch((err) => console.error("Failed to create room:", err))
  }, [])

  useEffect(() => {
    if (!roomId) return

    // Connect to WebSocket
    const websocket = new WebSocket("ws://localhost:5001")
    
    websocket.onopen = () => {
      console.log("WebSocket connected")
      // Notify server that streamer has joined
      websocket.send(JSON.stringify({
        type: "streamerJoined",
        roomId: roomId
      }))
    }

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log("WebSocket message:", message)

      switch (message.type) {
        case "trainerJoined":
          setTrainerJoined(true)
          setTrainer(message.trainer)
          if (message.participants) {
            setParticipants(message.participants)
          }
          break
        
        case "studentJoined":
          setParticipants(prev => [...prev, message.student])
          break
        
        case "participantLeft":
          setParticipants(prev => prev.filter(p => p.id !== message.clientId))
          break
      }
    }

    setWs(websocket)

    return () => {
      websocket.close()
    }
  }, [roomId])

  const trainerUrl = `http://localhost:3000/play-form?role=trainer`
  const participantUrl = `http://localhost:3000/play-form?role=student`

  if (!roomId) {
    return <p>Creating room...</p>
  }

  if (!trainerJoined) {
    return (
      <div className="waiting-room-wrapper">
        <h2>Waiting for Trainer...</h2>
        <p className="room-id">Room ID: {roomId}</p>
        
        <div className="qr-section">
          <h3>Trainer Join Link:</h3>
          <p className="join-link">{trainerUrl}</p>
          
          <div className="qr-code">
            <QRCode value={trainerUrl} size={256} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="room-active-wrapper">
      <h2>Room Active</h2>
      <p className="room-id">Room ID: {roomId}</p>

      <div className="trainer-section">
        <h3>Trainer:</h3>
        <div className="trainer-card">
          <p><strong>Name:</strong> {trainer?.name || "Anonymous"}</p>
          <p><strong>ID:</strong> {trainer?.id}</p>
        </div>
      </div>

      <div className="participants-section">
        <h3>Participants ({participants.length}):</h3>
        {participants.length === 0 ? (
          <p>No participants yet...</p>
        ) : (
          <div className="participants-list">
            {participants.map((p) => (
              <div key={p.id} className="participant-card">
                <p><strong>Name:</strong> {p.name || "Anonymous"}</p>
                <p><strong>ID:</strong> {p.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="qr-section">
        <h3>Student Join Link:</h3>
        <p className="join-link">{participantUrl}</p>
        
        <div className="qr-code">
          <QRCode value={participantUrl} size={256} />
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom