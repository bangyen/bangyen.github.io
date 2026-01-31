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
    ArtItem,
} from '../types/quiz';
import ArtQuestionView from '../components/ArtQuestionView';

// Data imports
import cctldsData from '../data/cctlds.json';
import drivingSideData from '../data/driving_sides.json';
import telephoneData from '../data/telephone_codes.json';
import vehicleData from '../data/vehicle_codes.json';

export const QUIZ_TITLES = {
    wikipediaQuiz: 'Wikipedia Quizzes | Bangyen',
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

export interface QuizConfig {
    title: string;
    subtitle: string;
    infoUrl: string;
    data: QuizItem[];
    defaultSettings: QuizSettings;
    hasModeSelect: boolean;
    modes?: { value: GameMode; label: string }[];
    maxQuestionOptions: number[];
    renderQuestionPrompt: (mode: string) => string;
    renderQuestionContent: (item: QuizItem, mode: string) => React.ReactNode;
    checkAnswer: (
        input: string,
        item: QuizItem,
        settings: QuizSettings
    ) => { isCorrect: boolean; expected: string; points: number };
    renderFeedbackOrigin?: (item: QuizItem) => React.ReactNode;
    customGameRender?: (props: unknown) => React.ReactNode;
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
        data: cctldsData as CCTLD[],
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
                        fontSize: { xs: '3rem', sm: '4rem' },
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
            return { isCorrect: correct, expected, points: correct ? 1 : 0 };
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
                            __html: cctldItem.explanation || '',
                        }}
                    />
                </Typography>
            );
        },
    },
    driving_side: {
        title: 'Driving Side Quiz',
        subtitle: 'Test your knowledge of global road rules',
        infoUrl: 'https://en.wikipedia.org/wiki/Left-_and_right-hand_traffic',
        data: drivingSideData as DrivingSide[],
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
                                        (drivingItem.explanation || '')
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
                return {
                    isCorrect,
                    expected: drivingItem.country,
                    points: isCorrect ? 1 : 0,
                };
            }

            const normalizedInput = normalize(input);
            const normalizedCorrect = normalize(drivingItem.side);
            const isCorrect = normalizedInput === normalizedCorrect;
            return {
                isCorrect,
                expected: drivingItem.side,
                points: isCorrect ? 1 : 0,
            };
        },
        renderFeedbackOrigin: item => {
            const drivingItem = item as DrivingSide;
            const cleanExplanation = (drivingItem.explanation || '')
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
    },
    telephone: {
        title: 'Telephone Code Quiz',
        subtitle: "Master the world's calling codes",
        infoUrl:
            'https://en.wikipedia.org/wiki/List_of_telephone_country_codes',
        data: telephoneData as TelephoneCode[],
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
                        fontSize: { xs: '2.5rem', sm: '3.5rem' },
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
            return { isCorrect: correct, expected, points: correct ? 1 : 0 };
        },
    },
    vehicle: {
        title: 'License Plate Quiz',
        subtitle: 'Identify international vehicle registration codes',
        infoUrl:
            'https://en.wikipedia.org/wiki/International_vehicle_registration_code',
        data: vehicleData as VehicleCode[],
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
                        fontSize: { xs: '2.5rem', sm: '3.5rem' },
                        wordBreak: 'break-word',
                    }}
                >
                    {mode === 'toCountry'
                        ? vehicleItem.code
                        : vehicleItem.country}
                </Typography>
            );
        },
        checkAnswer: (input, item, settings) => {
            const vehicleItem = item as VehicleCode;
            let correct = false;
            let expected = '';
            if (settings.mode === 'toCountry') {
                // Find all valid countries for this code
                const allMatches = (vehicleData as VehicleCode[]).filter(
                    v => v.code === vehicleItem.code
                );

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
    },
    art: {
        title: 'Art History Quiz',
        subtitle: 'Identify famous artworks, artists, and periods',
        infoUrl: 'https://en.wikipedia.org/wiki/History_of_painting',
        data: [], // Populated dynamically
        defaultSettings: {
            mode: 'art_name',
            allowRepeats: false,
            maxQuestions: 'All',
        },
        hasModeSelect: true,
        modes: [
            { value: 'art_name', label: 'Guess Artwork Name' },
            { value: 'art_artist', label: 'Guess Artist' },
            { value: 'art_period', label: 'Guess Time Period' },
        ],
        maxQuestionOptions: [5, 10, 20],
        renderQuestionPrompt: mode => {
            switch (mode) {
                case 'art_name':
                    return 'What is the name of this artwork?';
                case 'art_artist':
                    return 'Who painted this?';
                case 'art_period':
                    return 'What is the artistic movement or period?';
                default:
                    return 'Identify this artwork:';
            }
        },
        renderQuestionContent: item => (
            <ArtQuestionView item={item as ArtItem} />
        ),
        checkAnswer: (input, item, settings) => {
            const artItem = item as ArtItem;
            let expected = '';
            switch (settings.mode) {
                case 'art_name':
                    expected = artItem.title;
                    break;
                case 'art_artist':
                    expected = artItem.artist;
                    break;
                case 'art_period':
                    expected = artItem.period || artItem.year;
                    break;
            }
            const isCorrect = isSmartMatch(input, expected);
            return { isCorrect, expected, points: isCorrect ? 1 : 0 };
        },
        renderFeedbackOrigin: item => {
            const artItem = item as ArtItem;
            return (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {artItem.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        By {artItem.artist}, {artItem.year}
                    </Typography>
                    {artItem.period && artItem.period !== 'Unknown' && (
                        <Typography variant="caption" color="textSecondary">
                            {artItem.period}
                        </Typography>
                    )}
                </Box>
            );
        },
    },
};
