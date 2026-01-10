import { sessionCapitch } from "@repo/common/type";
import { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { rooms } from "./laptopController";

interface ExtendedWebSocket extends WebSocket {
  id: string;
  sessionId?: string;
  role?: "streamer" | "trainer" | "student";
}

const activeClients = new Map<string, ExtendedWebSocket>();
const streamerConnections = new Map<string, ExtendedWebSocket>(); // Map roomId to streamer ws

export function createWssServer( server : Server ){
  const wss = new WebSocketServer({ server });

  // Broadcast à tous les clients
  function broadcastClientCount() {
    const count = wss.clients.size;
    const message = JSON.stringify({ type: "clientCount", count });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Broadcast à une session spécifique
  function broadcastToSession(sessionId: string, message: any) {
    const session = rooms[sessionId];
    if (!session) return;

    const allParticipants = [session.trainer, ...session.player];
    
    allParticipants.forEach(participant => {
      const ws = activeClients.get(participant.id);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Notifier le streamer lorsqu'un formateur rejoint
  function notifyStreamer(roomId: string, message: any) {
    const streamerWs = streamerConnections.get(roomId);
    if (streamerWs && streamerWs.readyState === WebSocket.OPEN) {
      streamerWs.send(JSON.stringify(message));
    }
  }

  wss.on("connection", (ws: ExtendedWebSocket) => {
    ws.id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    activeClients.set(ws.id, ws);

    ws.send(JSON.stringify({ type: "connectionId", id: ws.id }));
    broadcastClientCount();

    ws.on("message", (data: string) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "streamerJoined":
            const streamerRoomId = message.roomId;
            if (streamerRoomId) {
              ws.role = "streamer";
              ws.sessionId = streamerRoomId;
              streamerConnections.set(streamerRoomId, ws);
              console.log(`Streamer joined room: ${streamerRoomId}`);
            }
            break;

          case "joinRoomAsStudent":
            const { roomId: studentRoomId, studentInfo } = message;
            if (rooms[studentRoomId]) {
              ws.role = "student";
              ws.sessionId = studentRoomId;
              console.log(`Student joined room ${studentRoomId}: ${studentInfo.name} (ID: ${studentInfo.id})`);
              console.log(`Total students in room: ${rooms[studentRoomId].player.length}`);
              broadcastToSession(studentRoomId, {
                type: "studentJoined",
                student: studentInfo,
                totalStudents: rooms[studentRoomId].player.length
              });
            }
            break;

          case "joinRoomAsTrainer":
            const { roomId: trainerRoomId, trainerInfo } = message;
            if (rooms[trainerRoomId]) {
              // Check if trainer already joined (to prevent duplicates)
              if (rooms[trainerRoomId].trainer.id === trainerInfo.id) {
                console.log(`Trainer ${trainerInfo.id} already in room ${trainerRoomId}, skipping duplicate join`);
                break;
              }
              
              ws.role = "trainer";
              ws.sessionId = trainerRoomId;
              console.log(`Trainer joined room ${trainerRoomId}: ${trainerInfo.name} (ID: ${trainerInfo.id})`);
              broadcastToSession(trainerRoomId, {
                type: "trainerJoined",
                trainer: trainerInfo
              });
              // Notify streamer that trainer joined
              console.log(`Notifying streamer of trainer join in room ${trainerRoomId}`);
              notifyStreamer(trainerRoomId, {
                type: "trainerJoined",
                trainer: trainerInfo,
                participants: rooms[trainerRoomId].player
              });
            }
            break;

          case "startQuizz":
            if (ws.sessionId && rooms[ws.sessionId]?.ongoingQuizz) {
              broadcastToSession(ws.sessionId, {
                type: "quizzStarted",
                quizz: rooms[ws.sessionId]!.ongoingQuizz
              });
            }
            break;

          case "submitAnswer":
            if (ws.sessionId) {
              broadcastToSession(ws.sessionId, {
                type: "answerSubmitted",
                studentId: message.studentId,
                answer: message.answer
              });
            }
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      activeClients.delete(ws.id);
      
      // If streamer disconnects, remove from streamer connections
      if (ws.role === "streamer" && ws.sessionId) {
        streamerConnections.delete(ws.sessionId);
      }
      
      if (ws.sessionId && rooms[ws.sessionId]) {
        broadcastToSession(ws.sessionId, {
          type: "participantLeft",
          clientId: ws.id
        });
      }
      
      broadcastClientCount();
    });
  });

  return wss;
}
