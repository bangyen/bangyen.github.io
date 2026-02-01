import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Fade, SelectChangeEvent } from '@mui/material';
import { SPACING, COLORS } from '../../../config/theme';
import { ROUTES, PAGE_TITLES } from '../../../config/constants';
import { QUIZ_CONFIGS } from '../config/quizConfig';
import {
    QuizSettings,
    QuizType,
    Question,
    GameState,
    QuizItem,
    ArtItem,
} from '../types/quiz';
import { useQuizFilter } from '../hooks/quiz';

import QuizLayout from '../components/QuizLayout';
import QuizSettingsView from '../components/QuizSettingsView';
import QuizSummaryView from '../components/QuizSummaryView';
import QuizGame from '../components/QuizGame';

import QuizTopicSelector from '../components/QuizTopicSelector';
import QuizFilters from '../components/QuizFilters';
import QuizHistoryItem from '../components/QuizHistoryItem';

const commonSelectProps = {
    MenuProps: {
        BackdropProps: {
            sx: { backdropFilter: 'none', backgroundColor: 'transparent' },
        },
    },
};

const WikipediaQuizPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isArtQuizRoute = location.pathname === ROUTES.pages.ArtQuiz;

    // Derive selected quiz from URL or Route
    const selectedQuiz = useMemo((): QuizType => {
        if (isArtQuizRoute) return 'art';

        const type = searchParams.get('type');
        if (type && QUIZ_CONFIGS[type as QuizType]) {
            return type as QuizType;
        }
        return 'cctld';
    }, [searchParams, isArtQuizRoute]);

    const [gameState, setGameState] = useState<GameState>('menu');

    // Initialize settings based on selected quiz
    const [settings, setSettings] = useState<QuizSettings>(
        QUIZ_CONFIGS[selectedQuiz].defaultSettings
    );

    const [lastScore, setLastScore] = useState(0);
    const [lastHistory, setLastHistory] = useState<Question<QuizItem>[]>([]);

    const [artData, setArtData] = useState<ArtItem[]>([]);
    const [isLoadingArt, setIsLoadingArt] = useState(false);

    // Reset settings and game state when quiz type changes (via URL)
    useEffect(() => {
        setGameState('menu');
        setSettings(QUIZ_CONFIGS[selectedQuiz].defaultSettings);
    }, [selectedQuiz]);

    // Fetch art data if needed
    useEffect(() => {
        if (selectedQuiz === 'art' && artData.length === 0 && !isLoadingArt) {
            const loadStaticArt = async () => {
                setIsLoadingArt(true);
                try {
                    // Fetch uncompressed JSON directly
                    const response = await fetch('/assets/art_data.json');
                    if (!response.ok)
                        throw new Error(
                            `Failed to load art data: ${response.statusText}`
                        );

                    const artItems: ArtItem[] = await response.json();

                    if (artItems && artItems.length > 0) {
                        setArtData(artItems);
                    } else {
                        throw new Error('Empty art data');
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Failed to load art data:', error);
                    // Do NOT fallback to runtime fetch which uses hardcoded seeds
                } finally {
                    setIsLoadingArt(false);
                }
            };
            void loadStaticArt();
        }
    }, [selectedQuiz, artData.length, isLoadingArt]);

    // URL sync
    const handleQuizChange = (event: SelectChangeEvent<unknown>) => {
        const newQuiz = event.target.value as QuizType;
        if (isArtQuizRoute && newQuiz !== 'art') {
            void navigate(`${ROUTES.pages.Geography}?type=${newQuiz}`);
        } else {
            setSearchParams({ type: newQuiz });
        }
    };

    const activeConfig = QUIZ_CONFIGS[selectedQuiz];

    // Update document title
    useEffect(() => {
        document.title = isArtQuizRoute
            ? PAGE_TITLES.artQuiz
            : `${activeConfig.title} | Bangyen`;
    }, [isArtQuizRoute, selectedQuiz, activeConfig.title]);

    const filteredPool = useQuizFilter({
        data: selectedQuiz === 'art' ? artData : activeConfig.data,
        quizType: selectedQuiz,
        settings,
    });

    const handleStart = () => {
        if (filteredPool.length > 0) {
            setGameState('playing');
        }
    };

    const handleEndGame = (history: Question<QuizItem>[], score: number) => {
        setLastHistory(history);
        setLastScore(score);
        setGameState('summary');
    };

    const handleBackToMenu = () => {
        setGameState('menu');
    };

    return (
        <QuizLayout
            title={isArtQuizRoute ? 'Art History' : 'Knowledge'}
            infoUrl={activeConfig.infoUrl}
            headerContent={
                !isArtQuizRoute && (
                    <QuizTopicSelector
                        uniqueId="quiz-topic-selector"
                        selectedQuiz={selectedQuiz}
                        onQuizChange={handleQuizChange}
                    />
                )
            }
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
                            maxQuestionOptions={activeConfig.maxQuestionOptions}
                            title="Quiz Settings"
                        >
                            <QuizFilters
                                selectedQuiz={selectedQuiz}
                                settings={settings}
                                onSettingsChange={setSettings}
                                activeConfig={activeConfig}
                                commonSelectProps={commonSelectProps}
                                onEnterKey={handleStart}
                            />
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
                                    px: { xs: 4, sm: 8 },
                                    py: 1.5,
                                    fontSize: { xs: '1rem', sm: '1.2rem' },
                                    borderRadius: SPACING.borderRadius.full,
                                    fontWeight: 'bold',
                                    letterSpacing: '0.05em',
                                    minWidth: { xs: 210, sm: 300 },
                                    whiteSpace: 'nowrap',
                                    '&.Mui-disabled': {
                                        backgroundColor:
                                            COLORS.interactive.disabled,
                                        color: COLORS.interactive.disabledText,
                                    },
                                }}
                            >
                                {filteredPool.length === 0
                                    ? isLoadingArt
                                        ? 'Fetching Artworks...'
                                        : 'No Questions Found'
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
                <QuizSummaryView<QuizItem>
                    score={lastScore}
                    history={lastHistory}
                    onRestart={handleStart}
                    onBackToMenu={handleBackToMenu}
                    renderHistoryItem={q => (
                        <QuizHistoryItem
                            key={q.id}
                            question={q}
                            selectedQuiz={selectedQuiz}
                            settings={settings}
                            activeConfig={activeConfig}
                        />
                    )}
                />
            )}
        </QuizLayout>
    );
};

export default WikipediaQuizPage;
