import { rooms } from "./laptopController";
import type { participent } from "@repo/common/type";

export function joinRoomAsTrainer(roomId: string, trainerInfo: participent): participent {
    const room = rooms[roomId];
    
    if (!room) {
        throw new Error("Room not found");
    }
    
    if (room.trainer.id !== "") {
        throw new Error("Room already has a trainer");
    }
    
    const trainer = {
        ...trainerInfo,
        role: "trainer" as const,
        score: null,
        answers: null
    };
    
    // Make sure trainer is NOT in the player list
    room.player = room.player.filter(p => p.id !== trainer.id);
    room.trainer = trainer;
    
    return trainer;
}

export function setQuizz(roomId: string, quizzId: number, quizzData: any): boolean {
    const room = rooms[roomId];
    
    if (!room) {
        throw new Error("Room not found");
    }
    
    room.ongoingQuizz = quizzData;
    return true;
}

export function startQuizz(roomId: string): boolean {
    const room = rooms[roomId];
    
    if (!room) {
        throw new Error("Room not found");
    }
    
    if (!room.ongoingQuizz.questions || room.ongoingQuizz.questions.length === 0) {
        throw new Error("No quizz set for this room");
    }
    
    return true;
}
