import { ArrowBackRounded as ArrowBackIcon } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import { QuizProgress } from './QuizProgress';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

interface QuizHeaderProps {
    modeLabel: string;
    currentQuestionNumber: number;
    totalQuestions: number;
    score: number;
    progressValue: number;
    hasInitialized: boolean;
    onBackToMenu: () => void;
}

export function QuizHeader({
    modeLabel,
    currentQuestionNumber,
    totalQuestions,
    score,
    progressValue,
    hasInitialized,
    onBackToMenu,
}: QuizHeaderProps) {
    return (
        <Box
            sx={{
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
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
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
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
                <Typography
                    variant="h6"
                    sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium }}
                >
                    Question {currentQuestionNumber} of {totalQuestions}
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
            <QuizProgress
                value={progressValue}
                hasInitialized={hasInitialized}
            />
        </Box>
    );
}
