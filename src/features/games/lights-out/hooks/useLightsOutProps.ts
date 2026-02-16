/**
 * Transforms raw Lights Out orchestration state into the five prop
 * objects consumed by the LightsOut page component. Separated from
 * `useLightsOutGame` so the orchestration hook focuses on state
 * management while this hook focuses on shaping output for the UI.
 */

import { useMemo } from 'react';

import type { DragProps } from '../../hooks/useDrag';
import { LAYOUT_CONSTANTS } from '../config';
import type { Getters } from '../types';
import { getBackProps, getExampleProps } from '../utils/renderers';

import type { CellFactory } from '@/utils/gameUtils';
import { useCellFactory } from '@/utils/gameUtils';

export interface Palette {
    primary: string;
    secondary: string;
}

export interface UseLightsOutPropsParams {
    /** Grid row count. */
    rows: number;
    /** Grid column count. */
    cols: number;
    /** Cell size in rem units. */
    size: number;
    /** Whether the board is solved. */
    solved: boolean;
    /** Trigger the next puzzle generation. */
    handleNext: () => void;
    /** Base game controls props from useBaseGame. */
    controlsProps: {
        rows: number;
        cols: number;
        dynamicSize: { rows: number; cols: number };
        minSize: number;
        maxSize: number;
        handlePlus: () => void;
        handleMinus: () => void;
        onRefresh: () => void;
    };
    /** Info dialog open state. */
    open: boolean;
    /** Toggle info dialog. */
    toggleOpen: () => void;
    /** Apply a calculator solution to the board. */
    handleApply: (solution: number[]) => void;
    /** Colour palette based on score. */
    palette: Palette;
    /** Whether every cell is lit. */
    allOn: boolean;
    /** Cell colour/state getters. */
    getters: Getters;
    /** Whether to skip CSS transitions (e.g. after resize). */
    skipTransition: boolean;
    /** Drag interaction factory. */
    getDragProps: (pos: string) => DragProps;
    /** Whether the device is mobile. */
    mobile: boolean;
    /** Front (interactive) cell prop factory passed to useCellFactory. */
    frontPropsFactory: (
        getDragProps: (pos: string) => DragProps,
        getters: Getters,
        skipTransition?: boolean,
    ) => CellFactory;
}

/**
 * Builds the five prop bundles (`boardProps`, `controlsProps`,
 * `layoutProps`, `infoProps`, `trophyProps`) from raw orchestration
 * state.
 */
export function useLightsOutProps({
    rows,
    cols,
    size,
    solved,
    handleNext,
    controlsProps,
    open,
    toggleOpen,
    handleApply,
    palette,
    allOn,
    getters,
    skipTransition,
    getDragProps,
    mobile,
    frontPropsFactory,
}: UseLightsOutPropsParams) {
    const frontProps = useCellFactory(frontPropsFactory, getDragProps, [
        getters,
        skipTransition,
    ]);
    const backProps = useMemo(
        () => getBackProps(getters, skipTransition),
        [getters, skipTransition],
    );

    return {
        boardProps: {
            size,
            rows,
            cols,
            cellRows: rows - 1,
            cellCols: cols - 1,
            overlayProps: frontProps,
            cellProps: backProps,
        },
        controlsProps: {
            ...controlsProps,
            onOpenInfo: toggleOpen,
        },
        layoutProps: {
            boardSx: {
                marginTop: mobile
                    ? `${String(LAYOUT_CONSTANTS.OFFSET.MOBILE)}px`
                    : `${String(LAYOUT_CONSTANTS.OFFSET.DESKTOP)}px`,
            },
        },
        infoProps: {
            rows,
            cols,
            size,
            open,
            palette,
            toggleOpen,
            onApply: handleApply,
            getFrontProps: getExampleProps,
            getBackProps,
        },
        trophyProps: {
            show: solved,
            onReset: handleNext,
            size,
            iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
            primaryColor: palette.primary,
            secondaryColor: palette.secondary,
            useSecondary: allOn,
        },
    };
}
