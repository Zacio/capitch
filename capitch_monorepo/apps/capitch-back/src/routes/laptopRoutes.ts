import { Router } from "express";
import type { Request, Response } from "express";
import { createGame, rooms } from "../controllers/laptopController";

export function createLaptopRoutes() {
    const router = Router();

    router.post("/createRoom", async (req: Request, res: Response) => {
        try {
            const { streamerId } = req.body;
            if (!streamerId) {
                return res.status(400).json({ error: "streamerId is required" });
            }
            
            const roomId = createGame(streamerId);
            res.status(201).json({ 
                message: "Room created", 
                roomId,
                joinLink: `/join/${roomId}`,
                room: rooms[roomId]
            });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.get("/rooms", (req: Request, res: Response) => {
        res.json({ rooms });
    });

    // Get a specific room by ID (for when user clicks the link)
    router.get("/room/:roomId", (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        
        if (!roomId) {
            return res.status(400).json({ error: "roomId is required" });
        }
        
        const room = rooms[roomId];
        
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        
        res.json({ room });
    });

    return router;
}
