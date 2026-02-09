import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { getPosKey, createGameReducer, useCellFactory } from '../gameUtils';

describe('gameUtils', () => {
    describe('getPosKey', () => {
        it('should return correct key for given coordinates', () => {
            expect(getPosKey(0, 0)).toBe('0,0');
            expect(getPosKey(10, 20)).toBe('10,20');
        });
    });

    describe('createGameReducer', () => {
        interface GameState {
            rows: number;
            cols: number;
            board: number[][];
        }

        const getInitialState = (rows: number, cols: number): GameState => ({
            rows,
            cols,
            board: Array.from({ length: rows }, () => Array(cols).fill(0)),
        });

        const reducer = createGameReducer<GameState, { type: 'custom' }>({
            getInitialState,
            customHandler: (state, action) => {
                if (action.type === 'custom') {
                    return { ...state, board: [[1]] };
                }
                return state;
            },
        });

        it('should handle custom actions via customHandler', () => {
            const state = getInitialState(5, 5);
            const next = reducer(state, { type: 'custom' });
            expect(next.board[0]?.[0]).toBe(1);
        });

        it('should handle resize action', () => {
            const state = getInitialState(5, 5);
            const next = reducer(state, {
                type: 'resize',
                newRows: 3,
                newCols: 3,
            });
            expect(next.rows).toBe(3);
            expect(next.cols).toBe(3);
            expect(next.board).toHaveLength(3);
        });

        it('should handle new/next/reset actions', () => {
            const state = getInitialState(5, 5);
            const next = reducer(state, { type: 'new' });
            expect(next).toEqual(getInitialState(5, 5));
        });

        it('should handle restore/hydrate actions', () => {
            const state = getInitialState(5, 5);
            const savedState = getInitialState(2, 2);
            const next = reducer(state, { type: 'restore', state: savedState });
            expect(next).toBe(savedState);
        });

        it('should return current state for unknown actions', () => {
            const state = getInitialState(5, 5);
            const next = reducer(state, { type: 'unknown' } as any);
            expect(next).toBe(state);
        });
    });

    describe('useCellFactory', () => {
        it('should return memoized cell factory', () => {
            const getDragProps = vi.fn().mockReturnValue({ drag: true });
            const factory = vi
                .fn()
                .mockReturnValue((r: number, c: number) => ({ r, c }));

            const d1 = [1];
            const { result, rerender } = renderHook(
                ({ deps }) => useCellFactory(factory, getDragProps, deps),
                {
                    initialProps: { deps: d1 as any[] },
                }
            );

            expect(result.current(0, 0)).toEqual({ r: 0, c: 0 });
            // May be called twice if React 18 Strict Mode is active in test env
            const initialCalls = factory.mock.calls.length;

            // Rerender with same deps instance
            rerender({ deps: d1 });
            expect(factory).toHaveBeenCalledTimes(initialCalls);

            // Rerender with different deps
            rerender({ deps: [2] });
            expect(factory).toHaveBeenCalledTimes(2);
        });
    });
});
