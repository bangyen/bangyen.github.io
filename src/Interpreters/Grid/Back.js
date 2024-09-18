import { gridMove } from '../../calculate';
import GridEditor from './GridEditor';

function getState(state) {
    let {
        velocity,
        position,
        pointer,
        grid,
        tape,
        rows,
        cols,
        end
    } = state;

    if (end)
        return state;

    const sum  = velocity > 0 ? 3 : -3;
    const char = grid[position];
    tape = [...tape];

    switch (char) {
        case '\\':
            velocity
                = sum - velocity;
            break;
        case '/':
            velocity -= sum;
            break;
        case '<':
            if (pointer)
                pointer--;
            break;
        case '>':
            if (++pointer
                    === tape.length)
                tape.push(0);
            break;
        case '-':
            tape[pointer]
                ^= 1;
            break;
        case '+':
            let next;

            if (!tape[pointer])
                do {
                    position = gridMove(
                        position,
                        velocity,
                        rows,
                        cols);

                    next = grid[position];
                } while (!'\\/<>-+*'
                    .includes(next));
            break;
        case '*':
            position = null;
            end = true;
            break;
        default:
            break;
    }

    if (position !== null)
        position = gridMove(
            position,
            velocity,
            rows,
            cols);

    return {
        velocity,
        position,
        pointer,
        grid,
        tape,
        rows,
        cols,
        end
    };
}

export default function Editor() {
    let start = {
        velocity: 1,
        pointer: 0,
        position: 0,
        tape: [0],
        end: false
    };

    return (
        <GridEditor
            name='Back'
            start={start}
            runner={getState}
            tape />
    );
}