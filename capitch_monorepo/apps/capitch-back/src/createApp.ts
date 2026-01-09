import express from 'express';
import { createGameRoutes } from './routes/gameRoutes';
import cors from "cors";


export function createApp() {
    const app = express()

    app.use(cors());

    app.use("/game", createGameRoutes());

    return app
}