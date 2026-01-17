export type GameState = 'menu' | 'playing' | 'summary';

export type QuizType = 'cctld' | 'driving_side' | 'telephone' | 'vehicle';
export type GameMode = 'toCountry' | 'toCode' | 'guessing';

export interface BaseItem {
    country: string;
    flag?: string;
    explanation?: string;
    [key: string]: any;
}

export interface CCTLD extends BaseItem {
    code: string;
    language: string;
}

export interface DrivingSide extends BaseItem {
    side: 'Left' | 'Right';
}

export interface TelephoneCode extends BaseItem {
    code: string;
}

export interface VehicleCode extends BaseItem {
    code: string;
}

export type QuizItem = CCTLD | DrivingSide | TelephoneCode | VehicleCode;

export interface QuizSettings {
    mode: GameMode | string;
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
