import { useState, useRef, useMemo } from 'react';
import Editor, { GridArea } from '../Editor';
import { useWindow, useTimer } from '../../hooks';
import { convertPixels } from '../../helpers';

function timerHandler(state, mutators) {
    const {setValues, create, destroy}
        = mutators;
    const {getState, end} = state;

    const repeat = () => {
        const get   = getState.current;
        const state = get(false);
        setValues(state);

        if (end.current || state.end)
            destroy();
    };

    return flag => {
        destroy();

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

export default function GridEditor(props) {
    const { name, start } = props;
    const [values, setValues]
        = useState(start);
    const size = 6;

    const dispatch = useRef(() => () => {});
    const options = ' ' * size * size;
    const container = useRef(null);

    return (
        <Editor
            container={container}
            name={name}
            props={props}
            values={values}
            dispatch={dispatch.current}>
            <GridArea
                container={container}
                size={size}
                options={options}
                handleChange={() => {}}
                chooseColor={() => 'secondary'} />
        </Editor>
    );
}