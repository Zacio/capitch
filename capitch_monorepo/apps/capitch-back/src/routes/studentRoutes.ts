import { Router } from "express";
import type { Request, Response } from "express";
import { joinRoomAsStudent, leaveRoom, submitAnswer } from "../controllers/studentController";

export function createStudentRoutes() {
    const router = Router();

    // Join a room as student via URL parameter
    router.post("/join/:roomId", async (req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId;
            
            if (!roomId) {
                return res.status(400).json({ error: "roomId is required" });
            }
            
            const { studentInfo } = req.body;
            
            if (!studentInfo) {
                return res.status(400).json({ error: "studentInfo is required" });
            }
            
            console.log(`[API] Student attempting to join room ${roomId}:`, studentInfo);
            const student = joinRoomAsStudent(roomId, studentInfo);
            console.log(`[API] Student successfully joined room ${roomId}`);
            
            res.json({ 
                message: "Joined room successfully", 
                roomId,
                student
            });
        } catch (error) {
            console.error(`[API] Student join failed for room ${req.params.roomId}:`, (error as Error).message);
            res.status(400).json({ error: (error as Error).message });
        }
    });

    // Leave a room
    router.post("/leave/:roomId", async (req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId;
            
            if (!roomId) {
                return res.status(400).json({ error: "roomId is required" });
            }
            
            const { studentId } = req.body;
            
            if (!studentId) {
                return res.status(400).json({ error: "studentId is required" });
            }
            
            leaveRoom(roomId, studentId);
            res.json({ message: "Left room successfully" });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });

    // Submit an answer
    router.post("/answer/:roomId", async (req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId;
            
            if (!roomId) {
                return res.status(400).json({ error: "roomId is required" });
            }
            
            const { studentId, answer } = req.body;
            
            if (!studentId || answer === undefined) {
                return res.status(400).json({ error: "studentId and answer are required" });
            }
            
            submitAnswer(roomId, studentId, answer);
            res.json({ message: "Answer submitted successfully" });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });

    return router;
}
