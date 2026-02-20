import type { ReactNode } from 'react';

import {
    GameStateContext,
    GameDispatchContext,
    type GameStateContextValue,
    type GameDispatchContextValue,
} from './GameContextSetup';

export function GameProvider<S, A>({
    stateValue,
    dispatchValue,
    children,
}: {
    stateValue: GameStateContextValue<S>;
    dispatchValue: GameDispatchContextValue<A>;
    children: ReactNode;
}) {
    return (
        <GameStateContext.Provider value={stateValue}>
            <GameDispatchContext.Provider value={dispatchValue}>
                {children}
            </GameDispatchContext.Provider>
        </GameStateContext.Provider>
    );
}
