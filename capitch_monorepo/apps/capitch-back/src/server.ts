import {initDatabase} from "./database";
import { Request, Response } from "express";
import express from "express";
import { WebSocketServer, WebSocket } from "ws"
import { createServer } from "node:http"
import  type {participent} from "@repo/common/type";
import { createApp } from "./createApp";
const room = {}
interface PlayerWebSocket extends WebSocket {
  playerInfo: participent | null;
}

initDatabase();
console.log("test")
const app = createApp()
const PORT = 5001;
const server = createServer(app)


app.get("/", (req: Request, res: Response) => {
  res.send("Hello from capitch Node.js server!");
});

export const wss = new WebSocketServer({ server })

function broadcastClientCount() {
  const count = wss.clients.size;
  const message = JSON.stringify({ type: "clientCount", count });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }); 
}

wss.on("connection", (ws : PlayerWebSocket) => {
  broadcastClientCount();
  ws.playerInfo = {
    id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name: null,
    score: 0,
    answers: [],
    role: null,
  }; 
console.log(ws.playerInfo.id)

const message = JSON.stringify({type: "newId", newId: ws.playerInfo.id})
if(ws.readyState === WebSocket.OPEN){
  ws.send(message)
}


  ws.on("close", () => {
    broadcastClientCount();
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});