import { useState, useEffect, useRef } from 'react';

import Editor, {TextEditor} from './Editor';

function objectSetter(oldValues, setValues) {
    return (values) => {
        setValues({
            ...oldValues,
            ...values
        });
    };
}

function fastForwardHandler(
        change, timerID, reset,
        getState, setValues) {
    return () => {
        if (change.current)
            reset();

        clearInterval(timerID.current);
        let temp;

        do {
            temp = getState.current();
        } while (!temp.end);

        setValues(temp);
    };
}

function stopHandler(timerID, reset) {
    return () => {
        clearInterval(timerID.current);
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
        change, speed, timerID,
        setTimer, setValues,
        getState, reset) {
    return (mode) => {
        return () => {
            if (change.current) {
                reset();
            }

            clearInterval(timerID.current);

            if (mode === 'run') {
                speed.current = 200;
                setTimer();
            } else {
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
        speed, timerID, end,
        setValues, getState) {
    return (mult = 1) => {
        const move = () => {
            const state
                = getState.current();
            setValues(state);

            if (state.end)
                clearInterval(
                    timerID.current);
        };

        speed.current *= mult;
        clearInterval(timerID.current);

        timerID.current
            = setInterval(
                move, speed.current);
    };
}

export default function TextBox(props) {
    const {
        clean, tape,
        name,  link,
        start, run,
        out,   acc,
    } = props;

    const [values, setValues]
        = useState({...start, end: true});
    const [code, setCode] = useState('');
    const [text, setText] = useState('');

    const getState = useRef(() => values);
    const timerID  = useRef(null);
    const change   = useRef(true);
    const speed    = useRef(200);

    const setState = objectSetter(
        values, setValues);
    const setTimer = timerSetter(
        speed, timerID, values.end,
        setValues, getState);
    const reset    = runSetter(
        code, start,
        run, change,
        getState, setState);
    const getRunner = getSwitch(
        change, speed, timerID,
        setTimer, setValues,
        getState, reset);

    const handleChange = changeHandler(
        text, clean,
        change, setState,
        setCode, setText);
    const handleStop = stopHandler(
        timerID, reset);
    const handleFastForward
        = fastForwardHandler(
            change, timerID,
            reset, getState,
            setValues);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';

        return () =>
            clearInterval(timerID.current);
    }, []);

    return (
        <Editor
            code={code}
            name={name}
            start={start}
            values={values}
            flags={{
                link: link,
                tape: tape,
                out:  out,
                acc:  acc
            }}
            functions={{
                getRunner,
                handleStop,
                handleFastForward
            }}>
            <TextEditor
                handleChange={handleChange} />
        </Editor>
    );
}