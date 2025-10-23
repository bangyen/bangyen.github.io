import React, {
    useRef,
    useEffect,
    useReducer,
    useCallback,
    useMemo,
} from 'react';
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

interface GridEditorProps {
    name: string;
    start: any;
    runner: (state: any) => any;
    tape?: boolean;
    output?: boolean;
    register?: boolean;
}

interface GridState {
    grid: string;
    select: number | null;
    pause: boolean;
    rows: number;
    cols: number;
    position?: number | null;
    [key: string]: unknown;
}

interface WrapperPayload {
    start: any;
    resetState: (grid: string) => any;
    nextIter: (action: any) => any;
    dispatch: (action: { type: string; payload?: unknown }) => void;
    create: (config: { repeat: () => void; speed: number }) => void;
    clear: () => void;
}

function useWrappers(
    state: GridState,
    props: GridEditorProps,
    dispatch: (action: any) => void
) {
    const { runner, start } = props;
    const { rows, cols } = state;

    const { create, clear } = useTimer(200);
    const nextIter = useCache(runner);

    const resetState = useCallback(
        (grid: string) => {
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
        (select: number) => () => {
            dispatch({
                type: 'click',
                payload: { select },
            });
        },
        [dispatch]
    );

    const chooseColor = useCallback(
        (square: number) => {
            const { position, select } = state;

            if (square === select) return 'primary';
            if (position !== null && square === position) return 'info';

            return 'secondary';
        },
        [state]
    );

    const wrapDispatch = useCallback(
        (type: string) => () => {
            const payload: WrapperPayload = {
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

export default function GridEditor(props: GridEditorProps): React.ReactElement {
    const { create: createKeys, clear: clearKeys } = useKeys();

    const { name, start, tape, output, register } = props;

    const container = useRef<HTMLDivElement>(null);
    let { height, width } = useContainer(container);

    const mobile = useMobile('sm');
    const size = mobile ? 4 : 6;
    const hide = true;

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

    const initial: GridState = {
        ...start,
        grid: ' '.repeat(rows * cols),
        select: null,
        pause: true,
        rows,
        cols,
    };

    const [state, dispatch] = useReducer(handleAction as any, initial);

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

        const wrapper = (event: KeyboardEvent) => {
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
        tapeFlag: tape || false,
        outFlag: output || false,
        regFlag: register || false,
        height: height / 0.8,
        index: 0,
        tape: [],
        pointer: 0,
        output: '',
        register: 0,
        code: undefined,
        fastForward: false,
        pause: state.pause || false,
    };

    return (
        <EditorContext.Provider value={context as any}>
            <Editor hide={hide} container={container as any}>
                <GridArea
                    rows={rows}
                    cols={cols}
                    options={state.grid?.split('') || []}
                    handleClick={handleClick}
                    chooseColor={chooseColor}
                />
            </Editor>
        </EditorContext.Provider>
    );
}
