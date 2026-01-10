import { useEffect, useMemo, useState } from "react";
import ParticipantsList from "@repo/capitch-front/components/ParticipantsList";
import "./waiting-room.css";

export default function StudentWaitingRoom() {
  const roomId = useMemo(() => window.location.pathname.split("/").filter(Boolean).pop() || "", []);
  const [trainer, setTrainer] = useState<{ id: string; name: string | null } | null>(null);
  const [participants, setParticipants] = useState<{ id: string; name: string | null }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("studentInfo") || "{}");

    if (!info.id) {
      setError("No student info found - please join through the join page first");
      // Clear any trainer info that might be lingering
      localStorage.removeItem("trainerInfo");
      setTimeout(() => {
        window.location.href = "/play-form?role=student";
      }, 2000);
      return;
    }

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
          type: "joinRoomAsStudent",
          roomId,
          studentInfo: { id: info.id, name: info.name, score: 0, answers: [], role: "student" },
        })
      );
    };
    websocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "trainerJoined") {
        setTrainer({ id: msg.trainer.id, name: msg.trainer.name });
      }
      if (msg.type === "studentJoined") {
        setParticipants((prev) => [...prev, { id: msg.student.id, name: msg.student.name }]);
      }
      if (msg.type === "participantLeft") {
        setParticipants((prev) => prev.filter((p) => p.id !== msg.clientId));
      }
      if (msg.type === "quizzStarted") {
        alert("Quizz started!");
      }
    };
    return () => websocket.close();
  }, [roomId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="waiting-room-container">
      <h2>Student Waiting Room</h2>
      <div className="room-info">
        <strong>Room:</strong> {roomId}
      </div>
      <div className="trainer-info">
        <strong>Trainer:</strong> {trainer?.name || "Waiting..."}
      </div>
      <div className="participants-section">
        <h3>Participants</h3>
        <ParticipantsList participants={participants} />
      </div>
      <p className="waiting-text">Waiting for trainer to start...</p>
    </div>
  );
}
