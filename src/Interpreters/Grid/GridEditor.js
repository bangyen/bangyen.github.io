import Editor, { EditorContext, GridArea } from '../Editor';
import { convertPixels } from '../../calculate';
import { handleAction } from './eventHandlers';
import { PAGE_TITLES } from '../../config/constants';

import {
    useContainer,
    useTimer,
    useKeys,
    useCache,
    useMobile,
} from '../../hooks';

import { useRef, useEffect, useReducer, useCallback, useMemo } from 'react';

function useWrappers(state, props, dispatch) {
    const { runner, start } = props;
    const { rows, cols } = state;

    const { create, clear } = useTimer(200);
    const nextIter = useCache(runner);

    const resetState = useCallback(
        grid => {
            clear();

            return nextIter({
                type: 'clear',
                payload: {
                    ...start,
                    grid,
                    rows,
                    cols,
                },
            });
        },
        [start, clear, nextIter, rows, cols]
    );

    const handleClick = useCallback(
        select => () => {
            dispatch({
                type: 'click',
                payload: { select },
            });
        },
        [dispatch]
    );

    const chooseColor = useCallback(
        square => {
            const { position, select } = state;

            if (square === select) return 'primary';
            if (square === position) return 'info';

            return 'secondary';
        },
        [state]
    );

    const wrapDispatch = useCallback(
        type => () => {
            const payload = {
                start,
                resetState,
                nextIter,
                dispatch,
                create,
                clear,
            };

            dispatch({ type, payload });
        },
        [resetState, nextIter, dispatch, create, clear, start]
    );

    return {
        resetState,
        handleClick,
        chooseColor,
        wrapDispatch,
    };
}

export default function GridEditor(props) {
    const { create: createKeys, clear: clearKeys } = useKeys();

    const { name, start, tape, output, register } = props;

    const container = useRef(null);
    let { height, width } = useContainer(container);

    const mobile = useMobile('sm');
    const size = mobile ? 4 : 6;
    const hide = true;

    // Add fallback dimensions to prevent empty grids
    height = (height || 400) * 0.8;
    width = (width || 600) * 0.95;

    if (!hide) {
        if (mobile) width /= 2;
        else width /= 1.5;
    }

    const { rows, cols } = useMemo(
        () => convertPixels(size, height, width),
        [size, height, width]
    );

    const initial = {
        ...start,
        grid: ' '.repeat(rows * cols),
        select: null,
        pause: true,
        rows,
        cols,
    };

    const [state, dispatch] = useReducer(handleAction, initial);

    const { resetState, handleClick, chooseColor, wrapDispatch } = useWrappers(
        state,
        props,
        dispatch
    );

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: {
                rows,
                cols,
                resetState,
            },
        });
    }, [rows, cols, resetState]);

    useEffect(() => {
        document.title = PAGE_TITLES.interpreter(name);

        const wrapper = event => {
            dispatch({
                type: 'edit',
                payload: {
                    key: event.key,
                    resetState,
                },
            });
        };

        createKeys(wrapper);

        return () => clearKeys();
    }, [name, createKeys, resetState, clearKeys]);

    const context = {
        name,
        size,
        ...state,
        dispatch: wrapDispatch,
        tapeFlag: tape,
        outFlag: output,
        regFlag: register,
        height: height / 0.8,
    };

    return (
        <EditorContext.Provider value={context}>
            <Editor hide={hide} container={container}>
                <GridArea
                    rows={rows}
                    cols={cols}
                    options={state.grid}
                    handleClick={handleClick}
                    chooseColor={chooseColor}
                />
            </Editor>
        </EditorContext.Provider>
    );
}
