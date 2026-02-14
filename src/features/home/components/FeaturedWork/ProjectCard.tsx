import { Box, Typography } from '@mui/material';
import React from 'react';

import { GitHub } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    COMPONENT_VARIANTS,
} from '@/config/theme';

export interface Project {
    title: string;
    technology: string;
    url: string;
    description: string;
}

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
    return (
        <Box
            component="a"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                ...COMPONENT_VARIANTS.interactiveCard,
                '&:hover .glass-card': {
                    backgroundColor: COLORS.interactive.selected,
                },
            }}
        >
            <GlassCard
                sx={{
                    border: 'none',
                    height: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: COLORS.primary.main,
                            fontSize: TYPOGRAPHY.fontSize.caption,
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            textTransform:
                                COMPONENT_VARIANTS.badge.textTransform,
                            letterSpacing:
                                COMPONENT_VARIANTS.badge.letterSpacing,
                        }}
                    >
                        Engineering
                    </Typography>
                    <GitHub
                        sx={{
                            color: COLORS.primary.main,
                        }}
                    />
                </Box>

                <Typography
                    sx={{
                        color: COLORS.text.primary,
                        fontSize: TYPOGRAPHY.fontSize.subheading,
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        marginBottom: 2,
                        lineHeight: 1.3,
                    }}
                >
                    {project.title}
                </Typography>

                <Box sx={{ marginBottom: 2 }}>
                    <Box
                        component="span"
                        sx={{
                            backgroundColor: COLORS.interactive.selected,
                            padding: COMPONENT_VARIANTS.badge.padding,
                            borderRadius: SPACING.borderRadius.full,
                            border: `1px solid ${COLORS.interactive.selected}`,
                            display: 'inline-block',
                        }}
                    >
                        <Typography
                            component="span"
                            sx={{
                                color: COLORS.primary.main,
                                fontSize: COMPONENT_VARIANTS.badge.fontSize,
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                                textTransform:
                                    COMPONENT_VARIANTS.badge.textTransform,
                                letterSpacing:
                                    COMPONENT_VARIANTS.badge.letterSpacing,
                            }}
                        >
                            {project.technology}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        color: COLORS.text.secondary,
                        fontSize: TYPOGRAPHY.fontSize.body,
                        lineHeight: 1.5,
                    }}
                >
                    {project.description}
                </Typography>
            </GlassCard>
        </Box>
    );
}
