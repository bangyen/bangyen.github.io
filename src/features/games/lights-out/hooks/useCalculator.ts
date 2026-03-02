import type React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { useDrag } from '../../hooks/useDrag';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import type { Palette } from '../types';
import { getInput, useHandler } from '../utils/calculatorHelpers';

import { calculateSolutionVector } from '@/utils/math/gf2';

interface UseCalculatorParams {
    rows: number;
    cols: number;
    palette: Palette;
    solved: boolean;
}

/**
 * Encapsulates the Lights Out calculator state: the user-entered bottom-row
 * pattern, the computed top-row solution, and the drag interaction that lets
 * users toggle individual cells.  Extracted from `Info` so the component can
 * focus purely on presentation while this hook owns the logic.
 */
export function useCalculator({
    rows,
    cols,
    palette,
    solved,
}: UseCalculatorParams) {
    const [calcRow, setCalcRow] = useState<number[]>(new Array(cols).fill(0));

    useEffect(() => {
        setCalcRow(new Array(cols).fill(0));
    }, [cols, palette]);

    // Clear the calculator when the board is solved.
    useEffect(() => {
        if (solved) {
            setCalcRow(new Array(cols).fill(0));
        }
    }, [solved, cols]);

    const res =
        calculateSolutionVector(calcRow, rows, cols) ??
        new Array<number>(cols).fill(0);

    const { handleKeyDown: handleGridNav } = useGridNavigation({
        rows: 1,
        cols,
    });

    const { getDragProps } = useDrag({
        onToggle: (_r: number, c: number) => {
            setCalcRow(prev => {
                const next = [...prev];
                if (next[c] !== undefined) {
                    next[c] ^= 1;
                }
                return next;
            });
        },
        checkEnabled: () => true,
    });

    const getEnhancedDragProps = useCallback(
        (pos: string) => {
            const dragProps = getDragProps(pos);
            return {
                ...dragProps,
                onKeyDown: (e: React.KeyboardEvent) => {
                    dragProps.onKeyDown(e);
                    handleGridNav(e);
                },
            };
        },
        [getDragProps, handleGridNav],
    );

    const inputGetters = useHandler(calcRow, cols, palette);
    const inputProps = getInput(inputGetters, getEnhancedDragProps);

    const handleSetRow = useCallback((row: number[]) => {
        setCalcRow(row);
    }, []);

    return {
        inputProps,
        handleSetRow,
        res,
        inputGrid: [calcRow],
        outputGrid: [res],
        hasPattern: res.some((v: number) => v !== 0),
    };
}
