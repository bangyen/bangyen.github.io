import React, { useEffect, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { COLORS } from '../../../config/theme';
import { FORWARD, BACKWARD, EMPTY, CellState } from './boardHandlers';
import { CustomGrid } from '../../../components/ui/CustomGrid';

interface GhostBoardProps {
    rows: number;
    cols: number;
    numbers: (number | null)[][];
    size: number;
    initialMoves: Map<string, CellState>;
    onMove: (pos: string, val: CellState | undefined) => void;
}

type CellSource = 'user' | 'propagated';
interface CellInfo {
    state: CellState;
    source: CellSource;
}

interface Conflict {
    type: 'cell' | 'node';
    r: number;
    c: number;
}

export const GhostCanvas: React.FC<GhostBoardProps> = ({
    rows,
    cols,
    numbers,
    size,
    initialMoves,
    onMove,
}) => {
    // User inputs: just strict assignments
    const userMoves = initialMoves;

    // Computed state
    const [gridState, setGridState] = useState<Map<string, CellInfo>>(
        new Map()
    );
    const [conflicts, setConflicts] = useState<Conflict[]>([]);

    // Engine
    useEffect(() => {
        const newGrid = new Map<string, CellInfo>();
        const queue: { r: number; c: number }[] = [];
        const newConflicts: Conflict[] = [];

        // 1. Initialize with User Moves
        userMoves.forEach((state: CellState, pos: string) => {
            newGrid.set(pos, { state, source: 'user' });
            const [r, c] = pos.split(',').map(Number);
            if (r !== undefined && c !== undefined) {
                queue.push({ r, c });
            }
        });

        // Helper to get current cell state
        const getCell = (r: number, c: number): CellState => {
            if (r < 0 || r >= rows || c < 0 || c >= cols) return EMPTY;
            const pos = `${String(r)},${String(c)}`;
            return newGrid.get(pos)?.state ?? EMPTY;
        };

        const setCell = (
            r: number,
            c: number,
            state: CellState,
            source: CellSource
        ) => {
            const pos = `${String(r)},${String(c)}`;
            const existing = newGrid.get(pos);

            if (existing) {
                if (existing.state !== state) {
                    newConflicts.push({ type: 'cell', r, c });
                }
                return; // Already set
            }

            newGrid.set(pos, { state, source });
            if (source === 'user') {
                queue.push({ r, c });
            }
        };

        const getNodeNeighbors = (nr: number, nc: number) => {
            return [
                { r: nr - 1, c: nc - 1, required: BACKWARD }, // TL
                { r: nr - 1, c: nc, required: FORWARD }, // TR
                { r: nr, c: nc - 1, required: FORWARD }, // BL
                { r: nr, c: nc, required: BACKWARD }, // BR
            ].filter(n => n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols);
        };

        let pointer = 0;

        while (pointer < queue.length) {
            const current = queue[pointer++];
            if (!current) break;
            const { r: cr, c: cc } = current;

            const nodesToCheck = [
                { r: cr, c: cc },
                { r: cr, c: cc + 1 },
                { r: cr + 1, c: cc },
                { r: cr + 1, c: cc + 1 },
            ];

            for (const node of nodesToCheck) {
                const limit = numbers[node.r]?.[node.c];
                if (limit === null || limit === undefined) continue;

                const neighbors = getNodeNeighbors(node.r, node.c);

                let connected = 0;
                const unknowns: typeof neighbors = [];

                for (const nb of neighbors) {
                    const val = getCell(nb.r, nb.c);
                    if (val === EMPTY) {
                        unknowns.push(nb);
                    } else if (val === nb.required) {
                        connected++;
                    }
                }

                if (connected > limit) {
                    newConflicts.push({ type: 'node', r: node.r, c: node.c });
                    continue;
                }

                if (connected + unknowns.length < limit) {
                    newConflicts.push({ type: 'node', r: node.r, c: node.c });
                    continue;
                }

                if (connected === limit && unknowns.length > 0) {
                    for (const unk of unknowns) {
                        const forced =
                            unk.required === FORWARD ? BACKWARD : FORWARD;
                        setCell(unk.r, unk.c, forced, 'propagated');
                    }
                } else if (
                    connected + unknowns.length === limit &&
                    unknowns.length > 0
                ) {
                    for (const unk of unknowns) {
                        setCell(unk.r, unk.c, unk.required, 'propagated');
                    }
                }
            }
        }

        setGridState(newGrid);
        setConflicts(newConflicts);
    }, [userMoves, numbers, rows, cols]);

    // View Helpers
    const numberSize = size * 0.4;
    const numberSpace = size - numberSize;

    const conflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'cell')
                    .map(c => `${String(c.r)},${String(c.c)}`)
            ),
        [conflicts]
    );
    const nodeConflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'node')
                    .map(c => `${String(c.r)},${String(c.c)}`)
            ),
        [conflicts]
    );

    const getCellProps = (r: number, c: number) => {
        const pos = `${String(r)},${String(c)}`;
        const info = gridState.get(pos);
        const value = info?.state ?? EMPTY;
        const source = info?.source;
        const isConflict = conflictSet.has(pos);

        let color = COLORS.text.primary;
        if (isConflict) color = COLORS.data.red;
        else if (source === 'user') color = COLORS.primary.main;
        else if (source === 'propagated') color = COLORS.data.green;

        return {
            onMouseDown: (e: React.MouseEvent) => {
                if (e.button !== 0) return;
                const current = userMoves.get(pos);
                // Forward -> Backward -> Empty
                const newState =
                    current === FORWARD
                        ? BACKWARD
                        : current === BACKWARD
                          ? undefined
                          : FORWARD;

                if (newState === undefined) {
                    onMove(pos, undefined);
                } else {
                    onMove(pos, newState);
                }
            },
            'data-pos': pos,
            sx: {
                cursor: 'pointer',
                border: `1px solid rgba(255, 255, 255, 0.1)`, // Lighter border for dark bg
                position: 'relative',
                transition: 'all 0.2s',
                touchAction: 'none',
                backgroundColor: isConflict
                    ? `${COLORS.data.red}20`
                    : 'rgba(255, 255, 255, 0.02)', // Slight tint
                '&:hover': {
                    backgroundColor: isConflict
                        ? `${COLORS.data.red}30`
                        : 'rgba(255, 255, 255, 0.1)',
                },
            },
            children: (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    {value === FORWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '130%',
                                height: '6px',
                                backgroundColor: color,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(-45deg)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                transition: 'all 0.2s',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                    {value === BACKWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '130%',
                                height: '6px',
                                backgroundColor: color,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(45deg)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                transition: 'all 0.2s',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </Box>
            ),
        };
    };

    const getNumberProps = (r: number, c: number) => {
        const value = numbers[r]?.[c];
        const hasConflict = nodeConflictSet.has(`${String(r)},${String(c)}`);

        return {
            children: <Box>{value ?? ''}</Box>,
            sx: {
                borderRadius: '50%',
                backgroundColor: hasConflict
                    ? COLORS.data.red
                    : 'hsl(217, 50%, 8%)', // Match dark bg
                border:
                    value !== null
                        ? `2px solid ${
                              hasConflict
                                  ? COLORS.data.red
                                  : 'rgba(255, 255, 255, 0.3)' // Lighter border
                          }`
                        : 'none',
                fontSize: `${String(numberSize * 0.5)}rem`,
                fontWeight: '800',
                color: hasConflict ? '#fff' : '#fff', // Always white text
                zIndex: 5,
                opacity: value !== null ? 1 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                transform: hasConflict ? 'scale(1.1)' : 'scale(1)',
                position: 'relative',
                pointerEvents: 'none',
            },
        };
    };

    return (
        <Box sx={{ position: 'relative', userSelect: 'none' }}>
            {/* Blueprint Container */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -40,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <Box
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.2rem',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    CALCULATOR
                </Box>
            </Box>

            <Box
                sx={{
                    position: 'relative',
                    padding: '48px',
                    border: '2px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px',
                }}
            >
                {/* Main Grid */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <CustomGrid
                        size={size}
                        rows={rows}
                        cols={cols}
                        cellProps={getCellProps}
                        space={0}
                        sx={{ width: 'fit-content' }}
                    />
                </Box>

                {/* Numbers Grid Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '48px',
                        left: '48px',
                        transform: `translate(-${String(numberSize / 2)}rem, -${String(numberSize / 2)}rem)`,
                        zIndex: 10,
                        pointerEvents: 'none',
                    }}
                >
                    <CustomGrid
                        size={numberSize}
                        rows={rows + 1}
                        cols={cols + 1}
                        cellProps={getNumberProps}
                        space={numberSpace}
                        sx={{ width: 'fit-content' }}
                    />
                </Box>
            </Box>
        </Box>
    );
};
