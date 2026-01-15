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
import cctldsData from '../data/cctlds.json';

import { Grid as MuiGrid } from '../components/mui';

// --- Types ---

interface CCTLD {
    code: string;
    country: string;
    origin_explanation: string;
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
}

// --- Constants ---

const LANGUAGES = Array.from(
    new Set(cctldsData.map(item => item.language))
).sort();
const NON_ENGLISH_LANGUAGES = LANGUAGES.filter(l => l !== 'English');

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
    const aliases: Record<string, string[]> = {
        'united arab emirates': ['uae'],
        'united states': ['us', 'usa'],
        'united kingdom': ['uk'],
        'democratic republic of the congo': ['drc', 'congo dr'],
        'republic of the congo': ['congo'],
        'central african republic': ['car'],
        'british indian ocean territory': ['biot'],
        'saint vincent and the grenadines': ['st vincent'],
        'saint kitts and nevis': ['st kitts'],
        'antigua and barbuda': ['antigua'],
        'trinidad and tobago': ['trinidad'],
        'bosnia and herzegovina': ['bosnia'],
        'sao tome and principe': ['sao tome'],
        'turks and caicos islands': ['turks and caicos'],
    };

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
                maxWidth: 800,
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
                            <MenuItem value="All">All Origins</MenuItem>
                            <MenuItem value="Non-English">
                                Non-English Origins
                            </MenuItem>
                            {LANGUAGES.map(lang => (
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
                            <MenuItem value="All">All Questions</MenuItem>
                            <MenuItem value={5}>5 Questions</MenuItem>
                            <MenuItem value={10}>10 Questions</MenuItem>
                            <MenuItem value={20}>20 Questions</MenuItem>
                            <MenuItem value={50}>50 Questions</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Card>
    );
};

const QuizGame = ({
    settings,
    onEndGame,
    onBackToMenu,
}: {
    settings: QuizSettings;
    onEndGame: (history: Question[], score: number) => void;
    onBackToMenu: () => void;
}) => {
    const [history, setHistory] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<CCTLD | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');
    const [pool, setPool] = useState<CCTLD[]>([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);

    // Refs for real-time access during callbacks (prevents stale closure issues)
    const historyRef = React.useRef(history);
    const scoreRef = React.useRef(score);

    useEffect(() => {
        historyRef.current = history;
    }, [history]);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    // Initialize Pool
    useEffect(() => {
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
            const letters = settings.filterLetter
                .toLowerCase()
                .split(',')
                .map(l => l.trim())
                .filter(l => l);
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
        // Shuffle
        let shuffled = [...filtered].sort(() => Math.random() - 0.5);

        // Apply Question Limit
        if (settings.maxQuestions !== 'All') {
            shuffled = shuffled.slice(0, settings.maxQuestions);
        }

        setPool(shuffled);
        setTotalQuestions(shuffled.length);
    }, [settings]);

    const nextQuestion = useCallback(() => {
        setPool(prevPool => {
            if (prevPool.length === 0) {
                onEndGame(historyRef.current, scoreRef.current);
                return [];
            }

            const next = prevPool[0];
            setCurrentQuestion(next);
            setInputValue('');
            setShowFeedback(false);
            setShowHint(false);
            return prevPool.slice(1);
        });
    }, [onEndGame]);

    // Initial Start
    useEffect(() => {
        if (!currentQuestion && pool.length > 0) {
            // First question
            const next = pool[0];
            setCurrentQuestion(next);
            setPool(p => p.slice(1));
        } else if (
            !currentQuestion &&
            pool.length === 0 &&
            history.length > 0
        ) {
            // Game over trigger from within render cycle? better to handle in nextQuestion logic or effect
            // but nextQuestion logic above handles it via storage
        }
    }, [pool, currentQuestion, history.length]);

    const handleHint = () => {
        setShowHint(!showHint);
    };

    const handleSkip = () => {
        if (!currentQuestion || showFeedback) return;

        const expected =
            settings.mode === 'toCountry'
                ? currentQuestion.country
                : currentQuestion.code;

        const newHistory = [
            ...history,
            { cctld: currentQuestion, userAnswer: '', isCorrect: false },
        ];
        setHistory(newHistory);

        setFeedbackMessage(`${expected}`);
        setFeedbackColor(COLORS.data.amber);
        setShowFeedback(true);
        setTimeout(() => {
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

        const newHistory = [
            ...history,
            {
                cctld: currentQuestion,
                userAnswer: inputValue,
                isCorrect: correct,
            },
        ];
        setHistory(newHistory);

        const newScore = correct ? score + 1 : score;
        setScore(newScore);

        if (correct) {
            setFeedbackMessage('Correct!');
            setFeedbackColor(COLORS.data.green);
            setShowFeedback(true);
            setTimeout(() => {
                nextQuestion();
            }, 1000);
        } else {
            setFeedbackMessage(`${expected}`);
            setFeedbackColor(COLORS.data.amber);
            setShowFeedback(true);
            setTimeout(() => {
                nextQuestion();
            }, 3000); // More time to read explanation if incorrect
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
            <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: 600,
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
                        <Typography
                            variant="h1"
                            sx={{
                                mb: 4,
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                        >
                            {settings.mode === 'toCountry'
                                ? currentQuestion.code
                                : currentQuestion.country}
                        </Typography>
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
                                disabled={showFeedback}
                            >
                                Skip
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
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: feedbackColor,
                                        fontWeight: 'bold',
                                        textShadow: '0 0 20px rgba(0,0,0,0.5)',
                                        mb: 1,
                                        textAlign: 'center',
                                    }}
                                >
                                    {feedbackMessage}
                                </Typography>
                                {!history[history.length - 1]?.isCorrect && (
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            fontStyle: 'italic',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Origin:{' '}
                                        {currentQuestion.origin_explanation}
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

    const handleStart = () => {
        setGameState('playing');
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
                                sx={{
                                    px: 8,
                                    py: 1.5,
                                    fontSize: '1.2rem',
                                    borderRadius: SPACING.borderRadius.full,
                                    fontWeight: 'bold',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Start Quiz
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            )}

            {gameState === 'playing' && (
                <QuizGame
                    settings={settings}
                    onEndGame={handleEndGame}
                    onBackToMenu={handleBackToMenu}
                />
            )}

            {gameState === 'summary' && (
                <Fade in>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 600,
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
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                Quiz Complete!
                            </Typography>
                            <Typography
                                variant="h2"
                                sx={{ color: COLORS.primary.main, mb: 4 }}
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
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleStart}
                                >
                                    Play Again
                                </Button>
                                <Button
                                    variant="text"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBackToMenu}
                                >
                                    Menu
                                </Button>
                            </Box>
                        </Card>

                        <Typography
                            variant="h6"
                            align="left"
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
                                        alignItems: 'center',
                                        bgcolor: q.isCorrect
                                            ? 'rgba(76, 175, 80, 0.05)'
                                            : 'rgba(239, 83, 80, 0.05)',
                                    }}
                                >
                                    <Box textAlign="left">
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                        >
                                            {settings.mode === 'toCountry'
                                                ? q.cctld.code
                                                : q.cctld.country}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            Ans:{' '}
                                            {settings.mode === 'toCountry'
                                                ? q.cctld.country
                                                : q.cctld.code}
                                        </Typography>
                                        {!q.isCorrect && (
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
                                                {q.cctld.origin_explanation}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box textAlign="right">
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: q.isCorrect
                                                    ? COLORS.data.green
                                                    : COLORS.data.amber,
                                                fontWeight: q.isCorrect
                                                    ? 'normal'
                                                    : 'bold',
                                            }}
                                        >
                                            {q.userAnswer || '(skipped)'}
                                        </Typography>
                                        {q.isCorrect ? (
                                            <CheckCircleIcon
                                                fontSize="small"
                                                color="success"
                                                sx={{ mt: 0.5 }}
                                            />
                                        ) : (
                                            <CancelIcon
                                                fontSize="small"
                                                color="error"
                                                sx={{ mt: 0.5 }}
                                            />
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
