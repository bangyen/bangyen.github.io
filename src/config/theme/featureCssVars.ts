/**
 * Aggregated feature-specific CSS custom-property definitions.
 *
 * Keeping all feature CSS variables here prevents the core theme factory
 * (`muiTheme.ts`) from importing directly from feature modules, which
 * would invert the intended dependency direction (shared -> features).
 *
 * When adding a new feature that needs mode-aware CSS variables, append
 * its definitions to the `FEATURE_CSS_VARS` array below.
 */

import type { CssVarDefinition } from './cssVars';

// ---------------------------------------------------------------------------
// Slant analysis-mode variables
// ---------------------------------------------------------------------------

const SLANT_ANALYSIS_CSS_VARS: readonly CssVarDefinition[] = [
    {
        name: '--slant-analysis-border',
        light: 'rgba(0, 0, 0, 0.1)',
        dark: 'rgba(255, 255, 255, 0.1)',
    },
    {
        name: '--slant-analysis-bg-subtle',
        light: 'rgba(0, 0, 0, 0.02)',
        dark: 'rgba(255, 255, 255, 0.02)',
    },
    {
        name: '--slant-analysis-bg-hover',
        light: 'rgba(0, 0, 0, 0.05)',
        dark: 'rgba(255, 255, 255, 0.1)',
    },
    {
        name: '--slant-analysis-dashed-border',
        light: 'rgba(0, 0, 0, 0.15)',
        dark: 'rgba(255, 255, 255, 0.2)',
    },
    {
        name: '--slant-analysis-hint-bg',
        light: 'hsl(217, 30%, 94%)',
        dark: 'hsl(217, 50%, 8%)',
    },
    {
        name: '--slant-analysis-hint-border',
        light: 'rgba(0, 0, 0, 0.1)',
        dark: 'rgba(255, 255, 255, 0.3)',
    },
    {
        name: '--slant-analysis-hint-text',
        light: 'hsl(217, 91%, 30%)',
        dark: '#fff',
    },
];

// ---------------------------------------------------------------------------
// Research page variables
// ---------------------------------------------------------------------------

const RESEARCH_CSS_VARS: readonly CssVarDefinition[] = [
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

// ---------------------------------------------------------------------------
// Aggregated export
// ---------------------------------------------------------------------------

/** All feature-specific CSS variable definitions, consumed by `createAppTheme`. */
export const FEATURE_CSS_VARS: readonly CssVarDefinition[] = [
    ...RESEARCH_CSS_VARS,
    ...SLANT_ANALYSIS_CSS_VARS,
];
