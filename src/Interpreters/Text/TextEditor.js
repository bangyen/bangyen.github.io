import { useEffect, useRef, useCallback, useReducer } from 'react';
import Editor, { EditorContext, TextArea } from '../Editor';
import { useTimer, useCache, useContainer } from '../../hooks';
import { handleToolbar } from '../Toolbar';

function handleAction(state, action) {
    const { type, payload }   = action;
    const { nextIter, clear } = payload;
    let newState = {};

    switch (type) {
        case 'ff':
            action.type = 'next';
            newState = {
                ...state,
                pause: true
            };

            do {
                const change
                    = handleToolbar(
                        newState, action);

                newState = {
                    ...newState,
                    ...change};
            } while (!newState.end);
            break;
        case 'edit':
            const {
                newText,
                clean
            } = payload;

            newState = {
                ...state,
                text: newText,
                code: clean(
                    newText)
            };

            clear();
            nextIter({
                type: 'clear',
                payload: newState});
            newState.pause = true;
            break;
        default:
            newState = handleToolbar(
                state, action);
            break;
    }

    return {
        ...state,
        ...newState
    };
}

export default function TextEditor(props) {
    const { create, clear } = useTimer(200);

    const {
        runner,
        clean,
        name,
        start,
        tape,
        output,
        register
    } = props;

    const nextIter  = useCache(runner);
    const container = useRef(null);

    const { height }
        = useContainer(container);

    const initial = {
        ...start,
        pause: true,
        text: '',
        code: ''
    };

    const [state, dispatch]
        = useReducer(
            handleAction,
            initial);

    const handleChange
        = useCallback(
            event => {
                const newText
                    = event.target.value;

                dispatch({
                    type: 'edit',
                    payload: {
                        nextIter,
                        newText,
                        clean,
                        clear}
                });
            }, [nextIter,
                dispatch,
                clean,
                clear]);

    useEffect(() => {
        document.title = name 
            + ' Interpreter | Bangyen';
    }, [name]);

    const wrapDispatch = useCallback(
        type => () => {
            const payload = {
                start,
                nextIter,
                dispatch,
                create,
                clear
            };

            dispatch({type, payload});
        }, [start,
            nextIter,
            create,
            clear]);

    const context = {
        name,
        ...state,
        dispatch:
            wrapDispatch,
        fastForward: true,
        tapeFlag: tape,
        outFlag:  output,
        regFlag:  register,
        readOnly: true,
        height
    };

    const sideProps = {
        readOnly: true,
        infoLabel: 'RISC-V Equivalent',
        fillValue: 'addi x0, x0, 0',
        value: null
    };

    return (
        <EditorContext.Provider
                value={context}>
            <Editor hide
                container={container}
                sideProps={sideProps}>
                <TextArea
                    handleChange
                        ={handleChange} />
            </Editor>
        </EditorContext.Provider>
    );
}