import { Box } from '@mui/material';
import React from 'react';

import { SLANT_STYLES } from '../config/constants';

export interface AnalysisHintProps {
    value: number | null;
    hasConflict: boolean;
    numberSize: number;
}

export const AnalysisHint = React.memo(function AnalysisHint({
    value,
    hasConflict,
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
                    : SLANT_STYLES.ANALYSIS.HINT_TEXT,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                transform: hasConflict ? 'scale(1.15)' : 'scale(1)',
            }}
        >
            {value ?? ''}
        </Box>
    );
});
