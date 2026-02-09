export type GameState =
    | { status: 'menu' }
    | { status: 'playing' }
    | {
          status: 'summary';
          score: number;
          history: Question<QuizItem>[];
      };

export type QuizType = 'cctld' | 'driving_side' | 'telephone' | 'vehicle';
export type GameMode = 'toCountry' | 'toCode' | 'guessing';

export interface BaseItem {
    country?: string;
    flag?: string;
    explanation?: string;
}

export interface CCTLD extends BaseItem {
    type: 'cctld';
    country: string;
    code: string;
    language: string;
}

export interface DrivingSide extends BaseItem {
    type: 'driving_side';
    country: string;
    side: 'Left' | 'Right';
    switched?: boolean;
}

export interface TelephoneCode extends BaseItem {
    type: 'telephone';
    country: string;
    code: string;
}

export interface VehicleCode extends BaseItem {
    type: 'vehicle';
    country: string;
    code: string;
    conventions?: number[];
}

export type QuizItem = CCTLD | DrivingSide | TelephoneCode | VehicleCode;

export interface QuizSettings {
    mode: GameMode | (string & {});
    allowRepeats: boolean;
    maxQuestions: number | 'All';
    filterSide?: string;
    filterLanguage?: string;
    filterZone?: string;
    filterConvention?: string;
    filterSwitch?: string;
    filterLetter?: string;
    [key: string]: unknown;
}

export interface Question<T> {
    id: string;
    item: T;
    userAnswer: string;
    isCorrect: boolean | null;
    pointsEarned: number;
}

/**
 * Filter function type for quiz data filtering.
 * Takes quiz items, settings, and returns filtered items.
 */
export type FilterFunction = (
    items: QuizItem[],
    settings: QuizSettings
) => QuizItem[];
