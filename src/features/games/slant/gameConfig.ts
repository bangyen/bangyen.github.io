import { GAME_CONSTANTS } from '../config';
import {
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
    GAME_LOGIC_CONSTANTS,
} from './constants';

import { PAGE_TITLES } from '@/config/constants';

/**
 * Returns the `useBaseGame` configuration for Slant.
 * Accepts `mobile` so responsive padding offsets and the optional
 * board-size factor are resolved here instead of in the page component.
 *
 * This lives in its own module (rather than `constants.ts`) because
 * `constants.ts` is transitively imported by web workers, and the
 * `@/` path alias does not resolve inside the worker bundle.
 */
export function getSlantGameConfig(mobile: boolean) {
    return {
        storageKeys: {
            size: STORAGE_KEYS.SIZE,
            state: STORAGE_KEYS.STATE,
        },
        pageTitle: PAGE_TITLES.slant,
        gridConfig: {
            defaultSize: GAME_LOGIC_CONSTANTS.DEFAULT_SIZE,
            maxSize: GAME_LOGIC_CONSTANTS.MAX_SIZE,
            paddingOffset: {
                x: mobile ? 48 : 80,
                y: 120,
            },
            widthLimit: LAYOUT_CONSTANTS.WIDTH_LIMIT,
            cellSizeReference: 4,
        },
        boardConfig: {
            paddingOffset: (isMobile: boolean) => ({
                x: isMobile ? 48 : 80,
                y: LAYOUT_CONSTANTS.PADDING_OFFSET,
            }),
            ...(mobile ? { boardSizeFactor: 0.92 } : {}),
            maxCellSize: LAYOUT_CONSTANTS.MAX_CELL_SIZE,
            rowOffset: 1,
            colOffset: 1,
        },
        manualResize: true,
        winAnimationDelay: GAME_CONSTANTS.timing.winAnimationDelay,
    };
}
