import { Box, Typography } from '@mui/material';
import React from 'react';

import { COLORS, TYPOGRAPHY, SPACING } from '@/config/theme';

export interface DevErrorDetailProps {
    /** The error object to display. */
    error: Error;
    /** Optional component stack trace (from React.ErrorInfo). */
    componentStack?: string;
    /** Maximum height of the detail box. Defaults to '200px'. */
    maxHeight?: string | number;
}

/**
 * Development-only error detail component that displays the error message
 * and optional component stack in a monospace box. Only renders when
 * `import.meta.env.DEV` is true.
 *
 * Used in `ErrorFallback`, `FeatureErrorFallback`, and `LazyGameInfo`
 * to provide consistent dev-mode debugging information.
 */
export function DevErrorDetail({
    error,
    componentStack,
    maxHeight = '200px',
}: DevErrorDetailProps): React.ReactElement | null {
    const isDev =
        typeof process === 'undefined'
            ? import.meta.env.DEV
            : process.env['NODE_ENV'] === 'development';

    if (!isDev) {
        return null;
    }

    const detailText = componentStack
        ? `${error.toString()}\n${componentStack
              .split('\n')
              .slice(0, 5)
              .join('\n')}`
        : error.toString();

    return (
        <Box
            sx={{
                backgroundColor: COLORS.surface.elevated,
                border: `1px solid ${COLORS.border.subtle}`,
                borderRadius: SPACING.borderRadius.md,
                padding: 2,
                marginBottom: 3,
                textAlign: 'left',
                overflow: 'auto',
                maxHeight,
                width: '100%',
            }}
        >
            <Typography
                sx={{
                    color: COLORS.text.secondary,
                    fontSize: TYPOGRAPHY.fontSize.caption,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                }}
            >
                {detailText}
            </Typography>
        </Box>
    );
}
