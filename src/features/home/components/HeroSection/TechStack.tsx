import React from 'react';
import { Box, Typography, Fade } from '../../../../components/mui';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { Work } from '../../../../components/icons';
import { ICON_MAP } from '../../../../components/ui/Controls';
import { SKILLS } from '../../../../config/constants';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    ANIMATIONS,
} from '../../../../config/theme';

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
                    const IconComponent = ICON_MAP[skill.icon] || Work;

                    return (
                        <Fade in timeout={1200 + index * 150} key={skill.name}>
                            <Box
                                sx={{
                                    backgroundColor:
                                        COLORS.interactive.selected,
                                    border: `1px solid ${COLORS.interactive.selected}`,
                                    borderRadius: SPACING.borderRadius.md,
                                    padding: {
                                        xs: '12px',
                                        md: '16px',
                                    },
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
