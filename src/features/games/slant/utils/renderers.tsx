import { Box, type SxProps, type Theme } from '@mui/material';
import React, { memo } from 'react';

import { getBackVisualProps, getFrontProps } from './renderers.logic';
import {
    backCellVisualSx,
    frontOverlaySx,
    INTERACTIVE_BACK_CELL_SX,
} from './renderers.styles';
import type { SlantState } from '../types';

import type { CellProps } from '@/components/ui/CustomGrid';
import { getPosKey } from '@/utils/gameUtils';

/**
 * Component-based cell renderer for the back (slash) layer.
 * Consumes the same props as a standard grid cell but adds Slant-specific logic
 * and fine-grained memoization to prevent unnecessary re-renders.
 */
export const SlantSlashCell = memo(
    function SlantSlashCell({
        row,
        col,
        size,
        state,
        isInteractive = false,
        ...rest
    }: CellProps & {
        row: number;
        col: number;
        size: number;
        state?: SlantState;
        isInteractive?: boolean;
    }) {
        if (!state) return <Box {...rest} sx={backCellVisualSx} />;

        const visualProps = getBackVisualProps(state, size)(row, col);

        const sx: SxProps<Theme> = {
            ...(visualProps.sx as Record<string, unknown>),
            ...(isInteractive ? INTERACTIVE_BACK_CELL_SX : {}),
            ...(rest.sx as Record<string, unknown>),
        } as SxProps<Theme>;

        return (
            <Box {...rest} aria-label={visualProps['aria-label']} sx={sx}>
                {visualProps.children}
            </Box>
        );
    },
    (prev, next) => {
        if (
            prev.row !== next.row ||
            prev.col !== next.col ||
            prev.size !== next.size ||
            prev.isInteractive !== next.isInteractive
        )
            return false;

        if (!prev.state || !next.state) return prev.state === next.state;

        // Cell value and loop error
        const pos = getPosKey(prev.row, prev.col);
        if (
            prev.state.grid[prev.row]?.[prev.col] !==
            next.state.grid[next.row]?.[next.col]
        )
            return false;
        if (prev.state.cycleCells.has(pos) !== next.state.cycleCells.has(pos))
            return false;

        // Accessibility/Aria check: clues affect aria-label
        const neighbors = [
            [0, 0] as const,
            [0, 1] as const,
            [1, 0] as const,
            [1, 1] as const,
        ];
        for (const [dr, dc] of neighbors) {
            const nr = prev.row + dr;
            const nc = prev.col + dc;
            const npos = getPosKey(nr, nc);
            if (
                prev.state.numbers[nr]?.[nc] !== next.state.numbers[nr]?.[nc] ||
                prev.state.errorNodes.has(npos) !==
                    next.state.errorNodes.has(npos) ||
                prev.state.satisfiedNodes.has(npos) !==
                    next.state.satisfiedNodes.has(npos)
            )
                return false;
        }

        return true;
    },
);

/**
 * Component-based cell renderer for the front (number hint) layer.
 * Includes fine-grained memoization.
 */
export const SlantHintCell = memo(
    function SlantHintCell({
        row,
        col,
        size,
        state,
        ...rest
    }: CellProps & {
        row: number;
        col: number;
        size: number;
        state?: SlantState;
    }) {
        if (!state) return <Box {...rest} sx={frontOverlaySx} />;

        // Matching NUMBER_SIZE_RATIO roughly (0.4)
        const numberSize = size * 0.4;
        const visualProps = getFrontProps(state, numberSize)(row, col);

        const sx: SxProps<Theme> = {
            ...(visualProps.sx as Record<string, unknown>),
            ...(rest.sx as Record<string, unknown>),
        } as SxProps<Theme>;

        return (
            <Box {...rest} sx={sx}>
                {visualProps.children}
            </Box>
        );
    },
    (prev, next) => {
        if (
            prev.row !== next.row ||
            prev.col !== next.col ||
            prev.size !== next.size
        )
            return false;

        if (!prev.state || !next.state) return prev.state === next.state;

        const pos = getPosKey(prev.row, prev.col);
        if (
            prev.state.numbers[prev.row]?.[prev.col] !==
                next.state.numbers[next.row]?.[next.col] ||
            prev.state.errorNodes.has(pos) !== next.state.errorNodes.has(pos) ||
            prev.state.satisfiedNodes.has(pos) !==
                next.state.satisfiedNodes.has(pos)
        )
            return false;

        return true;
    },
);
