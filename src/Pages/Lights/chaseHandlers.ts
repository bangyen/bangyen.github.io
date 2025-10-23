import { getGrid, flipAdj } from './boardHandlers';
import { getProduct } from './matrices';

function chaseLights(states: number[][][], dims: number): number[][][] {
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

function fillRow(row: number[], dims: number): {
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

function extendBack(states: number[][], size: number): number[][] {
    const back = states.at(-1);
    if (!back) return states;

    const extend = [...states];

    for (let i = 0; i < size; i++) {
        extend.push([...back]);
    }

    return extend;
}

export function getStates(grid: number[][], dims: number): number[][][] {
    const states = [grid];

    return chaseLights(states, dims);
}

export function handleChase(state: unknown, action: unknown): unknown {
    const { type, dims, grid } = action as { type: string; dims: number; grid: number[][] };

    if (type === 'chase') {
        return getStates(grid, dims);
    }

    return state;
}

export function getCalculator(rows: number, cols: number, dims: number) {
    return (row: number[]): number[][][] => {
        const { input, output } = fillRow(row, dims);

        const inputStates = extendBack(input, rows);
        const outputStates = extendBack(output, rows);

        const states = getStates(outputStates, dims);

        return states;
    };
}

