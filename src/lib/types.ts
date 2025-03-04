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

export interface Step {
    id: number;
    content: string;
    correctOrder: number;
}