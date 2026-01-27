import { getGrid, flipAdj } from './boardHandlers';
import { getProduct } from './matrices';

export function chaseLights(states: number[][][], dims: number): number[][][] {
    const newStates = [...states];
    let prev = states.at(-1);

    if (!prev) return newStates;

    for (let r = 1; r < dims; r++) {
        for (let c = 0; c < dims; c++) {
            if (!prev[r - 1][c]) continue;

            const next = flipAdj(r, c, prev);

            newStates.push(next);
            prev = next;
        }
    }

    return newStates;
}

export function fillRow(
    row: number[],
    dims: number
): {
    input: number[][];
    output: number[][];
} {
    const blank = Array(dims).fill(0);

    const inputStates: number[][] = [blank];
    const outputStates: number[][] = [blank];
    const last = [...blank];

    for (let c = 0; c < dims; c++) {
        if (!row[c]) continue;

        last[c] = 1;

        const input = [...last];
        const output = getProduct(input, dims, dims);

        inputStates.push(input);
        outputStates.push(output);
    }

    return {
        input: inputStates,
        output: outputStates,
    };
}

export function extendBack(states: number[][], size: number): number[][] {
    const back = states.at(-1);
    if (!back) return states;

    const extend = [...states];

    while (extend.length < size) extend.push([...back]);

    return extend;
}

export function getStates(
    grid: number[],
    dims: number
): {
    boardStates: number[][][];
    inputStates: number[][];
    outputStates: number[][];
} {
    let board = getGrid(dims, dims);

    for (const index of grid) {
        const row = Math.floor(index / dims);
        const col = index % dims;

        board = flipAdj(row, col, board);
    }

    const states = chaseLights([board], dims);
    const last = states.at(-1);
    if (!last) return { boardStates: [], inputStates: [], outputStates: [] };

    const row = last.at(-1);
    if (!row) return { boardStates: [], inputStates: [], outputStates: [] };

    const { input, output } = fillRow(row, dims);

    const before = states.length + input.length - 1;

    const top = output.at(-1);
    if (!top) return { boardStates: [], inputStates: [], outputStates: [] };

    let state = [...last];

    for (let i = 0; i < before - states.length; i++) {
        states.push([...last]);
    }
    for (let i = 0; i < before - input.length; i++) {
        input.unshift([...input[0]]);
    }
    for (let i = 0; i < before - output.length; i++) {
        output.unshift([...output[0]]);
    }

    for (let k = 0; k < dims; k++) {
        if (top[k]) {
            state = flipAdj(0, k, state);
            states.push([...state]);
        }
    }

    const boardStates = chaseLights(states, dims);
    const after = boardStates.length;

    const inputStates = extendBack(input, after);
    const outputStates = extendBack(output, after);

    return {
        boardStates,
        inputStates,
        outputStates,
    };
}

export function handleChase(state: unknown, action: unknown): unknown {
    const { type, dims, grid } = action as {
        type: string;
        dims: number;
        grid: number[];
    };

    if (type === 'chase') {
        return getStates(grid, dims);
    }

    return state;
}

export function getCalculator(rows: number, cols: number, dims: number) {
    return (
        row: number[]
    ): {
        boardStates: number[][][];
        inputStates: number[][];
        outputStates: number[][];
    } => {
        const { input, output } = fillRow(row, dims);

        const _inputStates = extendBack(input, rows);
        const outputStates = extendBack(output, rows);

        const states = getStates(outputStates.flat(), dims);

        return states;
    };
}
