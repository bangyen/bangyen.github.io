import { useMemo, useCallback } from 'react';
import { COLORS } from '../../../config/theme';
import { Palette, Getters } from '../components/Board';

interface GridState {
    grid: number[][];
    rows: number;
    cols: number;
}

function borderHandler(
    row: number,
    col: number,
    getTile: (row: number, col: number) => unknown
): Record<string, unknown> {
    const self = getTile(row, col);
    const up = getTile(row - 1, col);
    const down = getTile(row + 1, col);
    const left = getTile(row, col - 1);
    const right = getTile(row, col + 1);
    const props: Record<string, unknown> = {};

    const upCheck = self === up;
    const downCheck = self === down;
    const leftCheck = self === left;
    const rightCheck = self === right;

    if (upCheck || leftCheck) props.borderTopLeftRadius = 0;
    if (upCheck || rightCheck) props.borderTopRightRadius = 0;
    if (downCheck || leftCheck) props.borderBottomLeftRadius = 0;
    if (downCheck || rightCheck) props.borderBottomRightRadius = 0;

    return props;
}

function fillerHandler(
    row: number,
    col: number,
    getTile: (row: number, col: number) => unknown
): boolean {
    const topLeft = getTile(row, col);
    const topRight = getTile(row, col + 1);
    const botLeft = getTile(row + 1, col);
    const botRight = getTile(row + 1, col + 1);
    let color = true;

    const total =
        Number(topLeft) + Number(topRight) + Number(botLeft) + Number(botRight);

    if ((!topLeft || !botRight) && total < 3) color = false;

    return color;
}

export function usePalette(_score: number): Palette {
    return useMemo(() => {
        const primary = COLORS.primary.main;
        const secondary = COLORS.primary.dark;
        return { primary, secondary };
    }, []);
}

export function useHandler(state: GridState, palette: Palette): Getters {
    const { grid, rows, cols } = state;

    const getTile = useCallback(
        (row: number, col: number) => {
            if (row < 0 || col < 0 || row >= rows || col >= cols) return -1;
            return grid[row]?.[col] ?? -1;
        },
        [grid, rows, cols]
    );

    const getColor = useCallback(
        (row: number, col: number) => {
            const value = getTile(row, col);
            const front = value ? palette.primary : palette.secondary;
            const back = value ? palette.secondary : palette.primary;
            return { front, back };
        },
        [getTile, palette]
    );

    const getBorder = useCallback(
        (row: number, col: number) => {
            return borderHandler(row, col, getTile) as React.CSSProperties;
        },
        [getTile]
    );

    const getFiller = useCallback(
        (row: number, col: number) => {
            const value = fillerHandler(row, col, getTile);
            return value ? palette.primary : palette.secondary;
        },
        [getTile, palette]
    );

    return useMemo(
        () => ({
            getColor,
            getBorder: getBorder as (
                row: number,
                col: number
            ) => React.CSSProperties,
            getFiller,
        }),
        [getColor, getBorder, getFiller]
    );
}
