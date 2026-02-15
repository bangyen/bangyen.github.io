import { Box } from '@mui/material';
import React from 'react';

import Example from './Example';

/**
 * Wraps the Example animation inside the Info modal, capping the cell size
 * so the 3×3 demo grid fits within the modal on all screen sizes.
 */
export function InfoExample(): React.ReactElement {
    const exampleSize = 5;

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
