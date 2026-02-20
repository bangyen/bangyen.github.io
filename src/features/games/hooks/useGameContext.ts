import { useContext } from 'react';

import {
    GameStateContext,
    GameDispatchContext,
    type GameStateContextValue,
    type GameDispatchContextValue,
} from './GameContextSetup';

export function useGameState<S = unknown>() {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameProvider');
    }
    return context as GameStateContextValue<S>;
}

export function useGameDispatch<A = unknown>() {
    const context = useContext(GameDispatchContext);
    if (!context) {
        throw new Error('useGameDispatch must be used within a GameProvider');
    }
    return context as GameDispatchContextValue<A>;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function useGameContext<S = unknown, A = unknown>() {
    const state = useGameState<S>();
    const dispatch = useGameDispatch<A>();
    return { ...state, dispatch };
}

export function useOptionalGameContext<S = unknown, A = unknown>() {
    const state = useContext(GameStateContext);
    const dispatch = useContext(GameDispatchContext);
    if (!state || !dispatch) return null;
    return { ...state, dispatch } as GameStateContextValue<S> & {
        dispatch: GameDispatchContextValue<A>;
    };
}

export function useOptionalGameState<S = unknown>() {
    return useContext(GameStateContext) as GameStateContextValue<S> | null;
}

export function useOptionalGameDispatch<A = unknown>() {
    return useContext(
        GameDispatchContext,
    ) as GameDispatchContextValue<A> | null;
}
