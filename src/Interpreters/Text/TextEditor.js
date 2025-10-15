import { useEffect, useRef, useCallback, useReducer } from 'react';
import Editor, { EditorContext, TextArea } from '../Editor';
import { useTimer, useCache, useContainer } from '../../hooks';
import { handleToolbar } from '../Toolbar';
import { PAGE_TITLES } from '../../config/constants';

function handleAction(state, action) {
    const { type, payload } = action;
    const { nextIter, clear, create, dispatch } = payload;
    let newState = {};

    switch (type) {
        case 'ff':
            // Fast forward = increase speed or start if paused
            const repeat = () => dispatch({ type: 'timer', payload });

            if (state.pause) {
                // If paused, start with fast speed
                newState = { pause: false };
                create({ repeat, speed: 50 }); // 50ms instead of 200ms
            } else {
                // If running, increase speed by stopping current timer and creating faster one
                clear();
                newState = { pause: false };
                create({ repeat, speed: 10 }); // Even faster: 10ms
            }
            break;
        case 'edit':
            const { newText, clean } = payload;

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
            break;
        default:
            newState = handleToolbar(state, action);
            break;
    }

    return {
        ...state,
        ...newState,
    };
}

export default function TextEditor(props) {
    const { create, clear } = useTimer(200);

    const { runner, clean, name, start, tape, output, register } = props;

    const nextIter = useCache(runner);
    const container = useRef(null);

    const { height } = useContainer(container);

    const initial = {
        ...start,
        pause: true,
        text: '',
        code: '',
    };

    const [state, dispatch] = useReducer(handleAction, initial);

    const handleChange = useCallback(
        event => {
            const newText = event.target.value;

            dispatch({
                type: 'edit',
                payload: {
                    nextIter,
                    newText,
                    clean,
                    clear,
                },
            });
        },
        [nextIter, dispatch, clean, clear]
    );

    useEffect(() => {
        document.title = PAGE_TITLES.interpreter(name);
    }, [name]);

    const wrapDispatch = useCallback(
        type => () => {
            const payload = {
                start,
                nextIter,
                dispatch,
                create,
                clear,
            };

            dispatch({ type, payload });
        },
        [start, nextIter, create, clear]
    );

    const context = {
        name,
        ...state,
        dispatch: wrapDispatch,
        fastForward: true,
        tapeFlag: tape,
        outFlag: output,
        regFlag: register,
        readOnly: true,
        height,
    };

    const sideProps = {
        readOnly: true,
        infoLabel: 'RISC-V Equivalent',
        fillValue: 'addi x0, x0, 0',
        value: '',
    };

    return (
        <EditorContext.Provider value={context}>
            <Editor hide container={container} sideProps={sideProps}>
                <TextArea handleChange={handleChange} />
            </Editor>
        </EditorContext.Provider>
    );
}
