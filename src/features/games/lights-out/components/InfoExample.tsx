import { Box } from '@mui/material';
import React from 'react';

import Example from './Example';
import type { Palette, PropsFactory } from '../../components/Board';

import { useMobile } from '@/hooks';

interface InfoExampleProps {
    size: number;
    palette: Palette;
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

/**
 * Wraps the Example animation inside the Info modal, capping the cell size
 * so the 3×3 demo grid fits within the modal on all screen sizes.
 */
export function InfoExample({
    size,
    palette,
    getFrontProps,
    getBackProps,
}: InfoExampleProps) {
    const isMobile = useMobile('sm');

    // On mobile the modal is roughly viewport-width minus margins/padding,
    // split in half for the side-by-side layout.  Cap cell size so the 3×3
    // grid never overflows.  On larger screens the game's size * 0.7 is fine.
    const MAX_CELL_MOBILE = 2.8; // rem
    const MAX_CELL_DESKTOP = 5; // rem
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
                <Example
                    dims={3}
                    size={exampleSize}
                    start={[1, 3, 8]}
                    palette={palette}
                    getFrontProps={getFrontProps}
                    getBackProps={getBackProps}
                />
            </Box>
        </Box>
    );
}
