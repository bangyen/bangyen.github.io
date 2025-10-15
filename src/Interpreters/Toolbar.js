import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { TooltipButton } from '../helpers';
import { EditorContext } from './Editor';
import { useMobile } from '../hooks';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    FirstPageRounded,
    LastPageRounded,
    PauseRounded,
    InfoRounded,
    HomeRounded,
} from '../components/icons';

export function Toolbar() {
    const { name, dispatch, fastForward, pause } = useContext(EditorContext);

    const notMobile = !useMobile('sm');

    const link = 'https://esolangs.org/wiki/' + name.replace(' ', '_');

    const TimerButton = useMemo(
        () =>
            pause ? (
                <TooltipButton
                    key="Run"
                    title="Run"
                    onClick={dispatch('run')}
                    Icon={PlayArrowRounded}
                />
            ) : (
                <TooltipButton
                    key="Pause"
                    title="Pause"
                    onClick={dispatch('stop')}
                    Icon={PauseRounded}
                />
            ),
        [dispatch, pause]
    );

    const buttonData = {
        Reset: {
            icon: FirstPageRounded,
            action: 'reset',
            flag: true,
        },
        'Fast Forward': {
            icon: LastPageRounded,
            flag: fastForward,
            action: 'ff',
        },
        Previous: {
            icon: NavigateBeforeRounded,
            flag: notMobile,
            action: 'prev',
        },
        Next: {
            icon: NavigateNextRounded,
            flag: notMobile,
            action: 'next',
        },
        Info: {
            icon: InfoRounded,
            props: { href: link },
        },
        Home: {
            icon: HomeRounded,
            props: {
                component: Link,
                to: '/',
            },
        },
    };

    const buttons = [TimerButton];

    for (const key in buttonData) {
        const { icon, flag, action, props } = buttonData[key];

        if (action && flag)
            buttons.push(
                <TooltipButton
                    key={key}
                    title={key}
                    Icon={icon}
                    onClick={dispatch(action)}
                />
            );
        else if (props)
            buttons.push(
                <TooltipButton key={key} title={key} Icon={icon} {...props} />
            );
    }

    return buttons;
}

function updateHandler(payload) {
    return (type, flag) => {
        const { nextIter, clear } = payload;

        if (flag) clear();

        const result = nextIter({ type });

        return {
            ...result,
            select: null,
        };
    };
}

export function handleToolbar(state, action) {
    const { type, payload } = action;
    let newState = {};

    const { dispatch, nextIter, create, clear, start } = payload;

    const update = updateHandler(payload);

    const repeat = () => {
        dispatch({
            type: 'timer',
            payload,
        });
    };

    switch (type) {
        case 'run':
            create({ repeat, speed: 200 }); // Always use default speed
            break;
        case 'timer':
            const newType = state.end ? 'stop' : 'next';

            dispatch({
                type: newType,
                payload,
            });
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
                    ...start,
                },
            });
            break;
        case 'prev':
            newState = update('prev', true);
            break;
        case 'next':
            newState = update('next', false);
            break;
        default:
            break;
    }

    switch (type) {
        case 'run':
            newState.pause = false;
            break;
        case 'stop':
            newState.pause = true;
            break;
        case 'reset':
        case 'prev':
            newState.pause = true;
            break;
        default:
            break;
    }

    return newState;
}
