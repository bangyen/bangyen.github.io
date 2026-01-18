import React, { useMemo, useCallback } from 'react';
import { Grid } from '../../../components/mui';

import { CustomGrid } from '../../../components/ui/CustomGrid';
import { COLORS } from '../../../config/theme';

interface BoardProps {
    frontProps: (row: number, col: number) => Record<string, unknown>;
    backProps: (row: number, col: number) => Record<string, unknown>;
    size: number;
    rows: number;
    cols: number;
}

interface CenteredProps {
    children: React.ReactNode;
}

interface Palette {
    primary: string;
    secondary: string;
}

interface Getters {
    getColor: (row: number, col: number) => { front: string; back: string };
    getBorder: (row: number, col: number) => Record<string, unknown>;
    getFiller: (row: number, col: number) => string;
}

interface GridState {
    grid: number[][];
    rows: number;
    cols: number;
}

export function Board(props: BoardProps): React.ReactElement {
    const { frontProps, backProps, size, rows, cols } = props;

    return (
        <Centered>
            <CustomGrid
                space={0}
                size={size}
                rows={rows - 1}
                cols={cols - 1}
                cellProps={backProps}
            />
            <Centered>
                <CustomGrid
                    space={0}
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={frontProps}
                />
            </Centered>
        </Centered>
    );
}

function Centered({ children }: CenteredProps): React.ReactElement {
    const style = {
        transform: 'translate(-50%, -50%)',
    };

    return (
        <Grid
            sx={{
                top: '50%',
                left: '50%',
                width: '100%',
                position: 'absolute',
                ...style,
            }}
        >
            {children}
        </Grid>
    );
}

function borderHandler(
    row: number,
    col: number,
    getColor: (row: number, col: number) => unknown
): Record<string, unknown> {
    const self = getColor(row, col);
    const up = getColor(row - 1, col);
    const down = getColor(row + 1, col);
    const left = getColor(row, col - 1);
    const right = getColor(row, col + 1);
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
    getColor: (row: number, col: number) => unknown
): boolean {
    const topLeft = getColor(row, col);
    const topRight = getColor(row, col + 1);
    const botLeft = getColor(row + 1, col);
    const botRight = getColor(row + 1, col + 1);
    let color = true;

    const total =
        Number(topLeft) + Number(topRight) + Number(botLeft) + Number(botRight);

    if ((!topLeft || !botRight) && total < 3) color = false;

    return color;
}

export function usePalette(score: number): Palette {
    const palette = useMemo(() => {
        const primary = COLORS.primary.main;
        const secondary = COLORS.primary.dark;

        return { primary, secondary };
    }, []);

    return palette;
}

export function useGetters(
    getTile: (row: number, col: number) => unknown,
    palette: Palette
): Getters {
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
            return borderHandler(row, col, getTile);
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

    return {
        getColor,
        getBorder,
        getFiller,
    };
}

export function useHandler(state: GridState, palette: Palette): Getters {
    const { grid, rows, cols } = state;

    const getTile = useCallback(
        (row: number, col: number) => {
            if (row < 0 || col < 0 || row >= rows || col >= cols) return -1;

            return grid[row][col];
        },
        [grid, rows, cols]
    );

    return useGetters(getTile, palette);
}
