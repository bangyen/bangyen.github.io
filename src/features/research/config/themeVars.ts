/**
 * Research-specific CSS custom properties.
 *
 * These are glass / border / accent variables consumed exclusively by
 * research pages.  They live here so the core MUI theme file stays
 * focused on application-wide design tokens.
 */

import type { CssVarDefinition } from '@/config/theme/cssVars';

/** Declarative research CSS variable definitions (light/dark pairs). */
export const RESEARCH_CSS_VARS: readonly CssVarDefinition[] = [
    // Glass intensity scale
    {
        name: '--glass-very-subtle',
        light: 'rgba(0, 0, 0, 0.02)',
        dark: 'rgba(255, 255, 255, 0.01)',
    },
    {
        name: '--glass-subtle',
        light: 'rgba(0, 0, 0, 0.04)',
        dark: 'rgba(255, 255, 255, 0.02)',
    },
    {
        name: '--glass-transparent',
        light: 'rgba(0, 0, 0, 0.06)',
        dark: 'rgba(255, 255, 255, 0.03)',
    },
    {
        name: '--glass-slight',
        light: 'rgba(0, 0, 0, 0.08)',
        dark: 'rgba(255, 255, 255, 0.05)',
    },
    {
        name: '--glass-medium',
        light: 'rgba(0, 0, 0, 0.12)',
        dark: 'rgba(255, 255, 255, 0.1)',
    },
    {
        name: '--glass-strong',
        light: 'rgba(0, 0, 0, 0.16)',
        dark: 'rgba(255, 255, 255, 0.2)',
    },
    {
        name: '--glass-dark',
        light: 'rgba(0, 0, 0, 0.05)',
        dark: 'rgba(0, 0, 0, 0.2)',
    },

    // Borders
    {
        name: '--research-border-subtle',
        light: 'rgba(0, 0, 0, 0.08)',
        dark: 'rgba(255, 255, 255, 0.05)',
    },
    {
        name: '--research-border-very-subtle',
        light: 'rgba(0, 0, 0, 0.04)',
        dark: 'rgba(255, 255, 255, 0.03)',
    },

    // Data-specific mode-aware highlights
    {
        name: '--research-cyan-bg',
        light: 'rgba(0, 184, 212, 0.08)',
        dark: 'rgba(0, 184, 212, 0.1)',
    },
    {
        name: '--research-cyan-border',
        light: 'rgba(0, 184, 212, 0.15)',
        dark: 'rgba(0, 184, 212, 0.2)',
    },
    {
        name: '--research-green-bg',
        light: 'rgba(0, 200, 83, 0.08)',
        dark: 'rgba(0, 200, 83, 0.1)',
    },
    {
        name: '--research-green-border',
        light: 'rgba(0, 200, 83, 0.15)',
        dark: 'rgba(0, 200, 83, 0.2)',
    },
    {
        name: '--research-amber-bg',
        light: 'rgba(255, 193, 7, 0.08)',
        dark: 'rgba(255, 193, 7, 0.1)',
    },
    {
        name: '--research-amber-border',
        light: 'rgba(255, 193, 7, 0.15)',
        dark: 'rgba(255, 193, 7, 0.2)',
    },
];
