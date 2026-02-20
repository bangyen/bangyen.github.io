import React from 'react';

import { AnalysisHint } from './AnalysisHint';
import { EMPTY, FORWARD, BACKWARD } from '../types';
import type { CellInfo } from '../utils/analysisSolver';

import { getPosKey } from '@/utils/gameUtils';

interface AnalysisGridHintProps {
    r: number;
    c: number;
    numbers: (number | null)[][];
    gridState: Map<string, CellInfo>;
    rows: number;
    cols: number;
    nodeConflictSet: Set<string>;
    numberSize: number;
}

export function AnalysisGridHint({
    r,
    c,
    numbers,
    gridState,
    rows,
    cols,
    nodeConflictSet,
    numberSize,
}: AnalysisGridHintProps) {
    const value = numbers[r]?.[c];
    const hasConflict = nodeConflictSet.has(getPosKey(r, c));

    let connected = 0;
    let filledNeighbors = 0;
    const neighbors = [
        { r: r - 1, c: c - 1, required: BACKWARD }, // TL
        { r: r - 1, c, required: FORWARD }, // TR
        { r, c: c - 1, required: FORWARD }, // BL
        { r, c, required: BACKWARD }, // BR
    ];

    for (const nb of neighbors) {
        if (nb.r >= 0 && nb.r < rows && nb.c >= 0 && nb.c < cols) {
            const cell = gridState.get(getPosKey(nb.r, nb.c));
            if (cell && cell.state !== EMPTY) {
                filledNeighbors++;
                if (cell.state === nb.required) {
                    connected++;
                }
            }
        }
    }

    const isSatisfied =
        value != null && connected === value && filledNeighbors > 0;

    return (
        <div
            data-pos={getPosKey(r, c)}
            data-type="hint"
            style={{
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <AnalysisHint
                value={value ?? null}
                hasConflict={hasConflict}
                isSatisfied={isSatisfied}
                numberSize={numberSize}
            />
        </div>
    );
}
