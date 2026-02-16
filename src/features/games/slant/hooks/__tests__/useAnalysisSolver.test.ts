import { renderHook, act } from '@testing-library/react';

import type { CellState } from '../../types';
import { FORWARD } from '../../types';
import type { CellInfo, Conflict } from '../../utils/analysisSolver';
import type { SolverMessage } from '../../workers/solverWorker';
import { useAnalysisSolver } from '../useAnalysisSolver';

// Mock slant-wasm before any module that transitively imports it.
vi.mock('slant-wasm', () => ({
    __esModule: true,
    default: vi.fn().mockResolvedValue(undefined),
    generate_puzzle_wasm: vi.fn(),
    find_cycles_wasm: vi.fn(),
}));

let latestWorkerInstance: MockWorker | null = null;

class MockWorker {
    onmessage: ((msg: { data: SolverMessage }) => void) | null = null;
    onerror: ((ev: unknown) => void) | null = null;
    terminated = false;
    messages: SolverMessage[] = [];

    postMessage(msg: SolverMessage) {
        this.messages.push(msg);
    }

    terminate() {
        this.terminated = true;
    }

    /** Simulate worker sending back a RESULT message. */
    simulateResult(payload: {
        gridState: Map<string, CellInfo>;
        conflicts: Conflict[];
        cycleCells: Set<string>;
    }) {
        this.onmessage?.({
            data: { type: 'RESULT', payload } as SolverMessage,
        });
    }

    /** Simulate a worker error event. */
    simulateError() {
        this.onerror?.(new ErrorEvent('error'));
    }
}

vi.mock('../../utils/workerUtils', () => ({
    createWorker: () => {
        const w = new MockWorker();
        latestWorkerInstance = w;
        return w;
    },
}));

const solveAnalysisConstraintsMock = vi.fn().mockReturnValue({
    gridState: new Map<string, CellInfo>(),
    conflicts: [] as Conflict[],
    cycleCells: new Set<string>(),
});

vi.mock('../../utils/analysisSolver', () => ({
    solveAnalysisConstraints: (...args: unknown[]) =>
        solveAnalysisConstraintsMock(...args),
}));

const emptyNumbers: (number | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

describe('useAnalysisSolver', () => {
    beforeEach(() => {
        latestWorkerInstance = null;
        solveAnalysisConstraintsMock.mockClear();
    });

    it('boots a worker and probes it on mount', () => {
        renderHook(() =>
            useAnalysisSolver({
                rows: 2,
                cols: 2,
                numbers: emptyNumbers,
                userMoves: new Map(),
            }),
        );

        expect(latestWorkerInstance).not.toBeNull();
        expect(latestWorkerInstance!.messages).toHaveLength(1);
        expect(latestWorkerInstance!.messages[0]).toMatchObject({
            type: 'SOLVE',
        });
    });

    it('dispatches a real solve after probe succeeds', () => {
        const userMoves = new Map<string, CellState>([['0,0', FORWARD]]);
        const { result } = renderHook(() =>
            useAnalysisSolver({
                rows: 2,
                cols: 2,
                numbers: emptyNumbers,
                userMoves,
            }),
        );

        const worker = latestWorkerInstance!;

        // Answer the probe — first message is the probe.
        act(() => {
            worker.simulateResult({
                gridState: new Map(),
                conflicts: [],
                cycleCells: new Set(),
            });
        });

        // After probe, the solve effect should fire, sending a second message.
        expect(worker.messages).toHaveLength(2);

        // Now simulate the real solve result.
        const expectedGrid = new Map<string, CellInfo>([
            ['0,0', { state: FORWARD, source: 'user' }],
        ]);

        act(() => {
            worker.simulateResult({
                gridState: expectedGrid,
                conflicts: [],
                cycleCells: new Set(),
            });
        });

        expect(result.current.gridState.get('0,0')).toEqual({
            state: FORWARD,
            source: 'user',
        });
    });

    it('falls back to main-thread solving when worker probe times out', () => {
        vi.useFakeTimers();

        renderHook(() =>
            useAnalysisSolver({
                rows: 2,
                cols: 2,
                numbers: emptyNumbers,
                userMoves: new Map(),
            }),
        );

        // Advance past the 2s probe timeout.
        act(() => {
            vi.advanceTimersByTime(2100);
        });

        // The fallback should invoke solveAnalysisConstraints on the main thread.
        expect(solveAnalysisConstraintsMock).toHaveBeenCalled();
        expect(latestWorkerInstance!.terminated).toBe(true);

        vi.useRealTimers();
    });

    it('falls back when worker fires onerror', () => {
        renderHook(() =>
            useAnalysisSolver({
                rows: 2,
                cols: 2,
                numbers: emptyNumbers,
                userMoves: new Map(),
            }),
        );

        act(() => {
            latestWorkerInstance!.simulateError();
        });

        expect(solveAnalysisConstraintsMock).toHaveBeenCalled();
        expect(latestWorkerInstance!.terminated).toBe(true);
    });

    it('terminates the worker on unmount', () => {
        const { unmount } = renderHook(() =>
            useAnalysisSolver({
                rows: 2,
                cols: 2,
                numbers: emptyNumbers,
                userMoves: new Map(),
            }),
        );

        const worker = latestWorkerInstance!;
        expect(worker.terminated).toBe(false);

        unmount();
        expect(worker.terminated).toBe(true);
    });
});
