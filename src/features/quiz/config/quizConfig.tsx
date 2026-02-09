import React from 'react';
import { Typography, Box } from '@mui/material';
import { normalize, isSmartMatch } from '../utils/quizUtils';
import {
    QuizType,
    GameMode,
    QuizSettings,
    QuizItem,
    CCTLD,
    DrivingSide,
    TelephoneCode,
    VehicleCode,
    FilterFunction,
} from '../types/quiz';
import {
    filterByLanguage,
    filterByZone,
    filterByConvention,
    filterBySwitch,
    filterBySide,
    filterByLetter,
} from './quizFilters';

// Data imports are now handled dynamically via getData functions in QUIZ_CONFIGS

export const QUIZ_TITLES = {
    wikipediaQuiz: 'Wikipedia Quizzes | Bangyen',
};

/**
 * UI design tokens and constants used across the quiz feature.
 */
export const QUIZ_UI_CONSTANTS = {
    /** Start button style overrides */
    START_BUTTON: {
        FONT_SIZE: { xs: '1rem', sm: '1.2rem' },
        MIN_WIDTH: { xs: 210, sm: 300 },
        LETTER_SPACING: '0.05em',
    },
    /** Styles for the main question card */
    QUESTION_CARD: {
        FONT_SIZE: {
            DEFAULT: { xs: '3rem', sm: '4rem' },
            DETAILED: { xs: '2.5rem', sm: '3.5rem' },
        },
        MIN_HEIGHT: 360,
        MAX_WIDTH: 450,
    },
    /** Button padding and font size for common actions */
    ACTION_BUTTON: {
        FONT_SIZE: '0.8rem',
        PY: 1.5,
    },
    /** Progress bar height */
    PROGRESS_BAR: {
        HEIGHT: 4,
    },
    /** Feedback UI constants (e.g., flag size) */
    FEEDBACK: {
        FLAG_HEIGHT: 24,
    },
    /** History list item constants */
    HISTORY_ITEM: {
        FLAG_HEIGHT: 16,
        FLAG_BORDER_RADIUS: '1px',
    },
    /** Badge dimensions and text size */
    BADGE: {
        HEIGHT: 20,
        FONT_SIZE: '0.75rem',
    },
};

export const QUIZ_GAME_CONSTANTS = {
    cctld: {
        defaultQuestionCount: 10,
        questionOptions: [5, 10, 20, 50],
    },
    telephone: {
        defaultQuestionCount: 10,
        questionOptions: [5, 10, 20, 50, 100],
    },
    vehicleRegistration: {
        defaultQuestionCount: 10,
        questionOptions: [5, 10, 20, 50, 100, 186],
    },
};

export const CCTLD_LANGUAGES = ['All', 'English', 'Non-English'];

/**
 * Semantic aliases for country names to make the quiz more forgiving.
 * Maps common abbreviations or shortened names to their full official names.
 */
export const CCTLD_ALIASES: Record<string, string[]> = {
    'united arab emirates': ['uae'],
    'united states': ['us', 'usa'],
    'united kingdom': ['uk'],
    'democratic republic of the congo': ['drc', 'congo dr'],
    'republic of the congo': ['congo'],
    'central african republic': ['car'],
    'central african': ['car'],
    'british indian ocean territory': ['biot'],
    'saint vincent and the grenadines': ['st vincent'],
    'saint kitts and nevis': ['st kitts'],
    'antigua and barbuda': ['antigua'],
    'trinidad and tobago': ['trinidad'],
    'bosnia and herzegovina': ['bosnia'],
    'sao tome and principe': ['sao tome'],
    'turks and caicos islands': ['turks and caicos'],
};

export const TELEPHONE_ZONES = [
    { label: 'All', value: 'All' },
    { label: 'Zone 1: North American Numbering Plan (NANP)', value: '1' },
    { label: 'Zone 2: Mostly Africa', value: '2' },
    { label: 'Zone 3: Mostly Europe', value: '3' },
    { label: 'Zone 4: Mostly Europe', value: '4' },
    { label: 'Zone 5: South and Central Americas', value: '5' },
    { label: 'Zone 6: Southeast Asia and Oceania', value: '6' },
    { label: 'Zone 7: Russia and neighboring regions', value: '7' },
    {
        label: 'Zone 8: East Asia, Southeast Asia, and special services',
        value: '8',
    },
    { label: 'Zone 9: West, Central, and South Asia', value: '9' },
];

export const VEHICLE_CONVENTIONS = [
    { label: 'All', value: 'All' },
    { label: '1909 Paris Convention', value: '1909' },
    { label: '1924 Paris Convention', value: '1924' },
];

export const DRIVING_SIDE_FILTERS = [
    { label: 'All', value: 'All' },
    { label: 'Switched historically', value: 'Switched' },
    { label: 'Never switched', value: 'Never switched' },
];

export const DRIVING_SIDE_OPTIONS = [
    { label: 'All', value: 'All' },
    { label: 'Left', value: 'Left' },
    { label: 'Right', value: 'Right' },
];

/**
 * Configuration schema for a specific quiz type.
 */
export interface QuizConfig {
    /** Main displayed title */
    title: string;
    /** Short descriptive subtitle */
    subtitle: string;
    /** Wikipedia or source documentation URL */
    infoUrl: string;
    /** Function to load the raw data array for the quiz */
    getData: () => Promise<QuizItem[]>;
    /** Starting settings for new games */
    defaultSettings: QuizSettings;
    /** Whether the quiz supports different game modes (e.g., Code -> Country vs Country -> Code) */
    hasModeSelect: boolean;
    /** Available modes if hasModeSelect is true */
    modes?: { value: GameMode; label: string }[];
    /** Allowable amounts of questions for a session */
    maxQuestionOptions: number[];
    /** Renders the instructional prompt (e.g., "What is the code for...") */
    renderQuestionPrompt: (mode: string) => string;
    /** Renders the central question content (big text or image) */
    renderQuestionContent: (item: QuizItem, mode: string) => React.ReactNode;
    /** Validates user input against the correct answer */
    checkAnswer: (
        input: string,
        item: QuizItem,
        settings: QuizSettings
    ) => Promise<{ isCorrect: boolean; expected: string; points: number }>;
    /** Optional detailed feedback about the answer's origin/etymology */
    renderFeedbackOrigin?: (item: QuizItem) => React.ReactNode;
    /** Optional custom rendering for the entire game area */
    customGameRender?: (props: unknown) => React.ReactNode;
    /** Filter functions to apply to quiz data based on settings */
    filters?: FilterFunction[];
}

export const ART_NATIONALITIES = [
    'All',
    'American',
    'Austrian',
    'Belgian',
    'British',
    'Dutch',
    'English',
    'Flemish',
    'French',
    'German',
    'Greek',
    'Italian',
    'Japanese',
    'Mexican',
    'Norwegian',
    'Russian',
    'Spanish',
];

export const QUIZ_CONFIGS: Record<QuizType, QuizConfig> = {
    // ... (previous configs)
    cctld: {
        title: 'Internet Domain Quiz',
        subtitle: 'Test your knowledge of Internet country codes',
        infoUrl: 'https://en.wikipedia.org/wiki/Country_code_top-level_domain',
        getData: async () => {
            const data = (await import('../data/cctlds.json')).default;
            return data.map(item => ({ ...item, type: 'cctld' as const }));
        },
        defaultSettings: {
            mode: 'toCountry',
            allowRepeats: false,
            filterLetter: '',
            filterLanguage: 'All',
            maxQuestions: 'All',
        },
        hasModeSelect: true,
        modes: [
            { value: 'toCountry', label: 'Guess Country (from Code)' },
            { value: 'toCode', label: 'Guess Code (from Country)' },
        ],
        maxQuestionOptions: QUIZ_GAME_CONSTANTS.cctld.questionOptions,
        renderQuestionPrompt: mode =>
            mode === 'toCountry'
                ? 'What country belongs to:'
                : 'What is the ccTLD for:',
        renderQuestionContent: (item, mode) => {
            const cctldItem = item as CCTLD;
            return (
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize:
                            QUIZ_UI_CONSTANTS.QUESTION_CARD.FONT_SIZE.DEFAULT,
                    }}
                >
                    {mode === 'toCountry' ? cctldItem.code : cctldItem.country}
                </Typography>
            );
        },
        checkAnswer: (input, item, settings) => {
            const cctldItem = item as CCTLD;
            let correct = false;
            let expected = '';
            if (settings.mode === 'toCountry') {
                expected = cctldItem.country;
                correct = isSmartMatch(input, expected, CCTLD_ALIASES);
            } else {
                expected = cctldItem.code;
                let normalizedInput = input.trim();
                if (!normalizedInput.startsWith('.'))
                    normalizedInput = '.' + normalizedInput;
                correct = normalize(normalizedInput) === normalize(expected);
            }
            return Promise.resolve({
                isCorrect: correct,
                expected,
                points: correct ? 1 : 0,
            });
        },
        renderFeedbackOrigin: item => {
            const cctldItem = item as CCTLD;
            return (
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontStyle: 'italic' }}
                >
                    Origin:{' '}
                    <Box
                        component="span"
                        dangerouslySetInnerHTML={{
                            __html: cctldItem.explanation ?? '',
                        }}
                    />
                </Typography>
            );
        },
        filters: [filterByLanguage, filterByLetter],
    },
    driving_side: {
        title: 'Driving Side Quiz',
        subtitle: 'Test your knowledge of global road rules',
        infoUrl: 'https://en.wikipedia.org/wiki/Left-_and_right-hand_traffic',
        getData: async () => {
            const data = (await import('../data/driving_sides.json')).default;
            return data.map(
                item =>
                    ({
                        ...item,
                        type: 'driving_side',
                    }) as DrivingSide
            );
        },
        defaultSettings: {
            mode: 'guessing',
            allowRepeats: false,
            filterLetter: '',
            filterSwitch: 'All',
            filterSide: 'All',
            maxQuestions: 'All',
        },
        hasModeSelect: true,
        modes: [
            { value: 'guessing', label: 'Guess Side (from Country)' },
            { value: 'toCountry', label: 'Guess Country (from Side)' },
        ],
        maxQuestionOptions: QUIZ_GAME_CONSTANTS.cctld.questionOptions, // Using same options
        renderQuestionPrompt: mode =>
            mode === 'toCountry'
                ? 'Which country is this?'
                : 'They drive on the...',
        renderQuestionContent: (item, mode) => {
            const drivingItem = item as DrivingSide;
            if (mode === 'toCountry') {
                return (
                    <Box
                        sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}
                    >
                        <Typography
                            variant="h2"
                            sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                            Drives on the {drivingItem.side}
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic', mb: 3 }}
                        >
                            {/* We show the explanation as part of the question for context */}
                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        (drivingItem.explanation ?? '')
                                            .replace(
                                                /^Drives on the <b>(Left|Right)<\/b>\.?\s*/i,
                                                ''
                                            )
                                            .trim() || 'No details available.',
                                }}
                            />
                        </Typography>
                    </Box>
                );
            }
            return (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {drivingItem.country}
                    </Typography>
                    {drivingItem.flag && (
                        <Box
                            component="img"
                            src={drivingItem.flag}
                            alt={`Flag of ${drivingItem.country} `}
                            sx={{
                                height: 80,
                                width: 'auto',
                                borderRadius: 1,
                                boxShadow: 3,
                                mb: 2,
                            }}
                        />
                    )}
                </Box>
            );
        },
        checkAnswer: (input, item, settings) => {
            const drivingItem = item as DrivingSide;

            if (settings.mode === 'toCountry') {
                const isCorrect = isSmartMatch(
                    input,
                    drivingItem.country,
                    CCTLD_ALIASES
                );
                return Promise.resolve({
                    isCorrect,
                    expected: drivingItem.country,
                    points: isCorrect ? 1 : 0,
                });
            }

            const normalizedInput = normalize(input);
            const normalizedCorrect = normalize(drivingItem.side);
            const isCorrect = normalizedInput === normalizedCorrect;
            return Promise.resolve({
                isCorrect,
                expected: drivingItem.side,
                points: isCorrect ? 1 : 0,
            });
        },
        renderFeedbackOrigin: item => {
            const drivingItem = item as DrivingSide;
            const cleanExplanation = (drivingItem.explanation ?? '')
                .replace(/^Drives on the <b>(Left|Right)<\/b>\.?\s*/i, '')
                .trim();
            if (!cleanExplanation) return null;
            return (
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontStyle: 'italic' }}
                >
                    <Box
                        component="span"
                        dangerouslySetInnerHTML={{ __html: cleanExplanation }}
                    />
                </Typography>
            );
        },
        filters: [filterBySwitch, filterBySide, filterByLetter],
    },
    telephone: {
        title: 'Telephone Code Quiz',
        subtitle: "Master the world's calling codes",
        infoUrl:
            'https://en.wikipedia.org/wiki/List_of_telephone_country_codes',
        getData: async () => {
            const data = (await import('../data/telephone_codes.json')).default;
            return data.map(
                item =>
                    ({
                        ...item,
                        type: 'telephone',
                    }) as TelephoneCode
            );
        },
        defaultSettings: {
            mode: 'toCountry',
            allowRepeats: false,
            filterLetter: '',
            filterZone: 'All',
            maxQuestions: 'All',
        },
        hasModeSelect: true,
        modes: [
            { value: 'toCountry', label: 'Guess Country (from Code)' },
            { value: 'toCode', label: 'Guess Code (from Country)' },
        ],
        maxQuestionOptions: QUIZ_GAME_CONSTANTS.telephone.questionOptions,
        renderQuestionPrompt: mode =>
            mode === 'toCountry'
                ? 'What country belongs to:'
                : 'What is the telephone code for:',
        renderQuestionContent: (item, mode) => {
            const telephoneItem = item as TelephoneCode;
            return (
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize:
                            QUIZ_UI_CONSTANTS.QUESTION_CARD.FONT_SIZE.DETAILED,
                        wordBreak: 'break-word',
                    }}
                >
                    {mode === 'toCountry'
                        ? telephoneItem.code
                        : telephoneItem.country}
                </Typography>
            );
        },
        checkAnswer: (input, item, settings) => {
            const telephoneItem = item as TelephoneCode;
            let correct = false;
            let expected = '';
            if (settings.mode === 'toCountry') {
                expected = telephoneItem.country;
                correct = isSmartMatch(input, expected, CCTLD_ALIASES);
            } else {
                expected = telephoneItem.code;
                let normalizedInput = input.trim();
                if (!normalizedInput.startsWith('+'))
                    normalizedInput = '+' + normalizedInput;
                const norm = (s: string) => s.replace(/[^0-9+]/g, '');
                correct = norm(normalizedInput) === norm(expected);
            }
            return Promise.resolve({
                isCorrect: correct,
                expected,
                points: correct ? 1 : 0,
            });
        },
        filters: [filterByZone, filterByLetter],
    },
    vehicle: {
        title: 'License Plate Quiz',
        subtitle: 'Identify international vehicle registration codes',
        infoUrl:
            'https://en.wikipedia.org/wiki/International_vehicle_registration_code',
        getData: async () => {
            const data = (await import('../data/vehicle_codes.json')).default;
            return data.map(
                item =>
                    ({
                        ...item,
                        type: 'vehicle',
                    }) as VehicleCode
            );
        },
        defaultSettings: {
            mode: 'toCountry',
            allowRepeats: false,
            filterLetter: '',
            filterConvention: 'All',
            maxQuestions: 'All',
        },
        hasModeSelect: true,
        modes: [
            { value: 'toCountry', label: 'Guess Country (from Code)' },
            { value: 'toCode', label: 'Guess Code (from Country)' },
        ],
        maxQuestionOptions:
            QUIZ_GAME_CONSTANTS.vehicleRegistration.questionOptions,
        renderQuestionPrompt: mode =>
            mode === 'toCountry'
                ? 'What country belongs to:'
                : 'What is the vehicle registration code for:',
        renderQuestionContent: (item, mode) => {
            const vehicleItem = item as VehicleCode;
            return (
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize:
                            QUIZ_UI_CONSTANTS.QUESTION_CARD.FONT_SIZE.DETAILED,
                        wordBreak: 'break-word',
                    }}
                >
                    {mode === 'toCountry'
                        ? vehicleItem.code
                        : vehicleItem.country}
                </Typography>
            );
        },
        checkAnswer: async (input, item, settings) => {
            const vehicleItem = item as VehicleCode;
            let correct = false;
            let expected = '';
            if (settings.mode === 'toCountry') {
                // Find all valid countries for this code
                const allMatches = (
                    (await import('../data/vehicle_codes.json'))
                        .default as VehicleCode[]
                ).filter(v => v.code === vehicleItem.code);

                // Check if input matches ANY of the valid countries
                correct = allMatches.some(match =>
                    isSmartMatch(input, match.country, CCTLD_ALIASES)
                );

                // Show the current item's country as expected, or maybe a list?
                // For simplicity, keep current item as expected, but accept alternaties.
                expected = vehicleItem.country;
                if (!correct && allMatches.length > 1) {
                    // If wrong, show all possibilities?
                    // Or just show the one that was on the card.
                    // Let's rely on the simple "expected" from the card for now.
                }
            } else {
                expected = vehicleItem.code;
                const norm = (s: string) =>
                    s
                        .trim()
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '');
                correct = norm(input) === norm(expected);
            }
            return { isCorrect: correct, expected, points: correct ? 1 : 0 };
        },
        filters: [filterByConvention, filterByLetter],
    },
};
