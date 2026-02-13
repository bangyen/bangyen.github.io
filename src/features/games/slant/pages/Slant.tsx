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
import { GameErrorBoundary } from '../../components/GameErrorBoundary';
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
    MOBILE_PADDING,
    DESKTOP_PADDING,
} from '../config';
import { SlantAction, SlantState, CellState, EMPTY } from '../types';
import { getInitialState, handleBoard } from '../utils/boardHandlers';
import { getBackProps, getFrontProps } from '../utils/renderers';

import { Psychology } from '@/components/icons';
import { Box } from '@/components/mui';
import { TooltipButton } from '@/components/ui/TooltipButton';
import { PAGE_TITLES } from '@/config/constants';
import { COLORS } from '@/config/theme';
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

    const { rows, cols, state, dispatch, size, handleNext, controlsProps } =
        useBaseGame<SlantState, SlantAction>({
            storageKeys: {
                size: STORAGE_KEYS.SIZE,
                state: STORAGE_KEYS.STATE,
            },
            pageTitle: PAGE_TITLES.slant,
            gridConfig: {
                defaultSize: GAME_LOGIC_CONSTANTS.DEFAULT_SIZE,
                minSize: GAME_LOGIC_CONSTANTS.MIN_SIZE,
                headerOffset: GAME_CONSTANTS.layout.headerHeight,
                paddingOffset: 120,
                widthLimit: LAYOUT_CONSTANTS.WIDTH_LIMIT,
                cellSizeReference: 4,
                mobileRowOffset: 2,
            },
            boardConfig: {
                paddingOffset: (isMobile: boolean) => ({
                    x: isMobile ? 32 : 224,
                    y: LAYOUT_CONSTANTS.PADDING_OFFSET,
                }),
                boardMaxWidth: LAYOUT_CONSTANTS.BOARD_MAX_WIDTH,
                boardSizeFactor: mobile
                    ? 0.92
                    : LAYOUT_CONSTANTS.BOARD_SIZE_FACTOR,
                maxCellSize: LAYOUT_CONSTANTS.MAX_CELL_SIZE,
                remBase: LAYOUT_CONSTANTS.REM_BASE,
                rowOffset: 1,
                colOffset: 1,
            },
            reducer: handleBoard,
            getInitialState: (rows: number, cols: number) =>
                getInitialState(rows, cols),
            winAnimationDelay: GAME_CONSTANTS.timing.winAnimationDelay,
            isSolved: (s: SlantState) => s.solved,
            persistence: {
                enabled: !isGhostMode,
                serialize: (s: SlantState) => ({
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
        onRestore: (saved: Map<string, CellState>) => {
            setGhostMoves(saved);
        },
        serialize: (m: Map<string, CellState>) => Array.from(m.entries()),
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

    const handleReset = handleNext;

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
        [state, numberSize]
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
            padding: mobile ? '1rem' : '2rem',
        }),
        [mobile]
    );

    const boardSx = useMemo(
        () => ({
            userSelect: 'none',
            padding: isGhostMode
                ? 0
                : mobile
                  ? MOBILE_PADDING
                  : DESKTOP_PADDING,
            border: '2px solid transparent',
            borderRadius: LAYOUT_CONSTANTS.CALCULATOR_BORDER_RADIUS,
        }),
        [mobile, isGhostMode]
    );

    const controls = isGhostMode ? null : (
        <GameControls {...controlsProps} disabled={isGhostMode}>
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
        <GameErrorBoundary>
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
                primaryColor={COLORS.primary.main}
                secondaryColor={COLORS.primary.main}
                boardSx={boardSx}
                onClick={() => {
                    if (isGhostMode) setIsGhostMode(false);
                }}
            >
                <Box onClick={handleBoxClick}>{boardContent}</Box>
            </GamePageLayout>
        </GameErrorBoundary>
    );
}
