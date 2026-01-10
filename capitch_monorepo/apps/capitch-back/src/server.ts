import {initDatabase} from "./database";
import { Request, Response } from "express";
import { createServer } from "node:http"
import { createApp } from "./createApp";
import { createWssServer } from "./controllers/wssController";

initDatabase();
console.log("test")
const app = createApp()
const PORT = 5001;
const server = createServer(app)


app.get("/", (req: Request, res: Response) => {
  res.send("Hello from capitch Node.js server!");
});

// Create WebSocket server
const wss = createWssServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});