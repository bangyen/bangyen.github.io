import { GlobalStyles as MuiGlobalStyles } from '@mui/material';
import React from 'react';

/**
 * Application-wide CSS injected via Emotion instead of a plain CSS file.
 * Keeps all styling in one paradigm (MUI/Emotion) and avoids the
 * single-outlier `animations.css` import.
 */
export function GlobalStyles(): React.ReactElement {
    return (
        <MuiGlobalStyles
            styles={{
                /* Respect user's motion preferences */
                '@media (prefers-reduced-motion: reduce)': {
                    '*, *::before, *::after': {
                        animationDuration: '0.01ms !important',
                        animationIterationCount: '1 !important',
                        transitionDuration: '0.01ms !important',
                        scrollBehavior: 'auto !important',
                    },
                },

                /* Custom scrollbars */
                '::-webkit-scrollbar': {
                    width: 8,
                    height: 8,
                },
                '::-webkit-scrollbar-track': {
                    background: 'var(--elevated)',
                    borderRadius: 4,
                },
                '::-webkit-scrollbar-thumb': {
                    background: 'var(--primary-dark)',
                    borderRadius: 4,
                    transition: 'background-color 150ms ease-in-out',
                },
                "[data-theme='light'] ::-webkit-scrollbar-thumb": {
                    background: 'var(--primary-light)',
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: 'var(--primary-main)',
                },

                /* Selection styles */
                '::selection': {
                    backgroundColor: 'var(--selection-background)',
                    color: 'var(--selection-text)',
                },

                /* Focus visible styles for better accessibility */
                '.focus-visible': {
                    outline: 'none',
                    boxShadow: '0 0 0 3px hsl(217deg 91% 60% / 15%)',
                },

                /* Modern backdrop filter support */
                '.glass-effect': {
                    backdropFilter: 'blur(20px) saturate(180%)',
                },

                /* Smooth text rendering */
                body: {
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                },

                /* Smooth scrolling behavior */
                html: {
                    scrollBehavior: 'smooth',
                },

                /* Ensure proper scroll positioning */
                '.featured-work-section': {
                    scrollMarginTop: '2rem',
                },

                /* Shared fade-in entrance animation */
                '@keyframes fadeIn': {
                    from: {
                        opacity: 0,
                    },
                    to: {
                        opacity: 1,
                    },
                },
            }}
        />
    );
}
