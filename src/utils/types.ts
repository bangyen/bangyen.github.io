/**
 * Branded type for grid sizes (rows and columns).
 * Ensures that any number used as a grid size has been validated.
 */
export type GridSize = number & { readonly __brand: 'GridSize' };

/**
 * Branded type for cell indices.
 * Ensures that any number used as an index has been validated.
 */
export type CellIndex = number & { readonly __brand: 'CellIndex' };

/**
 * Validates and creates a GridSize.
 * @param n - The number to convert to a GridSize.
 * @returns A GridSize branded number.
 * @throws Error if the grid size is invalid.
 */
export const createGridSize = (n: number): GridSize => {
    if (n < 1 || n > 100)
        throw new Error('Invalid grid size: must be between 1 and 100');
    return n as GridSize;
};

/**
 * Validates and creates a CellIndex.
 * @param idx - The index to convert to a CellIndex.
 * @returns A CellIndex branded number.
 * @throws Error if the index is negative.
 */
export const createCellIndex = (idx: number): CellIndex => {
    if (idx < 0) throw new Error('Invalid cell index: cannot be negative');
    return idx as CellIndex;
};

/**
 * Generic discriminated union for game/process states.
 * This pattern improves type safety when handling different logical branches
 * by ensuring that properties specific to a state are only accessible when
 * that state is active.
 */
export type GenericStatus = 'idle' | 'playing' | 'won' | 'error';

export type GenericState<P = undefined, W = undefined, E = string> =
    | { status: 'idle' }
    | ({ status: 'playing' } & (P extends undefined ? object : P))
    | ({ status: 'won' } & (W extends undefined ? object : W))
    | { status: 'error'; error: E };
