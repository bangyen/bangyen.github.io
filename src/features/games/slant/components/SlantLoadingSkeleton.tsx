import { Box } from '@mui/material';
import React, { useCallback } from 'react';

import { SlantBoard } from './SlantBoard';

export interface SlantLoadingSkeletonProps {
    /** Cell size in rem units for the board. */
    size: number;
    /** Number of grid rows (excluding the +1 offset for Slant). */
    rows: number;
    /** Number of grid columns (excluding the +1 offset for Slant). */
    cols: number;
}

/**
 * Pulsing skeleton board shown while a Slant puzzle is being generated
 * by the web worker, preventing a flash of mismatched state.
 */
export function SlantLoadingSkeleton({
    size,
    rows,
    cols,
}: SlantLoadingSkeletonProps): React.ReactElement {
    const skeletonBack = useCallback(
        () => ({
            sx: {
                backgroundColor: 'var(--border)',
            },
        }),
        [],
    );

    const skeletonFront = useCallback(() => ({}), []);

    return (
        <Box
            sx={{
                '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.4 },
                    '50%': { opacity: 0.15 },
                },
                animation: 'pulse 1.4s ease-in-out infinite',
            }}
        >
            <SlantBoard
                size={size}
                rows={rows}
                cols={cols}
                state={{
                    grid: new Array(rows)
                        .fill(null)
                        .map(() => new Array(cols).fill(0) as (0 | 1 | 2)[]),
                    numbers: new Array(rows + 1)
                        .fill(null)
                        .map(
                            () =>
                                new Array(cols + 1).fill(null) as (
                                    | number
                                    | null
                                )[],
                        ),
                    satisfiedNodes: new Set<string>(),
                    errorNodes: new Set<string>(),
                    cycleCells: new Set<string>(),
                }}
                cellProps={skeletonBack}
                overlayProps={skeletonFront}
            />
        </Box>
    );
}
