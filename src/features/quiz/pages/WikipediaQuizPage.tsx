import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, Fade, SelectChangeEvent } from '@mui/material';
import { SPACING, COLORS } from '../../../config/theme';
import { QUIZ_CONFIGS, QUIZ_UI_CONSTANTS } from '../config/quizConfig';
import {
    QuizSettings,
    QuizType,
    Question,
    GameState,
    QuizItem,
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

    // Derive selected quiz from URL or Route
    const selectedQuiz = useMemo((): QuizType => {
        const type = searchParams.get('type');
        if (type && Object.prototype.hasOwnProperty.call(QUIZ_CONFIGS, type)) {
            return type as QuizType;
        }
        return 'cctld';
    }, [searchParams]);

    const [gameState, setGameState] = useState<GameState>('menu');

    // Initialize settings based on selected quiz
    const [settings, setSettings] = useState<QuizSettings>(
        QUIZ_CONFIGS[selectedQuiz].defaultSettings
    );

    const [lastScore, setLastScore] = useState(0);
    const [lastHistory, setLastHistory] = useState<Question<QuizItem>[]>([]);

    // Reset settings and game state when quiz type changes (via URL)

    // URL sync
    const handleQuizChange = (event: SelectChangeEvent<unknown>) => {
        const newQuiz = event.target.value as QuizType;
        setSearchParams({ type: newQuiz });
    };

    const activeConfig = QUIZ_CONFIGS[selectedQuiz];

    // Update document title
    useEffect(() => {
        document.title = `${activeConfig.title} | Bangyen`;
    }, [selectedQuiz, activeConfig.title]);

    const filteredPool = useQuizFilter({
        data: activeConfig.data,
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
            title="Knowledge"
            infoUrl={activeConfig.infoUrl}
            headerContent={
                <QuizTopicSelector
                    uniqueId="quiz-topic-selector"
                    selectedQuiz={selectedQuiz}
                    onQuizChange={handleQuizChange}
                />
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
                                    fontSize:
                                        QUIZ_UI_CONSTANTS.START_BUTTON
                                            .FONT_SIZE,
                                    borderRadius: SPACING.borderRadius.full,
                                    fontWeight: 'bold',
                                    letterSpacing:
                                        QUIZ_UI_CONSTANTS.START_BUTTON
                                            .LETTER_SPACING,
                                    minWidth:
                                        QUIZ_UI_CONSTANTS.START_BUTTON
                                            .MIN_WIDTH,
                                    whiteSpace: 'nowrap',
                                    '&.Mui-disabled': {
                                        backgroundColor:
                                            COLORS.interactive.disabled,
                                        color: COLORS.interactive.disabledText,
                                    },
                                }}
                            >
                                {filteredPool.length === 0
                                    ? 'No Questions Found'
                                    : `Start Quiz (${filteredPool.length.toString()})`}
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
