import { useState, useEffect, useRef } from 'react';
import Editor, { GridArea } from './Editor';
import { useTimer } from '../hooks';
import { getDim, move } from '../oldHelpers';

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
        grid, size, start,
        run, change,
        getState, setValues) {
    return () => {
        getState.current = run(grid, size);
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

function changeColorHandler(setSelect) {
    return (pos) => {
        setSelect(prevSelect => prevSelect === pos ? null : pos);
    };
}

function chooseColorHandler(select, pos, breaks) {
    return (cell) => {
        if (cell === select) return 'primary';
        if (cell === pos) return 'info';
        if (breaks.includes(cell)) return 'warning';
        return 'secondary';
    };
}

export default function GridEditor(props) {
    const {
        clean, tape,
        name,  link,
        start, run,
        out,   acc,
    } = props;

    const [values, setValues] = useState({...start});
    const [size, setSize] = useState(5);
    const [grid, setGrid] = useState(' '.repeat(size * size));
    const [select, setSelect] = useState(null);
    const [pos, setPos] = useState(null);
    const [breaks, setBreaks] = useState([]);
    const [text, setText] = useState(false);
    const [edit, setEdit] = useState(false);
    const [stack, setStack] = useState(getDim());

    const { setRepeat } = useTimer(200);
    const getState = useRef(() => values);
    const change = useRef(true);

    const setState = objectSetter(values, setValues);
    const setTimer = timerSetter(setRepeat, setValues, getState);
    const reset = runSetter(grid, size, start, run, change, getState, setState);
    const getRunner = getSwitch(change, setRepeat, setTimer, setValues, getState, reset);

    const handleStop = stopHandler(setRepeat, reset);
    const handleFastForward = fastForwardHandler(change, setRepeat, reset, getState, setValues);
    const changeColor = changeColorHandler(setSelect);
    const chooseColor = chooseColorHandler(select, pos, breaks);

    useEffect(() => {
        document.title = name + ' Interpreter | Bangyen';
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [name]);

    const handleResize = () => {
        setStack(getDim());
    };

    // TODO: Implement changeText, clean, and changeSize functions

    return (
        <Editor
            code={grid}
            name={name}
            start={start}
            values={values}
            flags={{
                tape: tape,
                out: out,
                acc: acc
            }}
            functions={{
                getRunner,
                handleStop,
                handleFastForward
            }}>
            <GridArea
                value={grid}
                size={size}
                handleChange={changeColor}
                chooseColor={chooseColor} />
        </Editor>
    );
}