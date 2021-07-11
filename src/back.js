export default function run(code) {
    let row = code.length;
    let col = code[0].length;
    let arr = [{
        end: false,
        pos: [0, 0],
        vel: [0, 1],
        tape: [0],
        cell: 0
    }];
    let ind = 0;

    return function(back = false) {
        let state = arr[arr.length - 1];

        if (back && ind)
            ind -= 1;
        else if (!back && !state.end)
            ind += 1;

        if (ind < arr.length)
            return arr[ind];

        let {tape, cell, end} = state;
        let [x, y] = state.pos;
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
        }

        x = (x + a) % row;
        y = (y + b) % col;
        state = {
            pos: [x, y],
            vel: [a, b],
            tape: tape,
            cell: cell,
            end: end
        };
        arr.push(state);

        return state;
    };
}