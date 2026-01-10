import session from "express-session"
import type { sessionCapitch } from "@repo/common/type";

export const rooms: Record<string, sessionCapitch> = {};

export const createGame = (streamerId: string): string => {
    const roomId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    rooms[roomId] = {
        id: roomId,
        name: "",
        player: [],
        trainer: {
            id: "",
            name: null,
            score: null,
            answers: null,
            role: "trainer"
        },
        ongoingQuizz: {
            name: "",
            questions: []
        }
    };
    
    return roomId;
}