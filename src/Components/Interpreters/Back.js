import Grid from '../Grid';

function outer(obj) {
    function run(code) {
        if (code.every(
                e => !e.includes('*'))) {
            alert('No halt instruction detected!');
        }

        let row = code.length;
        let col = code[0].length;
        let arr = [obj];
        let ind = 0;

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
            let [x, y] = pos;
            let [a, b] = state.vel;
            let c = code[x][y];
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
                [x, y] = [x + a, y + b];
            } else if (c === '*') {
                end = true;
                pos = null;
            }

            x = (x + a + row) % row;
            y = (y + b + col) % col;
            state = {
                pos: pos ? [x, y] : pos,
                vel: [a, b],
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
        pos: [0, 0],
        vel: [0, 1],
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