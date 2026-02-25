import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    COMPONENT_VARIANTS,
} from '@/config/theme';

/** Outer anchor wrapper with interactive hover effect. */
const cardLinkSx: SxProps<Theme> = {
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    ...COMPONENT_VARIANTS.interactiveCard,
    '&:hover .glass-card': {
        backgroundColor: COLORS.interactive.selected,
    },
};

/** Inner GlassCard overrides (borderless, full height). */
const cardGlassSx: SxProps<Theme> = {
    border: 'none',
    height: '100%',
};

/** Header row: category label + icon. */
const cardHeaderSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
};

/** Category label (e.g. "Engineering", "Research"). */
const cardCategoryTextSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textTransform: COMPONENT_VARIANTS.badge.textTransform,
    letterSpacing: COMPONENT_VARIANTS.badge.letterSpacing,
};

/** Category icon colour. */
const cardCategoryIconSx: SxProps<Theme> = {
    color: COLORS.primary.main,
};

/** Card title. */
const cardTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.fontSize.subheading,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: 2,
    lineHeight: 1.3,
};

/** Badge pill outer wrapper. */
const getBadgeContainerSx = (badgeColor: string): SxProps<Theme> => ({
    backgroundColor: badgeColor,
    padding: COMPONENT_VARIANTS.badge.padding,
    borderRadius: SPACING.borderRadius.full,
    border: `1px solid ${badgeColor}`,
    display: 'inline-block',
});

/** Badge pill text. */
const getBadgeTextSx = (textColor: string): SxProps<Theme> => ({
    color: textColor,
    fontSize: COMPONENT_VARIANTS.badge.fontSize,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textTransform: COMPONENT_VARIANTS.badge.textTransform,
    letterSpacing: COMPONENT_VARIANTS.badge.letterSpacing,
});

/** Card description body text. */
const cardDescriptionSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.body,
    lineHeight: 1.5,
};

export interface BaseCardProps {
    /** URL the card links to (opens in a new tab). */
    url: string;
    /** Category label shown at the top (e.g. "Engineering", "Research"). */
    category: string;
    /** Icon component rendered next to the category label. */
    CategoryIcon: React.ElementType;
    /** Card title. */
    title: string;
    /** Badge text (e.g. technology name or conference). */
    badge: string;
    /** Background colour for the badge pill. */
    badgeColor: string;
    /** Text colour for the badge pill. */
    badgeTextColor: string;
    /** Short description below the badge. */
    description: string;
}

/**
 * Shared card layout for both ProjectCard and PublicationCard.
 *
 * Consolidates the identical structural pattern (link wrapper, glass
 * card, category header, title, badge, description) that was previously
 * duplicated across both card variants, so styling changes only need to
 * happen in one place.
 */
export function BaseCard({
    url,
    category,
    CategoryIcon,
    title,
    badge,
    badgeColor,
    badgeTextColor,
    description,
}: BaseCardProps): React.ReactElement {
    return (
        <Box
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} — ${category}`}
            sx={cardLinkSx}
        >
            <GlassCard sx={cardGlassSx}>
                <Box sx={cardHeaderSx}>
                    <Typography sx={cardCategoryTextSx}>{category}</Typography>
                    <CategoryIcon sx={cardCategoryIconSx} />
                </Box>

                <Typography sx={cardTitleSx}>{title}</Typography>

                <Box sx={{ marginBottom: 2 }}>
                    <Box component="span" sx={getBadgeContainerSx(badgeColor)}>
                        <Typography
                            component="span"
                            sx={getBadgeTextSx(badgeTextColor)}
                        >
                            {badge}
                        </Typography>
                    </Box>
                </Box>

                <Typography sx={cardDescriptionSx}>{description}</Typography>
            </GlassCard>
        </Box>
    );
}
