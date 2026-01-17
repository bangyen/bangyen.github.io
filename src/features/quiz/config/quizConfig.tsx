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
} from '../types/quiz';

// Data imports
import cctldsData from '../data/cctlds_enhanced.json';
import drivingSideData from '../data/driving_sides.json';
import telephoneData from '../data/telephone_codes.json';
import vehicleData from '../data/vehicle_registration_codes.json';

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

export const QUIZ_CONFIGS: Record<
    QuizType,
    {
        title: string;
        subtitle: string;
        infoUrl: string;
        data: QuizItem[];
        defaultSettings: QuizSettings;
        hasModeSelect: boolean;
        modes?: { value: GameMode; label: string }[];
        maxQuestionOptions: number[];
        renderQuestionPrompt: (mode: string) => string;
        renderQuestionContent: (item: any, mode: string) => React.ReactNode;
        checkAnswer: (
            input: string,
            item: any,
            settings: QuizSettings
        ) => { isCorrect: boolean; expected: string; points: number };
        renderFeedbackOrigin?: (item: any) => React.ReactNode;
        customGameRender?: (props: any) => React.ReactNode; // For driving side special buttons
    }
> = {
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
        renderQuestionContent: (item: CCTLD, mode) => (
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: { xs: '3rem', sm: '4rem' },
                }}
            >
                {mode === 'toCountry' ? item.code : item.country}
            </Typography>
        ),
        checkAnswer: (input, item: CCTLD, settings) => {
            let correct = false;
            let expected = '';
            if (settings.mode === 'toCountry') {
                expected = item.country;
                correct = isSmartMatch(input, expected, CCTLD_ALIASES);
            } else {
                expected = item.code;
                let normalizedInput = input.trim();
                if (!normalizedInput.startsWith('.'))
                    normalizedInput = '.' + normalizedInput;
                correct = normalize(normalizedInput) === normalize(expected);
            }
            return { isCorrect: correct, expected, points: correct ? 1 : 0 };
        },
        renderFeedbackOrigin: (item: CCTLD) => (
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{ fontStyle: 'italic' }}
            >
                Origin:{' '}
                <Box
                    component="span"
                    dangerouslySetInnerHTML={{ __html: item.explanation || '' }}
                />
            </Typography>
        ),
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
            maxQuestions: 'All',
        },
        hasModeSelect: false,
        maxQuestionOptions: QUIZ_GAME_CONSTANTS.cctld.questionOptions, // Using same options
        renderQuestionPrompt: () => 'They drive on the...',
        renderQuestionContent: (item: DrivingSide) => (
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {item.country}
                </Typography>
                {item.flag && (
                    <Box
                        component="img"
                        src={item.flag}
                        alt={`Flag of ${item.country} `}
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
        ),
        checkAnswer: (input, item: DrivingSide) => {
            const normalizedInput = normalize(input);
            const normalizedCorrect = normalize(item.side);
            const isCorrect = normalizedInput === normalizedCorrect;
            return {
                isCorrect,
                expected: item.side,
                points: isCorrect ? 1 : 0,
            };
        },
        renderFeedbackOrigin: (item: DrivingSide) => {
            const cleanExplanation = (item.explanation || '')
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
        renderQuestionContent: (item: TelephoneCode, mode) => (
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: { xs: '2.5rem', sm: '3.5rem' },
                    wordBreak: 'break-word',
                }}
            >
                {mode === 'toCountry' ? item.code : item.country}
            </Typography>
        ),
        checkAnswer: (input, item: TelephoneCode, settings) => {
            let correct = false;
            let expected = '';
            if (settings.mode === 'toCountry') {
                expected = item.country;
                correct = isSmartMatch(input, expected, CCTLD_ALIASES);
            } else {
                expected = item.code;
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
        renderQuestionContent: (item: VehicleCode, mode) => (
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: { xs: '2.5rem', sm: '3.5rem' },
                    wordBreak: 'break-word',
                }}
            >
                {mode === 'toCountry' ? item.code : item.country}
            </Typography>
        ),
        checkAnswer: (input, item: VehicleCode, settings) => {
            let correct = false;
            let expected = '';
            if (settings.mode === 'toCountry') {
                expected = item.country;
                correct = isSmartMatch(input, expected, CCTLD_ALIASES);
            } else {
                expected = item.code;
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
};
