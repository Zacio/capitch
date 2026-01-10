import { rooms } from "./laptopController";
import type { participent } from "@repo/common/type";

export function joinRoomAsStudent(roomId: string, studentInfo: participent): participent {
    const room = rooms[roomId];
    
    if (!room) {
        throw new Error("Room not found");
    }
    
    // Check if student already exists in the room
    const existingStudent = room.player.find(p => p.id === studentInfo.id);
    if (existingStudent) {
        throw new Error("Student already in room");
    }
    
    const student = {
        ...studentInfo,
        role: "student" as const,
        score: 0,
        answers: []
    };
    
    // Add student to room
    room.player.push(student);
    
    return student;
}

export function leaveRoom(roomId: string, studentId: string): boolean {
    const room = rooms[roomId];
    
    if (!room) {
        throw new Error("Room not found");
    }
    
    const studentIndex = room.player.findIndex(p => p.id === studentId);
    if (studentIndex === -1) {
        throw new Error("Student not found in room");
    }
    
    room.player.splice(studentIndex, 1);
    return true;
}

export function submitAnswer(roomId: string, studentId: string, answer: number): boolean {
    const room = rooms[roomId];
    
    if (!room) {
        throw new Error("Room not found");
    }
    
    const student = room.player.find(p => p.id === studentId);
    if (!student) {
        throw new Error("Student not found in room");
    }
    
    if (!student.answers) {
        student.answers = [];
    }
    
    student.answers.push(answer);
    return true;
}
