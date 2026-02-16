/**
 * Extracted style constants for the shared `BaseCard` component.
 * Keeps card styling DRY across ProjectCard and PublicationCard.
 */

import type { SxProps, Theme } from '@mui/material';

import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    COMPONENT_VARIANTS,
} from '@/config/theme';

/** Outer anchor wrapper with interactive hover effect. */
export const cardLinkSx: SxProps<Theme> = {
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    ...COMPONENT_VARIANTS.interactiveCard,
    '&:hover .glass-card': {
        backgroundColor: COLORS.interactive.selected,
    },
};

/** Inner GlassCard overrides (borderless, full height). */
export const cardGlassSx: SxProps<Theme> = {
    border: 'none',
    height: '100%',
};

/** Header row: category label + icon. */
export const cardHeaderSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
};

/** Category label (e.g. "Engineering", "Research"). */
export const cardCategoryTextSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontSize: TYPOGRAPHY.fontSize.caption,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textTransform: COMPONENT_VARIANTS.badge.textTransform,
    letterSpacing: COMPONENT_VARIANTS.badge.letterSpacing,
};

/** Category icon colour. */
export const cardCategoryIconSx: SxProps<Theme> = {
    color: COLORS.primary.main,
};

/** Card title. */
export const cardTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.fontSize.subheading,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: 2,
    lineHeight: 1.3,
};

/** Badge pill outer wrapper. */
export const getBadgeContainerSx = (badgeColor: string): SxProps<Theme> => ({
    backgroundColor: badgeColor,
    padding: COMPONENT_VARIANTS.badge.padding,
    borderRadius: SPACING.borderRadius.full,
    border: `1px solid ${badgeColor}`,
    display: 'inline-block',
});

/** Badge pill text. */
export const getBadgeTextSx = (textColor: string): SxProps<Theme> => ({
    color: textColor,
    fontSize: COMPONENT_VARIANTS.badge.fontSize,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textTransform: COMPONENT_VARIANTS.badge.textTransform,
    letterSpacing: COMPONENT_VARIANTS.badge.letterSpacing,
});

/** Card description body text. */
export const cardDescriptionSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.body,
    lineHeight: 1.5,
};
