import type { Variants } from 'framer-motion';

/**
 * Standard pop-in animation for game boards and larger containers.
 */
export const boardPopIn: Variants = {
    initial: { transform: 'scale(0.95)', opacity: 0 },
    animate: { transform: 'scale(1)', opacity: 1 },
    exit: { transform: 'scale(0.95)', opacity: 0 },
};

/**
 * Standard spring-based transition for game pop-ins.
 */
export const boardPopInTransition = {
    transform: {
        type: 'spring' as const,
        damping: 15,
        stiffness: 200,
    },
    opacity: {
        duration: 0.3,
        ease: 'easeOut' as const,
    },
};

/**
 * Standard scale and fade animation for overlays (e.g., TrophyOverlay).
 */
export const overlayScalePop: Variants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
};

/**
 * Smooth transition for overlays.
 */
export const overlayTransition = {
    scale: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 300,
    },
    opacity: {
        duration: 0.4,
        ease: 'easeOut' as const,
    },
};
