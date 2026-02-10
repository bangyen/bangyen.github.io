export function getGrid(rows, cols) {
    return [...Array(rows)].map(() => Array(cols).fill(0));
}

export function flipAdj(row, col, grid) {
    const cols = grid[0].length;
    const rows = grid.length;

    grid = grid.map(row => [...row]);
    grid[row][col] ^= 1;

    if (row > 0) grid[row - 1][col] ^= 1;
    if (row < rows - 1) grid[row + 1][col] ^= 1;

    if (col > 0) grid[row][col - 1] ^= 1;
    if (col < cols - 1) grid[row][col + 1] ^= 1;

    return grid;
}

function randomize(rows, cols) {
    let grid = getGrid(rows, cols);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const random = Math.random();

            if (random > 0.5) grid = flipAdj(r, c, grid);
        }
    }

    return grid;
}

export function handleBoard(state, action) {
    const { type, row, col } = action;

    let { grid, score, rows, cols } = state;

    switch (type) {
        case 'adjacent':
            grid = flipAdj(row, col, grid);

            const flat = grid.flatMap(r => r);

            const done = !flat.includes(1) || !flat.includes(0);

            if (done) {
                grid = randomize(rows, cols);
                score += 1;
            }

            break;
        case 'random':
            grid = randomize(rows, cols);

            break;
        case 'resize':
            const { newRows, newCols } = action;

            rows = newRows;
            cols = newCols;
            grid = randomize(rows, cols);

            break;
        default:
            break;
    }

    return {
        grid,
        score,
        rows,
        cols,
    };
}
