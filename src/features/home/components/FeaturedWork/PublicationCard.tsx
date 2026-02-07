import React from 'react';
import { Box, Typography } from '../../../../components/mui';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { OpenInNew } from '../../../../components/icons';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    COMPONENT_VARIANTS,
} from '../../../../config/theme';

export interface Publication {
    title: string;
    conference: string;
    url: string;
    description: string;
}

interface PublicationCardProps {
    publication: Publication;
}

export function PublicationCard({
    publication,
}: PublicationCardProps): React.ReactElement {
    return (
        <Box
            component="a"
            href={publication.url}
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
                        Research
                    </Typography>
                    <OpenInNew
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
                    {publication.title}
                </Typography>

                <Box sx={{ marginBottom: 2 }}>
                    <Box
                        component="span"
                        sx={{
                            backgroundColor: COLORS.surface.success,
                            padding: COMPONENT_VARIANTS.badge.padding,
                            borderRadius: SPACING.borderRadius.full,
                            border: `1px solid ${COLORS.surface.success}`,
                            display: 'inline-block',
                        }}
                    >
                        <Typography
                            component="span"
                            sx={{
                                color: COLORS.data.green,
                                fontSize: COMPONENT_VARIANTS.badge.fontSize,
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                                textTransform:
                                    COMPONENT_VARIANTS.badge.textTransform,
                                letterSpacing:
                                    COMPONENT_VARIANTS.badge.letterSpacing,
                            }}
                        >
                            {publication.conference}
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
                    {publication.description}
                </Typography>
            </GlassCard>
        </Box>
    );
}
