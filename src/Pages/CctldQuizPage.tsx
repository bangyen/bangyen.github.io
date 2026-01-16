import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    Fade,
    TextField,
    Chip,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    LinearProgress,
    Card,
    CardContent,
} from '@mui/material';
import {
    ArrowBackRounded as ArrowBackIcon,
    RefreshRounded as RefreshIcon,
    CheckCircleRounded as CheckCircleIcon,
    CancelRounded as CancelIcon,
    InfoRounded as InfoIcon,
    HomeRounded as HomeIcon,
} from '@mui/icons-material';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    ANIMATIONS,
    COMPONENT_VARIANTS,
} from '../config/theme';
import {
    CCTLD_ALIASES,
    CCTLD_LANGUAGES,
    GAME_CONSTANTS,
} from '../config/constants';
import cctldsData from '../data/cctlds_enhanced.json';

import { Grid as MuiGrid } from '../components/mui';

// --- Types ---

interface CCTLD {
    code: string;
    country: string;
    explanation: string;
    notes: string;
    flag: string;
    language: string;
}

type GameMode = 'toCountry' | 'toCode';
type GameState = 'menu' | 'playing' | 'summary';

interface QuizSettings {
    mode: GameMode;
    allowRepeats: boolean;
    filterLetter: string;
    filterLanguage: string;
    maxQuestions: number | 'All';
}

interface Question {
    cctld: CCTLD;
    userAnswer: string;
    isCorrect: boolean | null;
    pointsEarned: number;
}

// --- Constants ---

// --- Helper Functions ---

const normalize = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
        .replace(/\bst\.(?=\s|$)/g, 'saint')
        .replace(/^the\s+/g, '')
        .replace(/[^\w\s\.]/g, '') // Keep dots for .codes
        .trim();
};

const isSmartMatch = (input: string, expected: string) => {
    const ni = normalize(input);
    const ne = normalize(expected);

    // 1. Exact normalized match
    if (ni === ne) return true;

    // 2. Predefined Aliases
    const aliases: Record<string, string[]> = CCTLD_ALIASES;

    if (aliases[ne]?.map(a => normalize(a)).includes(ni)) return true;

    // 3. Parentheses handling: "Cocos (Keeling) Islands" -> "Cocos Islands"
    const withoutParens = normalize(
        expected.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ')
    );
    if (ni === withoutParens) return true;

    // Also check first part before parens
    const firstPartParens = normalize(expected.split('(')[0]);
    if (ni === firstPartParens) return true;

    // 4. "And" handling: Match the first part before "and"
    if (ne.includes(' and ')) {
        const firstPart = normalize(expected.split(' and ')[0]);
        if (ni === firstPart) return true;
    }

    return false;
};

// --- Components ---

const SettingsPanel = ({
    settings,
    onUpdate,
    onStart,
}: {
    settings: QuizSettings;
    onUpdate: (s: QuizSettings) => void;
    onStart: () => void;
}) => {
    const commonSelectProps = {
        MenuProps: {
            BackdropProps: {
                sx: { backdropFilter: 'none', backgroundColor: 'transparent' },
            },
        },
    };

    return (
        <Card
            sx={{
                ...COMPONENT_VARIANTS.card,
                p: 3,
                mb: 4,
                width: '100%',
                maxWidth: SPACING.maxWidth.sm,
                mx: 'auto',
            }}
        >
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                Game Settings
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Game Mode</InputLabel>
                        <Select
                            value={settings.mode}
                            label="Game Mode"
                            onChange={e =>
                                onUpdate({
                                    ...settings,
                                    mode: e.target.value as GameMode,
                                })
                            }
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                        >
                            <MenuItem value="toCountry">
                                Guess Country (from Code)
                            </MenuItem>
                            <MenuItem value="toCode">
                                Guess Code (from Country)
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Language Filter</InputLabel>
                        <Select
                            value={settings.filterLanguage}
                            label="Language Filter"
                            onChange={e =>
                                onUpdate({
                                    ...settings,
                                    filterLanguage: e.target.value,
                                })
                            }
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                        >
                            {CCTLD_LANGUAGES.map(lang => (
                                <MenuItem key={lang} value={lang}>
                                    {lang}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Filter by Letter(s)"
                        value={settings.filterLetter}
                        onChange={e =>
                            onUpdate({
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
                                onStart();
                            }
                        }}
                        sx={{
                            input: { color: COLORS.text.primary },
                            label: { color: COLORS.text.secondary },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: COLORS.border.subtle,
                                },
                                '&:hover fieldset': {
                                    borderColor: COLORS.primary.main,
                                },
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Question Limit</InputLabel>
                        <Select
                            value={settings.maxQuestions}
                            label="Question Limit"
                            onChange={e =>
                                onUpdate({
                                    ...settings,
                                    maxQuestions: e.target.value as
                                        | number
                                        | 'All',
                                })
                            }
                            sx={{
                                color: COLORS.text.primary,
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLORS.border.subtle,
                                },
                            }}
                            {...commonSelectProps}
                        >
                            <MenuItem value="All">All</MenuItem>
                            {GAME_CONSTANTS.cctld.questionOptions.map(opt => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Card>
    );
};

const QuizGame = ({
    settings,
    initialPool,
    onEndGame,
    onBackToMenu,
}: {
    settings: QuizSettings;
    initialPool: CCTLD[];
    onEndGame: (history: Question[], score: number) => void;
    onBackToMenu: () => void;
}) => {
    const [history, setHistory] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<CCTLD | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');
    const [pool, setPool] = useState<CCTLD[]>(initialPool);
    const [totalQuestions, setTotalQuestions] = useState(initialPool.length);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);

    // Refs for real-time access during callbacks (prevents stale closure issues)
    const historyRef = React.useRef(history);
    const scoreRef = React.useRef(score);
    const advanceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const nextButtonRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (showFeedback) {
            nextButtonRef.current?.focus();
        } else {
            // Slight delay to ensure DOM is ready/transitions complete
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [showFeedback, currentQuestion]);

    useEffect(() => {
        historyRef.current = history;
    }, [history]);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    // Initialize Game State
    useEffect(() => {
        // Shuffle the initial pool once at the start
        const shuffled = [...initialPool].sort(() => Math.random() - 0.5);
        if (shuffled.length > 0) {
            setCurrentQuestion(shuffled[0]);
            setPool(shuffled.slice(1));
        } else {
            setCurrentQuestion(null);
            setPool([]);
        }
        setTotalQuestions(shuffled.length);
    }, [initialPool]);

    const nextQuestion = useCallback(() => {
        setPool(prevPool => {
            if (prevPool.length === 0) {
                onEndGame(historyRef.current, scoreRef.current);
                return [];
            }

            if (advanceTimerRef.current) {
                clearTimeout(advanceTimerRef.current);
                advanceTimerRef.current = null;
            }

            const next = prevPool[0];
            setCurrentQuestion(next);
            setInputValue('');
            setShowFeedback(false);
            setShowHint(false);
            return prevPool.slice(1);
        });
    }, [onEndGame]);

    // Removed redundant initial start effect

    const handleHint = () => {
        setShowHint(!showHint);
    };

    const handleSkip = () => {
        if (!currentQuestion) return;

        if (showFeedback) {
            nextQuestion();
            return;
        }

        const expected =
            settings.mode === 'toCountry'
                ? currentQuestion.country
                : currentQuestion.code;

        const newHistory = [
            ...history,
            {
                cctld: currentQuestion,
                userAnswer: '',
                isCorrect: false,
                pointsEarned: 0,
            },
        ];
        setHistory(newHistory);

        setFeedbackMessage(`${expected}`);
        setFeedbackColor(COLORS.data.amber);
        setShowFeedback(true);
        advanceTimerRef.current = setTimeout(() => {
            nextQuestion();
        }, 3000);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!currentQuestion || showFeedback) return;

        let correct = false;
        let expected = '';

        if (settings.mode === 'toCountry') {
            expected = currentQuestion.country;
            correct = isSmartMatch(inputValue, expected);
        } else {
            expected = currentQuestion.code;
            let input = inputValue.trim();
            if (!input.startsWith('.')) input = '.' + input;
            correct = normalize(input) === normalize(expected);
        }

        const pts = correct ? 1 : 0;

        if (correct) {
            const newHistory = [
                ...history,
                {
                    cctld: currentQuestion,
                    userAnswer: inputValue,
                    isCorrect: true,
                    pointsEarned: 1,
                },
            ];
            setHistory(newHistory);
            setScore(score + 1);

            setFeedbackMessage('Correct!');
            setFeedbackColor(COLORS.data.green);
            setShowFeedback(true);
            advanceTimerRef.current = setTimeout(() => {
                nextQuestion();
            }, 1000);
        } else {
            const newHistory = [
                ...history,
                {
                    cctld: currentQuestion,
                    userAnswer: inputValue,
                    isCorrect: false,
                    pointsEarned: 0,
                },
            ];
            setHistory(newHistory);

            setFeedbackMessage(`${expected}`);
            setFeedbackColor(COLORS.data.amber);
            setShowFeedback(true);
            advanceTimerRef.current = setTimeout(() => {
                nextQuestion();
            }, 3000);
        }
    };

    if (!currentQuestion && pool.length > 0)
        return <Typography>Loading...</Typography>;
    if (!currentQuestion)
        return <Typography>No questions found with these settings.</Typography>;

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 4,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: SPACING.maxWidth.sm,
                    mx: 'auto',
                }}
            >
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: SPACING.maxWidth.sm,
                        mx: 'auto',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                opacity: 0.6,
                            }}
                        >
                            {settings.mode === 'toCountry'
                                ? 'Guessing Country'
                                : 'Guessing Code'}
                        </Typography>
                        <Button
                            size="small"
                            variant="text"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBackToMenu}
                            sx={{
                                color: COLORS.text.secondary,
                                opacity: 0.6,
                                '&:hover': {
                                    opacity: 1,
                                    backgroundColor: 'transparent',
                                    color: COLORS.primary.main,
                                },
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                p: 0,
                            }}
                        >
                            Quit Quiz
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            mb: 1.5,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                            Question{' '}
                            {Math.min(history.length + 1, totalQuestions)} of{' '}
                            {totalQuestions}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                color: COLORS.primary.main,
                            }}
                        >
                            {score}{' '}
                            <Typography
                                component="span"
                                variant="caption"
                                color="textSecondary"
                                sx={{ fontWeight: 'normal' }}
                            >
                                PTS
                            </Typography>
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={
                            (Math.min(history.length, totalQuestions) /
                                totalQuestions) *
                            100
                        }
                        sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: COLORS.interactive.hover,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                background: `linear-gradient(90deg, ${COLORS.primary.main}, ${COLORS.primary.light})`,
                            },
                        }}
                    />
                </Box>

                <Card
                    sx={{
                        ...COMPONENT_VARIANTS.card,
                        p: 4,
                        pt: 6,
                        mb: 4,
                        minHeight: 360,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                    }}
                >
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ mb: 2 }}
                    >
                        {settings.mode === 'toCountry'
                            ? 'What country belongs to:'
                            : 'What is the ccTLD for:'}
                    </Typography>

                    <Fade in key={currentQuestion.code}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 4,
                            }}
                        >
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    fontSize: { xs: '3rem', sm: '4rem' },
                                }}
                            >
                                {settings.mode === 'toCountry'
                                    ? currentQuestion.code
                                    : currentQuestion.country}
                            </Typography>
                        </Box>
                    </Fade>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            inputRef={inputRef}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder={
                                settings.mode === 'toCountry'
                                    ? 'Type country name...'
                                    : 'Type code (e.g. .us)...'
                            }
                            disabled={showFeedback}
                            autoComplete="off"
                            sx={{
                                input: {
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                },
                                width: '100%',
                                maxWidth: 450,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: COLORS.border.subtle,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: COLORS.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: COLORS.primary.main,
                                    },
                                    '&.Mui-disabled fieldset': {
                                        borderColor: `${COLORS.border.subtle} !important`,
                                    },
                                },
                            }}
                            variant="outlined"
                        />
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                mt: 4,
                                justifyContent: 'center',
                                width: '100%',
                                maxWidth: 450,
                            }}
                        >
                            <Button
                                ref={nextButtonRef}
                                variant="outlined"
                                sx={{
                                    py: 1.5,
                                    flex: 1,
                                    borderColor: COLORS.border.subtle,
                                    color: COLORS.text.secondary,
                                    whiteSpace: 'nowrap',
                                    '&.Mui-disabled': {
                                        borderColor: COLORS.border.subtle,
                                        opacity: 0.6,
                                    },
                                }}
                                onClick={handleSkip}
                            >
                                {showFeedback ? 'Next' : 'Skip'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleHint}
                                disabled={showFeedback}
                                sx={{
                                    py: 1.5,
                                    flex: 1,
                                    borderColor: COLORS.border.subtle,
                                    whiteSpace: 'nowrap',
                                    '&.Mui-disabled': {
                                        borderColor: COLORS.border.subtle,
                                        opacity: 0.6,
                                    },
                                }}
                            >
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    py: 1.5,
                                    flex: 1,
                                    whiteSpace: 'nowrap',
                                    '&.Mui-disabled': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.05)',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        borderColor: 'transparent',
                                    },
                                }}
                                disabled={!inputValue || showFeedback}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Box>

                    {showHint && !showFeedback && (
                        <Fade in>
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    borderRadius: 1,
                                    border: `1px dashed ${COLORS.primary.main}40`,
                                    width: '100%',
                                    maxWidth: 450,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    Hint: {currentQuestion.language} origin
                                </Typography>
                            </Box>
                        </Fade>
                    )}

                    {showFeedback && (
                        <Fade in={showFeedback}>
                            <Box sx={{ mt: 3, width: '100%' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        mb: 1,
                                    }}
                                >
                                    {currentQuestion.flag && (
                                        <img
                                            src={currentQuestion.flag}
                                            alt={`Flag of ${currentQuestion.country}`}
                                            style={{
                                                height: '24px',
                                                width: 'auto',
                                                borderRadius: '2px',
                                                boxShadow:
                                                    '0 1px 4px rgba(0,0,0,0.2)',
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        sx={{
                                            color: feedbackColor,
                                            fontWeight: 'bold',
                                            textShadow:
                                                '0 0 20px rgba(0,0,0,0.5)',
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {feedbackMessage}
                                    </Typography>
                                </Box>
                                {history[history.length - 1]?.isCorrect ===
                                    false && (
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            fontStyle: 'italic',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Origin:{' '}
                                        <Box
                                            component="span"
                                            dangerouslySetInnerHTML={{
                                                __html: currentQuestion.explanation,
                                            }}
                                        />
                                    </Typography>
                                )}
                            </Box>
                        </Fade>
                    )}
                </Card>
            </Box>
        </Box>
    );
};

const CctldQuizPage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [settings, setSettings] = useState<QuizSettings>({
        mode: 'toCountry',
        allowRepeats: false,
        filterLetter: '',
        filterLanguage: 'All',
        maxQuestions: 'All',
    });
    const [lastScore, setLastScore] = useState(0);
    const [lastHistory, setLastHistory] = useState<Question[]>([]);

    const filteredPool = useMemo(() => {
        let filtered = cctldsData;
        if (settings.filterLanguage !== 'All') {
            if (settings.filterLanguage === 'Non-English') {
                filtered = filtered.filter(item => item.language !== 'English');
            } else {
                filtered = filtered.filter(
                    item => item.language === settings.filterLanguage
                );
            }
        }
        if (settings.filterLetter) {
            let letters = settings.filterLetter
                .toLowerCase()
                .split(',')
                .map(l => l.trim())
                .filter(l => l);

            if (letters.length <= 1 && !settings.filterLetter.includes(',')) {
                const spaceSplit = settings.filterLetter
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(l => l);
                if (spaceSplit.length > 1) {
                    letters = spaceSplit;
                } else {
                    letters = settings.filterLetter
                        .toLowerCase()
                        .split('')
                        .filter(l => l.trim());
                }
            }

            if (letters.length > 0) {
                filtered = filtered.filter(item => {
                    const text =
                        settings.mode === 'toCountry'
                            ? item.code.toLowerCase().replace('.', '')
                            : item.country.toLowerCase();
                    return letters.some(l => text.startsWith(l));
                });
            }
        }

        if (settings.maxQuestions !== 'All') {
            // Shuffle BEFORE slicing to ensure random sample
            return [...filtered]
                .sort(() => Math.random() - 0.5)
                .slice(0, settings.maxQuestions);
        }
        return filtered;
    }, [settings]);

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
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            alignItems="center"
            sx={{
                background: COLORS.surface.background,
                py: 8,
                px: 2,
                width: '100%',
            }}
        >
            <Box
                sx={{
                    mb: 6,
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: 800,
                    mx: 'auto',
                    marginBottom: 0,
                }}
            >
                <MuiGrid
                    container={true}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ marginBottom: 4 }}
                >
                    <MuiGrid size="auto">
                        <Typography
                            variant="h1"
                            sx={{
                                color: COLORS.text.primary,
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                fontSize: TYPOGRAPHY.fontSize.h2,
                            }}
                        >
                            ccTLD Mastery
                        </Typography>
                    </MuiGrid>
                    <MuiGrid size="auto" sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            href="https://en.wikipedia.org/wiki/Country_code_top-level_domain"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <InfoIcon
                                sx={{
                                    fontSize: {
                                        xs: TYPOGRAPHY.fontSize.h2,
                                        md: '2rem',
                                    },
                                }}
                            />
                        </IconButton>
                        <IconButton component="a" href="/">
                            <HomeIcon
                                sx={{
                                    fontSize: {
                                        xs: TYPOGRAPHY.fontSize.h2,
                                        md: '2rem',
                                    },
                                }}
                            />
                        </IconButton>
                    </MuiGrid>
                </MuiGrid>

                <Typography
                    variant="h5"
                    sx={{
                        color: COLORS.text.secondary,
                        marginTop: 2,
                        marginBottom: 4,
                        fontWeight: TYPOGRAPHY.fontWeight.normal,
                        fontSize: TYPOGRAPHY.fontSize.subheading,
                    }}
                >
                    Test your knowledge of Internet country codes
                </Typography>
            </Box>

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
                        <SettingsPanel
                            settings={settings}
                            onUpdate={setSettings}
                            onStart={handleStart}
                        />
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
                    settings={settings}
                    initialPool={filteredPool}
                    onEndGame={handleEndGame}
                    onBackToMenu={handleBackToMenu}
                />
            )}

            {gameState === 'summary' && (
                <Fade in>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: SPACING.maxWidth.sm,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mx: 'auto',
                        }}
                    >
                        <Card
                            sx={{
                                ...COMPONENT_VARIANTS.card,
                                p: 4,
                                mb: 4,
                                width: '100%',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{ mb: 2, textAlign: 'center' }}
                            >
                                Quiz Complete!
                            </Typography>
                            <Typography
                                variant="h2"
                                sx={{
                                    color: COLORS.primary.main,
                                    mb: 4,
                                    textAlign: 'center',
                                }}
                            >
                                {lastScore} / {lastHistory.length}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleStart}
                                    sx={{ flex: 1 }}
                                >
                                    Play Again
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBackToMenu}
                                    sx={{ flex: 1 }}
                                >
                                    Menu
                                </Button>
                            </Box>
                        </Card>

                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ mb: 2, width: '100%' }}
                        >
                            History
                        </Typography>
                        <Stack
                            spacing={2}
                            sx={{
                                maxHeight: 400,
                                overflow: 'auto',
                                pr: 1,
                                width: '100%',
                            }}
                        >
                            {lastHistory.map((q, i) => (
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
                                        border: `1px solid ${COLORS.border.subtle}`,
                                        flexShrink: 0,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            textAlign: 'left',
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 0.5,
                                            }}
                                        >
                                            {q.cctld.flag && (
                                                <img
                                                    src={q.cctld.flag}
                                                    alt={`Flag of ${q.cctld.country}`}
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
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {settings.mode === 'toCountry'
                                                    ? q.cctld.code
                                                    : q.cctld.country}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            noWrap
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            Answer:{' '}
                                            {settings.mode === 'toCountry'
                                                ? q.cctld.country
                                                : q.cctld.code}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontStyle: 'italic',
                                                display: 'block',
                                                mt: 0.5,
                                                opacity: 0.8,
                                            }}
                                        >
                                            Origin:{' '}
                                            <Box
                                                component="span"
                                                dangerouslySetInnerHTML={{
                                                    __html: q.cctld.explanation,
                                                }}
                                            />
                                        </Typography>
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
                                                textTransform:
                                                    settings.mode ===
                                                    'toCountry'
                                                        ? 'uppercase'
                                                        : 'lowercase',
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
                                                <Chip
                                                    label="Skipped"
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.75rem',
                                                        borderColor:
                                                            'rgba(239, 83, 80, 0.3)',
                                                        color: COLORS.data.red,
                                                        fontWeight: 'medium',
                                                    }}
                                                />
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
                            ))}
                        </Stack>
                    </Box>
                </Fade>
            )}
        </Grid>
    );
};

export default CctldQuizPage;
