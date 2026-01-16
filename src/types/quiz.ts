export type GameState = 'menu' | 'playing' | 'summary';

export interface QuizSettings {
    mode: string;
    allowRepeats: boolean;
    maxQuestions: number | 'All';
    [key: string]: any;
}

export interface Question<T> {
    item: T;
    userAnswer: string;
    isCorrect: boolean | null;
    pointsEarned: number;
}
