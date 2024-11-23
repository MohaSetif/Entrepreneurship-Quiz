export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Team {
    name: string;
    score: number;
    questionsAnswered: number;
}
