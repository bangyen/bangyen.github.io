import React from 'react';
import { Box, Typography, Fade, Card } from '@mui/material';
import { SPACING, COMPONENT_VARIANTS } from '../../../config/theme';
import { QUIZ_UI_CONSTANTS } from '../config/quizConfig';
import { Question } from '../types/quiz';
import { QuizHeader } from './QuizHeader';
import { QuizFeedback } from './QuizFeedback';
import { QuizInput } from './QuizInput';

export interface QuizGameViewProps<T> {
    gameState: {
        history: Question<T>[];
        currentQuestion: T | null;
        inputValue: string;
        showFeedback: boolean;
        feedbackMessage: string;
        isCorrect: boolean | null;
        totalQuestions: number;
        showHint: boolean;
        score: number;
        hasInitialized: boolean;
    };
    actions: {
        setInputValue: (val: string) => void;
        handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
        submitAnswer?: (ans: string) => Promise<void>;
        handleSkip: () => Promise<void>;
        toggleHint: () => void;
    };
    onBackToMenu: () => void;
    renderQuestionPrompt: () => string;
    renderQuestionContent: (item: T) => React.ReactNode;
    renderHint: (item: T) => React.ReactNode;
    renderFeedbackFlag?: (item: T) => React.ReactNode;
    renderFeedbackOrigin?: (item: T) => React.ReactNode;
    inputPlaceholder?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    nextButtonRef?: React.RefObject<HTMLButtonElement | null>;
    modeLabel: string;
    hideInput?: boolean;
    hideHint?: boolean;
    renderCustomActions?: (
        gameState: QuizGameViewProps<T>['gameState'],
        actions: QuizGameViewProps<T>['actions']
    ) => React.ReactNode;
    onKeyDown?: (e: KeyboardEvent) => void;
}

const QuizGameView = <T,>({
    gameState,
    actions,
    onBackToMenu,
    renderQuestionPrompt,
    renderQuestionContent,
    renderHint,
    renderFeedbackFlag,
    renderFeedbackOrigin,
    inputPlaceholder = 'Type answer...',
    inputRef,
    nextButtonRef,
    modeLabel,
    hideInput = false,
    hideHint = false,
    renderCustomActions,
    onKeyDown,
}: QuizGameViewProps<T>) => {
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
        hasInitialized,
    } = gameState;

    const { setInputValue, handleSubmit, handleSkip, toggleHint } = actions;

    React.useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                if (showFeedback) {
                    void handleSkip();
                } else if (hideInput || !inputValue.trim()) {
                    void handleSkip();
                } else {
                    void handleSubmit();
                }
                return;
            }

            // Quiz-specific handlers
            if (onKeyDown) {
                onKeyDown(e);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [
        showFeedback,
        hideInput,
        inputValue,
        handleSkip,
        handleSubmit,
        onKeyDown,
    ]);

    const currentQuestionNumber = Math.min(history.length + 1, totalQuestions);
    const progressValue =
        totalQuestions > 0
            ? (Math.min(history.length, totalQuestions) / totalQuestions) * 100
            : 0;

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
                <QuizHeader
                    modeLabel={modeLabel}
                    currentQuestionNumber={currentQuestionNumber}
                    totalQuestions={totalQuestions}
                    score={score}
                    progressValue={progressValue}
                    hasInitialized={hasInitialized}
                    onBackToMenu={onBackToMenu}
                />

                <Card
                    sx={{
                        ...COMPONENT_VARIANTS.card,
                        p: 4,
                        pt: 6,
                        pb: 3,
                        mb: 4,
                        minHeight: QUIZ_UI_CONSTANTS.QUESTION_CARD.MIN_HEIGHT,
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
                        {renderQuestionPrompt()}
                    </Typography>

                    <Fade in key={JSON.stringify(currentQuestion)}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 4,
                            }}
                        >
                            {currentQuestion ? (
                                renderQuestionContent(currentQuestion)
                            ) : (
                                <Typography variant="h4" color="textSecondary">
                                    Loading...
                                </Typography>
                            )}
                        </Box>
                    </Fade>

                    <QuizInput
                        inputValue={inputValue}
                        showFeedback={showFeedback}
                        showHint={showHint}
                        hideInput={hideInput}
                        hideHint={hideHint}
                        inputPlaceholder={inputPlaceholder}
                        currentQuestion={currentQuestion}
                        inputRef={inputRef}
                        nextButtonRef={nextButtonRef}
                        onInputChange={setInputValue}
                        onSubmit={e => {
                            void handleSubmit(e);
                        }}
                        onSkip={() => {
                            void handleSkip();
                        }}
                        onToggleHint={toggleHint}
                        renderHint={renderHint}
                        renderCustomActions={renderCustomActions?.(
                            gameState,
                            actions
                        )}
                    />

                    <QuizFeedback
                        showFeedback={showFeedback}
                        isCorrect={isCorrect}
                        feedbackMessage={feedbackMessage}
                        currentQuestion={currentQuestion}
                        renderFeedbackFlag={renderFeedbackFlag}
                        renderFeedbackOrigin={renderFeedbackOrigin}
                    />
                </Card>
            </Box>
        </Box>
    );
};

export default QuizGameView;
