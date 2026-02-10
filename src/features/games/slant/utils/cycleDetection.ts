import { DSU } from '../../../../utils/DSU';
import { getPosKey } from '../../../../utils/gameUtils';
import { CellState, EMPTY, FORWARD } from '../types';

/**
 * Maps grid node coordinates (intersections) to a flat index.
 *
 * @param r - Row index (0 to rows)
 * @param c - Column index (0 to cols)
 * @param cols - Number of columns in the grid
 * @returns Flat numerical index for the node
 */
export function getNodeIndex(r: number, c: number, cols: number): number {
    return r * (cols + 1) + c;
}

/**
 * Finds all cells that are part of any cycle in the Slant grid.
 *
 * Uses a JavaScript DFS-based cycle detection algorithm.
 *
 * @param grid - Current 2D grid of cell states
 * @param rows - Grid rows
 * @param cols - Grid columns
 * @returns A Set of string keys (from getPosKey) representing cells in cycles
 */
export function findCycles(
    grid: CellState[][],
    rows: number,
    cols: number
): Set<string> {
    const adj = new Map<number, { node: number; r: number; c: number }[]>();
    const cycleCells = new Set<string>();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = grid[r]?.[c];
            if (!cell || cell === EMPTY) continue;

            const u =
                cell === FORWARD
                    ? getNodeIndex(r, c + 1, cols)
                    : getNodeIndex(r, c, cols);
            const v =
                cell === FORWARD
                    ? getNodeIndex(r + 1, c, cols)
                    : getNodeIndex(r + 1, c + 1, cols);

            if (!adj.has(u)) adj.set(u, []);
            if (!adj.has(v)) adj.set(v, []);
            adj.get(u)?.push({ node: v, r, c });
            adj.get(v)?.push({ node: u, r, c });
        }
    }

    const visited = new Set<number>();
    const onStack = new Set<number>();
    const edgeStack: { r: number; c: number; u: number; v: number }[] = [];

    const dfs = (u: number, prevNode: number) => {
        visited.add(u);
        onStack.add(u);

        const neighbors = adj.get(u) ?? [];
        for (const { node: v, r, c } of neighbors) {
            if (v === prevNode) continue;

            if (onStack.has(v)) {
                // Cycle detected! Trace back edgeStack
                cycleCells.add(getPosKey(r, c));
                for (let i = edgeStack.length - 1; i >= 0; i--) {
                    const edge = edgeStack[i];
                    if (!edge) break;
                    cycleCells.add(getPosKey(edge.r, edge.c));
                    if (edge.u === v || edge.v === v) break;
                }
            } else if (!visited.has(v)) {
                edgeStack.push({ r, c, u, v });
                dfs(v, u);
                edgeStack.pop();
            }
        }

        onStack.delete(u);
    };

    for (const node of adj.keys()) {
        if (!visited.has(node)) {
            dfs(node, -1);
        }
    }

    return cycleCells;
}

/**
 * Quickly determines if the current grid contains at least one cycle.
 * Uses Disjoint Set Union (DSU) for performance.
 *
 * @param grid - Current 2D grid
 * @param rows - Grid rows
 * @param cols - Grid columns
 * @returns True if a cycle exists, false otherwise
 */
export function hasCycle(
    grid: CellState[][],
    rows: number,
    cols: number
): boolean {
    const dsu = new DSU((rows + 1) * (cols + 1));

    for (let r = 0; r < rows; r++) {
        const rowArr = grid[r];
        if (!rowArr) continue;
        for (let c = 0; c < cols; c++) {
            const cell = rowArr[c];
            if (cell === undefined || cell === EMPTY) continue;

            const u =
                cell === FORWARD
                    ? getNodeIndex(r, c + 1, cols)
                    : getNodeIndex(r, c, cols);
            const v =
                cell === FORWARD
                    ? getNodeIndex(r + 1, c, cols)
                    : getNodeIndex(r + 1, c + 1, cols);

            if (!dsu.union(u, v)) {
                return true;
            }
        }
    }
    return false;
}
