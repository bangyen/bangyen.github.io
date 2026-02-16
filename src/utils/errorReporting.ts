/**
 * Centralised error logging for error boundaries and route error
 * handlers.  Provides a single place to wire in production error
 * reporting services (Sentry, LogRocket, etc.) without touching
 * every boundary or handler individually.
 */

import type React from 'react';

export interface ErrorContext {
    /** Name of the component or handler that caught the error. */
    component?: string;
    /** React error info (component stack) when available. */
    errorInfo?: React.ErrorInfo;
}

/**
 * Logs an error with optional context. Always emits to the console;
 * in production builds the clearly marked hook below can forward to
 * an external service.
 *
 * @param error   - The error that was caught.
 * @param context - Optional metadata about where the error originated.
 */
export function logError(error: Error, context: ErrorContext = {}): void {
    const label = context.component
        ? `[${context.component}]`
        : '[ErrorReporter]';

    if (context.errorInfo) {
        globalThis.console.error(label, error, context.errorInfo);
    } else {
        globalThis.console.error(label, error);
    }

    // ── Production reporting hook ───────────────────────────────
    // Replace the body of this block with your preferred service
    // integration (e.g. Sentry.captureException).
    const isProduction =
        typeof process === 'undefined'
            ? import.meta.env.PROD
            : process.env['NODE_ENV'] === 'production';

    if (isProduction) {
        // Example: Sentry.captureException(error, { extra: context });
    }
}
