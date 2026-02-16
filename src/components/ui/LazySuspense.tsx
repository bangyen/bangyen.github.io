import { Typography } from '@mui/material';
import React, { Suspense } from 'react';

import { LoadingFallback } from './LoadingFallback';
import { ErrorBoundary } from '../layout/ErrorBoundary';

import { COLORS } from '@/config/theme';

export interface LazySuspenseProps {
    children: React.ReactNode;
    /** Height passed to `LoadingFallback` when rendering a block fallback. */
    height?: string | number;
    /** Message shown in the fallback indicator. */
    message?: string;
    /**
     * When true, renders a lightweight inline `<span>` fallback instead of
     * the full-height `LoadingFallback` block.  Useful for lazy-loaded
     * fragments (e.g. LaTeX symbols) embedded inside a paragraph.
     */
    inline?: boolean;
    /**
     * Text shown as the inline fallback.  Only used when `inline` is true.
     * Defaults to an empty string so the surrounding text reflows minimally.
     */
    inlineFallback?: string;
    /**
     * Optional fallback UI rendered when the lazy-loaded chunk fails to
     * load (e.g. network error).  When provided, an `ErrorBoundary` is
     * wrapped around the `Suspense` so errors are caught locally instead
     * of propagating up to the nearest route-level boundary.
     */
    errorFallback?: React.ReactNode;
}

/**
 * Standardised Suspense boundary used throughout the application.
 *
 * Wraps `React.Suspense` so every lazy-loaded component renders a
 * consistent fallback UI without repeating the same `<Suspense>` +
 * fallback boilerplate at each call-site.  Supports two modes:
 *
 * - **Block** (default): centres a `LoadingFallback` with configurable
 *   height and message — suited for lazy-loaded pages or chart panels.
 * - **Inline** (`inline={true}`): renders a plain `<span>` with
 *   `inlineFallback` text — suited for lazy-loaded fragments inside
 *   paragraphs (e.g. LaTeX symbols).
 *
 * When `errorFallback` is provided an `ErrorBoundary` is wrapped around
 * the `Suspense` so chunk-load failures are caught locally rather than
 * tearing down the entire page.
 */
export function LazySuspense({
    children,
    height = 400,
    message = 'Loading...',
    inline = false,
    inlineFallback = '',
    errorFallback,
}: LazySuspenseProps): React.ReactElement {
    const suspense = inline ? (
        <Suspense
            fallback={
                <Typography
                    component="span"
                    variant="inherit"
                    sx={{ color: COLORS.text.secondary, opacity: 0.6 }}
                >
                    {inlineFallback}
                </Typography>
            }
        >
            {children}
        </Suspense>
    ) : (
        <Suspense
            fallback={<LoadingFallback message={message} height={height} />}
        >
            {children}
        </Suspense>
    );

    if (errorFallback) {
        return (
            <ErrorBoundary fallback={errorFallback}>{suspense}</ErrorBoundary>
        );
    }

    return suspense;
}
