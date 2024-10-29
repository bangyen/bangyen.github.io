import TextEditor from './TextEditor';

function cleanInput(input) {
    let code = '';

    for (const char of input)
        if ('><!,.'.includes(char))
            code += char;

    return code;
}

function countRepeats(code) {
    const counts = [];
    let current  = '';
    let number   = 0;
    let highest  = 0;
    code += ' ';

    for (const char of code) {
        if (char === current)
            number++;
        else {
            if (number > highest
                    && current === '>')
                highest = number;

            counts.push(number);
            current = char;
            number  = 1;
        }
    }

    const memory
        = highest > 30
            && current !== '>';

    return { counts, memory };
}

function getState(state) {
    let {
        register,
        pointer,
        output,
        index,
        code,
        tape,
        end
    } = state;

    if (end)
        end = false;

    if (index === code.length)
        return {
            ...state,
            index: 0,
            end: true};

    const char = code[index++];
    tape = [...tape];

    switch (char) {
        case '>':
            if (tape.length
                    === ++pointer)
                tape.push(0);
            break;
        case '<':
            register
                += tape[pointer];
            pointer = 0;
            break;
        case '!':
            tape[pointer]
                -= register - 1;

            if (tape[pointer] < 0)
                tape[pointer] = 0;

            register = 0;
            pointer  = 0;
            break;
        case ',':
            const input
                = prompt('Input: ');

            if (input.length)
                register = input
                    .charCodeAt(0);
            else
                register = 0;
            break;
        case '.':
            if (register > 0)
                output += String
                    .fromCharCode(
                        register - 1);
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
        end
    };
}

export default function Editor() {
    const start = {
        register: 0,
        pointer: 0,
        output: '',
        tape: [0],
        index: 0,
        end: false
    };

    return (
        <TextEditor
            name='Suffolk'
            start={start}
            runner={getState}
            clean={cleanInput}
            tape
            output
            register />
    );
}