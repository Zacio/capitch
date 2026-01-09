import {initDatabase} from "./database";
import { Request, Response } from "express";
import express from "express";
import { WebSocketServer } from "ws"
import { createServer } from "node:http"
import { stringify } from "node:querystring";

initDatabase();
console.log("test")

const app = express();
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

wss.on("connection", (ws) => {
  broadcastClientCount();
  (ws as any).id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`
console.log(ws)
  ws.on("close", () => {
    broadcastClientCount();
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});