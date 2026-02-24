import { Box } from '@mui/material';
import React from 'react';

import { CanvasBoard } from './CanvasBoard';
import type { Palette } from '../types';

import { BoardContainer } from '@/features/games/components/AnimatedBoardContainer';

interface LightsOutBoardProps {
    grid: number[][];
    palette: Palette;
    size: number;
    layers: {
        rows: number;
        cols: number;
        cellProps: (row: number, col: number) => Record<string, unknown>;
    }[];
}

/**
 * A specialized Lights Out board that uses CanvasBoard for high-performance
 * rendering and a transparent CSS grid overlay for interactions.
 */
export function LightsOutBoard({
    grid,
    palette,
    size,
    layers,
}: LightsOutBoardProps) {
    // The top layer (index 1) contains the interactive front cells.
    const frontLayer = layers[1];

    // Enhance cell props to be transparent while maintaining interaction
    const enhancedCellProps = React.useMemo(() => {
        if (!frontLayer) return;
        return (row: number, col: number) => {
            const props = frontLayer.cellProps(row, col);
            /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
            const sx = props['sx'] as any;

            return {
                ...props,
                // Preserve sx for hover/focus but ensure no background.
                // Icons (children) are only visible on hover/focus.
                ['sx']: {
                    ...sx,
                    backgroundColor: 'transparent !important',
                    color: 'transparent',
                    '&:hover': {
                        ...sx['&:hover'],
                        color: sx['&:hover']?.color ?? 'inherit',
                    },
                    '&:focus-visible': {
                        ...sx['&:focus-visible'],
                        color: sx['&:focus-visible']?.color ?? 'inherit',
                    },
                },
            };
            /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        };
    }, [frontLayer]);

    return (
        <BoardContainer
            data-testid="lights-out-board"
            onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault();
            }}
        >
            <Box sx={{ position: 'relative' }}>
                {/* Visual Canvas Layer */}
                <CanvasBoard grid={grid} palette={palette} size={size} />

                {/* Interaction Overlay Layer */}
                {frontLayer && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 1,
                            display: 'grid',
                            gridTemplateRows: `repeat(${frontLayer.rows.toString()}, 1fr)`,
                            gridTemplateColumns: `repeat(${frontLayer.cols.toString()}, 1fr)`,
                        }}
                    >
                        {Array.from({
                            length: frontLayer.rows * frontLayer.cols,
                        }).map((_, i) => {
                            const r = Math.floor(i / frontLayer.cols);
                            const c = i % frontLayer.cols;
                            const props = (enhancedCellProps?.(r, c) ?? {}) as {
                                sx?: Record<string, unknown>;
                            } & Record<string, unknown>;
                            return (
                                <Box
                                    key={`input-${i.toString()}`}
                                    {...props}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        cursor: 'pointer',
                                        ...props.sx,
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}
            </Box>
        </BoardContainer>
    );
}
