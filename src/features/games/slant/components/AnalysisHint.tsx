import { Box } from '@mui/material';
import React from 'react';

import { SLANT_STYLES } from '../config/constants';

import { COLORS } from '@/config/theme';

export interface AnalysisHintProps {
    value: number | null;
    hasConflict: boolean;
    isSatisfied: boolean;
    numberSize: number;
}

export const AnalysisHint = React.memo(function AnalysisHint({
    value,
    hasConflict,
    isSatisfied,
    numberSize,
}: AnalysisHintProps) {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${String(numberSize * 0.5)}rem`,
                fontWeight: '800',
                color: hasConflict
                    ? SLANT_STYLES.COLORS.WHITE
                    : isSatisfied
                      ? COLORS.interactive.disabledText
                      : SLANT_STYLES.ANALYSIS.HINT_TEXT,
                boxShadow:
                    isSatisfied && !hasConflict
                        ? 'none'
                        : SLANT_STYLES.SHADOWS.HINT,
                opacity: isSatisfied ? 0.6 : 1,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                paddingTop: '0.05rem',
                lineHeight: 1,

                transform: hasConflict
                    ? 'scale(1.15)'
                    : isSatisfied
                      ? 'scale(0.95)'
                      : 'scale(1)',
            }}
        >
            {value ?? ''}
        </Box>
    );
});
