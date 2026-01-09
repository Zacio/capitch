import { sessionCapitch } from "@repo/common/type";
import { Server } from "node:http";
import { json } from "node:stream/consumers";
import { WebSocketServer, WebSocket } from "ws";

interface ExtendedWebSocket extends WebSocket {
  id: string;
  sessionId?: string;
}
const gameSessions = new Map<string, sessionCapitch>();
const activeClients = new Map<string, ExtendedWebSocket>();

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
    const session = gameSessions.get(sessionId);
    if (!session) return;

    const allParticipants = [session.trainer, ...session.player];
    
    allParticipants.forEach(participant => {
      const ws = activeClients.get(participant.id);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
broadcastClientCount()
}
