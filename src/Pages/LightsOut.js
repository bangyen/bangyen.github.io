import { RefreshRounded, InfoRounded, CircleRounded } from '@mui/icons-material';
import { useMemo, useEffect, useReducer } from 'react';
import { useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { Navigation, HomeButton, TooltipButton } from '../helpers';
import { Board, useHandler, usePalette } from './Board';
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

            const flat = grid
                .flatMap(r => r);

            const done =
                !flat.includes(1) ||
                !flat.includes(0);

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

function getFrontProps(getters, dispatch) {
    const {
        getColor,
        getBorder
    } = getters;

    const flipAdj
        = (row, col) => {
            dispatch({
                type: 'adjacent',
                row, col
            });
        };

    return (row, col) => {
        const style = getBorder(row, col);
        const { front, back }
            = getColor(row, col);

        return {
            onClick: () =>
                flipAdj(row, col),
            children: <CircleRounded />,
            backgroundColor: front,
            color: front,
            style,
            sx: {
                '&:hover': {
                    cursor: 'pointer',
                    color: back
                }
            }
        };
    };
}

export default function LightsOut() {
    const mobile = useMediaQuery(
        theme => theme
            .breakpoints
            .down('sm'));

    const { height, width } = useWindow();
    const size    = mobile ? 3 : 5;
    const palette = usePalette();

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

    const [open, toggleOpen]
        = useReducer(
            (open) => !open,
            false);

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

    const getters = useHandler(
        state, palette);

    const frontProps = getFrontProps(
        getters, dispatch);

    const backProps 
        = (row, col) => {
            return {
                backgroundColor:
                    getters.getFiller(
                        row, col)
            };
        };

    const infoButton = useMemo(() => {
        if (mobile)
            return null;

        return (
            <TooltipButton
                Icon={InfoRounded}
                title='Info'
                onClick={toggleOpen} />
        );
    }, [toggleOpen, mobile]);

    return (
        <Grid>
            <Board
                size={size}
                rows={rows}
                cols={cols}
                frontProps={frontProps}
                backProps={backProps} />
            <Navigation>
                <HomeButton size='inherit'/>
                <TooltipButton
                    Icon={RefreshRounded}
                    title='Randomize'
                    onClick={() =>
                        dispatch({
                            type: 'random'
                        })} />
                {infoButton}
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
