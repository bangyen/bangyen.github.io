import { Box, Typography } from '@mui/material';
import React from 'react';

import { COLORS } from '@/config/theme';

export interface NumberBadgeProps {
    children: React.ReactNode;
    sx?: Record<string, string>;
}

/**
 * A reusable badge for rendering small inline numbers or symbols (e.g. hint counts).
 */
export function NumberBadge({ children, sx = {} }: NumberBadgeProps) {
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.5em',
                height: '1.5em',
                borderRadius: '50%',
                backgroundColor: COLORS.surface.background,
                border: `1px solid ${COLORS.border.subtle}`,
                fontSize: '0.85em',
                fontWeight: 'bold',
                mx: 0.4,
                verticalAlign: 'middle',
                lineHeight: 1,
                pt: '0.05em',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // generic hint shadow
                position: 'relative',
                top: '-0.1em',
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

export interface GameTextRendererProps {
    text: string;
}

/**
 * Parses description text and replaces quoted numbers (e.g. "1")
 * with a styled NumberBadge.
 */
export function GameTextRenderer({ text }: GameTextRendererProps) {
    // Split by quoted numbers: "1", "4", etc.
    // Capturing group (1) keeps the number in the result array.
    const parts = text.split(/"(\d+)"/g);

    return (
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            {parts.map((part, i) => {
                // If the part is numeric and was surrounded by quotes (odd index), render badge
                if (i % 2 === 1) {
                    return (
                        <NumberBadge key={`${String(i)}-${part}`}>
                            {part}
                        </NumberBadge>
                    );
                }
                return part;
            })}
        </Typography>
    );
}
