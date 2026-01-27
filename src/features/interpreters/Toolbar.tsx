import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { TooltipButton } from '../../components/ui/Controls';
import { EditorContext } from './EditorContext';
import { useMediaQuery } from '../../components/mui';
import { GLOBAL_CONFIG } from '../../config/constants';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    FirstPageRounded,
    LastPageRounded,
    PauseRounded,
    InfoRounded,
    HomeRounded,
} from '../../components/icons';

interface ButtonData {
    icon: React.ElementType;
    action?: string;
    flag?: boolean;
    props?: Record<string, unknown>;
}

export interface ToolbarPayload {
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
    const notMobile = useMediaQuery('(min-width:650px)');

    const link = editorContext
        ? 'https://esolangs.org/wiki/' + editorContext.name.replace(' ', '_')
        : '';
    const pause = editorContext?.pause || false;
    const dispatch = useMemo(
        () => editorContext?.dispatch || (() => undefined),
        [editorContext]
    );
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
    };

    const buttons: React.ReactElement[] = [];
    const ffData = buttonData['Fast Forward'];

    // Primary Playback Controls: Run/Pause, Reset, Fast Forward
    buttons.push(TimerButton);

    buttons.push(
        <TooltipButton
            key="Reset"
            title="Reset"
            Icon={FirstPageRounded}
            onClick={dispatch('reset')}
        />
    );
    buttons.push(
        <TooltipButton
            key="Fast Forward"
            title="Fast Forward"
            Icon={ffData.icon}
            onClick={ffData.flag ? dispatch('ff') : undefined}
            disabled={!ffData.flag}
            sx={{
                opacity: ffData.flag ? 1 : 0.3,
                // Ensure visibility even when disabled
                '&.Mui-disabled': {
                    color: 'inherit',
                    opacity: 0.3,
                },
            }}
        />
    );

    // Secondary Controls: Previous, Next
    const secondaryKeys = ['Previous', 'Next'];
    secondaryKeys.forEach(key => {
        const { icon, flag, action } = buttonData[key];

        if (action && flag) {
            buttons.push(
                <TooltipButton
                    key={key}
                    title={key}
                    Icon={icon}
                    onClick={dispatch(action)}
                />
            );
        }
    });

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

    const { dispatch, create, clear } = payload;

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
            create({ repeat, speed: GLOBAL_CONFIG.timer.defaultSpeed });
            newState.pause = pauseStateMap.run;
            break;
        case 'timer': {
            const newType = state.end ? 'stop' : 'next';

            dispatch({
                type: newType,
                payload,
            });
            break;
        }
        case 'stop': {
            clear();
            newState.pause = pauseStateMap.stop;
            break;
        }
        case 'reset': {
            const confirm = window.confirm(
                'Are you sure you want to reset the code?'
            );
            if (confirm) {
                newState = update('clear', true) as ToolbarState;
                newState.pause = pauseStateMap.reset;
            }
            break;
        }
        case 'prev': {
            newState = update('prev', true) as ToolbarState;
            newState.pause = pauseStateMap.prev;
            break;
        }
        case 'next': {
            newState = update('next', false) as ToolbarState;
            break;
        }
        case 'share': {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            // TODO: Toast notification
            break;
        }
        default:
            break;
    }

    return newState;
}
