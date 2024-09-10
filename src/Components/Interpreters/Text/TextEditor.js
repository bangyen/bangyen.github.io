import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Editor, { EditorContext, TextArea } from '../Editor';
import { useTimer } from '../../hooks';

function timerHandler(state, mutators) {
    const {setValues, create, clear}
        = mutators;
    const {getState, end} = state;

    const repeat = () => {
        const get   = getState.current;
        const state = get(false);
        setValues(state);

        if (end.current || state.end)
            clear();
    };

    return flag => {
        clear();

        if (flag)
            create({repeat});
    };
}

function getSwitch(state, setter) {
    const {start, getState} = state;

    return type => {
        const get = getState.current;

        switch (type) {
            case 'run':
                setter(true);
                return start;
            case 'prev':
                return get(true);
            case 'next':
                return get(false);
            case 'ff':
                setter(false);
                let state;

                do {
                    state = get(false);
                } while (!state.end);

                return state;
            case 'stop':
                setter(false);
                break;
            default:
                break;
        }

        return prev => prev;
    };
}

export default function TextEditor(props) {
    const [text, setText] = useState('');
    const {create, clear} = useTimer(200);

    const container = useRef(null);
    const getState  = useRef(() => start);
    const dispatch  = useRef(() => {});
    const end       = useRef(true);
    const code      = useRef('');

    const {
        name,
        start,
        tape,
        out,
        reg
    } = props;

    const initial
        = {...start, end: true};

    const [values, setValues]
        = useState(initial);

    const handleChange
        = useCallback(
            event => {
                const newText
                    = event.target.value;

                setText(newText);
            }, [setText]);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';
    }, [name]);

    useEffect(clear, [text, clear]);


    dispatch.current = useMemo(() => {
        const { run, clean, start } = props;

        code.current = clean(text);
        end.current  = true;
        let change   = true;

        const mutators = {setValues, create, clear};
        const state    = {start, end, getState};

        const setter
            = timerHandler(
                state, mutators);

        const getNext
            = getSwitch(
                state, setter);

        return type => {
            return () => {
                if (type === 'run' || change) {
                    change = false;

                    getState.current
                        = run(code.current);
                }

                const next  = getNext(type);
                end.current = next.end;
                setValues(next);
            };
        };
    }, [text, props, create, clear]);


    const context = {
        name,
        ...values,
        handleChange,
        dispatch: dispatch.current,
        code:     code.current,
        tapeFlag: tape,
        outFlag:  out,
        accFlag:  reg,
        container
    };

    return (
        <EditorContext.Provider
                value={context}>
            <Editor>
                <TextArea />
            </Editor>
        </EditorContext.Provider>
    );
}