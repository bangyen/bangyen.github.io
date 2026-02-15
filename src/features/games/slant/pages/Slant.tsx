import { Box, Button } from '@mui/material';
import React, {
    useEffect,
    useMemo,
    useCallback,
    useReducer,
    useRef,
} from 'react';

import { useMobile } from '../../../../hooks';
import { GameControls } from '../../components/GameControls';
import { GameInfo } from '../../components/GameInfo';
import { GamePageLayout } from '../../components/GamePageLayout';
import { GAME_CONSTANTS } from '../../config';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import Example from '../components/Example';
import { SlantBoardContent } from '../components/SlantBoardContent';
import {
    getSlantGameConfig,
    SLANT_INFO_TITLES,
    SLANT_INSTRUCTIONS,
    SLANT_INFO_CARD_SX,
    slantInfoContentSx,
} from '../config';
import {
    NUMBER_SIZE_RATIO,
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
} from '../constants';
import { useGenerationWorker } from '../hooks/useGenerationWorker';
import { useGhostMode } from '../hooks/useGhostMode';
import type { SlantAction, SlantState } from '../types';
import { getInitialState, handleBoard } from '../utils/boardHandlers';
import { getBackProps, getFrontProps } from '../utils/renderers';

import { Psychology } from '@/components/icons';
import { PAGE_TITLES } from '@/config/constants';
import { COLORS } from '@/config/theme';
import { useCellFactory } from '@/utils/gameUtils';
import { createCellIndex } from '@/utils/types';

// Note: Slant intentionally uses useBaseGame + useDrag (grid mode) directly
// (rather than the composed useGamePage) because its worker-based generation
// and ghost-mode features require access to dispatch/state refs before the
// interaction hook runs.

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
    const [isGhostMode, setIsGhostMode] = React.useState(false);
    const [infoOpen, toggleInfo] = useReducer((v: boolean) => !v, false);

    // Refs kept in sync with useBaseGame output, shared with the worker hook.
    const dispatchRef = useRef<React.Dispatch<
        SlantAction | { type: 'hydrate'; state: SlantState }
    > | null>(null);
    const dimsRef = useRef({ rows: 0, cols: 0 });

    // Save a worker result that arrived for a size the user already left.
    // Lets the background generation persist so the puzzle is ready when
    // the user switches back instead of regenerating from scratch.
    const handleStaleResult = useCallback(
        (staleState: SlantState, r: number, c: number) => {
            if (isGhostMode) return;
            const persistKey = `${STORAGE_KEYS.STATE}-${String(r)}x${String(c)}`;
            const serialized = {
                ...staleState,
                errorNodes: [...staleState.errorNodes],
                cycleCells: [...staleState.cycleCells],
                satisfiedNodes: [...staleState.satisfiedNodes],
            };
            localStorage.setItem(persistKey, JSON.stringify(serialized));
        },
        [isGhostMode],
    );

    const {
        generating,
        requestGeneration,
        handleNextAsync,
        prefetch,
        cancelGeneration,
    } = useGenerationWorker({
        getInitialState,
        dispatchRef,
        dimsRef,
        onStaleResult: handleStaleResult,
    });

    const { rows, cols, state, dispatch, size, controlsProps } = useBaseGame<
        SlantState,
        SlantAction
    >({
        ...getSlantGameConfig(mobile),
        reducer: handleBoard,
        getInitialState: (rows: number, cols: number) =>
            getInitialState(rows, cols),
        onNext: handleNextAsync,
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

    // Ghost mode state and handlers.
    const {
        ghostMoves,
        boardSx,
        handleGhostMove,
        handleGhostCopy,
        handleGhostClear,
        handleGhostClose,
        handleBoxClick,
        handleOpenCalculator,
    } = useGhostMode({
        isGhostMode,
        setIsGhostMode,
        state,
        rows,
        cols,
        storageKey: STORAGE_KEYS.GHOST_MOVES,
        toggleInfo,
    });

    // Request a new puzzle from the worker whenever grid dimensions change,
    // unless there is already an unsolved puzzle saved for the new size.
    const prevDimsRef = useRef<string>(`${String(rows)},${String(cols)}`);
    useEffect(() => {
        const key = `${String(rows)},${String(cols)}`;
        if (key === prevDimsRef.current) return;
        prevDimsRef.current = key;

        // When persistence is active, check if there is a saved unsolved
        // puzzle for the new dimensions.  If so, cancel any in-flight
        // generation and let useGamePersistence restore the cached state.
        if (!isGhostMode) {
            const persistKey = `${STORAGE_KEYS.STATE}-${String(rows)}x${String(cols)}`;
            const saved = localStorage.getItem(persistKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as { solved?: boolean };
                    if (!parsed.solved) {
                        cancelGeneration();
                        return;
                    }
                } catch {
                    // Invalid JSON — fall through to regeneration
                }
            }
        }

        requestGeneration(rows, cols);
    }, [rows, cols, requestGeneration, cancelGeneration, isGhostMode]);

    // Prefetch the next puzzle as soon as the current one is solved so
    // generation overlaps with the win animation instead of waiting.
    useEffect(() => {
        if (state.solved && !isGhostMode) {
            prefetch(rows, cols);
        }
    }, [state.solved, isGhostMode, rows, cols, prefetch]);

    const { getDragProps } = useDrag({
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

    const contentSx = useMemo(
        () => ({
            px: mobile ? '1rem' : '2rem',
            pt: mobile ? '1rem' : '2rem',
        }),
        [mobile],
    );

    const controls = (
        <GameControls
            {...controlsProps}
            onRefresh={handleNextAsync}
            disabled={generating}
            onOpenInfo={toggleInfo}
            hidden={isGhostMode}
        />
    );

    // True when grid dimensions have changed but the worker hasn't
    // delivered a new puzzle yet. Without this guard the real board
    // renders one frame with mismatched state/grid dimensions,
    // causing cells to reference out-of-bounds indices and vanish.
    const dimensionsMismatch = rows !== state.rows || cols !== state.cols;

    const boardContent = (
        <SlantBoardContent
            isGhostMode={isGhostMode}
            generating={generating}
            dimensionsMismatch={dimensionsMismatch}
            rows={rows}
            cols={cols}
            state={state}
            size={size}
            ghostMoves={ghostMoves}
            onGhostMove={handleGhostMove}
            onGhostCopy={handleGhostCopy}
            onGhostClear={handleGhostClear}
            onGhostClose={handleGhostClose}
            overlayProps={frontProps}
            cellProps={backProps}
        />
    );

    return (
        <GamePageLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            paddingBottom={{ xs: '120px', md: '150px' }}
            controls={controls}
            contentSx={contentSx}
            trophyProps={{
                show: !isGhostMode && state.solved,
                onReset: handleNextAsync,
                boardSize: size,
                iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
            }}
            boardSx={boardSx}
            onClick={isGhostMode ? handleGhostClose : undefined}
        >
            <Box onClick={handleBoxClick}>{boardContent}</Box>
            {infoOpen && (
                <GameInfo
                    open={infoOpen}
                    toggleOpen={toggleInfo}
                    titles={SLANT_INFO_TITLES}
                    instructions={SLANT_INSTRUCTIONS}
                    instructionsFooter={
                        <Box
                            sx={{
                                display: 'flex',
                                px: 2,
                                ml: { xs: 5, sm: 4 },
                                pt: { xs: 0, sm: 3 },
                                mt: { xs: -2, sm: 0 },
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<Psychology />}
                                onClick={handleOpenCalculator}
                                sx={{
                                    borderColor: COLORS.border.subtle,
                                    color: COLORS.text.secondary,
                                }}
                            >
                                Open Calculator
                            </Button>
                        </Box>
                    }
                    exampleContent={<Example size={5} />}
                    cardSx={SLANT_INFO_CARD_SX}
                    contentSxOverride={slantInfoContentSx}
                />
            )}
        </GamePageLayout>
    );
}
