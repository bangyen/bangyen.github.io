import React from 'react';

import Example from './Example';
import type { Palette, PropsFactory } from '../../components/Board';

import { Box } from '@/components/mui';

interface InfoExampleProps {
    size: number;
    palette: Palette;
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

export function InfoExample({
    size,
    palette,
    getFrontProps,
    getBackProps,
}: InfoExampleProps) {
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
                    size={size * 0.7}
                    start={[1, 3, 8]}
                    palette={palette}
                    getFrontProps={getFrontProps}
                    getBackProps={getBackProps}
                />
            </Box>
        </Box>
    );
}
