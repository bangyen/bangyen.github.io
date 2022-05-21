import {move} from '../helper';
import Grid from '../Grid';

function outer(obj) {
    function error(str) {
        alert(str + ' start '
            + 'location detected!');

        let res = {end: true};
        obj.pos = null;

        return () => res;
    }

    function dist(x, y, size) {
        let diff = Math.abs(x - y);
        let quo = Math.floor(diff / size);
        let mod = diff % size;

        return quo + mod;
    }

    function comp(pos, size) {
        return (x, y) =>
            dist(pos, x, size)
          - dist(pos, y, size);
    }

    function close(pos, arr) {
        let size = arr.length;
        let warp = [];

        for (let k in arr)
            if (arr[k] === '@')
                warp.push(k);

        warp.sort(comp(pos, size));
        return warp.length > 1
            ? warp[1] : pos;
    }

    let str = '^v<>';
    let dir = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    function run(code, size) {
        obj.pos = null;
        let vel = dir[0];
        let arr = [obj];
        let ind = 0;

        if (!code.includes('!')) {
            return error('No');
        }

        for (let k in code)
            if (code[k] === '!') {
                if (obj.pos !== null)
                    return error('Additional');

                obj.pos = k;
            }

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

            let {pos, end, out, acc} = state;
            let c = code[pos];

            if (str.includes(c)) {
                vel = dir[str.indexOf(c)];
            } else if (c === '|') {
                vel = [-vel[0], -vel[1]];
            } else if (c === '@') {
                pos = close(pos, code);
                pos -= size;

                if (pos < 0)
                    pos += size * size;
            } else if (+c) {
                acc = +c;
            } else if (c === '+') {
                acc += 1;
            } else if (c === '-') {
                acc -= 1;
            } else if (c === '*') {
                acc *= 2;
            } else if (c === 's') {
                acc = acc * acc;
            } else if (c === '/') {
                acc = Math.floor(acc / 2);
            } else if (c === '~') {
                out += String.fromCharCode(acc);
            } else if (c === '?') {
                let rnd = Math.random() * 4;
                vel = dir[Math.floor(rnd)];
            } else if (c === '.') {
                pos = null;
                end = true;
            }

            if (pos !== null && c !== '@')
                pos = wrap(pos);

            state = {pos, end, out, acc};
            arr.push(state);

            return state;
        };
    }

    return run;
}

export default function WII2D() {
    let obj = {
        pos: null,
        end: false,
        out: '',
        acc: 0
    };

    let run = outer(obj);
    return <Grid
        name='WII2D'
        start={obj}
        run={run}
        out={true}
        reg={true} />;
}