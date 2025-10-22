import TextEditor from './TextEditor';
import React from 'react';

interface StunStepState {
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

function clean(input: string): string {
    let code = '';

    for (const char of input) if ('+-><'.includes(char)) code += char;

    return code;
}

function getState(state: StunStepState): StunStepState {
    let { pointer, index, tape, end } = state;
    const { code } = state;

    if (end) {
        if (!tape[pointer]) return state;
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
        tape[pointer]++;
    } else if (tape[pointer]) {
        if (char === '-') {
            tape[pointer]--;
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

export default function Editor(): React.ReactElement {
    const start: StunStepStart = {
        pointer: 0,
        index: 0,
        tape: [0],
        end: false,
        code: '',
    };

    return <TextEditor name="Stun Step" start={start as unknown as Record<string, unknown>} runner={getState as unknown as (state: Record<string, unknown>) => Record<string, unknown>} clean={clean} tape />;
}

