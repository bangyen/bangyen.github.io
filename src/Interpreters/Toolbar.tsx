import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { TooltipButton } from '../helpers';
import { EditorContext } from './Editor';
import { useMobile } from '../hooks';
import { TIMER } from '../config/constants';

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

interface ButtonData {
    icon: React.ElementType;
    action?: string;
    flag?: boolean;
    props?: Record<string, unknown>;
}

interface ToolbarPayload {
    dispatch: (action: { type: string; payload: unknown }) => void;
    nextIter: (action: {
        type: string;
        payload: unknown;
    }) => Record<string, unknown>;
    create: (config: { repeat: () => void; speed: number }) => void;
    clear: () => void;
    start: Record<string, unknown>;
}

export interface ToolbarState {
    end?: boolean;
    pause?: boolean;
    [key: string]: unknown;
}

export interface ToolbarAction {
    type: string;
    payload: ToolbarPayload;
}

export function Toolbar(): React.ReactElement[] {
    const editorContext = useContext(EditorContext);
    const notMobile = !useMobile('sm');

    const link = editorContext
        ? 'https://esolangs.org/wiki/' + editorContext.name.replace(' ', '_')
        : '';
    const pause = editorContext?.pause || false;
    const dispatch = editorContext?.dispatch || (() => undefined);
    const fastForward = editorContext?.fastForward || false;

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

    if (!editorContext) return [];

    const buttonData: Record<string, ButtonData> = {
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

    const buttons: React.ReactElement[] = [TimerButton];

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

function updateHandler(payload: ToolbarPayload) {
    return (type: string, flag: boolean) => {
        const { nextIter, clear } = payload;

        if (flag) clear();

        const result = nextIter({ type, payload });

        return {
            ...result,
            select: null,
        };
    };
}

export function handleToolbar(
    state: ToolbarState,
    action: ToolbarAction
): ToolbarState {
    const { type, payload } = action;
    let newState: ToolbarState = {};

    const { dispatch, nextIter, create, clear, start } = payload;

    const update = updateHandler(payload);

    const repeat = () => {
        dispatch({
            type: 'timer',
            payload,
        });
    };

    const pauseStateMap: Record<string, boolean> = {
        run: false,
        stop: true,
        reset: true,
        prev: true,
    };

    switch (type) {
        case 'run':
            create({ repeat, speed: TIMER.defaultSpeed });
            newState.pause = pauseStateMap.run;
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
            newState.pause = pauseStateMap.stop;
            break;
        case 'reset':
            clear();

            // For text editors, preserve the code and text, only reset execution state
            const resetPayload = { ...state, ...start };

            // Preserve text and code if they exist (for text editors)
            if ('text' in state && 'code' in state) {
                resetPayload.text = state.text;
                resetPayload.code = state.code;
            }

            newState = nextIter({
                type: 'clear',
                payload: resetPayload,
            }) as ToolbarState;
            newState.pause = pauseStateMap.reset;
            break;
        case 'prev':
            newState = update('prev', true) as ToolbarState;
            newState.pause = pauseStateMap.prev;
            break;
        case 'next':
            newState = update('next', false) as ToolbarState;
            break;
        default:
            break;
    }

    return newState;
}
