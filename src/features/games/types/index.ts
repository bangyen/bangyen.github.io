/**
 * Simple numeric type for grid sizes (rows and columns).
 */
export type GridSize = number;

/**
 * Simple numeric type for cell indices.
 */
export type CellIndex = number;

/**
 * Validates a grid size.
 * @param n - The number to validate.
 * @throws Error if the grid size is invalid.
 */
export const validateGridSize = (n: number): void => {
    if (n < 1 || n > 100)
        throw new Error('Invalid grid size: must be between 1 and 100');
};

/**
 * Validates a cell index.
 * @param idx - The index to validate.
 * @throws Error if the index is negative.
 */
export const validateCellIndex = (idx: number): void => {
    if (idx < 0) throw new Error('Invalid cell index: cannot be negative');
};

// ---------------------------------------------------------------------------
// Game info modal base interface
// ---------------------------------------------------------------------------

/**
 * Base props shared by every game's info modal component.
 *
 * Standardises the open/close contract so new games have a clear
 * interface to follow, and prop-shaping hooks can rely on a common shape.
 */
export interface BaseInfoProps {
    /** Whether the info modal is open. */
    open: boolean;
    /** Toggle the modal open/close state. */
    toggleOpen: () => void;
}

// ---------------------------------------------------------------------------
// Game configuration interfaces
// ---------------------------------------------------------------------------

export interface LightsOutConstants {
    defaultSize: number;
}

export interface GridSizes {
    mobile: number;
    desktop: number;
}

export interface GameConfig {
    lightsOut: LightsOutConstants;
    gridSizes: GridSizes;
    controls: {
        arrowPrefix: string;
    };
}
