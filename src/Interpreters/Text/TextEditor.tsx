import { useEffect, useRef, useCallback, useReducer } from 'react';
import Editor, { EditorContext, TextArea } from '../Editor';
import { useTimer, useCache, useContainer } from '../../hooks';
import { handleToolbar, type ToolbarState, type ToolbarAction } from '../Toolbar';
import { PAGE_TITLES } from '../../config/constants';

interface TextEditorProps {
    name: string;
    start: Record<string, unknown>;
    runner: (state: Record<string, unknown>) => Record<string, unknown>;
    clean: (text: string) => string;
    tape?: boolean;
    output?: boolean;
}

interface TextState extends ToolbarState {
    text: string;
    code: string;
    tape?: number[];
    output?: string;
}

interface TextActionPayload {
    nextIter: (action: { type: string; payload: unknown }) => Record<string, unknown>;
    clear: () => void;
    create: (config: { repeat: () => void; speed: number }) => void;
    dispatch: (action: { type: string; payload: TextActionPayload }) => void;
    newText?: string;
    clean?: (text: string) => string;
}

function handleAction(state: TextState, action: { type: string; payload: TextActionPayload }): TextState {
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

export default function TextEditor({ name, start, runner, clean, tape, output }: TextEditorProps): React.ReactElement {
    const container = useContainer({});
    const [state, dispatch] = useReducer(handleAction, {
        ...start,
        pause: true,
        text: '',
        code: '',
    } as TextState);

    const { create, clear } = useTimer(200);
    const nextIter = useCache(runner as (state: unknown) => unknown);
    const textRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const titleKey = name.toLowerCase().replace(' ', '_') as keyof typeof PAGE_TITLES;
        document.title = PAGE_TITLES[titleKey] || PAGE_TITLES.interpreters;
    }, [name]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            dispatch({
                type: 'edit',
                payload: {
                    newText: event.target.value,
                    clean,
                    nextIter: nextIter as unknown as (action: { type: string; payload: unknown }) => Record<string, unknown>,
                    clear,
                    create,
                    dispatch: dispatch as unknown as (action: { type: string; payload: TextActionPayload }) => void,
                },
            });
        },
        [clean, nextIter, clear, create, dispatch]
    );

    return (
        <Editor container={container}>
            <TextArea
                value={state.text}
                handleChange={handleChange}
                ref={textRef}
            />
            {tape && <Tape tape={state.tape as number[]} />}
            {output && <Output output={state.output as string} />}
        </Editor>
    );
}

function Tape({ tape }: { tape: number[] }): React.ReactElement {
    return <div>{tape ? tape.join(', ') : '[]'}</div>;
}

function Output({ output }: { output: string }): React.ReactElement {
    return <div>{output || 'Empty'}</div>;
}

