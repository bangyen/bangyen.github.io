import { useEffect, useRef, useCallback, useReducer } from 'react';
import Editor, { EditorContext, TextArea } from '../Editor';
import { useTimer, useCache } from '../../hooks';

function startTimer(state, payload) {
    const {
        start,
        nextIter,
        dispatch,
        create,
        clear
    } = payload;

    const repeat = () => {
        dispatch({
            type: 'timer',
            payload});
    };

    const { code, end }
        = state;

    const initial = end
        ? {...state, end: false}
        : {...start, code};

    clear();
    nextIter({
        type: 'clear',
        payload: initial});
    create({repeat});
    console.log(initial);

    return initial;
}

function handleAction(state, action) {
    const { type, payload } = action;
    const { clear } = payload;
    let   newState  = {};

    const update = (type, flag) => {
        const { nextIter } = payload;

        if (flag)
            clear();

        const result
            = nextIter({
                type});

        return {
            ...result,
            select: null};
    };

    switch (type) {
        case 'run':
            newState = startTimer(
                state, payload);
            break;
        case 'timer':
            const newType = state.end
                ? 'stop' : 'next';

            payload.dispatch({
                type: newType,
                payload});
            break;
        case 'stop':
            clear();
            break;
        case 'prev':
            newState = update(
                'prev', true);
            break;
        case 'next':
            newState = update(
                'next', false);
            break;
        case 'ff':
            do {
                newState = update(
                    'next', false);
            } while (!newState.end);
            break;
        case 'edit':
            const {
                nextIter,
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
            break;
        default:
            break;
    }

    return {
        ...state,
        ...newState
    };
}

export default function TextEditor(props) {
    const {create, clear} = useTimer(200);

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

    const initial = {
        ...start,
        text: '',
        code: ''};

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
        handleChange,
        dispatch: wrapDispatch,
        fastForward: true,
        tapeFlag: tape,
        outFlag:  output,
        regFlag:  register,
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