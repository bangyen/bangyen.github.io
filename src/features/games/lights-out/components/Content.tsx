import React from 'react';

import { Box, Typography } from '@/components/mui';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

export const StepTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography
        variant="h5"
        sx={{
            color: COLORS.text.primary,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            textAlign: 'left',
            fontSize: TYPOGRAPHY.fontSize.h2,
        }}
    >
        {children}
    </Typography>
);

export const InstructionItem = ({
    Icon,
    title,
    text,
}: {
    Icon: React.ElementType;
    title: string;
    text: string;
}) => (
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
                sx={{ mr: 2, color: COLORS.primary.main, fontSize: '1.75rem' }}
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

export const INFO_TITLES = ['Chasing Lights', 'How It Works', 'Calculator'];
