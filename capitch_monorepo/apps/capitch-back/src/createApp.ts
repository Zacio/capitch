import express from 'express';
import { createGameRoutes } from './routes/gameRoutes';
import { createQuizzRoutes } from './routes/quizzRoutes';
import { createQuestionRoutes } from './routes/questionRoutes';
import { createLaptopRoutes } from './routes/laptopRoutes';
import { createStudentRoutes } from './routes/studentRoutes';
import { createTrainerRoutes } from './routes/trainerRoutes';
import cors from "cors";


export function createApp() {
    const app = express()

    app.use(cors());
    app.use(express.json());

    app.use("/game", createGameRoutes());
    app.use("/quizz", createQuizzRoutes());
    app.use("/question", createQuestionRoutes());
    app.use("/laptop", createLaptopRoutes());
    app.use("/student", createStudentRoutes());
    app.use("/trainer", createTrainerRoutes());

    return app
}