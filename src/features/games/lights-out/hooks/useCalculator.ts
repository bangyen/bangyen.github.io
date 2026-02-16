import { useState, useEffect, useCallback } from 'react';

import { useDrag } from '../../hooks/useDrag';
import { getInput, getOutput, useHandler } from '../components/Calculator';
import type { Palette } from '../types';
import { getProduct } from '../utils';

interface UseCalculatorParams {
    rows: number;
    cols: number;
    palette: Palette;
}

/**
 * Encapsulates the Lights Out calculator state: the user-entered bottom-row
 * pattern, the computed top-row solution, and the drag interaction that lets
 * users toggle individual cells.  Extracted from `Info` so the component can
 * focus purely on presentation while this hook owns the logic.
 */
export function useCalculator({ rows, cols, palette }: UseCalculatorParams) {
    const [calcRow, setCalcRow] = useState<number[]>(new Array(cols).fill(0));

    useEffect(() => {
        setCalcRow(new Array(cols).fill(0));
    }, [cols, palette]);

    const toggleTile = useCallback(
        (colAttr: string) => {
            const col = Number.parseInt(colAttr, 10);
            setCalcRow(prev => {
                const next = [...prev];
                if (next[col] !== undefined) {
                    next[col] ^= 1;
                }
                return next;
            });
        },
        [setCalcRow],
    );

    const res = getProduct(calcRow, rows, cols);

    const { getDragProps } = useDrag({
        onAction: toggleTile,
        checkEnabled: () => true,
        posAttribute: 'data-col',
    });

    const inputGetters = useHandler(calcRow, cols, palette);
    const outputGetters = useHandler(res, cols, palette);
    const inputProps = getInput(inputGetters, getDragProps);
    const outputProps = getOutput(outputGetters);

    const handleReset = useCallback(() => {
        setCalcRow(new Array(cols).fill(0));
    }, [cols]);

    return {
        inputProps,
        outputProps,
        handleReset,
        res,
        hasPattern: res.some(v => v !== 0),
    };
}
