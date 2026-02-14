import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from 'react';

import { useMobile } from '../../../../hooks';
import { Board } from '../../components/Board';
import { GameControls } from '../../components/GameControls';
import { GamePageLayout } from '../../components/GamePageLayout';
import { GAME_CONSTANTS } from '../../config';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useGameInteraction } from '../../hooks/useGameInteraction';
import { useGamePersistence } from '../../hooks/useGamePersistence';
import { GhostCanvas } from '../components/GhostCanvas';
import {
    NUMBER_SIZE_RATIO,
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
    GAME_LOGIC_CONSTANTS,
} from '../config';
import { useGenerationWorker } from '../hooks/useGenerationWorker';
import type { SlantAction, SlantState, CellState } from '../types';
import { EMPTY } from '../types';
import { getInitialState, handleBoard } from '../utils/boardHandlers';
import { getBackProps, getFrontProps } from '../utils/renderers';

import { Psychology } from '@/components/icons';
import { Box } from '@/components/mui';
import { TooltipButton } from '@/components/ui/TooltipButton';
import { PAGE_TITLES } from '@/config/constants';
import { useCellFactory, getPosKey } from '@/utils/gameUtils';
import { createCellIndex } from '@/utils/types';

interface SavedSlantState extends Omit<
    SlantState,
    'errorNodes' | 'cycleCells' | 'satisfiedNodes'
> {
    errorNodes: string[];
    cycleCells: string[];
    satisfiedNodes: string[];
}

export default function Slant() {
    const mobile = useMobile('sm');
    const [isGhostMode, setIsGhostMode] = useState(false);

    // Refs kept in sync with useBaseGame output, shared with the worker hook.
    const dispatchRef = useRef<React.Dispatch<
        SlantAction | { type: 'hydrate'; state: SlantState }
    > | null>(null);
    const dimsRef = useRef({ rows: 0, cols: 0 });

    const { generating, requestGeneration, handleNextAsync } =
        useGenerationWorker({
            getInitialState,
            dispatchRef,
            dimsRef,
        });

    const { rows, cols, state, dispatch, size, controlsProps } = useBaseGame<
        SlantState,
        SlantAction
    >({
        storageKeys: {
            size: STORAGE_KEYS.SIZE,
            state: STORAGE_KEYS.STATE,
        },
        pageTitle: PAGE_TITLES.slant,
        gridConfig: {
            defaultSize: GAME_LOGIC_CONSTANTS.DEFAULT_SIZE,
            maxSize: GAME_LOGIC_CONSTANTS.MAX_SIZE,
            paddingOffset: {
                x: mobile ? 48 : 80,
                y: 120,
            },
            widthLimit: LAYOUT_CONSTANTS.WIDTH_LIMIT,
            cellSizeReference: 4,
        },
        boardConfig: {
            paddingOffset: (isMobile: boolean) => ({
                x: isMobile ? 48 : 80,
                y: LAYOUT_CONSTANTS.PADDING_OFFSET,
            }),
            ...(mobile ? { boardSizeFactor: 0.92 } : {}),
            maxCellSize: LAYOUT_CONSTANTS.MAX_CELL_SIZE,
            rowOffset: 1,
            colOffset: 1,
        },
        reducer: handleBoard,
        getInitialState: (rows: number, cols: number) =>
            getInitialState(rows, cols),
        manualResize: true,
        onNext: handleNextAsync,
        winAnimationDelay: GAME_CONSTANTS.timing.winAnimationDelay,
        isSolved: (s: SlantState) => s.solved,
        persistence: {
            enabled: !isGhostMode,
            serialize: (s: SlantState) => ({
                ...s,
                errorNodes: [...s.errorNodes],
                cycleCells: [...s.cycleCells],
                satisfiedNodes: [...s.satisfiedNodes],
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
        },
    });

    // Keep refs in sync with latest values from useBaseGame.
    dispatchRef.current = dispatch;
    dimsRef.current = { rows, cols };

    // Request a new puzzle from the worker whenever grid dimensions change.
    const prevDimsRef = useRef<string>(`${String(rows)},${String(cols)}`);
    useEffect(() => {
        const key = `${String(rows)},${String(cols)}`;
        if (key === prevDimsRef.current) return;
        prevDimsRef.current = key;
        requestGeneration(rows, cols);
    }, [rows, cols, requestGeneration]);

    const [ghostMoves, setGhostMoves] = useState<Map<string, CellState>>(
        new Map(),
    );

    // Persistence for ghost moves
    useGamePersistence<Map<string, CellState>>({
        storageKey: STORAGE_KEYS.GHOST_MOVES,
        rows,
        cols,
        state: ghostMoves,
        onRestore: (saved: Map<string, CellState>) => {
            setGhostMoves(saved);
        },
        serialize: (m: Map<string, CellState>) => [...m.entries()],
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

    const handleReset = handleNextAsync;

    const { getDragProps } = useGameInteraction({
        onToggle: (r: number, c: number, isRightClick: boolean) => {
            dispatch({
                type: 'toggle',
                row: createCellIndex(r),
                col: createCellIndex(c),
                reverse: isRightClick,
            });
        },
        checkEnabled: () => !state.solved,
        touchTimeout: GAME_CONSTANTS.timing.touchHoldDelay,
    });

    const numberSize = size * NUMBER_SIZE_RATIO;

    // Props for Cells (Back Layer in Board terms)
    const backProps = useCellFactory(getBackProps, getDragProps, [state, size]);

    // Props for Numbers (Grid Overlay - Front Layer in Board terms)
    const frontProps = useMemo(
        () => getFrontProps(state, numberSize),
        [state, numberSize],
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
        state.grid.forEach((row: CellState[], r: number) => {
            row.forEach((cell: CellState, c: number) => {
                if (cell !== EMPTY) {
                    newMoves.set(getPosKey(r, c), cell);
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
            px: mobile ? '1rem' : '2rem',
            pt: mobile ? '1rem' : '2rem',
        }),
        [mobile],
    );

    // Use a responsive override to fully clear GamePageLayout's responsive
    // base padding ({ xs: '30px', sm: '36px' }) when in ghost mode.
    // A plain `padding: 0` does not override the `sm` media query.
    const boardSx = useMemo(
        () => (isGhostMode ? { padding: { xs: 0, sm: 0 } } : undefined),
        [isGhostMode],
    );

    const controls = isGhostMode ? null : (
        <GameControls
            {...controlsProps}
            onRefresh={handleNextAsync}
            disabled={generating}
        >
            <TooltipButton
                title="Open Calculator"
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

    // Cell factories for the loading skeleton — subtle filled cells that
    // pulse to indicate the board is generating.  No width/height override;
    // the Cell component already sizes itself from the `size` prop.
    const skeletonBack = useCallback(
        () => ({
            sx: {
                backgroundColor: 'var(--border)',
            },
        }),
        [],
    );

    const skeletonFront = useCallback(() => ({}), []);

    // True when grid dimensions have changed but the worker hasn't
    // delivered a new puzzle yet. Without this guard the real board
    // renders one frame with mismatched state/grid dimensions,
    // causing cells to reference out-of-bounds indices and vanish.
    const dimensionsMismatch = rows !== state.rows || cols !== state.cols;

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
    ) : generating || dimensionsMismatch ? (
        <Box
            sx={{
                '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.4 },
                    '50%': { opacity: 0.15 },
                },
                animation: 'pulse 1.4s ease-in-out infinite',
            }}
        >
            <Board
                size={size}
                rows={rows + 1}
                cols={cols + 1}
                frontProps={skeletonFront}
                backProps={skeletonBack}
                frontLayerSx={{ pointerEvents: 'none' }}
            />
        </Box>
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
            paddingBottom={{ xs: '120px', md: '150px' }}
            controls={controls}
            contentSx={contentSx}
            showTrophy={!isGhostMode && state.solved}
            onReset={handleReset}
            boardSize={size}
            iconSizeRatio={LAYOUT_CONSTANTS.ICON_SIZE_RATIO}
            boardSx={boardSx}
            onClick={
                isGhostMode
                    ? () => {
                          setIsGhostMode(false);
                      }
                    : undefined
            }
        >
            <Box onClick={handleBoxClick}>{boardContent}</Box>
        </GamePageLayout>
    );
}
