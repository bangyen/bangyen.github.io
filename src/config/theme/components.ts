/**
 * Reusable component style variants
 */

import { COLORS } from './colors';
import { SPACING } from './spacing';
import { ANIMATIONS } from './animations';

export interface ComponentVariants {
    card: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
        borderRadius: string;
        height: string;
        display: string;
        flexDirection: string;
        transition: string;
    };
    badge: {
        fontSize: string;
        padding: string;
        textTransform: string;
        letterSpacing: string;
    };
    badgeSmall: {
        fontSize: string;
        padding: string;
        textTransform: string;
        letterSpacing: string;
    };
    badgeContainer: {
        borderRadius: string;
        display: string;
        padding: string;
    };
    interactiveCard: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
        borderRadius: string;
        height: string;
        display: string;
        flexDirection: string;
        transition: string;
        cursor: string;
        '&:hover': {
            backgroundColor: string;
            transform: string;
        };
        '&:focus': {
            outline: string;
            boxShadow: string;
        };
    };
    flexCenter: {
        display: string;
        alignItems: string;
        justifyContent: string;
    };
}

export const BASE_CARD = {
    backgroundColor: COLORS.surface.glass,
    backdropFilter: 'blur(24px) saturate(180%)',
    border: `1px solid ${COLORS.border.subtle}`,
    borderRadius: SPACING.borderRadius.lg,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: ANIMATIONS.transition,
};

export const COMPONENT_VARIANTS: ComponentVariants = {
    card: BASE_CARD,
    interactiveCard: {
        ...BASE_CARD,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: COLORS.interactive.selected,
            transform: 'translateY(-2px)',
        },
        '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
    },
    badge: {
        fontSize: '0.7rem',
        padding: '4px 12px',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
    },
    badgeSmall: {
        fontSize: '0.65rem',
        padding: '2px 8px',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
    },
    badgeContainer: {
        borderRadius: SPACING.borderRadius.full,
        display: 'inline-block',
        padding: '4px 12px',
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};
