import { gridMove, getDirection } from '../../calculate';
import { handleToolbar, type ToolbarState, type ToolbarAction } from '../Toolbar';

interface GridState {
    grid: string;
    select: number | null;
    rows: number;
    cols: number;
    pause?: boolean;
}

interface KeysPayload {
    key: string;
    resetState: (grid: string) => void;
}

interface ResizePayload {
    resetState: (grid: string) => void;
    rows?: number;
    cols?: number;
}

function handleKeys(state: GridState, payload: KeysPayload): Partial<GridState> {
    let { grid, select } = state;
    let value: string;

    const { key, resetState } = payload;

    if (select === null) return {};

    if (key.includes('Arrow')) {
        const arrow = getDirection(key);
        const { rows, cols } = state;

        select = gridMove(select, arrow, rows, cols);
        return { select };
    }

    if (key.length === 1) {
        value = key;
    } else if (key === 'Backspace' || key === 'Delete') {
        value = ' ';
    } else {
        return {};
    }

    const before = grid.slice(0, select);
    const after = grid.slice(select + 1);

    grid = before + value + after;
    resetState(grid);

    return { grid, pause: true };
}

function handleResize(state: GridState, payload: ResizePayload): Partial<GridState> {
    const { resetState, ...rest } = payload;
    let { grid } = state;
    const { rows, cols } = state;
    let resize = '';

    const { rows: newRows, cols: newCols } = rest;

    if (newRows !== undefined && newRows > rows) {
        const diff = newRows - rows;
        const prod = diff * cols;

        grid += ' '.repeat(prod);
    } else if (newRows !== undefined && newRows < rows) {
        const diff = rows - newRows;
        const prod = diff * cols;

        grid = grid.slice(0, -prod);
    }

    if (newCols !== undefined && newCols > cols) {
        const diff = newCols - cols;

        for (let r = 0; r < rows; r++) {
            const start = r * cols;
            const end = start + cols;

            resize += grid.slice(start, end) + ' '.repeat(diff);
        }

        grid = resize;
    } else if (newCols !== undefined && newCols < cols) {
        const diff = cols - newCols;

        for (let r = 0; r < rows; r++) {
            const start = r * cols;
            const end = start + newCols;

            resize += grid.slice(start, end);
        }

        grid = resize;
    }

    resetState(grid);

    return { grid };
}

export function handleAction(state: GridState, action: { type: string; payload: unknown }) {
    const { type, payload } = action;

    switch (type) {
        case 'keys':
            return handleKeys(state, payload as KeysPayload);
        case 'resize':
            return handleResize(state, payload as ResizePayload);
        case 'toolbar':
            return handleToolbar(state as unknown as ToolbarState, action as ToolbarAction);
        default:
            return {};
    }
}

// Export both for compatibility
export { handleAction as handleGrid };

