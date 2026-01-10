import { Router } from "express";
import type { Request, Response } from "express";
import {
    createQuizz,
    getQuizzById,
    getAllQuizzes,
    getQuizzWithQuestions,
    countAllQuizzes
} from "../controllers/quizzController";

export function createQuizzRoutes() {
    const router = Router();

    router.post("/", async (req: Request, res: Response) => {
        try {
            const { title } = req.body;
            if (!title) {
                return res.status(400).json({ error: "Title is required" });
            }
            const id = await createQuizz({ title });
            res.status(201).json({ message: "Quizz created", id });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.get("/", async (req: Request, res: Response) => {
        try {
            const quizzes = await getAllQuizzes();
            res.json({ quizzes });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.get("/count", async (req: Request, res: Response) => {
        try {
            const count = await countAllQuizzes();
            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.get("/:id", async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id!);
            const quizz = await getQuizzById(id);
            res.json({ quizz });
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    });

    router.get("/:id/questions", async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id!);
            const quizz = await getQuizzWithQuestions(id);
            res.json({ quizz });
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    });

    return router;
}
