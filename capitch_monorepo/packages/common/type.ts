export type question = {
    question : string,
    answers : string[],
    correctAnswer : number
}

export type participent = {
    name : string,
    score : number,
    answers : number[],
    role : "student" | "trainer"
}

export type quizz = {
    name : string,
    questions : question[]
}