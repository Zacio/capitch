import { Router } from "express";

const rooms: { id: string; players: string[] }[] = [];

export function createGameRoutes() {
  const router = Router();

  router.get("/createRoom", (req, res) => {
    const newRoom = {
      id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      players: [],
    };

    rooms.push(newRoom);

    console.log("rooms:", rooms);

    res.json({
      message: "Room created",
      room: newRoom,
      totalRooms: rooms.length,
    });
  });

  router.get("/rooms", (req, res) => {
    res.json({ rooms });
  });

  return router;
}