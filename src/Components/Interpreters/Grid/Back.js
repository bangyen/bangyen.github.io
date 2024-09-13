import { gridMove } from '../../calculate';
import GridEditor from './GridEditor';

function getState(state) {
    let {
        velocity,
        gridptr,
        tapeptr,
        grid,
        tape,
        rows,
        cols,
        end
    } = state;

    const sum  = velocity > 0 ? 3 : -3;
    const char = grid[gridptr];
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
            if (tapeptr)
                tapeptr--;
            break;
        case '>':
            if (++tapeptr
                    === tape.length)
                tape.push(0);
            break;
        case '-':
            tape[tapeptr]
                ^= 1;
            break;
        case '+':
            let next;

            if (!tape[tapeptr])
                do {
                    gridptr = gridMove(
                        gridptr,
                        velocity,
                        rows,
                        cols);

                    next = grid[gridptr];
                } while (!'\\/<>-+*'
                    .includes(next));
            break;
        case '*':
            gridptr = null;
            end = true;
            break;
        default:
            break;
    }

    if (gridptr !== null)
        gridptr = gridMove(
            gridptr,
            velocity,
            rows,
            cols);

    return {
        velocity,
        gridptr,
        tapeptr,
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
        tapeptr: 0,
        gridptr: 0,
        grid: null,
        tape: [0],
        end: false
    };

    return <GridEditor
        name='Back'
        start={start}
        run={getState}
        tape />;
}