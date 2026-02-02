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

export function generateMaze(rows: number, cols: number): MazeData {
    const grid: Cell[][] = [];

    // Initialize grid
    for (let r = 0; r < rows; r++) {
        const row: Cell[] = [];
        for (let c = 0; c < cols; c++) {
            row.push({
                row: r,
                col: c,
                visited: false,
                walls: {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                },
            });
        }
        grid.push(row);
    }

    const stack: Cell[] = [];
    const startCell = grid[0]?.[0];
    if (!startCell) return { grid, rows, cols, start: [0, 0], end: [rows - 1, cols - 1] };
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        if (!current) break;
        const neighbors = getUnvisitedNeighbors(current, grid, rows, cols);

        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            if (next) {
                removeWalls(current, next);
                next.visited = true;
                stack.push(next);
            }
        } else {
            stack.pop();
        }
    }

    return {
        grid,
        rows,
        cols,
        start: [0, 0],
        end: [rows - 1, cols - 1],
    };
}

function getUnvisitedNeighbors(
    cell: Cell,
    grid: Cell[][],
    rows: number,
    cols: number
): Cell[] {
    const neighbors: Cell[] = [];
    const { row, col } = cell;

    if (row > 0 && !grid[row - 1]?.[col]?.visited) {
        const neighbor = grid[row - 1]?.[col];
        if (neighbor) neighbors.push(neighbor);
    }
    if (row < rows - 1 && !grid[row + 1]?.[col]?.visited) {
        const neighbor = grid[row + 1]?.[col];
        if (neighbor) neighbors.push(neighbor);
    }
    if (col > 0 && !grid[row]?.[col - 1]?.visited) {
        const neighbor = grid[row]?.[col - 1];
        if (neighbor) neighbors.push(neighbor);
    }
    if (col < cols - 1 && !grid[row]?.[col + 1]?.visited) {
        const neighbor = grid[row]?.[col + 1];
        if (neighbor) neighbors.push(neighbor);
    }

    return neighbors;
}

function removeWalls(a: Cell, b: Cell) {
    const dr = a.row - b.row;
    const dc = a.col - b.col;

    if (dr === 1) {
        a.walls.top = false;
        b.walls.bottom = false;
    } else if (dr === -1) {
        a.walls.bottom = false;
        b.walls.top = false;
    }

    if (dc === 1) {
        a.walls.left = false;
        b.walls.right = false;
    } else if (dc === -1) {
        a.walls.right = false;
        b.walls.left = false;
    }
}
