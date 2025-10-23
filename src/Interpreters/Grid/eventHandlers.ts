import { gridMove, getDirection } from '../../calculate';
import {
    handleToolbar,
    type ToolbarState,
    type ToolbarAction,
} from '../Toolbar';

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

function handleKeys(
    state: GridState,
    payload: KeysPayload
): Partial<GridState> {
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

    if (key === 'Backslash' || key === '\\') {
        value = '\\';
    } else if (key.length === 1) {
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

function handleResize(
    state: GridState,
    payload: ResizePayload
): Partial<GridState> {
    const { resetState, ...rest } = payload;
    let { grid } = state;
    const { rows, cols } = state;
    let resize = '';

    const { rows: newRows, cols: newCols } = rest;

    if (newRows !== undefined && newRows > rows) {
        const diff = newRows - rows;
        const prod = diff * cols;

        grid += ' '.repeat(prod);
    }

    const finalRows = newRows !== undefined ? newRows : rows;
    const finalCols = newCols !== undefined ? newCols : cols;

    for (let k = 0; k < finalRows; k++) {
        const start = k * cols;
        let end = start;

        if (newCols !== undefined && newCols > cols) end += cols;
        else end += newCols !== undefined ? newCols : cols;

        resize += grid.substring(start, end).padEnd(finalCols, ' ');
    }

    resetState(resize);

    return {
        ...rest,
        grid: resize,
        pause: true,
    };
}

export function handleAction(
    state: GridState,
    action: { type: string; payload: unknown }
) {
    const { type, payload } = action;
    let newState = {};

    switch (type) {
        case 'edit':
            newState = handleKeys(state, payload as KeysPayload);
            break;
        case 'resize':
            newState = handleResize(state, payload as ResizePayload);
            break;
        case 'click':
            const { select } = payload as { select: number };
            newState = select === state.select ? { select: null } : { select };
            break;
        default:
            newState = handleToolbar(
                state as unknown as ToolbarState,
                action as ToolbarAction
            );
            break;
    }

    return {
        ...state,
        ...newState,
    };
}

// Export both for compatibility
export { handleAction as handleGrid };
