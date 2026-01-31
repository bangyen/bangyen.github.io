export type GameState = 'menu' | 'playing' | 'summary';

export type QuizType =
    | 'cctld'
    | 'driving_side'
    | 'telephone'
    | 'vehicle'
    | 'art';
export type GameMode =
    | 'toCountry'
    | 'toCode'
    | 'guessing'
    | 'art_name'
    | 'art_artist'
    | 'art_period';

export interface BaseItem {
    country?: string;
    flag?: string;
    explanation?: string;
    [key: string]: unknown;
}

export interface CCTLD extends BaseItem {
    country: string;
    code: string;
    language: string;
}

export interface DrivingSide extends BaseItem {
    country: string;
    side: 'Left' | 'Right';
    switched?: boolean;
}

export interface TelephoneCode extends BaseItem {
    country: string;
    code: string;
}

export interface VehicleCode extends BaseItem {
    country: string;
    code: string;
    conventions?: number[];
}

export interface ArtItem extends BaseItem {
    title: string;
    artist: string;
    year: string;
    period?: string;
    imageUrl: string;
    wikiUrl: string;
    description?: string;
}

export type QuizItem =
    | CCTLD
    | DrivingSide
    | TelephoneCode
    | VehicleCode
    | ArtItem;

export interface QuizSettings {
    mode: GameMode | string;
    allowRepeats: boolean;
    maxQuestions: number | 'All';
    filterSide?: string;
    [key: string]: unknown;
}

export interface Question<T> {
    id: string;
    item: T;
    userAnswer: string;
    isCorrect: boolean | null;
    pointsEarned: number;
}
