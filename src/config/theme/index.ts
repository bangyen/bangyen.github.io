/**
 * Theme module index
 * Re-exports all theme-related utilities for convenient importing
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './animations';
export * from './components';
export * from './muiTheme';

/** Utility wrapper for creating sx-prop factory functions. */
export const sxf = (fn: (theme: unknown) => Record<string, unknown>) => fn;
