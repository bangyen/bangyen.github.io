import { Box } from '@mui/material';
import React from 'react';

import Example from './Example';

import { useMobile } from '@/hooks';

interface InfoExampleProps {
    /** Cell size in rem units from the parent game. */
    size: number;
}

/**
 * Wraps the Example animation inside the Info modal, capping the cell size
 * so the 3×3 demo grid fits within the modal on all screen sizes.
 */
export function InfoExample({ size }: InfoExampleProps) {
    const isMobile = useMobile('sm');

    // Cap cell size so the 3×3 + 4×4 overlay grid never overflows.
    const MAX_CELL_MOBILE = 2.4; // rem
    const MAX_CELL_DESKTOP = 4; // rem
    const maxCell = isMobile ? MAX_CELL_MOBILE : MAX_CELL_DESKTOP;
    const exampleSize = Math.min(size * 0.7, maxCell);

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.3s ease',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Example size={exampleSize} />
            </Box>
        </Box>
    );
}
