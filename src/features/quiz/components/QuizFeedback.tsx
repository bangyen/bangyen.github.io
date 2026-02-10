import { Box, Typography, Fade } from '@mui/material';
import React from 'react';

import { COLORS, SHADOWS, TYPOGRAPHY } from '@/config/theme';

interface QuizFeedbackProps<T> {
    showFeedback: boolean;
    isCorrect: boolean | null;
    feedbackMessage: string;
    currentQuestion: T | null;
    renderFeedbackFlag?: (item: T) => React.ReactNode;
    renderFeedbackOrigin?: (item: T) => React.ReactNode;
}

export function QuizFeedback<T>({
    showFeedback,
    isCorrect,
    feedbackMessage,
    currentQuestion,
    renderFeedbackFlag,
    renderFeedbackOrigin,
}: QuizFeedbackProps<T>) {
    if (!showFeedback) {
        return null;
    }

    const feedbackColor = isCorrect ? COLORS.data.green : COLORS.data.amber;

    return (
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
                    {currentQuestion && renderFeedbackFlag?.(currentQuestion)}
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            color: feedbackColor,
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
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
    );
}
