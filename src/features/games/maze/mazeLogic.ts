export interface Cell {
    row: number;
    col: number;
    visited: boolean;
    walls: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
}

export interface MazeData {
    grid: Cell[][];
    rows: number;
    cols: number;
    start: [number, number];
    end: [number, number];
}

export type MazeAlgorithm = 'backtracker' | 'prims';

/**
 * Shared helpers for maze generation
 */
const HELPERS = {
    initializeGrid: (rows: number, cols: number): Cell[][] => {
        const grid: Cell[][] = [];
        for (let r = 0; r < rows; r++) {
            const row: Cell[] = [];
            for (let c = 0; c < cols; c++) {
                row.push({
                    row: r,
                    col: c,
                    visited: false,
                    walls: { top: true, right: true, bottom: true, left: true },
                });
            }
            grid.push(row);
        }
        return grid;
    },

    getNeighbors: (
        cell: Cell,
        grid: Cell[][],
        rows: number,
        cols: number,
        visitedStatus = false
    ): Cell[] => {
        const neighbors: Cell[] = [];
        const { row, col } = cell;
        const coords = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1],
        ];

        coords.forEach(([r, c]) => {
            if (
                r !== undefined &&
                c !== undefined &&
                r >= 0 &&
                r < rows &&
                c >= 0 &&
                c < cols
            ) {
                if (grid[r]?.[c]?.visited === visitedStatus) {
                    const neighbor = grid[r][c];
                    neighbors.push(neighbor);
                }
            }
        });

        return neighbors;
    },

    removeWalls: (a: Cell, b: Cell) => {
        const dr = a.row - b.row;
        const dc = a.col - b.col;

        if (dr === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        } else if (dr === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        } else if (dc === 1) {
            a.walls.left = false;
            b.walls.right = false;
        } else if (dc === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }
    },
};

/**
 * Recursive Backtracker (Current Default)
 * Characteristics: Long, winding paths, fewer dead ends.
 */
function generateRecursiveBacktracker(
    grid: Cell[][],
    rows: number,
    cols: number
) {
    const stack: Cell[] = [];
    const startCell = grid[0]?.[0];
    if (!startCell) return;

    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        if (!current) break;
        const neighbors = HELPERS.getNeighbors(
            current,
            grid,
            rows,
            cols,
            false
        );

        if (neighbors.length > 0) {
            const next =
                neighbors[Math.floor(Math.random() * neighbors.length)];
            if (next) {
                HELPERS.removeWalls(current, next);
                next.visited = true;
                stack.push(next);
            }
        } else {
            stack.pop();
        }
    }
}

/**
 * Prim's Algorithm
 * Characteristics: More "branchy" look, many short dead ends.
 */
function generatePrims(grid: Cell[][], rows: number, cols: number) {
    const startCell = grid[0]?.[0];
    if (!startCell) return;

    startCell.visited = true;
    // List of walls/edges to consider. For simplicity, we track "neighboring unvisited cells"
    const frontier: { parent: Cell; cell: Cell }[] = HELPERS.getNeighbors(
        startCell,
        grid,
        rows,
        cols,
        false
    ).map(n => ({ parent: startCell, cell: n }));

    while (frontier.length > 0) {
        const index = Math.floor(Math.random() * frontier.length);
        const item = frontier[index];
        if (!item) continue;
        const { parent, cell } = item;
        frontier.splice(index, 1);

        if (!cell.visited) {
            cell.visited = true;
            HELPERS.removeWalls(parent, cell);

            // Add new unvisited neighbors to frontier
            const neighbors = HELPERS.getNeighbors(
                cell,
                grid,
                rows,
                cols,
                false
            );
            neighbors.forEach(n => {
                frontier.push({ parent: cell, cell: n });
            });
        }
    }
}

const ALGORITHMS: Record<
    MazeAlgorithm,
    (grid: Cell[][], rows: number, cols: number) => void
> = {
    backtracker: generateRecursiveBacktracker,
    prims: generatePrims,
};

export function generateMaze(
    rows: number,
    cols: number,
    algorithm: MazeAlgorithm = 'backtracker'
): MazeData {
    const grid = HELPERS.initializeGrid(rows, cols);

    const carver = ALGORITHMS[algorithm];
    carver(grid, rows, cols);

    return {
        grid,
        rows,
        cols,
        start: [0, 0],
        end: [rows - 1, cols - 1],
    };
}
