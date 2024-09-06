import TextBox from './TextBox';

function clean(input) {
    let code = '';

    for (let c of input)
        if ('><!,.'.includes(c))
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
            let c = code[num % len];
            let {end} = state;

            if (back) {
                if (num)
                    num--;
            } else {
                num++;

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

            switch (c) {
                case '>':
                    ptr++;
                    if (ptr === tape.length)
                        tape.push(0);
                    break;
                case '<':
                    acc += tape[ptr];
                    ptr = 0;
                    break;
                case '!':
                    tape[ptr] -= acc - 1;

                    if (tape[ptr] < 0)
                        tape[ptr] = 0;

                    acc = 0;
                    ptr = 0;
                    break;
                case ',':
                    let inp = '';

                    while (!inp.length)
                        inp = prompt('Input: ');

                    acc = inp.charCodeAt(0);
                    break;
                default:
                    if (acc > 0)
                        out += String
                            .fromCharCode(acc - 1);
                    break;
            }

            state = {
                tape, acc, ind,
                ptr,  out, end
            };

            arr.push(state);
            return state;
        };
    }

    return run;
}

export default function Suffolk() {
    const start = {
        tape: [0],
        acc: 0,
        ind: 0,
        ptr: 0,
        out: '',
        end: false
    };

    const run = outer(start);

    return <TextBox
        name='Suffolk'
        start={start}
        run={run}
        clean={clean}
        tape={true}
        out={true}
        reg={true} />;
}