import { LAYOUT } from '@/config/theme';

export * from './constants';

/**
 * Returns the `useBaseGame` configuration for Lights Out.
 */
export function getLightsOutGameConfig() {
    return {
        storageKey: 'lights-out',
        grid: {
            maxSize: 10,
            headerOffset: {
                mobile: LAYOUT.headerHeight.xs,
                desktop: LAYOUT.headerHeight.md,
            },
            gridPadding: {
                x: 80,
                y: 60,
            },
        },
        board: {
            boardPadding: (mobile: boolean) => ({
                x: mobile ? 40 : 120,
                y: mobile ? 120 : 160,
            }),
            maxCellSize: 80,
        },
    };
}
