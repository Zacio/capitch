export type question = {
    question : string,
    answers : string[],
    correctAnswer : number
}

export type participent = {
    id : string,
    name : string,
    score : number,
    answers : number[],
    role : "student" | "trainer"
}

export type quizz = {
    name : string,
    questions : question[]
}

export type session = {
    id : string,
    name : string,
    player : participent[],
    trainer : participent,
    ongoingQuizz : quizz
}