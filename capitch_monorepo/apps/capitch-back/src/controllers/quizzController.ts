import { db } from "../database";

export interface Quizz {
    id?: number;
    title: string;
}

export async function createQuizz(quizz: Omit<Quizz, 'id'>) {
    const result = await db!.execute(
        `INSERT INTO QUIZZES (title) VALUES (?)`,
        [quizz.title]
    );
    return result.insertId;
}

export async function getQuizzById(id: number) {
    const quizz = await db!.query(
        `SELECT id, title FROM QUIZZES WHERE id = ?`,
        [id]
    );
    if (quizz.length === 0) {
        throw new Error("No quizz found with id " + id);
    }
    return quizz[0];
}

export async function getAllQuizzes() {
    const quizzes = await db!.query(
        `SELECT id, title FROM QUIZZES`
    );
    return quizzes;
}

export async function updateQuizz(id: number, quizz: Partial<Omit<Quizz, 'id'>>) {
    if (quizz.title === undefined) {
        throw new Error("No fields to update");
    }

    const result = await db!.execute(
        `UPDATE QUIZZES SET title = ? WHERE id = ?`,
        [quizz.title, id]
    );
    
    if (result.affectedRows === 0) {
        throw new Error("No quizz found with id " + id);
    }
    
    return result.affectedRows;
}

export async function deleteQuizz(id: number) {
    const result = await db!.execute(
        `DELETE FROM QUIZZES WHERE id = ?`,
        [id]
    );
    
    if (result.affectedRows === 0) {
        throw new Error("No quizz found with id " + id);
    }
    
    return result.affectedRows;
}

export async function getQuizzWithQuestions(id: number) {
    const quizz = await getQuizzById(id);
    const questions = await db!.query(
        `SELECT id, title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 
         FROM QUESTIONS WHERE quizzId = ?`,
        [id]
    );
    return {
        ...quizz,
        questions
    };
}

export async function countAllQuizzes() {
    const result = await db!.query(
        `SELECT COUNT(*) as count FROM QUIZZES`
    );
    return result[0].count;
}
