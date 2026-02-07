import React, {
    useReducer,
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from 'react';
import { Box } from '../../../components/mui';
import { Psychology } from '../../../components/icons';
import { GhostCanvas } from './GhostCanvas';
import { GameControls } from '../components/GameControls';
import { CellState } from './boardHandlers';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { Board } from '../components/Board';
import { PAGE_TITLES } from '../../../config/constants';
import { COLORS } from '../../../config/theme';
import { handleBoard, getInitialState, EMPTY } from './boardHandlers';
import {
    NUMBER_SIZE_RATIO,
    STORAGE_KEYS,
    TIMING_CONSTANTS,
    LAYOUT_CONSTANTS,
    GAME_LOGIC_CONSTANTS,
    MOBILE_PADDING,
    DESKTOP_PADDING,
} from './constants';
import { SlantState } from './boardHandlers';
import { useGridSize } from '../hooks/useGridSize';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { useGameInteraction } from '../hooks/useGameInteraction';
import { useWinTransition } from '../hooks/useWinTransition';
import { usePageTitle } from '../hooks/usePageTitle';
import { GamePageLayout } from '../components/GamePageLayout';
import { getBackProps, getFrontProps } from './renderers';
import { useResponsiveBoardSize } from '../hooks/useResponsiveBoardSize';

interface SavedSlantState extends Omit<
    SlantState,
    'errorNodes' | 'cycleCells' | 'satisfiedNodes'
> {
    errorNodes: string[];
    cycleCells: string[];
    satisfiedNodes: string[];
}

export default function Slant() {
    const {
        rows,
        cols,
        handlePlus,
        handleMinus,
        mobile,
        dynamicSize,
        minSize,
        maxSize,
    } = useGridSize({
        storageKey: STORAGE_KEYS.SIZE,
        defaultSize: GAME_LOGIC_CONSTANTS.DEFAULT_SIZE,
        minSize: GAME_LOGIC_CONSTANTS.MIN_SIZE,
        headerOffset: {
            mobile: LAYOUT_CONSTANTS.HEADER_OFFSET.MOBILE,
            desktop: LAYOUT_CONSTANTS.HEADER_OFFSET.DESKTOP,
        },
        paddingOffset: 160,
        widthLimit: LAYOUT_CONSTANTS.WIDTH_LIMIT,
        cellSizeReference: 4,
        mobileRowOffset: -2,
    });

    const [isGhostMode, setIsGhostMode] = useState(false);

    const size = useResponsiveBoardSize({
        rows: rows + 1,
        cols: cols + 1,
        headerOffset: {
            mobile: LAYOUT_CONSTANTS.HEADER_OFFSET.MOBILE,
            desktop: LAYOUT_CONSTANTS.HEADER_OFFSET.DESKTOP,
        },
        paddingOffset: LAYOUT_CONSTANTS.PADDING_OFFSET,
        boardMaxWidth: LAYOUT_CONSTANTS.BOARD_MAX_WIDTH,
        boardSizeFactor: LAYOUT_CONSTANTS.BOARD_SIZE_FACTOR,
        maxCellSize: LAYOUT_CONSTANTS.MAX_CELL_SIZE,
        remBase: LAYOUT_CONSTANTS.REM_BASE,
    });

    const initial = useMemo(() => getInitialState(rows, cols), [rows, cols]);

    const [state, dispatch] = useReducer(handleBoard, initial);

    // Persistence for main game state
    useGamePersistence<SlantState>({
        storageKey: STORAGE_KEYS.STATE,
        rows,
        cols,
        state,
        enabled: !isGhostMode,
        onRestore: saved => {
            dispatch({ type: 'hydrate', state: saved });
        },
        serialize: s => ({
            ...s,
            errorNodes: Array.from(s.errorNodes),
            cycleCells: Array.from(s.cycleCells),
            satisfiedNodes: Array.from(s.satisfiedNodes),
        }),
        deserialize: (saved: unknown) => {
            const s = saved as SavedSlantState;
            return {
                ...s,
                errorNodes: new Set(s.errorNodes),
                cycleCells: new Set(s.cycleCells),
                satisfiedNodes: new Set(s.satisfiedNodes),
            } as SlantState;
        },
    });

    const [ghostMoves, setGhostMoves] = useState<Map<string, CellState>>(
        new Map()
    );

    // Persistence for ghost moves
    useGamePersistence<Map<string, CellState>>({
        storageKey: STORAGE_KEYS.GHOST_MOVES,
        rows,
        cols,
        state: ghostMoves,
        onRestore: saved => {
            setGhostMoves(saved);
        },
        serialize: m => Array.from(m.entries()),
        deserialize: (saved: unknown) =>
            new Map(saved as [string, CellState][]),
    });

    // Reset ghost moves when puzzle changes
    const lastPuzzleRef = useRef<string>('');
    useEffect(() => {
        const puzzleId = JSON.stringify(state.numbers);
        if (lastPuzzleRef.current && lastPuzzleRef.current !== puzzleId) {
            setGhostMoves(new Map());
        }
        lastPuzzleRef.current = puzzleId;
    }, [state.numbers, state.rows, state.cols]);

    usePageTitle(PAGE_TITLES.slant);

    const handleReset = useCallback(() => {
        dispatch({ type: 'new' });
    }, [dispatch]);

    useWinTransition(
        state.solved,
        handleReset,
        TIMING_CONSTANTS.WIN_ANIMATION_DELAY
    );

    const { getDragProps } = useGameInteraction({
        onToggle: (r, c, isRightClick) => {
            dispatch({
                type: 'toggle',
                row: r,
                col: c,
                reverse: isRightClick,
            });
        },
        checkEnabled: () => !state.solved,
        touchTimeout: TIMING_CONSTANTS.TOUCH_HOLD_DELAY,
    });

    const numberSize = size * NUMBER_SIZE_RATIO;

    // Props for Cells (Back Layer in Board terms)
    const backProps = useMemo(
        () => getBackProps(state, getDragProps),
        [state, getDragProps]
    );

    // Props for Numbers (Grid Overlay - Front Layer in Board terms)
    const frontProps = useMemo(
        () => getFrontProps(state, numberSize),
        [state, numberSize]
    );

    useEffect(() => {
        dispatch({
            type: 'resize',
            rows,
            cols,
        });
    }, [rows, cols]);

    const controls = isGhostMode ? (
        <></>
    ) : (
        <GameControls
            rows={rows}
            cols={cols}
            dynamicSize={dynamicSize}
            minSize={minSize}
            maxSize={maxSize}
            handlePlus={handlePlus}
            handleMinus={handleMinus}
            onRefresh={handleReset}
            disabled={isGhostMode}
        >
            <TooltipButton
                title={'Open Calculator'}
                Icon={Psychology}
                onClick={() => {
                    setIsGhostMode(!isGhostMode);
                }}
                sx={{
                    color: 'default',
                }}
            />
        </GameControls>
    );

    const handleGhostMove = useCallback((pos: string, val?: CellState) => {
        setGhostMoves(prev => {
            const next = new Map(prev);
            if (val === undefined) next.delete(pos);
            else next.set(pos, val);
            return next;
        });
    }, []);

    const handleGhostCopy = useCallback(() => {
        const newMoves = new Map<string, CellState>();
        state.grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell !== EMPTY) {
                    newMoves.set(`${String(r)},${String(c)}`, cell);
                }
            });
        });
        setGhostMoves(newMoves);
    }, [state.grid]);

    const handleGhostClear = useCallback(() => {
        setGhostMoves(new Map());
    }, []);

    const handleGhostClose = useCallback(() => {
        setIsGhostMode(false);
    }, []);

    const handleBoxClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const contentSx = useMemo(
        () => ({
            background: `radial-gradient(circle at 50% 50%, ${COLORS.surface.elevated} 0%, ${COLORS.surface.background} 100%)`,
            padding: `${String(size)}rem`,
        }),
        [size]
    );

    const boardSx = useMemo(
        () =>
            !isGhostMode
                ? {
                      userSelect: 'none',
                      padding: mobile ? MOBILE_PADDING : DESKTOP_PADDING,
                      border: '2px solid transparent',
                      borderRadius: LAYOUT_CONSTANTS.CALCULATOR_BORDER_RADIUS,
                  }
                : undefined,
        [isGhostMode, mobile]
    );

    const boardContent = isGhostMode ? (
        <GhostCanvas
            rows={rows}
            cols={cols}
            numbers={state.numbers}
            size={size}
            initialMoves={ghostMoves}
            onMove={handleGhostMove}
            onCopy={handleGhostCopy}
            onClear={handleGhostClear}
            onClose={handleGhostClose}
        />
    ) : (
        <Board
            size={size}
            rows={rows + 1}
            cols={cols + 1}
            frontProps={frontProps}
            backProps={backProps}
            frontLayerSx={{ pointerEvents: 'none' }}
        />
    );

    return (
        <GamePageLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            paddingBottom={{ xs: '180px', md: '150px' }}
            controls={controls}
            contentSx={contentSx}
            showTrophy={!isGhostMode && state.solved}
            onReset={handleReset}
            boardSize={size}
            iconSizeRatio={LAYOUT_CONSTANTS.ICON_SIZE_RATIO}
            primaryColor={COLORS.primary.main}
            secondaryColor={COLORS.primary.main}
            boardSx={boardSx}
        >
            <Box onClick={handleBoxClick}>{boardContent}</Box>
        </GamePageLayout>
    );
}
