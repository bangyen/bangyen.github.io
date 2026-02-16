import type { GameFeatureState } from '../types/gameState';

import type { BaseGameAction } from '@/utils/gameUtils';

// ---------------------------------------------------------------------------
// Shared return-shape types
// ---------------------------------------------------------------------------

/**
 * The control-bar props that `useBaseGame` returns.
 *
 * Extracted here so every game's prop-shaping hook can reference it
 * instead of re-declaring the same structural type.
 */
export interface BaseControlsProps {
    rows: number;
    cols: number;
    dynamicSize: { rows: number; cols: number };
    minSize: number;
    maxSize: number;
    handlePlus: () => void;
    handleMinus: () => void;
    onRefresh: () => void;
}

/**
 * Canonical shape returned by every game's prop-shaping hook
 * (e.g. `useLightsOutProps`, `useSlantProps`).
 *
 * Using a shared generic enforces that every game page component
 * receives the same structural contract and makes it straightforward
 * to add new games in the future.
 *
 * `trophyProps` is fixed to `TrophyOverlayProps` because every game
 * uses the same overlay component.
 */
export type GamePageProps<
    TBoard = Record<string, unknown>,
    TControls = Record<string, unknown>,
    TLayout = Record<string, unknown>,
    TInfo = Record<string, unknown>,
> = GameFeatureState<TBoard, TControls, TLayout, TInfo>;

// ---------------------------------------------------------------------------
// Config sub-interfaces for useBaseGame
// ---------------------------------------------------------------------------

/** Grid sizing -- controls how many rows/cols the game has and how they
 *  respond to viewport changes. */
export interface GridConfig {
    /** Default grid size if no saved preference (null = auto-calculated). */
    defaultSize?: number | null;
    /** Minimum allowed grid size (default: 3). */
    minSize?: number;
    /** Maximum allowed grid size (default: 10). */
    maxSize?: number;
    /** Header height offsets for available-space calculation.
     *  Defaults to GAME_CONSTANTS.layout.headerHeight. */
    headerOffset?: { mobile: number; desktop: number };
    /** Extra padding subtracted from the available viewport for grid sizing. */
    gridPadding?: number | { x: number; y: number };
    /** Maximum viewport width to consider (default: 1300px). */
    widthLimit?: number;
    /** Reference cell size in rem for calculating grid dimensions. */
    cellSizeReference?: number | { mobile: number; desktop: number };
    /** Extra rows to add on mobile devices (default: 2). */
    mobileRowOffset?: number;
}

/** Board rendering -- controls cell sizes and the board's pixel footprint. */
export interface BoardConfig {
    /** Padding subtracted from available space when computing cell size. */
    boardPadding?:
        | number
        | { x: number; y: number }
        | ((mobile: boolean) => number | { x: number; y: number });
    /** Maximum board width in pixels (default: 1200). */
    boardMaxWidth?: number;
    /** Factor to reduce available space (0-1, default: 0.94). */
    boardSizeFactor?: number;
    /** Maximum cell size in pixels. */
    maxCellSize?: number;
    /** Rem base value (default: 16). */
    remBase?: number;
    /** Extra row offset for board size calculation (e.g. +1 for Slant numbers). */
    rowOffset?: number;
    /** Extra col offset for board size calculation. */
    colOffset?: number;
}

/** Game logic -- the reducer, win condition, persistence, and callbacks
 *  that make each game unique. */
export interface GameLogicConfig<S, A> {
    /** State reducer function. */
    reducer: (state: S, action: A | BaseGameAction<S>) => S;
    /** Function to create initial state for given grid dimensions. */
    getInitialState: (rows: number, cols: number) => S;
    /** Function to check if current state is solved. */
    isSolved: (state: S) => boolean;
    /** Delay before advancing after win (ms, default: 2000). */
    winAnimationDelay?: number;
    /** Custom serialization/deserialization for persistence. */
    persistence?: {
        serialize?: (state: S) => unknown;
        deserialize?: (saved: unknown) => S;
        enabled?: boolean;
    };
    /** When true, skip the automatic resize dispatch so the consumer
     *  can handle generation asynchronously. */
    manualResize?: boolean;
    /** Optional override for the "next puzzle" callback used by win
     *  transition and refresh. */
    onNext?: () => void;
}

/**
 * Structured configuration for initializing a game with full state
 * management.  Groups concerns into `grid`, `board`, and `logic`
 * sub-objects so callers can see at a glance which fields belong
 * to which concern.
 */
export interface BaseGameConfig<S, A> {
    /** Storage key prefix -- auto-generates `{prefix}-size` and
     *  `{prefix}-state` keys. */
    storageKey: string;
    /** Grid sizing configuration (all fields optional with defaults). */
    grid?: GridConfig;
    /** Board rendering configuration (all fields optional with defaults). */
    board?: BoardConfig;
    /** Game logic -- reducer, win check, persistence, etc. */
    logic: GameLogicConfig<S, A>;
}

/**
 * The resolved board config after merging caller overrides with
 * defaults.  Used by `useBoardSize` to compute cell dimensions.
 */
export interface MergedBoardConfig {
    boardPadding:
        | number
        | { x: number; y: number }
        | ((mobile: boolean) => number | { x: number; y: number });
    boardMaxWidth: number;
    boardSizeFactor: number;
    maxCellSize: number;
    remBase: number;
    rowOffset?: number;
    colOffset?: number;
}
