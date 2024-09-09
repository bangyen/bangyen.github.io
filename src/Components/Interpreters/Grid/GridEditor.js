import { useState, useRef } from 'react';
import Editor, { EditorContext, GridArea } from '../Editor';

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
    const { name, start, tape, out, reg } = props;
    const [values, setValues]
        = useState(start);
    const size = 6;

    const dispatch = useRef(() => () => {});
    const options = ' ' * size * size;
    const container = useRef(null);

    const context = {
        name,
        size,
        ...values,
        dispatch:
            dispatch.current,
        tapeFlag: tape,
        outFlag:  out,
        accFlag:  reg,
        container
    };

    return (
        <EditorContext.Provider
                value={context}>
            <Editor>
                <GridArea
                    options={options}
                    handleChange={() => {}}
                    chooseColor={() => 'secondary'} />
            </Editor>
        </EditorContext.Provider>
    );
}