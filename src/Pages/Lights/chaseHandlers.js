import { getGrid, flipAdj } from './Lights/boardHandlers';
import { getProduct } from './matrices';

function chaseLights(states, dims) {
    let newStates = [...states];
    let prev      = states.at(-1);

    for (let r = 1; r < dims; r++) {
        for (let c = 0; c < dims; c++) {
            if (!prev[r - 1][c])
                continue;

            const next = flipAdj(
                r, c, prev);

            newStates.push(next);
            prev = next;
        }
    }

    return newStates;
}

function fillRow(row, dims) {
    const blank
        = Array(dims)
            .fill(0);

    const inputStates  = [blank];
    const outputStates = [blank];
    let last = [...blank];

    for (let c = 0; c < dims; c++) {
        if (!row[c])
            continue;

        last[c] = 1;

        const input  = [...last];
        const output = getProduct(
            input, dims, dims);

        inputStates.push(input);
        outputStates.push(output);
    }

    return {
        input:  inputStates,
        output: outputStates
    };
}

function extendBack(states, size) {
    const back   = states.at(-1);
    const extend = [...states];

    while (extend.length < size)
        extend.push(back);

    return extend;
}

function extendFront(states, size) {
    const extend = [...states];
    const front  = states[0];

    while (extend.length < size)
        extend.unshift(front);

    return extend;
}

export function getStates(start, dims) {
    let board = getGrid(dims, dims);

    for (const index of start) {
        const row = Math.floor(index / dims);
        const col = index % dims;

        board = flipAdj(
            row, col, board);
    }

    let states = chaseLights([board], dims);
    const last = states.at(-1);
    const row  = last.at(-1);

    let { input, output }
        = fillRow(row, dims);

    const before
        = states.length
        + input.length
        - 1;

    const top = output.at(-1);
    let state = last;

    states = extendBack(states, before);
    input  = extendFront(input, before);
    output = extendFront(output, before);

    for (let k = 0; k < dims; k++) {
        if (top[k]) {
            state = flipAdj(0, k, state);
            states.push(state);
        }
    }

    const boardStates = chaseLights(states, dims);
    const after       = boardStates.length;

    const inputStates  = extendBack(input,  after);
    const outputStates = extendBack(output, after);

    return {
        boardStates,
        inputStates,
        outputStates
    };
}
