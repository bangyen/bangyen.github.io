import {move} from '../helper';
import Grid from './Grid';
import React from 'react';

function outer(obj) {
    function run(code, size) {
        if (!code.includes('*'))
            alert('No halt instruction detected!');

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
                    ind--;
            } else {
                if (state.end)
                    arr = [obj];
                else
                    ind++;
            }

            if (ind < arr.length)
                return arr[ind];

            let {tape, cell, end, pos} = state;
            let c = code[pos];
            let [a, b] = vel;
            tape = [...tape];

            switch (c) {
                case '\\':
                    vel = [b, a];
                    break;
                case '/':
                    vel = [-b, -a];
                    break;
                case '<':
                    if (cell)
                        cell--;
                    break;
                case '>':
                    cell++;
                    if (cell === tape.length)
                        tape.push(0);
                    break;
                case '-':
                    tape[cell] ^= 1;
                    break;
                case '+':
                    if (!tape[cell])
                        do {
                            pos = wrap(pos);
                            c = code[pos];
                        } while (!'\\/<>-+*'
                            .includes(c));
                    break;
                case '*':
                    end = true;
                    pos = null;
                    break;
                default:
                    break;
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