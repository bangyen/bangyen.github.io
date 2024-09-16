import { useRef, useEffect, useReducer, useCallback, useMemo } from 'react';
import { gridMove, getDirection, convertPixels } from '../../calculate';
import Editor, { EditorContext, GridArea } from '../Editor';
import { useContainer, useTimer, useKeys, useCache } from '../../hooks';

function handleKeys(state, payload) {
    let { grid, select } = state;
    let value;

    const { key, resetState }
        = payload;

    if (select === null)
        return {};

    if (key.includes('Arrow')) {
        const arrow = getDirection(key);
        const { rows, cols } = state;

        select = gridMove(
            select, arrow, rows, cols);
        return {select};
    }

    if (key.length === 1) {
        value = key;
    } else if (key === 'Backspace'
            || key === 'Delete') {
        value = ' ';
    } else {
        return {};
    }

    const before = grid.slice(0, select);
    const after  = grid.slice(select + 1);
    grid = before + value + after;
    resetState(grid);
    
    return {grid};
}

function handleResize(state, payload) {
    const { resetState, ...rest } = payload;
    let { grid, rows, cols } = state;
    let resize = '';

    const {
        rows: newRows,
        cols: newCols
    } = rest;

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

    resetState(resize);

    return {
        ...rest,
        grid: resize
    };
}

function handleAction(state, action) {
    const { type, payload } = action;
    let newState  = {};

    const update = (type, flag) => {
        const { nextIter, clear }
            = payload;

        if (flag)
            clear();

        const result
            = nextIter({
                type});

        return {
            ...result,
            select: null};
    };

    switch (type) {
        case 'run':
            const {
                resetState,
                dispatch,
                create
            } = payload;

            const repeat = () => {
                dispatch({
                    type: 'timer',
                    payload
                });
            };

            newState = resetState(
                state.grid);
            create({repeat});
            break;
        case 'timer':
            const newType = state.end
                ? 'stop' : 'next';

            payload.dispatch({
                type: newType,
                payload});
            break;
        case 'stop':
            payload.clear();
            break;
        case 'prev':
            newState = update(
                'prev', true);
            break;
        case 'next':
            newState = update(
                'next', false);
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
        default:
            break;
    }

    return {
        ...state,
        ...newState
    };
}

export default function GridEditor(props) {
    const {
        create: createKeys,
        clear:  clearKeys
    } = useKeys();
    const { create, clear } = useTimer(200);

    const {
        runner,
        name,
        start,
        tape,
        output,
        register
    } = props;

    const nextIter  = useCache(runner);
    const container = useRef(null);
    let { height, width }
        = useContainer(
            container);

    const size = 6;
    height *= 0.8;
    width  *= 0.9;

    const { rows, cols }
        = useMemo(() => 
            convertPixels(
                size, height, width),
            [size, height, width]);

    const initial = {
        ...start,
        grid:
            ' '.repeat(
                rows * cols),
        select: null,
        rows,
        cols
    };

    const [state, dispatch]
        = useReducer(
            handleAction,
            initial);

    const resetState
        = useCallback(grid => {
            clear();

            return nextIter({
                type: 'clear',
                payload: {
                    ...start,
                    grid,
                    rows,
                    cols
                }});
        }, [start,
            clear,
            nextIter,
            rows,
            cols]);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: {
                rows, cols,
                resetState}
        });
    }, [rows, cols, resetState]);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';

        const wrapper = event => {
            dispatch({
                type: 'edit',
                payload: {
                    key: event.key,
                    resetState
                }
            });
        };

        createKeys(wrapper);

        return () => clearKeys();
    }, [name,
        createKeys,
        resetState,
        clearKeys]);

    const handleClick = useCallback(
        select => () => {
            dispatch({
                type: 'click',
                payload: {select}
            });
        }, []);

    const chooseColor = useCallback(
        square => {
            const { position, select }
                = state;

            if (square === select)
                return 'primary';
            if (square === position)
                return 'info';

            return 'secondary';
        }, [state]
    );

    const wrapDispatch = useCallback(
        type => () => {
            const payload = {
                resetState,
                nextIter,
                dispatch,
                create,
                clear
            };

            dispatch({type, payload});
        }, [resetState,
            nextIter,
            create,
            clear]);

    const context = {
        name,
        size,
        ...state,
        dispatch:
            wrapDispatch,
        pointer: state.pointer,
        tapeFlag: tape,
        outFlag:  output,
        regFlag:  register,
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