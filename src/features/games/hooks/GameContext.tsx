import type { ReactNode } from 'react';

import { GameContext, type GameContextValue } from './GameContextSetup';

export function GameProvider<S, A>({
    value,
    children,
}: {
    value: GameContextValue<S, A>;
    children: ReactNode;
}) {
    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
}
