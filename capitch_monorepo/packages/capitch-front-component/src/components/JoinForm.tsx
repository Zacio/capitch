import { useState } from "react";
import { Link } from "react-router";
import "./JoinForm.css";

type Role = "trainer" | "student";

export default function JoinForm({
  role,
  onJoined,
}: {
  role: Role;
  onJoined: (info: { id: string; name: string; role: Role; roomId: string }) => void;
}) {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [joinedRoomId, setJoinedRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!roomId.trim()) {
      alert("Room ID is required");
      return;
    }
    
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setIsLoading(true);
    
    const id = `${role}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const endpoint =
      role === "trainer"
        ? `http://localhost:5001/trainer/join/${roomId}`
        : `http://localhost:5001/student/join/${roomId}`;

    const body =
      role === "trainer"
        ? { trainerInfo: { id, name, score: null, answers: null, role: "trainer" } }
        : { studentInfo: { id, name, score: 0, answers: [], role: "student" } };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Join failed: ${err.error || res.statusText}`);
        setIsLoading(false);
        return;
      }
      
      setIsJoined(true);
      setJoinedRoomId(roomId);
      onJoined({ id, name, role, roomId });
      
    } catch (error) {
      alert(`Join failed: ${(error as Error).message}`);
      setIsLoading(false);
    }
  }

  if (isJoined) {
    return (
      <div className="join-form-success">
        <p>Successfully joined room!</p>
        <Link 
          to={`/waiting-room/${joinedRoomId}`}
          className="join-form-link"
        >
          Go to Waiting Room
        </Link>
      </div>
    );
  }

  return (
    <div className="join-form-container">
      <label>
        Room ID
        <input
          className="join-form-input"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          required
          disabled={isLoading}
        />
      </label>
      <label>
        Your name
        <input
          className="join-form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          disabled={isLoading}
        />
      </label>
      <button 
        onClick={handleSubmit} 
        className="join-form-button"
        disabled={isLoading}
        type="button"
      >
        {isLoading ? "Joining..." : "Join"}
      </button>
    </div>
  );
}
