import { Refresh, InfoRounded, CircleRounded } from '../../components/icons';
import { useMemo, useEffect, useReducer } from 'react';
import { Grid } from '../../components/mui';

import { Navigation, HomeButton, TooltipButton } from '../../helpers';
import { Board, useHandler, usePalette } from '../Board';
import { PAGE_TITLES, GAME_CONSTANTS } from '../../config/constants';
import { COLORS } from '../../config/theme';
import { getGrid, handleBoard } from './boardHandlers';
import { useWindow, useMobile } from '../../hooks';
import { convertPixels } from '../../calculate';
import Info from './Info';

function getFrontProps(getters, dispatch) {
    const { getColor, getBorder } = getters;

    const flipAdj = (row, col) => {
        dispatch({
            type: 'adjacent',
            row,
            col,
        });
    };

    return (row, col) => {
        const style = getBorder(row, col);
        const { front, back } = getColor(row, col);

        return {
            onClick: () => flipAdj(row, col),
            children: <CircleRounded />,
            backgroundColor: front,
            color: front,
            style,
            sx: {
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
            },
        };
    };
}

export default function LightsOut() {
    const { height, width } = useWindow();
    const mobile = useMobile('sm');
    const size = mobile
        ? GAME_CONSTANTS.gridSizes.mobile
        : GAME_CONSTANTS.gridSizes.desktop;

    let { rows, cols } = useMemo(
        () => convertPixels(size, height, width),
        [size, height, width]
    );

    rows -= 1;
    cols -= 1;

    if (mobile) rows -= 2;

    const initial = {
        grid: getGrid(rows, cols),
        score: 0,
        rows,
        cols,
    };

    const [state, dispatch] = useReducer(handleBoard, initial);

    const [open, toggleOpen] = useReducer(open => !open, false);

    const palette = usePalette(state.score);

    useEffect(() => {
        document.title = PAGE_TITLES.lightsOut;
    }, []);

    useEffect(() => {
        dispatch({
            type: 'resize',
            newRows: rows,
            newCols: cols,
        });
    }, [rows, cols]);

    const getters = useHandler(state, palette);

    const frontProps = getFrontProps(getters, dispatch);

    const backProps = (row, col) => {
        return {
            backgroundColor: getters.getFiller(row, col),
        };
    };

    return (
        <Grid
            container
            minHeight="100vh"
            sx={{
                background: COLORS.surface.background,
                position: 'relative',
            }}
        >
            <Board
                size={size}
                rows={rows}
                cols={cols}
                frontProps={frontProps}
                backProps={backProps}
            />
            <Navigation>
                <HomeButton size="inherit" />
                <TooltipButton
                    Icon={Refresh}
                    title="Randomize"
                    size="inherit"
                    onClick={() =>
                        dispatch({
                            type: 'random',
                        })
                    }
                />
                <TooltipButton
                    title="Info"
                    size="inherit"
                    Icon={InfoRounded}
                    onClick={toggleOpen}
                />
            </Navigation>
            <Info
                rows={rows}
                cols={cols}
                size={size}
                open={open}
                palette={palette}
                score={state.score}
                toggleOpen={toggleOpen}
            />
        </Grid>
    );
}
