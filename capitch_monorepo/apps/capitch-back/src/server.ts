import {initDatabase} from "./database";
import { Request, Response } from "express";
import express from "express";

initDatabase();
console.log("test")

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from capitch Node.js server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

