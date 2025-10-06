/**
 * Component configuration constants
 * Centralizes component-specific styling and behavior constants
 * Note: Theme values are inlined to avoid circular dependencies
 */

// ============================================================================
// COMPONENT STYLING CONSTANTS
// ============================================================================

// Component-specific constants - Only unique values not handled by theme
export const COMPONENTS = {
    // Menu padding values used in calculations
    menu: {
        padding: {
            vertical: '12px',
            horizontal: '16px',
        },
    },
    // Simple border definitions
    borders: {
        subtle: '1px solid hsl(0, 0%, 18%)',
        primary: '1px solid hsl(0, 0%, 30%)',
        interactive: '2px solid hsl(217, 91%, 60%)',
    },
    // Overlay colors for semantic usage
    overlays: {
        dark: 'hsla(0, 0%, 5%, 0.95)',
        light: 'hsla(0, 0%, 15%, 0.9)',
        medium: 'hsla(0, 0%, 18%, 0.9)',
    },
    // Badge border for grid editor cells
    badge: {
        border: '1px solid hsl(217, 91%, 60%)',
    },
};
