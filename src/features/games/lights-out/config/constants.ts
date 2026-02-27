import {
    BOARD_STYLES,
    createStorageKeys,
    GAME_CONSTANTS,
} from '../../config/constants';

import { KeyboardArrowDown, Calculate, Replay } from '@/components/icons';

export const LIGHTS_OUT_STYLES = {
    TRANSITION: {
        FAST: BOARD_STYLES.TRANSITION,
        DEFAULT: BOARD_STYLES.TRANSITION,
    },
    SHADOWS: {
        DROP: BOARD_STYLES.DROP_SHADOW,
    },
    ANIMATIONS: {
        POP_IN_STYLE: `shared-pop-in ${GAME_CONSTANTS.animations.celebration.duration} ${GAME_CONSTANTS.animations.celebration.easing} forwards`,
        POP_IN: GAME_CONSTANTS.animations.celebration.keyframes,
    },
};

export const LIGHTS_OUT_LAYOUT_CONSTANTS = {
    ICON_SIZE_RATIO: 1.25,
    OFFSET: {
        MOBILE: -60,
        DESKTOP: 0,
    },
};

export const LIGHTS_OUT_STORAGE_KEYS = createStorageKeys('lights-out');

export const LIGHTS_OUT_INFO_TITLES = [
    'Chasing Lights',
    'How It Works',
    'Calculator',
];

export const LIGHTS_OUT_INSTRUCTIONS = [
    {
        Icon: KeyboardArrowDown,
        title: 'Chase to Bottom',
        text: 'Turn off rows from top to bottom by clicking lights in each row to push them down.',
    },
    {
        Icon: Calculate,
        title: 'Use Calulator',
        text: 'Enter the remaining lights pattern from the bottom row into the calculator on the last page.',
    },
    {
        Icon: Replay,
        title: 'Chase Again',
        text: 'Apply the solution pattern to the top row, then chase them down again to solve the puzzle.',
    },
];

/** Example grid size constants for the info modal. */
export const LIGHTS_OUT_EXAMPLE_SIZE = {
    MOBILE: 3,
    DESKTOP: 4,
} as const;
