import { useRef, useEffect, useReducer, useCallback, useMemo } from 'react';
import { gridMove, getDirection, convertPixels } from '../../calculate';
import Editor, { EditorContext, GridArea } from '../Editor';
import { useContainer, useTimer, useKeys } from '../../hooks';

function handleKeys(state, action) {
    const { payload } = action;
    const { key } = payload;
    let value;

    let {
        select,
        breaks,
        code,
        rows,
        cols
    } = state;

    if (key.toLowerCase() === 'b') {
        if (breaks.has(select))
            breaks.delete(select);
        else
            breaks.add(select);

        return {...state, breaks};
    } else if (key.length === 1) {
        value = key;
    } else if (key === 'Backspace'
            || key === 'Delete') {
        value = ' ';
    } else if (key.includes('Arrow')) {
        const arrow = getDirection(key);

        select = gridMove(
            select, arrow, rows, cols);
    } else {
        return state;
    }

    const before = code.slice(0, select);
    const after  = code.slice(select + 1);
    code = before + value + after;

    return {...state, code, select};
}

function handleAction(state, action) {
    const { type, payload }    = action;
    let   { code, rows, cols } = state;

    const update = flag =>
        payload.getState(flag);

    if (type !== 'next')
        payload.clear();

    switch (type) {
        case 'prev':
            return update(true);
        case 'next':
            return update(false);
        case 'edit':
            return handleKeys(
                state, payload);
        case 'click':
            return {
                ...state,
                ...payload
            };
        case 'resize':
            const {
                rows: newRows,
                cols: newCols
            } = payload;

            let resize = '';

            if (newRows > rows) {
                const diff = newRows - rows;
                const prod = diff * cols;

                code += ' '.repeat(prod);
            }

            for (let k = 0; k < newRows; k++) {
                const start = k * cols;
                let end = start;

                if (newCols > cols)
                    end += cols;
                else
                    end += newCols;

                resize += code
                    .substring(start, end)
                    .padEnd(newCols, ' ');
            }

            return {
                ...state,
                ...payload,
                code: resize
            };
        case 'ff':
            let result;

            do {
                result = update(false);
            } while (!result.end);

            return {
                ...state,
                ...result
            };
        default:
            break;
    }

    return state;
}

export default function GridEditor(props) {
    const {
        create: createTimer,
        clear:  clearTimer
    } = useTimer(200);

    const {create: createKeys} = useKeys();
    const container = useRef(null);
    let { height, width }
        = useContainer(container);

    const size = 6;
    height *= 0.8;
    width  *= 0.9;

    const action = useRef({
        create: createTimer,
        clear:  clearTimer,
        getState: () => {}
    });

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
        code:
            ' '.repeat(
                rows * cols),
        breaks: new Set(),
        select: null,
        end: true
    };

    const [state, dispatch]
        = useReducer(
            handleAction,
            initial);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';

        const wrapper = event => {
            dispatch({
                type: 'edit',
                payload: event
            });
        };

        createKeys(wrapper);
    }, [name, createKeys]);

    const handleChange = useCallback(
        position => {
            dispatch({
                type: 'click',
                payload: {
                    select:
                        position
                }
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
        type => {
            if (type !== 'stop')
                action.current.getState
                    = props.run(
                        state.code,
                        rows, cols);

            if (type === 'run')
                createTimer(
                    () => {
                        const type = state.end
                            ? 'stop' : 'next';

                        dispatch({
                            type,
                            payload: action
                        });
                    });
            else
                dispatch({
                    payload: action,
                    type
                });
        }, [createTimer]);

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
                    options={state.code}
                    handleChange={handleChange}
                    chooseColor={chooseColor} />
            </Editor>
        </EditorContext.Provider>
    );
}