import TextEditor from './TextEditor';
import React, { useCallback } from 'react';

interface SuffolkState {
    register: number;
    pointer: number;
    output: string;
    index: number;
    tape: number[];
    end: boolean;
    code: string;
}

interface SuffolkStart {
    register: number;
    pointer: number;
    output: string;
    index: number;
    tape: number[];
    end: boolean;
    code: string;
}

function cleanInput(input: string): string {
    let code = '';

    for (const char of input) if ('><!,.'.includes(char)) code += char;

    return code;
}

function getState(state: SuffolkState): SuffolkState {
    let { register, pointer, output, index, tape, end } = state;
    const { code } = state;

    if (end) end = false;

    if (index === code.length)
        return {
            ...state,
            index: 0,
            end: true,
        };

    const char = code[index++];
    tape = [...tape];

    switch (char) {
        case '>':
            if (tape.length === ++pointer) tape.push(0);
            break;
        case '<':
            register += tape[pointer];
            pointer = 0;
            break;
        case '!':
            tape[pointer] -= register - 1;

            if (tape[pointer] < 0) tape[pointer] = 0;

            register = 0;
            pointer = 0;
            break;
        case ',':
            const input = prompt('Input: ');

            if (input && input.length) register = input.charCodeAt(0);
            else register = 0;
            break;
        case '.':
            if (register > 0) output += String.fromCharCode(register - 1);
            break;
        default:
            break;
    }

    return {
        register,
        pointer,
        output,
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
    const start: SuffolkStart = {
        register: 0,
        pointer: 0,
        output: '',
        index: 0,
        tape: [0],
        end: false,
        code: '',
    };

    const memoizedRunner = useCallback(
        (state: Record<string, unknown>) =>
            getState(state as unknown as SuffolkState) as unknown as Record<
                string,
                unknown
            >,
        []
    );

    const memoizedClean = useCallback((text: string) => cleanInput(text), []);

    return (
        <TextEditor
            name="Suffolk"
            start={start as unknown as Record<string, unknown>}
            runner={memoizedRunner}
            clean={memoizedClean}
            tape
            output
            register
            navigation={navigation}
        />
    );
}
