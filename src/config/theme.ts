/**
 * Theme configuration for the website
 * Centralizes colors, typography, spacing, and animations for consistent design
 *
 * This file re-exports all theme utilities from modular files for backward compatibility.
 * Import from './config/theme' works exactly as before.
 */

export * from './theme/colors';
export * from './theme/typography';
export * from './theme/spacing';
export * from './theme/animations';
export * from './theme/components';
export * from './theme/muiTheme';

// Utility function for creating sx prop functions (commonly used pattern)
export const sxf = (fn: (theme: unknown) => Record<string, unknown>) => fn;
