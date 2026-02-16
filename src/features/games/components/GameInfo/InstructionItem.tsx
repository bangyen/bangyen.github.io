import { Box, Typography } from '@mui/material';
import React from 'react';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

/** Data for a single instruction row shown on the first step. */
export interface InstructionItemData {
    Icon: React.ElementType;
    title: string;
    text: string;
}

/**
 * Renders a single instruction row: an icon, bold title, and description.
 * Used internally to build the instructions step from declarative data.
 */
export function InstructionItem({ Icon, title, text }: InstructionItemData) {
    return (
        <Box sx={{ px: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    color: COLORS.text.primary,
                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    fontSize: TYPOGRAPHY.fontSize.subheading,
                }}
            >
                <Icon
                    sx={{
                        mr: 2,
                        color: COLORS.primary.main,
                        fontSize: '1.75rem',
                    }}
                />
                {title}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: COLORS.text.secondary,
                    lineHeight: 1.6,
                    fontSize: TYPOGRAPHY.fontSize.body,
                    ml: 6,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}
