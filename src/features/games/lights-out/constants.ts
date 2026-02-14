import { BOARD_STYLES, createStorageKeys } from '../config';

export const LIGHTS_OUT_STYLES = {
    TRANSITION: {
        FAST: 'background-color 100ms ease-in-out, color 100ms ease-in-out, opacity 100ms ease-in-out, border-radius 100ms ease-in-out',
        DEFAULT:
            'background-color 200ms ease, color 200ms ease, opacity 200ms ease, border-radius 200ms ease',
    },
    SHADOWS: {
        DROP: BOARD_STYLES.DROP_SHADOW,
    },
};

export const LAYOUT_CONSTANTS = {
    ICON_SIZE_RATIO: 1.25,
    OFFSET: {
        MOBILE: -28,
        DESKTOP: -40,
    },
};

export const STORAGE_KEYS = createStorageKeys('lights-out');
