import { useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import JoinForm from "@repo/capitch-front/components/JoinForm";
import "./join-game.css";

export default function JoinGame() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Determine role from query params or URL
    const roleParam = searchParams.get("role");
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    const currentRole = (roleParam === "trainer" || roleParam === "student") 
      ? roleParam 
      : (parts[0] === "trainer" ? "trainer" : "student");
    
    // Clear the opposite role's info to start fresh
    const otherKey = currentRole === "trainer" ? "studentInfo" : "trainerInfo";
    localStorage.removeItem(otherKey);
  }, [searchParams]);
  
  const role = useMemo(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "trainer" || roleParam === "student") {
      return roleParam;
    }
    
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    return parts[0] === "trainer" ? "trainer" : "student";
  }, [searchParams]) as "trainer" | "student";

  const handleClearStorage = () => {
    localStorage.removeItem("trainerInfo");
    localStorage.removeItem("studentInfo");
    window.location.reload();
  };

  return (
    <div className="join-game-container">
      <h2>Join Room</h2>
      <p>Role: {role}</p>
      
      <button onClick={handleClearStorage} className="clear-storage-btn">
        Clear Previous Session
      </button>
      
      <JoinForm
        role={role}
        onJoined={(info) => {
          const otherKey = role === "trainer" ? "studentInfo" : "trainerInfo";
          localStorage.removeItem(otherKey);
          
          const key = role === "trainer" ? "trainerInfo" : "studentInfo";
          localStorage.setItem(key, JSON.stringify(info));
          navigate(`/waiting-room/${info.roomId}`);
        }}
      />
    </div>
  );
}
