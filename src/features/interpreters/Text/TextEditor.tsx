import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import { useTimer, useCache, useContainer } from '../../../hooks';
import { TextArea } from '../components/TextArea';
import Editor from '../Editor';
import { EditorContext } from '../EditorContext';
import {
    handleToolbar,
    type ToolbarState,
    type ToolbarAction,
} from '../Toolbar';

import { PAGE_TITLES } from '@/config/constants';

let textCache: { height: number } | null = null;

interface TextEditorProps {
    name: string;
    start: Record<string, unknown>;
    runner: (state: Record<string, unknown>) => Record<string, unknown>;
    clean: (text: string) => string;
    tape?: boolean;
    output?: boolean;
    register?: boolean;
    navigation?: React.ReactNode;
}

export interface TextState extends ToolbarState {
    text: string;
    code: string;
    tape?: number[];
    output?: string;
    index?: number;
    pointer?: number;
    register?: number;
}

export interface TextActionPayload {
    nextIter: (action: {
        type: string;
        payload: unknown;
    }) => Record<string, unknown>;
    clear: () => void;
    create: (config: { repeat: () => void; speed: number }) => void;
    dispatch: (action: { type: string; payload: TextActionPayload }) => void;
    start?: Record<string, unknown>;
    newText?: string;
    clean?: (text: string) => string;
}

export function handleAction(
    state: TextState,
    action: { type: string; payload: TextActionPayload }
): TextState {
    const { type, payload } = action;
    const { nextIter, clear, create, dispatch } = payload;
    let newState: Partial<TextState> = {};

    switch (type) {
        case 'ff': {
            const repeat = () => {
                dispatch({ type: 'timer', payload });
            };

            if (state.pause) {
                newState = { pause: false };
                create({ repeat, speed: 50 });
            } else {
                clear();
                newState = { pause: false };
                create({ repeat, speed: 10 });
            }
            break;
        }
        case 'edit': {
            const { newText, clean } = payload;

            if (newText !== undefined && clean) {
                newState = {
                    ...state,
                    text: newText,
                    code: clean(newText),
                };

                clear();
                nextIter({
                    type: 'clear',
                    payload: newState,
                });
                newState.pause = true;
            }
            break;
        }
        default: {
            newState = handleToolbar(state, action as unknown as ToolbarAction);
            break;
        }
    }

    return {
        ...state,
        ...newState,
    } as TextState;
}

export default function TextEditor({
    name,
    start,
    runner,
    clean,
    tape,
    output,
    register,
    navigation,
}: TextEditorProps): React.ReactElement {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const container = useContainer(containerRef);
    const [state, dispatch] = useReducer(handleAction, {
        ...start,
        pause: true,
        text: '',
        code: '',
    } as TextState);

    const { create, clear } = useTimer(200);
    const nextIter = useCache(runner as (state: unknown) => unknown);

    useEffect(() => {
        document.title = PAGE_TITLES.interpreter(name);
    }, [name]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            dispatch({
                type: 'edit',
                payload: {
                    newText: event.target.value,
                    clean,
                    nextIter: nextIter as unknown as (action: {
                        type: string;
                        payload: unknown;
                    }) => Record<string, unknown>,
                    clear,
                    create,
                    dispatch: dispatch as unknown as (action: {
                        type: string;
                        payload: TextActionPayload;
                    }) => void,
                },
            });
        },
        [clean, nextIter, clear, create, dispatch]
    );

    const handleChangeWrapper = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            handleChange(event as React.ChangeEvent<HTMLTextAreaElement>);
        },
        [handleChange]
    );

    const wrapDispatch = useCallback(
        (type: string | { type: string; payload: unknown }) => {
            if (typeof type === 'string') {
                return () => {
                    dispatch({
                        type,
                        payload: {
                            start,
                            nextIter: nextIter as unknown as (action: {
                                type: string;
                                payload: unknown;
                            }) => Record<string, unknown>,
                            dispatch,
                            create,
                            clear,
                        },
                    });
                };
            } else {
                dispatch({
                    type: type.type,
                    payload: {
                        ...(type.payload as TextActionPayload),
                        start,
                        nextIter: nextIter as unknown as (action: {
                            type: string;
                            payload: unknown;
                        }) => Record<string, unknown>,
                        dispatch,
                        create,
                        clear,
                    },
                });
            }
        },
        [start, nextIter, create, clear, dispatch]
    );

    const context = useMemo(() => {
        let { height } = container;

        if (height === 0 && textCache !== null) {
            height = textCache.height;
        }

        return {
            name,
            tapeFlag: tape ?? false,
            outFlag: output ?? false,
            regFlag: register ?? false,
            code: state.code ? Array.from(state.code) : [],
            index: state.index ?? 0,
            tape: state.tape ?? [],
            pointer: state.pointer ?? 0,
            output: state.output ?? '',
            register: state.register ?? 0,
            height,
            size: 0,
            dispatch: wrapDispatch,
            fastForward: true,
            pause: state.pause ?? false,
        };
    }, [
        container,
        name,
        tape,
        output,
        register,
        state.code,
        state.index,
        state.tape,
        state.pointer,
        state.output,
        state.register,
        state.pause,
        wrapDispatch,
    ]);

    useEffect(() => {
        if (container.height > 0) {
            textCache = { height: container.height };
        }
    }, [container.height]);

    const sideProps = {
        readOnly: true,
        infoLabel: 'RISC-V Equivalent',
        fillValue: 'addi x0, x0, 0',
        value: '',
    };

    return (
        <EditorContext.Provider value={context}>
            <Editor
                hide
                container={containerRef}
                sideProps={sideProps}
                navigation={navigation}
            >
                <TextArea
                    value={state.text}
                    placeholder="Enter your code here..."
                    handleChange={handleChangeWrapper}
                />
            </Editor>
        </EditorContext.Provider>
    );
}
