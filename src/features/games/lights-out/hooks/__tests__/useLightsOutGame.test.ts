import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBaseGame } from '../../../hooks/useBaseGame';
import { useDrag } from '../../../hooks/useDrag';
import { useSkipTransition } from '../../../hooks/useSkipTransition';
import { useLightsOutGame } from '../useLightsOutGame';
import { useLightsOutProps } from '../useLightsOutProps';

vi.mock('../../../hooks/useBaseGame');
vi.mock('../../../hooks/useDrag');
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
const mockGetDragProps = vi.fn().mockReturnValue({});

describe('useLightsOutGame', () => {
    beforeEach(() => {
        vi.clearAllMocks();

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

        vi.mocked(useLightsOutProps).mockImplementation(params => ({
            boardProps: params.game as never,
            controlsProps: params.controls as never,
            layoutProps: {} as never,
            infoProps: params.info as never,
            trophyProps: {} as never,
        }));
    });

    it('returns the standard GamePageProps shape', () => {
        const { result } = renderHook(() => useLightsOutGame());

        expect(result.current).toHaveProperty('boardProps');
        expect(result.current).toHaveProperty('controlsProps');
        expect(result.current).toHaveProperty('layoutProps');
        expect(result.current).toHaveProperty('infoProps');
        expect(result.current).toHaveProperty('trophyProps');
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

    it('passes drag interaction props to useLightsOutProps', () => {
        renderHook(() => useLightsOutGame());

        expect(useLightsOutProps).toHaveBeenCalledTimes(1);
        const params = vi.mocked(useLightsOutProps).mock.calls[0]![0];
        expect(params.drag.getDragProps).toBe(mockGetDragProps);
    });

    it('handleApply dispatches multi_adjacent and toggles modal', () => {
        vi.mocked(useLightsOutProps).mockImplementation(params => {
            return {
                boardProps: {} as never,
                controlsProps: {} as never,
                layoutProps: {} as never,
                infoProps: {
                    handleApply: params.info.handleApply,
                } as unknown as never,
                trophyProps: {} as never,
            };
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
        vi.mocked(useLightsOutProps).mockImplementation(params => ({
            boardProps: {} as never,
            controlsProps: {} as never,
            layoutProps: {} as never,
            infoProps: {
                handleApply: params.info.handleApply,
            } as unknown as never,
            trophyProps: {} as never,
        }));

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
