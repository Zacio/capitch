export type question = {
    question : string,
    answers : string[],
    correctAnswer : number
}

export type participent = {
    id : string,
    name : string | null,
    score : number | null,
    answers : number[] | null,
    role : "student" | "trainer" | "streamer" | null
}

export type quizz = {
    name : string,
    questions : question[]
}

export type sessionCapitch = {
    id : string,
    name : string,
    player : participent[],
    trainer : participent,
    ongoingQuizz : quizz
}