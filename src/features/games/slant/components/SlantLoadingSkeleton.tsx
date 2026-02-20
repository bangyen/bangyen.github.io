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
                cellProps={skeletonBack}
                overlayProps={skeletonFront}
            />
        </Box>
    );
}
