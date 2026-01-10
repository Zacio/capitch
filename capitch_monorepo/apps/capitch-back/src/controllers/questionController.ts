import { db } from "../database";

export interface Question {
    id?: number;
    title: string;
    correctAnswer: string;
    incorrectAnswer1: string;
    incorrectAnswer2: string;
    incorrectAnswer3: string;
    quizzId: number;
}

export async function createQuestion(question: Omit<Question, 'id'>) {
    const result = await db!.execute(
        `INSERT INTO QUESTIONS (title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, quizzId) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [question.title, question.correctAnswer, question.incorrectAnswer1, question.incorrectAnswer2, question.incorrectAnswer3, question.quizzId]
    );
    return result.insertId;
}

export async function getQuestionById(id: number) {
    const question = await db!.query(
        `SELECT id, title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, quizzId 
         FROM QUESTIONS WHERE id = ?`,
        [id]
    );
    if (question.length === 0) {
        throw new Error("No question found with id " + id);
    }
    return question[0];
}

export async function getDbQuizQuestionByquizzId(quizzId: number) {
    const question = await db!.query(
        `SELECT id, title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, quizzId 
         FROM QUESTIONS WHERE quizzId = ?`,
        [quizzId]
    );
    if (question.length === 0) {
        throw new Error("No question found for quizzId " + quizzId);
    }
    return question;
}

export async function getAllQuestions() {
    const questions = await db!.query(
        `SELECT id, title, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, quizzId 
         FROM QUESTIONS`
    );
    return questions;
}

export async function updateQuestion(id: number, question: Partial<Omit<Question, 'id'>>) {
    const fields: string[] = [];
    const values: any[] = [];

    if (question.title !== undefined) {
        fields.push('title = ?');
        values.push(question.title);
    }
    if (question.correctAnswer !== undefined) {
        fields.push('correctAnswer = ?');
        values.push(question.correctAnswer);
    }
    if (question.incorrectAnswer1 !== undefined) {
        fields.push('incorrectAnswer1 = ?');
        values.push(question.incorrectAnswer1);
    }
    if (question.incorrectAnswer2 !== undefined) {
        fields.push('incorrectAnswer2 = ?');
        values.push(question.incorrectAnswer2);
    }
    if (question.incorrectAnswer3 !== undefined) {
        fields.push('incorrectAnswer3 = ?');
        values.push(question.incorrectAnswer3);
    }
    if (question.quizzId !== undefined) {
        fields.push('quizzId = ?');
        values.push(question.quizzId);
    }

    if (fields.length === 0) {
        throw new Error("No fields to update");
    }

    values.push(id);
    const result = await db!.execute(
        `UPDATE QUESTIONS SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
    
    if (result.affectedRows === 0) {
        throw new Error("No question found with id " + id);
    }
    
    return result.affectedRows;
}

export async function deleteQuestion(id: number) {
    const result = await db!.execute(
        `DELETE FROM QUESTIONS WHERE id = ?`,
        [id]
    );
    
    if (result.affectedRows === 0) {
        throw new Error("No question found with id " + id);
    }
    
    return result.affectedRows;
}

export async function deleteQuestionsByQuizId(quizzId: number) {
    const result = await db!.execute(
        `DELETE FROM QUESTIONS WHERE quizzId = ?`,
        [quizzId]
    );
    return result.affectedRows;
}

export async function countQuestionsByQuizId(quizzId: number) {
    const result = await db!.query(
        `SELECT COUNT(*) as count FROM QUESTIONS WHERE quizzId = ?`,
        [quizzId]
    );
    return result[0].count;
}