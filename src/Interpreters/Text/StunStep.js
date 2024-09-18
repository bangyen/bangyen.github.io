import TextEditor from './TextEditor';

function clean(input) {
    let code = '';

    for (const char of input)
        if ('+-><'.includes(char))
            code += char;

    return code;
}

function getState(state) {
    let {
        pointer,
        index,
        code,
        tape,
        end
    } = state;

    if (end)
        if (!tape[pointer])
            return state;
        else
            end = false;

    if (index === code.length)
        return {
            ...state,
            index: 0,
            end: true};

    const char = code[index++];
    tape = [...tape];

    if (char === '+') {
        tape[pointer]++;
    } else if (tape[pointer]) {
        if (char === '-') {
            tape[pointer]--;
        } else if (char === '>') {
            if (tape.length
                    === ++pointer)
                tape.push(1);
        } else if (pointer) {
            pointer--;
        }
    }

    return {
        pointer,
        index,
        code,
        tape,
        end
    };
}

export default function Editor() {
    let start = {
        pointer: 0,
        index: 0,
        tape: [1],
        end: false
    };

    return (
        <TextEditor
            name='Stun Step'
            runner={getState}
            clean={clean}
            start={start}
            tape />
    );
}