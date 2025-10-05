/**
 * Component configuration constants
 * Centralizes component-specific styling and behavior constants
 */

import { ALPHA, COLORS, SPACING, ANIMATIONS, TYPOGRAPHY } from './theme';

// Component-specific constants
export const COMPONENTS = {
    // Glass morphism menu with modern aesthetics
    menu: {
        backdropFilter: 'blur(24px) saturate(180%)',
        backgroundColor: `hsla(0, 0%, 3%, ${ALPHA.glass})`,
        border: `1px solid hsla(0, 0%, 100%, ${ALPHA.subtle})`,
        borderRadius: SPACING.borderRadius.lg,
        boxShadow: COLORS.shadows.lg,
        padding: {
            vertical: '12px',
            horizontal: '16px',
        },
    },
    // Modern skill chips with sophisticated interactions
    chip: {
        height: {
            sm: '28px',
            md: '32px',
            lg: '40px',
        },
        padding: {
            sm: '6px 12px',
            md: '8px 16px',
            lg: '10px 20px',
        },
        borderRadius: SPACING.borderRadius.full,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        transition: ANIMATIONS.transitions.fast,
        backgroundColor: COLORS.interactive.selected,
        color: COLORS.text.accent,
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: COLORS.interactive.pressed,
            transform: 'scale(1.05)',
        },
    },
    // Enhanced card system with multiple variants
    card: {
        elevated: {
            backgroundColor: COLORS.surface.elevated,
            border: `1px solid ${COLORS.border.subtle}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.card.padding,
            transition: ANIMATIONS.transitions.normal,
            boxShadow: COLORS.shadows.sm,
        },
        glassmorphism: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid hsla(0, 0%, 100%, ${ALPHA.subtle})`,
            borderRadius: SPACING.borderRadius.lg,
            padding: SPACING.components.card.padding,
            transition: ANIMATIONS.transitions.gentle,
            boxShadow: COLORS.shadows.md,
        },
        interactive: {
            backgroundColor: COLORS.surface.elevated,
            border: `1px solid ${COLORS.border.subtle}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.card.padding,
            transition: ANIMATIONS.transitions.normal,
            boxShadow: COLORS.shadows.sm,
            cursor: 'pointer',
            '&:hover': ANIMATIONS.hover.lift,
            '&:focus': ANIMATIONS.focus.ring,
        },
    },
    // Professional badge system
    badge: {
        primary: {
            backgroundColor: COLORS.interactive.selected,
            color: COLORS.text.accent,
            border: `1px solid hsla(217, 91%, 60%, ${ALPHA.subtle * 2})`,
            borderRadius: SPACING.borderRadius.xl,
            fontSize: TYPOGRAPHY.fontSize.xs.caption,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            padding: '4px 12px',
            minHeight: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            transition: ANIMATIONS.transitions.fast,
        },
        // Simple border for grid editor cells
        border: `1px solid ${COLORS.border.interactive}`,
        secondary: {
            backgroundColor: COLORS.interactive.hover,
            color: COLORS.text.secondary,
            border: `1px solid ${COLORS.border.primary}`,
            borderRadius: SPACING.borderRadius.xl,
            fontSize: TYPOGRAPHY.fontSize.xs.caption,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            padding: '4px 12px',
            minHeight: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            transition: ANIMATIONS.transitions.fast,
        },
    },
    // Modern button system with multiple variants
    button: {
        primary: {
            backgroundColor: COLORS.primary.main,
            color: COLORS.text.primary,
            border: 'none',
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.button.padding,
            minHeight: SPACING.components.button.minHeight,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            transition: ANIMATIONS.transitions.normal,
            boxShadow: COLORS.shadows.xs,
            '&:hover': {
                backgroundColor: COLORS.primary.dark,
                boxShadow: COLORS.shadows.sm,
                transform: 'translateY(-1px)',
            },
            '&:focus': ANIMATIONS.focus.ring,
        },
        secondary: {
            backgroundColor: 'transparent',
            color: COLORS.text.secondary,
            border: `1px solid ${COLORS.border.primary}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.button.padding,
            minHeight: SPACING.components.button.minHeight,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            transition: ANIMATIONS.transitions.normal,
            '&:hover': {
                backgroundColor: COLORS.interactive.hover,
                borderColor: COLORS.primary.main,
                transform: 'translateY(-1px)',
            },
            '&:focus': ANIMATIONS.focus.ring,
        },
        ghost: {
            backgroundColor: 'transparent',
            color: COLORS.text.secondary,
            border: 'none',
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.button.padding,
            minHeight: SPACING.components.button.minHeight,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            transition: ANIMATIONS.transitions.fast,
            '&:hover': {
                backgroundColor: COLORS.interactive.hover,
                color: COLORS.text.primary,
            },
            '&:focus': ANIMATIONS.focus.ring,
        },
    },
    // Enhanced navigation with modern aesthetics
    navigation: {
        backgroundColor: 'hsla(0, 0%, 3%, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${COLORS.border.subtle}`,
        borderRadius: SPACING.borderRadius.lg,
        boxShadow: COLORS.shadows.md,
        padding: '16px 24px',
    },
    // Professional input system
    input: {
        primary: {
            backgroundColor: COLORS.surface.elevated,
            border: `1px solid ${COLORS.border.subtle}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.input.padding,
            minHeight: SPACING.components.input.height,
            color: COLORS.text.primary,
            fontSize: TYPOGRAPHY.fontSize.md.body,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            transition: ANIMATIONS.transitions.fast,
            '&:focus': {
                outline: 'none',
                borderColor: COLORS.border.interactive,
                boxShadow: `0 0 0 3px hsla(217, 91%, 60%, ${ALPHA.subtle})`,
            },
            '&:hover': {
                borderColor: COLORS.border.primary,
            },
        },
    },
    // Sophisticated borders and dividers
    borders: {
        subtle: `1px solid ${COLORS.border.subtle}`,
        primary: `1px solid ${COLORS.border.primary}`,
        interactive: `2px solid ${COLORS.border.interactive}`,
        divider: `1px solid ${COLORS.border.subtle}`,
        light: `1px solid ${COLORS.border.subtle}`,
        white: `1px solid ${COLORS.border.primary}`,
    },
    // Interactive states
    interactive: {
        hover: {
            standard: COLORS.interactive.hover,
            subtle: COLORS.interactive.hover,
            strong: COLORS.interactive.pressed,
        },
        focus: {
            ring: `0 0 0 3px hsla(217, 91%, 60%, ${ALPHA.focus})`,
            outline: 'none',
        },
        selected: COLORS.interactive.selected,
        disabled: COLORS.interactive.disabled,
    },
    // Legacy component support for Oligopoly
    cardLight: {
        backgroundColor: COLORS.surface.subtle,
    },
    overlays: {
        dark: 'hsla(0, 0%, 5%, 0.95)',
        lighter: `hsla(0, 0%, 12%, ${ALPHA.overlay})`,
        light: 'hsla(0, 0%, 15%, 0.9)',
        medium: 'hsla(0, 0%, 18%, 0.9)',
        hover: 'hsla(0, 0%, 20%, 0.95)',
        hoverLight: 'hsla(0, 0%, 16%, 0.9)',
    },
    // Migrated to semantic border colors
    borderColors: {
        light: COLORS.border.subtle,
        medium: COLORS.border.primary,
    },
    // Legacy button support for ZSharp
    legacyButton: {
        outlined: {
            color: COLORS.text.secondary,
            borderColor: COLORS.border.primary,
            '&:hover': {
                borderColor: COLORS.border.interactive,
                backgroundColor: COLORS.interactive.hover,
            },
        },
    },
};
