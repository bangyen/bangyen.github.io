import { createContext } from 'react';

export interface EditorContextType {
    name: string;
    tapeFlag: boolean;
    outFlag: boolean;
    regFlag: boolean;
    code: string[] | undefined;
    index: number;
    tape: number[];
    pointer: number;
    output: string[] | string;
    register: number;
    height: number;
    size: number;
    dispatch: (
        action: string | { type: string; payload: unknown }
    ) => (() => void) | undefined;
    fastForward: boolean;
    pause: boolean;
}

export const EditorContext = createContext<EditorContextType | null>(null);
