import { Box, Typography, Fade } from '@mui/material';
import React from 'react';

import { Work, Code, Psychology, Cloud } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { SKILLS } from '@/config/constants';
import { COLORS, TYPOGRAPHY, SPACING, ANIMATIONS } from '@/config/theme';

const ICON_MAP: Record<string, React.ElementType> = {
    Code,
    Psychology,
    Cloud,
    Work,
};

export function TechStack(): React.ReactElement {
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
                Tech Stack
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: {
                        xs: 1.5,
                        md: 2,
                    },
                    marginBottom: 3,
                }}
            >
                {SKILLS.map((skill, index) => {
                    const IconComponent = ICON_MAP[skill.icon] ?? Work;

                    return (
                        <Fade
                            in
                            timeout={
                                ANIMATIONS.durations.long +
                                index * ANIMATIONS.durations.stagger
                            }
                            key={skill.name}
                        >
                            <Box
                                sx={{
                                    backgroundColor:
                                        COLORS.interactive.selected,
                                    border: `1px solid ${COLORS.interactive.selected}`,
                                    borderRadius: SPACING.borderRadius.md,
                                    padding: SPACING.padding.sm,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: {
                                        xs: 1,
                                        md: 1.5,
                                    },
                                    transition: ANIMATIONS.transition,
                                    cursor: 'pointer',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    '&:hover': {
                                        backgroundColor:
                                            COLORS.interactive.hover,
                                        transform:
                                            'translateY(-2px) scale(1.01)',
                                    },
                                }}
                            >
                                <IconComponent
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontSize: TYPOGRAPHY.fontSize.body,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontSize: TYPOGRAPHY.fontSize.body,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.medium,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        flexShrink: 1,
                                    }}
                                >
                                    {skill.name}
                                </Typography>
                            </Box>
                        </Fade>
                    );
                })}
            </Box>
        </GlassCard>
    );
}
