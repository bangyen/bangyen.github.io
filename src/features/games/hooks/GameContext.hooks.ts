import { useContext } from 'react';

import { GameContext, type GameContextValue } from './GameContext';

export function useGameContext<S = unknown, A = unknown>() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context as GameContextValue<S, A>;
}

export function useOptionalGameContext<S = unknown, A = unknown>() {
    return useContext(GameContext) as GameContextValue<S, A> | null;
}
