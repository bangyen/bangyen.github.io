import TextBox from '../TextBox';

let obj = {
        tape: [0],
        acc: 0,
        ind: 0,
        ptr: 0,
        out: '',
        end: false
    };

function run(input) {
    let code = '';

    for (let c of input)
        if ('><!,.'.includes(c))
            code += c;

    let len = code.length;
    let arr = [obj];
    let num = 0;

    function inner(back = false) {
        let state = arr[arr.length - 1];
        let c = code[num % len];
        let {end} = state;

        if (back) {
            if (num)
                num -= 1;
        } else {
            num += 1;

            if (num % len === 0)
                end = true;
            else if (state.end)
                end = false;
        }

        if (num < arr.length)
            return arr[num];

        let {tape, acc, ptr, out} = state;
        let ind = num % len;
        tape = [...tape];

        if (c === '>') {
            ptr += 1;
            if (ptr === tape.length)
                tape.push(0);
        } else if (c === '<') {
            acc += tape[ptr];
            ptr = 0;
        } else if (c === '!') {
            tape[ptr] -= acc - 1;

            if (tape[ptr] < 0)
                tape[ptr] = 0;

            acc = 0;
            ptr = 0;
        } else if (c === ',') {
            let inp = '';

            while (!inp.length)
                inp = prompt('Input: ');

            acc = inp.charCodeAt(0);
        } else {
            if (acc > 0)
                out += String
                    .fromCharCode(acc - 1);
        }

        state = {
            tape: tape,
            acc: acc,
            ind: ind,
            ptr: ptr,
            out: out,
            end: end
        };

        arr.push(state);
        return state;
    };

    return {
        run: inner,
        code: code
    };
}

export default function Suffolk() {
    return <TextBox
        name='Suffolk'
        start={obj}
        run={run}
        tape={true}
        out={true}
        reg={true} />;
}