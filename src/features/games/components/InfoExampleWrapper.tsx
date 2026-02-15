import { Box } from '@mui/material';
import React from 'react';

interface InfoExampleWrapperProps {
    children: React.ReactNode;
}

/**
 * Shared layout wrapper for the "Example" step inside every game's Info modal.
 * Provides the fade-in animation and flex centering so each game only needs
 * to supply its game-specific Example component as children.
 */
export function InfoExampleWrapper({ children }: InfoExampleWrapperProps) {
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
                {children}
            </Box>
        </Box>
    );
}
