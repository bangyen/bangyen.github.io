import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBaseGame } from '../../../hooks/useBaseGame';
import { useDrag } from '../../../hooks/useDrag';
import { useGridNavigation } from '../../../hooks/useGridNavigation';
import { useSkipTransition } from '../../../hooks/useSkipTransition';
import { useLightsOutGame } from '../useLightsOutGame';
import { useLightsOutProps } from '../useLightsOutProps';

vi.mock('../../../hooks/useBaseGame');
vi.mock('../../../hooks/useDrag');
vi.mock('../../../hooks/useGridNavigation');
vi.mock('../../../hooks/useSkipTransition');
vi.mock('../useLightsOutProps');
vi.mock('@/hooks', () => ({
    useDisclosure: vi.fn().mockReturnValue({
        isOpen: false,
        toggle: vi.fn(),
    }),
    useMobile: vi.fn().mockReturnValue(false),
}));

const mockDispatch = vi.fn();
const mockDragOnKeyDown = vi.fn();
const mockGetDragProps = vi
    .fn()
    .mockReturnValue({ onKeyDown: mockDragOnKeyDown });
const mockHandleGridNav = vi.fn();

describe('useLightsOutGame', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useGridNavigation).mockReturnValue({
            handleKeyDown: mockHandleGridNav,
        });

        vi.mocked(useBaseGame).mockReturnValue({
            rows: 5,
            cols: 5,
            state: {
                grid: [0, 0, 0, 0, 0],
                score: 0,
                rows: 5,
                cols: 5,
                initialized: true,
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

        vi.mocked(useDrag).mockReturnValue({
            isDragging: false,
            draggingButton: null,
            getDragProps: mockGetDragProps,
            lastTouchTime: { current: 0 } as React.RefObject<number>,
        });

        vi.mocked(useSkipTransition).mockReturnValue(false);

        vi.mocked(useLightsOutProps).mockImplementation(
            params =>
                ({
                    boardProps: params.game as never,
                    layoutProps: {} as never,
                    infoProps: params.info as never,
                }) as any,
        );
    });

    it('returns the standard GamePageProps shape', () => {
        const { result } = renderHook(() => useLightsOutGame());

        expect(result.current).toHaveProperty('boardProps');
        expect(result.current).toHaveProperty('layoutProps');
        expect(result.current).toHaveProperty('infoProps');
        expect(result.current).toHaveProperty('gameState');
    });

    it('calls useBaseGame with a valid config', () => {
        renderHook(() => useLightsOutGame());

        expect(useBaseGame).toHaveBeenCalledTimes(1);
        const config = vi.mocked(useBaseGame).mock.calls[0]![0];
        expect(config).toHaveProperty('storageKey');
        expect(config).toHaveProperty('logic');
        expect(config.logic).toHaveProperty('reducer');
        expect(config.logic).toHaveProperty('getInitialState');
        expect(config.logic).toHaveProperty('isSolved');
    });

    it('passes enhanced drag props with grid navigation to useLightsOutProps', () => {
        renderHook(() => useLightsOutGame());

        expect(useLightsOutProps).toHaveBeenCalledTimes(1);
        const params = vi.mocked(useLightsOutProps).mock.calls[0]![0];
        // getDragProps is now wrapped, not the bare mock
        expect(params.drag.getDragProps).not.toBe(mockGetDragProps);
        expect(typeof params.drag.getDragProps).toBe('function');
    });

    it('enhanced onKeyDown invokes both drag and grid navigation handlers', () => {
        renderHook(() => useLightsOutGame());

        const params = vi.mocked(useLightsOutProps).mock.calls[0]![0];
        const enhanced = params.drag.getDragProps('0,0');
        const fakeEvent = { key: 'ArrowRight' } as React.KeyboardEvent;

        enhanced.onKeyDown(fakeEvent);

        expect(mockDragOnKeyDown).toHaveBeenCalledWith(fakeEvent);
        expect(mockHandleGridNav).toHaveBeenCalledWith(fakeEvent);
    });

    it('calls useGridNavigation with correct dimensions', () => {
        renderHook(() => useLightsOutGame());

        expect(useGridNavigation).toHaveBeenCalledWith({ rows: 5, cols: 5 });
    });

    it('handleApply dispatches multi_adjacent and toggles modal', () => {
        vi.mocked(useLightsOutProps).mockImplementation(params => {
            return {
                boardProps: {} as never,
                layoutProps: {} as never,
                infoProps: {
                    handleApply: params.info.handleApply,
                } as unknown as never,
            } as any;
        });

        const { result } = renderHook(() => useLightsOutGame());

        act(() => {
            (
                result.current.infoProps as unknown as {
                    handleApply: (s: number[]) => void;
                }
            ).handleApply([1, 0, 1, 0, 0]);
        });

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'multi_adjacent',
            moves: expect.arrayContaining([
                expect.objectContaining({ row: 0, col: 0 }),
                expect.objectContaining({ row: 0, col: 2 }),
            ]),
        });
    });

    it('does not dispatch when solution has no active columns', () => {
        vi.mocked(useLightsOutProps).mockImplementation(
            params =>
                ({
                    boardProps: {} as never,
                    layoutProps: {} as never,
                    infoProps: {
                        handleApply: params.info.handleApply,
                    } as unknown as never,
                }) as any,
        );

        const { result } = renderHook(() => useLightsOutGame());

        act(() => {
            (
                result.current.infoProps as unknown as {
                    handleApply: (s: number[]) => void;
                }
            ).handleApply([0, 0, 0]);
        });

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
