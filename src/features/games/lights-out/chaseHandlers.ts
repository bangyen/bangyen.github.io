import { getGrid, flipAdj } from './boardHandlers';
import { getProduct } from './matrices';

function chaseLights(
    states: number[][][],
    dims: number
): { states: number[][][]; presses: (number[] | null)[] } {
    const newStates = [...states];
    const presses: (number[] | null)[] = [];
    let prev = states[states.length - 1];

    if (!prev) return { states: newStates, presses };

    for (let r = 1; r < dims; r++) {
        for (let c = 0; c < dims; c++) {
            if (!prev[r - 1][c]) continue;

            presses.push([r, c]);
            const next = flipAdj(r, c, prev);

            newStates.push(next);
            prev = next;
        }
    }

    return { states: newStates, presses };
}

function fillRow(
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

function extendBack(states: number[][], size: number): number[][] {
    const back = states[states.length - 1];
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
    pressStates: (number[] | null)[];
} {
    let board = getGrid(dims, dims);

    for (const index of grid) {
        const row = Math.floor(index / dims);
        const col = index % dims;

        board = flipAdj(row, col, board);
    }

    const { states: chase1, presses: presses1 } = chaseLights([board], dims);
    const last = chase1[chase1.length - 1];
    if (!last)
        return {
            boardStates: [],
            inputStates: [],
            outputStates: [],
            pressStates: [],
        };

    const row = last[last.length - 1];
    if (!row)
        return {
            boardStates: [],
            inputStates: [],
            outputStates: [],
            pressStates: [],
        };

    const { input, output } = fillRow(row, dims);

    const before = chase1.length + input.length - 1;

    const top = output[output.length - 1];
    if (!top)
        return {
            boardStates: [],
            inputStates: [],
            outputStates: [],
            pressStates: [],
        };

    let state = [...last];
    const states = [...chase1];
    const pressStates: (number[] | null)[] = [...presses1];

    for (let i = 0; i < before - chase1.length; i++) {
        states.push([...last]);
        pressStates.push(null);
    }
    for (let i = 0; i < before - input.length; i++) {
        input.unshift([...input[0]]);
    }
    for (let i = 0; i < before - output.length; i++) {
        output.unshift([...output[0]]);
    }

    for (let k = 0; k < dims; k++) {
        if (top[k]) {
            pressStates.push([0, k]);
            state = flipAdj(0, k, state);
            states.push([...state]);
        }
    }

    const { states: boardStates, presses: presses2 } = chaseLights(
        states,
        dims
    );
    pressStates.push(...presses2);
    pressStates.push(null); // Last state has no next press

    const after = boardStates.length;

    const inputStates = extendBack(input, after);
    const outputStates = extendBack(output, after);

    return {
        boardStates,
        inputStates,
        outputStates,
        pressStates,
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
        pressStates: (number[] | null)[];
    } => {
        const { input, output } = fillRow(row, dims);

        const _inputStates = extendBack(input, rows);
        const outputStates = extendBack(output, rows);

        const states = getStates(outputStates.flat(), dims);

        return states;
    };
}
