import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Button,
    Fade,
    TextField,
    Chip,
    Card,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    ToggleButtonGroup,
    ToggleButton,
    Stack,
    useTheme,
    alpha,
} from '@mui/material';
import {
    CheckCircleRounded as CheckCircleIcon,
    CancelRounded as CancelIcon,
    ArrowBackRounded as ArrowBackIcon,
} from '@mui/icons-material';
import { COLORS, SPACING, COMPONENT_VARIANTS } from '../config/theme';
import {
    CCTLD_ALIASES,
    CCTLD_LANGUAGES,
    TELEPHONE_ZONES,
    VEHICLE_CONVENTIONS,
    DRIVING_SIDE_FILTERS,
    GAME_CONSTANTS,
} from '../config/constants';
import { normalize, isSmartMatch } from '../utils/quizUtils';
import {
    GameState,
    QuizSettings,
    Question as GenericQuestion,
} from '../types/quiz';
import { useQuizEngine } from '../hooks/useQuizEngine';
import QuizLayout from '../components/Quiz/QuizLayout';
import QuizSettingsView from '../components/Quiz/QuizSettingsView';
import QuizGameView from '../components/Quiz/QuizGameView';
import QuizSummaryView from '../components/Quiz/QuizSummaryView';
import { SkippedBadge } from '../components/Quiz';

// Data imports
import cctldsData from '../data/cctlds_enhanced.json';
import drivingSideData from '../data/driving_sides.json';
import telephoneData from '../data/telephone_codes.json';
import vehicleData from '../data/vehicle_registration_codes.json';

// --- Types ---

type QuizType = 'cctld' | 'driving_side' | 'telephone' | 'vehicle';
type GameMode = 'toCountry' | 'toCode' | 'guessing';

interface BaseItem {
    country: string;
    flag?: string;
    explanation?: string;
    [key: string]: any;
}

interface CCTLD extends BaseItem {
    code: string;
    language: string;
}

interface DrivingSide extends BaseItem {
    side: 'Left' | 'Right';
}

interface TelephoneCode extends BaseItem {
    code: string;
}

interface VehicleCode extends BaseItem {
    code: string;
}

type QuizItem = CCTLD | DrivingSide | TelephoneCode | VehicleCode;

type Question = GenericQuestion<QuizItem>;

// --- Constants ---

const QUIZ_CONFIGS: Record<
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
                sx={{ fontStyle: 'italic', textAlign: 'center' }}
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
                    sx={{ fontStyle: 'italic', textAlign: 'center' }}
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

// --- Components ---

const commonSelectProps = {
    MenuProps: {
        BackdropProps: {
            sx: { backdropFilter: 'none', backgroundColor: 'transparent' },
        },
    },
};

const QuizGame = ({
    quizType,
    settings,
    initialPool,
    onEndGame,
    onBackToMenu,
}: {
    quizType: QuizType;
    settings: QuizSettings;
    initialPool: any[];
    onEndGame: (history: Question[], score: number) => void;
    onBackToMenu: () => void;
}) => {
    const config = QUIZ_CONFIGS[quizType];
    const { state, actions } = useQuizEngine<any>({
        initialPool,
        settings,
        onEndGame,
        checkAnswer: config.checkAnswer,
    });

    const {
        history,
        currentQuestion,
        inputValue,
        showFeedback,
        feedbackMessage,
        isCorrect,
        totalQuestions,
        showHint,
        score,
    } = state;

    const { setInputValue, handleSubmit, handleSkip, toggleHint } = actions;

    const inputRef = useRef<HTMLInputElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (showFeedback) {
            nextButtonRef.current?.focus();
        } else {
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [showFeedback, currentQuestion]);

    // Special handling for Driving Side which uses custom component inputs
    if (quizType === 'driving_side') {
        return (
            <QuizGameView
                gameState={state}
                actions={actions}
                onBackToMenu={onBackToMenu}
                modeLabel="Which Side?"
                hideInput={true}
                hideHint={true}
                renderQuestionPrompt={() =>
                    config.renderQuestionPrompt(settings.mode)
                }
                onKeyDown={e => {
                    if (state.showFeedback) return;
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        actions.submitAnswer('Left');
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        actions.submitAnswer('Right');
                    }
                }}
                renderQuestionContent={item =>
                    config.renderQuestionContent(item, settings.mode)
                }
                renderCustomActions={(state, actions) => (
                    <>
                        <Button
                            variant="contained"
                            onClick={() => actions.submitAnswer('Left')}
                            disabled={state.showFeedback}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                whiteSpace: 'nowrap',
                                '&.Mui-disabled': {
                                    backgroundColor:
                                        'rgba(255, 255, 255, 0.05)',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    borderColor: 'transparent',
                                },
                            }}
                        >
                            Left
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => actions.submitAnswer('Right')}
                            disabled={state.showFeedback}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                whiteSpace: 'nowrap',
                                '&.Mui-disabled': {
                                    backgroundColor:
                                        'rgba(255, 255, 255, 0.05)',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    borderColor: 'transparent',
                                },
                            }}
                        >
                            Right
                        </Button>
                    </>
                )}
                renderHint={() => (
                    <Typography variant="body2">
                        Think about the region and historical influences.
                    </Typography>
                )}
                renderFeedbackOrigin={config.renderFeedbackOrigin}
            />
        );
    }

    return (
        <QuizGameView
            gameState={state}
            actions={actions}
            onBackToMenu={onBackToMenu}
            inputRef={inputRef}
            nextButtonRef={nextButtonRef}
            modeLabel={
                settings.mode === 'toCountry'
                    ? 'Guessing Country'
                    : 'Guessing Code'
            }
            inputPlaceholder={
                settings.mode === 'toCountry'
                    ? 'Type country name...'
                    : 'Type answer...'
            }
            renderQuestionPrompt={() =>
                config.renderQuestionPrompt(settings.mode)
            }
            renderQuestionContent={item =>
                config.renderQuestionContent(item, settings.mode)
            }
            renderHint={item =>
                quizType === 'cctld' ? (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            textAlign: 'center',
                            fontStyle: 'italic',
                        }}
                    >
                        Hint: {(item as CCTLD).language} origin
                    </Typography>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        Hint functionality coming soon...
                    </Typography>
                )
            }
            hideHint={quizType !== 'cctld'}
            renderFeedbackFlag={item =>
                item.flag && (
                    <img
                        src={item.flag}
                        alt={`Flag of ${item.country} `}
                        style={{
                            height: '24px',
                            width: 'auto',
                            borderRadius: '2px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }}
                    />
                )
            }
            renderFeedbackOrigin={config.renderFeedbackOrigin}
        />
    );
};

const WikipediaQuizPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Determine initial quiz from URL or default to 'cctld'
    const getInitialQuiz = (): QuizType => {
        const type = searchParams.get('type');
        if (type && QUIZ_CONFIGS[type as QuizType]) {
            return type as QuizType;
        }
        return 'cctld';
    };

    const [selectedQuiz, setSelectedQuiz] =
        useState<QuizType>(getInitialQuiz());
    const [gameState, setGameState] = useState<GameState>('menu');

    // Initialize settings based on selected quiz
    const [settings, setSettings] = useState<QuizSettings>(
        QUIZ_CONFIGS[selectedQuiz].defaultSettings
    );

    const [lastScore, setLastScore] = useState(0);
    const [lastHistory, setLastHistory] = useState<Question[]>([]);

    // URL sync
    const handleQuizChange = (
        _event: React.MouseEvent<HTMLElement>,
        newQuiz: QuizType | null
    ) => {
        if (newQuiz !== null) {
            setSelectedQuiz(newQuiz);
            setSearchParams({ type: newQuiz });
            setGameState('menu');
            setSettings(QUIZ_CONFIGS[newQuiz].defaultSettings);
        }
    };

    const activeConfig = QUIZ_CONFIGS[selectedQuiz];

    // Update document title
    useEffect(() => {
        document.title = `${activeConfig.title} | Bangyen`;
    }, [activeConfig.title]);

    const filteredPool = useMemo(() => {
        let filtered = activeConfig.data;
        const config = activeConfig;

        // Language Filter (only valid for cctld really, but generic check)
        if (
            settings.filterLanguage &&
            settings.filterLanguage !== 'All' &&
            selectedQuiz === 'cctld'
        ) {
            if (settings.filterLanguage === 'Non-English') {
                filtered = filtered.filter(
                    (item: any) => item.language !== 'English'
                );
            } else {
                filtered = filtered.filter(
                    (item: any) => item.language === settings.filterLanguage
                );
            }
        }

        // Zone Filter (Telephone only)
        if (
            settings.filterZone &&
            settings.filterZone !== 'All' &&
            selectedQuiz === 'telephone'
        ) {
            const zones = settings.filterZone.split(',');
            filtered = filtered.filter((item: any) =>
                zones.some((z: string) => item.code.startsWith(`+${z}`))
            );
        }

        // Vehicle Convention Filter
        if (
            settings.filterConvention &&
            settings.filterConvention !== 'All' &&
            selectedQuiz === 'vehicle'
        ) {
            filtered = filtered.filter(
                (item: any) =>
                    item.conventions &&
                    item.conventions.includes(Number(settings.filterConvention))
            );
        }

        // Driving Side Switch Filter
        if (
            settings.filterSwitch &&
            settings.filterSwitch !== 'All' &&
            selectedQuiz === 'driving_side'
        ) {
            filtered = filtered.filter((item: any) =>
                settings.filterSwitch === 'Switched'
                    ? item.switched
                    : !item.switched
            );
        }

        // Letter Filter
        if (settings.filterLetter) {
            let letters = settings.filterLetter
                .toLowerCase()
                .split(',')
                .map((l: string) => l.trim())
                .filter((l: string) => l);

            // Special handling for legacy split (spaces) if singular comma usage
            if (letters.length <= 1 && !settings.filterLetter.includes(',')) {
                const spaceSplit = settings.filterLetter
                    .toLowerCase()
                    .split(/\s+/)
                    .filter((l: string) => l);
                if (spaceSplit.length > 1) {
                    letters = spaceSplit;
                } else {
                    letters = settings.filterLetter
                        .toLowerCase()
                        .split('')
                        .filter((l: string) => l.trim());
                }
            }

            if (letters.length > 0) {
                filtered = filtered.filter((item: any) => {
                    let text = '';
                    if (selectedQuiz === 'cctld') {
                        text =
                            settings.mode === 'toCountry'
                                ? item.code.toLowerCase().replace('.', '')
                                : item.country.toLowerCase();
                    } else if (selectedQuiz === 'driving_side') {
                        text = item.country.toLowerCase();
                    } else if (selectedQuiz === 'telephone') {
                        text = item.country.toLowerCase();
                    } else if (selectedQuiz === 'vehicle') {
                        text =
                            settings.mode === 'toCountry'
                                ? item.code.toLowerCase()
                                : item.country.toLowerCase();
                    }
                    return letters.some((l: string) => text.startsWith(l));
                });
            }
        }

        if (settings.maxQuestions !== 'All') {
            return [...filtered]
                .sort(() => Math.random() - 0.5)
                .slice(0, settings.maxQuestions as number);
        }
        return filtered;
    }, [settings, selectedQuiz, activeConfig]);

    const handleStart = () => {
        if (filteredPool.length > 0) {
            setGameState('playing');
        }
    };

    const handleEndGame = (history: Question[], score: number) => {
        setLastHistory(history);
        setLastScore(score);
        setGameState('summary');
    };

    const handleBackToMenu = () => {
        setGameState('menu');
    };

    return (
        <QuizLayout title="Wikipedia Quizzes" infoUrl={activeConfig.infoUrl}>
            {gameState === 'menu' && (
                <Fade in>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Quiz Type Selector Above */}
                        <Box
                            sx={{
                                mb: 4,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <ToggleButtonGroup
                                value={selectedQuiz}
                                exclusive
                                onChange={handleQuizChange}
                                aria-label="quiz selection"
                                sx={{
                                    backgroundColor:
                                        'rgba(255, 255, 255, 0.03)',
                                    borderRadius: SPACING.borderRadius.full,
                                    p: 0.5,
                                    '& .MuiToggleButton-root': {
                                        borderRadius: SPACING.borderRadius.full,
                                        px: 3,
                                        py: 1,
                                        border: 'none',
                                        color: COLORS.text.secondary,
                                        fontSize: '0.9rem',
                                        fontWeight: 'medium',
                                        textTransform: 'none',
                                        '&.Mui-selected': {
                                            backgroundColor:
                                                COLORS.primary.main,
                                            color: COLORS.text.primary,
                                            boxShadow:
                                                '0 4px 12px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                backgroundColor:
                                                    COLORS.primary.light,
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0.05)',
                                        },
                                    },
                                }}
                            >
                                <ToggleButton value="cctld">
                                    Domains
                                </ToggleButton>
                                <ToggleButton value="driving_side">
                                    Driving Side
                                </ToggleButton>
                                <ToggleButton value="telephone">
                                    Telephone
                                </ToggleButton>
                                <ToggleButton value="vehicle">
                                    Plates
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <QuizSettingsView
                            settings={settings}
                            onUpdate={setSettings}
                            onStart={handleStart}
                            maxQuestionOptions={activeConfig.maxQuestionOptions}
                            title="Quiz Settings"
                        >
                            {/* Slot 1: Letter Filter (Next to Question Limit in top row) */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Filter by Letter(s)"
                                    value={settings.filterLetter}
                                    onChange={e =>
                                        setSettings({
                                            ...settings,
                                            filterLetter: e.target.value,
                                        })
                                    }
                                    helperText="Comma separated (e.g. a, b)"
                                    InputLabelProps={{
                                        style: { color: COLORS.text.secondary },
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleStart();
                                        }
                                    }}
                                    sx={{
                                        input: { color: COLORS.text.primary },
                                        label: { color: COLORS.text.secondary },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor:
                                                    COLORS.border.subtle,
                                            },
                                            '&:hover fieldset': {
                                                borderColor:
                                                    COLORS.primary.main,
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Slot 3: Specialized Filters (Row 2 Left) */}
                            {selectedQuiz === 'cctld' && (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Language Filter</InputLabel>
                                        <Select
                                            value={settings.filterLanguage}
                                            label="Language Filter"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    filterLanguage:
                                                        e.target.value,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {CCTLD_LANGUAGES.map(lang => (
                                                <MenuItem
                                                    key={lang}
                                                    value={lang}
                                                >
                                                    {lang}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {selectedQuiz === 'telephone' && (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Zone Filter</InputLabel>
                                        <Select
                                            value={settings.filterZone || 'All'}
                                            label="Zone Filter"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    filterZone: e.target.value,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {TELEPHONE_ZONES.map(zone => (
                                                <MenuItem
                                                    key={zone.value}
                                                    value={zone.value}
                                                >
                                                    {zone.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {selectedQuiz === 'vehicle' && (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            Convention Filter
                                        </InputLabel>
                                        <Select
                                            value={
                                                settings.filterConvention ||
                                                'All'
                                            }
                                            label="Convention Filter"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    filterConvention:
                                                        e.target.value,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {VEHICLE_CONVENTIONS.map(conv => (
                                                <MenuItem
                                                    key={conv.value}
                                                    value={conv.value}
                                                >
                                                    {conv.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {selectedQuiz === 'driving_side' && (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Switch Filter</InputLabel>
                                        <Select
                                            value={
                                                settings.filterSwitch || 'All'
                                            }
                                            label="Switch Filter"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    filterSwitch:
                                                        e.target.value,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {DRIVING_SIDE_FILTERS.map(f => (
                                                <MenuItem
                                                    key={f.value}
                                                    value={f.value}
                                                >
                                                    {f.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {/* Slot 2: Game Mode (Row 2 Right) */}
                            {activeConfig.hasModeSelect &&
                            activeConfig.modes ? (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Game Mode</InputLabel>
                                        <Select
                                            value={settings.mode}
                                            label="Game Mode"
                                            onChange={e =>
                                                setSettings({
                                                    ...settings,
                                                    mode: e.target.value as any,
                                                })
                                            }
                                            sx={{
                                                color: COLORS.text.primary,
                                                '.MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                    },
                                            }}
                                            {...commonSelectProps}
                                        >
                                            {activeConfig.modes.map(m => (
                                                <MenuItem
                                                    key={m.value}
                                                    value={m.value}
                                                >
                                                    {m.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            ) : (
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: { xs: 'none', md: 'block' },
                                    }}
                                >
                                    <Box sx={{ height: 56 }} />
                                </Grid>
                            )}

                            {selectedQuiz !== 'cctld' &&
                                selectedQuiz !== 'telephone' &&
                                selectedQuiz !== 'vehicle' &&
                                selectedQuiz !== 'driving_side' && (
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{
                                            display: {
                                                xs: 'none',
                                                md: 'block',
                                            },
                                        }}
                                    >
                                        <Box sx={{ height: 56 }} />
                                    </Grid>
                                )}
                            {/* Slot 4 (Question Limit) is handled by QuizSettingsView */}
                        </QuizSettingsView>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleStart}
                                disabled={filteredPool.length === 0}
                                sx={{
                                    px: 8,
                                    py: 1.5,
                                    fontSize: '1.2rem',
                                    borderRadius: SPACING.borderRadius.full,
                                    fontWeight: 'bold',
                                    letterSpacing: '0.05em',
                                    minWidth: 300,
                                    whiteSpace: 'nowrap',
                                    '&.Mui-disabled': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.05)',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                    },
                                }}
                            >
                                {filteredPool.length === 0
                                    ? 'No Questions Found'
                                    : `Start Quiz (${filteredPool.length})`}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            )}

            {gameState === 'playing' && (
                <QuizGame
                    quizType={selectedQuiz}
                    settings={settings}
                    initialPool={filteredPool}
                    onEndGame={handleEndGame}
                    onBackToMenu={handleBackToMenu}
                />
            )}

            {gameState === 'summary' && (
                <QuizSummaryView<any>
                    score={lastScore}
                    history={lastHistory}
                    onRestart={handleStart}
                    onBackToMenu={handleBackToMenu}
                    renderHistoryItem={(q, i) => (
                        <Card
                            key={i}
                            sx={{
                                p: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                bgcolor:
                                    q.pointsEarned === 1
                                        ? 'rgba(76, 175, 80, 0.05)'
                                        : q.pointsEarned === 0.5
                                          ? 'rgba(255, 193, 7, 0.05)'
                                          : 'rgba(239, 83, 80, 0.05)',
                                border: `1px solid ${COLORS.border.subtle} `,
                                flexShrink: 0,
                            }}
                        >
                            <Box
                                sx={{ textAlign: 'left', flex: 1, minWidth: 0 }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    {q.item.flag && (
                                        <img
                                            src={q.item.flag}
                                            alt={`Flag of ${q.item.country} `}
                                            style={{
                                                height: '16px',
                                                width: 'auto',
                                                borderRadius: '1px',
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        noWrap
                                    >
                                        {selectedQuiz === 'driving_side'
                                            ? q.item.country
                                            : settings.mode === 'toCountry'
                                              ? q.item.code
                                              : q.item.country}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    noWrap
                                >
                                    Answer:{' '}
                                    {selectedQuiz === 'driving_side'
                                        ? q.item.side
                                        : settings.mode === 'toCountry'
                                          ? q.item.country
                                          : q.item.code}
                                </Typography>
                                {activeConfig.renderFeedbackOrigin && (
                                    <Box sx={{ mt: 0.5, opacity: 0.8 }}>
                                        {activeConfig.renderFeedbackOrigin(
                                            q.item
                                        )}
                                    </Box>
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                    flexShrink: 0,
                                    ml: 2,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            q.pointsEarned === 1
                                                ? COLORS.data.green
                                                : q.pointsEarned === 0.5
                                                  ? COLORS.data.amber
                                                  : COLORS.data.red,
                                        fontWeight:
                                            q.pointsEarned > 0
                                                ? 'bold'
                                                : 'normal',
                                        maxWidth: '150px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: 'block',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {q.userAnswer?.trim() ? (
                                        <Typography
                                            component="span"
                                            variant="inherit"
                                        >
                                            {q.userAnswer.trim()}
                                            {q.pointsEarned === 0.5 &&
                                                ' (0.5 pts)'}
                                        </Typography>
                                    ) : (
                                        <SkippedBadge />
                                    )}
                                </Typography>
                                {q.pointsEarned === 1 ? (
                                    <CheckCircleIcon
                                        fontSize="small"
                                        color="success"
                                    />
                                ) : q.pointsEarned === 0.5 ? (
                                    <CheckCircleIcon
                                        fontSize="small"
                                        sx={{
                                            color: COLORS.data.amber,
                                        }}
                                    />
                                ) : (
                                    q.userAnswer?.trim() && (
                                        <CancelIcon
                                            fontSize="small"
                                            color="error"
                                        />
                                    )
                                )}
                            </Box>
                        </Card>
                    )}
                />
            )}
        </QuizLayout>
    );
};

export default WikipediaQuizPage;
