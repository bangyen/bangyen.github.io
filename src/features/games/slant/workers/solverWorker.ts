import {
    CellState,
    EMPTY,
    BACKWARD,
    FORWARD,
    findCycles,
} from '../boardHandlers';

export type CellSource = 'user' | 'propagated';

export interface CellInfo {
    state: CellState;
    source: CellSource;
}

export interface Conflict {
    type: 'cell' | 'node';
    r: number;
    c: number;
}

export type SolverMessage =
    | {
          type: 'SOLVE';
          payload: {
              rows: number;
              cols: number;
              numbers: (number | null)[][];
              userMoves: Map<string, CellState>;
          };
      }
    | {
          type: 'RESULT';
          payload: {
              gridState: Map<string, CellInfo>;
              conflicts: Conflict[];
              cycleCells: Set<string>;
          };
      };

self.onmessage = (e: MessageEvent<SolverMessage>) => {
    if (e.data.type === 'SOLVE') {
        const { rows, cols, numbers, userMoves } = e.data.payload;

        const newGrid = new Map<string, CellInfo>();
        const queue: { r: number; c: number }[] = [];
        const newConflicts: Conflict[] = [];

        // 1. Initialize with User Moves
        userMoves.forEach((val: CellState, pos: string) => {
            newGrid.set(pos, { state: val, source: 'user' });
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
            // Always add to queue to propagate constraints recursively
            queue.push({ r, c });
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

                // If this update was propagated, we stop here.
                // We checked for conflicts (above), but we don't trigger further chains.
                if (
                    newGrid.get(`${String(cr)},${String(cc)}`)?.source !==
                    'user'
                )
                    continue;

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

        // Cycle Detection
        const tempGrid: CellState[][] = Array.from(
            { length: rows },
            () => Array(cols).fill(EMPTY) as CellState[]
        );
        newGrid.forEach((info, key) => {
            const [r, c] = key.split(',').map(Number);
            if (r !== undefined && c !== undefined && tempGrid[r]) {
                tempGrid[r][c] = info.state;
            }
        });

        const cycles = findCycles(tempGrid, rows, cols);

        self.postMessage({
            type: 'RESULT',
            payload: {
                gridState: newGrid,
                conflicts: newConflicts,
                cycleCells: cycles,
            },
        });
    }
};
