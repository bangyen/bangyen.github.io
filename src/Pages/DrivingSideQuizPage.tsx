import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Fade,
    Card,
    Grid,
    TextField,
    Chip,
} from '@mui/material';
import { COLORS, SPACING } from '../config/theme';
import { GAME_CONSTANTS } from '../config/constants';
import { normalize } from '../utils/quizUtils';
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
import drivingSideData from '../data/driving_sides.json';

// --- Types ---

interface DrivingSide {
    country: string;
    side: 'Left' | 'Right';
    flag: string;
    explanation: string;
}

type Question = GenericQuestion<DrivingSide>;

// --- Components ---

const DrivingSideGame: React.FC<{
    settings: QuizSettings;
    initialPool: DrivingSide[];
    onEndGame: (history: Question[], score: number) => void;
    onBackToMenu: () => void;
}> = ({ settings, initialPool, onEndGame, onBackToMenu }) => {
    const checkAnswer = (input: string, item: DrivingSide) => {
        const normalizedInput = normalize(input);
        const normalizedCorrect = normalize(item.side);

        if (normalizedInput === normalizedCorrect) {
            return { isCorrect: true, expected: item.side, points: 1 };
        }
        return { isCorrect: false, expected: item.side, points: 0 };
    };

    const { state, actions } = useQuizEngine<DrivingSide>({
        initialPool,
        settings,
        checkAnswer,
        onEndGame,
    });

    return (
        <QuizGameView
            gameState={state}
            actions={actions}
            onBackToMenu={onBackToMenu}
            modeLabel="Which Side?"
            hideInput={true}
            hideHint={true}
            renderQuestionPrompt={() => 'They drive on the...'}
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
            renderQuestionContent={item => (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {item.country}
                    </Typography>
                    {item.flag && (
                        <Box
                            component="img"
                            src={item.flag}
                            alt={`Flag of ${item.country}`}
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
            )}
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
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
            renderFeedbackOrigin={item => {
                const cleanExplanation = item.explanation
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
                            dangerouslySetInnerHTML={{
                                __html: cleanExplanation,
                            }}
                        />
                    </Typography>
                );
            }}
        />
    );
};

const DrivingSideQuizPage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [settings, setSettings] = useState<QuizSettings>({
        mode: 'guessing',
        allowRepeats: false,
        filterLetter: '',
        filterLanguage: 'All',
        maxQuestions: 'All',
    });
    const [lastScore, setLastScore] = useState(0);
    const [lastHistory, setLastHistory] = useState<Question[]>([]);

    const filteredPool = useMemo(() => {
        let filtered = drivingSideData as DrivingSide[];

        if (settings.filterLetter) {
            const letters = settings.filterLetter
                .split(',')
                .map((l: string) => l.trim().toUpperCase())
                .filter((l: string) => l !== '');
            if (letters.length > 0) {
                filtered = filtered.filter(item =>
                    letters.some((l: string) =>
                        item.country.toUpperCase().startsWith(l)
                    )
                );
            }
        }

        if (settings.maxQuestions !== 'All') {
            return [...filtered]
                .sort(() => Math.random() - 0.5)
                .slice(0, settings.maxQuestions as number);
        }
        return filtered;
    }, [settings.maxQuestions, settings.filterLetter]);

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
            title="Driving Side"
            subtitle="Test your knowledge of global road rules"
            infoUrl="https://en.wikipedia.org/wiki/Left-_and_right-hand_traffic"
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
                                <TextField
                                    fullWidth
                                    label="Filter by Letter(s)"
                                    value={settings.filterLetter}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setSettings({
                                            ...settings,
                                            filterLetter: e.target.value,
                                        })
                                    }
                                    helperText="Comma separated (e.g. a, b)"
                                    InputLabelProps={{
                                        style: { color: COLORS.text.secondary },
                                    }}
                                    onKeyDown={(e: React.KeyboardEvent) => {
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
                                mt: 4,
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
                                }}
                            >
                                Start Quiz ({filteredPool.length})
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            )}

            {gameState === 'playing' && (
                <DrivingSideGame
                    settings={settings}
                    initialPool={filteredPool}
                    onEndGame={handleEndGame}
                    onBackToMenu={handleBackToMenu}
                />
            )}

            {gameState === 'summary' && (
                <QuizSummaryView<DrivingSide>
                    score={lastScore}
                    history={lastHistory}
                    onRestart={handleStart}
                    onBackToMenu={handleBackToMenu}
                    renderHistoryItem={(q, i) => {
                        const switchInfo = q.item.explanation
                            .replace(/Drives on the <b>.*?<\/b>\.?\s*/i, '')
                            .trim();

                        return (
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
                                            : 'rgba(239, 83, 80, 0.05)',
                                    border: `1px solid hsla(0, 0%, 100%, 0.1)`,
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
                                                alt=""
                                                style={{
                                                    height: 16,
                                                    width: 'auto',
                                                    borderRadius: 1,
                                                }}
                                            />
                                        )}
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            noWrap
                                        >
                                            {q.item.country}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        noWrap
                                    >
                                        Answer: {q.item.side}
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
                                        {switchInfo || '\u00A0'}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        ml: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    {q.userAnswer ? (
                                        <Chip
                                            label={q.userAnswer}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                fontWeight: 'medium',
                                                width: 100,
                                                height: 20,
                                                fontSize: '0.75rem',
                                                borderColor:
                                                    q.pointsEarned === 1
                                                        ? 'rgba(76, 175, 80, 0.3)'
                                                        : 'rgba(239, 83, 80, 0.3)',
                                                color:
                                                    q.pointsEarned === 1
                                                        ? COLORS.data.green
                                                        : COLORS.data.red,
                                                '& .MuiChip-label': { px: 1 },
                                            }}
                                        />
                                    ) : (
                                        <SkippedBadge />
                                    )}
                                </Box>
                            </Card>
                        );
                    }}
                />
            )}
        </QuizLayout>
    );
};

export default DrivingSideQuizPage;
