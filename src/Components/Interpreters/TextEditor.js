import { useState, useEffect, useRef } from 'react';
import Editor, {TextArea} from './Editor';
import { useTimer } from '../hooks';

function objectSetter(oldValues, setValues) {
    return (values) => {
        setValues({
            ...oldValues,
            ...values
        });
    };
}

function fastForwardHandler(
        change, setRepeat,
        reset, getState,
        setValues) {
    return () => {
        if (change.current)
            reset();

        setRepeat(null);
        let temp;

        do {
            temp = getState.current();
        } while (!temp.end);

        setValues(temp);
    };
}

function stopHandler(setRepeat, reset) {
    return () => {
        setRepeat(null);
        reset();
    };
}

function changeHandler(
        oldText, clean, change,
        setState, setCode, setText) {
    return (event) => {
        const text = event.target.value;

        if (text !== oldText) {
            const code = clean(text);
            change.current = true;

            setState({end: true});
            setCode(code);
            setText(text);
        }
    };
}

function getSwitch(
        change, setRepeat,
        setTimer, setValues,
        getState, reset) {
    return (mode) => {
        return () => {
            if (change.current) {
                reset();
            }

            if (mode === 'run') {
                setTimer();
            } else {
                setRepeat(null);
                const flag = mode === 'prev';
                const state = getState.current(flag);
                setValues(state);
            }
        };
    };
}

function runSetter(
        code, start,
        run, change,
        getState, setValues) {
    return () => {
        getState.current = run(code);
        change.current   = false;
        setValues(start);
    };
}

function timerSetter(
        setRepeat,
        setValues,
        getState) {
    return () => {
        const move = () => {
            const state
                = getState.current();
            setValues(state);

            if (state.end)
                setRepeat(null);
        };

        setRepeat(move);
    };
}

export default function TextEditor(props) {
    const {
        name, start,
        run,  out,
        tape, reg,
        clean
    } = props;

    const [values, setValues]
        = useState({...start, end: true});
    const [code, setCode] = useState('');
    const [text, setText] = useState('');

    const {setRepeat} = useTimer(200);
    const getState    = useRef(() => values);
    const change      = useRef(true);

    const setState = objectSetter(
        values, setValues);
    const setTimer = timerSetter(
        setRepeat, setValues, getState);
    const reset    = runSetter(
        code, start,
        run, change,
        getState, setState);
    const getRunner = getSwitch(
        change, setRepeat,
        setTimer, setValues,
        getState, reset);

    const handleChange = changeHandler(
        text, clean,
        change, setState,
        setCode, setText);
    const handleStop = stopHandler(
        setRepeat, reset);
    const handleFastForward
        = fastForwardHandler(
            change, setRepeat,
            reset, getState,
            setValues);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';
    }, [name]);

    return (
        <Editor
            code={code}
            name={name}
            start={start}
            values={values}
            flags={{
                tape: tape,
                out:  out,
                acc:  reg
            }}
            functions={{
                getRunner,
                handleStop,
                handleFastForward
            }}>
            <TextArea
                handleChange={handleChange} />
        </Editor>
    );
}