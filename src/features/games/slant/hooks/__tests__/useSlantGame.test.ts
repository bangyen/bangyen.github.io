import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBaseGame } from '../../../hooks/useBaseGame';
import { useDrag } from '../../../hooks/useDrag';
import { useAnalysisMode } from '../useAnalysisMode';
import { useGenerationWorker } from '../useGenerationWorker';
import { useSlantGame } from '../useSlantGame';
vi.mock('../../../hooks/useBaseGame');
vi.mock('../../../hooks/useDrag');
vi.mock('../../config', () => ({
    getSlantGameConfig: vi.fn().mockReturnValue({ storageKey: 'slant' }),
}));
vi.mock('../useGenerationWorker');
vi.mock('../useAnalysisMode');
vi.mock('../useSlantBoard', () => ({
    useSlantBoard: vi.fn().mockReturnValue({
        cellProps: {},
        overlayProps: {},
    }),
}));
vi.mock('@/hooks', () => ({
    useMobile: vi.fn().mockReturnValue(false),
    useDebouncedEffect: vi.fn(),
}));

const mockDispatch = vi.fn();
const mockGetDragProps = vi.fn().mockReturnValue({});

describe('useSlantGame', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useBaseGame).mockReturnValue({
            state: {
                grid: [],
                numbers: [],
                solution: [],
                rows: 5,
                cols: 5,
                solved: false,
                errorNodes: new Set<string>(),
                cycleCells: new Set<string>(),
                satisfiedNodes: new Set<string>(),
            } as never,
            dispatch: mockDispatch,
            solved: false,
            handleNext: vi.fn(),
            layout: {
                rows: 5,
                cols: 5,
                size: 3,
                mobile: false,
                scaling: {
                    iconSize: '3rem',
                    containerSize: '9rem',
                    padding: 2,
                },
            },
            controlsProps: {
                rows: 5,
                cols: 5,
                dynamicSize: { rows: 10, cols: 10 },
                minSize: 3,
                maxSize: 10,
                handlePlus: vi.fn(),
                handleMinus: vi.fn(),
                onRefresh: vi.fn(),
            },
        } as any);

        vi.mocked(useGenerationWorker).mockReturnValue({
            generating: false,
            requestGeneration: vi.fn(),
            handleNextAsync: vi.fn(),
            prefetch: vi.fn(),
            cancelGeneration: vi.fn(),
        } as any);

        vi.mocked(useAnalysisMode).mockReturnValue({
            analysisMoves: new Map(),
            boardSx: undefined,
            handleAnalysisMove: vi.fn(),
            handleAnalysisCopy: vi.fn(),
            handleAnalysisClear: vi.fn(),
            handleAnalysisClose: vi.fn(),
            handleAnalysisApply: vi.fn(),
            handleBoxClick: vi.fn(),
            handleOpenAnalysis: vi.fn(),
        } as any);

        vi.mocked(useDrag).mockReturnValue({
            isDragging: false,
            draggingButton: null,
            getDragProps: mockGetDragProps,
            lastTouchTime: { current: 0 } as React.RefObject<number>,
        } as any);
    });

    it('returns the standard GamePageProps shape', () => {
        const { result } = renderHook(() => useSlantGame());

        expect(result.current).toHaveProperty('boardProps');
        expect(result.current).toHaveProperty('layoutProps');
        expect(result.current).toHaveProperty('infoProps');
        expect(result.current).toHaveProperty('gameState');
    });

    it('calls useBaseGame with manualResize enabled', () => {
        renderHook(() => useSlantGame());

        expect(useBaseGame).toHaveBeenCalledTimes(1);
        const config = vi.mocked(useBaseGame).mock.calls[0]![0];
        expect(config.logic.manualResize).toBe(true);
    });

    it('wires up correctly returned props', () => {
        const { result } = renderHook(() => useSlantGame());

        expect(result.current.boardProps).toBeDefined();
        expect(result.current.layoutProps).toBeDefined();
    });

    it('wires up generation worker with correct config', () => {
        renderHook(() => useSlantGame());

        expect(useGenerationWorker).toHaveBeenCalledWith(
            expect.objectContaining({
                rows: 5,
                cols: 5,
                isAnalysisMode: false,
            }),
        );
    });

    it('passes generation worker handle to gameState', () => {
        const mockHandleNextAsync = vi.fn();
        vi.mocked(useGenerationWorker).mockReturnValue({
            generating: true,
            requestGeneration: vi.fn(),
            handleNextAsync: mockHandleNextAsync,
            prefetch: vi.fn(),
            cancelGeneration: vi.fn(),
        } as any);

        const { result } = renderHook(() => useSlantGame());

        expect(result.current.boardProps.generating).toBe(true);
        expect(result.current.gameState.controlsProps.onRefresh).toBeDefined();
    });
});
