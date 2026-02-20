import { createContext } from 'react';

import type { BaseControlsProps } from './types';

export interface GameContextValue<S = unknown, A = unknown> {
    rows: number;
    cols: number;
    state: S;
    dispatch: React.Dispatch<A>;
    size: number;
    mobile: boolean;
    solved: boolean;
    handleNext: () => void;
    controlsProps: BaseControlsProps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GameContext = createContext<GameContextValue<any, any> | null>(
    null,
);
