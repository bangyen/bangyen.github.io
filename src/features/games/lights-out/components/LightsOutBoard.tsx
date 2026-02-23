import { Box } from '@mui/material';
import React from 'react';

import { CanvasBoard } from './CanvasBoard';
import type { Palette } from '../types';

import { CustomGrid } from '@/components/ui/CustomGrid';
import { BoardContainer } from '@/features/games/components/Board.styles';

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
 * rendering and a transparent CustomGrid overlay for interactions.
 */
export function LightsOutBoard({
    grid,
    palette,
    size,
    layers,
}: LightsOutBoardProps) {
    // The top layer (index 1) contains the interactive front cells.
    const frontLayer = layers[1];

    return (
        <BoardContainer
            data-testid="lights-out-board"
            onContextMenu={e => {
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
                        }}
                    >
                        <CustomGrid
                            rows={frontLayer.rows}
                            cols={frontLayer.cols}
                            size={size}
                            space={0}
                            cellProps={frontLayer.cellProps}
                        />
                    </Box>
                )}
            </Box>
        </BoardContainer>
    );
}
