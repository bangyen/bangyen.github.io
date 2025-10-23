export function getGrid(rows: number, cols: number): number[][] {
    return [...Array(rows)].map(() => Array(cols).fill(0));
}

export function flipAdj(row: number, col: number, grid: number[][]): number[][] {
    const cols = grid[0].length;
    const rows = grid.length;

    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] ^= 1;

    if (row > 0) newGrid[row - 1][col] ^= 1;
    if (row < rows - 1) newGrid[row + 1][col] ^= 1;

    if (col > 0) newGrid[row][col - 1] ^= 1;
    if (col < cols - 1) newGrid[row][col + 1] ^= 1;

    return newGrid;
}

function randomize(rows: number, cols: number): number[][] {
    let grid = getGrid(rows, cols);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const random = Math.random();

            if (random > 0.5) grid = flipAdj(r, c, grid);
        }
    }

    return grid;
}

interface BoardState {
    grid: number[][];
    score: number;
    rows: number;
    cols: number;
}

interface BoardAction {
    type: string;
    row?: number;
    col?: number;
}

export function handleBoard(state: BoardState, action: BoardAction): BoardState {
    const { type, row, col } = action;

    let { grid, score, rows, cols } = state;

    switch (type) {
        case 'adjacent':
            if (row !== undefined && col !== undefined) {
                grid = flipAdj(row, col, grid);

                const flat = grid.flatMap(r => r);

                const done = !flat.includes(1) || !flat.includes(0);

                if (done) {
                    grid = randomize(rows, cols);
                    score += 1;
                }
            }
            break;
        case 'randomize':
            grid = randomize(rows, cols);
            break;
        case 'reset':
            grid = getGrid(rows, cols);
            score = 0;
            break;
        default:
            break;
    }

    return { grid, score, rows, cols };
}

