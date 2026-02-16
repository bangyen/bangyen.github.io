import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import { HOME_TEXT } from '../../constants';

import { GitHub, ArrowForward } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { URLS, PERSONAL_INFO } from '@/config/constants';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

export function ConnectSection(): React.ReactElement {
    return (
        <GlassCard>
            <Typography
                sx={{
                    color: COLORS.primary.main,
                    fontSize: TYPOGRAPHY.fontSize.subheading,
                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    marginBottom: 3,
                }}
            >
                {HOME_TEXT.connect.heading}
            </Typography>

            <Typography
                sx={{
                    color: COLORS.text.secondary,
                    fontSize: TYPOGRAPHY.fontSize.body,
                    lineHeight: 1.5,
                    marginBottom: 4,
                }}
            >
                {HOME_TEXT.connect.description}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Button
                    component="a"
                    href={URLS.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<GitHub />}
                    sx={{
                        textDecoration: 'none',
                    }}
                >
                    {HOME_TEXT.connect.githubButton}
                </Button>

                <Button
                    component="a"
                    href={`mailto:${PERSONAL_INFO.email}?subject=Project%20Collaboration`}
                    variant="text"
                    endIcon={<ArrowForward />}
                    sx={{
                        textDecoration: 'none',
                        color: COLORS.text.secondary,
                        '&:hover': {
                            color: COLORS.text.primary,
                            backgroundColor: COLORS.interactive.hover,
                        },
                    }}
                >
                    {HOME_TEXT.connect.projectsButton}
                </Button>
            </Box>
        </GlassCard>
    );
}
