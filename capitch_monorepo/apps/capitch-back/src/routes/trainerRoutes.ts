import { Router } from "express";
import type { Request, Response } from "express";
import { joinRoomAsTrainer, setQuizz, startQuizz } from "../controllers/trainerController";
import { getQuizzWithQuestions } from "../controllers/quizzController";

export function createTrainerRoutes() {
    const router = Router();

    // Join a room as trainer via URL parameter
    router.post("/join/:roomId", async (req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId;
            
            if (!roomId) {
                return res.status(400).json({ error: "roomId is required" });
            }
            
            const { trainerInfo } = req.body;
            
            if (!trainerInfo) {
                return res.status(400).json({ error: "trainerInfo is required" });
            }
            
            console.log(`[API] Trainer attempting to join room ${roomId}:`, trainerInfo);
            const trainer = joinRoomAsTrainer(roomId, trainerInfo);
            console.log(`[API] Trainer successfully joined room ${roomId}`);
            
            res.json({ 
                message: "Joined room as trainer successfully", 
                roomId,
                trainer
            });
        } catch (error) {
            console.error(`[API] Trainer join failed for room ${req.params.roomId}:`, (error as Error).message);
            res.status(400).json({ error: (error as Error).message });
        }
    });

    // Set quizz for a room
    router.post("/setQuizz/:roomId", async (req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId;
            
            if (!roomId) {
                return res.status(400).json({ error: "roomId is required" });
            }
            
            const { quizzId } = req.body;
            
            if (!quizzId) {
                return res.status(400).json({ error: "quizzId is required" });
            }
            
            const quizzData = await getQuizzWithQuestions(parseInt(quizzId));
            setQuizz(roomId, parseInt(quizzId), quizzData);
            res.json({ message: "Quizz set successfully" });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });

    // Start the quizz
    router.post("/startQuizz/:roomId", async (req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId;
            
            if (!roomId) {
                return res.status(400).json({ error: "roomId is required" });
            }
            
            startQuizz(roomId);
            res.json({ message: "Quizz started successfully" });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });

    return router;
}
