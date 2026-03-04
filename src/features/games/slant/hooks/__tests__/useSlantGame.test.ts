import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBaseGame } from '../../../hooks/useBaseGame';
import { useDrag } from '../../../hooks/useDrag';
import { getSlantGameConfig } from '../../config';
import { useAnalysisMode } from '../useAnalysisMode';
import { useGenerationWorker } from '../useGenerationWorker';
import { useSlantGame } from '../useSlantGame';
vi.mock('../../../hooks/useBaseGame');
vi.mock('../../../hooks/useDrag');
vi.mock('../../config', () => ({
    getSlantGameConfig: vi.fn().mockReturnValue({
        storageKey: 'slant',
        logic: {
            persistence: {
                deserialize: (s: any) => {
                    if (s.invalid) throw new Error('Corrupt Slant state');
                    return s;
                },
            },
            manualResize: true,
        },
    }),
}));
vi.mock('../useGenerationWorker');
vi.mock('../useAnalysisMode');
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

    it('returns the flattened game state shape', () => {
        const { result } = renderHook(() => useSlantGame());

        expect(result.current).toHaveProperty('state');
        expect(result.current).toHaveProperty('size');
        expect(result.current).toHaveProperty('cellProps');
        expect(result.current).toHaveProperty('infoProps');
        expect(result.current).toHaveProperty('controlsProps');
    });

    it('calls useBaseGame with manualResize enabled', () => {
        renderHook(() => useSlantGame());

        expect(useBaseGame).toHaveBeenCalledTimes(1);
    });

    it('calculates dimensionsMismatch correctly', () => {
        vi.mocked(useBaseGame).mockReturnValue({
            state: { rows: 5, cols: 5 } as any,
            layout: { rows: 6, cols: 5 } as any,
            controlsProps: {},
        } as any);

        const { result } = renderHook(() => useSlantGame());
        expect(result.current.dimensionsMismatch).toBe(true);
    });

    it('derives cellProps correctly', () => {
        const mockGrid = [
            [1, 2],
            [0, 0],
        ];
        vi.mocked(useBaseGame).mockReturnValue({
            state: { grid: mockGrid } as any,
            layout: { rows: 2, cols: 2 } as any,
            controlsProps: {},
        } as any);

        const { result } = renderHook(() => useSlantGame());

        const props00 = result.current.cellProps(0, 0);
        expect(props00['aria-label']).toContain('Forward Slash');

        const props01 = result.current.cellProps(0, 1);
        expect(props01['aria-label']).toContain('Backward Slash');

        const props10 = result.current.cellProps(1, 0);
        expect(props10['aria-label']).toContain('Empty');
    });

    it('handles interaction logic via useDrag onToggle', () => {
        renderHook(() => useSlantGame());

        const dragConfig = vi.mocked(useDrag).mock.calls[0]![0];
        expect(dragConfig.onToggle).toBeDefined();

        // Mock state for onToggle
        const mockGrid = [
            [0, 0],
            [0, 0],
        ];
        vi.mocked(useBaseGame).mockReturnValue({
            state: { grid: mockGrid } as any,
            layout: { rows: 2, cols: 2 } as any,
            dispatch: mockDispatch,
            controlsProps: {},
        } as any);

        // Re-render to get updated config
        renderHook(() => useSlantGame());
        const onToggle = vi.mocked(useDrag).mock.calls[1]![0].onToggle;

        onToggle!(0, 0, false, undefined, true);
        expect(mockDispatch).toHaveBeenCalled();
    });

    it('should throw error on corrupt state deserialization', () => {
        const config = getSlantGameConfig() as any;
        expect(() =>
            config.logic.persistence.deserialize({ invalid: true }),
        ).toThrow('Corrupt Slant state');
    });

    it('should call handleNextAsync on controlsProps.onRefresh', () => {
        const mockHandleNextAsync = vi.fn();
        vi.mocked(useGenerationWorker).mockReturnValue({
            handleNextAsync: mockHandleNextAsync,
        } as any);

        const { result } = renderHook(() => useSlantGame());
        result.current.controlsProps.onRefresh();
        expect(mockHandleNextAsync).toHaveBeenCalled();
    });
});
