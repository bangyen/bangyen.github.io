import React, { useMemo, useEffect, useReducer } from 'react';
import { Grid } from '../../components/mui';
import { InfoRounded, CircleRounded } from '../../components/icons';

import { Controls, TooltipButton } from '../../helpers';
import { Board, useHandler, usePalette } from '../Board';
import { PAGE_TITLES, GAME_CONSTANTS } from '../../config/constants';
import { COLORS } from '../../config/theme';
import { getGrid, handleBoard } from './boardHandlers';
import { useWindow, useMobile } from '../../hooks';
import { convertPixels } from '../../calculate';
import Info from './Info';

interface Getters {
    getColor: (row: number, col: number) => { front: string; back: string };
    getBorder: (row: number, col: number) => React.CSSProperties;
    getFiller: (row: number, col: number) => string;
}

interface FrontProps {
    onClick: () => void;
    children: React.ReactElement;
    backgroundColor: string;
    color: string;
    style: React.CSSProperties;
    sx: {
        '&:hover': {
            cursor: string;
            color: string;
        };
    };
}

function getFrontProps(getters: Getters, dispatch: (action: any) => void) {
    const { getColor, getBorder } = getters;

    const flipAdj = (row: number, col: number) => {
        dispatch({
            type: 'adjacent',
            row,
            col,
        });
    };

    return (row: number, col: number): FrontProps => {
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

export default function LightsOut(): React.ReactElement {
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

    const [open, toggleOpen] = useReducer((open: boolean) => !open, false);

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

    const backProps = (row: number, col: number) => {
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
                frontProps={frontProps as any}
                backProps={backProps}
            />
            <Controls
                handler={() => () => undefined} // No directional controls for Lights Out
                onRandom={() => dispatch({ type: 'random' })}
                size="inherit"
            >
                <TooltipButton
                    title="Info"
                    Icon={InfoRounded}
                    onClick={toggleOpen}
                />
            </Controls>
            {(Info as any)({
                rows,
                cols,
                size,
                open,
                palette,
                score: state.score,
                toggleOpen,
            })}
        </Grid>
    );
}

