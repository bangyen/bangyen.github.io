import {find} from '../helper';
import Grid from '../Grid';

function outer(obj) {


    function run(code) {
        if (code.every(
                e => !e.includes('*'))) {
            alert('No halt instruction detected!');
        }

        let size = code.length;
        let area = Math.pow(size, 2);
        let vel = [0, 1];
        let arr = [obj];
        let ind = 0;

        function move(pos) {
            let [a, b] = vel;
            let mod = pos % size;
            pos += (size * a) + area;

            if (!(mod % size - 1))
                pos += b * -size;

            return (pos + b) % area;
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
            let c = find(code, pos)[pos % size];
            let [a, b] = vel;
            tape = [...tape];

            if (c === '\\') {
                [a, b] = [b, a];
            } else if (c === '/') {
                [a, b] = [-b, -a];
            } else if (c === '<' && cell) {
                cell -= 1;
            } else if (c === '>') {
                cell += 1;
                if (cell === tape.length)
                    tape.push(0);
            } else if (c === '-') {
                tape[cell] ^= 1;
            } else if (c === '+' && !tape[cell]) {
                pos = move(pos);
            } else if (c === '*') {
                end = true;
                pos = null;
            }

            if (pos !== null)
                pos = move(pos);

            state = {
                pos: pos,
                tape: tape,
                cell: cell,
                end: end
            };
            arr.push(state);

            return state;
        };
    }

    return run;
}

export default function Back() {
    let obj = {
        end: false,
        pos: 0,
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