import { Box, styled, type SxProps, type Theme } from '@mui/material';
import React from 'react';

export const BoardOuterWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    width: '100%',
    maxWidth: 'max-content',
    margin: '0 auto',
    willChange: 'transform, opacity',
    animation: 'board-pop-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '@keyframes board-pop-in': {
        '0%': { transform: 'scale(0.95)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 },
    },
});

const RelativeWrapper = styled(Box)({
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    gridArea: '1/1',
});

interface InteractiveBoardProps {
    /** Total rows in the interaction grid. */
    rows: number;
    /** Total columns in the interaction grid. */
    cols: number;
    /** height of a cell in rem. */
    cellHeight: number;
    /** width of a cell in rem (defaults to cellHeight). */
    cellWidth?: number;
    /** Gap between cells in rem. */
    gap: number;
    /** Padding around the grid in rem. */
    padding: number;
    /** Function to render the canvas layer. */
    renderCanvas: () => React.ReactNode;
    /** Function to render individual interaction cells. */
    renderOverlayCell: (
        row: number,
        col: number,
        index: number,
    ) => React.ReactNode;
    /** Optional secondary overlay (e.g. for Slant nodes). */
    renderExtraOverlay?: () => React.ReactNode;
    /** Optional test ID. */
    'data-testid'?: string;
    /** Optional mouse leave handler. */
    onMouseLeave?: () => void;
    /** Optional styles for the wrapper. */
    sx?: SxProps<Theme>;
}

/**
 * A standardized layout for canvas-based boards with interaction overlays.
 * Consolidates animation and base layout into a single, direct component.
 */
export function InteractiveBoard({
    rows,
    cols,
    cellHeight,
    cellWidth,
    gap,
    padding,
    renderCanvas,
    renderOverlayCell,
    renderExtraOverlay,
    'data-testid': testId,
    onMouseLeave,
    sx,
}: InteractiveBoardProps) {
    const w = cellWidth ?? cellHeight;
    const h = cellHeight;

    return (
        <BoardOuterWrapper
            data-testid={testId}
            sx={sx}
            onContextMenu={e => {
                e.preventDefault();
            }}
            onMouseLeave={onMouseLeave}
        >
            <RelativeWrapper>
                {/* Visual Canvas Layer */}
                <Box sx={{ gridArea: '1/1' }}>{renderCanvas()}</Box>

                {/* Interaction Overlay Layer */}
                <Box
                    sx={{
                        gridArea: '1/1',
                        display: 'grid',
                        gridTemplateRows: `repeat(${rows.toString()}, ${h.toString()}rem)`,
                        gridTemplateColumns: `repeat(${cols.toString()}, ${w.toString()}rem)`,
                        gap: `${gap.toString()}rem`,
                        padding: `${padding.toString()}rem`,
                        zIndex: 1,
                        pointerEvents: 'auto',
                    }}
                >
                    {Array.from({ length: rows * cols }).map((_, i) => {
                        const r = Math.floor(i / cols);
                        const c = i % cols;
                        return (
                            <Box
                                key={`cell-${r.toString()}-${c.toString()}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                {renderOverlayCell(r, c, i)}
                            </Box>
                        );
                    })}
                </Box>

                {/* Optional Extra Overlay Layer (Hints, etc) */}
                {renderExtraOverlay && (
                    <Box
                        sx={{
                            gridArea: '1/1',
                            position: 'relative',
                            zIndex: 2,
                            pointerEvents: 'none',
                        }}
                    >
                        {renderExtraOverlay()}
                    </Box>
                )}
            </RelativeWrapper>
        </BoardOuterWrapper>
    );
}
