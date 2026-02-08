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
export function useCellFactory<T extends any[]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    factory: (getDragProps: (pos: string) => any, ...args: T) => CellFactory, // eslint-disable-line @typescript-eslint/no-explicit-any
    getDragProps: (pos: string) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
    dependencies: T
): CellFactory {
    return useMemo(
        () => factory(getDragProps, ...dependencies),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [factory, getDragProps, ...dependencies]
    );
}
