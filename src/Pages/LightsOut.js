import { RefreshRounded, InfoRounded, CircleRounded } from '@mui/icons-material';
import { useMemo, useEffect, useCallback, useReducer, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';


import { Navigation, HomeButton, TooltipButton } from '../helpers';
import { Sector, useGetters, usePalette } from './Sector';
import { convertPixels } from '../calculate';
import { useWindow } from '../hooks';
import Info from './Info';

function getGrid(rows, cols) {
    return [...Array(rows)]
        .map(() =>
            Array(cols)
                .fill(0));
}

function flipAdj(row, col, grid) {
    const cols = grid[0].length;
    const rows = grid.length;

    grid = grid.map(row => [...row]);
    grid[row][col] ^= 1;

    if (row > 0)
        grid[row - 1][col] ^= 1;

    if (row < rows - 1)
        grid[row + 1][col] ^= 1;

    if (col > 0)
        grid[row][col - 1] ^= 1;

    if (col < cols - 1)
        grid[row][col + 1] ^= 1;

    return grid;
}

function randomize(rows, cols) {
    let grid = getGrid(rows, cols);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const random = Math.random();

            if (random > 0.5)
                grid = flipAdj(
                    r, c, grid);
        }
    }

    return grid;
}

function handleAction(state, action) {
    const { type, row, col } = action;

    let {
        grid,
        score,
        rows,
        cols
    } = state;

    switch (type) {
        case 'adjacent':
            grid = flipAdj(
                row, col, grid);

            const done = !grid
                .flatMap(r => r)
                .includes(1);

            if (done) {
                grid = randomize(
                    rows, cols);
                score += 1;
            }

            break;
        case 'random':
            grid = randomize(
                rows, cols);

            break;
        case 'resize':
            const {
                newRows,
                newCols
            } = action;

            rows = newRows;
            cols = newCols;
            grid = randomize(
                rows, cols);

            break;
        default:
            break;
    }

    return {
        grid,
        score,
        rows,
        cols
    };
}

export default function LightsOut() {
    const { height, width } = useWindow();

    const mobile = useMediaQuery(
        theme => theme.breakpoints.down('sm'));
    const size = mobile ? 3 : 5;

    let { rows, cols } = useMemo(
        () => convertPixels(
            size, height, width),
        [size, height, width]);

    rows -= 1;
    cols -= 1;

    const initial = {
        grid: getGrid(
            rows, cols),
        score: 0,
        rows,
        cols
    };

    const [state, dispatch]
        = useReducer(
            handleAction,
            initial);

    const flipAdj = useCallback(
        (row, col) => {
            dispatch({
                type: 'adjacent',
                row, col
            });
        },
        [dispatch]);

    const getTile = useCallback(
        (row, col) => {
            if (row < 0 || col < 0
                    || row >= state.rows
                    || col >= state.cols)
                return -1;

            return state.grid[row][col];
        },
        [state]);

    const palette = usePalette();

    const {
        getColor,
        getBorder,
        getFiller
    } = useGetters(
        getTile, palette);

    useEffect(() => {
        document.title
            = 'Lights Out | Bangyen';
    }, []);

    useEffect(() => {
        dispatch({
            type: 'resize',
            newRows: rows,
            newCols: cols
        });
    }, [rows, cols]);

    const frontProps 
        = (row, col) => {
            const style = getBorder(row, col);
            const { front, back }
                = getColor(row, col);

            return {
                onClick: () =>
                    flipAdj(row, col),
                backgroundColor: front,
                sx: {
                    '&:hover': {
                        cursor: 'pointer',
                        color: back
                    }
                },
                color: front,
                children: <CircleRounded />,
                style
            };
        };

    const backProps 
        = (row, col) => {
            return {
                backgroundColor:
                    getFiller(row, col)
            };
        };

    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(!open);

    return (
        <Grid>
            <Sector
                size={size}
                rows={rows}
                cols={cols}
                frontProps={frontProps}
                backProps={backProps} />
            <Navigation>
                <HomeButton />
                <TooltipButton
                    Icon={RefreshRounded}
                    title='Randomize'
                    onClick={() =>
                        dispatch({
                            type: 'random'
                        })} />
                <TooltipButton
                    Icon={InfoRounded}
                    title='Info'
                    onClick={toggleOpen} />
            </Navigation>
            <Info
                rows={rows}
                cols={cols}
                size={size}
                open={open}
                palette={palette}
                score={state.score}
                toggleOpen={toggleOpen} />
        </Grid>
    );
}
