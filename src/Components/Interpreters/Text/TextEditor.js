import { useState, useEffect, useRef, useCallback } from 'react';
import Editor, {TextArea} from '../Editor';
import { useTimer } from '../../hooks';

function timerHandler(state, mutators) {
    const {setRepeat, setValues} = mutators;
    const {getter, end}          = state;

    const move = () => {
        const state = getter(true);
        setValues(state);

        if (end || state.end)
            setRepeat(null);
    };

    return flag => {
        if (flag) setRepeat(move);
        else      setRepeat(null);
    };
}

function getSwitch(state, setter) {
    const {start, end, getter} = state;

    return type => {
        switch (type) {
            case 'run':
                setter(true);
                break;
            case 'prev':
                return getter(false);
            case 'next':
                return getter(true);
            case 'ff':
                let state;

                do {
                    state = getter(true);
                } while (!(end || state.end));
                
                setter(false);
                return state;
            case 'stop':
                setter(false);
                break;
            default:
                break;
        }

        return start;
    };
}

export default function TextEditor(props) {
    const [text, setText] = useState('');
    const {setRepeat} = useTimer(200);

    const getState = useRef(() => start);
    const dispatch = useRef(() => {});
    const code     = useRef('');

    const { name, start } = props;
    const initial
        = {...start, end: true};

    const [values, setValues]
        = useState(initial);

    const handleChange
        = useCallback(
            (event) => {
                const newText
                    = event.target.value;

                if (newText !== text)
                    setText(newText);
            }, [text, setText]);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';
    }, [name]);


    useEffect(() => {
        const {run, clean, start} = props;
    
        code.current = clean(text);
        let change   = true;
        let end      = true;
    
        const getter   = getState.current;
        const mutators = {setRepeat, setValues};
        const state    = {start, end, getter};
    
        const setter
            = timerHandler(
                state, mutators);

        const getNext
            = getSwitch(
                state, setter);
    
        dispatch.current = type => {
            if (type === 'run' || change) {
                change = false;
    
                getState.current
                    = run(code.current);
            }
    
            const state = getNext(type);
            setValues(state);
            end = state.end;
        }
    }, [text, props, setRepeat]);


    const choose  = dispatch.current;
    const newCode = code.current;

    return (
        <Editor
            name={name}
            props={props}
            code={newCode}
            values={values}
            dispatch={choose}>
            <TextArea
                handleChange
                    ={handleChange} />
        </Editor>
    );
}