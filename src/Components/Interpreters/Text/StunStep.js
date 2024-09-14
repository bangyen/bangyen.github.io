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

    if (index === code.length) {
        if (tape[pointer])
            end = false;
        else
            index = 0;
    }

    if (++index === code.length)
        return {
            ...state,
            end: true};

    const char = code[index];
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