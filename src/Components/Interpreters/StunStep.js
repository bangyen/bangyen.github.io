import TextEditor from './TextEditor';
import React from 'react';

function clean(input) {
    let code = '';

    for (let c of input)
        if ('+-><'.includes(c))
            code += c;

    return code;
}

function outer(obj) {
    function run(input) {
        const code = clean(input);
        const len = code.length;
        let arr = [obj];
        let num = 0;

        return function (back = false) {
            let state = arr[arr.length - 1];
            let {tape, ptr, end} = state;
            let c = code[num % len];

            if (back) {
                if (num)
                    num--;
            } else {
                num++;

                if (num % len === 0) {
                    end = true;
                } else if (state.end) {
                    if (tape[ptr]) {
                        end = false;
                    } else {
                        arr = [obj];
                        num = 0;
                    }
                }
            }

            if (num < arr.length)
                return arr[num];

            let ind = num % len;
            tape = [...tape];

            if (c === '+') {
                tape[ptr]++;
            } else if (tape[ptr]) {
                if (c === '-') {
                    tape[ptr]--;
                } else if (c === '>') {
                    ptr++;

                    if (ptr === tape.length)
                        tape.push(1);
                } else if (ptr) {
                    ptr--;
                }
            }

            state = {
                tape,
                ind,
                ptr,
                end
            };

            arr.push(state);
            return state;
        };
    }

    return run;
}

export default function StunStep() {
    let start = {
        tape: [1],
        ind: 0,
        ptr: 0,
        end: false
    };

    let run = outer(start);

    return <TextEditor
        name='Stun Step'
        start={start}
        run={run}
        clean={clean}
        tape={true} />;
}