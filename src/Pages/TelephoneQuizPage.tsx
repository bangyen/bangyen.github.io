import React, { useState, useMemo, useEffect, useRef } from 'react';
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
} from '@mui/material';
import {
    CheckCircleRounded as CheckCircleIcon,
    CancelRounded as CancelIcon,
} from '@mui/icons-material';
import { COLORS, SPACING } from '../config/theme';
import { GAME_CONSTANTS, CCTLD_ALIASES } from '../config/constants';
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
    SkippedBadge,
} from '../components/Quiz';
import telephoneData from '../data/telephone_codes.json';

// --- Types ---

interface TelephoneCode {
    code: string;
    country: string;
    flag: string;
}

export type GameMode = 'toCountry' | 'toCode';

type Question = GenericQuestion<TelephoneCode>;

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
    initialPool: TelephoneCode[];
    onEndGame: (history: Question[], score: number) => void;
    onBackToMenu: () => void;
}) => {
    const { state, actions } = useQuizEngine<TelephoneCode>({
        initialPool,
        settings,
        onEndGame,
        checkAnswer: (
            input: string,
            item: TelephoneCode,
            settings: QuizSettings
        ) => {
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

                // For telephone codes, normalization might involve removing spaces/parens
                const norm = (s: string) => s.replace(/[^0-9+]/g, '');
                correct = norm(normalizedInput) === norm(expected);
            }

            return { isCorrect: correct, expected, points: correct ? 1 : 0 };
        },
    });

    const { currentQuestion, showFeedback } = state;

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
                    : 'Type code (e.g. +1)...'
            }
            renderQuestionPrompt={() =>
                settings.mode === 'toCountry'
                    ? 'What country belongs to:'
                    : 'What is the telephone code for:'
            }
            renderQuestionContent={item => (
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: { xs: '2.5rem', sm: '3.5rem' },
                        wordBreak: 'break-word',
                    }}
                >
                    {settings.mode === 'toCountry' ? item.code : item.country}
                </Typography>
            )}
            renderHint={() => (
                <Typography variant="body2" color="textSecondary">
                    Hint functionality coming soon...
                </Typography>
            )}
            hideHint={true}
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
        />
    );
};

const TelephoneQuizPage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [settings, setSettings] = useState<QuizSettings>({
        mode: 'toCountry',
        allowRepeats: false,
        filterLetter: '',
        maxQuestions: 'All',
    });
    const [lastScore, setLastScore] = useState(0);
    const [lastHistory, setLastHistory] = useState<Question[]>([]);

    const filteredPool = useMemo(() => {
        let filtered = telephoneData as TelephoneCode[];

        if (settings.filterLetter) {
            const letters = settings.filterLetter
                .toLowerCase()
                .split(',')
                .map((l: string) => l.trim())
                .filter((l: string) => l);

            if (letters.length > 0) {
                filtered = filtered.filter((item: TelephoneCode) => {
                    const text =
                        settings.mode === 'toCountry'
                            ? item.code.replace('+', '')
                            : item.country.toLowerCase();
                    return letters.some((l: string) =>
                        text.toLowerCase().startsWith(l)
                    );
                });
            }
        }

        if (settings.maxQuestions !== 'All') {
            return [...filtered]
                .sort(() => Math.random() - 0.5)
                .slice(0, settings.maxQuestions as number);
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
            title="Telephone Code Quiz"
            subtitle="Master the world's calling codes"
            infoUrl="https://en.wikipedia.org/wiki/List_of_telephone_country_codes"
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
                                GAME_CONSTANTS.telephone.questionOptions
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
                                    helperText="e.g. 1, 44 or A, B"
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
                <QuizSummaryView<TelephoneCode>
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
                                alignItems: 'center',
                                bgcolor:
                                    q.pointsEarned === 1
                                        ? 'rgba(76, 175, 80, 0.05)'
                                        : 'rgba(239, 83, 80, 0.05)',
                                border: `1px solid ${COLORS.border.subtle}`,
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
                                    >
                                        {settings.mode === 'toCountry'
                                            ? q.item.code
                                            : q.item.country}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Answer:{' '}
                                    {settings.mode === 'toCountry'
                                        ? q.item.country
                                        : q.item.code}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    ml: 2,
                                    flexShrink: 0,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            q.pointsEarned === 1
                                                ? COLORS.data.green
                                                : COLORS.data.red,
                                        fontWeight:
                                            q.pointsEarned === 1
                                                ? 'bold'
                                                : 'normal',
                                        fontSize: '0.75rem',
                                        maxWidth: '120px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {q.userAnswer?.trim() ? (
                                        q.userAnswer.trim()
                                    ) : (
                                        <SkippedBadge />
                                    )}
                                </Typography>
                                {q.pointsEarned === 1 ? (
                                    <CheckCircleIcon
                                        fontSize="small"
                                        color="success"
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

export default TelephoneQuizPage;
