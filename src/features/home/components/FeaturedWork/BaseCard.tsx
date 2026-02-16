import { Box, Typography } from '@mui/material';
import React from 'react';

import {
    cardLinkSx,
    cardGlassSx,
    cardHeaderSx,
    cardCategoryTextSx,
    cardCategoryIconSx,
    cardTitleSx,
    getBadgeContainerSx,
    getBadgeTextSx,
    cardDescriptionSx,
} from './BaseCard.styles';

import { GlassCard } from '@/components/ui/GlassCard';

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
