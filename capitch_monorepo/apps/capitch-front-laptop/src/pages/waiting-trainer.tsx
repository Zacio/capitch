import { useEffect } from "react"

function WaitingRoom() {
  
useEffect(() => {
  fetch("http://localhost:5001/game/createRoom", {
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((data) => console.log("Server response:", data))
    .catch((err) => console.error("Fetch failed:", err));
}, []);
    
  return (
    <>
      <p>Waiting for trainer...</p>
    </>
  )
}

export default WaitingRoom