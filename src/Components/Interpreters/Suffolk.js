import TextBox from '../TextBox';

function run(input) {
    let code = '';

    for (let c of input)
        if ('><!,.'.includes(c))
            code += c;

    let len = code.length;
    let arr = [{
        tape: [0],
        acc: 0,
        ind: 0,
        ptr: 0,
        out: '',
        end: false
    }];

    return function(back = false) {
        let state = arr[arr.length - 1];
        let ind = state.ind;
        let c = code[ind % len];

        if (back && ind)
            ind -= 1;
        else if (!back && !state.end)
            ind += 1;

        if (ind < arr.length)
            return arr[ind];

        let {tape, acc, ptr, out, end}
            = state;
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
        } else if (c === '.') {
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
}

export default Suffolk() {
    return <TextBox run={run} />;
}