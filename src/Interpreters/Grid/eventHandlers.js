import { gridMove, getDirection } from '../../calculate';
import { handleToolbar } from '../Toolbar';

function handleKeys(state, payload) {
    let { grid, select } = state;
    let value;

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

function handleResize(state, payload) {
    const { resetState, ...rest } = payload;
    let { grid } = state;
    const { rows, cols } = state;
    let resize = '';

    const { rows: newRows, cols: newCols } = rest;

    if (newRows > rows) {
        const diff = newRows - rows;
        const prod = diff * cols;

        grid += ' '.repeat(prod);
    }

    for (let k = 0; k < newRows; k++) {
        const start = k * cols;
        let end = start;

        if (newCols > cols) end += cols;
        else end += newCols;

        resize += grid.substring(start, end).padEnd(newCols, ' ');
    }

    resetState(resize);

    return {
        ...rest,
        grid: resize,
        pause: true,
    };
}

export function handleAction(state, action) {
    const { type, payload } = action;
    let newState = {};

    switch (type) {
        case 'edit':
            newState = handleKeys(state, payload);
            break;
        case 'resize':
            newState = handleResize(state, payload);
            break;
        case 'click':
            let { select } = payload;

            if (select === state.select) select = null;

            newState = { select };
            break;
        default:
            newState = handleToolbar(state, action);
            break;
    }

    return {
        ...state,
        ...newState,
    };
}
