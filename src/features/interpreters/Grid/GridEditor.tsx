import React, {
    useRef,
    useEffect,
    useReducer,
    useCallback,
    useMemo,
} from 'react';
import Editor from '../Editor';
import { EditorContext, EditorContextType } from '../EditorContext';
import { GridArea } from '../components/GridArea';
import { KeySelector } from '../components/KeySelector';
import { convertPixels } from '../utils/gridUtils';
import { handleAction, GridState, GridAction } from './eventHandlers';
import { PAGE_TITLES } from '../../../config/constants';
import { ToolbarPayload } from '../Toolbar';

import {
    useContainer,
    useTimer,
    useKeys,
    useCache,
    CacheAction,
    useMobile,
} from '../../../hooks';

// gridCache stores { rows, cols } for different interpreters
// Using a map to store cache per interpreter name if needed, or just a single cache
// as simpler interpreters might share dimensions.
let gridCache: { rows: number; cols: number } | null = null;

interface GridEditorProps<T extends GridState> {
    name: string;
    start: Partial<T>;
    runner: (state: T) => T;
    tape?: boolean;
    output?: boolean;
    register?: boolean;
    navigation?: React.ReactNode;
    keys?: string[];
}

interface WrapperPayload<T> {
    start: Partial<T>;
    resetState: (grid: string) => void;
    nextIter: (action: CacheAction) => T;
    dispatch: React.Dispatch<GridAction>;
    create: (config: { repeat: () => void; speed: number }) => void;
    clear: () => void;
}

function useWrappers<T extends GridState>(
    state: T,
    props: GridEditorProps<T>,
    dispatch: React.Dispatch<GridAction>
) {
    const { runner, start } = props;
    const { rows, cols } = state;

    const { create, clear } = useTimer(200);
    const nextIter = useCache<T>(runner);

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
            const payload: WrapperPayload<T> = {
                start,
                resetState,
                nextIter,
                dispatch,
                create,
                clear,
            };

            dispatch({
                type,
                payload: payload as unknown as ToolbarPayload,
            } as GridAction);
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

export default function GridEditor<T extends GridState>(
    props: GridEditorProps<T>
): React.ReactElement {
    const { create: createKeys, clear: clearKeys } = useKeys();

    const {
        name,
        start,
        tape,
        output,
        register,
        navigation,
        keys = [],
    } = props;

    const container = useRef<HTMLDivElement>(null);
    let { height, width } = useContainer(container);

    const mobile = useMobile('md');
    const size = mobile ? 4 : 6;
    const hide = true;

    height = (height || 400) * (mobile ? 1 : 0.8);
    width = (width || 600) * 0.95;

    if (!hide) {
        if (mobile) width /= 2;
        else width /= 1.5;
    }

    // Module-level cache for grid dimensions to prevent flash triggers
    // on interpreter switch. This assumes the layout size for grid editors
    // is consistent across different interpreters.
    const { rows, cols } = useMemo(() => {
        if (!container.current && gridCache) {
            return gridCache;
        }
        return convertPixels(size, height, width);
    }, [size, height, width]);

    useEffect(() => {
        if (container.current && rows > 0 && cols > 0) {
            gridCache = { rows, cols };
        }
    }, [rows, cols]);

    const initial: T = {
        ...start,
        grid: ' '.repeat(rows * cols),
        select: null,
        pause: true,
        rows,
        cols,
    } as T;

    const [state, dispatch] = useReducer(handleAction, initial);

    const { resetState, handleClick, chooseColor, wrapDispatch } = useWrappers(
        state as T,
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

    const handleEdit = useCallback(
        (key: string) => {
            if (key === 'Escape') {
                dispatch({
                    type: 'click',
                    payload: { select: state.select as number },
                });
                return;
            }

            dispatch({
                type: 'edit',
                payload: {
                    key,
                    resetState,
                },
            });
        },
        [resetState, state.select]
    );

    useEffect(() => {
        document.title = PAGE_TITLES.interpreter(name);

        const wrapper = (event: KeyboardEvent) => {
            handleEdit(event.key);
        };

        createKeys(wrapper);

        return () => clearKeys();
    }, [name, createKeys, handleEdit, clearKeys]);

    const context = {
        name,
        size,
        ...state,
        dispatch: wrapDispatch,
        tapeFlag: tape || false,
        outFlag: output || false,
        regFlag: register || false,
        height: height,
        index: 0,
        tape: [],
        pointer: 0,
        output: state.output || '',
        register: 0,
        code: undefined,
        fastForward: false,
        pause: state.pause || false,
    };

    return (
        <EditorContext.Provider value={context as unknown as EditorContextType}>
            <Editor hide={hide} container={container} navigation={navigation}>
                <GridArea
                    rows={rows}
                    cols={cols}
                    options={state.grid?.split('') || []}
                    handleClick={handleClick}
                    chooseColor={chooseColor}
                />
            </Editor>
            {mobile && state.select !== null && (
                <KeySelector keys={keys} onSelect={handleEdit} />
            )}
        </EditorContext.Provider>
    );
}
