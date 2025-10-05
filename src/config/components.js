/**
 * Component configuration constants
 * Centralizes component-specific styling and behavior constants
 * Note: Theme values are inlined to avoid circular dependencies
 */

// ============================================================================
// COMPONENT STYLING CONSTANTS
// ============================================================================

// Component-specific constants
export const COMPONENTS = {
    // Glass morphism menu with modern aesthetics
    menu: {
        backdropFilter: 'blur(24px) saturate(180%)',
        backgroundColor: 'hsla(0, 0%, 3%, 0.85)',
        border: '1px solid hsla(0, 0%, 100%, 0.1)',
        borderRadius: '16px',
        boxShadow: '0 16px 64px hsla(0, 0%, 0%, 0.3)',
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
        borderRadius: '9999px',
        fontWeight: 500,
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'hsla(217, 91%, 60%, 0.1)',
        color: 'hsl(217, 91%, 60%)',
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'hsla(0, 0%, 80%, 0.12)',
            transform: 'scale(1.05)',
        },
    },
    // Enhanced card system with multiple variants
    card: {
        elevated: {
            backgroundColor: 'hsl(0, 0%, 8%)',
            border: '1px solid hsl(0, 0%, 18%)',
            borderRadius: '12px',
            padding: '24px',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px hsla(0, 0%, 0%, 0.4)',
        },
        glassmorphism: {
            backgroundColor: 'hsla(0, 0%, 8%, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid hsla(0, 0%, 100%, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.35)',
        },
        interactive: {
            backgroundColor: 'hsl(0, 0%, 8%)',
            border: '1px solid hsl(0, 0%, 18%)',
            borderRadius: '12px',
            padding: '24px',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px hsla(0, 0%, 0%, 0.4)',
            cursor: 'pointer',
            '&:hover': {
                transform: 'translateY(-2px) scale(1.01)',
                transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.4)',
            },
            '&:focus': {
                outline: 'none',
                boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
                transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    // Professional badge system
    badge: {
        primary: {
            backgroundColor: 'hsla(217, 91%, 60%, 0.1)',
            color: 'hsl(217, 91%, 60%)',
            border: '1px solid hsla(217, 91%, 60%, 0.2)',
            borderRadius: '20px',
            fontSize: 'clamp(0.7rem, 0.8vw, 0.75rem)',
            fontWeight: 500,
            padding: '4px 12px',
            minHeight: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        // Simple border for grid editor cells
        border: '1px solid hsl(217, 91%, 60%)',
        secondary: {
            backgroundColor: 'hsla(0, 0%, 80%, 0.08)',
            color: 'hsl(0, 0%, 80%)',
            border: '1px solid hsl(0, 0%, 30%)',
            borderRadius: '20px',
            fontSize: 'clamp(0.7rem, 0.8vw, 0.75rem)',
            fontWeight: 500,
            padding: '4px 12px',
            minHeight: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },
    // Modern button system with multiple variants
    button: {
        primary: {
            backgroundColor: 'hsl(217, 91%, 60%)',
            color: 'hsl(0, 0%, 98%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            minHeight: '44px',
            fontWeight: 600,
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 2px hsla(0, 0%, 0%, 0.5)',
            '&:hover': {
                backgroundColor: 'hsl(217, 91%, 45%)',
                boxShadow: '0 2px 8px hsla(0, 0%, 0%, 0.4)',
                transform: 'translateY(-1px)',
            },
            '&:focus': {
                outline: 'none',
                boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
                transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
        secondary: {
            backgroundColor: 'transparent',
            color: 'hsl(0, 0%, 80%)',
            border: '1px solid hsl(0, 0%, 30%)',
            borderRadius: '12px',
            padding: '12px 24px',
            minHeight: '44px',
            fontWeight: 500,
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                backgroundColor: 'hsla(0, 0%, 80%, 0.08)',
                borderColor: 'hsl(217, 91%, 60%)',
                transform: 'translateY(-1px)',
            },
            '&:focus': {
                outline: 'none',
                boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
                transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'hsl(0, 0%, 80%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            minHeight: '44px',
            fontWeight: 500,
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                backgroundColor: 'hsla(0, 0%, 80%, 0.08)',
                color: 'hsl(0, 0%, 98%)',
            },
            '&:focus': {
                outline: 'none',
                boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
                transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    // Enhanced navigation with modern aesthetics
    navigation: {
        backgroundColor: 'hsla(0, 0%, 3%, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid hsl(0, 0%, 18%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.35)',
        padding: '16px 24px',
    },
    // Professional input system
    input: {
        primary: {
            backgroundColor: 'hsl(0, 0%, 8%)',
            border: '1px solid hsl(0, 0%, 18%)',
            borderRadius: '12px',
            padding: '12px 16px',
            minHeight: '48px',
            color: 'hsl(0, 0%, 98%)',
            fontSize: 'clamp(1rem, 1vw, 1.125rem)',
            fontWeight: 400,
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:focus': {
                outline: 'none',
                borderColor: 'hsl(217, 91%, 60%)',
                boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.1)',
            },
            '&:hover': {
                borderColor: 'hsl(0, 0%, 30%)',
            },
        },
    },
    // Sophisticated borders and dividers
    borders: {
        subtle: '1px solid hsl(0, 0%, 18%)',
        primary: '1px solid hsl(0, 0%, 30%)',
        interactive: '2px solid hsl(217, 91%, 60%)',
        divider: '1px solid hsl(0, 0%, 18%)',
        light: '1px solid hsl(0, 0%, 18%)',
        white: '1px solid hsl(0, 0%, 30%)',
    },
    // Interactive states
    interactive: {
        hover: {
            standard: 'hsla(0, 0%, 80%, 0.08)',
            subtle: 'hsla(0, 0%, 80%, 0.08)',
            strong: 'hsla(0, 0%, 80%, 0.12)',
        },
        focus: {
            ring: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
            outline: 'none',
        },
        selected: 'hsla(217, 91%, 60%, 0.1)',
        disabled: 'hsla(0, 0%, 45%, 0.3)',
    },
    overlays: {
        dark: 'hsla(0, 0%, 5%, 0.95)',
        lighter: 'hsla(0, 0%, 12%, 0.8)',
        light: 'hsla(0, 0%, 15%, 0.9)',
        medium: 'hsla(0, 0%, 18%, 0.9)',
        hover: 'hsla(0, 0%, 20%, 0.95)',
        hoverLight: 'hsla(0, 0%, 16%, 0.9)',
    },
};
