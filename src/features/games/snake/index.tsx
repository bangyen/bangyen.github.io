import React, {
    useMemo,
    useCallback,
    useReducer,
    useEffect,
    useState,
    useRef,
} from 'react';
import { Grid } from '../../../components/mui';

import { convertPixels } from '../../interpreters/utils/gridUtils';
import { useWindow, useTimer, useKeys, useMobile } from '../../../hooks';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { Controls, ArrowsButton } from '../../../components/ui/Controls';
import { PAGE_TITLES } from '../../../config/constants';
import { GAME_CONSTANTS } from '../config/gameConfig';
import { LAYOUT, COLORS, COMPONENT_VARIANTS } from '../../../config/theme';
import { handleAction, handleResize, getRandom } from './logic';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';

export default function Snake(): React.ReactElement {
    const { create: createTimer } = useTimer(0);
    const { create: createKeys } = useKeys();
    const mobile = useMobile('sm');

    const { height, width } = useWindow();
    const length = GAME_CONSTANTS.snake.initialLength;
    const size = mobile
        ? GAME_CONSTANTS.gridSizes.mobile
        : GAME_CONSTANTS.gridSizes.desktop;

    const [randomMovesEnabled, setRandomMovesEnabled] = useState(false);
    const randomMovesRef = useRef(false);

    const [showArrows, setShowArrows] = useState(false);

    const { rows, cols } = useMemo(() => {
        const headerOffset = mobile
            ? LAYOUT.headerHeight.xs
            : LAYOUT.headerHeight.md;
        return convertPixels(size, height - headerOffset, width);
    }, [size, height, width, mobile]);

    const initial = useMemo(
        () => ({
            velocity: GAME_CONSTANTS.snake.initialVelocity,
            buffer: [],
            length,
            rows: 0,
            cols: 0,
            head: 0,
            board: {},
        }),
        [length]
    );

    const [state, dispatch] = useReducer(
        handleAction,
        handleResize(initial, rows, cols)
    );

    const controlHandler = useCallback(
        (event: string) => () => {
            const key = GAME_CONSTANTS.controls.arrowPrefix + event;

            dispatch({
                type: 'steer',
                payload: { key },
            });
        },
        []
    );

    const handleTap = useCallback(
        (event: React.PointerEvent) => {
            const { clientX, clientY } = event;
            const centerX = width / 2;
            const centerY = height / 2;

            const dx = clientX - centerX;
            const dy = clientY - centerY;
            const currentDir =
                state.buffer.length > 0
                    ? state.buffer[state.buffer.length - 1]
                    : state.velocity;

            let direction = '';
            if (Math.abs(currentDir) === 2) {
                // Moving vertically, steer horizontally
                direction = dx > 0 ? 'right' : 'left';
            } else {
                // Moving horizontally or stopped, steer vertically
                direction = dy > 0 ? 'down' : 'up';
            }

            const key = GAME_CONSTANTS.controls.arrowPrefix + direction;
            dispatch({
                type: 'steer',
                payload: { key },
            });
        },
        [dispatch, state.velocity, state.buffer, width, height]
    );

    const chooseColor = useCallback(
        (row: number, col: number) => {
            const index = row * cols + col;
            const board = state.board;
            let color = 'inherit';

            if (index in board) {
                if (board[index] > 0) color = COLORS.primary.main;
                else color = COLORS.primary.dark;
            }

            return {
                backgroundColor: color,
                boxShadow:
                    color !== 'inherit'
                        ? `0 0 1.25rem ${color.replace('hsl', 'hsla').replace(')', ', 0.25)')}`
                        : 'none',
                border:
                    color !== 'inherit' ? `0.0625rem solid ${color}` : 'none',
            };
        },
        [state, cols]
    );

    useEffect(() => {
        const wrapDispatch = () => {
            const directions = 'wasd';
            const index = getRandom(4);
            const key = directions[index];

            dispatch({
                type: 'move',
            });

            if (getRandom(2) && randomMovesRef.current) {
                dispatch({
                    type: 'steer',
                    payload: { key },
                });
            }
        };

        const wrapDirection = (event: KeyboardEvent) =>
            dispatch({
                type: 'steer',
                payload: event,
            });

        createTimer({ repeat: wrapDispatch, speed: 100 });
        createKeys(wrapDirection);
    }, [createTimer, createKeys]);

    useEffect(() => {
        randomMovesRef.current = randomMovesEnabled;
    }, [randomMovesEnabled]);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: { rows, cols },
        });
    }, [rows, cols]);

    useEffect(() => {
        document.title = PAGE_TITLES.snake;
    }, []);

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            position="relative"
            sx={{
                background: COLORS.surface.background,
                overflow: 'hidden',
                overscrollBehavior: 'none',
                touchAction: 'none',
            }}
        >
            <GlobalHeader
                showHome={true}
                infoUrl="https://en.wikipedia.org/wiki/Snake_(video_game_genre)"
            />
            <Grid
                flex={1}
                onPointerDown={handleTap}
                sx={{
                    ...COMPONENT_VARIANTS.flexCenter,
                    zIndex: 1,
                }}
            >
                <CustomGrid
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={chooseColor}
                />
            </Grid>
            <Controls
                handler={controlHandler}
                onAutoPlay={() => setRandomMovesEnabled(!randomMovesEnabled)}
                autoPlayEnabled={randomMovesEnabled}
                hide={showArrows}
            >
                <ArrowsButton
                    show={showArrows}
                    setShow={setShowArrows}
                    handler={controlHandler}
                />
            </Controls>
        </Grid>
    );
}
