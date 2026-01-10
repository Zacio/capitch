import { Router } from "express";
import type { Request, Response } from "express";
import {
    createQuestion,
    getQuestionById,
    getAllQuestions,
    getDbQuizQuestionByquizzId,
    deleteQuestion,
    deleteQuestionsByQuizId,
    countQuestionsByQuizId
} from "../controllers/questionController";

export function createQuestionRoutes() {
    const router = Router();

    router.post("/", async (req: Request, res: Response) => {
        try {
            const { title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, quizzId } = req.body;
            
            if (!title || !correctAnswer || !incorrectAnswer1 || !incorrectAnswer2 || !incorrectAnswer3 || !quizzId) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const id = await createQuestion({
                title,
                correctAnswer,
                incorrectAnswer1,
                incorrectAnswer2,
                incorrectAnswer3,
                quizzId: parseInt(quizzId)
            });
            
            res.status(201).json({ message: "Question created", id });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.get("/", async (req: Request, res: Response) => {
        try {
            const questions = await getAllQuestions();
            res.json({ questions });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.get("/:id", async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id!);
            const question = await getQuestionById(id);
            res.json({ question });
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    });

    router.get("/quizz/:quizzId", async (req: Request, res: Response) => {
        try {
            const quizzId = parseInt(req.params.quizzId!);
            const questions = await getDbQuizQuestionByquizzId(quizzId);
            res.json({ questions });
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    });

    router.get("/quizz/:quizzId/count", async (req: Request, res: Response) => {
        try {
            const quizzId = parseInt(req.params.quizzId!);
            const count = await countQuestionsByQuizId(quizzId);
            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.delete("/:id", async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id!);
            await deleteQuestion(id);
            res.json({ message: "Question deleted" });
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    });

    router.delete("/quizz/:quizzId", async (req: Request, res: Response) => {
        try {
            const quizzId = parseInt(req.params.quizzId!);
            const deletedCount = await deleteQuestionsByQuizId(quizzId);
            res.json({ message: "Questions deleted", count: deletedCount });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    return router;
}
