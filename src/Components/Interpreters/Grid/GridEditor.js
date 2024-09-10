import { useRef, useEffect, useReducer, useCallback, useMemo } from 'react';
import { gridMove, getDirection, convertPixels } from '../../calculate';
import Editor, { EditorContext, GridArea } from '../Editor';
import { useContainer, useTimer, useKeys } from '../../hooks';

function handleKeys(state, payload) {
    let { grid, select } = state;
    let newState = null;
    let value;

    const { key }
        = payload;

    if (select === null)
        return {};

    if (key.toLowerCase() === 'b') {
        const { breaks } = state;

        if (breaks.has(select))
            breaks.delete(select);
        else
            breaks.add(select);

        newState = {breaks};
    } else if (key.includes('Arrow')) {
        const arrow = getDirection(key);
        const { rows, cols } = state;

        select = gridMove(
            select, arrow, rows, cols);
        newState = {select};
    }

    if (newState !== null)
        return newState;

    if (key.length === 1) {
        value = key;
    } else if (key === 'Backspace'
            || key === 'Delete') {
        value = ' ';
    }

    const before = grid.slice(0, select);
    const after  = grid.slice(select + 1);
    grid = before + value + after;

    return {grid};
}

function handleResize(state, payload) {
    let { grid, rows, cols } = state;
    let resize = '';

    const {
        rows: newRows,
        cols: newCols
    } = payload;

    if (newRows > rows) {
        const diff = newRows - rows;
        const prod = diff * cols;

        grid += ' '.repeat(prod);
    }

    for (let k = 0; k < newRows; k++) {
        const start = k * cols;
        let end = start;

        if (newCols > cols)
            end += cols;
        else
            end += newCols;

        resize += grid
            .substring(start, end)
            .padEnd(newCols, ' ');
    }

    return {
        ...payload,
        grid: resize
    };
}

function handleAction(state, action) {
    const { type, payload } = action;
    let newState  = {};

    const update = (gFlag, cFlag) => {
        const { getState, clear }
            = payload;

        if (cFlag)
            clear();

        return getState
            .current(gFlag);
    };

    switch (type) {
        case 'run':
            const { dispatch, create }
                = payload;

            create(() => dispatch({
                type: 'timer',
                payload
            }));
            break;
        case 'timer':
            const newType = state.end
                ? 'stop' : 'next';

            payload.dispatch({
                type: newType,
                payload});
            break;
        case 'stop':
            payload.clear()
            break;
        case 'prev':
            newState = update(
                true, true);
            break;
        case 'next':
            newState = update(
                false, false);
            break;
        case 'edit':
            newState = handleKeys(
                state, payload);
            break;
        case 'resize':
            newState = handleResize(
                state, payload);
            break;
        case 'click':
            let { select } = payload;

            if (select === state.select)
                select = null;

            newState = {select};
            break;
        case 'ff':
            let result;

            do {
                result = update(
                    false, true);
            } while (!result.end);

            newState = result;
            break;
        default:
            break;
    }

    return {
        ...state,
        ...newState
    };
}

export default function GridEditor(props) {
    const { create, clear } = useTimer(200);

    const { create: createKeys } = useKeys();
    const container = useRef(null);
    const getState  = useRef(null);
    let { height, width }
        = useContainer(container);

    const size = 6;
    height *= 0.8;
    width  *= 0.9;

    const {
        name, start,
        tape, out, reg
    } = props;

    const { rows, cols } = useMemo(() => 
        convertPixels(
            size, height, width),
        [size, height, width]);

    const initial = {
        ...start,
        grid:
            ' '.repeat(
                rows * cols),
        breaks: new Set(),
        select: null,
        end: true,
        rows, cols
    };

    const [state, dispatch]
        = useReducer(
            handleAction,
            initial);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload:
                {rows, cols, clear}
        });
    }, [rows, cols, clear]);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';

        const wrapper = event => {
            dispatch({
                type: 'edit',
                payload: {
                    key: event.key,
                    clear
                }
            });
        };

        createKeys(wrapper);
    }, [name, createKeys, clear]);

    const handleClick = useCallback(
        select => () => {
            dispatch({
                type: 'click',
                payload: {select}
            });
        }, []);

    const chooseColor = useCallback(
        position => {
            const { pos, select, breaks }
                = state;

            if (position === select)
                return 'primary';
            else if (position === pos)
                return 'info';
            else if (breaks.has(position))
                return 'warning';

            return 'secondary';
        }, [state]
    );

    const wrapDispatch = useCallback(
        type => () => {
            const { grid, rows, cols } = state;
            const { run } = props;

            const payload = {
                getState,
                dispatch,
                create,
                clear
            };

            if (type !== 'stop')
                getState.current
                    = run(grid, rows, cols);

            dispatch({type, payload});
        }, [state, props, create, clear]);

    const context = {
        name,
        size,
        ...state,
        dispatch:
            wrapDispatch,
        tapeFlag: tape,
        outFlag:  out,
        accFlag:  reg,
        container
    };

    return (
        <EditorContext.Provider
                value={context}>
            <Editor>
                <GridArea
                    rows={rows}
                    cols={cols}
                    options={state.grid}
                    handleClick={handleClick}
                    chooseColor={chooseColor} />
            </Editor>
        </EditorContext.Provider>
    );
}