import {move} from '../helper';
import Grid from '../Grid';

function outer(obj) {
    function run(code) {
        if (code.every(
                e => !e.includes('*'))) {
            alert('No halt instruction detected!');
        }

        let size = code.length;
        let vel = [0, 1];
        let arr = [obj];
        let ind = 0;

        function wrap(pos) {
            return move({
                pos,
                vel,
                old: size
            });
        }

        return function(back = false) {
            let state = arr[arr.length - 1];

            if (back) {
                if (ind)
                    ind -= 1;
            } else {
                if (state.end)
                    arr = [obj];
                else
                    ind += 1;
            }

            if (ind < arr.length)
                return arr[ind];

            let {tape, cell, end, pos} = state;
            let c = code[pos];
            let [a, b] = vel;
            tape = [...tape];

            if (c === '\\') {
                vel = [b, a];
            } else if (c === '/') {
                vel = [-b, -a];
            } else if (c === '<' && cell) {
                cell -= 1;
            } else if (c === '>') {
                cell += 1;
                if (cell === tape.length)
                    tape.push(0);
            } else if (c === '-') {
                tape[cell] ^= 1;
            } else if (c === '+' && !tape[cell]) {
                do {
                    pos = wrap(pos);
                    c = code[pos];
                } while (!'\\/<>-+*'.includes(c));
            } else if (c === '*') {
                end = true;
                pos = null;
            }

            if (pos !== null)
                pos = wrap(pos);

            state = {
                pos,
                tape,
                cell,
                end
            };

            arr.push(state);
            return state;
        };
    }

    return run;
}

export default function Back() {
    let obj = {
        pos: 0,
        end: false,
        tape: [0],
        cell: 0
    };

    let run = outer(obj);
    return <Grid
        name='Back'
        start={obj}
        run={run}
        tape={true} />;
}