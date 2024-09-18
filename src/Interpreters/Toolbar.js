import { useContext, useMemo } from 'react';
import { EditorContext } from './Editor';
import { TooltipButton } from '../helpers';
import { Link } from 'react-router-dom';

import {
    PlayArrowRounded,
    PauseRounded,
    FirstPageRounded,
    NavigateBeforeRounded,
    NavigateNextRounded,
    LastPageRounded,
    InfoRounded,
    HomeRounded
} from '@mui/icons-material';

export function Toolbar() {
    const { name, dispatch, fastForward, pause }
        = useContext(EditorContext);

    const link = 'https://esolangs.org/wiki/'
        + name.replace(' ', '_');

    const ForwardButton
        = useMemo(() => fastForward ?
        <TooltipButton
            key='Fast Forward'
            title='Fast Forward'
            onClick={dispatch('ff')}
            Icon={LastPageRounded} />
        : null,
        [fastForward, dispatch]);

    const TimerButton = useMemo(
        () => pause ?
        <TooltipButton
            key='Run'
            title='Run'
            onClick={dispatch('run')}
            Icon={PlayArrowRounded} />
        : <TooltipButton
            key='Pause'
            title='Pause'
            onClick={dispatch('stop')}
            Icon={PauseRounded} />,
        [dispatch, pause]);

    return [
        TimerButton,
        <TooltipButton
            key='Reset'
            title='Reset'
            onClick={dispatch('reset')}
            Icon={FirstPageRounded} />,
        <TooltipButton
            key='Previous'
            title='Previous'
            onClick={dispatch('prev')}
            Icon={NavigateBeforeRounded} />,
        <TooltipButton
            key='Next'
            title='Next'
            onClick={dispatch('next')}
            Icon={NavigateNextRounded} />,
        ForwardButton,
        <TooltipButton
            key='Info'
            href={link}
            title='Info'
            Icon={InfoRounded} />,
        <TooltipButton
            to="/"
            key='Home'
            title='Home'
            component={Link}
            Icon={HomeRounded} />
    ];
}

function updateHandler(payload) {
    return (type, flag) => {
        const { nextIter, clear }
            = payload;

        if (flag)
            clear();

        const result
            = nextIter({type});

        return {
            ...result,
            select: null};
    };
}

export function handleToolbar(state, action) {
    const { type, payload } = action;
    let newState = {};

    const {
        dispatch,
        nextIter,
        create,
        clear,
        start
    } = payload;

    const update
        = updateHandler(
            payload);

    const repeat = () => {
        dispatch({
            type: 'timer',
            payload
        });
    };

    switch (type) {
        case 'run':
            create({repeat});
            break;
        case 'timer':
            const newType = state.end
                ? 'stop' : 'next';

            dispatch({
                type: newType,
                payload});
            break;
        case 'stop':
            clear();
            break;
        case 'reset':
            clear();

            newState = nextIter({
                type: 'clear',
                payload: {
                    ...state,
                    ...start}});
            break;
        case 'prev':
            newState = update(
                'prev', true);
            break;
        case 'next':
            newState = update(
                'next', false);
            break;
        default:
            break;
    }

    switch (type) {
        case 'run':
            newState.pause
                = false;
            break;
        case 'stop':
        case 'reset':
        case 'prev':
            newState.pause
                = true;
            break;
        default:
            break;
    }

    return newState;
}
