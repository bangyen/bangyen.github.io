import { gridMove, getDirection } from '../utils/gridUtils';
import {
    handleToolbar,
    type ToolbarState,
    type ToolbarAction,
} from '../Toolbar';

export interface GridState {
    grid: string;
    select: number | null;
    rows: number;
    cols: number;
    pause: boolean;
    position?: number | null;
    output?: string;
    [key: string]: unknown;
}

export interface KeysPayload {
    key: string;
    resetState: (grid: string) => void;
}

export interface ResizePayload {
    resetState: (grid: string) => void;
    rows?: number;
    cols?: number;
}

export type GridAction =
    | { type: 'edit'; payload: KeysPayload }
    | { type: 'resize'; payload: ResizePayload }
    | { type: 'click'; payload: { select: number } }
    | ToolbarAction;

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

export function handleAction(state: GridState, action: GridAction) {
    const { type } = action;
    let newState = {};

    switch (type) {
        case 'edit': {
            newState = handleKeys(
                state,
                (action as { type: 'edit'; payload: KeysPayload }).payload
            );
            break;
        }
        case 'resize':
            newState = handleResize(
                state,
                (action as { type: 'resize'; payload: ResizePayload }).payload
            );
            break;
        case 'click': {
            const { select } = (
                action as { type: 'click'; payload: { select: number } }
            ).payload;
            newState = select === state.select ? { select: null } : { select };
            break;
        }
        case 'delete': {
            // Assuming 'tape' and 'pointer' are part of GridState via index signature or will be added.
            // If not, this will cause a type error.
            const { tape, pointer } = state as unknown as {
                tape: number[];
                pointer: number;
            };
            if (pointer > 0 && tape[pointer] === 0) {
                (state as unknown as { pointer: number }).pointer--;
            }
            break;
        }
        default: {
            newState = handleToolbar(
                state as unknown as ToolbarState,
                action as ToolbarAction
            );
            break;
        }
    }

    return {
        ...state,
        ...newState,
    };
}

// Export both for compatibility
export { handleAction as handleGrid };
