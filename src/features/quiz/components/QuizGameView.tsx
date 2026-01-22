import React from 'react';
import {
    Box,
    Typography,
    Button,
    Fade,
    TextField,
    Stack,
    LinearProgress,
    Card,
} from '@mui/material';

import { ArrowBackRounded as ArrowBackIcon } from '@mui/icons-material';
import {
    COLORS,
    SPACING,
    COMPONENT_VARIANTS,
    SHADOWS,
} from '../../../config/theme';
import { Question } from '../types/quiz';

interface QuizGameViewProps<T> {
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
        handleSubmit: (e?: React.FormEvent) => void;
        submitAnswer?: (ans: string) => void;
        handleSkip: () => void;
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
    } = gameState;

    const { setInputValue, handleSubmit, handleSkip, toggleHint } = actions;

    React.useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                if (showFeedback) {
                    handleSkip();
                } else if (hideInput || !inputValue.trim()) {
                    handleSkip();
                } else {
                    handleSubmit();
                }
                return;
            }

            // Quiz-specific handlers
            if (onKeyDown) {
                onKeyDown(e);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [
        showFeedback,
        hideInput,
        inputValue,
        handleSkip,
        handleSubmit,
        onKeyDown,
    ]);

    const feedbackColor = isCorrect ? COLORS.data.green : COLORS.data.amber;

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
                            {modeLabel}
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
                    {gameState.hasInitialized && (
                        <LinearProgress
                            aria-label="Quiz progress"
                            variant="determinate"
                            value={
                                totalQuestions > 0
                                    ? (Math.min(
                                          history.length,
                                          totalQuestions
                                      ) /
                                          totalQuestions) *
                                      100
                                    : 0
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
                    )}
                </Box>

                <Card
                    sx={{
                        ...COMPONENT_VARIANTS.card,
                        p: 4,
                        pt: 6,
                        pb: 3,
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
                        {!hideInput && (
                            <TextField
                                inputProps={{ 'aria-label': 'Answer input' }}
                                inputRef={inputRef}
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder={inputPlaceholder}
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
                        )}
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
                                    fontSize: '0.8rem',
                                    '&.Mui-disabled': {
                                        borderColor: COLORS.border.subtle,
                                        opacity: 0.6,
                                    },
                                }}
                                onClick={handleSkip}
                            >
                                {showFeedback ? 'Next' : 'Skip'}
                            </Button>
                            {renderCustomActions?.(gameState, actions)}
                            {!hideHint && (
                                <Button
                                    variant="outlined"
                                    onClick={toggleHint}
                                    disabled={showFeedback}
                                    sx={{
                                        py: 1.5,
                                        flex: 1,
                                        borderColor: COLORS.border.subtle,
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.8rem',
                                        '&.Mui-disabled': {
                                            borderColor: COLORS.border.subtle,
                                            opacity: 0.6,
                                        },
                                    }}
                                >
                                    {showHint ? 'Hide Hint' : 'Show Hint'}
                                </Button>
                            )}
                            {!hideInput && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        py: 1.5,
                                        flex: 1,
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.8rem',
                                        '&.Mui-disabled': {
                                            backgroundColor:
                                                COLORS.interactive.disabled,
                                            color: COLORS.interactive
                                                .disabledText,
                                            borderColor: 'transparent',
                                        },
                                    }}
                                    disabled={!inputValue || showFeedback}
                                >
                                    Submit
                                </Button>
                            )}
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
                                {currentQuestion && renderHint(currentQuestion)}
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
                                    }}
                                >
                                    {currentQuestion &&
                                        renderFeedbackFlag?.(currentQuestion)}
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        sx={{
                                            color: feedbackColor,
                                            fontWeight: 'bold',
                                            textShadow: SHADOWS.text,
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {feedbackMessage}
                                    </Typography>
                                </Box>
                                {(() => {
                                    const feedbackContent =
                                        isCorrect === false &&
                                        currentQuestion &&
                                        renderFeedbackOrigin?.(currentQuestion);

                                    return feedbackContent ? (
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                mt: 1,
                                            }}
                                        >
                                            {feedbackContent}
                                        </Box>
                                    ) : null;
                                })()}
                            </Box>
                        </Fade>
                    )}
                </Card>
            </Box>
        </Box>
    );
};

export default QuizGameView;
