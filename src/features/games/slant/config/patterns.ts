import type { CellState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';

export interface PatternDef {
    title: string;
    description: string;
    rows: number;
    cols: number;
    numbers: (number | null)[][];
    grid: CellState[][];
}

export const PATTERNS: PatternDef[] = [
    {
        title: 'Corner 0',
        description:
            'A "0" in a corner forces the line to point away from that corner.',
        rows: 3,
        cols: 3,
        numbers: [
            [0, null, null],
            [null, null, null],
            [null, null, null],
        ],
        grid: [
            [FORWARD, EMPTY],
            [EMPTY, EMPTY],
        ],
    },
    {
        title: 'Corner 1',
        description:
            'A "1" in a corner forces the line to connect directly to that corner.',
        rows: 3,
        cols: 3,
        numbers: [
            [1, null, null],
            [null, null, null],
            [null, null, null],
        ],
        grid: [
            [BACKWARD, EMPTY],
            [EMPTY, EMPTY],
        ],
    },
    {
        title: 'Edge 0',
        description:
            'A "0" on the edge forces all surrounding lines to point away from it.',
        rows: 3,
        cols: 3,
        numbers: [
            [null, 0, null],
            [null, null, null],
            [null, null, null],
        ],
        grid: [
            [BACKWARD, FORWARD],
            [EMPTY, EMPTY],
        ],
    },
    {
        title: 'Edge 1',
        description:
            'A "1" on the edge forces the two surrounding lines into the same orientation.',
        rows: 3,
        cols: 3,
        numbers: [
            [null, 1, null],
            [null, null, null],
            [null, null, null],
        ],
        grid: [
            [FORWARD, FORWARD],
            [EMPTY, EMPTY],
        ],
    },
    {
        title: 'Edge 2',
        description:
            'A "2" on the edge forces both surrounding lines to connect to it.',
        rows: 3,
        cols: 3,
        numbers: [
            [null, 2, null],
            [null, null, null],
            [null, null, null],
        ],
        grid: [
            [FORWARD, BACKWARD],
            [EMPTY, EMPTY],
        ],
    },
    {
        title: 'Middle 4',
        description: 'A "4" must catch lines from all four surrounding cells.',
        rows: 3,
        cols: 3,
        numbers: [
            [null, null, null],
            [null, 4, null],
            [null, null, null],
        ],
        grid: [
            [BACKWARD, FORWARD],
            [FORWARD, BACKWARD],
        ],
    },
];
