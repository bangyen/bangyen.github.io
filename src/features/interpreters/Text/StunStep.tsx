import React, { useCallback } from 'react';

import TextEditor from './TextEditor';

export interface StunStepState {
    pointer: number;
    index: number;
    tape: number[];
    end: boolean;
    code: string;
}

interface StunStepStart {
    pointer: number;
    index: number;
    tape: number[];
    end: boolean;
    code: string;
}

export function clean(input: string): string {
    let code = '';

    for (const char of input) if ('+-><'.includes(char)) code += char;

    return code;
}

export function getState(state: StunStepState): StunStepState {
    let { pointer, index, tape, end } = state;
    const { code } = state;

    if (end) {
        if (tape[pointer] === undefined || !tape[pointer]) return state;
        else end = false;
    }

    if (index === code.length)
        return {
            ...state,
            index: 0,
            end: true,
        };

    const char = code[index++];
    tape = [...tape];

    if (char === '+') {
        const val = tape[pointer];
        if (val !== undefined) tape[pointer] = val + 1;
    } else if (tape[pointer]) {
        if (char === '-') {
            const val = tape[pointer];
            if (val !== undefined) tape[pointer] = val - 1;
        } else if (char === '>') {
            if (tape.length === ++pointer) tape.push(1);
        } else if (pointer) {
            pointer--;
        }
    }

    return {
        pointer,
        index,
        code,
        tape,
        end,
    };
}

export default function Editor({
    navigation,
}: {
    navigation?: React.ReactNode;
}): React.ReactElement {
    const start: StunStepStart = {
        pointer: 0,
        index: 0,
        tape: [0],
        end: false,
        code: '',
    };

    const memoizedRunner = useCallback(
        (state: Record<string, unknown>) =>
            getState(state as unknown as StunStepState) as unknown as Record<
                string,
                unknown
            >,
        []
    );

    const memoizedClean = useCallback((text: string) => clean(text), []);

    return (
        <TextEditor
            name="Stun Step"
            start={start as unknown as Record<string, unknown>}
            runner={memoizedRunner}
            clean={memoizedClean}
            tape
            navigation={navigation}
        />
    );
}
