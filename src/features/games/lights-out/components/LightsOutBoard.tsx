import { Box } from '@mui/material';
import React from 'react';

import { CanvasBoard } from './CanvasBoard';
import type { Palette } from '../types';

import { InteractiveBoard } from '@/features/games/components/InteractiveBoard';

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
 * rendering and InteractiveBoard's transparent CSS grid overlay for interactions.
 */
export function LightsOutBoard({
    grid,
    palette,
    size,
    layers,
}: LightsOutBoardProps) {
    const frontLayer = layers[1];

    const enhancedCellProps = React.useMemo(() => {
        if (!frontLayer) return;
        return (row: number, col: number) => {
            const props = frontLayer.cellProps(row, col);
            /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
            const sx = (props['sx'] || {}) as any;

            return {
                ...props,
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

    if (!frontLayer) return null;

    return (
        <InteractiveBoard
            rows={frontLayer.rows}
            cols={frontLayer.cols}
            cellHeight={size}
            gap={0}
            padding={0}
            data-testid="lights-out-board"
            renderCanvas={() => (
                <CanvasBoard grid={grid} palette={palette} size={size} />
            )}
            renderOverlayCell={(r, c) => {
                const props = (enhancedCellProps?.(r, c) ?? {}) as {
                    sx?: Record<string, unknown>;
                } & Record<string, unknown>;
                return (
                    <Box
                        {...props}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            ...props.sx,
                        }}
                    />
                );
            }}
        />
    );
}
