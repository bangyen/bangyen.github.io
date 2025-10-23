import React, { useEffect, useCallback, useReducer, useMemo } from 'react';
import Editor, { EditorContext, TextArea } from '../Editor';
import { useTimer, useCache, useContainer } from '../../hooks';
import {
    handleToolbar,
    type ToolbarState,
    type ToolbarAction,
} from '../Toolbar';
import { PAGE_TITLES } from '../../config/constants';

interface TextEditorProps {
    name: string;
    start: Record<string, unknown>;
    runner: (state: Record<string, unknown>) => Record<string, unknown>;
    clean: (text: string) => string;
    tape?: boolean;
    output?: boolean;
    register?: boolean;
}

interface TextState extends ToolbarState {
    text: string;
    code: string;
    tape?: number[];
    output?: string;
}

interface TextActionPayload {
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

function handleAction(
    state: TextState,
    action: { type: string; payload: TextActionPayload }
): TextState {
    const { type, payload } = action;
    const { nextIter, clear, create, dispatch } = payload;
    let newState: Partial<TextState> = {};

    switch (type) {
        case 'ff':
            const repeat = () => dispatch({ type: 'timer', payload });

            if (state.pause) {
                newState = { pause: false };
                create({ repeat, speed: 50 });
            } else {
                clear();
                newState = { pause: false };
                create({ repeat, speed: 10 });
            }
            break;
        case 'edit':
            const { newText, clean } = payload;

            if (newText && clean) {
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
        default:
            newState = handleToolbar(state, action as unknown as ToolbarAction);
            break;
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
}: TextEditorProps): React.ReactElement {
    const containerRef = React.createRef<HTMLDivElement>();
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
                return;
            }
        },
        [start, nextIter, create, clear, dispatch]
    );

    const context = useMemo(
        () => ({
            name,
            tapeFlag: tape || false,
            outFlag: output || false,
            regFlag: register || false,
            code: state.code ? [state.code] : [],
            index: (state.index as number) || 0,
            tape: state.tape || [],
            pointer: (state.pointer as number) || 0,
            output: state.output || '',
            register: (state.register as number) || 0,
            height: container.height,
            size: 0,
            dispatch: wrapDispatch,
            fastForward: true,
            pause: state.pause || false,
        }),
        [
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
            container.height,
            wrapDispatch,
        ]
    );

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
                container={containerRef as React.RefObject<HTMLDivElement>}
                sideProps={sideProps}
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
