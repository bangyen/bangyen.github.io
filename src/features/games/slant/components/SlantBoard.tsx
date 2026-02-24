import { Box } from '@mui/material';
import React from 'react';

import { SlantCanvasBoard } from './SlantCanvasBoard';
import type { SlantState } from '../types';

import { InteractiveBoard } from '@/features/games/components/InteractiveBoard';

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
 * Uses SlantCanvasBoard for visuals and InteractiveBoard for standard grid layout.
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
    const space = 0.3; // rem
    const padding = size * 0.6; // matching numberSize * 1.5 = (size * 0.4) * 1.5

    const [hoveredCell, setHoveredCell] = React.useState<string | null>(null);

    return (
        <InteractiveBoard
            rows={rows}
            cols={cols}
            cellHeight={size}
            gap={space}
            padding={padding + space / 2}
            data-testid="slant-board"
            onMouseLeave={() => {
                setHoveredCell(null);
            }}
            sx={{
                '&:hover': {
                    // This is just a placeholder to ensure the Box can take events if needed
                },
            }}
            renderCanvas={() => (
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
            )}
            renderOverlayCell={(r, c) => {
                const props = (cellProps?.(r, c) ?? {}) as InteractionProps;
                const pos = `${r.toString()},${c.toString()}`;
                return (
                    <Box
                        {...props}
                        onMouseEnter={() => {
                            props.onMouseEnter?.();
                            setHoveredCell(pos);
                        }}
                        onFocus={() => {
                            props.onFocus?.();
                            setHoveredCell(pos);
                        }}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: `${(size / 4).toString()}rem`,
                            cursor: 'pointer',
                            ...props.sx,
                            backgroundColor: 'transparent',
                        }}
                    />
                );
            }}
            renderExtraOverlay={() => (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${(rows + 1).toString()}, 0)`,
                        gridTemplateColumns: `repeat(${(cols + 1).toString()}, 0)`,
                        gap: `${(size + space).toString()}rem`,
                        padding: `${padding.toString()}rem`,
                        pointerEvents: 'none',
                    }}
                >
                    {Array.from({ length: (rows + 1) * (cols + 1) }).map(
                        (_, i) => {
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
                        },
                    )}
                </Box>
            )}
        />
    );
}
