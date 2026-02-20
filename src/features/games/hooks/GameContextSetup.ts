import { createContext } from 'react';

import type { BaseControlsProps } from './types';

export interface GameStateContextValue<S = unknown> {
    rows: number;
    cols: number;
    state: S;
    size: number;
    mobile: boolean;
    solved: boolean;
    handleNext: () => void;
    controlsProps: BaseControlsProps;
}

export type GameDispatchContextValue<A = unknown> = React.Dispatch<A>;

export const GameStateContext =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createContext<GameStateContextValue<any> | null>(null);

export const GameDispatchContext =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createContext<GameDispatchContextValue<any> | null>(null);
