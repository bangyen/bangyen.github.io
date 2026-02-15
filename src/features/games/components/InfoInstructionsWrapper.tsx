import { Box } from '@mui/material';
import React from 'react';

interface InfoInstructionsWrapperProps {
    children: React.ReactNode;
    /** Optional footer rendered below the centered instruction items. */
    footer?: React.ReactNode;
}

/**
 * Shared layout wrapper for the "Instructions" step inside every game's
 * Info modal.  Provides the fade-in animation, flex centering, and
 * consistent gap between instruction items so each game only needs to
 * supply its InstructionItem list (and any extra UI like a footer button)
 * as children / footer.
 */
export function InfoInstructionsWrapper({
    children,
    footer,
}: InfoInstructionsWrapperProps) {
    return (
        <Box
            sx={{
                animation: 'fadeIn 0.3s ease',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 4,
                }}
            >
                {children}
            </Box>
            {footer}
        </Box>
    );
}
