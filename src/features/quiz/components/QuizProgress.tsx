import React from 'react';
import { LinearProgress } from '@mui/material';
import { COLORS, SPACING } from '../../../config/theme';
import { QUIZ_UI_CONSTANTS } from '../config/quizConfig';

/**
 * Props for QuizProgress component.
 */
interface QuizProgressProps {
    /** Progress value from 0 to 100 */
    value: number;
    /** Whether quiz has been initialized (hides bar until first question) */
    hasInitialized: boolean;
}

/**
 * Displays a styled progress bar for quiz completion.
 *
 * Features:
 * - Gradient fill from primary to light color
 * - Rounded corners
 * - Hidden until quiz initializes
 * - Accessible with aria-label
 *
 * @param props - Component props
 * @returns Progress bar component or null if not initialized
 *
 * @example
 * ```tsx
 * <QuizProgress value={75} hasInitialized={true} />
 * ```
 */
export function QuizProgress({ value, hasInitialized }: QuizProgressProps) {
    if (!hasInitialized) {
        return null;
    }

    return (
        <LinearProgress
            aria-label="Quiz progress"
            variant="determinate"
            value={value}
            sx={{
                height: QUIZ_UI_CONSTANTS.PROGRESS_BAR.HEIGHT,
                borderRadius: SPACING.borderRadius.full,
                backgroundColor: COLORS.interactive.hover,
                '& .MuiLinearProgress-bar': {
                    borderRadius: SPACING.borderRadius.full,
                    background: `linear-gradient(90deg, ${COLORS.primary.main}, ${COLORS.primary.light})`,
                },
            }}
        />
    );
}
