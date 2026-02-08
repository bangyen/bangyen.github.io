import { useMemo } from 'react';

/**
 * Generates a consistent position key for game grid cells.
 */
export function getPosKey(row: number, col: number): string {
    return `${row.toString()},${col.toString()}`;
}

/**
 * Common prop types for cell renderers.
 */
export interface CellRenderProps {
    row: number;
    col: number;
    [key: string]: unknown;
}

export type CellFactory = (row: number, col: number) => Record<string, unknown>;

/**
 * Helper to memoize a cell factory that depends on some state and drag props.
 */
export function useCellFactory<T extends unknown[]>(
    factory: (
        getDragProps: (pos: string) => Record<string, unknown>,
        ...args: T
    ) => CellFactory,
    getDragProps: (pos: string) => Record<string, unknown>,
    dependencies: T
): CellFactory {
    return useMemo(
        () => factory(getDragProps, ...dependencies),
        [factory, getDragProps, dependencies]
    );
}
