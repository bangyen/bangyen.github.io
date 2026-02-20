import { Box } from '@mui/material';
import React from 'react';

import { AnalysisCell } from './AnalysisCell';
import type { DragProps } from '../../hooks/useDrag';
import { SLANT_STYLES } from '../config/constants';
import type { CellState } from '../types';

import { COLORS } from '@/config/theme';

interface AnalysisGridCellProps {
    r: number;
    c: number;
    value: CellState;
    source?: 'user' | 'propagated';
    isConflict: boolean;
    isCycle: boolean;
    size: number;
    pos: string;
    getDragProps: (pos: string) => DragProps;
}

export const AnalysisGridCell = React.memo(function AnalysisGridCell({
    r: _r,
    c: _c,
    value,
    source,
    isConflict,
    isCycle,
    size,
    pos,
    getDragProps,
}: AnalysisGridCellProps) {
    const dragProps = getDragProps(pos);

    let color = COLORS.text.primary;

    if (isConflict) {
        color = COLORS.data.red;
    } else if (isCycle) {
        color = source === 'user' ? COLORS.data.red : COLORS.data.orange;
    } else if (source === 'user') {
        color = COLORS.primary.main;
    } else if (source === 'propagated') {
        color = COLORS.data.green;
    }

    return (
        <Box
            data-pos={pos}
            data-type="cell"
            {...dragProps}
            sx={{
                ...dragProps.sx,
                cursor: 'pointer',
                outline: 'none',
                border: `2px solid ${COLORS.border.subtle}`,
                position: 'relative',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                borderRadius: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: SLANT_STYLES.ANALYSIS.BG_SUBTLE,
                transition:
                    'background-color 0.2s, outline 0.2s, box-shadow 0.2s',
                '&:hover': {
                    backgroundColor: SLANT_STYLES.ANALYSIS.BG_HOVER,
                },
                '&:focus-visible': {
                    outline: `3px solid ${COLORS.primary.main}`,
                    outlineOffset: '-3px',
                    backgroundColor: SLANT_STYLES.ANALYSIS.BG_HOVER,
                    boxShadow: `inset 0 0 15px ${COLORS.interactive.focus}`,
                },
            }}
        >
            <AnalysisCell value={value} color={color} size={size} />
        </Box>
    );
});
