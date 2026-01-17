import React from 'react';
import { Typography, Box } from '@mui/material';
import { CCTLD_ALIASES, GAME_CONSTANTS } from './constants';
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
        maxQuestionOptions: GAME_CONSTANTS.cctld.questionOptions,
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
        maxQuestionOptions: GAME_CONSTANTS.cctld.questionOptions, // Using same options
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
        maxQuestionOptions: GAME_CONSTANTS.telephone.questionOptions,
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
        maxQuestionOptions: GAME_CONSTANTS.vehicleRegistration.questionOptions,
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
