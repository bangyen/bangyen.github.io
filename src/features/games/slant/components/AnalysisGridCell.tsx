import { Box } from '@mui/material';
import React from 'react';

import { AnalysisCell } from './AnalysisCell';
import type { DragProps } from '../../hooks/useDrag';
import { SLANT_STYLES } from '../config/constants';
import { EMPTY } from '../types';
import type { CellInfo } from '../utils/analysisSolver';

import { COLORS } from '@/config/theme';
import { getPosKey } from '@/utils/gameUtils';

interface AnalysisGridCellProps extends DragProps {
    r: number;
    c: number;
    gridState: Map<string, CellInfo>;
    conflictSet: Set<string>;
    cycleCells: Set<string>;
    size: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

export function AnalysisGridCell({
    r,
    c,
    gridState,
    conflictSet,
    cycleCells,
    size,
    onKeyDown,
    ...dragProps
}: AnalysisGridCellProps) {
    const pos = getPosKey(r, c);
    const info = gridState.get(pos);
    const value = info?.state ?? EMPTY;
    const source = info?.source;
    const isConflict = conflictSet.has(pos);
    const isCycle = cycleCells.has(pos);

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
            onKeyDown={onKeyDown}
            {...dragProps}
            sx={{
                ...dragProps.sx,
                cursor: 'pointer',
                outline: 'none',
                border: `2px solid ${COLORS.border.subtle}`,
                position: 'relative',
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
}
