import { Refresh, ArrowBackRounded, HomeRounded } from '@/components/icons';

/**
 * Standardised user-facing text for error components.
 * Centralises copy across 404, crash screens, and feature boundaries.
 */
export const ERROR_TEXT = {
    title: {
        default: 'Something went wrong',
        notFound: 'Page Not Found',
        failedToLoad: 'Failed to Load',
    },
    message: {
        default: 'An unexpected error occurred.',
        notFound: "This page doesn't exist or has been moved.",
        failedToLoad: 'Please check your connection and try again.',
        appCrash: 'An unexpected error occurred while rendering this page.',
    },
    labels: {
        tryAgain: 'Try Again',
        reloadPage: 'Reload Page',
        goBack: 'Go Back',
        returnToHome: 'Return to Home',
        returnToGame: 'Return to Game',
    },
} as const;

/**
 * Standardised icons for error actions.
 */
export const ERROR_ICONS = {
    recovery: Refresh,
    back: ArrowBackRounded,
    home: HomeRounded,
} as const;
