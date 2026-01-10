import { useEffect, useMemo, useState } from "react";
import QuizzSelector from "@repo/capitch-front/components/QuizzSelector";
import ParticipantsList from "@repo/capitch-front/components/ParticipantsList";
import "./waiting-room.css";

export default function TrainerWaitingRoom() {
  const roomId = useMemo(() => window.location.pathname.split("/").filter(Boolean).pop() || "", []);
  const [trainer, setTrainer] = useState<{ id: string; name: string | null } | null>(null);
  const [participants, setParticipants] = useState<{ id: string; name: string | null }[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("trainerInfo") || "{}");
    
    if (!info.id) {
      setError("No trainer info found - please join through the join page first");
      // Clear any student info that might be lingering
      localStorage.removeItem("studentInfo");
      setTimeout(() => {
        window.location.href = "/play-form?role=trainer";
      }, 2000);
      return;
    }
    
    setTrainer({ id: info.id, name: info.name ?? null });

    fetch(`http://localhost:5001/laptop/room/${roomId}`, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((data) => {
        const room = data.room;
        if (room?.trainer) setTrainer({ id: room.trainer.id, name: room.trainer.name });
        if (room?.player) setParticipants(room.player.map((p: any) => ({ id: p.id, name: p.name })));
      })
      .catch(() => {});

    const websocket = new WebSocket("ws://localhost:5001");
    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          type: "joinRoomAsTrainer",
          roomId,
          trainerInfo: { id: info.id, name: info.name, score: null, answers: null, role: "trainer" },
        })
      );
    };
    websocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "studentJoined") {
        setParticipants((prev) => [...prev, { id: msg.student.id, name: msg.student.name }]);
      }
      if (msg.type === "participantLeft") {
        setParticipants((prev) => prev.filter((p) => p.id !== msg.clientId));
      }
    };
    setWs(websocket);
    return () => websocket.close();
  }, [roomId]);

  async function removeStudent(id: string) {
    await fetch(`http://localhost:5001/student/leave/${roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ studentId: id }),
    });
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }

  async function startGame() {
    const res = await fetch(`http://localhost:5001/trainer/startQuizz/${roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Start failed: ${err.error || res.statusText}`);
      return;
    }
    alert("Game started!");
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="waiting-room-container">
      <h2>Trainer Waiting Room</h2>
      <div className="room-info">
        <strong>Room:</strong> {roomId}
      </div>
      <div className="trainer-info">
        <strong>Trainer:</strong> {trainer?.name || "Anonymous"} ({trainer?.id})
      </div>

      <QuizzSelector roomId={roomId} onSet={() => {}} />

      <div className="participants-section">
        <h3>Participants</h3>
        <ParticipantsList participants={participants} canRemove={true} onRemove={removeStudent} />
      </div>

      <div className="action-buttons">
        <button onClick={startGame} className="start-button">
          Start Game
        </button>
      </div>
    </div>
  );
}
