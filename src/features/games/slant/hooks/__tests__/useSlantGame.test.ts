import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBaseGame } from '../../../hooks/useBaseGame';
import { useDrag } from '../../../hooks/useDrag';
import { useDimensionRegeneration } from '../useDimensionRegeneration';
import { useGenerationWorker } from '../useGenerationWorker';
import { useGhostMode } from '../useGhostMode';
import { useSlantGame } from '../useSlantGame';
import { useSlantProps } from '../useSlantProps';

vi.mock('../../../hooks/useBaseGame');
vi.mock('../../../hooks/useDrag');
vi.mock('../useSlantProps');
vi.mock('../useGenerationWorker');
vi.mock('../useGhostMode');
vi.mock('../useDimensionRegeneration');
vi.mock('@/hooks', () => ({
    useDisclosure: vi.fn().mockReturnValue({
        isOpen: false,
        toggle: vi.fn(),
    }),
    useMobile: vi.fn().mockReturnValue(false),
}));

const mockDispatch = vi.fn();
const mockGetDragProps = vi.fn().mockReturnValue({});

describe('useSlantGame', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useBaseGame).mockReturnValue({
            rows: 5,
            cols: 5,
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
            size: 3,
            mobile: false,
            solved: false,
            handleNext: vi.fn(),
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
        });

        vi.mocked(useGenerationWorker).mockReturnValue({
            generating: false,
            requestGeneration: vi.fn(),
            handleNextAsync: vi.fn(),
            prefetch: vi.fn(),
            cancelGeneration: vi.fn(),
        });

        vi.mocked(useGhostMode).mockReturnValue({
            ghostMoves: new Map(),
            boardSx: undefined,
            handleGhostMove: vi.fn(),
            handleGhostCopy: vi.fn(),
            handleGhostClear: vi.fn(),
            handleGhostClose: vi.fn(),
            handleBoxClick: vi.fn(),
            handleOpenCalculator: vi.fn(),
        });

        vi.mocked(useDrag).mockReturnValue({
            isDragging: false,
            draggingButton: null,
            getDragProps: mockGetDragProps,
            lastTouchTime: { current: 0 } as React.RefObject<number>,
        });

        vi.mocked(useDimensionRegeneration).mockReturnValue(undefined);

        vi.mocked(useSlantProps).mockImplementation(params => ({
            boardProps: params.game as never,
            controlsProps: params.controls as never,
            layoutProps: {} as never,
            infoProps: params.info as never,
            trophyProps: {} as never,
        }));
    });

    it('returns the standard GamePageProps shape', () => {
        const { result } = renderHook(() => useSlantGame());

        expect(result.current).toHaveProperty('boardProps');
        expect(result.current).toHaveProperty('controlsProps');
        expect(result.current).toHaveProperty('layoutProps');
        expect(result.current).toHaveProperty('infoProps');
        expect(result.current).toHaveProperty('trophyProps');
    });

    it('calls useBaseGame with manualResize enabled', () => {
        renderHook(() => useSlantGame());

        expect(useBaseGame).toHaveBeenCalledTimes(1);
        const config = vi.mocked(useBaseGame).mock.calls[0]![0];
        expect(config.logic.manualResize).toBe(true);
    });

    it('passes ghost-mode handlers to useSlantProps', () => {
        renderHook(() => useSlantGame());

        expect(useSlantProps).toHaveBeenCalledTimes(1);
        const params = vi.mocked(useSlantProps).mock.calls[0]![0];
        expect(params.ghost).toHaveProperty('ghostMoves');
        expect(params.ghost).toHaveProperty('handleGhostMove');
        expect(params.ghost).toHaveProperty('handleGhostCopy');
    });

    it('wires up dimension regeneration', () => {
        renderHook(() => useSlantGame());

        expect(useDimensionRegeneration).toHaveBeenCalledWith(
            expect.objectContaining({
                rows: 5,
                cols: 5,
                isGhostMode: false,
            }),
        );
    });

    it('passes generation worker handle to controlsProps via useSlantProps', () => {
        const mockHandleNextAsync = vi.fn();
        vi.mocked(useGenerationWorker).mockReturnValue({
            generating: true,
            requestGeneration: vi.fn(),
            handleNextAsync: mockHandleNextAsync,
            prefetch: vi.fn(),
            cancelGeneration: vi.fn(),
        });

        renderHook(() => useSlantGame());

        const params = vi.mocked(useSlantProps).mock.calls[0]![0];
        expect(params.game.generating).toBe(true);
        expect(params.game.handleNextAsync).toBe(mockHandleNextAsync);
    });
});
