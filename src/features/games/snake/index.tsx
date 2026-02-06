import React, { useMemo, useCallback, useReducer, useEffect } from 'react';
import { Grid, keyframes } from '../../../components/mui';
import { Controls, ArrowsButton } from '../../../components/ui/Controls';

import { gridMove } from '../../interpreters/utils/gridUtils';
import { useWindow, useTimer, useKeys, useMobile } from '../../../hooks';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { PAGE_TITLES } from '../../../config/constants';
import { GAME_CONSTANTS } from '../config/gameConfig';
import { LAYOUT, COLORS, COMPONENT_VARIANTS } from '../../../config/theme';
import { handleAction, handleResize } from './logic';
import { GRID_CONFIG } from '../../interpreters/config/interpretersConfig';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { StarRounded as FoodIcon } from '../../../components/icons';
import { SNAKE_CONSTANTS } from './constants';

const pulseRotate = keyframes`
  0% { transform: scale(0.8) rotate(0deg); }
  50% { transform: scale(1.1) rotate(180deg); }
  100% { transform: scale(0.8) rotate(360deg); }
`;

export default function Snake(): React.ReactElement {
    const { create: createTimer } = useTimer(0);
    const { create: createKeys } = useKeys();
    const mobile = useMobile('sm');

    const { height, width } = useWindow();
    const length = GAME_CONSTANTS.snake.initialLength;
    const size = mobile
        ? GAME_CONSTANTS.gridSizes.mobile
        : GAME_CONSTANTS.gridSizes.desktop;

    const { rows, cols } = useMemo(() => {
        const headerOffset = mobile
            ? LAYOUT.headerHeight.xs
            : LAYOUT.headerHeight.md;
        const availableHeight = height - headerOffset;
        const pixel = size * GRID_CONFIG.calculation.pixelMultiplier;
        const rows = Math.floor(availableHeight / pixel);
        const cols = Math.floor(width / pixel);
        return { rows, cols };
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

    const handleTap = useCallback(
        (event: React.PointerEvent) => {
            const { clientX, clientY } = event;
            const centerX = width / 2;
            const centerY = height / 2;

            const dx = clientX - centerX;
            const dy = clientY - centerY;
            const currentDir =
                state.buffer.length > 0
                    ? (state.buffer[state.buffer.length - 1] ?? state.velocity)
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

    const [showControls, setShowControls] = React.useState(false);

    const handleControls = useCallback(
        (direction: string) => () => {
            const keys: Record<string, string> = {
                up: 'ArrowUp',
                down: 'ArrowDown',
                left: 'ArrowLeft',
                right: 'ArrowRight',
                'up-left': 'NorthWest',
                'up-right': 'NorthEast',
                'down-left': 'SouthWest',
                'down-right': 'SouthEast',
            };
            dispatch({
                type: 'steer',
                payload: { key: keys[direction] ?? '' },
            });
        },
        [dispatch]
    );

    const chooseColor = useCallback(
        (row: number, col: number) => {
            const index = row * cols + col;
            const board = state.board;
            let color = 'inherit';

            if (index in board) {
                const val = board[index];
                if (val !== undefined) {
                    if (val > 0) color = COLORS.primary.main;
                    else color = COLORS.primary.dark;
                }
            }

            const up = gridMove(index, -2, rows, cols);
            const down = gridMove(index, 2, rows, cols);
            const left = gridMove(index, -1, rows, cols);
            const right = gridMove(index, 1, rows, cols);

            const currentValue = board[index];
            const hasSequenceNeighbor = (neighborIndex: number) => {
                const neighborValue = board[neighborIndex];
                if (neighborValue === undefined || neighborValue === -1)
                    return false;
                if (currentValue === undefined) return false;
                return Math.abs(neighborValue - currentValue) === 1;
            };

            const hasUp = hasSequenceNeighbor(up);
            const hasDown = hasSequenceNeighbor(down);
            const hasLeft = hasSequenceNeighbor(left);
            const hasRight = hasSequenceNeighbor(right);

            const isHead = currentValue === state.length;
            const isTail = currentValue === 1;
            const isEndpoint = isHead || isTail;

            const standardRadius = `${(size / GRID_CONFIG.cellSize.divisor).toString()}rem`;
            const terminalRadius = `${(size / SNAKE_CONSTANTS.CORNER_RADIUS.TERMINAL_DIVISOR).toString()}rem`; // Slightly less than 50% for a sleeker look

            if (color === 'inherit') {
                return { backgroundColor: color };
            }

            if (currentValue === -1) {
                // Food is an icon
                return {
                    backgroundColor: 'transparent',
                    children: (
                        <FoodIcon
                            sx={{
                                color: color,
                                fontSize: `${(size * SNAKE_CONSTANTS.FOOD_SIZE_RATIO).toString()}rem`,
                                animation: `${pulseRotate} ${SNAKE_CONSTANTS.FOOD_ANIMATION_DURATION} infinite ease-in-out`,
                            }}
                        />
                    ),
                };
            }

            // Snake Body: Round ONLY outside corners and ends
            const borderRadius = [0, 0, 0, 0]; // tl, tr, br, bl

            // Corner TL: No Up and No Left
            if (!hasUp && !hasLeft) borderRadius[0] = 1;
            // Corner TR: No Up and No Right
            if (!hasUp && !hasRight) borderRadius[1] = 1;
            // Corner BR: No Down and No Right
            if (!hasDown && !hasRight) borderRadius[2] = 1;
            // Corner BL: No Down and No Left
            if (!hasDown && !hasLeft) borderRadius[3] = 1;

            const br = borderRadius
                .map(r =>
                    r ? (isEndpoint ? terminalRadius : standardRadius) : '0'
                )
                .join(' ');

            return {
                backgroundColor: color,
                boxShadow: `0 0 ${SNAKE_CONSTANTS.CORNER_RADIUS.GLOW_SIZE} ${color.replace('hsl', 'hsla').replace(')', `, ${String(SNAKE_CONSTANTS.CORNER_RADIUS.GLOW_OPACITY)})`)}`,
                borderRadius: br,
            };
        },
        [state, rows, cols, size]
    );

    useEffect(() => {
        const wrapDispatch = () => {
            dispatch({
                type: 'move',
            });
        };

        const wrapDirection = (event: KeyboardEvent) => {
            dispatch({
                type: 'steer',
                payload: event,
            });
        };

        createTimer({
            repeat: wrapDispatch,
            speed: SNAKE_CONSTANTS.TIMER_SPEED,
        });
        createKeys(wrapDirection);
    }, [createTimer, createKeys]);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: { rows, cols },
        });
    }, [rows, cols, dispatch]);

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
                    space={0}
                    cellProps={(r: number, c: number) => ({
                        ...chooseColor(r, c),
                        transition: false,
                    })}
                />
            </Grid>
            <Controls>
                <ArrowsButton
                    show={showControls}
                    setShow={setShowControls}
                    handler={handleControls}
                    diagonals={true}
                />
            </Controls>
        </Grid>
    );
}
