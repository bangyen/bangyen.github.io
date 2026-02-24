import { Box } from '@mui/material';
import React from 'react';

import { SlantCanvasBoard } from './SlantCanvasBoard';
import type { SlantState } from '../types';

interface InteractionProps {
    sx?: Record<string, unknown>;
    onMouseEnter?: () => void;
    onFocus?: () => void;
    [key: string]: unknown;
}

export interface SlantBoardProps {
    /** Current Slant game state (or partial state for analysis). */
    state: Pick<
        SlantState,
        'grid' | 'numbers' | 'satisfiedNodes' | 'errorNodes' | 'cycleCells'
    >;
    /** Cell size in rem units. */
    size: number;
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
    /** Cell factory for the bottom (interactive slash cell) layer. */
    cellProps?: (row: number, col: number) => Record<string, unknown>;
    /** Cell factory for the top (number overlay) layer. */
    overlayProps?: (row: number, col: number) => Record<string, unknown>;
    /** Analysis mode specific props */
    cellSources?: Map<string, 'user' | 'propagated'>;
    conflictSet?: Set<string>;
    cycleCells?: Set<string>;
    nodeConflictSet?: Set<string>;
}

/**
 * Pure layout component that renders the dual-layer configuration for the Slant board.
 * Uses SlantCanvasBoard for visuals and a transparent CSS grid for interactions.
 */
export function SlantBoard({
    state,
    size,
    rows,
    cols,
    cellProps,
    overlayProps,
    cellSources,
    conflictSet,
    cycleCells,
    nodeConflictSet,
}: SlantBoardProps): React.ReactElement {
    const space = 0.3; // rem (matching SlantCanvasBoard's 0.3 * pxScale)
    const padding = size * 0.6; // matching SlantCanvasBoard's padding = numberSize * 1.5 = (size * 0.4) * 1.5

    const [hoveredCell, setHoveredCell] = React.useState<string | null>(null);

    return (
        <Box
            sx={{
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                userSelect: 'none',
            }}
            onContextMenu={e => {
                e.preventDefault();
            }}
            onMouseLeave={() => {
                setHoveredCell(null);
            }}
        >
            <Box sx={{ gridArea: '1/1' }}>
                <SlantCanvasBoard
                    grid={state.grid}
                    numbers={state.numbers}
                    satisfiedNodes={state.satisfiedNodes}
                    activeCell={hoveredCell}
                    size={size}
                    cellSources={cellSources}
                    conflictSet={conflictSet}
                    cycleCells={cycleCells ?? state.cycleCells}
                    nodeConflictSet={nodeConflictSet ?? state.errorNodes}
                />
            </Box>

            {/* Interaction Overlay: Slashes (rows x cols) */}
            <Box
                sx={{
                    gridArea: '1/1',
                    display: 'grid',
                    gridTemplateRows: `repeat(${rows.toString()}, ${size.toString()}rem)`,
                    gridTemplateColumns: `repeat(${cols.toString()}, ${size.toString()}rem)`,
                    gap: `${space.toString()}rem`,
                    padding: `${(padding + space / 2).toString()}rem`,
                    zIndex: 1,
                    pointerEvents: 'auto',
                }}
            >
                {Array.from({ length: rows * cols }).map((_, i) => {
                    const r = Math.floor(i / cols);
                    const c = i % cols;
                    const props = (cellProps?.(r, c) ?? {}) as InteractionProps;
                    const pos = `${r.toString()},${c.toString()}`;

                    const interactionProps = props;

                    return (
                        <Box
                            key={`cell-${r.toString()}-${c.toString()}`}
                            {...props}
                            onMouseEnter={() => {
                                interactionProps.onMouseEnter?.();
                                setHoveredCell(pos);
                            }}
                            onFocus={() => {
                                interactionProps.onFocus?.();
                                setHoveredCell(pos);
                            }}
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: `${(size / 4).toString()}rem`,
                                cursor: 'pointer',
                                ...props.sx,
                                backgroundColor: 'transparent',
                            }}
                        />
                    );
                })}
            </Box>

            {/* Decorative Overlay: Hints (rows+1 x cols+1) */}
            <Box
                sx={{
                    gridArea: '1/1',
                    display: 'grid',
                    gridTemplateRows: `repeat(${(rows + 1).toString()}, 0)`,
                    gridTemplateColumns: `repeat(${(cols + 1).toString()}, 0)`,
                    gap: `${(size + space).toString()}rem`,
                    padding: `${padding.toString()}rem`,
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            >
                {Array.from({ length: (rows + 1) * (cols + 1) }).map((_, i) => {
                    const r = Math.floor(i / (cols + 1));
                    const c = i % (cols + 1);
                    const props = (overlayProps?.(r, c) ??
                        {}) as InteractionProps;
                    return (
                        <Box
                            key={`hint-${r.toString()}-${c.toString()}`}
                            {...props}
                            role="presentation"
                            aria-hidden="true"
                            sx={{
                                width: '0',
                                height: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...props.sx,
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}
