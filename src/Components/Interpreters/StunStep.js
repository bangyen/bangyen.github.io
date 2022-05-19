import TextBox from '../TextBox';

function outer(obj) {
    function run(input) {
        let code = '';

        for (let c of input)
            if ('+-><'.includes(c))
                code += c;

        let len = code.length;
        let arr = [obj];
        let num = 0;

        function inner(back = false) {
            let state = arr[arr.length - 1];
            let {tape, ptr, end} = state;
            let c = code[num % len];

            if (back) {
                if (num)
                    num -= 1;
            } else {
                num += 1;

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
                tape[ptr] += 1;
            } else if (tape[ptr]) {
                if (c === '-') {
                    tape[ptr] -= 1;
                } else if (c === '>') {
                    ptr += 1;

                    if (ptr === tape.length)
                        tape.push(1);
                } else if (ptr) {
                    ptr -= 1;
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

        return {
            run: inner,
            code
        };
    }

    return run;
}

export default function StunStep() {
    let obj = {
        tape: [1],
        ind: 0,
        ptr: 0,
        end: false
    };

    let run = outer(obj);
    return <TextBox
        name='Stun Step'
        link='Stun_Step'
        start={obj}
        run={run}
        tape={true} />;
}