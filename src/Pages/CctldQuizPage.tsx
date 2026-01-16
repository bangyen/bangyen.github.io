import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from 'react';
import {
    Box,
    Typography,
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
    Card,
} from '@mui/material';
import {
    ArrowBackRounded as ArrowBackIcon,
    RefreshRounded as RefreshIcon,
    CheckCircleRounded as CheckCircleIcon,
    CancelRounded as CancelIcon,
} from '@mui/icons-material';
import { COLORS, SPACING, COMPONENT_VARIANTS } from '../config/theme';
import {
    CCTLD_ALIASES,
    CCTLD_LANGUAGES,
    GAME_CONSTANTS,
} from '../config/constants';
import { normalize, isSmartMatch } from '../utils/quizUtils';
import {
    GameState,
    QuizSettings,
    Question as GenericQuestion,
} from '../types/quiz';
import { useQuizEngine } from '../hooks/useQuizEngine';
import {
    QuizLayout,
    QuizSettingsView,
    QuizGameView,
    QuizSummaryView,
} from '../components/Quiz';
import cctldsData from '../data/cctlds_enhanced.json';

// --- Types ---

interface CCTLD {
    code: string;
    country: string;
    explanation: string;
    notes: string;
    flag: string;
    language: string;
}

export type GameMode = 'toCountry' | 'toCode';

type Question = GenericQuestion<CCTLD>;

// --- Constants ---

// Helper functions moved to src/utils/quizUtils.ts

// --- Components ---

const commonSelectProps = {
    MenuProps: {
        BackdropProps: {
            sx: { backdropFilter: 'none', backgroundColor: 'transparent' },
        },
    },
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
    const { state, actions } = useQuizEngine<CCTLD>({
        initialPool,
        settings,
        onEndGame,
        checkAnswer: (input: string, item: CCTLD, settings: QuizSettings) => {
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
                    : 'Type code (e.g. .us)...'
            }
            renderQuestionPrompt={() =>
                settings.mode === 'toCountry'
                    ? 'What country belongs to:'
                    : 'What is the ccTLD for:'
            }
            renderQuestionContent={item => (
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: { xs: '3rem', sm: '4rem' },
                    }}
                >
                    {settings.mode === 'toCountry' ? item.code : item.country}
                </Typography>
            )}
            renderHint={item => (
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}
                >
                    Hint: {item.language} origin
                </Typography>
            )}
            renderFeedbackFlag={item =>
                item.flag && (
                    <img
                        src={item.flag}
                        alt={`Flag of ${item.country}`}
                        style={{
                            height: '24px',
                            width: 'auto',
                            borderRadius: '2px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }}
                    />
                )
            }
            renderFeedbackOrigin={item => (
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
                            __html: item.explanation,
                        }}
                    />
                </Typography>
            )}
        />
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
                .map((l: string) => l.trim())
                .filter((l: string) => l);

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
                filtered = filtered.filter((item: CCTLD) => {
                    const text =
                        settings.mode === 'toCountry'
                            ? item.code.toLowerCase().replace('.', '')
                            : item.country.toLowerCase();
                    return letters.some((l: string) => text.startsWith(l));
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
        <QuizLayout
            title="ccTLD Mastery"
            subtitle="Test your knowledge of Internet country codes"
            infoUrl="https://en.wikipedia.org/wiki/Country_code_top-level_domain"
        >
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
                        <QuizSettingsView
                            settings={settings}
                            onUpdate={setSettings}
                            onStart={handleStart}
                            maxQuestionOptions={
                                GAME_CONSTANTS.cctld.questionOptions
                            }
                        >
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Game Mode</InputLabel>
                                    <Select
                                        value={settings.mode}
                                        label="Game Mode"
                                        onChange={e =>
                                            setSettings({
                                                ...settings,
                                                mode: e.target
                                                    .value as GameMode,
                                            })
                                        }
                                        sx={{
                                            color: COLORS.text.primary,
                                            '.MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor:
                                                        COLORS.border.subtle,
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
                                            setSettings({
                                                ...settings,
                                                filterLanguage: e.target.value,
                                            })
                                        }
                                        sx={{
                                            color: COLORS.text.primary,
                                            '.MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderColor:
                                                        COLORS.border.subtle,
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
                <QuizSummaryView<CCTLD>
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
                                    {q.item.flag && (
                                        <img
                                            src={q.item.flag}
                                            alt={`Flag of ${q.item.country}`}
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
                                            ? q.item.code
                                            : q.item.country}
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
                                        ? q.item.country
                                        : q.item.code}
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
                                            __html: q.item.explanation,
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
                                            settings.mode === 'toCountry'
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
                    )}
                />
            )}
        </QuizLayout>
    );
};

export default CctldQuizPage;
