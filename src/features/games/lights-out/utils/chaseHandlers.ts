import { getGrid, flipAdj } from './boardHandlers';
import { getProduct } from './matrices';

export function chaseLights(states: number[][], dims: number): number[][] {
    const newStates = [...states];
    let prev = states.at(-1);

    if (!prev) return newStates;

    for (let r = 1; r < dims; r++) {
        const prevRow = prev[r - 1];
        if (prevRow === undefined) continue;

        for (let c = 0; c < dims; c++) {
            if (!((prevRow >> c) & 1)) continue;

            const next = flipAdj(r, c, prev, dims, dims);

            newStates.push(next);
            prev = next;
        }
    }

    return newStates;
}

export function fillRow(
    row: number[],
    dims: number,
): {
    input: number[][];
    output: number[][];
} {
    const blank = new Array(dims).fill(0) as number[];

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
    dims: number,
): {
    boardStates: number[][];
    inputStates: number[][];
    outputStates: number[][];
} {
    let board = getGrid(dims, dims);

    for (const index of grid) {
        const row = Math.floor(index / dims);
        const col = index % dims;

        board = flipAdj(row, col, board, dims, dims);
    }

    const states = chaseLights([board], dims);
    const last = states.at(-1);
    if (!last) return { boardStates: [], inputStates: [], outputStates: [] };

    const lastRowMask = last.at(-1) ?? 0;
    const row = Array.from({ length: dims }, (_, i) => (lastRowMask >> i) & 1);

    const { input, output } = fillRow(row, dims);

    const before = states.length + input.length - 1;

    const top = output.at(-1);
    if (!top) return { boardStates: [], inputStates: [], outputStates: [] };

    let state = [...last];

    while (states.length < before) {
        states.push([...last]);
    }

    const firstInput = input[0];
    while (input.length < before) {
        if (firstInput) input.unshift([...firstInput]);
    }
    const firstOutput = output[0];
    while (output.length < before) {
        if (firstOutput) output.unshift([...firstOutput]);
    }

    for (let k = 0; k < dims; k++) {
        if (top[k]) {
            state = flipAdj(0, k, state, dims, dims);
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

interface ChaseAction {
    type: string;
    dims: number;
    grid: number[];
}

export function handleChase(state: unknown, action: unknown): unknown {
    const { type, dims, grid } = action as ChaseAction;

    if (type === 'chase') {
        return getStates(grid, dims);
    }

    return state;
}

export function getCalculator(rows: number, _cols: number, dims: number) {
    return (
        row: number[],
    ): {
        boardStates: number[][];
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
