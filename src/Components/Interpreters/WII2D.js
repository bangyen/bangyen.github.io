import {move} from '../helper';
import Grid from '../Grid';
import React from 'react';

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
                    ind--;
            } else {
                if (state.end)
                    arr = [obj];
                else
                    ind++;
            }

            if (ind < arr.length)
                return arr[ind];

            let {pos, end, out, acc} = state;
            let c = code[pos];

            if (str.includes(c))
                vel = dir[str.indexOf(c)];
            else if (+c)
                acc = +c;

            switch (c) {
                case '|':
                    vel = [-vel[0], -vel[1]];
                    break;
                case '@':
                    pos = close(pos, code);
                    pos -= size;

                    if (pos < 0)
                        pos += size * size;
                    break;
                case '+':
                    acc++;
                    break;
                case '-':
                    acc--;
                    break;
                case '*':
                    acc *= 2;
                    break;
                case 's':
                    acc = acc * acc;
                    break;
                case '/':
                    acc = Math.floor(acc / 2);
                    break;
                case '~':
                    out += String.fromCharCode(acc);
                    break;
                case '?':
                    let rnd = Math.random() * 4;
                    vel = dir[Math.floor(rnd)];
                    break;
                case '.':
                    pos = null;
                    end = true;
                    break;
                default:
                    break;
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