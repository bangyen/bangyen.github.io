/**
 * Transforms raw Lights Out orchestration state into the five prop
 * objects consumed by the LightsOut page component. Separated from
 * `useLightsOutGame` so the orchestration hook focuses on state
 * management while this hook focuses on shaping output for the UI.
 */

import { useMemo } from 'react';

import type { BoardProps } from '../../components/Board';
import type { GameControlsProps } from '../../components/GameControls';
import type { GAME_TOKENS, GameScalingVariant } from '../../config/tokens';
import type { GamePageProps } from '../../hooks/types';
import type { DragProps } from '../../hooks/useDrag';
import type { LightsOutInfoProps as InfoProps } from '../components/LightsOutInfo';
import { LAYOUT_CONSTANTS } from '../config';
import type { Getters, Palette } from '../types';
import { getBackProps, getCellVisualProps } from '../utils/renderers';

import type { CellFactory } from '@/utils/gameUtils';
import { useCellFactory } from '@/utils/gameUtils';

// ---------------------------------------------------------------------------
// Concrete return-shape types for compile-time safety
// ---------------------------------------------------------------------------

/** Layout overrides returned by useLightsOutProps. */
interface LightsOutLayoutReturn {
    boardSx: { marginTop: string };
}

export interface LightsOutGameParams {
    rows: number;
    cols: number;
    size: number;
    mobile: boolean;
    scaling: (typeof GAME_TOKENS.scaling)[GameScalingVariant];
}

/** Info-dialog state and callbacks. */
export interface LightsOutInfoParams {
    open: boolean;
    toggleOpen: () => void;
    handleApply: (solution: number[]) => void;
}

export interface LightsOutRenderingParams {
    palette: Palette;
    getters: Getters;
    skipTransition: boolean;
}

/** Drag interaction and cell factory dependencies. */
export interface LightsOutDragParams {
    getDragProps: (pos: string) => DragProps;
    frontPropsFactory: (
        getDragProps: (pos: string) => DragProps,
        getters: Getters,
        skipTransition?: boolean,
    ) => CellFactory;
}

export interface UseLightsOutPropsParams {
    game: LightsOutGameParams;
    info: LightsOutInfoParams;
    rendering: LightsOutRenderingParams;
    drag: LightsOutDragParams;
}

/**
 * Builds the five prop bundles (`boardProps`, `controlsProps`,
 * `layoutProps`, `infoProps`, `trophyProps`) from raw orchestration
 * state.  Returns a `GamePageProps`-conformant object so every game
 * page receives a structurally consistent contract.
 */
export function useLightsOutProps({
    game: { rows, cols, size, mobile, scaling },
    info: { open, toggleOpen, handleApply },
    rendering: { palette, getters, skipTransition },
    drag: { getDragProps, frontPropsFactory },
}: UseLightsOutPropsParams) {
    const frontProps = useCellFactory(frontPropsFactory, getDragProps, [
        getters,
        skipTransition,
    ]);
    const backProps = useMemo(
        () => getBackProps(getters, skipTransition),
        [getters, skipTransition],
    );

    const boardProps = useMemo(
        () => ({
            size,
            space: 0,
            layers: [
                {
                    rows: rows - 1,
                    cols: cols - 1,
                    cellProps: backProps,
                },
                {
                    rows,
                    cols,
                    cellProps: frontProps,
                    decorative: true,
                },
            ],
        }),
        [size, rows, cols, backProps, frontProps],
    );

    const layoutProps = useMemo(
        () => ({
            boardSx: {
                marginTop: mobile
                    ? `${String(LAYOUT_CONSTANTS.OFFSET.MOBILE)}px`
                    : `${String(LAYOUT_CONSTANTS.OFFSET.DESKTOP)}px`,
            },
        }),
        [mobile],
    );

    const infoProps = useMemo(
        () => ({
            open,
            toggleOpen,
            board: { rows, cols, size },
            rendering: {
                palette,
                getFrontProps: getCellVisualProps,
                getBackProps,
            },
            onApply: handleApply,
        }),
        [open, toggleOpen, rows, cols, size, palette, handleApply],
    );

    const trophyProps = useMemo(
        () => ({
            scaling,
        }),
        [scaling],
    );

    return useMemo(
        () =>
            ({
                boardProps,
                layoutProps,
                infoProps,
                trophyProps,
            }) satisfies Omit<
                GamePageProps<
                    BoardProps,
                    GameControlsProps,
                    LightsOutLayoutReturn,
                    InfoProps
                >,
                'controlsProps'
            >,
        [boardProps, layoutProps, infoProps, trophyProps],
    );
}
