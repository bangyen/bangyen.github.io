/**
 * Slant ghost-mode (calculator) CSS custom properties.
 *
 * These variables are consumed only by the Slant ghost overlay
 * components.  Extracting them keeps the core MUI theme file
 * focused on application-wide design tokens.
 */

import type { CssVarDefinition } from '@/config/theme/cssVars';

/** Declarative Slant ghost-mode CSS variable definitions (light/dark pairs). */
export const SLANT_GHOST_CSS_VARS: readonly CssVarDefinition[] = [
    {
        name: '--slant-ghost-border',
        light: 'rgba(0, 0, 0, 0.1)',
        dark: 'rgba(255, 255, 255, 0.1)',
    },
    {
        name: '--slant-ghost-bg-subtle',
        light: 'rgba(0, 0, 0, 0.02)',
        dark: 'rgba(255, 255, 255, 0.02)',
    },
    {
        name: '--slant-ghost-bg-hover',
        light: 'rgba(0, 0, 0, 0.05)',
        dark: 'rgba(255, 255, 255, 0.1)',
    },
    {
        name: '--slant-ghost-dashed-border',
        light: 'rgba(0, 0, 0, 0.15)',
        dark: 'rgba(255, 255, 255, 0.2)',
    },
    {
        name: '--slant-ghost-hint-bg',
        light: 'hsl(217, 30%, 94%)',
        dark: 'hsl(217, 50%, 8%)',
    },
    {
        name: '--slant-ghost-hint-border',
        light: 'rgba(0, 0, 0, 0.1)',
        dark: 'rgba(255, 255, 255, 0.3)',
    },
    {
        name: '--slant-ghost-hint-text',
        light: 'hsl(217, 91%, 30%)',
        dark: '#fff',
    },
];
