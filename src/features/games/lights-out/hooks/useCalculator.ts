import type React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { useDrag } from '../../hooks/useDrag';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { getInput, getOutput, useHandler } from '../components/Calculator';
import type { Palette } from '../types';

import { getProduct } from '@/utils/math/gf2';

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

    const res = getProduct(calcRow, rows, cols);

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
    const outputGetters = useHandler(res, cols, palette);
    const inputProps = getInput(inputGetters, getEnhancedDragProps);
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
