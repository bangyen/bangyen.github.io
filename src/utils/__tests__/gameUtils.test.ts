import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import {
    getPosKey,
    createGameReducer,
    useCellFactory,
    type BaseGameAction,
} from '../gameUtils';

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
            board: Array.from({ length: rows }, () => new Array(cols).fill(0)),
        });

        const reducer = createGameReducer<GameState, { type: 'custom' }>({
            getInitialState,
            customHandler: (state, action) => {
                if (action.type === 'custom') {
                    return { ...state, board: [[1]] };
                }
                return null;
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
            const next = reducer(state, { type: 'unknown' } as unknown as {
                type: 'custom';
            });
            expect(next).toBe(state);
        });
    });

    describe('useCellFactory', () => {
        it('should return memoized cell factory', () => {
            const getDragProps = vi.fn().mockReturnValue({ drag: true });
            const factory = vi
                .fn()
                .mockReturnValue((r: number, c: number) => ({ r, c }));

            const { result, rerender } = renderHook(
                ({ deps }) =>
                    useCellFactory(factory, getDragProps, deps as unknown[]),
                {
                    initialProps: { deps: [1] },
                },
            );

            expect(result.current(0, 0)).toEqual({ r: 0, c: 0 });
            // May be called twice if React 18 Strict Mode is active in test env
            const initialCalls = factory.mock.calls.length;

            // Rerender with a NEW array containing the same value -- the
            // spread-based dep list should still treat this as stable.
            rerender({ deps: [1] });
            expect(factory).toHaveBeenCalledTimes(initialCalls);

            // Rerender with different deps value
            rerender({ deps: [2] });
            expect(factory.mock.calls.length).toBeGreaterThan(initialCalls);
        });
    });

    describe('createGameReducer - edge cases', () => {
        it('should handle partial resize properties', () => {
            const getInitialState = (rows: number, cols: number) => ({
                rows,
                cols,
            });
            const reducer = createGameReducer({ getInitialState });
            const state = { rows: 5, cols: 5 };

            expect(
                reducer(state, { type: 'resize', rows: 3 } as BaseGameAction<{
                    rows: number;
                    cols: number;
                }>),
            ).toEqual({
                rows: 3,
                cols: 5,
            });
            expect(
                reducer(state, { type: 'resize', cols: 3 } as BaseGameAction<{
                    rows: number;
                    cols: number;
                }>),
            ).toEqual({
                rows: 5,
                cols: 3,
            });
        });

        it('should return state for resize without props', () => {
            const reducer = createGameReducer({
                getInitialState: (r, c) => ({ rows: r, cols: c }),
            });
            const state = { rows: 5, cols: 5 };
            expect(
                reducer(state, { type: 'resize' } as BaseGameAction<{
                    rows: number;
                    cols: number;
                }>),
            ).toBe(state);
        });

        it('should return state for restore/hydrate without state prop', () => {
            const reducer = createGameReducer({
                getInitialState: (r, c) => ({ rows: r, cols: c }),
            });
            const state = { rows: 5, cols: 5 };
            // Intentionally pass restore without state to test defensive handling
            expect(
                reducer(state, {
                    type: 'restore',
                } as unknown as BaseGameAction<{
                    rows: number;
                    cols: number;
                }>),
            ).toBe(state);
        });

        it('should work without customHandler', () => {
            const reducer = createGameReducer({
                getInitialState: (r, c) => ({ rows: r, cols: c }),
            });
            const state = { rows: 5, cols: 5 };
            expect(reducer(state, { type: 'new' })).toEqual(state);
        });
    });
});
