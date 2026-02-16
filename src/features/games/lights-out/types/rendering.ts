import type React from 'react';

/** Color palette used for Lights Out cell rendering. */
export interface Palette {
    primary: string;
    secondary: string;
}

/**
 * Getter functions that drive the Lights Out cell renderer.
 *
 * Separates color/border/filler logic from the rendering layer so
 * the same getters can be reused in the example animation and the
 * calculator rows.
 */
export interface Getters {
    getColor: (
        row: number,
        col: number,
    ) => { front: string; back: string; isLit: boolean };
    getBorder: (row: number, col: number) => React.CSSProperties;
    getFiller: (row: number, col: number) => string;
}

/** Props returned by a Lights Out cell factory. */
export interface CellProps {
    children?: React.ReactNode;
    sx?: object;
    [key: string]: unknown;
}

/**
 * Factory that builds per-cell props from a `Getters` object.
 * Used by the example and info components to render cells without
 * needing direct access to game state.
 */
export type PropsFactory = (
    getters: Getters,
) => (row: number, col: number) => CellProps;
